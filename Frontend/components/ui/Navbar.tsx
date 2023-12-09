import React from 'react';
import { ModeToggle } from "@/components/ui/toggle";
import { CalendarForm } from '@/components/ui/calendarForm';
import SentimentChart from "@/components/ui/SentimentChart";
import { ArrowRightFromLine, ArrowLeftFromLine, Bookmark, BookmarkCheck, BookmarkX, Meh, Frown, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Logo from '@/components/ui/Logo';
import { NavbarProps } from '@/types/conversation';
import { TimeFilterDescription } from '@/types/conversation';


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
    tagCounts,
    sentimentFilter,
    onSentimentFilterChange,


}) => {
    const sortedTags = tagCounts
        ? Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 15)
        : [];
    const timeFilterDescriptions: TimeFilterDescription = {
        '24h': '24 Hours',
        '7d': '7 Days',
        '1m': '1 Month',
        'all': 'All Time'
    };
    return (
        <nav className={`navbar ${isNavShrunk ? 'shrunk' : ''}`}>
            {isNavShrunk ? (
                <button style={{ justifyContent: 'center' }} onClick={onToggleNav}><ArrowRightFromLine /></button>
            ) : (
                <>  <header className="flex justify-center items-center align-middle p-1 gap-2 pt-4">
                    <Logo />
                </header>

                    <section className="searchContainer flex justify-between p-4">
                        <label htmlFor="searchInput" className="sr-only">Search Conversations</label>

                        <input
                            id="searchInput"
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
                                title={timeFilterDescriptions[filter as keyof TimeFilterDescription]}
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
                            title="All Conversations"

                        >
                            All
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('Marked')}
                            className={statusFilter === 'Marked' ? 'activeFilter' : ''}
                            title="Marked"
                        >
                            <BookmarkX width={18} color='red' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('OK')}
                            className={statusFilter === 'OK' ? 'activeFilter' : ''}
                            title="OK"
                        >
                            <BookmarkCheck width={18} color='green' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onStatusFilterChange('Not Read')}
                            className={statusFilter === 'Not Read' ? 'activeFilter' : ''}
                            title="Not Read"
                        >
                            <Bookmark width={18} />

                        </Button>
                    </section>

                    <section className="filterButtons justify-between px-11 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('all')}
                            className={sentimentFilter === 'all' ? 'activeFilter' : ''}
                            title="All Sentiments"
                        >
                            All
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('Negative')}
                            className={sentimentFilter === 'Negative' ? 'activeFilter' : ''}
                            title="Negative"
                        >
                            <Frown width={18} color='red' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('Positive')}
                            className={sentimentFilter === 'Positive' ? 'activeFilter' : ''}
                            title="Positive"
                        >
                            <Smile width={18} color='green' />

                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onSentimentFilterChange('Neutral')}
                            className={sentimentFilter === 'Neutral' ? 'activeFilter' : ''}
                            title="Neutral"
                        >
                            <Meh width={18} />

                        </Button>
                    </section>


                    <ul className="hidden md:flex tagConversationContainer p-2">
                        <li className='TagCount'>Not Read: <span className="not-read-count">{conversationCounts.not_read}</span></li>
                        <li className='TagCount'>Marked: <span className="marked-count">{conversationCounts.marked}</span></li>
                        <li className='TagCount'>Ok: <span className="ok-count">{conversationCounts.ok}</span></li>
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
                            title="Change Theme"
                        >
                            <ArrowLeftFromLine />
                        </button>
                    </div>

                    <ul className="tagConversationContainer p-2">
                        {sortedTags.map(([tag, count]) => (
                            <li key={tag} className='TagCount'>{tag}: <span className="font-bold">{count}</span></li>
                        ))}
                    </ul>


                </>
            )}
        </nav>
    );
};

export default Navbar;
