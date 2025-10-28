const FAVOURITES_STORAGE_KEY = 'shop-favourites';

export function deleteFavouriteAction({ params }) {
  try {
    const favouriteId = Number(params.favouriteId);
    
    // Get current favourites from localStorage
    const storedFavourites = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    const favourites = storedFavourites ? JSON.parse(storedFavourites) : [];
    
    // Find and remove the favourite
    const updatedFavourites = favourites.filter(fav => fav.id !== favouriteId);
    
    if (updatedFavourites.length === favourites.length) {
      console.warn('Favourite not found:', favouriteId);
      return Promise.resolve(new Response(JSON.stringify({ error: 'Favourite not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(updatedFavourites));
    
    
    // Return a successful Response object
    return Promise.resolve(new Response(JSON.stringify({ message: 'Favourite removed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    console.error('Error removing from favourites:', error);
    return Promise.resolve(new Response(JSON.stringify({ error: 'Failed to remove from favourites' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
}
