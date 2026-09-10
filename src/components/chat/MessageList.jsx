import React, { useRef, useEffect, useContext } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatContext } from '../../context/ChatContext';

export function MessageList({
  messages: propMessages,
  currentUser: propUser,
  isTyping: propIsTyping,
  onImageClick,
  activeConversation: propActiveConversation,
}) {
  // Access global state from ChatContext (Experiment No. 3)
  const context = useContext(ChatContext);
  const messages = context?.messages ?? propMessages ?? [];
  const currentUser = context?.currentUser ?? propUser;
  const isTyping = context?.isTyping !== undefined ? context.isTyping : propIsTyping;
  const activeConversation = context?.selectedChat ?? propActiveConversation;

  // Auto-scrolling message list to bottom on new messages
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
      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-xs">
          No messages yet. Send a message below to start the conversation!
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={msg.id || index}
            message={msg}
            currentUser={currentUser}
            onImageClick={onImageClick}
          />
        ))
      )}

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

