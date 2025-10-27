import { BACK_END_URL } from '../constants/api';

export async function deleteProductAction({ params }) {
  try {
    const response = await fetch(`${BACK_END_URL}/admin/products/${params.id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete product');
    }
    
    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete product'
    };
  }
}
