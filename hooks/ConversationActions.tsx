import React from 'react';
import styles from '@/styles/ConversationCard.module.css';

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
    <div className={styles.actionButtons}>
      <button onClick={() => updateStatus('OK')}>Ok</button>
      <button onClick={() => updateStatus('Marked')}>Mark</button>
    </div>
  );
};

export default ConversationActions;
