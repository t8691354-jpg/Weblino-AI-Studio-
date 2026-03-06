export interface Project {
  id: string;
  userId: string;
  name: string;
  prompt: string;
  code: {
    html: string;
    css: string;
    js: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  content: {
    headlines: string[];
    taglines: string[];
    descriptions: string[];
    imageKeywords: string[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  plan: 'free' | 'pro' | 'enterprise';
  usageCount: number;
}

export interface SystemConfig {
  geminiKey: string;
  openaiKey: string;
  activeAiProvider: 'gemini' | 'openai';
  stripeSecretKey: string;
  stripePublishableKey: string;
  isPaymentEnabled: boolean;
  isAiEnabled: boolean;
  plans: {
    free: { projectLimit: number };
    pro: { projectLimit: number; price: number };
    enterprise: { projectLimit: number; price: number };
  };
}

export interface Template {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  category: string;
  thumbnail: string;
}
