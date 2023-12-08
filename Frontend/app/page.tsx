'use client'
import React from 'react';
import Navbar from '@/components/ui/Navbar';
import ConversationsList from '@/components/ui/ConversationsList';
import useNavbarState from '@/hooks/useNavbarState';
import { useConversations } from '@/hooks/useConversations';

const HomePage: React.FC = () => {
  const {
    searchTerm,
    timeFilter,
    statusFilter,
    sentimentFilter,
    customDate,
    isNavShrunk,
    handleSearchTermChange,
    handleTimeFilterChange,
    handleStatusFilterChange,
    handleSentimentFilterChange,
    handleCustomDateChange,
    toggleNavbar,
  } = useNavbarState();

  const { filteredConversations, handleStatusUpdate, conversationCounts, sentimentCounts, tagCounts } = useConversations({
    searchTerm,
    timeFilter,
    statusFilter,
    sentimentFilter,
    customDate
  });
  return (
    <div className={`container ${isNavShrunk ? 'shrunk' : ''}`}>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchTermChange}
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
        onDateSelect={handleCustomDateChange}
        sentimentFilter={sentimentFilter}
        onSentimentFilterChange={handleSentimentFilterChange}
        sentimentCounts={sentimentCounts}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        conversationCounts={conversationCounts}
        isNavShrunk={isNavShrunk}
        onToggleNav={toggleNavbar}
        customDate={customDate}
        tagCounts={tagCounts}
      />
      <ConversationsList conversations={filteredConversations} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default HomePage;
