import { Breadcrumb, Card, Descriptions, Skeleton, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../../../shared/components/ErrorState';
import { PageHeader } from '../../../shared/components/PageHeader';
import { formatDateTime } from '../../../shared/utils/date';
import { spacing } from '../../../theme/theme';
import { AccountStatusTag } from '../components/AccountStatusTag';
import { useAccount } from '../hooks/useAccount';

export function AccountDetailsPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const { data: account, isPending, isError, error, refetch } = useAccount(accountId);

  if (isError) {
    return <ErrorState title="Unable to load account" error={error} onRetry={() => void refetch()} />;
  }

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: spacing.md }}
        items={[{ title: <Link to="/accounts">Accounts</Link> }, { title: account?.name ?? 'Account' }]}
      />

      <PageHeader
        title={isPending ? 'Account' : account.name}
        description={isPending ? undefined : account.description ?? 'No description provided.'}
      />

      <Card>
        {isPending ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <Descriptions column={{ xs: 1, md: 2 }} bordered size="middle">
            <Descriptions.Item label="Name">{account.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">
              <Typography.Text code>{account.slug}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <AccountStatusTag status={account.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Account ID">
              <Typography.Text copyable>{account.id}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Created">{formatDateTime(account.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Last updated">{formatDateTime(account.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </>
  );
}
