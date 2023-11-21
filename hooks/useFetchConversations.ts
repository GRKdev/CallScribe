'use client'

import { useState, useEffect } from 'react';
import { ConversationType } from '@/types/conversation';

export const useFetchConversations = (timeFilter: string, customDate: Date | null): ConversationType[] => {
    const [conversations, setConversations] = useState<ConversationType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations`;

            // Construct the API URL based on the timeFilter and customDate
            if (timeFilter === 'custom' && customDate) {
                // Format the date to a string that your API can understand
                const dateStr = customDate.toISOString().split('T')[0];
                apiUrl += `?custom_date=${dateStr}`;
            } else if (timeFilter !== 'all') {
                apiUrl += `?time_filter=${timeFilter}`;
            }

            try {
                // Fetch the data from the API
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };

        fetchData();
    }, [timeFilter, customDate]);

    return conversations;
};

export default useFetchConversations;
