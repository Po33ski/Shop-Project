import { createContext, useContext } from 'react';

const FavouritesContext = createContext();

export function useFavouritesContext() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavouritesContext must be used within a FavouritesProvider');
  }
  return context;
}

export { FavouritesContext };
