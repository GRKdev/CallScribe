'use client'
import React from 'react';
import { useState, useEffect } from 'react';

import Navbar from '@/components/ui/Navbar';
import ConversationsList from '@/components/ui/ConversationsList';
import useNavbarState from '@/hooks/useNavbarState';
import { useConversations } from '@/hooks/useConversations';
import FooterCard from '@/components/ui/footer-paginations';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentConversations = filteredConversations.slice(firstPostIndex, lastPostIndex);

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
      <ConversationsList conversations={currentConversations} onStatusUpdate={handleStatusUpdate} />
      {filteredConversations.length > 0 && (
        <FooterCard
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage}
          totalPosts={filteredConversations.length}
        />
      )}
    </div>
  );
};

export default HomePage;
