'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitError('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-[103px] bg-gradient-to-b from-[#eaeefe] to-[#183ec2] h-[50vh] min-h-[400px] flex items-center">
        <div className="container mx-auto px-12">
          <div className="pt-0">
            <Tag className="mb-6 bg-white/80 border-[#22222219] text-black">
              Get in touch
            </Tag>
            
            <h1 className="text-[64px] font-bold text-black leading-[70px] max-w-[602px] mb-6">
              Contact us
            </h1>
            
            <p className="text-[22px] text-[#010d3e] max-w-[500px] mb-6">
              Have questions or feedback? We'd love to hear from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <h2 className="text-[36px] font-bold text-black mb-8">Send us a message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Image src="/images/success-icon.svg" alt="Success" width={48} height={48} className="mx-auto mb-4" />
                  <h3 className="text-[24px] font-bold text-green-700 mb-2">Message Sent!</h3>
                  <p className="text-[16px] text-green-600 mb-6">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="primary" 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => setSubmitSuccess(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputField 
                      label="Your Name" 
                      name="name" 
                      value={formState.name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      required 
                    />
                    <InputField 
                      label="Email Address" 
                      name="email" 
                      type="email" 
                      value={formState.email} 
                      onChange={handleChange} 
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                  
                  <InputField 
                    label="Subject" 
                    name="subject" 
                    value={formState.subject} 
                    onChange={handleChange} 
                    placeholder="How can we help you?" 
                    className="mb-6"
                    required 
                  />
                  
                  <TextArea 
                    label="Message" 
                    name="message" 
                    value={formState.message} 
                    onChange={handleChange} 
                    placeholder="Your message here..." 
                    className="mb-8"
                    required 
                  />
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                      <p className="text-red-600">{submitError}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="rounded-[10px] bg-black text-white px-8 py-3 h-[50px] text-[16px] font-medium w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 className="text-[36px] font-bold text-black mb-8">Contact Information</h2>
              
              <div className="space-y-10">
                <div className="flex items-start">
                  <div className="bg-[#f0f3ff] p-3 rounded-full mr-6 flex items-center justify-center" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                    <Image src="/images/email-icon.svg" alt="Email" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold mb-2">Email Us</h3>
                    <p className="text-[16px] text-gray-600 mb-1">For general inquiries:</p>
                    <a href="mailto:info@optiprompt.dev" className="text-blue-600 hover:underline">info@optiprompt.dev</a>
                    <p className="text-[16px] text-gray-600 mt-4 mb-1">For support:</p>
                    <a href="mailto:support@optiprompt.dev" className="text-blue-600 hover:underline">support@optiprompt.dev</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#f0f3ff] p-3 rounded-full mr-6 flex items-center justify-center" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                    <Image src="/images/phone-icon.svg" alt="Phone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold mb-2">Call the CEO</h3>
                    <p className="text-[16px] text-gray-600 mb-4">
                      Have an urgent matter or want to discuss a business opportunity? Reach out directly to our CEO.
                    </p>
                    <a href="tel:+4915259722072" className="text-blue-600 hover:underline text-[16px] font-medium">+49 15259722072</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#f0f3ff] p-3 rounded-full mr-6 flex items-center justify-center" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                    <Image src="/images/social-icon.svg" alt="Social" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold mb-2">Follow Us</h3>
                    <p className="text-[16px] text-gray-600 mb-4">
                      Stay up to date with our latest news and updates.
                    </p>
                    <div className="flex space-x-4">
                      <a href="https://twitter.com/optiprompt" target="_blank" rel="noopener noreferrer" className="bg-[#f0f3ff] p-2 rounded-full hover:bg-[#e0e5ff]">
                        <Image src="/images/twitter-icon.svg" alt="Twitter" width={24} height={24} />
                      </a>
                      <a href="https://github.com/optiprompt" target="_blank" rel="noopener noreferrer" className="bg-[#f0f3ff] p-2 rounded-full hover:bg-[#e0e5ff]">
                        <Image src="/images/github-icon.svg" alt="GitHub" width={24} height={24} />
                      </a>
                      <a href="https://linkedin.com/company/optiprompt" target="_blank" rel="noopener noreferrer" className="bg-[#f0f3ff] p-2 rounded-full hover:bg-[#e0e5ff]">
                        <Image src="/images/linkedin-icon.svg" alt="LinkedIn" width={24} height={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-white to-[#d2dcff]">
        <div className="container mx-auto px-12 text-center">
          <h2 className="text-[54px] font-bold text-black mb-6">
            Ready to enhance your coding?
          </h2>
          
          <p className="text-[18px] text-[#010d3e] max-w-[550px] mx-auto mb-12">
            Try the OptiPrompt VS Code extension today and experience the difference in your AI-powered coding workflow
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
            
            <Link href="/" className="flex items-center text-[16px] font-medium text-black hover:text-blue-600 transition-colors">
              Back to Home
              <Image 
                src="/images/img_icons.svg" alt="Home" 
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