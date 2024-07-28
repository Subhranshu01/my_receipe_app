import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import AddRecipe from './components/Recipes/AddRecipe';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from "./components/Dashboards/Dashboard";
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import the provider and hook

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthRoutes />
      </Router>
    </AuthProvider>
  );
}

const AuthRoutes = () => {
  const { user } = useAuth(); // Access authentication state

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Header />} {/* Conditionally render Header if user is authenticated */}
      <main className="flex-grow container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/add-recipe" element={user ? <AddRecipe /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
