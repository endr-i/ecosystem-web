import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up access to the Ecosystem admin console."
      footer={
        <Typography.Text type="secondary">
          Already registered? <Link to="/login">Sign in</Link>
        </Typography.Text>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
