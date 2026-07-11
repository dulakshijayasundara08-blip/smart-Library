import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import aiService from '../../services/aiService';

/** "Recommended for you" strip, powered by the AI recommendation endpoint. */
export default function RecommendationsPanel({ userId, limit = 5 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    aiService.getRecommendations(userId, limit)
      .then(setRecommendations)
      .catch(() => setError('Could not load recommendations right now.'))
      .finally(() => setLoading(false));
  }, [userId, limit]);

  if (!userId) return null;

  return (
    <section className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="text-blue-600" size={22} />
        <h2 className="text-xl font-bold text-slate-800">Recommended for you</h2>
      </div>

      {loading && <p className="text-slate-400 text-sm">Finding books you'll like…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && recommendations.length === 0 && (
        <p className="text-slate-400 text-sm">Save a few books to your reading list to get recommendations.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.bookId} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800">{rec.title}</h3>
            <p className="text-sm text-slate-500 mb-2">{rec.author}</p>
            <p className="text-xs text-blue-600 italic">{rec.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
