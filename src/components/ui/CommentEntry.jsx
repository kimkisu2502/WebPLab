'use client';

const CommentEntry = ({ comment }) => {
    const formattedDate = new Date(comment.createdAt).toLocaleString();

    return (
        <div className="mb-4">
            <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
        </div>
    );
};

export default CommentEntry;