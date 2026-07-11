import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredCategory, setPreferredCategory] = useState('Novel');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password, role: 'USER', preferredCategory };
    await apiClient.post('/api/register', newUser);
    alert('ලියාපදිංචි වීම සාර්ථකයි! දැන් ලොග් වෙන්න.');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <form onSubmit={handleRegister} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>Create Account</h2>
        <input type="text" placeholder="Full Name" style={{ width: '93%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email Address" style={{ width: '93%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" style={{ width: '93%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setPassword(e.target.value)} required />
        
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569' }}>Preferred Book Category (For AI Recommendations):</label>
        <select style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }} value={preferredCategory} onChange={e => setPreferredCategory(e.target.value)}>
          <option value="Novel">Novel</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Biography">Biography</option>
          <option value="Educational">Educational</option>
        </select>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Register</button>
      </form>
    </div>
  );
}