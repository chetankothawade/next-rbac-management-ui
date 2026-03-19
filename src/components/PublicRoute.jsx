// components/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export function PublicRoute({ element, isAuthenticated, redirectTo }) {
  return isAuthenticated ? <Navigate to={redirectTo} /> : element;
}
