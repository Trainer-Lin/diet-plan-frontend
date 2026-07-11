import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FoodLibrary from './pages/FoodLibrary';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Record from './pages/Record';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManage from './pages/admin/UserManage';
import FoodManage from './pages/admin/FoodManage';
import CustomFoodManage from './pages/admin/CustomFoodManage';
import UserProfileManage from './pages/admin/UserProfileManage';
import UserRecords from './pages/admin/UserRecords';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="record" element={<Record />} />
            <Route path="foods" element={<FoodLibrary />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="goals" element={<Goals />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManage />} />
            <Route path="profiles" element={<UserProfileManage />} />
            <Route path="records" element={<UserRecords />} />
            <Route path="foods" element={<FoodManage />} />
            <Route path="custom-foods" element={<CustomFoodManage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
