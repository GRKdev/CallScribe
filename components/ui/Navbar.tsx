import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";

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
            <ModeToggle />
            <div className="searchContainer">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search conversations"
                />
            </div>
            <div className="filterButtons">
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
        </nav>
    );
};

export default Navbar;
