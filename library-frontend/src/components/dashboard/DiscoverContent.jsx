import React, { useState } from 'react';
import apiClient, { API_BASE_URL } from '../../services/apiClient';
import TranslateSummary from '../ai/TranslateSummary';

export default function DiscoverContent({ books = [], darkMode, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // Quick View සඳහා
  const [newBook, setNewBook] = useState({ title: '', author: '', summary: '', coverImage: '', pdfUrl: '' });

  // Filtering & Sorting Logic
  const filteredBooks = books
    .filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  const handleAddToWishlist = async (bookId) => {
    if (!user?.id) { alert('Please sign in to save books.'); return; }
    try {
      await apiClient.post('/api/wishlist', { userId: user.id, bookId });
      alert('Book added to your Wishlist successfully!');
    } catch (err) { alert("Failed to add book to wishlist."); }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/books', newBook, { headers: { 'Content-Type': 'application/json' } });
      alert('New book added successfully!');
      setShowAddForm(false);
      setNewBook({ title: '', author: '', summary: '', coverImage: '', pdfUrl: '' });
    } catch (err) { alert("Failed to add new book."); }
  };

  const resolvePdfUrl = (pdfUrl) => (/^https?:\/\//i.test(pdfUrl) ? pdfUrl : `${API_BASE_URL}/uploads/${pdfUrl}`);

  const styles = {
    container: { padding: '40px', color: darkMode ? '#ffffff' : '#333' },
    searchBar: { width: '100%', maxWidth: '600px', padding: '15px', borderRadius: '30px', border: '2px solid #d4a373', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333', marginBottom: '20px', outline: 'none' },
    card: { background: darkMode ? '#1e293b' : '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', textAlign: 'center', cursor: 'pointer' },
    button: { background: '#d4a373', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: darkMode ? '#1e293b' : '#fff', padding: '40px', borderRadius: '20px', width: '600px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#d4a373' }}>Discover New Worlds</h1>
        <button onClick={() => setShowAddForm(true)} style={styles.button}>+ Add New Book</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input type="text" placeholder="🔍 Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchBar} />
        <select onChange={(e) => setSortBy(e.target.value)} style={{ ...styles.searchBar, width: '150px' }}>
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
        {filteredBooks.map(b => (
          <div key={b.id} style={styles.card} onClick={() => setSelectedBook(b)}>
            <img src={b.coverImage || 'https://via.placeholder.com/200x300'} alt={b.title} style={{ height: '200px', width: '100%', objectFit: 'cover', borderRadius: '10px' }} />
            <h3 style={{ margin: '15px 0 5px' }}>{b.title}</h3>
            <p style={{ color: '#d4a373', fontWeight: 'bold' }}>{b.author}</p>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {selectedBook && (
        <div style={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedBook.coverImage} alt={selectedBook.title} style={{ width: '100%', height: '300px', borderRadius: '10px', objectFit: 'cover' }} />
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p>{selectedBook.summary}</p>
            <TranslateSummary bookId={selectedBook.id} originalSummary={selectedBook.summary} />
            <div style={{ marginTop: '15px' }}>
              <a href={resolvePdfUrl(selectedBook.pdfUrl)} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, display: 'inline-block', marginRight: '10px', textDecoration: 'none' }}>Read PDF</a>
              <button onClick={() => handleAddToWishlist(selectedBook.id)} style={{ ...styles.button, marginRight: '10px', background: '#2563eb' }}>+ Reading List</button>
              <button onClick={() => setSelectedBook(null)} style={{ ...styles.button, background: '#666' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Form (Remains unchanged) */}
      {showAddForm && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handleAddBook} style={{ ...styles.modalContent, width: '400px' }}>
            <h2 style={{ color: '#d4a373' }}>Add New Book</h2>
            <input placeholder="Title" required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
            <input placeholder="Author" required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setNewBook({...newBook, author: e.target.value})} />
            <textarea placeholder="Summary" required style={{ width: '100%', marginBottom: '10px', padding: '10px', height: '80px' }} onChange={(e) => setNewBook({...newBook, summary: e.target.value})} />
            <input placeholder="Cover Image URL" style={{ width: '100%', marginBottom: '10px', padding: '10px' }} onChange={(e) => setNewBook({...newBook, coverImage: e.target.value})} />
            <input placeholder="PDF Link URL" required style={{ width: '100%', marginBottom: '20px', padding: '10px' }} onChange={(e) => setNewBook({...newBook, pdfUrl: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={styles.button}>Submit</button>
              <button type="button" onClick={() => setShowAddForm(false)} style={{...styles.button, background: '#666'}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
