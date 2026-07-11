// src/pages/ManageBooks.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import BookForm from '../components/admin/BookForm';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '', author: '', category: 'Novel', coverImage: '', pdfUrl: '', summary: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await apiClient.get('/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/books', formData);
      alert('පොත සාර්ථකව එක් කරන ලදී!');
      setFormData({ title: '', author: '', category: 'Novel', coverImage: '', pdfUrl: '', summary: '' });
      fetchBooks(); // ලැයිස්තුව නැවුම් කරන්න
    } catch (err) {
      alert("පොත එක් කිරීමේදී දෝෂයක් ඇතිවිය!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("මෙම පොත මැකීමට අවශ්‍යද?")) {
      try {
        await apiClient.delete(`/api/books/${id}`);
        fetchBooks();
      } catch (err) {
        alert("මකාදැමීමේදී දෝෂයක් ඇතිවිය.");
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#1e293b' }}>📚 Manage Books</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* වම් පස: පොත් එකතු කරන පෝරමය */}
        <BookForm formData={formData} setFormData={setFormData} onSubmit={handleAddBook} />

        {/* දකුණු පස: පවතින පොත් ලැයිස්තුව */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px' }}>All Books ({books.length})</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {books.map(book => (
              <div key={book.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <img src={book.coverImage} alt={book.title} style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', color: '#1e293b' }}>{book.title}</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{book.author}</span>
                </div>
                <button 
                  onClick={() => handleDelete(book.id)}
                  style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}