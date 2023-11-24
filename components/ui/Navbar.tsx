import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/hooks/calendar';
import SentimentChart from "@/hooks/SentimentChart";
import { SentimentCounts } from '@/types/conversation';
import { ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react';

type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date) => void;
    sentimentCounts: SentimentCounts;
    isNavShrunk: boolean;
    onToggleNav: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
    searchTerm,
    onSearchChange,
    timeFilter,
    onTimeFilterChange,
    onDateSelect,
    sentimentCounts,
    isNavShrunk,
    onToggleNav,
}) => {
    return (
        <nav className={`navbar ${isNavShrunk ? 'shrunk' : ''}`}>
            {isNavShrunk ? (
                <button onClick={onToggleNav}><ArrowRightFromLine /></button>
            ) : (
                <>
                    <div className="p-4">
                        <div className="searchContainer flex justify-between">
                            <div className="pr-2">
                                <ModeToggle />
                            </div>
                            <input
                                className="pl-2"
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
                    <div className="chartBox p-1" style={{ height: '200px' }}>
                        <SentimentChart sentimentCounts={sentimentCounts} />
                    </div>
                    <button
                        onClick={onToggleNav}
                        style={{ float: 'right' }}
                        className="toggle-nav-btn pr-2"
                    >
                        <ArrowLeftFromLine />
                    </button>


                </>
            )}
        </nav>
    );
};

export default Navbar;
