import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { user } = useAuth(); // Access authentication state

  return (
    <div className="flex flex-col min-h-full">
      {user && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <Header /> {/* Header will be fixed */}
        </header>
      )}
      <main className="flex-grow">
        <Outlet /> {/* Render child routes */}
      </main>
      <Footer /> {/* Always render Footer */}
    </div>
  );
};

export default Layout;
