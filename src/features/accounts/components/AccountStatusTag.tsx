import { Tag } from 'antd';
import type { AccountStatus } from '../types';

const STATUS_COLORS: Record<AccountStatus, string> = {
  active: 'green',
  pending: 'gold',
  inactive: 'default',
  suspended: 'red',
};

export function AccountStatusTag({ status }: { status: AccountStatus }) {
  return <Tag color={STATUS_COLORS[status] ?? 'default'}>{(status ?? 'unknown').toUpperCase()}</Tag>;
}
