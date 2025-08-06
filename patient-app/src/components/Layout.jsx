import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatBotWidget from './ChatBot/ChatBotWidget';

const Layout = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <ChatBotWidget />
    </div>
  );
};

export default Layout;
