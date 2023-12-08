import { ConversationType, TagCounts } from '@/types/conversation';

export const calculateTagCounts = (conversations: ConversationType[]): TagCounts => {
    const counts: TagCounts = {};

    conversations.forEach((conversation) => {
        conversation.tags.forEach((tag) => {
            if (counts[tag]) {
                counts[tag]++;
            } else {
                counts[tag] = 1;
            }
        });
    });

    return counts;
};