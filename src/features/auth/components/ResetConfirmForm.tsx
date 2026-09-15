import { App, Button, Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {Navigate, useNavigate, useSearchParams} from 'react-router-dom';
import { applyFormErrors } from '../../../shared/utils/formErrors';
import type { ResetConfirmRequest } from '../types';
import { useResetConfirm } from '../hooks/useResetConfirm';

type ResetConfirmFormValues = Omit<ResetConfirmRequest, 'token'>;

export function ResetConfirmForm() {
  const [form] = Form.useForm<ResetConfirmFormValues>();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useResetConfirm();

  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleFinish = async (values: ResetConfirmFormValues) => {
    try {
      await mutateAsync({
        ...values,
        token,
      });
      navigate("/reset-password/success", { replace: true });
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
        name="password"
        label="New Password"
        rules={[
          { required: true, message: 'Enter a password' },
          { min: 8, message: 'Use at least 8 characters' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} autoComplete="new-password" placeholder="At least 8 characters" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={isPending}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
}
