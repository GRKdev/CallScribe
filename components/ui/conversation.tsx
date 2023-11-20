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
    return text.split('\n').map((line, index) => {
      const isSpeaker0 = line.startsWith('Speaker 0:') || line.startsWith('Speaker_0:');
      const speakerClass = isSpeaker0 ? styles.speaker0 : styles.speaker1;

      return <p key={index} className={speakerClass}>{line}</p>;
    });
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
    const year = date.getFullYear();

    return `${hours}:${minutes} / ${day}-${month}-${year}`;
  };

  return (
    <div className={styles.conversationCard}>
      <div className={styles.cardHeader}>
        <span className={styles.userName}>{conversation.user}</span>
        <span>{formatDateTime(conversation.datetime)}</span>
      </div>
      <div className={styles.cardContent}>
        {isExpanded ? (
          <>
            <div className='pb-2'>
              {renderTextWithLineBreaks(conversation.all_text)}
            </div>
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