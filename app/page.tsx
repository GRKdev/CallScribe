'use client'
import React, { useState, useEffect } from 'react';
import ConversationCard from '@/components/ui/conversation';
import { ConversationType } from '../types/conversation';
import { ModeToggle } from "@/components/ui/toggle";

const HomePage: React.FC = () => {
  const [allConversations, setAllConversations] = useState<ConversationType[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('24h');

  useEffect(() => {
    // Fetch all conversations once when the component mounts
    const fetchConversations = async () => {
      const timeQuery = timeFilter !== 'all' ? `?time_filter=${timeFilter}` : '';
      const response = await fetch(`http://localhost:8000/conversations${timeQuery}`);
      const data = await response.json();
      setAllConversations(data);
      setFilteredConversations(data); // Initially, all conversations are shown
    };

    fetchConversations().catch(console.error);
  }, [timeFilter]);

  useEffect(() => {
    // Filter conversations client-side whenever the search term changes
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (searchTerm.length >= 3) { // Only filter if the searchTerm has 3 or more characters
      const filtered = allConversations.filter(conversation =>
        conversation.user.toLowerCase().includes(lowercasedSearchTerm) ||
        conversation.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(allConversations); // If searchTerm is less than 3 characters, show all conversations
    }
  }, [searchTerm, allConversations]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (newFilter: string) => {
    setTimeFilter(newFilter);
  };

  return (
    <div className='container'>
      <div className='flex justify-between items-center'>
        <ModeToggle />
      </div>
      <div className='flex justify-between pt-5 pb-4 items-center'>
        <div className="searchContainer">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search conversations"
          />
        </div>
        <div className="filterButtons">
          {['24h', '7d', '1m', '3m', 'all'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={timeFilter === filter ? 'activeFilter' : ''}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div>
        {filteredConversations.map((conversation) => (
          <ConversationCard key={conversation.conversation_id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;