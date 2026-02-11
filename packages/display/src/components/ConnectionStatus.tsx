/**
 * Connection status indicator
 */

import { useGardenStore } from '../store/garden-store';

export function ConnectionStatus() {
  const connected = useGardenStore((state) => state.connected);

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: '8px 16px',
        borderRadius: 20,
        background: connected ? '#4CAF50' : '#f44336',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'white',
          animation: connected ? 'pulse 2s infinite' : 'none',
        }}
      />
      {connected ? 'Connected' : 'Disconnected'}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
