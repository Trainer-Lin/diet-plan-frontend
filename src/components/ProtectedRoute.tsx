import React from 'react';
import { Outlet } from 'react-router-dom';
import { useHealthStore } from '../store/useHealthStore';

const ProtectedRoute: React.FC = () => {
  const token = useHealthStore((state) => state.token);
  const allowGuestPreview = true;

  if (!token && !allowGuestPreview) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
