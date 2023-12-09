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

  export type TagCounts = {
    [tag: string]: number;
};

  export type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date | null) => void;
    isNavShrunk: boolean;
    onToggleNav: () => void;
    statusFilter: string;
    onStatusFilterChange: (filter: string) => void;
    sentimentFilter: string;
    onSentimentFilterChange: (filter: string) => void;
    customDate: Date | null;
    conversationCounts: ConversationCounts;
    sentimentCounts: SentimentCounts;
    tagCounts: TagCounts;
};

export type UseConversationsParams = {
  searchTerm: string;
  timeFilter: string;
  statusFilter: string;
  sentimentFilter: string;
  customDate: Date | null;
};

export type ConversationCardProps = {
  conversation: ConversationType;
  onStatusUpdate: (conversationId: string, newStatus: string) => void;
  currentSummary: string;
  onSummaryUpdate: (conversationId: string, newSummary: string) => void;
}

export type ConversationTagsProps = {
  conversationId: string;
  currentTags: string[];
  onTagsUpdate: (newTags: string[]) => void;

}

export interface UpdateSummaryProps {
  conversationId: string;
  onSummaryUpdate: (newStatus: string) => void;
  currentSummary: string;

}

export type TimeFilterDescription = {
  '24h': string;
  '7d': string;
  '1m': string;
  all: string;
};