'use client'
import { useMemo } from 'react';
import { ConversationType } from '../types/conversation';

const useSearchFilter = (searchTerm: string, conversations: ConversationType[]) => {
  return useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return searchTerm.length >= 3
      ? conversations.filter(conversation =>
          conversation.user.toLowerCase().includes(lowercasedSearchTerm) ||
          conversation.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))
        )
      : conversations;
  }, [searchTerm, conversations]);
};

export default useSearchFilter;
