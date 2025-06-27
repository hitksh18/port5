import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Bell, Shield, User, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    scanReminders: true
  });
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: ''
  });
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: '123 Main St, City, State 12345',
      isDefault: true
    }
  ]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSavePersonalInfo = () => {
    // Implement save logic
    alert('Personal information updated successfully!');
  };

  const handleChangePassword = () => {
    // Implement password change logic
    alert('Password change functionality would be implemented here');
  };

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
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your account preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              {isDarkMode ? <Moon className="mr-2" size={20} /> : <Sun className="mr-2" size={20} />}
              Appearance
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-900 dark:text-white">Dark Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Toggle between light and dark themes</p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name" className="text-gray-900 dark:text-white">Full Name</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
                <Input
                  id="email"
                  value={personalInfo.email}
                  disabled
                  className="mt-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={handleSavePersonalInfo} className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                Save Changes
              </Button>
              <Button onClick={handleChangePassword} variant="outline" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Change Password
              </Button>
            </div>
          </motion.div>

          {/* Delivery Addresses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Delivery Addresses
            </h2>
            
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">{address.type}</span>
                        {address.isDefault && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{address.address}</p>
                    </div>
                    <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Add New Address
              </Button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="mr-2" size={20} />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Order Updates</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get notified about order status changes</p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Promotions</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Receive promotional offers and discounts</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Scan Reminders</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Reminders to update your body scan</p>
                </div>
                <Switch
                  checked={notifications.scanReminders}
                  onCheckedChange={(checked) => setNotifications({...notifications, scanReminders: checked})}
                />
              </div>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="mr-2" size={20} />
              Privacy & Security
            </h2>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Terms of Service
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;