import React from 'react';

interface FormatDateTimeProps {
    isoString: string;
}

const FormatDateTime: React.FC<FormatDateTimeProps> = ({ isoString }) => {
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes} / ${day}-${month}-${year}`;
    };

    return <span>{formatDateTime(isoString)}</span>;
};

export default FormatDateTime;
