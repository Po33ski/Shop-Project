import { useState, useEffect } from 'react';

const FAVOURITES_STORAGE_KEY = 'shop-favourites';

export function useFavourites() {
  const [favourites, setFavourites] = useState([]);

  // Load favourites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
      if (stored) {
        const parsedFavourites = JSON.parse(stored);
        setFavourites(parsedFavourites);
      }
    } catch (error) {
      console.error('Error loading favourites from localStorage:', error);
      setFavourites([]);
    }
  }, []);

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
    } catch (error) {
      console.error('Error saving favourites to localStorage:', error);
    }
  }, [favourites]);

  const addToFavourites = (productId) => {
    const numericProductId = Number(productId);
    
    // Check if already in favourites
    if (favourites.some(fav => fav.productId === numericProductId)) {
      console.warn('Product already in favourites:', numericProductId);
      return false;
    }

    const newFavourite = {
      id: Date.now(), // Simple ID generation
      productId: numericProductId,
      createdAt: new Date().toISOString()
    };

    setFavourites(prev => [...prev, newFavourite]);
    return true;
  };

  const removeFromFavourites = (favouriteId) => {
    const numericFavouriteId = Number(favouriteId);
    setFavourites(prev => prev.filter(fav => fav.id !== numericFavouriteId));
    return true;
  };

  const removeProductFromFavourites = (productId) => {
    const numericProductId = Number(productId);
    setFavourites(prev => prev.filter(fav => fav.productId !== numericProductId));
    return true;
  };

  const isInFavourites = (productId) => {
    const numericProductId = Number(productId);
    return favourites.some(fav => fav.productId === numericProductId);
  };

  const clearFavourites = () => {
    setFavourites([]);
  };

  return {
    favourites,
    addToFavourites,
    removeFromFavourites,
    removeProductFromFavourites,
    isInFavourites,
    clearFavourites,
    count: favourites.length
  };
}
