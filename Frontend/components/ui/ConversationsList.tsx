// ConversationsList.tsx
import React from 'react';
import ConversationCard from '@/components/ui/conversation';
import { ConversationType } from '@/types/conversation';

interface ConversationsListProps {
    conversations: ConversationType[];
    onStatusUpdate: (conversationId: string, newStatus: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ conversations, onStatusUpdate }) => {
    if (conversations.length === 0) {
        return (
            <div className="no-conversations-container">
                <div className="no-conversations">
                    There are no conversations.
                </div>
            </div>
        );
    }

    return (
        <div className='conversation-cards'>
            {conversations.map((conversation) => (
                <ConversationCard
                    key={conversation.conversation_id}
                    conversation={conversation}
                    onStatusUpdate={onStatusUpdate}
                />
            ))}
        </div>
    );
};

export default ConversationsList;
