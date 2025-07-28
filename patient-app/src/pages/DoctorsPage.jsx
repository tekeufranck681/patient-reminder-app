import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Phone, Mail, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import { usePatientStore } from '../stores/patientStore';
import { useToast } from '../contexts/ToastContext';
import { useAuthStore } from '../stores/authStore';
import SEO from '../components/SEO';

const DoctorsPage = () => {
  const { t } = useTranslation();
  const { doctors, profile, loading, error, fetchDoctors, fetchProfile, clearError } = usePatientStore();
  const { addToast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "My Doctors - EcoHealth",
    "description": "Connect with your assigned healthcare providers and access their contact information",
    "mainEntity": {
      "@type": "MedicalOrganization",
      "name": "DGH Cameroon",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CM"
      }
    }
  };

  useEffect(() => {
    const loadDoctorsData = async () => {
      if (!isAuthenticated || !user) {
        addToast('Please log in to view your doctors', 'error');
        return;
      }

      if (error) {
        clearError();
      }

      try {
        // Fetch both doctors list and profile data
        await Promise.all([
          fetchDoctors(),
          fetchProfile()
        ]);
      } catch (error) {
        console.error('Error loading doctors data:', error);
        addToast(error.message || 'Failed to load doctors', 'error');
      }
    };

    loadDoctorsData();
  }, [isAuthenticated, user?.id, fetchDoctors, fetchProfile, addToast]);

  // Merge doctors data from both sources
  const mergedDoctors = React.useMemo(() => {
    if (!doctors || !profile?.doctors) return [];

    // Debug logging
    console.log('Debug - doctors array:', doctors);
    console.log('Debug - profile.doctors:', profile.doctors);

    // Create merged doctors array based on profile doctor-department combinations
    const merged = [];
    profile.doctors.forEach(profileDoctor => {
      console.log('Debug - Looking for doctor_id:', profileDoctor.doctor_id);
      
      // Since the getDoctors API doesn't return doctor IDs, we'll use the first doctor
      // This assumes the API returns doctors assigned to this patient
      const doctorDetails = doctors.length > 0 ? doctors[0] : null;
      
      console.log('Debug - Using doctorDetails:', doctorDetails);
      
      if (doctorDetails && doctorDetails.full_name) {
        merged.push({
          ...doctorDetails,
          id: `${profileDoctor.doctor_id}-${profileDoctor.department}`,
          doctor_id: profileDoctor.doctor_id,
          department: profileDoctor.department,
          specialty: profileDoctor.specialty || doctorDetails.specialty,
          phone: doctorDetails.phone,
          email: doctorDetails.email,
          full_name: doctorDetails.full_name
        });
        console.log('Debug - Added doctor with full_name:', doctorDetails.full_name);
      } else {
        // Enhanced fallback with more debugging
        console.warn('Debug - Doctor details not found or missing full_name for:', profileDoctor.doctor_id);
        console.warn('Debug - Available doctors:', doctors);
        
        merged.push({
          id: `${profileDoctor.doctor_id}-${profileDoctor.department}`,
          doctor_id: profileDoctor.doctor_id,
          department: profileDoctor.department,
          specialty: profileDoctor.specialty,
          full_name: `Doctor ${profileDoctor.doctor_id.slice(0, 8)}`,
          phone: null,
          email: null
        });
      }
    });

    console.log('Debug - Final merged doctors:', merged);
    return merged;
  }, [doctors, profile?.doctors]);

  // Get unique departments from the merged doctors data
  const availableDepartments = React.useMemo(() => {
    if (!mergedDoctors.length) return [];
    
    const departments = [...new Set(mergedDoctors.map(doctor => doctor.department))];
    return departments.filter(Boolean).sort(); // Remove null/undefined and sort
  }, [mergedDoctors]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('doctors')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with your assigned healthcare providers
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading doctors..." />
        </div>
      </div>
    );
  }

  // Filter doctors based on search and department
  const filteredDoctors = mergedDoctors.filter(doctor => {
    const matchesSearch = doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <>
      <SEO 
        title={t('doctors')}
        description="View and connect with your assigned healthcare providers. Access doctor contact information, specialties, and departments."
        keywords="doctors, healthcare providers, medical specialists, contact information, departments"
        structuredData={structuredData}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('doctors')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with your assigned healthcare providers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name, department, or contact info..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-48"
              >
                <option value="">All Departments</option>
                {availableDepartments.map(department => (
                  <option key={department} value={department}>
                    {t(department.toLowerCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <AnimatePresence>
          {filteredDoctors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {mergedDoctors.length === 0 
                  ? 'No doctors assigned to your account yet'
                  : t('noDoctorsFound')
                }
              </p>
              {mergedDoctors.length === 0 && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Contact your healthcare provider to get assigned to doctors
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Doctor Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                     Doctor {doctor.full_name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {doctor.department}
                    </p>
                    {doctor.specialty && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t(doctor.specialty)}
                      </p>
                    )}
                    {/* Doctor ID */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 break-words">
                      ID: {doctor.doctor_id}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    {doctor.phone && (
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.email && (
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span>{doctor.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>DGH Cameroon</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DoctorsPage;
