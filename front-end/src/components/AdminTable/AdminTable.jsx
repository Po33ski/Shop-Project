import styles from './AdminTable.module.css';

export function AdminTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  deleteLoading = false,
  children 
}) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={styles.header}>
                {column}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className={styles.header}>Akcje</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.row}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className={styles.cell}>
                  {cell}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className={styles.cell}>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className={styles.editBtn}
                      >
                        ✏️ Edytuj
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className={styles.deleteBtn}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? '⏳ Usuwanie...' : '🗑️ Usuń'}
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {children}
    </div>
  );
}
