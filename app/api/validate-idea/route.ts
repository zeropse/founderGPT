import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import UserService from "../../../lib/services/UserService";

const API_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "meta-llama/llama-3.3-70b-instruct",
  timeout: 30000,
  maxRetries: 2,
  retryDelay: 1000,
};

const SYSTEM_PROMPT = `You are an expert product discovery assistant. You help founders clarify, validate, and break down SaaS/app ideas using industry-standard workflows.

IMPORTANT INSTRUCTIONS:
- Provide direct, actionable responses without asking questions back to the user
- Work with whatever information is provided, even if it seems incomplete
- Make reasonable assumptions when details are missing
- Always deliver concrete, specific recommendations
- Never request clarification or additional information
- Focus on being helpful and decisive rather than comprehensive
- If an idea is vague, enhance it with reasonable assumptions and provide analysis based on your interpretation`;

function validateInput(idea: string): string {
  if (!idea) {
    throw new ValidationError("Idea is required.");
  }

  const trimmedIdea = idea.trim();
  if (trimmedIdea === "") {
    throw new ValidationError("Idea cannot be empty.");
  }

  if (trimmedIdea.length < 10) {
    throw new ValidationError("Idea must be at least 10 characters long.");
  }

  if (trimmedIdea.length > 2000) {
    throw new ValidationError(
      "Idea is too long. Please keep it under 2000 characters."
    );
  }

  return trimmedIdea;
}

function validateEnvironment() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY environment variable is missing");
    throw new ConfigError(
      "Missing required environment variable: OPENROUTER_API_KEY. Please check your deployment configuration."
    );
  }

  console.log("✅ OPENROUTER_API_KEY is configured");
}

class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class ConfigError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
    this.statusCode = 500;
  }
}

