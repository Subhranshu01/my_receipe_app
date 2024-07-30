import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext'; // Use AuthContext for authentication
import firebaseConfig from '../configuration';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const FavoriteRecipes = () => {
  const { user } = useAuth(); // Access authentication state
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const favoritesRef = ref(database, `users/${user.uid}/favorites`);
        const snapshot = await get(favoritesRef);

        if (snapshot.exists()) {
          const favoriteIds = Object.keys(snapshot.val());
          const recipesPromises = favoriteIds.map(id =>
            get(ref(database, `recipes/${id}`))
          );
          const recipesSnapshots = await Promise.all(recipesPromises);

          const favoriteRecipes = recipesSnapshots.map(snapshot => ({
            id: snapshot.key,
            ...snapshot.val(),
          }));

          setFavorites(favoriteRecipes);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Error fetching favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]); // Depend on `user` to refetch data when user state changes

  const handleRemoveFavorite = async (recipeId) => {
    try {
      // Remove the recipe from the user's favorites
      const userFavoritesRef = ref(database, `users/${user.uid}/favorites/${recipeId}`);
      await remove(userFavoritesRef);
      
      // Remove the recipe from the local state
      setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Error removing favorite');
    }
  };

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

  const backgroundImage = "url('/images/hm.jpg')"; // Update the path to your background image

  return (
    <div
      className="relative min-h-screen p-6"
      style={{
        backgroundImage: backgroundImage,
        backgroundPosition: 'center',
        // Optional: This makes the background fixed during scroll
      }}
    >
      <div className="absolute inset-0 bg-opacity-30 bg-gray-800"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-center text-green-100 mb-8">Favorite Recipes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.length > 0 ? (
            favorites.map(recipe => (
              <div key={recipe.id} className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover mt-4 mb-2 rounded-md" />
                )}
                <p className="mt-2 text-gray-700"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p className="mt-2 text-gray-700"><strong>Instructions:</strong> {recipe.instructions}</p>
                <p className="mt-2 text-gray-700"><strong>Category:</strong> {recipe.category}</p>
                <svg
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  className={`absolute top-4 right-4 w-6 h-6 cursor-pointer ${favorites.some(fav => fav.id === recipe.id) ? 'text-red-600' : 'text-gray-400'} fill-current`}
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
            <p className="text-center text-green-100 font-bold text-2xl">You have no favorite recipes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteRecipes;
