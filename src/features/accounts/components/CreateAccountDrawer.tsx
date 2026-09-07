import { useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { App, Button, Drawer, Flex, Form, Input } from 'antd';
import { applyFormErrors } from '../../../shared/utils/formErrors';
import { useCreateAccount } from '../hooks/useCreateAccount';
import type { CreateAccountRequest } from '../types';

type CreateAccountDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function CreateAccountDrawer({ open, onClose }: CreateAccountDrawerProps) {
  const [form] = Form.useForm<CreateAccountRequest>();
  const { notification, message } = App.useApp();
  const { mutateAsync, isPending } = useCreateAccount();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (form.isFieldTouched('slug')) return;
    form.setFieldValue('slug', slugify(event.target.value));
  };

  const handleFinish = async (values: CreateAccountRequest) => {
    try {
      const account = await mutateAsync(values);
      message.success(`Account "${account.name}" created.`);
      onClose();
    } catch (error) {
      const description = applyFormErrors(form, error);
      if (description) notification.error({ message: 'Could not create account', description });
    }
  };

  return (
    <Drawer
      title="Create account"
      width={480}
      open={open}
      onClose={onClose}
      maskClosable={!isPending}
      destroyOnHidden
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="primary" loading={isPending} onClick={() => form.submit()}>
            Create account
          </Button>
        </Flex>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} disabled={isPending}>
        <Form.Item name="name" label="Account name" rules={[{ required: true, message: 'Enter an account name' }]}>
          <Input placeholder="Acme Corporation" onChange={handleNameChange} />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          tooltip="Unique identifier used in URLs and API calls."
          rules={[
            { required: true, message: 'Enter a slug' },
            {
              pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Use lowercase letters, numbers and dashes',
            },
          ]}
        >
          <Input placeholder="acme-corporation" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="What is this account used for?" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
