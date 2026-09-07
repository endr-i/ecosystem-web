import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Result
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      status="404"
      title="404"
      subTitle="The page you are looking for does not exist."
      extra={
        <Link to="/accounts">
          <Button type="primary">Back to accounts</Button>
        </Link>
      }
    />
  );
}
