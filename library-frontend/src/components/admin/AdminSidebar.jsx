// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const btnStyle = {
    background: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '12px 20px',
    fontSize: '16px',
    width: '100%',
    transition: '0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <aside style={{ width: '260px', background: '#1e293b', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ paddingLeft: '20px', marginBottom: '40px' }}>Library Admin</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => navigate('/admin')} style={btnStyle}>📊 Dashboard</button>
        <button onClick={() => navigate('/admin/manage-books')} style={btnStyle}>📚 Manage Books</button>
        <button 
          onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} 
          style={{ ...btnStyle, background: '#ef4444', marginTop: 'auto', borderRadius: '8px' }}
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}