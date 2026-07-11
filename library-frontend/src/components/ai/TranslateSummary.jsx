import React, { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import aiService from '../../services/aiService';

const LANGUAGES = ['Sinhala', 'Tamil', 'French', 'Spanish', 'German', 'Japanese'];

/** Drop next to a book's summary text: lets the reader translate it on demand. */
export default function TranslateSummary({ bookId, originalSummary }) {
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[0]);
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.translateSummary({ bookId, rawText: bookId ? undefined : originalSummary, targetLanguage });
      setTranslated(res.translatedText);
    } catch (err) {
      setError('Translation failed - please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <Languages size={16} className="text-blue-600" />
        <select
          value={targetLanguage}
          onChange={(e) => { setTargetLanguage(e.target.value); setTranslated(null); }}
          className="text-sm border border-slate-300 rounded-lg px-2 py-1"
        >
          {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white disabled:opacity-50 flex items-center gap-1"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Translate summary
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {translated && (
        <p className="text-sm text-slate-700 mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
          {translated}
        </p>
      )}
    </div>
  );
}
