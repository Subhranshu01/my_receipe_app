import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the custom hook

const Header = () => {
  const { user, logout } = useAuth(); // Access authentication state and logout function
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipe Sharing App</h1>
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => handleNavClick('/')}>Home</Link>
          <Link to="/my-recipes" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => handleNavClick('/my-recipes')}>My Recipes</Link>
          <Link to="/favorites" className="hover:bg-pink-700 px-3 py-2 rounded" onClick={() => handleNavClick('/favorites')}>Favorites</Link>
          <Link to="/add-recipe" className="hover:bg-green-700 px-3 py-2 rounded" onClick={() => handleNavClick('/add-recipe')}>Add Recipe</Link>
          {user ? (
            <Link to="/" onClick={handleLogout} className="hover:bg-red-600 px-3 py-2 rounded">Logout</Link>
          ) : (
            <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
          )}
        </nav>
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            id="mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-2 mt-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => handleNavClick('/')}>Home</Link>
            <Link to="/my-recipes" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => handleNavClick('/my-recipes')}>My Recipes</Link>
            <Link to="/favorites" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => handleNavClick('/favorites')}>Favorites</Link>
            <Link to="/add-recipe" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => handleNavClick('/add-recipe')}>Add Recipe</Link>
            {user ? (
              <Link to="/" onClick={handleLogout} className="hover:bg-blue-700 px-3 py-2 rounded">Logout</Link>
            ) : (
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
