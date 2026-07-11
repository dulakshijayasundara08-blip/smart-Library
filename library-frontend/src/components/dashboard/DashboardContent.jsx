import React from 'react';

export default function DashboardContent({ recentBooks = [], readingProgress = [], reminders = [], darkMode }) {
  const styles = {
    container: { padding: '40px', color: darkMode ? '#ffffff' : '#333' },
    section: {
      background: darkMode ? '#1e293b' : '#ffffff',
      padding: '30px',
      borderRadius: '25px',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    title: { color: '#d4a373', marginBottom: '20px', fontSize: '1.5rem' },
    progressBar: { height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' },
    progressFill: (percent) => ({ height: '100%', width: `${percent}%`, background: '#d4a373' }),
    actionBtn: {
      padding: '12px 25px',
      background: '#d4a373',
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginRight: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '30px' }}>Welcome Back, Reader!</h1>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.title}>Quick Actions</h2>
        <button style={styles.actionBtn}>Browse All</button>
        <button style={styles.actionBtn}>New Arrivals</button>
        <button style={styles.actionBtn}>My Wishlist</button>
      </div>

      {/* Reading Progress */}
      <div style={styles.section}>
        <h2 style={styles.title}>Reading Progress</h2>
        {readingProgress.map((book) => (
          <div key={book.id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{book.title}</span>
              <span>{book.percent}%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(book.percent)}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Reminders */}
      <div style={styles.section}>
        <h2 style={styles.title}>Upcoming Reminders</h2>
        {reminders.map((item, index) => (
          <div key={index} style={{ borderLeft: '4px solid #d4a373', paddingLeft: '15px', marginBottom: '15px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{item.task}</p>
            <small style={{ color: '#888' }}>Due: {item.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}