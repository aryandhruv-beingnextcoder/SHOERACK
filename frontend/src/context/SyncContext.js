import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SyncContext = createContext();

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    const socketInstance = io(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001');
    
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setSyncStatus('connected');
      console.log('🔗 Connected to server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setSyncStatus('disconnected');
      console.log('❌ Disconnected from server');
    });

    socketInstance.on('products_updated', (data) => {
      setLastSync(data.timestamp);
      toast.success(`Products updated: ${data.action}`, { duration: 2000 });
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: data }));
    });

    socketInstance.on('orders_updated', (data) => {
      setLastSync(data.timestamp);
      toast.success(`Orders updated: ${data.action}`, { duration: 2000 });
      window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: data }));
    });

    socketInstance.on('users_updated', (data) => {
      setLastSync(data.timestamp);
      window.dispatchEvent(new CustomEvent('usersUpdated', { detail: data }));
    });

    socketInstance.on('sync_status', (data) => {
      setSyncStatus(data.status);
      if (data.status === 'syncing') {
        toast.loading('Syncing data...', { id: 'sync' });
      }
    });

    socketInstance.on('data_updated', (data) => {
      setLastSync(data.timestamp);
      setSyncStatus('synced');
      toast.success('Data synchronized', { id: 'sync' });
    });

    socketInstance.on('sync_error', (data) => {
      setSyncStatus('error');
      toast.error('Sync error occurred', { id: 'sync' });
      console.error('Sync error:', data.error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const triggerSync = () => {
    if (socket) {
      socket.emit('request_sync');
      setSyncStatus('syncing');
    }
  };

  const value = {
    socket,
    isConnected,
    lastSync,
    syncStatus,
    triggerSync
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};