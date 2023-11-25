'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/ui/Navbar';
import ConversationCard from '@/components/ui/conversation';
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import useDebounce from '@/hooks/useDebounce';
import { ConversationType, SentimentCounts } from '@/types/conversation';
import { calculateConversationsCounts } from '@/hooks/ConversationCount';

const calculateSentimentCounts = (conversations: ConversationType[]): SentimentCounts => {
  return conversations.reduce(
    (counts, conversation) => {
      counts[conversation.sentiment.toLowerCase() as keyof SentimentCounts]++;
      return counts;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );
};

const HomePage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isNavShrunk, setIsNavShrunk] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<Record<string, string>>({});

  const [allConversations] = useFetchConversations(timeFilter, customDate, statusFilter);
  const filteredConversations = useSearchFilter(debouncedSearchTerm, allConversations);
  const conversationCounts = calculateConversationsCounts(filteredConversations);

  const [filteredSentimentCounts, setFilteredSentimentCounts] = useState<SentimentCounts>({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  useEffect(() => {
    setFilteredSentimentCounts(calculateSentimentCounts(filteredConversations));
  }, [filteredConversations]);

  const handleCustomDateChange = (date: Date | null) => {
    setTimeFilter('custom');
    setCustomDate(date);
  };

  const handleStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
  }, []);

  const toggleNavbar = () => setIsNavShrunk(!isNavShrunk);

  const handleStatusUpdate = useCallback((conversationId: string, newStatus: string) => {
    setUpdatedStatus(prev => ({ ...prev, [conversationId]: newStatus }));
  }, []);

  const conversationsWithStatusUpdates = allConversations.map((conv) => ({
    ...conv,
    status: updatedStatus[conv.conversation_id] || conv.status,
  }));

  const handleFilteredConversations = useSearchFilter(debouncedSearchTerm, conversationsWithStatusUpdates);

  return (
    <div className={`container ${isNavShrunk ? 'shrunk' : ''}`}>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        onDateSelect={handleCustomDateChange}
        sentimentCounts={filteredSentimentCounts}
        isNavShrunk={isNavShrunk}
        onToggleNav={toggleNavbar}
        conversationCounts={conversationCounts}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <div className="conversation-cards">
        {handleFilteredConversations.map((conversation) => (
          <ConversationCard
            key={conversation.conversation_id}
            conversation={conversation}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;