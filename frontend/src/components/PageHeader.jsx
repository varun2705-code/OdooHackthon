import React, { useState } from 'react';
import { Search, Filter, Layers, SortDesc } from 'lucide-react';
import './PageHeader.css';

/**
 * Common Page Header Component
 * Provides Search, Filter (Sort By), and Group By functionalities
 */
const PageHeader = ({ title, subtitle, onSearch, onSort, onGroup }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (onSearch) onSearch(val);
    };

    return (
        <div className="page-header-container no-print">
            <div className="page-title-section">
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>

            <div className="page-controls-section glass-panel">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                <div className="control-group">
                    <div className="control-item">
                        <SortDesc size={16} />
                        <select onChange={(e) => onSort && onSort(e.target.value)} className="control-select">
                            <option value="">Sort By</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                        </select>
                    </div>

                    <div className="control-item">
                        <Layers size={16} />
                        <select onChange={(e) => onGroup && onGroup(e.target.value)} className="control-select">
                            <option value="">Group By</option>
                            <option value="status">Status</option>
                            <option value="type">Type</option>
                            <option value="category">Category</option>
                        </select>
                    </div>

                    <button className="filter-btn btn-secondary">
                        <Filter size={16} />
                        <span>Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
