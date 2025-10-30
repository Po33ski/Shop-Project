import { BACK_END_URL } from "../constants/api";
import { FAVOURITES_STORAGE_KEY } from '../constants/favourites';

export async function favouritesLoader() {
  try {
    // Get favourites from localStorage
    const storedFavourites = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    const favourites = storedFavourites ? JSON.parse(storedFavourites) : [];
    
    if (favourites.length === 0) {
      return [];
    }
    
    // Fetch product details for each favourite
    const favouritesWithProducts = [];
    
    for (const favourite of favourites) {
      try {
        const response = await fetch(`${BACK_END_URL}/products/${favourite.productId}`);
        if (response.ok) {
          const product = await response.json();
          favouritesWithProducts.push({
            id: favourite.id,
            productId: favourite.productId,
            product: product,
            createdAt: favourite.createdAt
          });
        } else {
          console.warn(`Failed to fetch product ${favourite.productId}: HTTP ${response.status}`);
          // Skip this favourite if product can't be loaded
        }
      } catch (error) {
        console.error(`Error fetching product ${favourite.productId}:`, error);
        // Skip this favourite if product can't be loaded
      }
    }
    
    return favouritesWithProducts;
  } catch (error) {
    console.error('Error loading favourites:', error);
    // Return empty array on error to prevent crashes
    return [];
  }
}
