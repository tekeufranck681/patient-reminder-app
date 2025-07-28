import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

import Sidebar from './Sidebar';
import Modal from './Modal';

const Layout = () => {
  const { logout } = useAuthStore();
  const { addToast } = useToast();
  const { t } = useTranslation();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      addToast('Successfully logged out', 'success');
    } catch (error) {
      addToast('Logout failed', 'error');
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{
            type: 'tween',
            ease: 'anticipate',
            duration: 0.4
          }}
          className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t('logoutConfirm')}
        actions={
          <>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {t('cancel')}
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {t('confirm')}
            </button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          {t('logoutConfirmDesc')}
        </p>
      </Modal>
    </div>
  );
};

export default Layout;