import React from 'react';
import styles from '@/styles/ConversationCard.module.css';
import { Pencil, SendHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface UpdateSummaryProps {
    conversationId: string;
    onSummaryUpdate: (newStatus: string) => void;
    currentSummary: string;

}
const UpdateSummary: React.FC<UpdateSummaryProps> = ({ conversationId, onSummaryUpdate, currentSummary }) => {

    const updateSummary = async (newSummary: string) => {
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/summary`
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ summary: newSummary }),
            });
            const result = await response.json();
            console.log(result.message);
            onSummaryUpdate(newSummary);

        } catch (error) {
            console.error('Failed to update summary:', error);
        }
    }

    return (<>
        <div >
            <section className="summaryContainer flex justify-between p-4">
                <textarea
                    className="pl-2 summaryContainer"
                    value={currentSummary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder={currentSummary}
                />
            </section>
            <div className="text-center pb-2">
                <Button

                    variant="secondary"
                    onClick={() => updateSummary(currentSummary)}
                >
                    Update Summary<SendHorizontal width={15} />
                </Button>
            </div>

        </div>
    </>)
}

export default UpdateSummary;