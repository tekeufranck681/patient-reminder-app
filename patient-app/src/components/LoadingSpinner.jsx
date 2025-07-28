import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 'md', text = null }) => {
  const { t } = useTranslation();
  
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <motion.div
        className={`${sizes[size]} border-2 border-gray-300 border-t-blue-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text !== null && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {text || t('loading')}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;