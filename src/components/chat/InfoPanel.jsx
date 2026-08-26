import React from 'react';
import { X } from 'lucide-react';
import { mockSharedMedia } from '../../data/mockData';

export function InfoPanel({ conversation, onClose, onImageClick }) {
  if (!conversation) return null;

  const { name, avatar, status, email, phone, location, bio } = conversation;
  const photos = mockSharedMedia.filter((m) => m.type === 'image');

  return (
    <div className="w-72 bg-white border-l border-gray-200 h-full flex flex-col p-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <h3 className="text-sm font-bold text-gray-800">User Profile</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-2 mb-6">
        <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover" />
        <h2 className="text-base font-bold text-gray-800">{name}</h2>
        <p className="text-xs text-gray-500 capitalize">{status || 'Offline'}</p>
        {bio && <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded text-left w-full mt-2">{bio}</p>}
      </div>

      <div className="space-y-1 text-xs text-gray-600 border-t border-gray-200 pt-3 mb-4">
        {email && <p>📧 {email}</p>}
        {phone && <p>📞 {phone}</p>}
        {location && <p>📍 {location}</p>}
      </div>

      <div className="border-t border-gray-200 pt-3 flex-1 overflow-y-auto">
        <h4 className="text-xs font-bold text-gray-700 mb-2">Shared Photos</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((item) => (
            <img
              key={item.id}
              src={item.url}
              alt={item.title}
              onClick={() => onImageClick && onImageClick(item.url)}
              className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
