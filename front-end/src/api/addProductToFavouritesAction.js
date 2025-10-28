const FAVOURITES_STORAGE_KEY = 'shop-favourites';

export function addProductToFavourites({ params: { productId } }) {
  try {
    const numericProductId = Number(productId);
    
    // Get current favourites from localStorage
    const storedFavourites = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    const favourites = storedFavourites ? JSON.parse(storedFavourites) : [];
    
    // Check if already in favourites
    if (favourites.some(fav => fav.productId === numericProductId)) {
      console.warn('Product already in favourites:', numericProductId);
      return Promise.resolve(new Response(JSON.stringify({ error: 'Product already in favourites' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    // Add new favourite
    const newFavourite = {
      id: Date.now(),
      productId: numericProductId,
      createdAt: new Date().toISOString()
    };
    
    const updatedFavourites = [...favourites, newFavourite];
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(updatedFavourites));
    
    console.log('Added to favourites:', numericProductId);
    
    // Return a successful Response object
    return Promise.resolve(new Response(JSON.stringify(newFavourite), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    }));
  } catch (error) {
    console.error('Error adding to favourites:', error);
    return Promise.resolve(new Response(JSON.stringify({ error: 'Failed to add to favourites' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
}
