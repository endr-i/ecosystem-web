import { Button, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../layouts/AuthLayout';

export function ResetConfirmSuccessPage() {
  return (
    <AuthLayout mainTitle={false}>
      <Result
        icon={<MailOutlined />}
        title="You have reset your password"
        extra={
          <Link to="/login">
            <Button type="primary" block>
              Sign in
            </Button>
          </Link>
        }
      />
    </AuthLayout>
  );
}
