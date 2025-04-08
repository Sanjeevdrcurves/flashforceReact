import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// Extended Quill toolbar modules for rich formatting
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["clean"],
  ],
};

// Helper function to clean the HTML output from Quill
// This removes any paragraph that contains only an "@" (with optional whitespace)
// and also removes trailing empty paragraphs.
const cleanHTML = (html) => {
  return html
    .replace(/<p>\s*@\s*<\/p>/g, "")
    .replace(/<p><br><\/p>/g, "").replace(/n/g,"")
    .trim();
};

const CommentComponent = () => {
  // Get company and user info from Redux
  const { companyId, userId, fullName } = useSelector((state) => state.AuthReducerKey);

  // Static query parameters for fetching comments (adjust as needed)
  const communicationId = 0;
  const activityId = 112;
  const objectTypeID = 117;
  const objectId = 108;

  // Component state for comments, loading and dropdown
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  // dropdownOpenIndex holds the communicationId of the comment whose dropdown is open
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);

  // State for add/edit form (for top-level comments)
  const [editingComment, setEditingComment] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [messageType, setMessageType] = useState("Public"); // "Public" or "Private"

  // State for reply functionality
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // State for mention functionality (for comment editor)
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [mentionedUsers, setMentionedUsers] = useState([]); // stores selected mentions

  // New state for reply mention functionality
  const [replyShowMentionList, setReplyShowMentionList] = useState(false);
  const [replyMentionSuggestions, setReplyMentionSuggestions] = useState([]);

  // Ref for comments container (for auto-scroll)
  const commentsContainerRef = useRef(null);

  // Load available users from API for mention functionality
  useEffect(() => {
    if (!companyId) return;
    axios
      .get(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => {
        const users = Array.isArray(res.data) ? res.data : res.data.data;
        const userOptions = users.map((u) => ({
          id: String(u.userID),
          name: `${u.firstName} ${u.lastName}`,
        }));
        setAvailableUsers(userOptions);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load providers.");
      });
  }, [companyId]);

  // Load comments from API
  const loadComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/CustomObject/GetCommentDetail`, {
        params: { communicationId, activityId, objectTypeID, objectId },
      });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when comments update
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Load comments when companyId changes
  useEffect(() => {
    if (companyId) loadComments();
  }, [companyId]);

  // Handle change in the main comment editor
  const handleCommentChange = (content, delta, source, editor) => {
    setCommentText(content);debugger
    const plainText = editor.getText();
    const words = plainText.split(" ")
    const lastWord = words[words.length - 1];
   
    // Show list of users if last word starts with '@'
    if (lastWord.startsWith("@") || lastWord.startsWith("@/n")) {
      const query = lastWord.slice(1).toLowerCase().trim();
      const filtered = availableUsers.filter((u) =>
        u.name.toLowerCase().includes(query)
      );
      setMentionSuggestions(filtered);
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  };

  // Handle change in the reply editor with mention functionality
  const handleReplyChange = (content, delta, source, editor) => {
    setReplyText(content);
    const plainText = editor.getText();
    const words = plainText.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = availableUsers.filter((u) =>
        u.name.toLowerCase().includes(query)
      );
      setReplyMentionSuggestions(filtered);
      setReplyShowMentionList(true);
    } else {
      setReplyShowMentionList(false);
    }
  };

  // Opens the mention list when the "@" button is clicked (for main comment)
  const handleShowMentionListFromButton = () => {
    setMentionSuggestions(availableUsers);
    setShowMentionList(true);
  };

  // Insert the selected user's name into the main comment editor
  const insertMention = (user) => {
    const newText = commentText + " @" + user.name + " ";
    setCommentText(newText);
    setMentionedUsers((prev) => [...prev, user]);
    setShowMentionList(false);
    // Optionally remove the user from availableUsers to avoid duplicates
    setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  // Insert the selected user's name into the reply editor
  const insertReplyMention = (user) => {
    const newText = replyText + " @" + user.name + " ";
    setReplyText(newText);
    setReplyShowMentionList(false);
    // Optionally remove the user from availableUsers if needed
    setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  // Handle form submission for add/update comment (non-reply)
  const handleSubmitComment = async () => {
    // Clean the HTML before validating or saving
    const cleanedHTML = commentText;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = commentText;
    const textOnly = tempDiv.textContent || tempDiv.innerText || "";
    if (!textOnly.trim()) {
      toast.error("Please enter a comment.");
      return;
    }
    const payload = {
      OperationType: editingComment ? "Update" : "Add",
      CommunicationId: editingComment ? editingComment.communicationId : 0,
      Direction: "In",
      Recipient: mentionedUsers.map((u) => u.id).join(","), // comma-separated string
      Body: cleanedHTML,
      ActivityId: activityId,
      CreatedBy: userId,
      CompanyId: companyId,
      InternalComment: messageType, // "Public" or "Private"
      ObjectTypeID: objectTypeID,
      ObjectId: objectId,
      ParentCommunicationId: 0, // top-level comment
    };

    try {
      const { data } = await axios.post(`${API_URL}/CustomObject/AddComment`, payload);
      if (data.success) {
        toast.success("Comment saved successfully");
        setCommentText("");
        setEditingComment(null);
        setMentionedUsers([]);
        loadComments();
      } else {
        toast.error(data.message || "Failed to save comment.");
      }
    } catch (error) {
      console.error("Error saving comment:", error.response?.data || error);
      toast.error("Error saving comment.");
    }
  };

  // Handle reply submission for a specific comment
  const handleSubmitReply = async () => {
    const cleanedHTML = replyText;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanedHTML;
    const textOnly = tempDiv.textContent || tempDiv.innerText || "";
    if (!textOnly.trim()) {
      toast.error("Please enter a reply.");
      return;
    }
    const payload = {
      OperationType: "Add",
      CommunicationId: 0,
      Direction: "In",
      Recipient: "", // For replies, recipient may be empty
      Body: cleanedHTML,
      ActivityId: activityId,
      CreatedBy: userId,
      CompanyId: companyId,
      InternalComment: messageType,
      ObjectTypeID: objectTypeID,
      ObjectId: objectId,
      ParentCommunicationId: replyCommentId, // indicates this is a reply
    };

    try {
      const { data } = await axios.post(`${API_URL}/CustomObject/AddComment`, payload);
      if (data.success) {
        toast.success("Reply saved successfully");
        setReplyCommentId(null);
        setReplyText("");
        loadComments();
      } else {
        toast.error(data.message || "Failed to save reply.");
      }
    } catch (error) {
      console.error("Error saving reply:", error.response?.data || error);
      toast.error("Error saving reply.");
    }
  };

  // Handle edit comment: load comment into form for editing (for top-level comments)
  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.body);
    setMessageType(comment.internalComment === "Public" ? "Public" : "Private");
    setDropdownOpenIndex(null);
  };

  // Handle delete comment with confirmation; only for the specific comment
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    try {
      await axios.post(`${API_URL}/CustomObject/DeleteComment`, null, {
        params: {
          communicationId: commentId,
          modifiedBy: userId,
        },
      });
      toast.success("Comment deleted successfully!");
      loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error);
      toast.error("Failed to delete comment.");
    }
  };

  // Separate top-level comments from replies (assuming API returns ParentCommunicationId)
  const topLevelComments = comments.filter((c) => c.parentCommunicationId === 0);
  const getRepliesForComment = (parentId) =>
    comments.filter((c) => c.parentCommunicationId === parentId);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* Comment List with auto-scroll */}
      <div className="max-h-[300px] overflow-y-auto border p-2 rounded mb-4" ref={commentsContainerRef}>
        {loading ? (
          <p>Loading comments...</p>
        ) : topLevelComments.length === 0 ? (
          <p className="text-gray-500">No comments available.</p>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <div
                key={comment.communicationId}
                className="p-4 bg-white rounded shadow relative flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar: Display first letter of userName with background color */}
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                    {comment.userName ? comment.userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: comment.body }} />
                    <div className="mt-2 text-xs text-gray-500">
                      <span>By: {comment.userName}</span> | <span>{comment.commentDate}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setDropdownOpenIndex(
                          dropdownOpenIndex === comment.communicationId ? null : comment.communicationId
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {dropdownOpenIndex === comment.communicationId && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                        {/* Uncomment Edit button if needed */}
                        {/* <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => handleEditComment(comment)}
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </button> */}
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => setReplyCommentId(comment.communicationId)}
                        >
                          <Plus className="h-4 w-4" /> Reply
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => handleDeleteComment(comment.communicationId)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Reply Listing for this comment */}
                {getRepliesForComment(comment.communicationId).length > 0 && (
                  <div className="ml-10 border-l pl-4 space-y-3">
                    {getRepliesForComment(comment.communicationId).map((reply) => (
                      <div key={reply.communicationId} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">
                          {reply.userName ? reply.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: reply.body }} />
                          <div className="mt-1 text-xs text-gray-500">
                            <span>By: {reply.userName}</span> |{" "}
                            <span>{reply.commentDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply Editor: Only show for the comment being replied to */}
                {replyCommentId === comment.communicationId && (
                  <div className="ml-10 border-l pl-4 relative">
                    <ReactQuill
                      value={replyText}
                      onChange={handleReplyChange}
                      placeholder="Write your reply..."
                      modules={quillModules}
                    />
                    {replyShowMentionList && (
                      <div className="absolute z-10 bg-white shadow-lg border rounded w-full max-h-40 overflow-y-auto mt-1">
                        {replyMentionSuggestions.map((user) => (
                          <div
                            key={user.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => insertReplyMention(user)}
                          >
                            {user.name}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setReplyCommentId(null);
                          setReplyText("");
                        }}
                      >
                        Cancel Reply
                      </button>
                      <button
                        className="btn btn-primary btn-sm flex items-center gap-1"
                        onClick={handleSubmitReply}
                      >
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form for new comments using ReactQuill */}
      <div className="mt-6 p-4 bg-white rounded shadow">
        <div className="relative">
          <ReactQuill
            value={commentText}
            onChange={handleCommentChange}
            placeholder="Enter your comment..."
            modules={quillModules}
          />
          {showMentionList && (
            <div className="absolute z-10 bg-white shadow-lg border rounded w-full max-h-40 overflow-y-auto mt-1">
              {mentionSuggestions.map((user) => (
                <div
                  key={user.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => insertMention(user)}
                >
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <button className="btn btn-outline btn-sm" onClick={handleShowMentionListFromButton}>
            @
          </button>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <button onClick={handleSubmitComment} className="btn btn-primary flex items-center gap-2">
            {editingComment ? "Update" : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
