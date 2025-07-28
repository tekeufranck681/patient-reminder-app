import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { usePatientStore } from '../stores/patientStore';
import { Users, X, Info } from 'lucide-react';
import SEO from '../components/SEO';

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { profile, doctors, fetchDoctors, fetchProfile } = usePatientStore();
  const [showPasswordBanner, setShowPasswordBanner] = useState(false);

  // Check localStorage for banner dismissal state
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('passwordBannerDismissed');
    if (!bannerDismissed) {
      setShowPasswordBanner(true);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchDoctors().catch(console.error);
      fetchProfile().catch(console.error);
    }
  }, [user?.id, fetchDoctors, fetchProfile]);

  // Merge doctors data from both sources
  const mergedDoctors = React.useMemo(() => {
    if (!doctors || !profile?.doctors) return [];

    const merged = [];
    profile.doctors.forEach(profileDoctor => {
      const doctorDetails = doctors.length > 0 ? doctors[0] : null;
      
      if (doctorDetails && doctorDetails.full_name) {
        merged.push({
          ...doctorDetails,
          id: `${profileDoctor.doctor_id}-${profileDoctor.department}`,
          doctor_id: profileDoctor.doctor_id,
          department: profileDoctor.department,
          specialty: profileDoctor.specialty || doctorDetails.specialty,
          full_name: doctorDetails.full_name
        });
      } else {
        merged.push({
          id: `${profileDoctor.doctor_id}-${profileDoctor.department}`,
          doctor_id: profileDoctor.doctor_id,
          department: profileDoctor.department,
          specialty: profileDoctor.specialty,
          full_name: `Doctor ${profileDoctor.doctor_id.slice(0, 8)}`
        });
      }
    });

    return merged;
  }, [doctors, profile?.doctors]);

  const handleDismissBanner = () => {
    localStorage.setItem('passwordBannerDismissed', 'true');
    setShowPasswordBanner(false);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EcoHealth Patient Portal",
    "description": "Patient dashboard for managing healthcare information and connecting with medical professionals",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SEO 
        title={t('home')}
        description="Access your personalized healthcare dashboard, view assigned doctors, and manage your medical information securely."
        keywords="patient dashboard, healthcare portal, medical records, assigned doctors"
        structuredData={structuredData}
      />
      
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">
            {t('welcomeBack')}, {user?.sub || user?.email}!
          </h1>
          <p className="text-blue-100">
            {t('healthOverviewToday')}
          </p>
        </motion.div>

        {/* Password Change Banner */}
        <AnimatePresence>
          {showPasswordBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    If this is your first time accessing your account, please change your password. Otherwise, you can safely ignore this message.
                  </p>
                </div>
                <button
                  onClick={handleDismissBanner}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Doctors Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('myDoctors')}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('totalAssigned')}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {mergedDoctors?.length || 0}
              </span>
            </div>
            
            {mergedDoctors?.slice(0, 3).map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Dr. {doctor.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doctor.department}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doctor.specialty || t('generalPractice')}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {(!mergedDoctors || mergedDoctors.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                {t('noDoctorsAssigned')}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;
