'use client'
import React, { useState, useCallback } from 'react';
import { ConversationType } from '@/types/conversation';
import styles from '@/styles/ConversationCard.module.css';
import { ArrowDownFromLine, ArrowUpFromLine, Meh, Frown, Smile, Bookmark, BookmarkCheck, BookmarkX } from 'lucide-react';
import TextWithLineBreaks from '@/components/ui/TextWithLineBreaks';
import FormatDateTime from '@/components/ui/FormatDateTime';

interface ConversationCardProps {
  conversation: ConversationType;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setIsExpanded(prevState => !prevState);
  }, []);

  return (
    <div className={styles.conversationCard}>
      <div className={styles.cardHeader}>
        <div className={styles.leftSide}>
          {conversation.status === 'Not Read' ? (
            <Bookmark width={18} />
          ) : conversation.status === 'Ok' ? (
            <BookmarkCheck width={18} color='green' />
          ) : (
            <BookmarkX width={18} color='red' />
          )}
          <span className={styles.userName}>{conversation.user}</span>
        </div>

        <div className={styles.rightSide}>
          <FormatDateTime isoString={conversation.datetime} />

        </div>
      </div>

      <div className={styles.cardContent}>
        {isExpanded ? (
          <>
            <div className='pb-2'>
              <TextWithLineBreaks
                text={conversation.all_text}
                speaker_0={conversation.speaker_0}
                speaker_1={conversation.speaker_1}
              />
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
        <span className={styles.userRating}>
          {conversation.sentiment === 'Positive' ? (
            <Smile width={18} color='green' />
          ) : conversation.sentiment === 'Neutral' ? (
            <Meh width={18} />
          ) : (
            <Frown width={18} color='red' />
          )}
        </span>
        <div className={styles.tagContainer}>
          {conversation.tags && conversation.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <button onClick={handleExpandClick} aria-label="Toggle Conversation Expansion" className={styles.expandButton}>
          {isExpanded ? <ArrowUpFromLine width={18} /> : <ArrowDownFromLine width={18} />}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ConversationCard);
