export type SpeakerType = {
    name: string;
    role: string;
  };
  
  export type ConversationType = {
    summary: string;
    sentiment: string;
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
  