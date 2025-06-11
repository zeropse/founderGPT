import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import UserService from "../../../lib/services/UserService";

const API_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "meta-llama/llama-3.3-70b-instruct",
  timeout: 45000,
  maxRetries: 3,
  retryDelay: 1500,
  maxConcurrentRequests: 5,
} as const;

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
    throw new ValidationError("Please provide an idea to validate.");
  }

  const trimmedIdea = idea.trim();
  if (trimmedIdea === "") {
    throw new ValidationError(
      "Your idea cannot be empty. Please describe your product concept."
    );
  }

  if (trimmedIdea.length < 10) {
    throw new ValidationError(
      "Please provide more details. Your idea should be at least 10 characters long."
    );
  }

  if (trimmedIdea.length > 2000) {
    throw new ValidationError(
      "Your idea is too long. Please keep it under 2000 characters for better processing."
    );
  }

  if (trimmedIdea.toLowerCase().includes("test") && trimmedIdea.length < 20) {
    throw new ValidationError(
      "Please provide a real product idea instead of test input."
    );
  }

  return trimmedIdea;
}

function validateEnvironment() {
  const requiredEnvVars = ["OPENROUTER_API_KEY"];
  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error(`❌ Missing environment variables: ${missing.join(", ")}`);
    throw new ConfigError(
      `Server configuration error. Missing: ${missing.join(", ")}`
    );
  }

  console.log("✅ All required environment variables are configured");
}

