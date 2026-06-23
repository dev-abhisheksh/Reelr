import React, { useState, useEffect, useRef } from "react";
import { getComments, addComment } from "../../api/comment.api";
import { useAuth } from "../../context/AuthContext";
import { X, Send, CornerDownRight, MessageSquare, Loader } from "lucide-react";
import { toast } from "sonner";

const CommentSection = ({ reelId, isOpen, onClose, onCommentAdded }) => {
    const { user: currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    // Tracks which comment we are currently replying to
    const [replyingTo, setReplyingTo] = useState(null); // comment object
    
    // Tracks which comment replies threads are expanded (visible)
    const [expandedReplies, setExpandedReplies] = useState({}); // { [commentId]: boolean }

    const inputRef = useRef(null);
    const commentsEndRef = useRef(null);

    // Fetch comments
    useEffect(() => {
        if (!isOpen || !reelId) return;

        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const res = await getComments(reelId);
                if (res.data?.success) {
                    setComments(res.data.comments || []);
                }
            } catch (err) {
                console.error("Failed to load comments:", err);
                toast.error("Failed to load comments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
        // Reset states
        setCommentText("");
        setReplyingTo(null);
        setExpandedReplies({});
    }, [isOpen, reelId]);

    // Handle posting a comment / reply
    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || submitting) return;

        setSubmitting(true);
        try {
            const parentId = replyingTo ? replyingTo._id : null;
            
            // Clean text if it has reply tag
            let textToSend = commentText;
            if (replyingTo && textToSend.startsWith(`@${replyingTo.userId.username}`)) {
                textToSend = textToSend.replace(`@${replyingTo.userId.username}`, "").trim();
            }

            const res = await addComment(reelId, textToSend, parentId);
            if (res.data?.success) {
                const newComment = res.data.data;
                
                // Add the newly created comment to local state
                setComments((prev) => [newComment, ...prev]);
                
                // Clear state
                setCommentText("");
                
                // If replying, automatically expand replies for the parent comment
                if (parentId) {
                    setExpandedReplies((prev) => ({
                        ...prev,
                        [parentId]: true
                    }));
                }

                if (onCommentAdded) {
                    onCommentAdded(newComment);
                }

                setReplyingTo(null);
                toast.success("Comment added");
            }
        } catch (err) {
            console.error("Failed to post comment:", err);
            toast.error(err.response?.data?.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    // Format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    };

    // Trigger reply state
    const handleReplyClick = (comment) => {
        setReplyingTo(comment);
        setCommentText(`@${comment.userId.username} `);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // Grouping comments
    const rootComments = comments.filter(c => !c.parentComment);
    const repliesMap = comments.reduce((acc, c) => {
        if (c.parentComment) {
            const pId = typeof c.parentComment === "object" ? c.parentComment._id : c.parentComment;
            acc[pId] = acc[pId] || [];
            // Sort replies ascending so it reads as a thread (oldest to newest)
            acc[pId].push(c);
        }
        return acc;
    }, {});

    // Sort replies by creation date ascending
    Object.keys(repliesMap).forEach(key => {
        repliesMap[key].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
            {/* Backdrop click area */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Comment Drawer Panel */}
            <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl animate-slide-left text-white z-10">
                
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-zinc-400" />
                        <h2 className="text-md font-semibold tracking-wide">Comments</h2>
                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                            {comments.length}
                        </span>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 hover:bg-zinc-800 rounded-full transition duration-200 cursor-pointer"
                    >
                        <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                    </button>
                </div>

                {/* Comments List Area */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader className="w-6 h-6 animate-spin text-zinc-500" />
                        </div>
                    ) : rootComments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                            <span className="text-4xl">💬</span>
                            <p className="text-sm font-medium">No comments yet</p>
                            <p className="text-xs text-zinc-600">Start the conversation below</p>
                        </div>
                    ) : (
                        rootComments.map((comment) => {
                            const replies = repliesMap[comment._id] || [];
                            const isExpanded = !!expandedReplies[comment._id];

                            return (
                                <div key={comment._id} className="space-y-3">
                                    {/* Root Comment Item */}
                                    <div className="flex items-start gap-3 group">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800">
                                            {comment.userId?.profileImage ? (
                                                <img 
                                                    src={comment.userId.profileImage} 
                                                    alt={comment.userId.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                                                    {comment.userId?.username?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Block */}
                                        <div className="flex-1 space-y-1">
                                            <div className="text-xs">
                                                <span className="font-semibold text-zinc-200 hover:underline cursor-pointer mr-2">
                                                    {comment.userId?.username}
                                                </span>
                                                <span className="text-[10px] text-zinc-500">
                                                    {formatTimeAgo(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                                                {comment.comment}
                                            </p>
                                            <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-0.5">
                                                <button 
                                                    onClick={() => handleReplyClick(comment)}
                                                    className="hover:text-zinc-200 font-semibold cursor-pointer"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Replies Container */}
                                    {replies.length > 0 && (
                                        <div className="pl-11 space-y-3">
                                            {/* Expand/Collapse Button */}
                                            <button 
                                                onClick={() => toggleReplies(comment._id)}
                                                className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                                            >
                                                <span className="w-6 h-[1px] bg-zinc-800" />
                                                {isExpanded ? (
                                                    <span>Hide replies</span>
                                                ) : (
                                                    <span>View {replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
                                                )}
                                            </button>

                                            {/* Render Nested Replies */}
                                            {isExpanded && (
                                                <div className="space-y-4 pt-1 animate-fade-in">
                                                    {replies.map((reply) => (
                                                        <div key={reply._id} className="flex items-start gap-3">
                                                            {/* Reply Avatar */}
                                                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800">
                                                                {reply.userId?.profileImage ? (
                                                                    <img 
                                                                        src={reply.userId.profileImage} 
                                                                        alt={reply.userId.username}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                                        {reply.userId?.username?.[0]?.toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Reply Content */}
                                                            <div className="flex-1 space-y-0.5">
                                                                <div className="text-xs">
                                                                    <span className="font-semibold text-zinc-200 hover:underline cursor-pointer mr-2">
                                                                        {reply.userId?.username}
                                                                    </span>
                                                                    <span className="text-[10px] text-zinc-500">
                                                                        {formatTimeAgo(reply.createdAt)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                                                                    <span className="text-sky-500 font-medium mr-1.5">
                                                                        @{comment.userId?.username}
                                                                    </span>
                                                                    {reply.comment}
                                                                </p>
                                                                <div className="flex items-center gap-3 text-[10px] text-zinc-500 pt-0.5">
                                                                    <button 
                                                                        onClick={() => handleReplyClick(comment)}
                                                                        className="hover:text-zinc-200 font-semibold cursor-pointer"
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                    <div ref={commentsEndRef} />
                </div>

                {/* Bottom Input Area */}
                <div className="border-t border-zinc-800 px-4 py-4 bg-zinc-950 space-y-3">
                    {/* Reply Indicator banner */}
                    {replyingTo && (
                        <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 rounded-lg text-xs">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                                <CornerDownRight className="w-3.5 h-3.5 text-zinc-500" />
                                Replying to <span className="text-sky-400 font-semibold">@{replyingTo.userId.username}</span>
                            </span>
                            <button 
                                onClick={() => {
                                    setReplyingTo(null);
                                    setCommentText("");
                                }} 
                                className="text-zinc-500 hover:text-white cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Post Comment Input form */}
                    <form onSubmit={handlePostComment} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700">
                            {currentUser?.profileImage ? (
                                <img 
                                    src={currentUser.profileImage} 
                                    alt="My Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                                    {currentUser?.username?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
                            />
                            
                            <button
                                type="submit"
                                disabled={!commentText.trim() || submitting}
                                className={`absolute right-3 p-1 rounded-full text-sky-500 hover:text-sky-400 disabled:opacity-40 disabled:hover:text-sky-500 transition duration-150 cursor-pointer`}
                            >
                                {submitting ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
