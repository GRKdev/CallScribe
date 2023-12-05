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
                    placeholder={currentSummary}
                />
            </section>
            <div className="buttonContainer pb-2">
                <Button
                    variant="default"
                    onClick={() => updateSummary(currentSummary)}
                >
                    Update Summary
                </Button>
            </div>
        </div>
    )
}

export default UpdateSummary;