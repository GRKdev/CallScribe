import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/hooks/calendar';
import SentimentChart from "@/hooks/SentimentChart";

type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date) => void; // Add this prop for the calendar form
};
const Navbar: React.FC<NavbarProps & { sentimentCounts: SentimentCounts }> = ({
    searchTerm,
    onSearchChange,
    timeFilter,
    onTimeFilterChange,
    onDateSelect,
    sentimentCounts,

}) => {
    return (
        <nav className="navbar">

            <div className="p-4">
                <div className="searchContainer">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search conversations"
                    />
                </div>
            </div>
            <div className="filterButtons justify-between px-2">
                {['24h', '7d', '1m', '3m', 'all'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onTimeFilterChange(filter)}
                        className={timeFilter === filter ? 'activeFilter' : ''}
                    >
                        {filter}
                    </button>
                ))}
                <CalendarForm onDateSelect={onDateSelect} />
            </div>
            <div className="sentiment-chart-container p-4" style={{ height: '200px' }}>
                <SentimentChart sentimentCounts={sentimentCounts} />
            </div>

            <div className="p-8">
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;

// ok works with changing to   const [allConversations, sentimentCounts] = useFetchConversations(timeFilter, customDate);
