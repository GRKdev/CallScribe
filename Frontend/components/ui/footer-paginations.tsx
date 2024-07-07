import React from 'react';
import PaginationSection from '@/components/ui/pagination-component';

interface FooterCardProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    postsPerPage: number;
    totalPosts: number;
}

const FooterCard: React.FC<FooterCardProps> = ({
    currentPage,
    setCurrentPage,
    postsPerPage,
    totalPosts,
}) => (
    <div className="w-full text-center pt-5 text-gray-500">
        {totalPosts > postsPerPage && (
            <PaginationSection
                totalPosts={totalPosts}
                postsPerPage={postsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        )}
    </div>
);

export default FooterCard;
