import { Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { LoginForm } from '../components/LoginForm';

type LoginLocationState = { from?: string } | null;

export function LoginPage() {
  const location = useLocation();
  const state = location.state as LoginLocationState;
  const redirectTo = state?.from ?? '/accounts';

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your Ecosystem workspace."
      footer={
        <Typography.Text type="secondary">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </Typography.Text>
      }
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  );
}
