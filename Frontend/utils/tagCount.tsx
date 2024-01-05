import { ConversationType, TagCounts } from '@/types/conversation';

export const calculateTagCounts = (conversations: ConversationType[]): TagCounts => {
    const counts: TagCounts = {};

    conversations.forEach((conversation) => {
        conversation.tags.forEach((tag) => {
            const lowerCaseTag = tag.toLowerCase();
            if (counts[lowerCaseTag]) {
                counts[lowerCaseTag]++;
            } else {
                counts[lowerCaseTag] = 1;
            }
        });
    });

    return counts;
};