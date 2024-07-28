// src/components/Recipes/RecipesList.js
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../configuration';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const fetchRecipes = async () => {
  try {
    const recipesCollection = collection(firestore, 'recipes');
    const querySnapshot = await getDocs(recipesCollection);
    const recipeList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return recipeList;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      try {
        const recipeList = await fetchRecipes();
        setRecipes(recipeList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default RecipesList;
