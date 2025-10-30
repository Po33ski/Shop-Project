import { BACK_END_URL } from '../constants/api';

export async function adminProductsLoader() {
  try {
    const response = await fetch(`${BACK_END_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Return products directly (no wrapper object)
    return products;
  } catch (error) {
    console.error('Error loading admin products:', error);
    throw new Error('Failed to load products for admin');
  }
}

