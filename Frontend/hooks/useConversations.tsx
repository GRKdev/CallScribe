'use client'
import { useState, useCallback } from 'react';
import useDebounce from '@/hooks/useDebounce';
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import { calculateConversationsCounts } from '@/utils/ConversationCount';
import { calculateSentimentCounts } from '@/utils/sentimentCount';
import { UseConversationsParams } from '@/types/conversation';
import { calculateTagCounts } from '@/utils/tagCount';

export const useConversations = ({ searchTerm, timeFilter, statusFilter, sentimentFilter, customDate }: UseConversationsParams) => {
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [updatedStatus, setUpdatedStatus] = useState<Record<string, string>>({});

    const [allConversations] = useFetchConversations(timeFilter, customDate, statusFilter, sentimentFilter);
    const conversationsWithStatusUpdates = allConversations.map(conv => ({
        ...conv,
        status: updatedStatus[conv.conversation_id] || conv.status,
    }));

    const filteredConversations = useSearchFilter(debouncedSearchTerm, conversationsWithStatusUpdates);
    const conversationCounts = calculateConversationsCounts(filteredConversations);
    const sentimentCounts = calculateSentimentCounts(filteredConversations);
    const tagCounts = calculateTagCounts(filteredConversations);

    const handleStatusUpdate = useCallback((conversationId: string, newStatus: string) => {
        setUpdatedStatus(prev => ({ ...prev, [conversationId]: newStatus }));
    }, []);

    return {
        filteredConversations,
        handleStatusUpdate,
        conversationCounts,
        sentimentCounts,
        tagCounts
    };
};
