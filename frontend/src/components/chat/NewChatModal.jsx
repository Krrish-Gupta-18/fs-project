import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { MessageSquare } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export function NewChatModal() {
  const {
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    mockContacts = [],
    userProfile,
    startNewConversation,
  } = useChat();

  const [query, setQuery] = useState('');

  const myId = userProfile?.id || userProfile?.userId;
  const filteredContacts = mockContacts.filter((c) => {
    const contactId = c.id || c.userId;
    if (myId && contactId === myId) return false;

    const q = query.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.role?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <Modal
      isOpen={isNewChatModalOpen}
      onClose={() => setIsNewChatModalOpen(false)}
      title="Start New Conversation"
    >
      <div className="space-y-4">
        {/* Search Contact */}
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search contacts by name, role, or email..."
        />

        {/* Contacts List */}
        <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id || contact.userId}
                onClick={() => startNewConversation(contact)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition-colors border border-transparent hover:border-slate-700/80 group"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={contact.avatar} name={contact.name} status={contact.status} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-brand-300">
                      {contact.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {contact.email ? `${contact.email} • ` : ''}{contact.role || 'Member'}
                    </p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" icon={MessageSquare}>
                  Chat
                </Button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No matching contacts found.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
