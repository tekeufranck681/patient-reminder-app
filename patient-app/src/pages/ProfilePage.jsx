import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Bell, Globe, Palette, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { usePatientStore } from '../stores/patientStore';
import { useToast } from '../contexts/ToastContext';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { profile, loading, isUpdating, error, fetchProfile, updateProfile, clearError } = usePatientStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    notification_preferences: 'email',
    language_preferences: 'en',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        await fetchProfile();
      } catch (error) {
        addToast(error.message || 'Failed to load profile', 'error');
      }
    };

    loadProfile();
  }, [isAuthenticated, user, fetchProfile, addToast]);

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        notification_preferences: profile.notification_preferences || 'email',
        language_preferences: profile.language_preferences || 'en',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
      clearError();
    }
  }, [error, addToast, clearError]);

  const validateForm = () => {
    const newErrors = {};
    
    // Basic required fields are not required for profile update
    // Users can update only the fields they want to change
    
    // Email validation - only if provided
    if (formData.email && formData.email.trim()) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('invalidEmail');
      }
    }
    
    // Phone validation - only if provided
    if (formData.phone_number && formData.phone_number.trim()) {
      // Basic phone number validation (you can make this more strict if needed)
      if (formData.phone_number.length !== 9) {
        newErrors.phone_number = t('invalidPhoneNumber');
      }
    }

    // Password validation - only if user entered a new password
    if (formData.new_password && formData.new_password.trim()) {
      const password = formData.new_password;
      
      // Length check
      if (password.length < 6) {
        newErrors.new_password = t('passwordTooShort');
      }
      // At least one number
      else if (!/\d/.test(password)) {
        newErrors.new_password = 'Password must contain at least one number';
      }
      // At least one uppercase letter
      else if (!/[A-Z]/.test(password)) {
        newErrors.new_password = 'Password must contain at least one uppercase letter';
      }
      // At least one lowercase letter
      else if (!/[a-z]/.test(password)) {
        newErrors.new_password = 'Password must contain at least one lowercase letter';
      }
      
      // Confirmation password check
      if (!formData.confirm_password || password !== formData.confirm_password) {
        newErrors.confirm_password = t('passwordsDoNotMatch');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Prepare data for submission - only include non-empty fields
      const submissionData = {};
      
      if (formData.first_name && formData.first_name.trim()) {
        submissionData.first_name = formData.first_name.trim();
      }
      
      if (formData.last_name && formData.last_name.trim()) {
        submissionData.last_name = formData.last_name.trim();
      }
      
      if (formData.email && formData.email.trim()) {
        submissionData.email = formData.email.trim();
      }
      
      if (formData.phone_number && formData.phone_number.trim()) {
        submissionData.phone_number = formData.phone_number.trim();
      }
      
      if (formData.address && formData.address.trim()) {
        submissionData.address = formData.address.trim();
      }
      
      if (formData.notification_preferences) {
        submissionData.notification_preferences = formData.notification_preferences;
      }
      
      if (formData.language_preferences) {
        submissionData.language_preferences = formData.language_preferences;
      }

      // Only include password if user provided one and it's valid
      if (formData.new_password && formData.new_password.trim()) {
        submissionData.password = formData.new_password;
      }

      // Check if there's anything to update
      if (Object.keys(submissionData).length === 0) {
        addToast('No changes to save', 'info');
        return;
      }

      const result = await updateProfile(submissionData);
      
      addToast(t('profileUpdated'), 'success');
      
      // Clear password fields after successful submission
      setFormData(prev => ({
        ...prev,
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      console.error('Frontend - Update error:', error);
      addToast(error.message || t('updateError'), 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || '' }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Patient Profile Settings",
    "description": "Manage your personal information, contact details, and account preferences",
    "mainEntity": {
      "@type": "Person",
      "name": profile ? `${profile.first_name} ${profile.last_name}` : "Patient"
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={t('profile')}
        description="Manage your personal information, contact details, notification preferences, and account settings securely."
        keywords="profile settings, personal information, account management, preferences, contact details"
        structuredData={structuredData}
      />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('profile')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('manageAccountSettings')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('personalInformation')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('firstName')} <span className="text-gray-400">({t('optional')})</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.first_name 
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="Enter your first name"
                      />
                    </div>
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('lastName')} <span className="text-gray-400">({t('optional')})</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.last_name 
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="Enter your last name"
                      />
                    </div>
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('email')} <span className="text-gray-400">({t('optional')})</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.email 
                          ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('phoneNumber')} <span className="text-gray-400">({t('optional')})</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number || ''}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.phone_number 
                          ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone_number}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('address')} <span className="text-gray-400">({t('optional')})</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('newPassword')} <span className="text-gray-400">({t('optional')})</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.new_password 
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder={t('enterNewPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.new_password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.new_password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.confirm_password 
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder={t('confirmNewPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirm_password}</p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="notification_preferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('notificationPreferences')}
                    </label>
                    <div className="relative">
                      <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="notification_preferences"
                        name="notification_preferences"
                        value={formData.notification_preferences}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="sms">SMS</option>
                        <option value="voice">Voice</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="language_preferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('language')}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="language_preferences"
                        name="language_preferences"
                        value={formData.language_preferences}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('saveChanges')}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-gray-900 dark:text-white">{profile.first_name} {profile.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{profile.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Doctors</p>
                  <p className="text-gray-900 dark:text-white">{profile.doctors?.length || 0} doctor(s)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
