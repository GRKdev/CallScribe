import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/hooks/calendar';

interface NavbarProps {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    timeFilter: string;
    onTimeFilterChange: (newFilter: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
    searchTerm,
    onSearchChange,
    timeFilter,
    onTimeFilterChange,
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
            <div className="filterButtons justify-between px-8 ">
                {['24h', '7d', '1m', '3m', 'all'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onTimeFilterChange(filter)}
                        className={timeFilter === filter ? 'activeFilter' : ''}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            <div className="pt-4 px-4">
                <CalendarForm />
            </div>
            <div className="p-8">
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
