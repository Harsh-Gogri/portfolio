import styles from "./ComparisonTable.module.css";

export default function ComparisonTable({ headers = [], rows = [] }) {
  if (!headers || headers.length === 0) return null;

  const visibleHeaders = headers.slice(0, 3);
  const columnCount = visibleHeaders.length;
  const keys = ["label", "a", "b"].slice(0, columnCount);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} data-columns={columnCount}>
        <thead>
          <tr className={styles.headerRow}>
            {visibleHeaders.map((header, idx) => (
              <th key={idx} className={styles.th}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={styles.bodyRow}>
              {keys.map((key, colIdx) => (
                <td
                  key={key}
                  className={`${styles.td} ${colIdx === 0 ? styles.labelCell : ""}`}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}