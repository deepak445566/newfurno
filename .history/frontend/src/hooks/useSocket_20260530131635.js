// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io('https://newfurno.onrender.com', {
      withCredentials: true,
    });

    socketRef.current.emit('register', userId);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  return socketRef.current;
};