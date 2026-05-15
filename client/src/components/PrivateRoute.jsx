import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('fittrack-app-token');
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

export default PrivateRoute;