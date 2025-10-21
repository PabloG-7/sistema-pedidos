import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="new-order" element={<NewOrder />} />
              <Route path="admin/orders" element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;