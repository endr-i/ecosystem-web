import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../../shared/components/FullPageLoader';
import { useAuthStore } from '../../../stores/authStore';

/** Route guard: sends unauthenticated visitors to the login page. */
export function RequireAuth() {
  const { authenticated, initialized } = useAuthStore();
  const location = useLocation();

  if (!initialized) {
    return <FullPageLoader tip="Restoring your session…" />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
