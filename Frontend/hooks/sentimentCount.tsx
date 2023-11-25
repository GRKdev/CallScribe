import { ConversationType, SentimentCounts } from '@/types/conversation';

export const calculateSentimentCounts = (conversations: ConversationType[]): SentimentCounts => {
    const counts: SentimentCounts = {
        positive: 0,
        negative: 0,
        neutral: 0,
    };

    conversations.forEach((conversation) => {
        switch (conversation.sentiment) {
            case 'Positive':
                counts.positive += 1;
                break;
            case 'Negative':
                counts.negative += 1;
                break;
            default:
                counts.neutral += 1;
                break;
        }
    });

    return counts;
};
