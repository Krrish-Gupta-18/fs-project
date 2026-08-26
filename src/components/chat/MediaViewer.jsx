import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

export function MediaViewer({ imageUrl, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (imageUrl) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-xl animate-fade-in">
      {/* Top action controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <a
          href={imageUrl}
          target="_blank"
          rel="noreferrer"
          download
          className="p-2.5 rounded-xl bg-dark-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-medium"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </a>

        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-dark-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image View */}
      <div className="max-w-4xl max-h-[85vh] p-2 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        <img
          src={imageUrl}
          alt="Expanded Media View"
          className="max-w-full max-h-[80vh] object-contain rounded-xl border border-white/10"
        />
      </div>
    </div>
  );
}
