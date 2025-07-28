import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to your EcoHealth patient dashboard."
        keywords="404, page not found, error"
      />
      
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="text-6xl font-bold text-gray-300 dark:text-gray-600">
            404
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('pageNotFound')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pageNotFoundDesc')}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Home className="h-4 w-4" />
              <span>{t('backToDashboard')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
