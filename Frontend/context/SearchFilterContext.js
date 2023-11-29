// context/SearchFilterContext.js
'use client'
import { createContext, useState, useContext } from 'react';

const SearchFilterContext = createContext(null);

export const useSearchFilter = () => useContext(SearchFilterContext);

export const SearchFilterProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('24H');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sentimentFilter, setSentimentFilter] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (newFilter) => {
        setTimeFilter(newFilter);
    };

    const handleStatusFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
    };

    const handleSentimentFilterChange = (newFilter) => {
        setSentimentFilter(newFilter);
    }

    return (
        <SearchFilterContext.Provider value={{ searchTerm, timeFilter, statusFilter, sentimentFilter, handleSearchChange, handleFilterChange, handleStatusFilterChange, handleSentimentFilterChange }}>
            {children}
        </SearchFilterContext.Provider>
    );
};
