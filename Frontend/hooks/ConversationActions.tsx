import React from 'react';
import styles from '@/styles/ConversationCard.module.css';
import { Bookmark, BookmarkCheck, BookmarkX } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface ConversationActionsProps {
  conversationId: string;
  onStatusUpdate: (newStatus: string) => void;
  currentStatus: string;

}

const ConversationActions: React.FC<ConversationActionsProps> = ({ conversationId, onStatusUpdate, currentStatus }) => {
  const updateStatus = async (newStatus: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/state`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);

      onStatusUpdate(newStatus);
    } catch (error) {
      console.error('Failed to update conversation:', error);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <Button variant="secondary" onClick={() => updateStatus('OK')}><BookmarkCheck width={18} color='green' />Ok</Button>
      <Button variant="secondary" onClick={() => updateStatus('Marked')}><BookmarkX width={18} color='red' />Mark</Button>
      <Button variant="secondary" onClick={() => updateStatus('Not Read')}><Bookmark width={18} />Not Read</Button>
    </div>
  );
};

export default ConversationActions;
