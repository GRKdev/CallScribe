// context/SearchFilterContext.js
'use client'
import { createContext, useState, useContext } from 'react';

const SearchFilterContext = createContext(null);

export const useSearchFilter = () => useContext(SearchFilterContext);

export const SearchFilterProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('24h');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (newFilter) => {
        setTimeFilter(newFilter);
    };

    return (
        <SearchFilterContext.Provider value={{ searchTerm, timeFilter, handleSearchChange, handleFilterChange }}>
            {children}
        </SearchFilterContext.Provider>
    );
};
