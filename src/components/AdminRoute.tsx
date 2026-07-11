import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useHealthStore } from '../store/useHealthStore';

const AdminRoute: React.FC = () => {
  const location = useLocation();
  const token = useHealthStore((state) => state.token);
  const role = useHealthStore((state) => state.role);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
