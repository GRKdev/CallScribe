'use client'
import React, { useState, useCallback } from 'react';
import { ConversationType } from '@/types/conversation';
import styles from '@/styles/ConversationCard.module.css';
import { ArrowDownFromLine, ArrowUpFromLine, Meh, Frown, Smile, Bookmark, BookmarkCheck, BookmarkX } from 'lucide-react';
import TextWithLineBreaks from '@/components/ui/TextWithLineBreaks';
import FormatDateTime from '@/components/ui/FormatDateTime';
import ConversationActions from '@/hooks/ConversationActions';
import ConversationTags from '@/hooks/ConversationTags';

interface ConversationCardProps {
  conversation: ConversationType;
  onStatusUpdate: (conversationId: string, newStatus: string) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onStatusUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(conversation.status);
  const summaryClass = conversation.status === 'OK' ? styles.greyText : '';
  const userNameClass = conversation.status === 'OK' ? styles.userNameOk : styles.userName;
  const conversationCardClass = conversation.status === 'Marked' ? styles.conversationCardMarked : styles.conversationCard;
  const [tags, setTags] = useState(conversation.tags);
  const onTagsUpdate = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  const handleExpandClick = useCallback(() => {
    setIsExpanded((prevState) => !prevState);
  }, []);

  const handleStatusUpdate = useCallback((newStatus: string) => {
    setCurrentStatus(newStatus);
    setIsExpanded(false);
    onStatusUpdate(conversation.conversation_id, newStatus);
  }, [conversation.conversation_id, onStatusUpdate]);

  return (
    <div className={conversationCardClass}>
      <div className={styles.cardHeader}>
        <div className={styles.leftSide}>
          {currentStatus === 'Not Read' ? (
            <Bookmark width={18} />
          ) : currentStatus === 'OK' ? (
            <BookmarkCheck width={18} color='green' />
          ) : (
            <BookmarkX width={18} color='red' />
          )}
          <span className={userNameClass}>{conversation.user}</span>
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
            <ConversationActions
              conversationId={conversation.conversation_id}
              currentStatus={currentStatus}
              onStatusUpdate={handleStatusUpdate}
            />
          </>
        ) : (
          <span onClick={handleExpandClick} className={`${styles.summaryClickable} ${summaryClass}`}>
            {conversation.summary}
          </span>)}
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
          <ConversationTags
            conversationId={conversation.conversation_id}
            currentTags={tags}
            onTagsUpdate={onTagsUpdate}
          />
        </div>
        <button
          onClick={handleExpandClick}
          aria-label="Toggle Conversation Expansion"
          className={styles.expandButton}
        >
          {isExpanded ? <ArrowUpFromLine width={18} /> : <ArrowDownFromLine width={18} />}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ConversationCard);