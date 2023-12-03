export type SpeakerType = {
    name: string;
    role: string;
  };
  
  export type ConversationType = {
    summary: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    tags: string[];
    speaker_0: SpeakerType;
    speaker_1: SpeakerType;
    all_text: string;
    user: string;
    datetime: string;
    file_name: string;
    conversation_id: string;
    status: string;
  };
  
  export type SentimentCounts = {
    positive: number;
    negative: number;
    neutral: number;
  };

  export type ConversationCounts = {
    ok: number;
    marked: number;
    not_read: number;
  };

  export type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date | null) => void;
    sentimentCounts: SentimentCounts;
    isNavShrunk: boolean;
    onToggleNav: () => void;
    statusFilter: string;
    onStatusFilterChange: (filter: string) => void;
    conversationCounts: ConversationCounts;
    sentimentFilter: string;
    onSentimentFilterChange: (filter: string) => void;
    customDate: Date | null;
};

export type UseConversationsParams = {
  searchTerm: string;
  timeFilter: string;
  statusFilter: string;
  sentimentFilter: string;
  customDate: Date | null;
};