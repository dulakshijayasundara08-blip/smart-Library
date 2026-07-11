import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import aiService from '../../services/aiService';

/**
 * Floating chatbot for book queries. Drop <ChatbotWidget user={user} /> once,
 * near the root of any page - it renders itself fixed to the bottom-right corner.
 */
export default function ChatbotWidget({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! Ask me about books, authors, or categories in the library." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setSending(true);

    try {
      const res = await aiService.sendChatMessage({
        userId: user?.id ?? null,
        conversationId,
        message: text,
      });
      setConversationId(res.conversationId);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong reaching the assistant.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans">
      {open && (
        <div className="mb-3 w-80 h-[28rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">SmartLibrary Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-snug ${
                  m.role === 'user'
                    ? 'ml-auto bg-blue-600 text-white rounded-br-sm'
                    : 'mr-auto bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && <div className="mr-auto text-xs text-slate-400 px-1">Assistant is typing…</div>}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 p-2 border-t border-slate-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a book…"
              className="flex-1 px-3 py-2 text-sm rounded-full border border-slate-300 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-50"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700 transition"
        aria-label="Toggle chatbot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
