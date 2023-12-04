import styles from '@/styles/ConversationCard.module.css';

interface StyleClasses {
    cardClass: string;
    headerClass: string;
    footerClass: string;
    summaryClass: string;
    userNameClass: string;
}

type Status = 'Marked' | 'OK' | 'default';

const defaultClasses: StyleClasses = {
    cardClass: styles.conversationCard,
    headerClass: styles.cardHeader,
    footerClass: styles.cardFooter,
    summaryClass: '',
    userNameClass: styles.userName,
};

const statusStyles: Record<Status, StyleClasses> = {
    'Marked': {
        cardClass: styles.conversationCardMarked,
        headerClass: styles.cardHeaderMarked,
        footerClass: styles.cardFooterMarked,
        summaryClass: '',
        userNameClass: styles.userName,
    },
    'OK': {
        cardClass: styles.conversationCardOK,
        headerClass: styles.cardHeaderOK,
        footerClass: styles.cardFooterOK,
        summaryClass: styles.greyText,
        userNameClass: styles.userNameOk,
    },
    'default': defaultClasses,
};
