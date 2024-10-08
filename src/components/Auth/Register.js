import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../configuration'; // Update path as needed

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url("/images/reg.jpg")' }} // Absolute path to image
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Optional overlay for better text visibility */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white bg-opacity-90 p-6 md:p-8 lg:p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center text-gray-800">Register</h2>
          {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4 font-semibold">{success}</p>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm md:text-base font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 ease-in-out"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm md:text-base font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 ease-in-out"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="mt-4 md:mt-6 text-center text-gray-600 text-sm md:text-base">
            Already have an account?{' '}
            <a href="/login" className="text-teal-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
