import React, { useState, useRef } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../configuration'; // Adjust the import path as needed
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!title || !ingredients || !instructions || !category || !image) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Upload image to Firebase Storage
      let imageUrl = '';
      if (image) {
        const imageRef = storageRef(storage, 'recipes/' + Date.now() + '/' + image.name);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Generate a unique ID for the new recipe
      const newRecipeRef = ref(database, 'recipes/' + Date.now());

      await set(newRecipeRef, {
        title,
        ingredients,
        instructions,
        category,
        userId,
        createdAt: new Date().toISOString(), // Use ISO string format for date
        imageUrl, // Store the image URL
      });

      setSuccess('Recipe added successfully!');
      // Clear form after successful submission
      setTitle('');
      setIngredients('');
      setInstructions('');
      setCategory('');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input field
      }
    } catch (err) {
      setError('An error occurred while adding the recipe. Please try again.');
      console.error('Error adding recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Add Recipe</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-700">Ingredients</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="instructions" className="block text-sm font-semibold text-gray-700">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="" disabled>Select a category</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Salad">Salad</option>
            <option value="Soup">Soup</option>
            <option value="Beverage">Beverage</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Side Dish">Side Dish</option>
            <option value="Snack">Snack</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Seafood">Seafood</option>
            <option value="Pasta">Pasta</option>
            <option value="Pizza">Pizza</option>
            <option value="Bread">Bread</option>
            <option value="BBQ">BBQ</option>
            <option value="Sandwich">Sandwich</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">Image</label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            ref={fileInputRef}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Recipe'}
        </button>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        {success && <p className="text-green-600 text-center mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default AddRecipe;
