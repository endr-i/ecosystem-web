import { App, Button, Col, Form, Input, Row } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applyFormErrors } from '../../../shared/utils/formErrors';
import { useRegister } from '../hooks/useRegister';
import type { RegisterRequest } from '../types';

type RegisterFormValues = RegisterRequest & { confirmPassword: string };

export function RegisterForm() {
  const [form] = Form.useForm<RegisterFormValues>();
  const { notification, message } = App.useApp();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useRegister();

  const handleFinish = async ({ confirmPassword: _confirmPassword, ...payload }: RegisterFormValues) => {
    try {
      const accessToken = await mutateAsync(payload);

      if (accessToken) {
        await message.success('Your account is ready.');
        navigate('/accounts', { replace: true });
        return;
      }

      await message.success('Registration complete. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      const description = applyFormErrors(form, error);
      if (description) {
          notification.error({ title: 'Registration failed', description });
      }
    }
  };

  return (
    <Form form={form} layout="vertical" size="large" requiredMark={false} onFinish={handleFinish} disabled={isPending}>
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item name="firstName" label="First name" rules={[{ required: true, message: 'Enter your first name' }]}>
            <Input autoComplete="given-name" placeholder="Ada" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="lastName" label="Last name" rules={[{ required: true, message: 'Enter your last name' }]}>
            <Input autoComplete="family-name" placeholder="Lovelace" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Enter your email' },
          { type: 'email', message: 'Enter a valid email address' },
        ]}
      >
        <Input prefix={<MailOutlined />} autoComplete="email" placeholder="you@company.com" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone number (optional)"
        rules={[{ pattern: /^[+\d][\d\s()-]{6,19}$/, message: 'Enter a valid phone number' }]}
      >
        <Input prefix={<PhoneOutlined />} autoComplete="tel" placeholder="+1 555 123 4567" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Enter a password' },
          { min: 8, message: 'Use at least 8 characters' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} autoComplete="new-password" placeholder="At least 8 characters" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Repeat your password' },
          ({ getFieldValue }) => ({
            validator(_rule, value: string) {
              if (!value || value === getFieldValue('password')) return Promise.resolve();
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} autoComplete="new-password" placeholder="Repeat your password" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={isPending}>
          Create account
        </Button>
      </Form.Item>
    </Form>
  );
}
