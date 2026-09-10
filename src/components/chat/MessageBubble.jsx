import React, { useContext } from 'react';
import { Trash2 } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';

export function MessageBubble({ message, currentUser: propUser, onImageClick }) {
  // Access global state and deleteMessage action from ChatContext (Experiment No. 3)
  const context = useContext(ChatContext);
  const activeUser = context?.currentUser || propUser;
  const deleteMessage = context?.deleteMessage;

  const { id, senderId, senderName, senderAvatar, text, timestamp, media, attachment } = message;
  const isMe = activeUser && senderId === activeUser.id;

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
    <div className={`flex gap-2 my-2 group ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <img
          src={senderAvatar}
          alt={senderName}
          className="w-7 h-7 rounded-full object-cover mt-1"
        />
      )}

      <div className={`max-w-[70%] relative ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-[10px] text-gray-500 mb-0.5 block">{senderName}</span>
        )}

        <div
          className={`p-3 rounded-lg text-sm relative group/bubble ${
            isMe
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
          }`}
        >
          {/* Delete Message Action (ChatContext deleteMessage) */}
          {deleteMessage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMessage(id);
              }}
              className={`absolute -top-2 ${
                isMe ? '-left-2' : '-right-2'
              } opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full shadow border border-gray-200 z-10`}
              title="Delete message (ChatContext action)"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

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

          {text && <p>{text}</p>}

          <span
            className={`text-[10px] block text-right mt-1 ${
              isMe ? 'text-blue-100' : 'text-gray-400'
            }`}
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}

