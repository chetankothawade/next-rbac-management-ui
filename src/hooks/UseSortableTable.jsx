// src/hooks/UseSortableTable.js  
import React, { useState, useCallback } from 'react';

function UseSortableTable(defaultSortField, defaultSortOrder, setPage) {
    const [sortedField, setSortedField] = useState(defaultSortField);
    const [sortedBy, setSortedBy] = useState(defaultSortOrder);

    const handleSortByColumn = useCallback((sortedColumn) => {
        const order = sortedField === sortedColumn && sortedBy === 'asc';
        const orderBy = order ? 'desc' : 'asc';
        setSortedField(sortedColumn);
        setSortedBy(orderBy);
        setPage(1); // Call setPage(1) here to reset the page to 1
    }, [sortedField, sortedBy, setPage]);

    const renderSortingIcon = (fieldName) => {
        if (sortedField === fieldName) {
            const sortIcon = sortedBy === 'asc' ? 'ri-sort-asc' : 'ri-sort-desc';
            return (
                <span className="tbl-sort" aria-hidden="true">
                    <i className={sortIcon} />
                </span>
            );
        }
        return '';
    };

    return { sortedField, sortedBy, handleSortByColumn, renderSortingIcon };
}

export default UseSortableTable; 
