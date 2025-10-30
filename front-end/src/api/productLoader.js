import { BACK_END_URL } from "../constants/api";

export async function productLoader({ params }) {
  // Support both productId and id parameters for flexibility
  const id = params.productId || params.id;
  
  try {
    const response = await fetch(`${BACK_END_URL}/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading product:', error);
    throw error;
  }
}
