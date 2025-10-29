import { Link, useLoaderData, useFetcher, useNavigate } from 'react-router-dom';
import { AdminContainer } from '../AdminContainer/AdminContainer';
import { AdminHeader } from '../AdminHeader/AdminHeader';
import { AdminButton } from '../AdminButton/AdminButton';
import { AdminTable } from '../AdminTable/AdminTable';
import { useEffect } from 'react';
import styles from './AdminProductsList.module.css';

export function AdminProductsList() {
  const products = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        alert('Produkt został usunięty pomyślnie!');
        window.location.reload(); // Refresh the page to update the list
      } else {
        alert(`Błąd: ${fetcher.data.error}`);
      }
    }
  }, [fetcher.data]);

  const columns = ['ID', 'Nazwa', 'Cena', 'Kategoria'];
  
  const tableData = products.map(product => ({
    id: product.id, // Use product.id instead of product._id
    name: product.productName,
    price: `${product.price} zł`,
    category: product.category
  }));

  const handleEdit = (row) => {
    navigate(`/admin/products/edit/${row.id}`);
  };

  const handleDelete = (row) => {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      // Use fetcher to submit delete action
      fetcher.submit(null, {
        method: 'POST',
        action: `/admin/products/delete/${row.id}`
      });
    }
  };

  return (
    <AdminContainer>
      <AdminHeader 
        title="📦 Zarządzanie Produktami"
        actions={
          <Link to="/admin/products/add">
            <AdminButton variant="primary">
              ➕ Dodaj Produkt
            </AdminButton>
          </Link>
        }
      />

      <AdminTable
        columns={columns}
        data={tableData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteLoading={fetcher.state === 'submitting'}
      />
    </AdminContainer>
  );
}
