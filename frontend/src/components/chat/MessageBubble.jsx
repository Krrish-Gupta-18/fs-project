import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

export function MessageBubble({ message, currentUser, onImageClick }) {
  const { senderId, senderName, senderAvatar, text, timestamp, media, attachment, status } = message;
  const myId = currentUser?.id || currentUser?.userId;
  const isMe = senderId === myId;

  if (senderId === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 my-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <img
          src={senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
          alt={senderName}
          className="w-7 h-7 rounded-full object-cover mt-1"
        />
      )}

      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-[10px] text-gray-500 mb-0.5 block">{senderName}</span>
        )}

        <div
          className={`p-3 rounded-lg text-sm ${
            isMe
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
          }`}
        >
          {media && media.type === 'image' && (
            <img
              src={media.url}
              alt="attachment"
              onClick={() => onImageClick && onImageClick(media.url)}
              className="max-h-48 rounded mb-2 cursor-pointer object-cover"
            />
          )}

          {attachment && (
            <div className={`p-2 rounded text-xs mb-1 font-mono ${isMe ? 'bg-blue-700' : 'bg-gray-100'}`}>
              📄 {attachment.name} ({attachment.size})
            </div>
          )}

          {text && <p className="whitespace-pre-wrap break-words">{text}</p>}

          <div
            className={`text-[10px] flex items-center justify-end gap-1 mt-1 ${
              isMe ? 'text-blue-100' : 'text-gray-400'
            }`}
          >
            <span>{timestamp}</span>
            {isMe && (
              <span className="inline-flex items-center">
                {status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-200" title="Read" />
                ) : status === 'delivered' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-200 opacity-75" title="Delivered" />
                ) : status === 'sending' ? (
                  <Clock className="w-3 h-3 text-blue-200 animate-pulse" title="Sending..." />
                ) : status === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-300" title="Failed to send" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-blue-200" title="Sent" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
