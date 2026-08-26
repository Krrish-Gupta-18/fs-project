import React from 'react';
import { Menu, Info } from 'lucide-react';

export function ChatHeader({
  conversation,
  isTyping,
  onToggleMobileSidebar,
  onToggleInfoPanel,
  isInfoPanelOpen,
}) {
  if (!conversation) return null;

  const { name, avatar, status } = conversation;

  return (
    <div className="h-14 px-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile drawer toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 text-gray-500 hover:text-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>

        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover"
        />

        <div>
          <h2 className="text-sm font-bold text-gray-800">{name}</h2>
          {isTyping ? (
            <span className="text-xs text-blue-600 font-semibold animate-pulse">
              {name} is typing...
            </span>
          ) : (
            <span className="text-xs text-gray-500 capitalize">
              {status === 'online' ? '● Online' : 'Offline'}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onToggleInfoPanel}
        className={`p-2 rounded-md transition-colors ${
          isInfoPanelOpen
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
        title="Toggle Info Panel"
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
}
