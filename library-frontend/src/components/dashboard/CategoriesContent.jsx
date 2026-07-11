import React, { useState } from 'react';
import { FaBook, FaRocket, FaHistory, FaBriefcase, FaPalette, FaUserTie, FaLaptop, FaSearch } from 'react-icons/fa';

export default function CategoriesContent({ darkMode }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'Novel', icon: <FaBook />, books: [{ title: 'The Great Gatsby', pdf: '/pdfs/gatsby.pdf' }, { title: '1984', pdf: '/pdfs/1984.pdf' }] },
    { name: 'Science Fiction', icon: <FaRocket />, books: [{ title: 'Dune', pdf: '/pdfs/dune.pdf' }] },
    { name: 'History', icon: <FaHistory />, books: [{ title: 'Sapiens', pdf: '/pdfs/sapiens.pdf' }] },
    { name: 'Business', icon: <FaBriefcase />, books: [{ title: 'Atomic Habits', pdf: '/pdfs/habits.pdf' }] },
    { name: 'Art', icon: <FaPalette />, books: [{ title: 'The Story of Art', pdf: '/pdfs/art.pdf' }] },
    { name: 'Biography', icon: <FaUserTie />, books: [{ title: 'Steve Jobs', pdf: '/pdfs/jobs.pdf' }] },
    { name: 'Information Technology', icon: <FaLaptop />, books: [{ title: 'IT Handbook', pdf: '/pdfs/it.pdf' }] }
  ];

  // Search filter
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: { padding: '40px', color: darkMode ? '#ffffff' : '#333' },
    title: { fontSize: '2.5rem', marginBottom: '10px', color: '#d4a373' },
    searchBar: {
      width: '100%', maxWidth: '400px', padding: '12px 20px', marginBottom: '30px',
      borderRadius: '25px', border: '1px solid #d4a373', background: darkMode ? '#1e293b' : '#fff',
      color: darkMode ? '#fff' : '#333', outline: 'none'
    },
    categoryBtn: (isActive) => ({
      padding: '15px 25px',
      background: isActive ? '#d4a373' : (darkMode ? '#1e293b' : '#ffffff'),
      color: isActive ? 'white' : (darkMode ? '#ffffff' : '#333'),
      borderRadius: '20px', cursor: 'pointer', border: '1px solid #d4a373',
      fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.3s'
    }),
    bookCard: {
      background: darkMode ? '#1e293b' : '#f8f9fa', padding: '20px', borderRadius: '15px',
      margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderLeft: '5px solid #d4a373', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Explore Categories</h1>
      
      <input 
        type="text" placeholder="🔍 Search categories..." value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchBar} 
      />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '40px' }}>
        {filteredCategories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => setSelectedCategory(cat)}
            style={styles.categoryBtn(selectedCategory?.name === cat.name)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h2 style={{ color: '#d4a373', marginBottom: '20px' }}>{selectedCategory.name} Collection</h2>
          {selectedCategory.books.map((book, index) => (
            <div key={index} style={styles.bookCard}>
              <span>{book.title}</span>
              <a href={book.pdf} target="_blank" rel="noopener noreferrer" style={{ color: '#d4a373', fontWeight: 'bold' }}>
                Read PDF ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}