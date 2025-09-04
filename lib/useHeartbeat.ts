"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './auth';
import { API_URL } from './api';

export function useHeartbeat() {
  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    // Only start heartbeat for authenticated peserta
    if (isAuthenticated && user?.role === 'peserta') {
      const sendHeartbeat = async () => {
        try {
          const token = localStorage.getItem('session_token');
          
          // Get current activity status
          const isActive = !document.hidden;
          const currentUrl = window.location.pathname;
          
          await fetch(`${API_URL}/api/peserta/heartbeat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              peserta_id: user.id,
              is_active: isActive,
              current_page: currentUrl,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              screen_resolution: `${screen.width}x${screen.height}`
            })
          });
        } catch (error) {
          console.error('Heartbeat failed:', error);
        }
      };

      // Track user activity
      const handleVisibilityChange = () => {
        isActiveRef.current = !document.hidden;
        if (!document.hidden) {
          // Send heartbeat when user becomes active
          sendHeartbeat();
        }
      };

      const handleUserActivity = () => {
        isActiveRef.current = true;
      };

      // Add event listeners for user activity detection
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('mousemove', handleUserActivity);
      document.addEventListener('keypress', handleUserActivity);
      document.addEventListener('click', handleUserActivity);
      document.addEventListener('scroll', handleUserActivity);

      // Send initial heartbeat
      sendHeartbeat();
      
      // Send heartbeat every 2 minutes (120 seconds)
      intervalRef.current = setInterval(sendHeartbeat, 120000);

      // Cleanup function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('mousemove', handleUserActivity);
        document.removeEventListener('keypress', handleUserActivity);
        document.removeEventListener('click', handleUserActivity);
        document.removeEventListener('scroll', handleUserActivity);
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, user]);

  // Send offline heartbeat when user is leaving
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (isAuthenticated && user?.role === 'peserta') {
        const token = localStorage.getItem('session_token');
        
        // Use sendBeacon for reliable offline detection
        const data = JSON.stringify({
          peserta_id: user.id,
          is_active: false,
          event_type: 'user_offline',
          timestamp: new Date().toISOString()
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            `${API_URL}/api/peserta/heartbeat`,
            new Blob([data], { type: 'application/json' })
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [isAuthenticated, user]);
}

// Hook untuk admin monitoring
export function useOnlineUsersMonitoring() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const token = localStorage.getItem('session_token');
        const response = await fetch(`${API_URL}/api/admin/online-users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOnlineCount(data.data.count);
            setOnlineUsers(data.data.users);
          }
        }
      } catch (error) {
        console.error('Failed to fetch online users:', error);
      }
    };

    // Fetch initially
    fetchOnlineUsers();
    
    // Update every 30 seconds
    const interval = setInterval(fetchOnlineUsers, 30000);

    return () => clearInterval(interval);
  }, []);

  return { onlineCount, onlineUsers };
}
