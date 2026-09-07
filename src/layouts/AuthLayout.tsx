import type { ReactNode } from 'react';
import { Card, Flex, Typography } from 'antd';
import { spacing } from '../theme/theme';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: '100vh', padding: spacing.lg, background: '#f5f6f8' }}
    >
      <Flex vertical gap={spacing.lg} style={{ width: '100%', maxWidth: 420 }}>
        <Flex vertical align="center" gap={spacing.xs}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Ecosystem
          </Typography.Title>
        </Flex>

        <Card>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: subtitle ? spacing.xs : spacing.lg }}>
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Paragraph type="secondary" style={{ marginBottom: spacing.lg }}>
              {subtitle}
            </Typography.Paragraph>
          ) : null}

          {children}
        </Card>

        {footer ? <Flex justify="center">{footer}</Flex> : null}
      </Flex>
    </Flex>
  );
}
