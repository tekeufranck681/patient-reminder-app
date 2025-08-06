import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Users, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  History
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = ({ onLogout }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'home', path: '/home', icon: Home, label: t('home') },
    { id: 'doctors', path: '/doctors', icon: Users, label: t('doctors') },
    { id: 'feedback', path: '/feedback', icon: MessageSquare, label: t('feedback') },
    { id: 'profile', path: '/profile', icon: User, label: t('profile') },
    { id: 'pastFeedbacks', path: '/past-feedbacks', icon: History, label: t('pastFeedbacks') }
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <Heart className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EcoHealth</h1>
            )}
          </div>
          {/* Desktop collapse toggle with chevron */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-2' : 'justify-between'}`}>
          <ThemeToggle />
          {!isCollapsed && <LanguageSwitcher />}
          {isCollapsed && <LanguageSwitcher />}
        </div>
        
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500`}
          title={isCollapsed ? t('logout') : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">{t('logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out flex-shrink-0`}>
        <div className="fixed top-0 left-0 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-md z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
