import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './App'; // 📌 ඔයාගේ App.jsx එක ඇතුළේ තියෙන 'Root' එක නිවැරදිව සම්බන්ධ කිරීම
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);