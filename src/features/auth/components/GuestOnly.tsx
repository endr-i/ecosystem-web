import { Navigate, Outlet } from 'react-router-dom';
import { FullPageLoader } from '../../../shared/components/FullPageLoader';
import { useAuthStore } from '../../../stores/authStore';

/** Keeps already authenticated users away from the login/register pages. */
export function GuestOnly() {
  const { authenticated, initialized } = useAuthStore();

  if (!initialized) {
    return <FullPageLoader tip="Restoring your session…" />;
  }
  if (authenticated) {
    return <Navigate to="/accounts" replace />;
  }

  return <Outlet />;
}
