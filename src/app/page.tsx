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
import { BILLING_ENABLED } from '@/lib/config';

export default function Home() {
  const features: FeatureCard[] = [
    {
      id: 1,
      title: 'Universal IDE Compatibility',
      description: 'OptiPrompt\'s MCP server integrates seamlessly with any IDE that supports the Model Context Protocol, including VS Code, Cursor, Windsurf, and more.',
      icon: '/images/github-icon.svg'
    },
    {
      id: 2,
      title: 'Intelligent Context Augmentation',
      description: 'Our advanced meta-prompting engine analyzes your codebase to provide AI assistants with perfect context, resulting in code that matches your project\'s patterns and practices.',
      icon: '/images/vscode-icon.svg'
    },
    {
      id: 3,
      title: 'Customizable Standards',
      description: 'Define your engineering team\'s coding standards as meta-prompting rules that ensure all AI-generated code follows your organization\'s best practices.',
      icon: '/images/success-icon.svg'
    },
    {
      id: 4,
      title: 'Multi-Assistant Compatible',
      description: 'Works with Claude, ChatGPT and other AI coding assistants to deliver consistent results regardless of which AI you prefer to use.',
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
        'Compatible with all MCP-enabled IDEs',
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
        '100 enhancements per day',
        'Compatible with all MCP-enabled IDEs',
        'Early Access to new features',
        'Advanced context optimization',
        'Priority support'
      ],
      buttonText: BILLING_ENABLED ? 'Sign up now' : 'Coming soon',
      isPopular: true,
      buttonVariant: 'secondary'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'What is the Model Context Protocol (MCP)?',
      answer: 'MCP is an open protocol that standardizes how applications provide context to LLMs. It creates a consistent way for AI models to access your codebase, tools, and other context, regardless of which IDE you use.'
    },
    {
      id: 2,
      question: 'How does OptiPrompt work?',
      answer: 'OptiPrompt uses advanced meta-prompting techniques through our MCP server to analyze your codebase and conversation context, then automatically enhances prompts to generate more accurate, idiomatic, and maintainable code from AI coding assistants.'
    },
    {
      id: 3,
      question: 'What IDEs are compatible with OptiPrompt?',
      answer: 'OptiPrompt works with any IDE that supports the Model Context Protocol (MCP), including VS Code, Cursor, Claude Desktop, Windsurf, and many others. The list of compatible IDEs continues to grow as MCP adoption increases.'
    },
    {
      id: 4,
      question: 'Can I cancel my subscription?',
      answer: BILLING_ENABLED 
        ? 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
        : 'Paid subscriptions are not yet available. OptiPrompt is currently free while we\'re in early access.'
    },
    {
      id: 5,
      question: 'When will Pro plan be available?',
      answer: 'We\'re working on enabling paid Pro subscriptions. For now, OptiPrompt is completely free. Stay tuned for updates!'
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-[103px] bg-gradient-to-b from-[#eaeefe] to-[#183ec2] h-[100vh] min-h-[800px] flex items-center">
        <div className="container mx-auto px-12">
          <div className="pt-0">
            
            <h1 className="text-[60px] md:text-[90px] font-bold text-black leading-[1.1] md:leading-[90px] max-w-[640px] mb-10">
              Supercharge AI coding with MCP
            </h1>
            
            <p className="text-[22px] text-[#010d3e] max-w-[500px] mb-12">
              OptiPrompt's MCP server seamlessly enhances any IDE with advanced meta-prompting, delivering precisely tailored code for your projects.
            </p>
            
            <Link href="/login?next=/setup">
              <Button 
                variant="primary" 
                className="rounded-[10px] bg-black hover:bg-gray-800 transition-colors text-white px-8 py-4 text-[18px] font-medium"
              >
                Get Started
              </Button>
            </Link>
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
              Our MCP server technology saves engineering teams valuable development time by intelligently enhancing prompts with contextual code awareness and best practices
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
          
          {/* MCP Server CTA */}
          <div id="mcp-setup" className="mt-24 bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image src="/images/chat-icon.svg" alt="MCP" width={64} height={64} />
            </div>
            <h3 className="text-[36px] font-bold text-black mb-4">
              Elevate your development workflow today
            </h3>
            <p className="text-[18px] text-[#010d3e] max-w-[600px] mx-auto mb-8">
              Set up our MCP server and leverage advanced meta-prompting to get higher-quality, production-ready code from your AI assistant. Compatible with any IDE that supports the Model Context Protocol.
            </p>
            <Link href="/login?next=/setup">
              <Button 
                variant="primary" className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-4 text-[18px] font-medium flex items-center mx-auto"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* What is MCP Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-12">
          <div className="text-center mb-16">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              MCP Technology
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[540px] mx-auto mb-6">
              What is the Model Context Protocol?
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[700px] mx-auto mb-16">
              The Model Context Protocol (MCP) is an open standard that connects AI coding assistants with external tools and context sources. Think of MCP as a USB-C port for AI applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-[32px] font-bold text-black mb-4">How OptiPrompt MCP Works</h3>
              <p className="text-[18px] text-[#010d3e] mb-6">
                OptiPrompt's MCP server analyzes your codebase to provide AI assistants with perfect context for your projects. This ensures that AI-generated code matches your project's patterns and practices.
              </p>
              <p className="text-[18px] text-[#010d3e] mb-6">
                Our server seamlessly integrates with any MCP-compatible IDE, including VS Code, Cursor, Claude Desktop, and more, providing a consistent experience across your entire development workflow.
              </p>
              <p className="text-[18px] text-[#010d3e]">
                With OptiPrompt MCP, you get context-aware coding assistance that understands your project's structure, coding style, and best practices.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/images/mcp_overview.png" alt="MCP Architecture" 
                width={540} 
                height={360}
                className="w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#eaeefe]">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 md:items-stretch">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative rounded-[24px] border border-[#eff0f6] shadow-md p-10 flex flex-col h-full ${
                  plan.isPopular ? "bg-[#010d3e] text-white" : "bg-white text-black"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 transform translate-x-[0px] -translate-y-[14px]">
                    <div className="bg-[#2EC973] text-white text-xs font-bold px-6 py-1 rounded-full shadow-md">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className={`text-3xl font-bold ${plan.isPopular ? "text-white" : "text-black"}`}>
                    {plan.name}
                  </h3>
                </div>
                
                <div className="mt-2 mb-8">
                  <p className={`text-5xl font-bold ${plan.isPopular ? "text-white" : "text-black"}`}>
                    {plan.price}
                    <span className="text-xl font-normal ml-1">{plan.period}</span>
                  </p>
                </div>
                
                <div className="flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke={plan.isPopular ? "#ffffff" : "#010d3e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8">
                  {plan.id === 1 ? (
                    // Free plan - link to signup/login
                    <Link href="/login?next=/setup" className="block">
                      <Button 
                        variant={plan.buttonVariant}
                        className={`w-full rounded-[10px] py-3 text-[16px] font-medium ${
                          plan.buttonVariant === "primary"
                            ? "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
                            : "bg-[#010d3e] text-white hover:bg-[#0a1956]"
                        }`}
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  ) : (
                    // Pro plan - check billing flag
                    <>
                      <Button 
                        variant={plan.buttonVariant}
                        disabled={!BILLING_ENABLED}
                        className={`w-full rounded-[10px] py-3 text-[16px] font-medium ${
                          plan.isPopular
                            ? "bg-white text-black hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            : "bg-[#010d3e] text-white hover:bg-[#0a1956] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                        }`}
                      >
                        {plan.buttonText}
                      </Button>
                      {!BILLING_ENABLED && (
                        <p className="text-sm text-gray-600 mt-3 text-center">
                          Paid Pro plan is currently not available. OptiPrompt is free while we're in early access.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-12">
          <div className="text-center mb-16">
            <Tag className="mb-4 mx-auto bg-white/80 border-[#22222219] text-black">
              Questions
            </Tag>
            
            <h2 className="text-[54px] font-bold text-black leading-[60px] max-w-[540px] mx-auto mb-6">
              Frequently asked questions
            </h2>
            
            <p className="text-[22px] text-[#010d3e] max-w-[600px] mx-auto">
              Everything you need to know about OptiPrompt's MCP server solution
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
      <section className="py-20 bg-gradient-to-r from-[#eaeefe] to-[#c1cefa]">
        <div className="container mx-auto px-12">
          <div className="bg-white rounded-[24px] p-12 flex flex-col items-center text-center">
            <h2 className="text-[48px] font-bold text-black mb-6">
              Ready to supercharge your AI coding?
            </h2>
            <p className="text-[22px] text-[#010d3e] max-w-[600px] mb-10">
              Join thousands of developers using OptiPrompt's MCP server to enhance their AI coding experience across any IDE.
            </p>
            <div className="flex gap-6">
              <Link href="/login?next=/setup">
                <Button 
                  variant="primary" 
                  className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 text-[18px] font-medium"
                >
                  Get Started For Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}