import { Button, Result, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthLayout } from "../../../layouts/AuthLayout";

const { Text } = Typography;

export function ResetPasswordSentPage() {
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  return (
    <AuthLayout mainTitle={false}>
      <Result
        icon={<MailOutlined />}
        title="Check your email"
        subTitle={
          <>
            If an account exists for
            {email && (
              <>
                {' '}
                <Text strong>{email}</Text>
              </>
            )}
            , we've sent password reset instructions.
          </>
        }
        extra={
          <Link to="/login">
            <Button type="primary" block>
              Back to sign in
            </Button>
          </Link>
        }
      />
    </AuthLayout>
  );
}
