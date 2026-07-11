import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import apiClient from './services/apiClient';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageBooks from './pages/ManageBooks'; // මෙය import කරන්න

// Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import DiscoverContent from './components/dashboard/DiscoverContent';
import CategoriesContent from './components/dashboard/CategoriesContent';
import ReadingListContent from './components/dashboard/ReadingListContent';
import BookExchangeContent from './components/dashboard/BookExchangeContent';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    apiClient.get('/api/books').then(res => setBooks(res.data)).catch(() => {});
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard Routes */}
        <Route path="/*" element={user ? (
          <DashboardLayout user={user}>
            <Routes>
              <Route path="dashboard" element={<UserDashboard user={user} />} />
              <Route path="discover" element={<DiscoverContent books={books} user={user} />} />
              <Route path="categories" element={<CategoriesContent />} />
              <Route path="reading-list" element={<ReadingListContent user={user} />} />
              <Route path="book-exchange" element={<BookExchangeContent user={user} />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </DashboardLayout>
        ) : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/manage-books" element={user?.role === 'ADMIN' ? <ManageBooks /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
