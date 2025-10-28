import { BACK_END_URL } from "../constants/api";

export async function favouritesLoader() {
  try {
    const response = await fetch(`${BACK_END_URL}/favourites?_expand=product`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const favourites = await response.json();
    return favourites;
  } catch (error) {
    console.error('Error loading favourites:', error);
    // Return empty array on error to prevent crashes
    return [];
  }
}
