import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/hooks/calendar';
import SentimentChart from "@/hooks/SentimentChart";
import { SentimentCounts, ConversationCounts } from '@/types/conversation';
import { ArrowRightFromLine, ArrowLeftFromLine, Bookmark, BookmarkCheck, BookmarkX, Meh, Frown, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button"
import CallLogo from "@/components/ui/ccLogo"
import Logo from '@/components/ui/Logo';

type NavbarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    timeFilter: string;
    onTimeFilterChange: (filter: string) => void;
    onDateSelect: (date: Date | null) => void;
    sentimentCounts: SentimentCounts;
    isNavShrunk: boolean;
    onToggleNav: () => void;
    statusFilter: string;
    onStatusFilterChange: (filter: string) => void;
    conversationCounts: ConversationCounts;
    sentimentFilter: string;
    onSentimentFilterChange: (filter: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({
    searchTerm,
    onSearchChange,
    timeFilter,
    onTimeFilterChange,
    statusFilter,
    onStatusFilterChange,
    onDateSelect,
    sentimentCounts,
    isNavShrunk,
    onToggleNav,
    conversationCounts,
    sentimentFilter,
    onSentimentFilterChange,

}) => {

    return (
        <nav className={`navbar ${isNavShrunk ? 'shrunk' : ''}`}>
            {isNavShrunk ? (
                <button style={{ justifyContent: 'center' }} onClick={onToggleNav}><ArrowRightFromLine /></button>
            ) : (
                <>  <header className="flex justify-center items-center align-middle p-1 gap-2 pt-4">
                    <Logo />
                    {/* <div className="logo-icon">
                        <CallLogo />

                    </div> */}
                </header>

                    <section className="searchContainer flex justify-between p-4">

                        <input
                            className="pl-2"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search conversations"
                        />
                    </section>

                    <section className="filterButtons justify-between px-2">
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
                    </section>

                    <section className="filterButtons justify-between px-11 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('all')}
                            className={statusFilter === 'all' ? 'activeFilter' : ''}

                        >
                            All
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('Marked')}
                            className={statusFilter === 'Marked' ? 'activeFilter' : ''}
                        >
                            <BookmarkX width={18} color='red' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('OK')}
                            className={statusFilter === 'OK' ? 'activeFilter' : ''}
                        >
                            <BookmarkCheck width={18} color='green' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('Not Read')}
                            className={statusFilter === 'Not Read' ? 'activeFilter' : ''}
                        >
                            <Bookmark width={18} />

                        </Button>
                    </section>

                    <section className="filterButtons justify-between px-11 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('all')}
                            className={sentimentFilter === 'all' ? 'activeFilter' : ''}
                        >
                            All
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('Negative')}
                            className={sentimentFilter === 'Negative' ? 'activeFilter' : ''}
                        >
                            <Frown width={18} color='red' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('Positive')}
                            className={sentimentFilter === 'Positive' ? 'activeFilter' : ''}
                        >
                            <Smile width={18} color='green' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('Neutral')}
                            className={sentimentFilter === 'Neutral' ? 'activeFilter' : ''}
                        >
                            <Meh width={18} />

                        </Button>
                    </section>


                    <ul className="hidden md:flex tagConversationContainer p-2">
                        <li className='tagConversation'>Not Read: <span className="not-read-count">{conversationCounts.not_read}</span></li>
                        <li className='tagConversation'>Marked: <span className="marked-count">{conversationCounts.marked}</span></li>
                        <li className='tagConversation'>Ok: <span className="ok-count">{conversationCounts.ok}</span></li>
                    </ul>

                    <aside className="chartBox" style={{ height: '200px' }}>
                        <SentimentChart sentimentCounts={sentimentCounts} />
                    </aside >

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
