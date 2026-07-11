import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import ExchangeMessages from '../exchange/ExchangeMessages';

export default function BookExchangeContent({ user, darkMode }) {
  const [formData, setFormData] = useState({ bookTitleHave: '', bookTitleWant: '', message: '' });
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [openThreadId, setOpenThreadId] = useState(null);

  const loadExchanges = () => {
    apiClient.get('/api/exchanges').then(res => setExchangeHistory(res.data)).catch(() => {});
  };

  useEffect(() => { loadExchanges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const exchangeData = {
        ...formData,
        contactEmail: user.email,
        userId: user.id,
        userName: user.name,
      };
      await apiClient.post('/api/exchanges', exchangeData);
      alert('Your exchange request has been submitted successfully!');
      setFormData({ bookTitleHave: '', bookTitleWant: '', message: '' });
      loadExchanges();
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '40px auto', padding: '40px', background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', color: darkMode ? '#ffffff' : '#333' },
    input: { width: '100%', padding: '15px', margin: '10px 0', borderRadius: '12px', border: darkMode ? '1px solid #475569' : '1px solid #ddd', background: darkMode ? '#0f172a' : '#f8f9fa', color: darkMode ? '#ffffff' : '#333', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', marginTop: '20px', background: 'linear-gradient(135deg, #d4a373, #bc8a5f)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    historyCard: { background: darkMode ? '#0f172a' : '#f8f9fa', padding: '20px', borderRadius: '15px', marginBottom: '15px', borderLeft: '5px solid #d4a373' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#d4a373', textAlign: 'center' }}>🔄 Book Exchange</h1>
      
      {/* Exchange Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '50px' }}>
        <input placeholder="Book Title You Have" value={formData.bookTitleHave} onChange={(e) => setFormData({...formData, bookTitleHave: e.target.value})} style={styles.input} required />
        <input placeholder="Book Title You Want" value={formData.bookTitleWant} onChange={(e) => setFormData({...formData, bookTitleWant: e.target.value})} style={styles.input} required />
        <textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{ ...styles.input, height: '100px' }} required />
        <button type="submit" style={styles.button}>Request Exchange</button>
      </form>

      {/* Exchange History & Messaging */}
      <h2 style={{ color: '#d4a373' }}>Exchange Listings</h2>
      {exchangeHistory.map((item) => (
        <div key={item.id} style={styles.historyCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
               onClick={() => setOpenThreadId(openThreadId === item.id ? null : item.id)}>
            <span><strong>{item.bookTitleHave} ↔ {item.bookTitleWant}</strong></span>
            <span style={{ color: '#d4a373' }}>{item.status}</span>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.7, margin: '5px 0 0' }}>by {item.userName || item.contactEmail}</p>

          {openThreadId === item.id && <ExchangeMessages exchangeId={item.id} user={user} />}
        </div>
      ))}
    </div>
  );
}
