import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (typeof window === 'undefined') {
    return children;
  }

  const flag = localStorage.getItem('admin_authenticated');
  const expiry = localStorage.getItem('admin_authenticated_expires_at');
  const isFlagTrue = flag === 'true';
  const isNotExpired = expiry ? Date.now() < Number(expiry) : false;
  const isAdminAuthenticated = isFlagTrue && isNotExpired;

  if (!isAdminAuthenticated) {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_authenticated_expires_at');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


