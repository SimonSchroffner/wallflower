/**
 * Socket connection hook
 */

import { useEffect, useState } from 'react';
import { mobileSocket } from '../socket/mobile-socket';

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:3001';
    const socket = mobileSocket.connect(backendUrl);

    const checkConnection = () => {
      setConnected(mobileSocket.isConnected());
    };

    socket.on('connect', checkConnection);
    socket.on('disconnect', checkConnection);

    checkConnection();

    return () => {
      socket.off('connect', checkConnection);
      socket.off('disconnect', checkConnection);
    };
  }, []);

  return { connected };
}
