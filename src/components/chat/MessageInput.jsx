import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

export function MessageInput({ onSendMessage }) {
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
      <button
        type="button"
        onClick={() => onSendMessage('Here is a sample attachment file', null, { name: 'document.pdf', size: '1.2 MB' })}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
        title="Attach sample file"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-md flex items-center justify-center"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
