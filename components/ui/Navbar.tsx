import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/hooks/calendar';

type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date) => void; // Add this prop for the calendar form
};
const Navbar: React.FC<NavbarProps> = ({
    searchTerm,
    onSearchChange,
    timeFilter,
    onTimeFilterChange,
    onDateSelect // Include onDateSelect in your props
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
            <div className="pt-4 px-4">
            </div>
            <div className="p-8">
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
