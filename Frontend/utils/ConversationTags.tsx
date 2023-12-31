'use client'
import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/ConversationCard.module.css';
import { Trash2, PlusCircleIcon } from 'lucide-react';
import { ConversationTagsProps } from '@/types/conversation';


const ConversationTags: React.FC<ConversationTagsProps> = ({
  conversationId,
  currentTags,
  onTagsUpdate,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOutsideClick = (event: MouseEvent) => {

    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsAdding(false);
    }


    let isClickInsideTag = currentTags.some(tag =>
      document.getElementById(`tag-${tag}`)?.contains(event.target as Node)
    );

    if (!isClickInsideTag) {
      setSelectedTag(null);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleAddTag = async () => {
    if (newTag.trim()) {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/tags/add`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tag: newTag.trim() }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        onTagsUpdate([...currentTags, newTag.trim()]);
        setNewTag('');
        setIsAdding(false);
      } catch (error) {
        console.error('Failed to add tag:', error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handlePlusClick = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };


  const removeTag = async (tag: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/tags/remove`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);

      onTagsUpdate(currentTags.filter(t => t !== tag));
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };


  return (
    <div className={styles.tagContainer}>
      {currentTags.map((tag) => (
        <div key={tag} id={`tag-${tag}`} className={styles.tag} onClick={() => setSelectedTag(tag)}>
          {tag}
          {selectedTag === tag && (
            <button onClick={() => removeTag(tag)} title="Remove Tag">
              <Trash2 height={12} color='red' />
            </button>
          )}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        {isAdding && (
          <input
            ref={inputRef}
            type="text"
            placeholder="Add tag & press Enter"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.tagInput}
            autoFocus
          />

        )}
        {!isAdding && (
          <button onClick={handlePlusClick} title="Add Tag">
            <PlusCircleIcon height={18} className='add_tag' />
          </button>
        )}
      </div>
    </div>
  );
};


export default ConversationTags;

