import { Link, useLoaderData, useFetcher } from 'react-router-dom';
import styles from './AdminProductsList.module.css';

export function AdminProductsList() {
  const products = useLoaderData();
  const fetcher = useFetcher();

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
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.productName}</td>
                  <td>{product.price} zł</td>
                  <td>{product.category}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link 
                        to={`/admin/products/edit/${product._id}`}
                        className={styles.editBtn}
                      >
                        ✏️ Edytuj
                      </Link>
                      <fetcher.Form
                        method="POST"
                        action={`/admin/products/delete/${product._id}`}
                        onSubmit={(e) => {
                          if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <button 
                          type="submit"
                          className={styles.deleteBtn}
                          disabled={fetcher.state === 'submitting'}
                        >
                          {fetcher.state === 'submitting' ? '⏳ Usuwanie...' : '🗑️ Usuń'}
                        </button>
                      </fetcher.Form>
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