class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async makeRequest(
    prompt: string,
    retryCount: number = 0
  ): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      console.log(
        `🔄 Making OpenRouter API request (attempt ${retryCount + 1})`
      );

      const response = await fetch(API_CONFIG.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
          "X-Title": "Idea Validator App",
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📡 OpenRouter API response status: ${response.status}`);

      if (!response.ok) {
        await this.handleAPIError(response, prompt, retryCount);
        return null;
      }

      const data = await response.json();

      if (!data?.choices?.[0]?.message?.content) {
        console.error("❌ Invalid API response format:", data);
        throw new APIError(
          "Invalid API response format: Missing required fields"
        );
      }

      console.log("✅ OpenRouter API request successful");
      return data.choices[0].message.content.trim();
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        console.error("⏰ Request timed out");
        throw new APIError("Request timed out. Please try again.", 408);
      }

      if (error instanceof APIError) {
        throw error;
      }

      if (retryCount < API_CONFIG.maxRetries) {
        console.log(
          `🔄 Retrying request (attempt ${retryCount + 1}/${
            API_CONFIG.maxRetries
          })`
        );
        await this.delay(API_CONFIG.retryDelay * (retryCount + 1));
        return this.makeRequest(prompt, retryCount + 1);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("🌐 Network error:", errorMessage);
      throw new APIError(`Network error: ${errorMessage}`);
    }
  }

  async handleAPIError(
    response: Response,
    prompt: string,
    retryCount: number
  ): Promise<string | null> {
    const errorData = await response.json().catch(() => ({}));

    console.error("API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: errorData,
    });

    if (errorData.error?.code === "insufficient_quota") {
      throw new APIError(
        "API quota exceeded. Please check your account billing and usage details.",
        429
      );
    }

    if (response.status === 429) {
      if (retryCount < API_CONFIG.maxRetries) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount);
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.makeRequest(prompt, retryCount + 1);
      }
      throw new APIError("Rate limit exceeded. Please try again later.", 429);
    }

    const errorMessage = this.extractErrorMessage(errorData, response);
    throw new APIError(errorMessage, response.status);
  }

  extractErrorMessage(errorData: any, response: Response): string {
    return (
      errorData.error?.message ||
      errorData.message ||
      errorData.detail ||
      errorData.errors?.[0]?.message ||
      (typeof errorData.error === "string" ? errorData.error : null) ||
      `HTTP ${response.status}: ${response.statusText}`
    );
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const PROMPTS = {
  enhance: (idea: string) =>
    `Refine and rewrite this product idea for clarity and impact. Make it specific. Work with the information provided and make reasonable assumptions if details are missing. Do not ask for additional information. Do not include introductory phrases like "Here is" or "Here are". Start directly with the enhanced idea: (minimum 150-200 words)\n\n${idea}`,

  marketValidation: (enhancedIdea: string) =>
    `Analyze this SaaS/app idea for market fit, uniqueness, and potential competitors. Provide actionable insights in bullet format. Make reasonable assumptions about the target market and provide concrete analysis. Do not include introductory phrases like "Here are the insights" or similar. Start directly with bullet points:\n\n${enhancedIdea}`,

  mvpFeatures: (enhancedIdea: string) =>
    `List exactly 5 core MVP features that would make this idea functional but lean. Focus on essential features only. Format as a numbered list. Make decisions based on the idea provided without requesting clarification. Do not include introductory phrases like "Here are the 5 core features" or similar. Start directly with the numbered list:\n\n${enhancedIdea}`,

  techStack: (enhancedIdea: string) =>
    `Suggest the most suitable and modern tech stack for building this MVP. Consider scalability and ease of development. Make specific technology recommendations based on the idea provided. Do not include introductory phrases. Format exactly as:
Frontend: [specific technology/framework]
Backend: [specific technology/framework]
Database: [specific database solution]
Hosting: [specific hosting platform]
Authentication: [specific auth solution]
APIs/Communication: [REST/GraphQL/WebSockets/etc.]
Storage (File/Media): [Cloud storage solution]
CI/CD: [build & deployment automation tool]
Monitoring & Logging: [monitoring/logging service]
Optional AI/ML: [if relevant, specify model or platform]

Idea: ${enhancedIdea}`,

  monetization: (enhancedIdea: string) =>
    `Recommend 3-5 realistic monetization strategies for a bootstrapped solo founder launching this product. Focus on strategies suitable for early-stage products. Format as bullet points. Provide specific recommendations without asking for business model preferences. Do not include introductory phrases like "Here are the monetization strategies" or similar. Start directly with bullet points:\n\n${enhancedIdea}`,

  landingPage: (enhancedIdea: string) =>
    `Create compelling landing page copy for this product. Make it conversion-focused and benefit-driven. Work with the information provided and create compelling copy without requesting additional details. Do not include introductory phrases. Format exactly as:
Headline: [compelling headline under 60 characters]
Subheading: [descriptive subheading under 120 characters]
CTA: [call to action button text under 20 characters]
Benefit 1: [first key benefit]
Benefit 2: [second key benefit]
Benefit 3: [third key benefit]

Idea: ${enhancedIdea}`,

  userPersonas: (enhancedIdea: string) =>
    `Define 2 distinct user personas for this product. Make them specific and realistic based on the idea provided. Make reasonable assumptions about the target users. Do not include introductory phrases. Format exactly as:

1. [Persona Name and Role]
Pain Points: [their main challenges]
Goals: [what they want to achieve]
Solution: [how the product helps them]

2. [Persona Name and Role]
Pain Points: [their main challenges]
Goals: [what they want to achieve]
Solution: [how the product helps them]

Idea: ${enhancedIdea}`,
};

class DataProcessor {
  static processBulletPoints(text: string): string[] {
    if (!text) return [];
    return text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line !== "" && line.length > 0)
      .map((line: string) => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter((line: string) => line.length > 0);
  }

  static extractField(lines: string[], fieldName: string): string | null {
    const line = lines.find((line: string) =>
      line.toLowerCase().includes(fieldName.toLowerCase() + ":")
    );
    if (line) {
      const colonIndex = line.indexOf(":");
      return colonIndex !== -1 ? line.substring(colonIndex + 1).trim() : null;
    }
    return null;
  }

  static processTechStack(text: string): any {
    if (!text) return null;

    const lines = text.split("\n").map((line: string) => line.trim());
    return {
      frontend: this.extractField(lines, "frontend") || "Not specified",
      backend: this.extractField(lines, "backend") || "Not specified",
      database: this.extractField(lines, "database") || "Not specified",
      hosting: this.extractField(lines, "hosting") || "Not specified",
      authentication:
        this.extractField(lines, "authentication") || "Not specified",
      apis: this.extractField(lines, "APIs/Communication") || "Not specified",
      storage:
        this.extractField(lines, "Storage (File/Media)") || "Not specified",
      ciCd: this.extractField(lines, "CI/CD") || "Not specified",
      monitoring:
        this.extractField(lines, "Monitoring & Logging") || "Not specified",
      optionalAI: this.extractField(lines, "Optional AI/ML") || "Not Needed",
    };
  }

  static processLandingPage(text: string): any {
    if (!text) return null;

    const lines = text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line !== "");

    return {
      headline: this.extractField(lines, "headline") || "Not specified",
      subheading: this.extractField(lines, "subheading") || "Not specified",
      cta: this.extractField(lines, "cta") || "Get Started",
      benefits: lines
        .filter((line: string) => line.toLowerCase().startsWith("benefit"))
        .map((line: string) => line.replace(/^benefit \d+:\s*/i, "").trim())
        .filter((benefit: string) => benefit !== ""),
    };
  }

  static processUserPersonas(text: string): any[] {
    if (!text) return [];

    const sections = text
      .split(/(?=\d+\.\s)/g)
      .filter((section: string) => section.trim());

    return sections.map((section: string) => {
      const lines = section
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line);

      const nameMatch = lines[0]?.match(/^\d+\.\s*(.+)$/);
      const name = nameMatch ? nameMatch[1].trim() : "Unknown Persona";

      const painPoints = this.extractPersonaContent(lines, "pain points");
      const goals = this.extractPersonaContent(lines, "goals");
      const solution = this.extractPersonaContent(lines, "solution");

      return {
        name,
        painPoints: painPoints || "Not available",
        goals: goals || "Not available",
        solution: solution || "Not available",
      };
    });
  }

  static extractPersonaContent(
    lines: string[],
    fieldName: string
  ): string | null {
    const fieldIndex = lines.findIndex((line: string) =>
      line.toLowerCase().startsWith(fieldName.toLowerCase() + ":")
    );

    if (fieldIndex === -1) return null;

    const fieldLine = lines[fieldIndex];
    const colonIndex = fieldLine.indexOf(":");
    let content = fieldLine.substring(colonIndex + 1).trim();

    if (!content && fieldIndex + 1 < lines.length) {
      const nextLine = lines[fieldIndex + 1];
      if (!nextLine.toLowerCase().includes(":")) {
        content = nextLine.trim();
      }
    }

    return content || null;
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Starting idea validation request");

    const { userId } = await auth();

    if (!userId) {
      console.log("❌ Unauthorized request - no userId");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated:", userId);

    const body = await req.json();
    const { idea } = body;

    console.log("📝 Idea received, length:", idea?.length || 0);

    const trimmedIdea = validateInput(idea);
    console.log("✅ Input validation passed");

    validateEnvironment();
    console.log("✅ Environment validation passed");

    const user = await UserService.getUserByClerkId(userId);

    if (!user) {
      console.log("❌ User not found in database");
      throw new ValidationError(
        "User not found. Please refresh and try again."
      );
    }

    console.log("✅ User found:", {
      id: user._id,
      promptsRemaining: user.promptsRemaining,
      planId: user.planId,
    });

    if (user.promptsRemaining <= 0) {
      console.log("❌ User exceeded daily limit");
      throw new ValidationError(
        "You've reached your daily limit. Please upgrade or try again tomorrow."
      );
    }

    const isPremium = user.planId === "premium";
    console.log("💎 User premium status:", isPremium);

    await UserService.decrementPromptsRemaining(userId);
    console.log("✅ Prompts decremented");

    const client = new OpenRouterClient(process.env.OPENROUTER_API_KEY!);
    console.log("🤖 OpenRouter client initialized");

    const enhancedIdea = await client.makeRequest(PROMPTS.enhance(trimmedIdea));

    if (!enhancedIdea) {
      console.log("❌ Failed to enhance idea");
      throw new APIError("Failed to enhance the idea. Please try again.");
    }

    console.log("✅ Idea enhanced successfully");

    const results: any = {
      userPrompt: trimmedIdea,
      enhancedIdea,
      marketValidation: null,
      mvpFeatures: null,
      techStack: null,
      monetization: null,
      landingPage: null,
      userPersonas: null,
    };

    if (isPremium) {
      try {
        console.log("🔄 Processing premium features...");

        const premiumPromises = [
          client.makeRequest(PROMPTS.marketValidation(enhancedIdea)),
          client.makeRequest(PROMPTS.mvpFeatures(enhancedIdea)),
          client.makeRequest(PROMPTS.techStack(enhancedIdea)),
          client.makeRequest(PROMPTS.monetization(enhancedIdea)),
          client.makeRequest(PROMPTS.landingPage(enhancedIdea)),
          client.makeRequest(PROMPTS.userPersonas(enhancedIdea)),
        ];

        const [
          marketValidation,
          mvpFeatures,
          techStack,
          monetization,
          landingPage,
          userPersonas,
        ] = await Promise.allSettled(premiumPromises);

        console.log("📊 Premium features processing results:", {
          marketValidation: marketValidation.status,
          mvpFeatures: mvpFeatures.status,
          techStack: techStack.status,
          monetization: monetization.status,
          landingPage: landingPage.status,
          userPersonas: userPersonas.status,
        });

        if (marketValidation.status === "fulfilled" && marketValidation.value) {
          results.marketValidation = DataProcessor.processBulletPoints(
            marketValidation.value
          );
        }

        if (mvpFeatures.status === "fulfilled" && mvpFeatures.value) {
          results.mvpFeatures = DataProcessor.processBulletPoints(
            mvpFeatures.value
          );
        }

        if (techStack.status === "fulfilled" && techStack.value) {
          results.techStack = DataProcessor.processTechStack(techStack.value);
        }

        if (monetization.status === "fulfilled" && monetization.value) {
          results.monetization = DataProcessor.processBulletPoints(
            monetization.value
          );
        }

        if (landingPage.status === "fulfilled" && landingPage.value) {
          results.landingPage = DataProcessor.processLandingPage(
            landingPage.value
          );
        }

        if (userPersonas.status === "fulfilled" && userPersonas.value) {
          results.userPersonas = DataProcessor.processUserPersonas(
            userPersonas.value
          );
        }

        const failedFeatures = [
          marketValidation,
          mvpFeatures,
          techStack,
          monetization,
          landingPage,
          userPersonas,
        ].filter((result) => result.status === "rejected");

        if (failedFeatures.length > 0) {
          console.warn(
            `⚠️ ${failedFeatures.length} premium features failed to process:`,
            failedFeatures.map((f, i) => ({
              feature: [
                "marketValidation",
                "mvpFeatures",
                "techStack",
                "monetization",
                "landingPage",
                "userPersonas",
              ][i],
              reason: f.status === "rejected" ? f.reason : "unknown",
            }))
          );
        } else {
          console.log("✅ All premium features processed successfully");
        }
      } catch (premiumError: unknown) {
        console.error("❌ Error processing premium features:", premiumError);
        if (
          premiumError instanceof APIError &&
          premiumError.statusCode === 429
        ) {
          return Response.json(
            {
              error:
                "Rate limit reached while processing premium features. Please try again in a moment.",
              results: results,
            },
            { status: 429 }
          );
        }
      }
    }

    console.log("✅ Request processed successfully");
    return Response.json(results);
  } catch (error: unknown) {
    console.error("❌ Error processing request:", error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    if (error instanceof ValidationError) {
      console.log("🚫 Validation error:", error.message);
      return Response.json(
        { error: error.message, type: "validation_error" },
        { status: error.statusCode }
      );
    }

    if (error instanceof ConfigError) {
      console.log("⚙️ Configuration error:", error.message);
      return Response.json(
        {
          error: "Server configuration error. Please contact support.",
          type: "config_error",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    if (error instanceof APIError) {
      console.log("🌐 API error:", error.message);
      return Response.json(
        { error: error.message, type: "api_error" },
        { status: error.statusCode }
      );
    }

    console.log("🤔 Unknown error type");
    return Response.json(
      {
        error: "An unexpected error occurred. Please try again.",
        type: "unknown_error",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
