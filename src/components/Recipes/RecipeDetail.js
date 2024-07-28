// src/components/Recipes/RecipeDetail.js
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../configuration';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const RecipeDetail = ({ recipe }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSaveFavorite = async () => {
    const userId = auth.currentUser.uid;
    try {
      const userFavoritesDoc = doc(firestore, 'users', userId, 'favorites', recipe.id);
      await setDoc(userFavoritesDoc, recipe);
      setIsFavorite(true);
    } catch (error) {
      console.error('Error saving favorite recipe:', error);
    }
  };

  return (
    <div>
      <h2>{recipe.title}</h2>
      <p>{recipe.ingredients}</p>
      <p>{recipe.instructions}</p>
      <button onClick={handleSaveFavorite} disabled={isFavorite}>
        {isFavorite ? 'Saved' : 'Save'}
      </button>
    </div>
  );
};

export default RecipeDetail;
