// src/components/admin/BookForm.jsx
export default function BookForm({ formData, setFormData, onSubmit }) {
  const inputStyle = { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    fontSize: '14px' 
  };
  
  return (
    <form 
      onSubmit={onSubmit} 
      style={{ 
        display: 'grid', 
        gap: '15px', 
        background: 'white', 
        padding: '25px', 
        borderRadius: '15px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>➕ Add New Book</h3>
      
      {/* Title Input */}
      <input 
        placeholder="Book Title" 
        value={formData.title} 
        onChange={e => setFormData({...formData, title: e.target.value})} 
        style={inputStyle} 
        required 
      />
      
      {/* Author Input */}
      <input 
        placeholder="Author Name" 
        value={formData.author} 
        onChange={e => setFormData({...formData, author: e.target.value})} 
        style={inputStyle} 
        required 
      />
      
      {/* Cover Image Input */}
      <input 
        placeholder="Cover Image URL" 
        value={formData.coverImage} 
        onChange={e => setFormData({...formData, coverImage: e.target.value})} 
        style={inputStyle} 
      />
      
      {/* PDF File Upload Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', color: '#64748b' }}>Upload PDF File:</label>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={e => setFormData({...formData, pdfFile: e.target.files[0]})} 
          style={inputStyle} 
        />
      </div>

      {/* Summary Textarea */}
      <textarea 
        placeholder="Book Summary" 
        value={formData.summary} 
        onChange={e => setFormData({...formData, summary: e.target.value})} 
        style={{...inputStyle, height: '80px'}} 
      />
      
      {/* Submit Button */}
      <button 
        type="submit" 
        style={{ 
          padding: '12px', 
          background: '#2563eb', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: '600', 
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
        onMouseOut={(e) => e.target.style.background = '#2563eb'}
      >
        Save Book
      </button>
    </form>
  );
}