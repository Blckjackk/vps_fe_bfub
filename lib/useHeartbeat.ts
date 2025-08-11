"use client";

import { useEffect, useRef } from 'react';
import { useAuth } from './auth';
import { API_URL } from './api';

export function useHeartbeat() {
  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only start heartbeat for authenticated peserta
    if (isAuthenticated && user?.role === 'peserta') {
      const sendHeartbeat = async () => {
        try {
          const token = localStorage.getItem('session_token');
          await fetch(`${API_URL}/api/peserta/heartbeat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              peserta_id: user.id
            })
          });
        } catch (error) {
          console.error('Heartbeat failed:', error);
        }
      };

      // Send initial heartbeat
      sendHeartbeat();
      
      // Send heartbeat every 2 minutes
      intervalRef.current = setInterval(sendHeartbeat, 120000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, user]);
}
