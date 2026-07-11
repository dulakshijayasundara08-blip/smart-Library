import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  // මෙනු අයිතම ලැයිස්තුව
  const menuItems = ['Dashboard', 'Discover', 'Categories', 'Reading List', 'Book Exchange'];

  // අදාළ පිටුවේ සිටින විට Sidebar මෙනුව Highlight කිරීමට අවශ්‍ය තර්කය
  // මෙහි 'dashboard' වෙනුවට 'dashboard' ලෙසම map වීමට පහත තර්කය භාවිතා කරන්න
  const isActive = (item) => {
    const path = `/${item.toLowerCase().replace(' ', '-')}`;
    return location.pathname === path;
  };

  const styles = {
    sidebar: {
      width: '260px',
      background: '#1e293b',
      color: '#ffffff',
      padding: '25px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0
    },
    menuItem: (active) => ({
      padding: '15px 20px',
      margin: '5px 0',
      cursor: 'pointer',
      borderRadius: '8px',
      background: active ? '#334155' : 'transparent',
      transition: 'all 0.3s ease',
      fontSize: '16px',
      fontWeight: active ? 'bold' : 'normal'
    }),
    logoutBtn: {
      marginTop: 'auto',
      padding: '12px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    adminBtn: {
      padding: '12px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '10px',
      textAlign: 'center'
    }
  };

  return (
    <nav style={styles.sidebar}>
      <h2 style={{ marginBottom: '40px', textAlign: 'center', color: '#d4a373' }}>Smart Library</h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map(item => (
          <li 
            key={item} 
            onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
            style={styles.menuItem(isActive(item))}
          >
            {item}
          </li>
        ))}
      </ul>

      {user?.role === 'ADMIN' && (
        <button style={styles.adminBtn} onClick={() => navigate('/admin')}>
          Admin Panel
        </button>
      )}

      <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login'); }}>
        Logout
      </button>
    </nav>
  );
}