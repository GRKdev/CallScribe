'use client'
import React, { useState } from 'react';
import ConversationCard from '@/components/ui/conversation';
import useFetchConversations from '@/hooks/useFetchConversations';
import useSearchFilter from '@/hooks/useSearchFilter';
import useDebounce from '@/hooks/useDebounce';
import { ConversationType } from '@/types/conversation';

const HomePage: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState('24h');
    const allConversations = useFetchConversations(timeFilter);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const filteredConversations = useSearchFilter(debouncedSearchTerm, allConversations);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (newFilter: string) => {
        setTimeFilter(newFilter);
    };

    return (
        <div className='container'>

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
                {filteredConversations.map((conversation: ConversationType) => (
                    <ConversationCard key={conversation.conversation_id} conversation={conversation} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;