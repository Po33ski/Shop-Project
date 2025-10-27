import { BACK_END_URL } from '../constants/api';

export async function addProductAction({ request }) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`${BACK_END_URL}/admin/products`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create product');
    }
    
    return {
      success: true,
      message: data.message,
      product: data.data
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      error: error.message || 'Failed to create product'
    };
  }
}
