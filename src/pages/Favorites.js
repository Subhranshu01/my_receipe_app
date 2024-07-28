import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
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
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Favorite Recipes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.length > 0 ? (
            favorites.map(recipe => (
              <div key={recipe.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover mt-4 mb-2 rounded-md" />
                )}
                <p className="mt-2 text-gray-700"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p className="mt-2 text-gray-700"><strong>Instructions:</strong> {recipe.instructions}</p>
                <p className="mt-2 text-gray-700"><strong>Category:</strong> {recipe.category}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">You have no favorite recipes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteRecipes;
