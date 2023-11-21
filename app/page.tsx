'use client'
import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import ConversationCard from '@/components/ui/conversation';
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import useDebounce from '@/hooks/useDebounce';
import { ConversationType } from '@/types/conversation';

const HomePage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const allConversations = useFetchConversations(timeFilter, customDate);
  const filteredConversations = useSearchFilter(debouncedSearchTerm, allConversations);

  const handleCustomDateChange = (date) => {
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
        onCustomDateChange={handleCustomDateChange}
      />
      {filteredConversations.map((conversation: ConversationType) => (
        <ConversationCard key={conversation.conversation_id} conversation={conversation} />
      ))}
    </div>
  );
};

export default HomePage;
