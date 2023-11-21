import React from 'react';
import styles from '@/styles/ConversationCard.module.css';
import { SpeakerType } from '@/types/conversation';

interface TextWithLineBreaksProps {
    text: string;
    speaker_0: SpeakerType;
    speaker_1: SpeakerType;
}
const TextWithLineBreaks: React.FC<TextWithLineBreaksProps> = ({ text, speaker_0, speaker_1 }) => {
    const introText = `Speaker 1: ${speaker_0.name}\nRole: ${speaker_0.role}\n\nSpeaker 2: ${speaker_1.name}\nRole: ${speaker_1.role}\n\n`;
    const dialogueText = text
        .replace(/Speaker 0:/g, `${speaker_0.name}:`)
        .replace(/Speaker 1:/g, `${speaker_1.name}:`);

    const fullText = introText + dialogueText;

    return (
        <>
            {fullText.split('\n').map((line, index) => {
                const colonIndex = line.indexOf(':');
                const speakerName = line.substring(0, colonIndex + 1);
                const message = line.substring(colonIndex + 1);

                const isIntro = line.startsWith('Speaker ') || line.startsWith('Role:');
                const speakerClass = isIntro ? styles.intro :
                    speakerName.includes(speaker_0.name) ? styles.speaker0 : styles.speaker1;

                return (
                    <p key={index} className={speakerClass}>
                        {isIntro || speakerName ? (
                            <>
                                <span className={styles.bold}>{speakerName}</span>
                                {message}
                            </>
                        ) : line}
                    </p>
                );
            })}
        </>
    );
};

export default TextWithLineBreaks;