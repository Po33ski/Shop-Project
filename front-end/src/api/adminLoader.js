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

export async function adminProductLoader({ params }) {
  try {
    const response = await fetch(`${BACK_END_URL}/products/${params.id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const product = await response.json();
    
    // Return product directly (no wrapper object)
    return product;
  } catch (error) {
    console.error('Error loading admin product:', error);
    throw new Error('Failed to load product for editing');
  }
}
