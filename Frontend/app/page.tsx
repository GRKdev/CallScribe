'use client'
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/ui/Navbar';
import ConversationCard from '@/components/ui/conversation';
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import useDebounce from '@/hooks/useDebounce';
import { calculateConversationsCounts } from '@/hooks/ConversationCount';
import { calculateSentimentCounts } from '@/hooks/sentimentCount';

const HomePage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isNavShrunk, setIsNavShrunk] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<Record<string, string>>({});

  const [allConversations] = useFetchConversations(timeFilter, customDate, statusFilter, sentimentFilter);
  const filteredConversations = useSearchFilter(debouncedSearchTerm, allConversations);
  const conversationCounts = calculateConversationsCounts(filteredConversations);
  const sentimentCounts = calculateSentimentCounts(filteredConversations);

  const handleCustomDateChange = (date: Date | null) => {
    setTimeFilter('custom');
    setCustomDate(date);
  };

  const handleStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
  }, []);

  const handleSentimentFilterChange = useCallback((sentiment: string) => {
    setSentimentFilter(sentiment);
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
        sentimentCounts={sentimentCounts}
        isNavShrunk={isNavShrunk}
        onToggleNav={toggleNavbar}
        conversationCounts={conversationCounts}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        sentimentFilter={sentimentFilter}
        onSentimentFilterChange={handleSentimentFilterChange}
      />
      <div className="main-content">

        <div className='conversation-cards'>
          {handleFilteredConversations.length > 0 ? (
            handleFilteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.conversation_id}
                conversation={conversation}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          ) : (
            <div className="no-conversations-container">
              <div className="no-conversations">
                There are no conversations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;