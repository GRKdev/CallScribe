import React from 'react';
import styles from '@/styles/ConversationCard.module.css';
import { Bookmark, BookmarkCheck, BookmarkX, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface ConversationActionsProps {
  conversationId: string;
  onStatusUpdate: (newStatus: string) => void;
  currentStatus: string;

}

const ConversationActions: React.FC<ConversationActionsProps> = ({ conversationId, onStatusUpdate, currentStatus }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
  const deleteConversation = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);

      onStatusUpdate('deleted');
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }
  const handleDelete = async () => {
    setIsDialogOpen(false);
    await deleteConversation();
  }
  return (
    <div className={styles.buttonContainer}>
      <div className={styles.mainButtons}>
        <Button variant="secondary" onClick={() => updateStatus('OK')}>
          <BookmarkCheck width={18} color='green' />
          <span className={styles.buttonText}>Ok</span>
        </Button>
        <Button variant="secondary" onClick={() => updateStatus('Marked')}>
          <BookmarkX width={18} color='red' />
          <span className={styles.buttonText}>Mark</span>
        </Button>
        <Button variant="secondary" onClick={() => updateStatus('Not Read')}>
          <Bookmark width={18} />
          <span className={styles.buttonText}>Not Read</span>
        </Button>
      </div>
      <div className={styles.rightButton}>
        <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
          <Trash2 width={18} />
          <span className={styles.buttonText}></span>
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              conversation data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationActions;

