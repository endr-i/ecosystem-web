import { App, Button, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applyFormErrors } from '../../../shared/utils/formErrors';
import type { ResetRequest } from '../types';
import { useReset } from "../hooks/useReset";

export function ResetForm() {
  const [form] = Form.useForm<ResetRequest>();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useReset();

  const handleFinish = async (values: ResetRequest) => {
    try {
      await mutateAsync(values);
      navigate("/forgot-password/sent", { replace: true });
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

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={isPending}>
          Request
        </Button>
      </Form.Item>
    </Form>
  );
}
