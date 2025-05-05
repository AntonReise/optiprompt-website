export interface FeatureCard {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}