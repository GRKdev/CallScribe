'use client'
import React, { useState, useCallback } from 'react';
import { ConversationCardProps } from '@/types/conversation';
import styles from '@/styles/ConversationCard.module.css';
import { ArrowDownFromLine, ArrowUpFromLine, Meh, Frown, Smile, Bookmark, BookmarkCheck, BookmarkX, Pencil, Undo2 } from 'lucide-react';
import TextWithLineBreaks from '@/components/ui/TextWithLineBreaks';
import FormatDateTime from '@/components/ui/FormatDateTime';
import ConversationActions from '@/utils/ConversationActions';
import ConversationTags from '@/components/ui/ConversationTags';
import UpdateSummary from '@/utils/UpdateSummary';


const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onStatusUpdate, onSummaryUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = useCallback(() => {
    setIsExpanded((prevState) => !prevState);
  }, []);

  const [isExpandedEdit, setIsExpandedEdit] = useState(false);
  const handleExpandClickEdit = useCallback(() => {
    setIsExpandedEdit((prevState) => !prevState);
  }, []);

  const summaryClass = conversation.status === 'OK' ? styles.greyText : '';
  const userNameClass = conversation.status === 'OK' ? styles.userNameOk : styles.userName;
  const conversationCardClass = conversation.status === 'Marked' ? styles.conversationCardMarked : conversation.status === 'OK' ? styles.conversationCardOK : styles.conversationCard;
  const conversationHeaderClass = conversation.status === 'Marked' ? styles.cardHeaderMarked : conversation.status === 'OK' ? styles.cardHeaderOK : styles.cardHeader;
  const conversationFooterClass = conversation.status === 'Marked' ? styles.cardFooterMarked : conversation.status === 'OK' ? styles.cardFooterOK : styles.cardFooter;

  const [tags, setTags] = useState(conversation.tags);
  const onTagsUpdate = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  const [currentStatus, setCurrentStatus] = useState(conversation.status);

  const [currentSummary, setCurrentSummary] = useState(conversation.summary);


  const handleSummaryUpdate = useCallback((newSummary: string) => {
    setCurrentSummary(newSummary);
    onSummaryUpdate(conversation.conversation_id, newSummary);
  }, [conversation.conversation_id, onSummaryUpdate]);

  const handleStatusUpdate = useCallback((newStatus: string) => {
    setCurrentStatus(newStatus);
    setIsExpanded(false);
    onStatusUpdate(conversation.conversation_id, newStatus);
  }, [conversation.conversation_id, onStatusUpdate]);

  return (
    <div className={conversationCardClass}>
      <div className={conversationHeaderClass} onClick={handleExpandClick}>
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
            <div className={`${summaryClass} pb-2`}>
              {isExpandedEdit ? (
                <div className="flexContainer">
                  <UpdateSummary
                    conversationId={conversation.conversation_id}
                    currentSummary={currentSummary}
                    onSummaryUpdate={handleSummaryUpdate}
                  />
                  <div className="undoIconContainer">
                    <Undo2 onClick={handleExpandClickEdit} />
                  </div>
                </div>

              ) : (
                <div className='flex justify-between pr-4'>
                  {conversation.summary}
                  <Pencil width="15" onClick={handleExpandClickEdit} className={`${styles.summaryClickable}`} />
                </div>
              )}
            </div>

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

      <div className={conversationFooterClass}>
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