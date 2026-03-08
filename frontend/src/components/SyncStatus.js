import React from 'react';
import { useSync } from '../context/SyncContext';

const SyncStatus = () => {
  const { isConnected, syncStatus, lastSync, triggerSync } = useSync();

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'connected':
      case 'synced':
        return 'text-green-500';
      case 'syncing':
        return 'text-yellow-500';
      case 'error':
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'connected':
      case 'synced':
        return '🟢';
      case 'syncing':
        return '🟡';
      case 'error':
      case 'disconnected':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <button
        onClick={triggerSync}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${getStatusColor()} hover:bg-gray-100`}
        title={`Status: ${syncStatus}${lastSync ? ` | Last sync: ${new Date(lastSync).toLocaleTimeString()}` : ''}`}
      >
        <span>{getStatusIcon()}</span>
        <span className="hidden md:inline">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </button>
    </div>
  );
};

export default SyncStatus;