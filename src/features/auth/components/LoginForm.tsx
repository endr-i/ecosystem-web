import { App, Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applyFormErrors } from '../../../shared/utils/formErrors';
import { useLogin } from '../hooks/useLogin';
import type { LoginRequest } from '../types';

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [form] = Form.useForm<LoginRequest>();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogin();

  const handleFinish = async (values: LoginRequest) => {
    try {
      await mutateAsync(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = applyFormErrors(form, error);
      if (message) {
          notification.error({ message: 'Sign in failed', description: message });
      }
    }
  };

  return (
    <Form form={form} layout="vertical" size="large" requiredMark={false} onFinish={handleFinish} disabled={isPending}>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: 'Enter your email' }]}
      >
        <Input prefix={<MailOutlined />} autoComplete="username" placeholder="you@company.com" />
      </Form.Item>

      <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}>
        <Input.Password prefix={<LockOutlined />} autoComplete="current-password" placeholder="Your password" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={isPending}>
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
}
