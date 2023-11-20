// ConversationCard.tsx
'use client'
import React, { useState } from 'react';
import { ConversationType } from '@/types/conversation';
import styles from '@/styles/ConversationCard.module.css';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';


interface ConversationCardProps {
  conversation: ConversationType;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index}>{line}</p> // Changed to <p> for better semantic markup
    ));
  };

  return (
    <div className={styles.conversationCard}>
      <div className={styles.cardHeader}>
        <span className={styles.userName}>{conversation.user}</span>
        <span>{conversation.datetime}</span>
      </div>
      <div className={styles.cardContent}>
        {isExpanded ? (
          <>
            {renderTextWithLineBreaks(conversation.all_text)}
            <div className={styles.actionButtons}>
              <button onClick={() => console.log('Mark as OK')}>OK</button>
              <button onClick={() => console.log('Mark as Review')}>Mark</button>
            </div>
          </>
        ) : (
          <span>{conversation.summary}</span>
        )}
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.tagContainer}>
          {conversation.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <button onClick={handleExpandClick}>
          {isExpanded ? <ArrowUpFromLine width={18} /> : <ArrowDownFromLine width={18} />}
        </button>
      </div>
    </div>
  );
};

export default ConversationCard;