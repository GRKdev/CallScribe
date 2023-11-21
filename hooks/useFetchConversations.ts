'use client'

import { useState, useEffect } from 'react';
import { ConversationType } from '@/types/conversation';

const useFetchConversations = (timeFilter: string): ConversationType[] => {
  const [allConversations, setAllConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeQuery = timeFilter !== 'all' ? `?time_filter=${timeFilter}` : '';
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations${timeQuery}`);
        const data = await response.json();
        setAllConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
        // handle error appropriately
      }
    };

    fetchData();
  }, [timeFilter]);

  return allConversations;
};

export default useFetchConversations;