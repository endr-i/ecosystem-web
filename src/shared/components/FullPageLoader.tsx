import { Spin } from 'antd';

type FullPageLoaderProps = {
  tip?: string;
};

export function FullPageLoader({ tip = 'Loading…' }: FullPageLoaderProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin size="large" tip={tip}>
        <div style={{ padding: 24 }} />
      </Spin>
    </div>
  );
}
