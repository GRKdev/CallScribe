import { ConversationType, ConversationCounts } from '@/types/conversation';

export const calculateConversationsCounts = (conversations: ConversationType[]): ConversationCounts => {
    const counts: ConversationCounts = {
        ok: 0,
        marked: 0,
        not_read: 0,
    };

    conversations.forEach((conversation) => {
        switch (conversation.status) {
            case 'OK':
                counts.ok += 1;
                break;
            case 'Marked':
                counts.marked += 1;
                break;
            default:
                counts.not_read += 1;
                break;
        }
    });

    return counts;
};
