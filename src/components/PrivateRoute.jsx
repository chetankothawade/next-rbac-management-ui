// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ element, isAuthenticated, redirectTo }) {
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
}
