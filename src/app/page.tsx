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
      title: 'AI-Powerd Prompt Enhancement',
      description: 'Transform vague queries into specific, context-rich prompts that generate better code responses from GitHub Copilot',
      icon: '/images/img_vector.svg'
    },
    {
      id: 2,
      title: 'One-Click Enhancement',
      description: 'Seamlessly enhance your prompts with a single button click, without disrupting your coding workflow',
      icon: '/images/img_icons_24x24.svg'
    },
    {
      id: 3,
      title: 'Custom Enhancement Rules',
      description: 'Personalize prompts optimization with your own custom instructions to match your coding workflow',
      icon: '/images/img_vector_20x20.svg'
    },
    {
      id: 4,
      title: 'GitHub Copilot Integration',
      description: 'Works directly with GitHub Copilot Chat for a seamless experience across VS Code and other supported environments',
      icon: '/images/img_vector.svg'
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
      answer: 'OptiPrompt offers a free tier with limited features, as well as paid Pro and Business plans with more advanced capabilities.'
    },
    {
      id: 2,
      question: 'How does it work?',
      answer: 'OptiPrompt analyzes your code and conversation context to automatically enhance your prompts for AI coding assistants, resulting in more accurate and helpful code suggestions.'
    },
    {
      id: 3,
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
    },
    {
      id: 4,
      question: 'How does the pricing work for teams?',
      answer: 'Our Business plan is priced per user per month, with centralized billing and administration for your entire organization.'
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-[103px] bg-gradient-to-b from-[#eaeefe] to-[#183ec2] h-[710px]">
        <div className="container mx-auto px-12">
          <div className="pt-[62px]">
            <Tag className="mb-6 bg-white/80 border-[#22222219] text-black">
              coming soon
            </Tag>
            
            <h1 className="text-[90px] font-bold text-black leading-[90px] max-w-[602px] mb-6">
              Get better AI code with better prompts
            </h1>
            
            <p className="text-[22px] text-[#010d3e] max-w-[457px] mb-10">
              The AI prompt optimizer that makes your coding assistant actually understand what you need.
            </p>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="secondary" className="rounded-[10px] bg-white text-black px-4 py-2 h-[39px]"
              >
                Get for free
              </Button>
              
              <Button 
                variant="primary" className="rounded-[10px] bg-black text-white px-4 py-2 h-[39px]"
              >
                Subscribe
              </Button>
              
              <Link href="#" className="flex items-center text-[16px] font-medium text-black ml-4">
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
      <section id="features" className="bg-gradient-to-b from-white to-[#c1cefa] py-20">
        <div className="container mx-auto px-12">
          <div className="text-center mb-10">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              Boost your productivity
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[540px] mx-auto mb-6">
              Solve problems faster and more effectlivly
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[535px] mx-auto">
              Better prompting will save you and your team precious time and money, supercharging your prompts with key information pulled from your code and conversation
            </p>
          </div>
          
          <div className="mb-20">
            <Image 
              src="/images/img_screenshot_20250505_at_223813.png" alt="Code Editor Screenshot" 
              width={1100} 
              height={683} 
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-12">
          <div className="text-center mb-10">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              Boost your productivity
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[540px] mx-auto mb-6">
              A more effective way to work
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[535px] mx-auto">
              Effortlessly turn your ideas into a fully functional, responsive,
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-20">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative rounded-[24px] border border-[#eff0f6] shadow-md p-10 ${
                  plan.isPopular ? 'bg-black text-white' : 'bg-white' } ${plan.id === 2 ?'transform -translate-y-4 z-10' : ''}`}
                style={{ 
                  width: plan.id === 2 ? '527px' : plan.id === 3 ? '650px' : '351px',
                  height: plan.id === 3 ? 'auto' : '351px'
                }}
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
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-12 max-w-3xl">
          <h2 className="text-[54px] font-bold text-black text-center mb-10">
            Frequently asked questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Accordion key={faq.id} title={faq.question}>
                <p className="text-[16px] text-gray-700">{faq.answer}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#d2dcff]">
        <div className="container mx-auto px-12 text-center">
          <h2 className="text-[54px] font-bold text-black mb-4">
            Sign up for free today
          </h2>
          
          <p className="text-[16px] text-[#010d3e] max-w-[447px] mx-auto mb-10">
            Celebrate the joy of accomplishment with an extension designed to improve your workflow
          </p>
          
          <div className="flex justify-center items-center space-x-4">
            <Button 
              variant="primary" className="rounded-[10px] bg-black text-white px-4 py-2"
            >
              Sign Up
            </Button>
            
            <Link href="#" className="flex items-center text-[16px] font-medium text-black">
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
      </section>
      
      <Footer />
    </main>
  );
}