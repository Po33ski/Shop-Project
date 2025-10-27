import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLoaderData, useActionData, useSubmit } from 'react-router-dom';
import { AdminContainer } from '../../components/AdminContainer/AdminContainer';
import { AdminHeader } from '../../components/AdminHeader/AdminHeader';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { 
  AdminForm, 
  AdminFormGrid, 
  AdminFormGroup, 
  AdminInput, 
  AdminSelect, 
  AdminTextarea, 
  AdminFormActions 
} from '../../components/AdminForm/AdminForm';
import { ImageUpload } from '../../components/ImageUpload/ImageUpload';

export function AdminEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: '',
    subcategory: '',
    gender: 'women',
    description: '',
    photos: [],
    newPhotos: [],
    removedPhotos: []
  });

  // Load product data from API
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        price: product.price || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        gender: product.gender || 'women',
        description: product.description || '',
        photos: product.photos || [],
        newPhotos: [],
        removedPhotos: []
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subcategory: '' // Reset subcategory
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form data:', formData);
    
    // Submit form data to React Router action
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('productName', formData.productName);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('category', formData.category);
    formDataToSubmit.append('subcategory', formData.subcategory);
    formDataToSubmit.append('gender', formData.gender);
    formDataToSubmit.append('description', formData.description);
    
    // Add removed photos
    formData.removedPhotos.forEach(photo => {
      formDataToSubmit.append('removedPhotos', photo);
    });
    
    // Add new photos
    const fileInput = document.querySelector('input[name="photos"]');
    if (fileInput && fileInput.files) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formDataToSubmit.append('photos', fileInput.files[i]);
      }
    }
    
    submit(formDataToSubmit, { method: 'POST' });
  };

  // Handle action result
  useEffect(() => {
    if (actionData) {
      console.log('Action data received:', actionData);
      if (actionData.success) {
        alert(actionData.message);
        navigate('/admin/products');
      } else if (actionData.error) {
        alert(`Błąd: ${actionData.error}`);
      }
    }
  }, [actionData, navigate]);

  return (
    <AdminContainer>
      <AdminHeader 
        title={`✏️ Edytuj Produkt #${id}`}
        actions={
          <AdminButton 
            variant="outline" 
            onClick={() => navigate('/admin/products')}
          >
            ← Powrót do listy
          </AdminButton>
        }
      />

      <AdminForm 
        method="POST" 
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {/* Hidden inputs for removed photos */}
        {formData.removedPhotos && formData.removedPhotos.map((photo, index) => (
          <input
            key={index}
            type="hidden"
            name="removedPhotos"
            value={photo}
          />
        ))}
        <AdminFormGrid>
          <AdminFormGroup label="Nazwa produktu" required>
            <AdminInput
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
          </AdminFormGroup>

          <AdminFormGroup label="Cena (zł)" required>
            <AdminInput
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Płeć" required>
            <AdminSelect
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="women">Kobieta</option>
              <option value="men">Mężczyzna</option>
              <option value="children">Dziecko</option>
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label="Kategoria" required>
            <AdminSelect
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Wybierz kategorię</option>
              <option value="odziez">Odzież</option>
              <option value="obuwie">Obuwie</option>
              <option value="akcesoria">Akcesoria</option>
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label="Podkategoria">
            <AdminSelect
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
            >
              <option value="">Wybierz podkategorię</option>
              {formData.category === 'odziez' && (
                <>
                  <option value="koszulki">Koszulki</option>
                  <option value="spodnie">Spodnie</option>
                  <option value="sukienki">Sukienki</option>
                  <option value="bluzki">Bluzki</option>
                  <option value="spodniczki">Spódniczki</option>
                  <option value="swetry">Swetry</option>
                  <option value="kurtki">Kurtki</option>
                  <option value="płaszcze">Płaszcze</option>
                </>
              )}
              {formData.category === 'obuwie' && (
                <>
                  <option value="sneakers">Sneakers</option>
                  <option value="buty">Buty</option>
                  <option value="szpilki">Szpilki</option>
                  <option value="sandały">Sandały</option>
                  <option value="kalosze">Kalosze</option>
                  <option value="botki">Botki</option>
                </>
              )}
              {formData.category === 'akcesoria' && (
                <>
                  <option value="torebki">Torebki</option>
                  <option value="plecaki">Plecaki</option>
                  <option value="zegarki">Zegarki</option>
                  <option value="biżuteria">Biżuteria</option>
                  <option value="paski">Paski</option>
                  <option value="czapki">Czapki</option>
                  <option value="szaliki">Szaliki</option>
                </>
              )}
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label="Opis">
            <AdminTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </AdminFormGroup>
        </AdminFormGrid>

        <AdminFormGroup label="Zdjęcia">
          <ImageUpload 
            existingPhotos={formData.photos}
            onChange={(e) => {
              // Handle file changes
              const files = Array.from(e.target.files);
              const removedPhotos = e.target.removedPhotos || [];
              setFormData(prev => ({
                ...prev,
                newPhotos: files,
                removedPhotos: removedPhotos
              }));
            }}
          />
        </AdminFormGroup>

        <AdminFormActions>
          <AdminButton type="submit" variant="secondary">
            💾 Zapisz Zmiany
          </AdminButton>
          <AdminButton 
            type="button" 
            variant="danger"
            onClick={() => navigate('/admin/products')}
          >
            ❌ Anuluj
          </AdminButton>
        </AdminFormActions>
      </AdminForm>
    </AdminContainer>
  );
}
