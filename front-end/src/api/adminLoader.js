import { BACK_END_URL } from '../constants/api';

export async function adminProductsLoader() {
  try {
    const response = await fetch(`${BACK_END_URL}/admin/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch products');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error loading admin products:', error);
    throw new Error('Failed to load products for admin');
  }
}

export async function adminProductLoader({ params }) {
  try {
    const response = await fetch(`${BACK_END_URL}/admin/products/${params.id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch product');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error loading admin product:', error);
    throw new Error('Failed to load product for editing');
  }
}
