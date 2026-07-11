import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // උදාහරණයක් ලෙස ඔබේ API එකෙන් හෝ database එකෙන් එන දත්ත ලෙස මෙය සලකන්න
  const [books] = useState([
    { id: 1, title: 'Dune', category: 'Sci-Fi & Fantasy', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500' },
    { id: 2, title: 'Artificial Intelligence', category: 'Tech & Science', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500' },
    { id: 3, title: 'The Great Gatsby', category: 'Novels & Drama', img: 'https://images.unsplash.com/photo-1465433045946-ba6506ce5a59?w=500' },
    { id: 4, title: 'Steve Jobs', category: 'Biographies', img: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const getIcon = (name) => {
    const Component = Icons[name];
    return Component ? <Component size={32} /> : null;
  };

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(b => b.category === selectedCategory);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Navbar - පවතින පරිදි */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#2563eb', margin: 0 }}>SmartLibrary</h2>
          <div style={{ display: 'flex', gap: '25px', fontWeight: '600' }}>
            {[{ id: 'home', label: 'home' }, { id: 'ai-tools', label: 'AI tools' }, { id: 'categories', label: 'categories' }, { id: 'contact', label: 'contact' }].map(s => (
              <a key={s.id} href={`#${s.id}`} style={{ textDecoration: 'none', color: '#64748b', textTransform: 'capitalize' }}>{s.label}</a>
            ))}
          </div>
          <div>
            <Link to="/login" style={{ marginRight: '20px', textDecoration: 'none', color: '#2563eb' }}>Sign In</Link>
            <Link to="/register" style={{ background: '#2563eb', color: 'white', padding: '10px 25px', borderRadius: '30px', textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header id="home" style={{ padding: '100px 20px', textAlign: 'center', backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 58, 138, 0.85)), url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200")', backgroundSize: 'cover', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Your Intelligent Library</h1>
        <input type="text" placeholder="Search books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '15px', width: '400px', borderRadius: '30px', border: 'none', outline: 'none' }} />
      </header>

      {/* AI Tools */}
      <section id="ai-tools" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '15px' }}>AI Tools</h2>
        <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 50px' }}>
          Sign in to unlock personalized recommendations, instant summary translation, and a chatbot
          that knows the whole catalog.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { icon: 'Brain', title: 'AI Recommendations', desc: 'Personalized picks based on your reading list.' },
            { icon: 'RefreshCw', title: 'Community Exchange', desc: 'Swap physical books with other members and message them directly.' },
            { icon: 'Languages', title: 'AI Translation', desc: 'Translate any book summary into your language, instantly.' },
            { icon: 'MessageCircle', title: 'Library Chatbot', desc: 'Ask about authors, genres, or what to read next.' }
          ].map((f, i) => (
            <div key={i} style={{ padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#2563eb' }}>{getIcon(f.icon)}</div>
              <h3>{f.title}</h3>
              <p style={{ color: '#64748b' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/register" style={{ background: '#2563eb', color: 'white', padding: '14px 30px', borderRadius: '30px', textDecoration: 'none', fontWeight: '600' }}>
            Try the AI tools - create an account
          </Link>
        </div>
      </section>

      {/* Categories & Dynamic Book Display */}
      <section id="categories" style={{ padding: '80px 20px', background: '#f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>Explore Categories</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
            {['All', 'Sci-Fi & Fantasy', 'Tech & Science', 'Novels & Drama', 'Biographies'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: selectedCategory === cat ? '#2563eb' : 'white', color: selectedCategory === cat ? 'white' : '#1e293b', cursor: 'pointer' }}>
                {cat}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {filteredBooks.map(book => (
              <div key={book.id} style={{ background: 'white', borderRadius: '15px', padding: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <img src={book.img} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }} />
                <h4 style={{ textAlign: 'center' }}>{book.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Contact Us</h2>
        <form style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Name" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ccc' }} />
          <textarea placeholder="Message" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ccc' }}></textarea>
          <button style={{ background: '#2563eb', color: 'white', padding: '15px', borderRadius: '10px', border: 'none' }}>Send</button>
        </form>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <p>&copy; 2026 Smart Digital Library. All rights reserved.</p>
        <div style={{ marginTop: '10px' }}>
            <a href="#" style={{ color: '#cbd5e1', margin: '0 10px' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#cbd5e1', margin: '0 10px' }}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}