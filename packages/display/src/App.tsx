/**
 * Display app root component
 */

import { Garden } from './components/Garden';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { ConnectionStatus } from './components/ConnectionStatus';

export function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Garden />
      <QRCodeDisplay />
      <ConnectionStatus />
    </div>
  );
}
