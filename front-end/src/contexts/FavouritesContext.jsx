import { createContext, useContext } from 'react';
import { useFavourites } from '../hooks/useFavourites';

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const favouritesData = useFavourites();

  return (
    <FavouritesContext.Provider value={favouritesData}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavouritesContext() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavouritesContext must be used within a FavouritesProvider');
  }
  return context;
}
