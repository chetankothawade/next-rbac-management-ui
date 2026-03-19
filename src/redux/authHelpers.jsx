import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, logout } from './authSlice';
import toast from 'react-hot-toast';

/**
 * Determine the base route based on the user's role.
 */
const getRoleBasePath = (role) => {
  const adminRoles = ['admin', 'super_admin', 'editor'];
  return adminRoles.includes(role) ? '' : '/client';
};

/**
 * Custom hook for handling login/logout with navigation and Redux integration.
 */
export const useAuthHandlers = () => {
  const navigate = useNavigate();

  /**
   * Handle successful login workflow.
   */
  const handleLogin = useCallback(
    (dispatch, user, token, role) => {
      dispatch(loginSuccess({ user, token, role }));
      
      const basePath = getRoleBasePath(role);
  
      // Navigate to dashboard based on role
      navigate(`${basePath}/dashboard`, { replace: true });
    },
    [navigate]
  );

  /**
   * Handle logout workflow.
   */
  const handleLogout = useCallback(
    (dispatch, response, role) => {
      dispatch(logout({ role }));

      toast.success(response?.data?.message || 'Logged out successfully');

      const basePath = getRoleBasePath(role);

      // Navigate to login page based on role
      navigate(`${basePath}/login`, { replace: true });
    },
    [navigate]
  );


  /**
   * Handle successful login auth.
   */
  const handleLoginAuth = useCallback(
    (dispatch, user, token, role) => {
      dispatch(loginSuccess({ user, token, role }));
    }, []);

  return { handleLogin, handleLogout, handleLoginAuth };
};
