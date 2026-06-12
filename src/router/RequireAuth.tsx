import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '@/auth/core';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <>{children}</>;
}
