import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/api/login', { email, password });
      
      // User දත්ත සුරැකීම
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data); // App.jsx හි state එක යාවත්කාලීන කිරීම

      // Role එක අනුව පිටුව තීරණය කිරීම
      if (res.data.role === 'ADMIN') {
        window.location.href = '/admin'; // Admin නම් මෙතැනට
      } else {
        window.location.href = '/dashboard'; // සාමාන්‍ය පරිශීලක නම් මෙතැනට
      }
    } catch (err) {
      alert("Login අසාර්ථකයි! කරුණාකර නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>Sign In</h2>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          style={{ width: '93%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          style={{ width: '93%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        
        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Login
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}