// Global type definitions for the application

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name: string;
  email: string;
  imageUrl?: string;
  avatar?: string;
  hasImage?: boolean;
}

export interface UserData {
  isPremium: boolean;
  promptsUsed: number;
  promptsRemaining: number;
  dailyPromptsLimit: number;
  promptsResetDate: string | null;
  weeklyPromptsUsed: number;
  weeklyPromptsLimit: number;
  weeklyPromptsResetDate: string | null;
  isInitialized: boolean;
}

export interface ChatHistory {
  id: string;
  title: string;
  idea: string;
  results: ValidationResults;
  timestamp: string;
}

export interface ValidationResults {
  userPrompt?: string;
  enhancedIdea?: string;
  marketValidation?: string[] | string;
  mvpFeatures?: string[] | string;
  techStack?: TechStack | string;
  monetization?: string[] | string;
  landingPage?: LandingPageContent;
  userPersonas?: UserPersona[];
}

export interface TechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  hosting?: string;
  authentication?: string;
  apis?: string;
  storage?: string;
  cicd?: string;
  monitoring?: string;
  optionalAI?: string;
  [key: string]: string | undefined;
}

export interface LandingPageContent {
  headline: string;
  subheading: string;
  cta: string;
  benefits?: string[];
}

export interface UserPersona {
  name: string;
  painPoints: string | string[];
  goals: string | string[];
  solution: string | string[];
}

export interface Plan {
  id: string;
  name: string;
  label: string;
  tagline: string;
  price: string;
  period: string;
  icon: string;
  badge?: string;
  features: PlanFeature[];
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface Order {
  orderId: string;
  planName: string;
  amount: number;
  currency?: string;
  status: "pending" | "completed" | "cancelled" | "refunded";
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  timestamp: string;
}

export interface PaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CurrencyConfig {
  symbol: string;
  code: string;
  multiplier: number;
  minimumAmount: number;
  premiumPrice: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatAPIResponse extends APIResponse {
  chat?: ChatHistory;
  chats?: ChatHistory[];
}

export interface UserAPIResponse extends APIResponse {
  user?: UserData & {
    id: string;
    clerkId: string;
    email: string;
    lastActive: string;
  };
}

export interface OrderAPIResponse extends APIResponse {
  orders?: Order[];
  order?: Order;
}

export interface PlansAPIResponse extends APIResponse {
  plans?: Plan[];
}

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      ease?: string | number[];
      staggerChildren?: number;
      delayChildren?: number;
    };
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "destructive";
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export type PaymentState =
  | "idle"
  | "loading"
  | "processing"
  | "success"
  | "error";

export interface LoadingMessage {
  icon: React.ReactElement;
  text: string;
  subtext: string;
}
