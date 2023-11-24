import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/hooks/calendar';
import SentimentChart from "@/hooks/SentimentChart";
import { SentimentCounts, ConversationCounts } from '@/types/conversation';
import { ArrowRightFromLine, ArrowLeftFromLine, Bookmark, BookmarkCheck, BookmarkX } from 'lucide-react';
import { Button } from "@/components/ui/button"
import CallLogo from "@/components/ui/ccLogo"

type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date) => void;
    sentimentCounts: SentimentCounts;
    isNavShrunk: boolean;
    onToggleNav: () => void;
    filterStatus: (status: string) => void;
    conversationCounts: ConversationCounts;
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
    conversationCounts
}) => {
    return (
        <nav className={`navbar ${isNavShrunk ? 'shrunk' : ''}`}>
            {isNavShrunk ? (
                <button style={{ justifyContent: 'center' }} onClick={onToggleNav}><ArrowRightFromLine /></button>
            ) : (
                <>  <div className="flex justify-center items-center p-1 gap-2">
                    <h1 className="text-center text-2xl font-bold">CallScribe Center</h1>
                    <div className="logo-icon">
                        <CallLogo />
                    </div>
                </div>

                    <div className="p-4">
                        <div className="searchContainer flex justify-between">

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
                        {['24h', '7d', '1m', 'all'].map((filter) => (
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

                    <div className="filterButtons justify-between px-11 pt-2">
                        <Button variant="secondary" onClick={() => filterStatus('OK')}>All</Button>
                        <Button variant="secondary" onClick={() => filterStatus('Marked')}><BookmarkX width={18} color='red' /></Button>
                        <Button variant="secondary" onClick={() => filterStatus('Not Read')}><Bookmark width={18} /></Button>
                        <Button variant="secondary" onClick={() => filterStatus('OK')}><BookmarkCheck width={18} color='green' /></Button>
                    </div>
                    <ul className="tagConversationContainer p-2">
                        <li className='tagConversation'>Not Read: <span className="not-read-count">{conversationCounts.not_read}</span></li>
                        <li className='tagConversation'>Marked: <span className="marked-count">{conversationCounts.marked}</span></li>
                        <li className='tagConversation'>OK: <span className="ok-count">{conversationCounts.ok}</span></li>
                    </ul>

                    <div className="hidden md:flex chartBox" style={{ height: '200px' }}>
                        <SentimentChart sentimentCounts={sentimentCounts} />
                    </div>
                    <div className="tagContainer p-2">

                        <ModeToggle />

                        <button
                            onClick={onToggleNav}
                            style={{ float: 'right' }}
                            className="toggle-nav-btn pr-2"
                        >
                            <ArrowLeftFromLine />
                        </button>
                    </div>


                </>
            )}
        </nav>
    );
};

export default Navbar;
