'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { deleteComment } from '@/action';

const CommentEntry = ({ comment }) => {
    const formattedDate = new Date(comment.createdAt).toLocaleString();
    const [isthere, setIsthere] = useState(true);

    useEffect(() => {
        if(comment.id === 0){
            setIsthere(false);
        }
    }
    , [comment]);

    return (
        isthere?
        <div className="mb-4">
            <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            <div className='flex justify-start item-center'>
                <span className="text-sm flex">{comment.content}</span>
                <svg
                    role="graphics-symbol"
                    className={clsx("w-5 h-5 mt-0.5 mr-1  text-stone-400 hover:text-red-500 cursor-pointer transition-colors duration-200 ml-auto"
                    , isthere && 'text-stone-500'
                    )}
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    deleteComment(comment.id);
                    setIsthere(false);
                    }}
                >
                    <path
                    d="M6 6 L18 18 M18 6 L6 18"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    />
                </svg>
            </div>
            
        </div> : null
    );
};

export default CommentEntry;