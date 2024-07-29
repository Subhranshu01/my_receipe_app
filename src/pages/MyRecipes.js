import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../configuration';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (userId) {
        try {
          const recipesRef = ref(database, 'recipes');
          const q = query(recipesRef, orderByChild('createdBy'), equalTo(userId));
          const snapshot = await get(q);

          if (snapshot.exists()) {
            const recipesList = [];
            snapshot.forEach(childSnapshot => {
              recipesList.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            // Sort recipes by createdAt in descending order
            recipesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecipes(recipesList);
          } else {
            setRecipes([]);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error.message);
          setError('Error fetching recipes. Please check the console for details.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

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
        
      }}
    >
      <div className="absolute inset-0 bg-opacity-30 bg-gray-800"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-center text-white mb-8">My Recipes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <div key={recipe.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                <p className="mt-2 text-gray-700"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p className="mt-2 text-gray-700"><strong>Instructions:</strong> {recipe.instructions}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-white font-bold">No recipes found. Start adding some recipes to see them here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
