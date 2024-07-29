import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { user } = useAuth(); // Access authentication state

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Header />} {/* Conditionally render Header if user is authenticated */}
      <main className="flex-grow container mx-auto ">
        <Outlet /> {/* Render child routes */}
      </main>
      <Footer /> {/* Always render Footer */}
    </div>
  );
};

export default Layout;
