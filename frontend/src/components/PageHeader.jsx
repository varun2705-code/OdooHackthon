import React, { useState } from 'react';
import { Search, Filter, Layers, SortDesc, X } from 'lucide-react';
import './PageHeader.css';

/**
 * Common Page Header Component
 * Provides Search, Filter (Sort By), and Group By functionalities
 * Updated with a Trigger Button, Enter key support, and Clear functionality
 */
const PageHeader = ({ title, subtitle, onSearch, onSort, onGroup }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchClick = () => {
        if (onSearch) onSearch(searchTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        if (onSearch) onSearch(''); // Trigger search with empty string to reset results
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
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear-btn" onClick={handleClearSearch} title="Clear search">
                            <X size={16} />
                        </button>
                    )}
                    <button
                        className="search-trigger-btn"
                        onClick={handleSearchClick}
                        title="Search"
                    >
                        Search
                    </button>
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
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
