import './Table.css';

/**
 * Table Component
 * A reusable table component with support for custom columns, data, and empty states.
 * 
 * @param {Array} columns - Array of column definitions:
 *   - header: String/Component for header label
 *   - accessor: String key or Function to get data
 *   - width: Optional width string
 *   - className: Optional class for the cell
 *   - render: Optional function(row) to render custom content
 * @param {Array} data - Array of data objects
 * @param {String} keyField - Unique key field for rows (default: 'id')
 * @param {Boolean} loading - Loading state
 * @param {Function} onRowClick - Optional row click handler
 */
export default function Table({
    columns = [],
    data = [],
    keyField = 'id',
    loading = false,
    onRowClick,
    emptyMessage = 'No data available',
    className = ''
}) {
    // Helper to get cell content
    const getCellContent = (row, col) => {
        if (col.render) {
            return col.render(row);
        }
        if (typeof col.accessor === 'function') {
            return col.accessor(row);
        }
        return row[col.accessor];
    };

    if (loading) {
        return (
            <div className={`table-container ${className}`}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} style={{ width: col.width }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="table-skeleton-row">
                                {columns.map((_, index) => (
                                    <td key={index}>
                                        <div className="skeleton-cell"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="table-empty-state">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`table-container ${className}`}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                style={{ width: col.width }}
                                className={col.headerClassName}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={row[keyField] || rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={onRowClick ? 'clickable-row' : ''}
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={col.className}
                                >
                                    {getCellContent(row, col)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
