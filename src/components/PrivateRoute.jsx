// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Client-side route guard for presentation only.
// Real authentication and authorization must still be enforced by the API/server.
export function PrivateRoute({ element, isAuthenticated, redirectTo }) {
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
}
