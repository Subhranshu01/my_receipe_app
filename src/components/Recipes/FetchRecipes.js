// src/components/Recipes/FetchRecipes.js
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../configuration';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const fetchRecipes = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const recipesRef = ref(database, 'recipes');
    const q = query(recipesRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(q);

    if (snapshot.exists()) {
      const recipeList = [];
      snapshot.forEach(childSnapshot => {
        recipeList.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      return recipeList;
    } else {
      return []; // No recipes found
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error; // Propagate the error for handling in the calling code
  }
};

export default fetchRecipes;

