'use client'
import { useState, useEffect } from 'react';
import { ConversationType, SentimentCounts, ConversationCounts  } from '@/types/conversation';
import { calculateSentimentCounts } from '@/hooks/sentimentCount';
import { calculateConversationsCounts } from './ConversationCount';

export const useFetchConversations = (
  timeFilter: string,
  customDate: Date | null,
  statusFilter: string,
  sentimentFilter: string,
): [ConversationType[], SentimentCounts, ConversationCounts] => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [sentimentCounts, setSentimentCounts] = useState<SentimentCounts>({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [conversationCounts, setConversationCounts] = useState<ConversationCounts>({
    ok: 0,
    marked: 0,
    not_read: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations`;


      if (timeFilter === 'custom' && customDate) {
        const adjustedDate = new Date(customDate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        const correctedDateStr = adjustedDate.toISOString().split('T')[0];
        apiUrl += apiUrl.includes('?') ? '&' : '?';
        apiUrl += `custom_start_date=${correctedDateStr}`;
      } else if (timeFilter !== 'all') {
        apiUrl += `?time_filter=${timeFilter}`;
      }
      
      if (statusFilter && statusFilter !== 'all') {
        apiUrl += apiUrl.includes('?') ? '&' : '?';
        apiUrl += `status_filter=${statusFilter}`;
      }
      if (sentimentFilter && sentimentFilter !== 'all') {
        apiUrl += apiUrl.includes('?') ? '&' : '?';
        apiUrl += `sentiment_filter=${sentimentFilter}`;
      }
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setConversations(data);
        setSentimentCounts(calculateSentimentCounts(data));
        setConversationCounts(calculateConversationsCounts(data));
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    fetchData();
  }, [timeFilter, customDate, statusFilter, sentimentFilter]);

  return [conversations, sentimentCounts, conversationCounts];
};

export default useFetchConversations;