import React from 'react';

export function ConversationItem({ conversation, isActive, onClick }) {
  const { name, avatar, status, lastMessage, timestamp, unreadCount } = conversation;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border ${
        isActive
          ? 'bg-blue-50 border-blue-200 text-gray-900'
          : 'hover:bg-gray-50 border-transparent text-gray-700'
      }`}
    >
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        {status === 'online' && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="text-sm font-semibold truncate text-gray-900">{name}</h4>
          <span className="text-xs text-gray-400">{timestamp}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
