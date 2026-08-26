import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { MessageSquare, UserPlus } from 'lucide-react';

export function NewChatModal({ isOpen, onClose, contacts = [], onSelectContact }) {
  const [query, setQuery] = useState('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start New Conversation">
      <div className="space-y-4">
        {/* Search Contact */}
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search contacts by name or role..."
        />

        {/* Contacts List */}
        <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition-colors border border-transparent hover:border-slate-700/80 group"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={contact.avatar} name={contact.name} status={contact.status} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-brand-300">
                      {contact.name}
                    </h4>
                    <p className="text-xs text-slate-400">{contact.role}</p>
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
