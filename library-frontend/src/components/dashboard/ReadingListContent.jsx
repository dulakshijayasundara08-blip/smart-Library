import React, { useState, useEffect } from 'react';
import apiClient, { API_BASE_URL } from '../../services/apiClient';

export default function ReadingListContent({ user, darkMode }) {
  const [myBooks, setMyBooks] = useState([]);
  const [activePdf, setActivePdf] = useState(null);
  const [bookDetails, setBookDetails] = useState({});

  useEffect(() => {
    if (!user?.id) return;
    apiClient.get('/api/wishlist', { params: { userId: user.id } })
      .then(res => setMyBooks(res.data))
      .catch(() => {});
  }, [user?.id]);

  const handleUpdate = async (id, field, value) => {
    setBookDetails(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    try {
      await apiClient.put(`/api/wishlist/${id}`, { userId: user.id, [field]: value });
    } catch (err) { /* best-effort */ }
  };

  const handleRemove = async (bookId) => {
    try {
      await apiClient.delete(`/api/wishlist/${bookId}`, { params: { userId: user.id } });
      setMyBooks(myBooks.filter(book => book.id !== bookId));
      alert('Book removed from your list.');
    } catch (err) {
      alert("Error removing book.");
    }
  };

  const resolvePdfUrl = (pdfUrl) => (/^https?:\/\//i.test(pdfUrl) ? pdfUrl : `${API_BASE_URL}/uploads/${pdfUrl}`);

  const styles = {
    container: { padding: '40px', color: darkMode ? '#ffffff' : '#333' },
    card: {
      background: darkMode ? '#1e293b' : '#ffffff',
      padding: '25px',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      marginBottom: '25px'
    },
    controls: { display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' },
    input: { padding: '8px', borderRadius: '8px', border: '1px solid #d4a373', background: 'transparent', color: 'inherit' },
    button: { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' },
    pdfBtn: { background: '#d4a373', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#d4a373', marginBottom: '30px' }}>📚 My Reading List</h1>

      {activePdf ? (
        <div style={{ background: darkMode ? '#0f172a' : '#fff', padding: '20px', borderRadius: '20px' }}>
          <button onClick={() => setActivePdf(null)} style={{ ...styles.button, background: '#64748b', marginBottom: '20px' }}>← Back to List</button>
          <iframe src={activePdf} width="100%" height="800px" title="PDF Viewer" />
        </div>
      ) : (
        myBooks.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>Your list is empty!</h3>
            <p>Go to Discover to add your favorite books.</p>
          </div>
        ) : (
          myBooks.map(b => (
            <div key={b.id} style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={b.coverImage} alt={b.title} style={{ width: '80px', height: '110px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ marginLeft: '25px', flex: 1 }}>
                  <h3 style={{ margin: '0' }}>{b.title}</h3>
                  <p style={{ color: '#d4a373', fontWeight: 'bold' }}>{b.author}</p>
                </div>
                <button onClick={() => setActivePdf(resolvePdfUrl(b.pdfUrl))} style={styles.pdfBtn}>Read Now</button>
                <button onClick={() => handleRemove(b.id)} style={{ ...styles.button, marginLeft: '10px' }}>Remove</button>
              </div>

              {/* Progress Status & Notes */}
              <div style={styles.controls}>
                <select style={styles.input} defaultValue={b.status} onChange={(e) => handleUpdate(b.id, 'status', e.target.value)}>
                  <option value="To Read">To Read</option>
                  <option value="Currently Reading">Currently Reading</option>
                  <option value="Finished">Finished</option>
                </select>
                <input
                  type="text"
                  placeholder="Add personal note..."
                  defaultValue={b.note}
                  style={{ ...styles.input, flex: 1 }}
                  onBlur={(e) => handleUpdate(b.id, 'note', e.target.value)}
                />
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}
