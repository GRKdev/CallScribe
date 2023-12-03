"use client"
import { useState, useCallback } from 'react';

const useNavbarState = () => {
    const [timeFilter, setTimeFilter] = useState<string>('24h');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sentimentFilter, setSentimentFilter] = useState<string>('all');
    const [customDate, setCustomDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isNavShrunk, setIsNavShrunk] = useState(false);

    const handleSearchTermChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleTimeFilterChange = useCallback((time: string) => {
        setTimeFilter(time);
    }, []);

    const handleStatusFilterChange = useCallback((status: string) => {
        setStatusFilter(status);
    }, []);

    const handleSentimentFilterChange = useCallback((sentiment: string) => {
        setSentimentFilter(sentiment);
    }, []);

    const handleCustomDateChange = useCallback((date: Date | null) => {
        setTimeFilter('custom');
        setCustomDate(date);
    }, []);

    const toggleNavbar = useCallback(() => {
        setIsNavShrunk(prev => !prev);
    }, []);

    return {
        timeFilter,
        statusFilter,
        sentimentFilter,
        customDate,
        searchTerm,
        isNavShrunk,
        handleSearchTermChange,
        handleTimeFilterChange,
        handleStatusFilterChange,
        handleSentimentFilterChange,
        handleCustomDateChange,
        toggleNavbar,
    };
};
export default useNavbarState;
