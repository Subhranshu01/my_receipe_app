import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebaseConfig from '../configuration';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser; // Get current user directly

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchRecipes = async () => {
      try {
        const recipesRef = ref(database, 'recipes');
        // Query recipes ordered by 'createdAt' in descending order
        const q = query(recipesRef, orderByChild('createdAt'));
        const snapshot = await get(q);

        if (snapshot.exists()) {
          const recipesList = [];
          snapshot.forEach(childSnapshot => {
            recipesList.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          // Reverse the list to have the most recent items first
          setRecipes(recipesList.reverse());
        } else {
          setRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Error fetching recipes');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const favoritesRef = ref(database, `users/${user.uid}/favorites`);
        const snapshot = await get(favoritesRef);
        if (snapshot.exists()) {
          // Convert the object to an array of recipe IDs
          const favoriteIds = Object.keys(snapshot.val() || {});
          setFavorites(favoriteIds);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Error fetching favorites');
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [navigate, user]);

  const toggleFavorite = async (recipeId) => {
    try {
      const userFavoritesRef = ref(database, `users/${user.uid}/favorites/${recipeId}`);
      const snapshot = await get(userFavoritesRef);

      if (snapshot.exists()) {
        await set(userFavoritesRef, null);
        setFavorites(prev => prev.filter(id => id !== recipeId));
      } else {
        await set(userFavoritesRef, true);
        setFavorites(prev => [...prev, recipeId]);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      setError('Error updating favorites');
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesText = recipe.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = searchCategory ? recipe.category === searchCategory : true;
    return matchesText && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="w-12 h-12 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 min-h-screen p-6">
      <div className="absolute inset-0 bg-opacity-10 bg-gray-800"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Recipes</h1>
        <div className="mb-8 flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 overflow-y-scroll max-h-60"
          >
            <option value="">All Categories</option>
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
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <div key={recipe.id} className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover mt-4 mb-2 rounded-md" />
                )}
                <p className="mt-2 text-gray-700"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p className="mt-2 text-gray-700"><strong>Instructions:</strong> {recipe.instructions}</p>
                <p className="mt-2 text-gray-700"><strong>Category:</strong> {recipe.category}</p>
                <svg
                  onClick={() => toggleFavorite(recipe.id)}
                  className={`absolute top-4 right-4 w-6 h-6 cursor-pointer ${favorites.includes(recipe.id) ? 'text-red-600' : 'text-gray-400'} fill-current`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No recipes found. Try adjusting your search criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
