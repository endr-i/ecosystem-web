import { Button, Popconfirm, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../shared/utils/date';
import type { Account } from '../types';
import { AccountStatusTag } from './AccountStatusTag';

type AccountsTableProps = {
  accounts: Account[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  deletingAccountId?: string;
  onPaginationChange: (page: number, pageSize: number) => void;
  onDelete: (account: Account) => void;
};

export function AccountsTable({
  accounts,
  loading,
  total,
  page,
  pageSize,
  deletingAccountId,
  onPaginationChange,
  onDelete,
}: AccountsTableProps) {
  const columns: TableProps<Account>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_value, account) => <Link to={`/accounts/${account.id}`}>{account.name}</Link>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['md'],
      render: (slug: string) => <Typography.Text code>{slug}</Typography.Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: Account['status']) => <AccountStatusTag status={status} />,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      responsive: ['lg'],
      render: (createdAt: string) => formatDate(createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      align: 'right',
      render: (_value, account) => (
        <Space size="small">
          <Link to={`/accounts/${account.id}`}>
            <Button type="link" size="small">
              View
            </Button>
          </Link>
          <Popconfirm
            title="Delete account"
            description={`Delete "${account.name}"? This cannot be undone.`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(account)}
          >
            <Button type="link" size="small" danger loading={deletingAccountId === account.id}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<Account>
      rowKey="id"
      columns={columns}
      dataSource={accounts}
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPaginationChange,
      }}
    />
  );
}
