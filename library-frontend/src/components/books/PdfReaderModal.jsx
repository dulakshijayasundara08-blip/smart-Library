import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../../services/apiClient';

/**
 * Full-screen "reader mode" for a book's PDF. Pass either a full URL
 * (pdfUrl starting with http) or a filename stored under the backend's
 * /uploads directory - both are resolved correctly.
 */
export default function PdfReaderModal({ book, onClose }) {
  if (!book) return null;

  const src = /^https?:\/\//i.test(book.pdfUrl)
    ? book.pdfUrl
    : `${API_BASE_URL}/uploads/${book.pdfUrl}`;

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white">
        <div>
          <h3 className="font-semibold leading-tight">{book.title}</h3>
          <p className="text-xs text-slate-300">{book.author}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href={src} target="_blank" rel="noopener noreferrer" title="Open in new tab" className="hover:text-blue-400">
            <ExternalLink size={18} />
          </a>
          <a href={src} download title="Download" className="hover:text-blue-400">
            <Download size={18} />
          </a>
          <button onClick={onClose} title="Close reader" className="hover:text-red-400">
            <X size={20} />
          </button>
        </div>
      </div>

      <iframe
        src={src}
        title={`Reader - ${book.title}`}
        className="flex-1 w-full bg-white"
      />
    </div>
  );
}
