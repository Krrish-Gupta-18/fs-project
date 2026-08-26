import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';

export function MessageList({
  messages = [],
  currentUser,
  onImageClick,
  activeConversation,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      <div ref={bottomRef} />
    </div>
  );
}
