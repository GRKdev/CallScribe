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