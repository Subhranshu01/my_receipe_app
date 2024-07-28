import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../../configuration';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async (userId) => {
      try {
        const favoritesCollection = collection(firestore, 'users', userId, 'favorites');
        const favoritesSnapshot = await getDocs(favoritesCollection);
        const favoritesList = favoritesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavorites(favoritesList);
      } catch (err) {
        setError('Failed to fetch favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFavorites(user.uid);
      } else {
        setLoading(false);
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (favorites.length === 0) {
    return <div>No favorite recipes found.</div>;
  }

  return (
    <ul>
      {favorites.map(recipe => (
        <li key={recipe.id}>{recipe.title}</li>
      ))}
    </ul>
  );
};

export default Favorites;
