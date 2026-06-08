import { useState } from "react";
import { MessageSquare, Send, CornerDownRight } from "lucide-react";
import { useRole } from "@/hooks/useRole";

interface User {
    name?: string;
    email?: string;
    avatar_url?: string;
}

interface Comment {
    id: string;
    content: string;
    parentId?: string;
    parent_id?: string;
    parent?: { id: string };
    replies?: Comment[];
    createdAt?: string;
    created_at?: string;
    userName?: string;
    user?: User;
}

interface CardCommentsProps {
    comments: Comment[];
    loadingComments: boolean;
    currentUser: any;
    onAddComment: (content: string) => Promise<void>;
    onAddReply: (content: string, parentId: string) => Promise<void>;
}

export default function CardComments({
    comments,
    loadingComments,
    currentUser,
    onAddComment,
    onAddReply
}: CardCommentsProps) {
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
    const { can } = useRole();

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmittingComment) return;
        setIsSubmittingComment(true);
        try {
            await onAddComment(commentText.trim());
            setCommentText("");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleReplySubmit = async (parentId: string) => {
        if (!replyText.trim() || submittingReplyId) return;
        setSubmittingReplyId(parentId);
        try {
            await onAddReply(replyText.trim(), parentId);
            setReplyText("");
            setActiveReplyId(null);
        } finally {
            setSubmittingReplyId(null);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquare size={18} />
                    <h3 className="font-semibold text-sm">Comments & Activity</h3>
                </div>
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-705 flex-shrink-0">
                    {currentUser?.name?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <textarea 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isSubmittingComment || !can("COMMENT")}
                        title={!can("COMMENT") ? "You don't have permission to comment" : undefined}
                        className="w-full silver-input text-gray-850 rounded-lg p-2.5 text-sm resize-none focus:outline-none transition h-10 focus:h-20 disabled:opacity-50"
                        placeholder={can("COMMENT") ? "Write a comment..." : "Commenting not allowed for your role"}
                    />
                    {commentText.trim() && (
                        <button
                            type="submit"
                            disabled={isSubmittingComment}
                            className="self-end silver-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                            <Send size={12} />
                            {isSubmittingComment ? "Commenting..." : "Comment"}
                        </button>
                    )}
                </div>
            </form>

            {/* Comments Thread list */}
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
                {loadingComments && (
                    <p className="text-gray-500 text-xs">Loading comments...</p>
                )}
                
                {!loadingComments && comments.length === 0 && (
                    <p className="text-gray-400 text-xs text-center py-6">No comments yet. Be the first to say something!</p>
                )}
                
                {!loadingComments && comments.length > 0 && (
                    <div className="space-y-4">
                        {comments
                            .filter((c) => {
                                const pId = c.parentId || c.parent_id || c.parent?.id;
                                return !pId;
                            })
                            .map((c) => {
                                const renderComment = (comment: Comment, isReply: boolean = false) => {
                                    const replies = comment.replies || comments.filter((r) => {
                                        const pId = r.parentId || r.parent_id || r.parent?.id;
                                        return pId === comment.id;
                                    });
                                    const initials = comment.user?.name?.charAt(0).toUpperCase() || comment.userName?.charAt(0).toUpperCase() || "U";
                                    const userName = comment.user?.name || comment.userName || "User";
                                    
                                    const formatCommentTime = (dateStr: string) => {
                                        try {
                                            const date = new Date(dateStr);
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            });
                                        } catch (e) {
                                            return dateStr;
                                        }
                                    };
                                    const timeStr = formatCommentTime(comment.createdAt || comment.created_at || "");

                                    return (
                                        <div key={comment.id} className={`flex flex-col gap-2 ${isReply ? "ml-6 border-l border-gray-200 pl-3 mt-2" : "border-b border-gray-200 pb-3 last:border-b-0"}`}>
                                            <div className="flex gap-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-700 flex-shrink-0 bg-gray-200`}>
                                                    {comment.user?.avatar_url ? (
                                                        <img src={comment.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : initials}
                                                </div>
                                                <div className="flex-1 text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-gray-800">{userName}</span>
                                                        <span className="text-[9px] text-gray-500">{timeStr}</span>
                                                    </div>
                                                    <p className="text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed text-[12px]">{comment.content}</p>
                                                    
                                                    {!isReply && (
                                                        <button
                                                            onClick={() => {
                                                                if (activeReplyId === comment.id) {
                                                                    setActiveReplyId(null);
                                                                    setReplyText("");
                                                                } else {
                                                                    setActiveReplyId(comment.id);
                                                                    setReplyText("");
                                                                }
                                                            }}
                                                            className="text-[10px] text-gray-750 hover:text-gray-950 mt-1.5 font-bold transition flex items-center gap-1"
                                                        >
                                                            <CornerDownRight size={10} />
                                                            Reply {replies.length > 0 && <span className="text-gray-500">({replies.length})</span>}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reply textarea */}
                                            {activeReplyId === comment.id && !isReply && (
                                                 <div className="ml-9 mt-1.5 flex flex-col gap-1.5">
                                                     <textarea
                                                         value={replyText}
                                                         onChange={(e) => setReplyText(e.target.value)}
                                                         disabled={submittingReplyId === comment.id}
                                                         placeholder="Reply to this comment..."
                                                         className="w-full silver-input text-gray-850 rounded-lg p-2 text-xs resize-none focus:outline-none transition h-12 disabled:opacity-50"
                                                         autoFocus
                                                     />
                                                     <div className="flex justify-end gap-1.5">
                                                         <button
                                                             type="button"
                                                             disabled={submittingReplyId === comment.id}
                                                             onClick={() => {
                                                                 setActiveReplyId(null);
                                                                 setReplyText("");
                                                             }}
                                                             className="text-gray-550 hover:text-gray-800 text-[10px] font-semibold px-2 py-1 transition disabled:opacity-50"
                                                         >
                                                             Cancel
                                                         </button>
                                                         <button
                                                             type="button"
                                                             onClick={() => handleReplySubmit(comment.id)}
                                                             disabled={!replyText.trim() || submittingReplyId === comment.id}
                                                             className="silver-btn text-[10px] font-bold px-2.5 py-1 rounded-md transition disabled:opacity-50 cursor-pointer"
                                                         >
                                                             {submittingReplyId === comment.id ? "Replying..." : "Reply"}
                                                         </button>
                                                     </div>
                                                 </div>
                                            )}

                                            {/* Replies recursion/list */}
                                            {replies.length > 0 && (
                                                <div className="space-y-2 mt-1">
                                                    {replies.map((r) => renderComment(r, true))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                };
                                return renderComment(c, false);
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
