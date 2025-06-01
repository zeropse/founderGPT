export async function POST(req) {
  try {
    const { idea, isPremium } = await req.json();

    // Validate required input
    if (!idea || idea.trim() === '') {
      return Response.json(
        { error: 'Idea is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('Missing required environment variable: OPENROUTER_API_KEY');
    }

    // Helper function to make OpenRouter API calls
    async function callOpenRouter(prompt) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://localhost:3000', // Replace with your actual domain in production
          'X-Title': 'Idea Validator App'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an expert product discovery assistant. You help founders clarify, validate, and break down SaaS/app ideas using industry-standard workflows.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        console.error('API Response Status:', response.status);
        console.error('API Response Headers:', Object.fromEntries(response.headers.entries()));
        
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Data:', errorData);
        
        if (errorData.error?.code === 'insufficient_quota') {
          throw new Error('API quota exceeded. Please check your account billing and usage details.');
        }

        if (response.status === 429) {
          throw new Error('Too many requests. Please try again in a few moments.');
        }

        const errorMessage = errorData.error?.message || 
                           errorData.message || 
                           errorData.detail ||
                           errorData.errors?.[0]?.message ||
                           (typeof errorData.error === 'string' ? errorData.error : null) ||
                           JSON.stringify(errorData) ||
                           `HTTP ${response.status}: ${response.statusText}`;

        throw new Error(`API Error: ${errorMessage}`);
      }

      const data = await response.json();
      
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response format: Missing required fields');
      }

      return data.choices[0].message.content.trim();
    }

    // Base prompt for idea enhancement
    const enhancedIdea = await callOpenRouter(
      `Refine and rewrite this product idea for clarity and impact:\n${idea}`
    );

    const results = {
      enhancedIdea,
      marketValidation: null,
      mvpFeatures: null,
      techStack: null,
      monetization: null,
      landingPage: null,
      userPersonas: null,
    };

    if (isPremium && enhancedIdea) {
      try {
        // Run premium prompts in parallel for better performance
        const [
          marketValidation,
          mvpFeatures,
          techStack,
          monetization,
          landingPage,
          userPersonas,
        ] = await Promise.all([
          callOpenRouter(
            `Analyze the following SaaS/app idea for market fit, uniqueness, and potential competitors. Output in bullet format.\nIdea: ${enhancedIdea}`
          ),
          callOpenRouter(
            `List 5 core MVP features that would make the idea functional but lean. Format as numbered list.\nIdea: ${enhancedIdea}`
          ),
          callOpenRouter(
            `Suggest the most suitable tech stack for building the MVP. Format as:
Frontend: [technology]
Backend: [technology]
Database: [technology]
Hosting: [technology]

Idea: ${enhancedIdea}`
          ),
          callOpenRouter(
            `Recommend realistic monetization strategies for a bootstrapped solo founder launching this product. Format as bullet points.\nIdea: ${enhancedIdea}`
          ),
          callOpenRouter(
            `Create landing page copy for this product. Format exactly as:
Headline: [compelling headline]
Subheading: [descriptive subheading]
CTA: [call to action button text]
Benefit 1: [first key benefit]
Benefit 2: [second key benefit]
Benefit 3: [third key benefit]

Idea: ${enhancedIdea}`
          ),
          callOpenRouter(
            `Define 3 potential user personas for this product. Format exactly as:

1. [Persona Name]
Pain Points: [their main challenges]
Goals: [what they want to achieve]
Solution: [how the product helps them]

2. [Persona Name]
Pain Points: [their main challenges]
Goals: [what they want to achieve]
Solution: [how the product helps them]

3. [Persona Name]
Pain Points: [their main challenges]
Goals: [what they want to achieve]
Solution: [how the product helps them]

Idea: ${enhancedIdea}`
          ),
        ]);

        // Parse and format the results
        results.marketValidation = marketValidation 
          ? marketValidation.split('\n').filter(line => line.trim() !== '').map(line => line.trim())
          : [];

        results.mvpFeatures = mvpFeatures 
          ? mvpFeatures.split('\n').filter(line => line.trim() !== '').map(line => line.trim())
          : [];
        
        if (techStack) {
          const techStackLines = techStack.split('\n').map(line => line.trim());
          results.techStack = {
            frontend: extractField(techStackLines, 'frontend') || 'Not specified',
            backend: extractField(techStackLines, 'backend') || 'Not specified',
            database: extractField(techStackLines, 'database') || 'Not specified',
            hosting: extractField(techStackLines, 'hosting') || 'Not specified',
          };
        }

        results.monetization = monetization 
          ? monetization.split('\n').filter(line => line.trim() !== '').map(line => line.trim())
          : [];

        if (landingPage) {
          const landingPageLines = landingPage.split('\n').map(line => line.trim()).filter(line => line !== '');
          results.landingPage = {
            headline: extractField(landingPageLines, 'headline') || 'Not specified',
            subheading: extractField(landingPageLines, 'subheading') || 'Not specified',
            cta: extractField(landingPageLines, 'cta') || 'Get Started',
            benefits: landingPageLines
              .filter(line => line.toLowerCase().startsWith('benefit'))
              .map(line => line.replace(/^benefit \d+:\s*/i, '').trim())
              .filter(benefit => benefit !== '')
          };
        }

        if (userPersonas) {
          const personaSections = userPersonas.split(/\d+\.\s/).filter(section => section.trim() !== '');
          results.userPersonas = personaSections.map(section => {
            const lines = section.split('\n').map(line => line.trim()).filter(line => line !== '');
            return {
              name: lines[0]?.trim() || 'Unknown Persona',
              painPoints: extractPersonaField(lines, 'pain points') || 'Not specified',
              goals: extractPersonaField(lines, 'goals') || 'Not specified',
              solution: extractPersonaField(lines, 'solution') || 'Not specified',
            };
          });
        }

      } catch (premiumError) {
        console.error('Error processing premium features:', premiumError);
        
        if (premiumError.message.includes('quota') || premiumError.message.includes('rate limit')) {
          return Response.json(
            { error: premiumError.message },
            { status: 429 }
          );
        }
        
        return Response.json(
          { error: `Premium feature error: ${premiumError.message}` },
          { status: 500 }
        );
      }
    }

    return Response.json(results);
  } catch (error) {
    console.error('Error processing idea:', error);
    return Response.json(
      { 
        error: error.message || 'Failed to process idea. Please try again.',
        type: error.type || 'unknown_error'
      },
      { 
        status: error.message.includes('quota') ? 429 : 
                error.message.includes('rate limit') ? 429 : 500 
      }
    );
  }
}

// Helper function to extract field values from formatted text
function extractField(lines, fieldName) {
  const line = lines.find(line => 
    line.toLowerCase().includes(fieldName.toLowerCase() + ':')
  );
  if (line) {
    const parts = line.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : null;
  }
  return null;
}

// Helper function to extract persona field values
function extractPersonaField(lines, fieldName) {
  const line = lines.find(line => 
    line.toLowerCase().startsWith(fieldName.toLowerCase() + ':')
  );
  if (line) {
    return line.replace(new RegExp(`^${fieldName}:\\s*`, 'i'), '').trim();
  }
  return null;
}