'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    stylePreference: ''
  });

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password);
      }
      onClose();
    } catch (error: any) {
      console.error('Authentication error:', error);
      alert(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      alert(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="name" className="text-gray-900">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </motion.div>
                )}

                <div>
                  <Label htmlFor="email" className="text-gray-900">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-900">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {activeTab === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="gender" className="text-gray-900">Gender</Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="stylePreference" className="text-gray-900">Style Preference</Label>
                      <select
                        id="stylePreference"
                        value={formData.stylePreference}
                        onChange={(e) => setFormData({...formData, stylePreference: e.target.value})}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select Style</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Streetwear">Streetwear</option>
                        <option value="Classic">Classic</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-gray-800 py-3"
                >
                  {loading ? 'Please wait...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  className="w-full mt-4 py-3"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setActiveTab('signup')}
                      className="text-black hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-black hover:underline font-medium"
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;