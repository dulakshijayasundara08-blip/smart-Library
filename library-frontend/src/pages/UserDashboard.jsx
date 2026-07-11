import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import PdfReaderModal from '../components/books/PdfReaderModal';
import RecommendationsPanel from '../components/ai/RecommendationsPanel';

export default function UserDashboard({ user, darkMode }) {
  const [books, setBooks] = useState([]);
  const [readingBook, setReadingBook] = useState(null);

  // පොත් දත්ත Backend එකෙන් ලබා ගැනීම
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await apiClient.get('/api/books');
        setBooks(booksRes.data);
      } catch (err) { console.error("Error loading data", err); }
    };
    fetchData();
  }, []);

  // ශෛලිය (Styles)
  const styles = {
    container: { padding: '20px', background: darkMode ? '#0f172a' : '#f8fafc', minHeight: '100vh' },
    card: { 
      padding: '15px', 
      background: darkMode ? '#1e293b' : 'white', 
      color: darkMode ? 'white' : 'black', 
      borderRadius: '10px', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    button: {
      marginTop: '10px',
      padding: '8px 12px',
      background: '#d4a373',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Daily Quote Section */}
      <div style={{ marginBottom: '30px', color: darkMode ? 'white' : 'black' }}>
        <h3>Daily Quote</h3>
        <p><i>"A reader lives a thousand lives before he dies."</i></p>
      </div>
      
      {/* Books Display Section */}
      <h1 style={{ color: darkMode ? 'white' : 'black' }}>📚 MY Library</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {books.map(b => (
          <div key={b.id} style={styles.card}>
            <img src={b.coverImage} alt={b.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{b.title}</h3>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>author: {b.author}</p>
            <button style={styles.button} onClick={() => setReadingBook(b)}>Read Pdf</button>
          </div>
        ))}
      </div>

      <RecommendationsPanel userId={user?.id} />

      {readingBook && <PdfReaderModal book={readingBook} onClose={() => setReadingBook(null)} />}
    </div>
  );
}
