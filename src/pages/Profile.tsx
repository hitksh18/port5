import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Edit, LogOut, ShoppingBag, Clock, Settings, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    stylePreference: '',
    gender: ''
  });

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={24} className="text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{profile.name || 'User Profile'}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="flex items-center space-x-2 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  <Edit size={16} />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="mt-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="stylePreference" className="text-gray-900 dark:text-white">Style Preference</Label>
                  <select
                    id="stylePreference"
                    value={profile.stylePreference}
                    onChange={(e) => setProfile({...profile, stylePreference: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Style</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Classic">Classic</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="gender" className="text-gray-900 dark:text-white">Gender</Label>
                  <select
                    id="gender"
                    value={profile.gender}
                    onChange={(e) => setProfile({...profile, gender: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-4">
                  <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                    Cancel
                  </Button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Cart Overview */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/orders')}
                  variant="outline"
                  className="w-full justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  <Clock className="mr-2" size={16} />
                  Order History
                </Button>
                
                <Button
                  onClick={() => navigate('/saved')}
                  variant="outline"
                  className="w-full justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  <Heart className="mr-2" size={16} />
                  Saved Collections
                </Button>
                
                <Button
                  onClick={() => navigate('/settings')}
                  variant="outline"
                  className="w-full justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  <Settings className="mr-2" size={16} />
                  Settings
                </Button>
              </div>
            </motion.div>

            {/* Cart Overview */}
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShoppingBag className="mr-2" size={16} />
                  Cart Overview
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Items:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{cart.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/cart')}
                    className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    View Cart
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;