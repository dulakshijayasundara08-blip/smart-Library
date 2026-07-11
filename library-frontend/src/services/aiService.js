import apiClient from './apiClient';

/** Thin wrapper around the three /api/ai/** endpoints. */
export const aiService = {
  getRecommendations: (userId, limit = 5) =>
    apiClient.get('/api/ai/recommendations', { params: { userId, limit } }).then(r => r.data),

  translateSummary: ({ bookId, rawText, targetLanguage }) =>
    apiClient.post('/api/ai/translate', { bookId, rawText, targetLanguage }).then(r => r.data),

  sendChatMessage: ({ userId, conversationId, message }) =>
    apiClient.post('/api/ai/chat', { userId, conversationId, message }).then(r => r.data),
};

export default aiService;
