'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import ConversationCard from '@/components/ui/conversation';
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import useDebounce from '@/hooks/useDebounce';
import { ConversationType, SentimentCounts } from '@/types/conversation';

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
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [allConversations] = useFetchConversations(timeFilter, customDate);
  const filteredConversations = useSearchFilter(debouncedSearchTerm, allConversations);

  // State to keep track of the sentiment counts for the filtered conversations
  const [filteredSentimentCounts, setFilteredSentimentCounts] = useState<SentimentCounts>({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  // Effect to update sentiment counts whenever the filtered conversations change
  useEffect(() => {
    setFilteredSentimentCounts(calculateSentimentCounts(filteredConversations));
  }, [filteredConversations]);

  const handleCustomDateChange = (date: Date) => {
    setTimeFilter('custom');
    setCustomDate(date);
  };

  return (
    <div className='container'>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        onDateSelect={handleCustomDateChange}
        sentimentCounts={filteredSentimentCounts} // Pass the filtered sentiment counts here
      />
      {filteredConversations.map((conversation: ConversationType) => (
        <ConversationCard key={conversation.conversation_id} conversation={conversation} />
      ))}
    </div>
  );
};

export default HomePage;