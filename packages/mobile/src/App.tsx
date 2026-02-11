/**
 * Mobile app root component
 */

import { useSocket } from './hooks/useSocket';
import { Customizer } from './components/Customizer';
import { LoadingSpinner } from './components/LoadingSpinner';

export function App() {
  const { connected } = useSocket();

  if (!connected) {
    return <LoadingSpinner />;
  }

  return <Customizer />;
}
