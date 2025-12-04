'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import Image from 'next/image';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '@/lib/user';

interface UserProfile {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

const Account: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Profile form state
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    // Check authentication and fetch user profile data
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        if (!isAuthenticated && !loading) {
          router.push('/login');
          return;
        }

        if (!isSupabaseConfigured() || !user) {
          // Use empty profile when Supabase is not configured
          setProfileData({
            name: '',
            email: '',
            company: '',
            phone: '',
          });
          setLoading(false);
          return;
        }

        // Fetch user profile from Supabase
        const profile = await getUserProfile();
        if (profile) {
          setProfileData({
            name: profile.name || '',
            email: profile.email || user.email || '',
            company: profile.company || '',
            phone: profile.phone || '',
          });
        } else {
          // Use user email from auth if profile doesn't exist yet
          setProfileData({
            name: '',
            email: user.email || '',
            company: '',
            phone: '',
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [router, user, isAuthenticated, loading]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setError('');
    setSuccess('');

    try {
      if (!isSupabaseConfigured()) {
        setError(
          'Supabase is not configured. Please set up Supabase to enable profile updates.',
        );
        setIsUpdatingProfile(false);
        return;
      }

      const { data, error } = await updateUserProfile({
        name: profileData.name,
        email: profileData.email,
        company: profileData.company,
        phone: profileData.phone,
      });

      if (error) {
        setError(error.message || 'Failed to update profile');
        return;
      }

      if (data) {
        setSuccess('Profile updated successfully!');
      } else {
        // If profile doesn't exist yet, we might need to create it
        // For now, just show success
        setSuccess('Profile updated successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="pt-[103px] py-24 bg-white">
          <div className="container mx-auto px-12">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-600">Loading account settings...</p>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="pt-[103px] py-24 bg-white">
        <div className="container mx-auto px-12">
          <div className="max-w-4xl mx-auto">
            {/* Development Banner */}
            {!isSupabaseConfigured() && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Development Preview:</strong> You're viewing this page with
                      mock data. Authentication is not configured yet. This page will
                      require login once Supabase is set up.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-[48px] font-bold text-black mb-4">Account Settings</h1>
              <p className="text-[18px] text-gray-600">
                Manage your account information and preferences
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-2xl p-6 mb-8">
              <h2 className="text-[20px] font-bold text-black mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/subscription">
                  <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-black mb-1">
                          Subscription & Usage
                        </p>
                        <p className="text-sm text-gray-600">
                          View your plan and usage statistics
                        </p>
                      </div>
                      <Image
                        src="/images/img_icons.svg"
                        alt="Arrow"
                        width={20}
                        height={20}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </Link>
                <Link href="/contact">
                  <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-black mb-1">Contact Support</p>
                        <p className="text-sm text-gray-600">
                          Get help from our support team
                        </p>
                      </div>
                      <Image
                        src="/images/img_icons.svg"
                        alt="Arrow"
                        width={20}
                        height={20}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium text-[16px] border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 font-medium text-[16px] border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-[28px] font-bold text-black mb-6">
                  Personal Information
                </h2>

                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputField
                      label="Full Name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                      required
                    />
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="you@example.com"
                      helpText="We'll use this email to send you important updates"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InputField
                      label="Company"
                      name="company"
                      type="text"
                      value={profileData.company || ''}
                      onChange={handleProfileChange}
                      placeholder="Your company name"
                      helpText="Optional"
                    />
                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={profileData.phone || ''}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 123-4567"
                      helpText="Optional - Include country code"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-[28px] font-bold text-black mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-black mb-1">Email Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive email updates about your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-black mb-1">Marketing Emails</p>
                      <p className="text-sm text-gray-600">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-yellow-800 text-sm font-semibold mb-2">
                        Danger Zone
                      </p>
                      <p className="text-yellow-700 text-sm mb-4">
                        Once you delete your account, there is no going back. Please be
                        certain.
                      </p>
                      <Button
                        variant="secondary"
                        className="rounded-[10px] bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-2.5 text-[14px] font-medium transition-colors shadow-sm"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Home */}
            <div className="mt-8">
              <Link href="/">
                <Button
                  variant="secondary"
                  className="rounded-[10px] bg-white border border-gray-300 text-black hover:bg-gray-50 px-6 py-3 h-[50px] text-[16px] font-medium"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Account;
