// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import BookForm from '../components/admin/BookForm';
import RequestList from '../components/admin/RequestList';
import StatsCard from '../components/admin/StatsCard';

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ 
    title: '', author: '', category: 'Novel', coverImage: '', pdfFile: null, summary: '' 
  });

  useEffect(() => { 
    fetchBooks(); 
    fetchRequests(); 
  }, []);

  const fetchBooks = async () => { 
    try { const res = await apiClient.get('/api/books'); setBooks(res.data); } 
    catch (err) { console.error(err); } 
  };

  // නිවැරදි කරන ලද fetchRequests ශ්‍රිතය
  const fetchRequests = async () => { 
    try { 
      const res = await apiClient.get('/api/exchanges'); 
      setRequests(res.data.filter(r => r.status === 'PENDING')); 
    } 
    catch (err) { console.error(err); } 
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    
    // PDF ගොනුව සහ අනෙකුත් දත්ත එකතු කිරීම සඳහා FormData භාවිතා කරයි
    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('category', formData.category);
    data.append('coverImage', formData.coverImage);
    data.append('summary', formData.summary);
    
    // pdfFile එකතු කිරීම
    if (formData.pdfFile) {
      data.append('pdfFile', formData.pdfFile);
    }

    try {
      // axios හි headers multipart/form-data ලෙස සැකසීම
      await apiClient.post('/api/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('පොත සහ PDF ගොනුව සාර්ථකව එක් කරන ලදී!');
      setFormData({ title: '', author: '', category: 'Novel', coverImage: '', pdfFile: null, summary: '' });
      fetchBooks();
    } catch (err) { 
      console.error(err);
      alert("දෝෂයක් ඇතිවිය! කරුණාකර නැවත උත්සාහ කරන්න."); 
    }
  };

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px', color: '#1e293b' }}>🛡️ Admin Control Panel</h1>
      
      {/* Stats Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatsCard title="Total Books" val={books.length} color="#2563eb" />
        <StatsCard title="Pending Requests" val={requests.length} color="#059669" />
        <StatsCard title="Total Users" val={15} color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* BookForm වෙත formData සහ handleAddBook ලබා දීම */}
        <BookForm formData={formData} setFormData={setFormData} onSubmit={handleAddBook} />
        
        {/* RequestList එක */}
        <RequestList requests={requests} onApprove={fetchRequests} />
      </div>
    </div>
  );
}