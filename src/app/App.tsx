import { AppProviders } from './providers';
import { AppRouter } from './router';
import { useSessionBootstrap } from '../features/auth/hooks/useSessionBootstrap';
import { FullPageLoader } from '../shared/components/FullPageLoader';

function AppContent() {
  const initialized = useSessionBootstrap();

  if (!initialized) return <FullPageLoader tip="Starting Ecosystem…" />;

  return <AppRouter />;
}

export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
