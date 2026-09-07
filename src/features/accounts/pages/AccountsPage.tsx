import { useState } from 'react';
import { App, Button, Card, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getErrorMessage } from '../../../api/errors';
import { ErrorState } from '../../../shared/components/ErrorState';
import { PageHeader } from '../../../shared/components/PageHeader';
import { spacing } from '../../../theme/theme';
import { AccountsTable } from '../components/AccountsTable';
import { CreateAccountDrawer } from '../components/CreateAccountDrawer';
import { useAccounts } from '../hooks/useAccounts';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import type { Account } from '../types';

export function AccountsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState<string>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { notification, message } = App.useApp();
  const { data, isPending, isFetching, isError, error, refetch } = useAccounts({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search,
  });
  const { mutateAsync: removeAccount, isPending: isDeleting, variables: deletingId } = useDeleteAccount();

  const handleDelete = async (account: Account) => {
    try {
      await removeAccount(account.id);
      await message.success(`Account "${account.name}" deleted.`);
    } catch (deleteError) {
      notification.error({
        title: 'Could not delete account',
        description: getErrorMessage(deleteError),
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value.trim() || undefined);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Manage the accounts available in your Ecosystem workspace."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
            Create account
          </Button>
        }
      />

      <Card styles={{ body: { padding: spacing.md } }}>
        {isError && !data ? (
          <ErrorState title="Unable to load accounts" error={error} onRetry={() => void refetch()} />
        ) : (
          <>
            <Input.Search
              allowClear
              placeholder="Search accounts"
              onSearch={handleSearch}
              style={{ maxWidth: 320, marginBottom: spacing.md }}
            />

            <AccountsTable
              accounts={data?.items ?? []}
              total={data?.total ?? 0}
              loading={isPending || isFetching}
              page={page}
              pageSize={pageSize}
              deletingAccountId={isDeleting ? deletingId : undefined}
              onPaginationChange={(nextPage, nextPageSize) => {
                setPage(nextPage);
                setPageSize(nextPageSize);
              }}
              onDelete={(account) => void handleDelete(account)}
            />
          </>
        )}
      </Card>

      <CreateAccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
