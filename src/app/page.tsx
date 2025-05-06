import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Accordion from '@/components/common/Accordion';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { FeatureCard, PricingPlan, FAQ } from '@/types/home';

export default function Home() {
  const features: FeatureCard[] = [
    {
      id: 1,
      title: 'Intelligent Code Context',
      description: 'Our meta-prompting engine analyzes your codebase to provide AI assistants with perfect context, resulting in code that matches your project\'s patterns and practices.',
      icon: '/images/github-icon.svg'
    },
    {
      id: 2,
      title: 'Frictionless Workflow',
      description: 'Seamlessly enhance AI-generated code without disrupting your development flow - OptiPrompt integrates directly into your IDE and existing tools.',
      icon: '/images/vscode-icon.svg'
    },
    {
      id: 3,
      title: 'Customizable Standards',
      description: 'Define your engineering team\'s coding standards and practices as meta-prompting rules that ensure all AI-generated code follows your organization\'s best practices.',
      icon: '/images/success-icon.svg'
    },
    {
      id: 4,
      title: 'Multi-Assistant Compatible',
      description: 'Works with GitHub Copilot, Claude, ChatGPT and other AI coding assistants to deliver consistent results regardless of which AI you prefer to use.',
      icon: '/images/chat-icon.svg'
    }
  ];

  const pricingPlans: PricingPlan[] = [
    {
      id: 1,
      name: 'Free',
      price: '€0',
      period: '/monthly',
      features: [
        '3 enhancements a day',
        'Integrates with VS Code, Cursor AI and Windsurf',
        'Basic support'
      ],
      buttonText: 'Get started for free',
      buttonVariant: 'primary'
    },
    {
      id: 2,
      name: 'Pro',
      price: '€9',
      period: '/monthly',
      features: [
        'Unlimited enhancements',
        'Integrates with VS Code, Cursor AI and Windsurf',
        'Early Access to new integrations',
        'Early Access to new features',
        'Priority support'
      ],
      buttonText: 'Sign up now',
      isPopular: true,
      buttonVariant: 'secondary'
    },
    {
      id: 3,
      name: 'Business',
      price: '€12',
      period: '/monthly per user',
      features: [
        'Enforce privacy mode org-wide',
        'Admin dashboard with usage stats',
        'Centralized billing',
        'unlimited enhancements',
        'Integrates with VS Code, Cursor AI and Windsurf',
        'Early Access to new integrations',
        'Early Access to new features',
        'Priority support'
      ],
      buttonText: 'coming soon',
      buttonVariant: 'primary'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'Does OptiPrompt cost money?',
      answer: 'OptiPrompt offers a free tier with limited features, as well as paid Pro and Business plans with more advanced capabilities for teams looking to scale AI-assisted development.'
    },
    {
      id: 2,
      question: 'How does it work?',
      answer: 'OptiPrompt utilizes advanced meta-prompting techniques to analyze your codebase and conversation context, then automatically enhances your prompts to generate more accurate, idiomatic, and maintainable code from AI coding assistants.'
    },
    {
      id: 3,
      question: 'What is meta prompting?',
      answer: 'Meta prompting is a technique that creates prompts about prompts, essentially guiding AI to understand developer intent more effectively. OptiPrompt automates this process by analyzing your codebase context and augmenting your prompts with relevant information.'
    },
    {
      id: 4,
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
    },
    {
      id: 5,
      question: 'How does the pricing work for teams?',
      answer: 'Our Business plan is priced per user per month, with centralized billing and administration for your entire engineering organization.'
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-[103px] bg-gradient-to-b from-[#eaeefe] to-[#183ec2] h-[100vh] min-h-[800px] flex items-center">
        <div className="container mx-auto px-12">
          <div className="pt-0">
            <Tag className="mb-6 bg-white/80 border-[#22222219] text-black">
              coming soon
            </Tag>
            
            <h1 className="text-[90px] font-bold text-black leading-[90px] max-w-[602px] mb-10">
              Unlock AI's potential with meta prompting
            </h1>
            
            <p className="text-[22px] text-[#010d3e] max-w-[457px] mb-12">
              OptiPrompt's advanced meta-prompting engine optimizes AI coding assistants to deliver precisely what developers need.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link href="https://marketplace.visualstudio.com/items?itemName=optiprompt-extension" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="secondary" className="rounded-[10px] bg-white text-black px-6 py-3 h-[48px] text-[16px] font-medium flex items-center"
                >
                  <Image src="/images/vscode-icon.svg" alt="VS Code" width={24} height={24} className="mr-3" />
                  Download for VS Code
                </Button>
              </Link>
              
              <Button 
                variant="primary" className="rounded-[10px] bg-black text-white px-6 py-3 h-[48px] text-[16px] font-medium"
              >
                Subscribe
              </Button>
              
              <Link href="#features" className="flex items-center text-[16px] font-medium text-black ml-2">
                Learn more
                <Image 
                  src="/images/img_icons.svg" alt="Learn more" 
                  width={20} 
                  height={20} 
                  className="ml-2"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="bg-gradient-to-b from-white to-[#c1cefa] py-32">
        <div className="container mx-auto px-12">
          <div className="text-center mb-16">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              Engineer-first design
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[540px] mx-auto mb-6">
              Solve complex engineering challenges faster
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[600px] mx-auto">
              Our meta-prompting technology saves engineering teams valuable development time by intelligently enhancing prompts with contextual code awareness and best practices
            </p>
          </div>
          
          <div className="mb-24">
            <Image 
              src="/images/img_screenshot_20250505_at_223813.png" alt="Code Editor Screenshot" 
              width={1100} 
              height={683} 
              className="mx-auto rounded-2xl shadow-xl"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                iconSize={24}
              />
            ))}
          </div>
          
          {/* Extension Download CTA */}
          <div className="mt-24 bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image src="/images/vscode-icon.svg" alt="VS Code" width={64} height={64} />
            </div>
            <h3 className="text-[36px] font-bold text-black mb-4">
              Elevate your development workflow today
            </h3>
            <p className="text-[18px] text-[#010d3e] max-w-[600px] mx-auto mb-8">
              Install our VS Code extension and leverage advanced meta-prompting to get higher-quality, production-ready code from your AI assistant. Built by engineers, for engineers.
            </p>
            <Link href="https://marketplace.visualstudio.com/items?itemName=optiprompt-extension" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button 
                variant="primary" className="rounded-[10px] bg-black text-white px-8 py-4 text-[18px] font-medium flex items-center mx-auto"
              >
                <Image src="/images/vscode-icon.svg" alt="VS Code" width={24} height={24} className="mr-3" />
                Download for VS Code
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-12">
          <div className="text-center mb-10">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              ROI-driven pricing
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[540px] mx-auto mb-6">
              A more effective engineering approach
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[535px] mx-auto">
              Maximize developer productivity with pricing that scales from individual developers to enterprise engineering teams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative rounded-[24px] border border-[#eff0f6] shadow-md p-10 h-full ${
                  plan.isPopular ? 'bg-black text-white md:transform md:-translate-y-4 md:z-10' : 'bg-white'}`}
              >
                {plan.isPopular && (
                  <Tag className="absolute top-10 right-10 bg-transparent border-[#ffffff33] text-[#dd7dff]">
                    Most Popular
                  </Tag>
                )}
                
                <h3 className={`text-[18px] font-bold ${plan.isPopular ? 'text-white/60' : 'text-[#6e6b8f]'} mb-2`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-end mb-6">
                  <span className={`text-[54px] font-bold ${plan.isPopular ? 'text-white' : 'text-black'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-[18px] font-bold ml-1 ${plan.isPopular ? 'text-[#999999]' : 'text-[#6e6b8f]'}`}>
                    {plan.period}
                  </span>
                </div>
                
                <Button 
                  variant={plan.isPopular ? 'secondary' : 'primary'} 
                  className={`w-full rounded-[10px] ${
                    plan.isPopular 
                      ? 'bg-white text-black' :'bg-black text-white'
                  } py-2 mb-6`}
                >
                  {plan.buttonText}
                </Button>
                
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Image 
                        src={plan.isPopular ? '/images/img_icons_2.svg' : '/images/img_icons_1.svg'} 
                        alt="Check" 
                        width={24} 
                        height={24} 
                        className="mr-4 mt-0.5"
                      />
                      <span className={`text-[14px] ${plan.isPopular ? 'text-white' : 'text-black'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-gradient-to-b from-white to-[#f0f3ff]">
        <div className="container mx-auto px-12">
          <div className="text-center mb-16">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              Common questions
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[640px] mx-auto mb-6">
              Frequently asked questions
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[600px] mx-auto mb-16">
              Get answers to the most common questions about OptiPrompt and how it can help you code more effectively
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq) => (
              <Accordion key={faq.id} title={faq.question}>
                <p className="text-[16px] text-gray-700">{faq.answer}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-white to-[#d2dcff]">
        <div className="container mx-auto px-12 text-center">
          <h2 className="text-[54px] font-bold text-black mb-6">
            Supercharge your AI coding assistant
          </h2>
          
          <p className="text-[18px] text-[#010d3e] max-w-[550px] mx-auto mb-12">
            Try the OptiPrompt VS Code extension and see how meta-prompting technology revolutionizes your development workflow
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link href="https://marketplace.visualstudio.com/items?itemName=optiprompt-extension" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="primary" className="rounded-[10px] bg-black text-white px-8 py-3 h-[50px] text-[16px] font-medium flex items-center"
              >
                <Image src="/images/vscode-icon.svg" alt="VS Code" width={24} height={24} className="mr-3" />
                Download for VS Code
              </Button>
            </Link>
            
            <Link href="/signup" className="flex items-center text-[16px] font-medium text-black hover:text-blue-600 transition-colors">
              Sign Up for Free
              <Image 
                src="/images/img_icons.svg" alt="Sign Up" 
                width={20} 
                height={20} 
                className="ml-2"
              />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}