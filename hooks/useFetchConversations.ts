'use client'

import { useState, useEffect } from 'react';
import { ConversationType } from '@/types/conversation';

export const useFetchConversations = (timeFilter: string, customDate: Date | null): ConversationType[] => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations`;

      if (timeFilter === 'custom' && customDate) {
        const adjustedDate = new Date(customDate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        const correctedDateStr = adjustedDate.toISOString().split('T')[0];

        apiUrl += `?custom_start_date=${correctedDateStr}`;
      } else if (timeFilter !== 'all') {
        apiUrl += `?time_filter=${timeFilter}`;
      }

      try {
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