'use client';
import CommentEntry from '@/components/ui/CommentEntry';
import clsx from 'clsx';
import { createComment } from '@/action';
import { useSearchParams } from 'next/navigation';

const Comment = ({ Comments, onAddComment, isFolded, changeFold }) => {
    const searchParams = useSearchParams();
    
    const createNewComment = async () => {
        const content = document.getElementById('commentContent').value;
        console.log('content:', content);
        if (content === '') {
            alert('댓글을 입력해주세요.');
            return;
        }
        const noteId = parseInt(searchParams.get('id'), 10);
        console.log('noteId:', noteId);
        const formData = new FormData();
        formData.append('noteId', noteId);
        formData.append('contents', content);

        try {
            const response = await createComment(formData);
            if (response.error) {
                alert(response.error);
            } else {
                document.getElementById('commentContent').value = '';
                onAddComment(response);
            }
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    }

    return (
        <div>
            <div className={clsx("w-60 p-3 bg-stone-200 dark:bg-stone-800 rounded-md", { "h-12": isFolded, "min-h-screen": !isFolded})}>
            <h2 
                className="text-xl h-8 font-bold mb-4"
                onClick={changeFold}
            >Comments</h2>
            {isFolded ? null : (
            <div>
                <div>
                    {Comments?.length > 0 ? (
                        Comments.map((comment) => (
                            <CommentEntry
                                key={comment.id}
                                comment={comment}
                            />
                        ))
                        ):
                        null
                    }
                </div>
                <div>
                    <input
                        id="commentContent"
                        className="w-full min-h-20 border p-2 focus:outline-none dark:text-black"
                        placeholder="댓글을 입력하세요."
                    />
                    <button
                        onClick={createNewComment}
                        className="w-full bg-zinc-600 text-white py-2 mt-2 "
                        >
                            댓글 추가
                        </button>
                </div>
                </div>
            )}
        </div>
        <div className='bg-stone-100 dark:bg-stone-700 min-h-screen'></div>
        </div>
    );
};

export default Comment;