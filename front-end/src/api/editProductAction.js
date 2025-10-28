import { BACK_END_URL } from '../constants/api';

export async function editProductAction({ request, params }) {
  console.log('editProductAction called with params:', params);
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  
  try {
    const formData = await request.formData();
    console.log('FormData entries:', Array.from(formData.entries()));
    
    // Add removed photos information
    const removedPhotos = formData.getAll('removedPhotos');
    if (removedPhotos.length > 0) {
      formData.append('removedPhotos', JSON.stringify(removedPhotos));
    }
    
    const response = await fetch(`${BACK_END_URL}/products/${params.id}`, {
      method: 'PUT',
      body: formData
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update product');
    }
    
    return {
      success: true,
      message: data.message,
      product: data.data
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: error.message || 'Failed to update product'
    };
  }
}
