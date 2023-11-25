// context/SearchFilterContext.js
'use client'
import { createContext, useState, useContext } from 'react';

const SearchFilterContext = createContext(null);

export const useSearchFilter = () => useContext(SearchFilterContext);

export const SearchFilterProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('24H');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (newFilter) => {
        setTimeFilter(newFilter);
    };

    const handleStatusFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
    };

    return (
        <SearchFilterContext.Provider value={{ searchTerm, timeFilter, statusFilter, handleSearchChange, handleFilterChange, handleStatusFilterChange }}>
            {children}
        </SearchFilterContext.Provider>
    );
};
