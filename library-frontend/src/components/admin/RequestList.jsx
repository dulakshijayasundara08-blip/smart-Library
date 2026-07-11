// src/components/admin/RequestList.jsx
import React from 'react';
import apiClient from '../../services/apiClient';

export default function RequestList({ requests, onApprove }) {
  
  const handleApprove = async (id) => {
    try {
      await apiClient.put(`/api/requests/approve/${id}`);
      alert('ඉල්ලීම සාර්ථකව අනුමත කරන ලදී!');
      onApprove(); // Dashboard එකේ දත්ත නැවත ලබා ගැනීමට (refetch)
    } catch (err) {
      alert('අනුමත කිරීමේදී දෝෂයක් සිදුවිය.');
    }
  };

  return (
    <section style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>🔔 Pending Exchange Requests</h3>
      {requests.length === 0 ? (
        <p style={{ color: '#64748b' }}>දැනට ඉල්ලීම් නොමැත.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {requests.map(req => (
            <li key={req.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', color: '#1e293b' }}>{req.userName || req.contactEmail}</strong>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Requested: {req.bookTitleHave} ↔ {req.bookTitleWant}</span>
              </div>
              <button 
                onClick={() => handleApprove(req.id)}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
