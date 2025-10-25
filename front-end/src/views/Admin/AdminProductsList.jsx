import { Link } from 'react-router-dom';
import styles from './AdminProductsList.module.css';

export function AdminProductsList() {
  // Na razie mock data - później połączymy z API
  const products = [
    { id: 1, name: 'Przykładowy Produkt 1', price: 99.99, category: 'Odzież' },
    { id: 2, name: 'Przykładowy Produkt 2', price: 149.99, category: 'Obuwie' },
  ];

  return (
    <div className={styles.productsList}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📦 Zarządzanie Produktami</h1>
          <Link to="/admin/products/add" className={styles.addBtn}>
            ➕ Dodaj Produkt
          </Link>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nazwa</th>
                <th>Cena</th>
                <th>Kategoria</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price} zł</td>
                  <td>{product.category}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className={styles.editBtn}
                      >
                        ✏️ Edytuj
                      </Link>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => {
                          if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
                            // TODO: Implement delete
                            console.log('Delete product:', product.id);
                          }
                        }}
                      >
                        🗑️ Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
