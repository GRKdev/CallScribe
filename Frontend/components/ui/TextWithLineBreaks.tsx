import React from 'react';
import styles from '@/styles/ConversationCard.module.css';
import { SpeakerType } from '@/types/conversation';

interface TextWithLineBreaksProps {
    text: string;
    speaker_0: SpeakerType;
    speaker_1: SpeakerType;
}

const TextWithLineBreaks: React.FC<TextWithLineBreaksProps> = ({ text, speaker_0, speaker_1 }) => {
    const introText = (
        <div className={styles.speakerInfoContainer}>
            <div className={styles.speakerInfo}>
                <p><span className={styles.bold}>Speaker 1:</span> {speaker_0.name}</p>
                <p><span className={styles.bold}>Role:</span> {speaker_0.role}</p>
            </div>
            <div className={styles.speakerInfo}>
                <p><span className={styles.bold}>Speaker 2:</span> {speaker_1.name}</p>
                <p><span className={styles.bold}>Role:</span> {speaker_1.role}</p>
            </div>
        </div>
    );

    const dialogueContent = (
        <div className={styles.dialogueBox}>
            {text
                .replace(/Speaker 0:/g, `${speaker_0.name}:`)
                .replace(/Speaker 1:/g, `${speaker_1.name}:`)
                .split('\n')
                .map((line, index) => {
                    if (!line.trim()) return null; // Skip empty lines

                    const colonIndex = line.indexOf(':');
                    const speakerName = line.substring(0, colonIndex + 1);
                    const message = line.substring(colonIndex + 2); // +2 to also remove the space after the colon

                    const isDialogue = speakerName.trim().endsWith(':');
                    const speakerClass = isDialogue ? (speakerName.startsWith(speaker_0.name) ? styles.speaker0 : styles.speaker1) : '';

                    return (
                        <p key={index} className={speakerClass}>
                            <span className={styles.bold}>{speakerName}</span><p className={styles.dialogueText}>{message}</p>
                        </p>
                    );
                })}
        </div>
    );

    return (
        <>
            {introText}
            {dialogueContent}
        </>
    );
};

export default TextWithLineBreaks;