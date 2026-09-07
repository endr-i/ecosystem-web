import type { ReactNode } from 'react';
import { Flex, Typography } from 'antd';
import { spacing } from '../../theme/theme';

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
};

export function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <Flex align="flex-start" justify="space-between" gap={spacing.md} wrap style={{ marginBottom: spacing.lg }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {description ? <Typography.Text type="secondary">{description}</Typography.Text> : null}
      </div>
      {extra}
    </Flex>
  );
}
