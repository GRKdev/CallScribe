import React from 'react';
import { Undo2, SendHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { UpdateSummaryProps } from '@/types/conversation';


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

    return (
        <div className="updateContainer">
            <section className="summaryContainer p-4">
                <textarea
                    className="summaryTextarea"
                    value={currentSummary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Write a summary of the conversation here..."
                />
            </section>
            <div className="buttonContainer2 pb-2">
                <Button
                    variant="outline"
                    onClick={() => updateSummary(currentSummary)}
                >
                    Update
                </Button>
            </div>
        </div>
    )
}

export default UpdateSummary;