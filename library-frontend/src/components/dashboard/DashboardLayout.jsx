import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBell, FaUserCog, FaTimes } from 'react-icons/fa'; // react-icons ස්ථාපනය කර තිබිය යුතුය
import ChatbotWidget from '../ai/ChatbotWidget';

export default function DashboardLayout({ user, children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const styles = {
    layoutContainer: { display: 'flex', minHeight: '100vh', background: darkMode ? '#121212' : '#fdfbf7', color: darkMode ? '#ffffff' : '#333333', transition: 'background 0.3s ease' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto', maxWidth: '1200px', margin: '0 auto' },
    headerRow: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    iconBtn: { cursor: 'pointer', background: 'transparent', border: 'none', color: '#d4a373', position: 'relative' },
    toggleButton: { padding: '10px 20px', borderRadius: '25px', border: 'none', background: '#d4a373', color: 'white', cursor: 'pointer', fontWeight: '600' },
    // Modal Styles
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: darkMode ? '#1e293b' : '#fff', padding: '30px', borderRadius: '20px', width: '350px', position: 'relative', color: darkMode ? '#fff' : '#333' },
    input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #d4a373', background: 'transparent', color: 'inherit' }
  };

  return (
    <div style={styles.layoutContainer}>
      <Sidebar user={user} />
      
      <main style={styles.mainContent}>
        <div style={styles.headerRow}>
          {/* Notification Bell */}
          <div style={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell size={22} />
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '10px', borderRadius: '50%', padding: '2px 5px' }}>2</span>
          </div>

          {/* Profile Settings Icon */}
          <div style={styles.iconBtn} onClick={() => setShowProfile(true)}>
            <FaUserCog size={22} />
          </div>

          <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        {/* Profile Modal */}
        {showProfile && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{ color: '#d4a373' }}>Edit Profile</h3>
              <input placeholder="Update Name" style={styles.input} />
              <input placeholder="Update Email" style={styles.input} />
              <input type="password" placeholder="New Password" style={styles.input} />
              <button style={styles.toggleButton} onClick={() => setShowProfile(false)}>Save Changes</button>
              <FaTimes style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer' }} onClick={() => setShowProfile(false)} />
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          {React.cloneElement(children, { darkMode })}
        </div>
      </main>

      <ChatbotWidget user={user} />
    </div>
  );
}