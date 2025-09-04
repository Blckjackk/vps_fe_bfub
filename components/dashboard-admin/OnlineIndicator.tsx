import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface OnlineIndicatorProps {
  isOnline: boolean;
  lastSeen?: string;
  className?: string;
}

export default function OnlineIndicator({ isOnline, lastSeen, className = '' }: OnlineIndicatorProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3 text-green-500" />
          <span className="text-xs text-green-600 font-medium">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            {lastSeen ? `Offline (${lastSeen})` : 'Offline'}
          </span>
        </>
      )}
    </div>
  );
}
