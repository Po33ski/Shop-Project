import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContainer } from '../AdminContainer/AdminContainer';
import { AdminHeader } from '../AdminHeader/AdminHeader';
import { AdminButton } from '../AdminButton/AdminButton';
import { 
  AdminFormGrid, 
  AdminFormGroup, 
  AdminInput, 
  AdminSelect, 
  AdminTextarea, 
  AdminFormActions 
} from '../AdminForm/AdminForm';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import styles from './AdminAddProduct.module.css';
import { BACK_END_URL } from '../../constants/api';

export function AdminAddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: '',
    subcategory: '',
    gender: 'women',
    description: '',
    brand: '',
    maintenanceInfo: '',
    isBestseller: false,
    stock: 0,
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('maintenanceInfo', formData.maintenanceInfo);
      formDataToSend.append('isBestseller', formData.isBestseller);
      formDataToSend.append('stock', formData.stock);
      
      // Add photos if any
      const fileInput = document.querySelector('input[name="photos"]');
      if (fileInput && fileInput.files) {
        for (let i = 0; i < fileInput.files.length; i++) {
          formDataToSend.append('photos', fileInput.files[i]);
        }
      }

      // Submit to backend (using regular products endpoint)
      const response = await fetch(`${BACK_END_URL}/products`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        let errorMessage = `Błąd HTTP! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        alert('Produkt został dodany pomyślnie!');
        navigate('/admin/products');
      } else {
        setError(result.error || 'Wystąpił błąd podczas dodawania produktu');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Wystąpił błąd podczas dodawania produktu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminContainer>
      <AdminHeader 
        title="➕ Dodaj Nowy Produkt"
        actions={
          <AdminButton 
            variant="outline" 
            onClick={() => navigate('/admin/products')}
          >
            ← Powrót do listy
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        )}
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
                  <option value="sneakersy">Sneakersy</option>
                  <option value="sportowe">Sportowe</option>
                  <option value="eleganckie">Eleganckie</option>
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

          <AdminFormGroup label="Marka">
            <AdminInput
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="np. Nike, Adidas, H&M..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Informacje o pielęgnacji">
            <AdminTextarea
              name="maintenanceInfo"
              value={formData.maintenanceInfo}
              onChange={handleInputChange}
              placeholder="np. Prać w 30°C, nie wybielać..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Stan magazynowy">
            <AdminInput
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Bestseller">
            <AdminSelect
              name="isBestseller"
              value={formData.isBestseller}
              onChange={handleInputChange}
            >
              <option value={false}>Nie</option>
              <option value={true}>Tak</option>
            </AdminSelect>
          </AdminFormGroup>
        </AdminFormGrid>

        <AdminFormGroup label="Zdjęcia">
          <ImageUpload />
        </AdminFormGroup>

        <AdminFormActions>
          <AdminButton 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Zapisywanie...' : '💾 Zapisz Produkt'}
          </AdminButton>
          <AdminButton 
            type="button" 
            variant="danger"
            onClick={() => navigate('/admin/products')}
          >
            ❌ Anuluj
          </AdminButton>
        </AdminFormActions>
      </form>
    </AdminContainer>
  );
}
