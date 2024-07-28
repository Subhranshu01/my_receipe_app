import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import AddRecipe from './components/Recipes/AddRecipe';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from "./components/Dashboards/Dashboard";

import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout'; // Import Layout component

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="add-recipe" element={<ProtectedRoute component={<AddRecipe />} />} />
            <Route path="login" element={<PublicRoute component={<Login />} />} />
            <Route path="register" element={<PublicRoute component={<Register />} />} />
            <Route path="dashboard" element={<ProtectedRoute component={<Dashboard />} />} />
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Helper component to handle protected routes
const ProtectedRoute = ({ component }) => {
  const { user } = useAuth();
  return user ? component : <Navigate to="/login" />;
};

// Helper component to handle public routes
const PublicRoute = ({ component }) => {
  const { user } = useAuth();
  return !user ? component : <Navigate to="/" />;
};

export default App;
