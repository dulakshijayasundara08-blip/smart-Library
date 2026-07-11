import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';

/** Message thread for one book-exchange listing. Drop inside a listing's detail/expanded view. */
export default function ExchangeMessages({ exchangeId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    apiClient.get(`/api/exchanges/${exchangeId}/messages`)
      .then(res => setMessages(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [exchangeId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await apiClient.post(`/api/exchanges/${exchangeId}/messages`, {
      senderId: user?.id,
      senderName: user?.name,
      content: text.trim(),
    });
    setText('');
    load();
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <h4 className="text-sm font-semibold text-slate-600 mb-2">Messages</h4>

      {loading ? (
        <p className="text-xs text-slate-400">Loading…</p>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto mb-3">
          {messages.length === 0 && <p className="text-xs text-slate-400">No messages yet - say hello!</p>}
          {messages.map(m => (
            <div key={m.id} className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="font-semibold text-slate-700">{m.senderName || 'User'}: </span>
              <span className="text-slate-600">{m.content}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2"
        />
        <button type="submit" className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white">Send</button>
      </form>
    </div>
  );
}
