import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AdminEditProduct.module.css';

export function AdminEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: '',
    subcategory: '',
    gender: 'women',
    description: '',
    photos: []
  });

  // TODO: Load product data from API
  useEffect(() => {
    // Mock data for now
    setFormData({
      productName: 'Edytowany Produkt',
      price: '199.99',
      category: 'Odzież',
      subcategory: 'Sukienki',
      gender: 'women',
      description: 'Opis produktu do edycji',
      photos: []
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update product
    console.log('Updating product:', id, formData);
    alert('Produkt został zaktualizowany! (Mock)');
    navigate('/admin/products');
  };

  return (
    <div className={styles.editProduct}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>✏️ Edytuj Produkt #{id}</h1>
          <button 
            onClick={() => navigate('/admin/products')}
            className={styles.backBtn}
          >
            ← Powrót do listy
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="productName">Nazwa produktu *</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Cena (zł) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Płeć *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="women">Kobieta</option>
                <option value="men">Mężczyzna</option>
                <option value="children">Dziecko</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Kategoria *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subcategory">Podkategoria</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Opis</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={styles.textarea}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Zdjęcia</label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                multiple
                className={styles.fileInput}
                onChange={(e) => {
                  // TODO: Handle image upload
                  console.log('Selected files:', e.target.files);
                }}
              />
              <div className={styles.uploadArea}>
                📷 Kliknij aby wybrać zdjęcia (JPG)
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              💾 Zapisz Zmiany
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/products')}
              className={styles.cancelBtn}
            >
              ❌ Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