function getRefererUrl(request?: NextRequest): string {
  try {
    if (request) {
      const host = request.headers.get("host");
      const forwardedProto = request.headers.get("x-forwarded-proto");
      const protocol =
        forwardedProto || (host?.includes("localhost") ? "http" : "https");

      if (host) {
        return `${protocol}://${host}`;
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (
      siteUrl &&
      siteUrl.startsWith("http") &&
      !siteUrl.includes("localhost")
    ) {
      return siteUrl;
    }

    const safeFallbacks = [
      "https://incandescent-blancmange-3a2a1f.netlify.app",
      "https://foundrgpt.zeropse.org",
    ];

    return safeFallbacks[0];
  } catch (error) {
    console.warn("⚠️ Error determining referer URL, using fallback:", error);
    return "https://foundrgpt.zeropse.org";
  }
}

class ValidationError extends Error {
  public readonly statusCode: number = 400;
  public readonly type: string = "validation_error";

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class ConfigError extends Error {
  public readonly statusCode: number = 500;
  public readonly type: string = "config_error";

  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

class APIError extends Error {
  public readonly statusCode: number;
  public readonly type: string = "api_error";
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
  }
}

class RateLimitError extends APIError {
  constructor(
    message: string = "Rate limit exceeded. Please try again later."
  ) {
    super(message, 429, true);
    this.name = "RateLimitError";
  }
}

class OpenRouterClient {
  private readonly apiKey: string;
  private readonly refererUrl: string;
  private activeRequests: number = 0;

  constructor(apiKey: string, refererUrl: string) {
    this.apiKey = apiKey;
    this.refererUrl = refererUrl;
  }

  async makeRequest(
    prompt: string,
    retryCount: number = 0
  ): Promise<string | null> {
    if (this.activeRequests >= API_CONFIG.maxConcurrentRequests) {
      await this.delay(1000);
    }

    this.activeRequests++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      console.log(
        `🔄 API request (attempt ${retryCount + 1}/${
          API_CONFIG.maxRetries + 1
        })`
      );

      const response = await fetch(API_CONFIG.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.refererUrl,
          "X-Title": "foundrGPT App",
          "User-Agent": "foundrGPT/1.0",
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1200,
          top_p: 0.9,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`📡 API response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        return await this.handleAPIError(response, prompt, retryCount);
      }

      const data = await response.json();

      if (!data?.choices?.[0]?.message?.content) {
        console.error("❌ Invalid API response:", {
          hasChoices: !!data?.choices,
          data,
        });
        throw new APIError("Invalid API response format");
      }

      const content = data.choices[0].message.content.trim();
      if (!content) {
        throw new APIError("Empty response from API");
      }

      console.log("✅ API request successful");
      return content;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        console.error("⏰ Request timeout");
        if (retryCount < API_CONFIG.maxRetries) {
          await this.delay(API_CONFIG.retryDelay * (retryCount + 1));
          return this.makeRequest(prompt, retryCount + 1);
        }
        throw new APIError(
          "Request timed out after multiple attempts",
          408,
          true
        );
      }

      if (error instanceof APIError) {
        throw error;
      }

      if (retryCount < API_CONFIG.maxRetries) {
        const delay = API_CONFIG.retryDelay * Math.pow(1.5, retryCount);
        console.log(`🔄 Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.makeRequest(prompt, retryCount + 1);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown network error";
      console.error("🌐 Network error:", errorMessage);
      throw new APIError(`Network error: ${errorMessage}`, 500, true);
    } finally {
      this.activeRequests--;
    }
  }

  private async handleAPIError(
    response: Response,
    prompt: string,
    retryCount: number
  ): Promise<string | null> {
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch {
      errorData = { error: "Unable to parse error response" };
    }

    console.error("API Error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });

    if (response.status === 401) {
      throw new ConfigError("Invalid API key configuration");
    }

    if (response.status === 403) {
      throw new APIError(
        "API access denied. Please check your account status.",
        403
      );
    }

    if (
      errorData.error?.code === "insufficient_quota" ||
      response.status === 402
    ) {
      throw new APIError("API quota exceeded. Please check your billing.", 429);
    }

    if (response.status === 429) {
      if (retryCount < API_CONFIG.maxRetries) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount);
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.makeRequest(prompt, retryCount + 1);
      }
      throw new RateLimitError();
    }

    if (response.status >= 500 && retryCount < API_CONFIG.maxRetries) {
      console.log(`Server error ${response.status}, retrying...`);
      await this.delay(API_CONFIG.retryDelay * (retryCount + 1));
      return this.makeRequest(prompt, retryCount + 1);
    }

    const errorMessage = this.extractErrorMessage(errorData, response);
    throw new APIError(errorMessage, response.status);
  }

  private extractErrorMessage(errorData: any, response: Response): string {
    const possibleMessages = [
      errorData.error?.message,
      errorData.message,
      errorData.detail,
      errorData.errors?.[0]?.message,
      typeof errorData.error === "string" ? errorData.error : null,
    ];

    const message = possibleMessages.find(
      (msg) => msg && typeof msg === "string"
    );
    return message || `HTTP ${response.status}: ${response.statusText}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const PROMPTS = {
  enhance: (idea: string) =>
    `Refine and enhance this product idea for maximum clarity and market appeal. Make it specific and actionable. Work with the provided information and make reasonable assumptions where needed. Provide a comprehensive description (150-250 words) that includes the core problem, target audience, and unique value proposition. Start directly with the enhanced idea:\n\n${idea}`,

  marketValidation: (enhancedIdea: string) =>
    `Analyze this SaaS/app idea for market viability, competition, and growth potential. Provide specific, actionable insights in bullet format covering: market size, competitive landscape, differentiation opportunities, potential challenges, and validation strategies. Start directly with bullet points:\n\n${enhancedIdea}`,

  mvpFeatures: (enhancedIdea: string) =>
    `Identify exactly 5 essential MVP features that would create a functional, valuable product while remaining lean. Focus on core functionality that directly addresses the main user problem. Format as a numbered list with brief explanations. Start directly with the numbered list:\n\n${enhancedIdea}`,

  techStack: (enhancedIdea: string) =>
    `Recommend a modern, scalable tech stack optimized for rapid MVP development and future growth. Consider development speed, cost-effectiveness, and scalability. Format exactly as shown below:\n\nFrontend: [specific framework/technology]\nBackend: [specific framework/technology]\nDatabase: [specific solution]\nHosting: [specific platform]\nAuthentication: [specific service]\nAPIs/Communication: [specific approach]\nStorage (File/Media): [specific solution]\nCI/CD: [specific tool]\nMonitoring & Logging: [specific service]\nOptional AI/ML: [if relevant]\n\nIdea: ${enhancedIdea}`,

  monetization: (enhancedIdea: string) =>
    `Suggest 4-5 realistic monetization strategies suitable for a bootstrap startup. Focus on strategies that can generate revenue early while scaling with growth. Consider different customer segments and value propositions. Start directly with bullet points:\n\n${enhancedIdea}`,

  landingPage: (enhancedIdea: string) =>
    `Create high-converting landing page copy focused on benefits and clear value proposition. Make it compelling and action-oriented. Format exactly as:\n\nHeadline: [compelling headline under 60 characters]\nSubheading: [descriptive subheading under 120 characters]\nCTA: [action button text under 20 characters]\nBenefit 1: [primary benefit]\nBenefit 2: [secondary benefit]\nBenefit 3: [additional benefit]\n\nIdea: ${enhancedIdea}`,

  userPersonas: (enhancedIdea: string) =>
    `Define 2 distinct, realistic user personas based on this product. Make them specific with clear demographics, motivations, and use cases. Format exactly as:\n\n1. [Persona Name and Title]\nPain Points: [specific challenges they face]\nGoals: [what they want to achieve]\nSolution: [how your product helps them]\n\n2. [Persona Name and Title]\nPain Points: [specific challenges they face]\nGoals: [what they want to achieve]\nSolution: [how your product helps them]\n\nIdea: ${enhancedIdea}`,
} as const;

class DataProcessor {
  static processBulletPoints(text: string): string[] {
    if (!text?.trim()) return [];

    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line.length > 3)
      .map((line) => line.replace(/^[•\-\*\d+\.]\s*/, "").trim())
      .filter((line) => line.length > 0 && !line.match(/^[^\w\s]*$/));
  }

  static extractField(lines: string[], fieldName: string): string | null {
    const regex = new RegExp(`^${fieldName}\\s*:\\s*(.+)$`, "i");

    for (const line of lines) {
      const match = line.match(regex);
      if (match && match[1]?.trim()) {
        return match[1].trim();
      }
    }
    return null;
  }

  static processTechStack(text: string): Record<string, string> | null {
    if (!text?.trim()) return null;

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const fields = [
      "frontend",
      "backend",
      "database",
      "hosting",
      "authentication",
      "apis/communication",
      "storage (file/media)",
      "ci/cd",
      "monitoring & logging",
      "optional ai/ml",
    ];

    const result: Record<string, string> = {};

    for (const field of fields) {
      const value =
        this.extractField(lines, field) ||
        this.extractField(lines, field.replace(/[()]/g, "")) ||
        "Not specified";

      const key = field
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .replace("fileMedia", "storage")
        .replace("apisommunication", "apis")
        .replace("monitoringlogging", "monitoring")
        .replace("optionalaiml", "optionalAI");

      result[key] = value;
    }

    return result;
  }

  static processLandingPage(text: string): Record<string, any> | null {
    if (!text?.trim()) return null;

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const benefits = lines
      .filter((line) => /^benefit\s+\d+:/i.test(line))
      .map((line) => line.replace(/^benefit\s+\d+:\s*/i, "").trim())
      .filter(Boolean);

    return {
      headline:
        this.extractField(lines, "headline") || "Transform Your Business",
      subheading:
        this.extractField(lines, "subheading") ||
        "Discover the power of innovation",
      cta: this.extractField(lines, "cta") || "Get Started",
      benefits:
        benefits.length > 0
          ? benefits
          : ["Increase efficiency", "Save time", "Boost productivity"],
    };
  }

  static processUserPersonas(text: string): Array<Record<string, string>> {
    if (!text?.trim()) return [];

    const sections = text
      .split(/(?=\d+\.\s)/)
      .filter((section) => section.trim());

    return sections
      .map((section) => {
        const lines = section
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const nameMatch = lines[0]?.match(/^\d+\.\s*(.+)$/);
        const name = nameMatch?.[1]?.trim() || "Unknown Persona";

        return {
          name,
          painPoints:
            this.extractPersonaContent(lines, "pain points") ||
            "Various challenges",
          goals:
            this.extractPersonaContent(lines, "goals") || "Achieve success",
          solution:
            this.extractPersonaContent(lines, "solution") || "Product benefits",
        };
      })
      .filter((persona) => persona.name !== "Unknown Persona");
  }

  private static extractPersonaContent(
    lines: string[],
    fieldName: string
  ): string | null {
    const fieldIndex = lines.findIndex((line) =>
      line.toLowerCase().startsWith(fieldName.toLowerCase() + ":")
    );

    if (fieldIndex === -1) return null;

    const fieldLine = lines[fieldIndex];
    const colonIndex = fieldLine.indexOf(":");
    let content = fieldLine.substring(colonIndex + 1).trim();

    if (!content && fieldIndex + 1 < lines.length) {
      const nextLine = lines[fieldIndex + 1];
      if (!nextLine.includes(":")) {
        content = nextLine.trim();
      }
    }

    return content || null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("🚀 Processing idea validation request");

    const { userId } = await auth();
    if (!userId) {
      console.log("❌ Unauthorized request");
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { idea } = body;

    const trimmedIdea = validateInput(idea);
    validateEnvironment();

    const user = await UserService.getUserByClerkId(userId);
    if (!user) {
      throw new ValidationError(
        "User account not found. Please sign in again."
      );
    }

    if (user.promptsRemaining <= 0) {
      return Response.json(
        {
          error: "Daily limit reached",
          type: "rate_limit",
          promptsRemaining: 0,
          upgradeUrl: "/pricing",
        },
        { status: 429 }
      );
    }

    const isPremium = user.planId === "premium";

    await UserService.decrementPromptsRemaining(userId);

    const refererUrl = getRefererUrl(req);
    const client = new OpenRouterClient(
      process.env.OPENROUTER_API_KEY!,
      refererUrl
    );

    const enhancedIdea = await client.makeRequest(PROMPTS.enhance(trimmedIdea));
    if (!enhancedIdea) {
      throw new APIError("Failed to process your idea. Please try again.");
    }

    const results: any = {
      userPrompt: trimmedIdea,
      enhancedIdea,
      isPremium,
      processingTime: Date.now() - startTime,
      marketValidation: null,
      mvpFeatures: null,
      techStack: null,
      monetization: null,
      landingPage: null,
      userPersonas: null,
    };

    if (isPremium) {
      try {
        console.log("🔄 Processing premium features");

        const premiumPromises = [
          client.makeRequest(PROMPTS.marketValidation(enhancedIdea)),
          client.makeRequest(PROMPTS.mvpFeatures(enhancedIdea)),
          client.makeRequest(PROMPTS.techStack(enhancedIdea)),
          client.makeRequest(PROMPTS.monetization(enhancedIdea)),
          client.makeRequest(PROMPTS.landingPage(enhancedIdea)),
          client.makeRequest(PROMPTS.userPersonas(enhancedIdea)),
        ];

        const premiumResults = await Promise.allSettled(premiumPromises);
        const [
          marketValidation,
          mvpFeatures,
          techStack,
          monetization,
          landingPage,
          userPersonas,
        ] = premiumResults;

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

        const failedCount = premiumResults.filter(
          (r) => r.status === "rejected"
        ).length;
        if (failedCount > 0) {
          console.warn(`⚠️ ${failedCount} premium features failed`);
          results.partialFailure = true;
        }
      } catch (premiumError) {
        console.error("❌ Premium features error:", premiumError);
        results.premiumError = "Some premium features couldn't be processed";
      }
    }

    results.processingTime = Date.now() - startTime;
    console.log(`✅ Request completed in ${results.processingTime}ms`);

    return Response.json(results);
  } catch (error: unknown) {
    const processingTime = Date.now() - startTime;
    console.error("❌ Request failed:", error);

    if (error instanceof ValidationError) {
      return Response.json(
        {
          error: error.message,
          type: error.type,
          processingTime,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof ConfigError) {
      return Response.json(
        {
          error: "Service temporarily unavailable",
          type: error.type,
          processingTime,
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    if (error instanceof APIError) {
      return Response.json(
        {
          error: error.message,
          type: error.type,
          isRetryable: error.isRetryable,
          processingTime,
        },
        { status: error.statusCode }
      );
    }

    return Response.json(
      {
        error: "An unexpected error occurred",
        type: "unknown_error",
        processingTime,
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
