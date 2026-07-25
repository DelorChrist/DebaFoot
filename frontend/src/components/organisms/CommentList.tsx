import { Comment } from '../../types/comment.types';
import { CommentItem } from '../molecules/CommentItem';

interface CommentListProps {
  comments: Comment[];
  onDelete?: (id: string) => void;
  onEdit?: (comment: Comment) => void;
  onReply?: (commentId: string, username: string) => void;
}

export function CommentList({ comments, onDelete, onEdit, onReply }: CommentListProps) {
  // Assuming a simple flat list for now, or comments have a 'replies' array if fetched nested
  // If flat, we might need to organize them. The API returns top-level comments first.
  
  if (comments.length === 0) {
    return (
      <div className="p-4 text-center text-text-muted bg-surface-2 rounded-lg mt-4">
        Soyez le premier à commenter !
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            onDelete={onDelete}
            onEdit={onEdit}
            onReply={onReply}
          />
          {/* Render replies if they are included in the comment object, otherwise handled by fetching replies on demand */}
          {/* Note: In a full implementation, you'd fetch and render replies below the parent */}
        </div>
      ))}
    </div>
  );
}
