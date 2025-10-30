import { FavouritesContext } from '../../contexts/FavouritesContext';
import { useFavourites } from '../../hooks/useFavourites';

export function FavouritesProvider({ children }) {
  const favouritesData = useFavourites();

  return (
    <FavouritesContext.Provider value={favouritesData}>
      {children}
    </FavouritesContext.Provider>
  );
}
