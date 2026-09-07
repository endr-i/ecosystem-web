import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { GuestOnly } from '../features/auth/components/GuestOnly';
import { RequireAuth } from '../features/auth/components/RequireAuth';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { AccountsPage } from '../features/accounts/pages/AccountsPage';
import { AccountDetailsPage } from '../features/accounts/pages/AccountDetailsPage';
import { NotFoundPage } from '../shared/components/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:accountId" element={<AccountDetailsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/accounts" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
