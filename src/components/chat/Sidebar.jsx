import React from 'react';
import { ConversationItem } from './ConversationItem';
import { Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Sidebar({
  userProfile,
  conversations,
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  onNewChatClick,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full">
      {/* Top Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">ChatFlow</h1>
        <button
          onClick={onNewChatClick}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Current User Bar */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{userProfile.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{userProfile.email}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-gray-400 hover:text-red-600 p-1"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-gray-100">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search conversations..."
          className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50 text-xs">
        {['all', 'unread', 'groups'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-2 capitalize font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center py-6">No conversations found</p>
        )}
      </div>
    </div>
  );
}
