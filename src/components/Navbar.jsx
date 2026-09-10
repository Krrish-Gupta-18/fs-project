import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { MessageSquare, Trash2, UserCheck } from 'lucide-react';

/**
 * Navbar Component (Experiment No. 3)
 * Demonstrates consuming global state from ChatContext across independent components.
 */
export function Navbar() {
  // Access global state and actions from ChatContext via useContext hook
  const { messages, currentUser, clearChat } = useContext(ChatContext);

  const userName = typeof currentUser === 'object' ? currentUser?.name : currentUser;

  return (
    <div className="flex items-center gap-3">
      {/* Current User Badge from Context */}
      {userName && (
        <div 
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
          title="Logged-in user from ChatContext"
        >
          <UserCheck className="w-3.5 h-3.5 text-green-600" />
          <span>{userName}</span>
        </div>
      )}

      {/* Real-time Global Message Counter from Context (Requirement 6) */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold shadow-xs"
        title="Total messages tracked in global ChatContext"
      >
        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
        <span>Messages: {messages ? messages.length : 0}</span>
      </div>

      {/* Clear Chat Action from Context */}
      {clearChat && (
        <button
          onClick={clearChat}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Clear all messages in active conversation (ChatContext action)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Navbar;
