'use client'
import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar'; // Use the correct path for your project
import ConversationCard from '@/components/ui/conversation'; // Use the correct path for your project
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import useDebounce from '@/hooks/useDebounce';
import { ConversationType } from '@/types/conversation'; // Use the correct path for your project

const HomePage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const allConversations = useFetchConversations(timeFilter);
  const filteredConversations = useSearchFilter(debouncedSearchTerm, allConversations);

  return (
    <div className='container'>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />
      {/* Render the conversation cards */}
      {filteredConversations.map((conversation: ConversationType) => (
        <ConversationCard key={conversation.conversation_id} conversation={conversation} />
      ))}
    </div>
  );
};

export default HomePage;
