import { Button, Result } from 'antd';
import { getErrorMessage } from '../../api/errors';

type ErrorStateProps = {
  title?: string;
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ title = 'Unable to load data', error, onRetry }: ErrorStateProps) {
  return (
    <Result
      status="warning"
      title={title}
      subTitle={getErrorMessage(error)}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    />
  );
}
