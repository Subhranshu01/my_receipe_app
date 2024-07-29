import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../configuration'; // Update path as needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to a protected route after successful login
    } catch (error) {
      setError('Failed to login. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url("/images/background.jpg")' }} // Absolute path to image
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Optional overlay for better text visibility */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white bg-opacity-90 p-6 md:p-8 lg:p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center text-gray-800">Login</h2>
          {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}
          <form onSubmit={handleLogin}>
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
            <div className="mb-6">
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
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600 text-sm md:text-base">
            Don't have an account?{' '}
            <a href="/register" className="text-teal-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
