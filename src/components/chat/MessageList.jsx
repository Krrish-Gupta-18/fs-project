import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';

export function MessageList({
  messages = [],
  currentUser,
  isTyping,
  onImageClick,
  activeConversation,
}) {
  // Section 10 Requirement: useRef for auto-scrolling message list to bottom
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id || index}
          message={msg}
          currentUser={currentUser}
          onImageClick={onImageClick}
        />
      ))}

      {/* Animated Typing Indicator Bubble */}
      {isTyping && (
        <div className="flex gap-2 my-2 justify-start items-center">
          <img
            src={activeConversation.avatar}
            alt={activeConversation.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs text-gray-500 flex items-center gap-1">
            <span>{activeConversation.name} is typing</span>
            <span className="flex gap-0.5 ml-1">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
            </span>
          </div>
        </div>
      )}

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
