'use client';

const Comment = ({ Comments }) => {
    return (
    <div className="w-60 min-h-screen p-3 bg-stone-200">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
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
      <ul className="list-disc list-inside">
        이거다
      </ul>
    </div>
    );
};

export default Comment;