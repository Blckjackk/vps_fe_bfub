'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RealTimeStatsProps {
  currentValue: number;
  previousValue: number;
  label: string;
  format?: 'number' | 'percentage' | 'currency';
  showTrend?: boolean;
}

export default function RealTimeStats({ 
  currentValue, 
  previousValue, 
  label, 
  format = 'number',
  showTrend = true 
}: RealTimeStatsProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentValue !== previousValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [currentValue, previousValue]);

  const formatValue = (value: number) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `Rp ${value.toLocaleString('id-ID')}`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrend = () => {
    const diff = currentValue - previousValue;
    const percentage = previousValue > 0 ? ((diff / previousValue) * 100) : 0;
    
    if (Math.abs(percentage) < 0.1) return { trend: 'stable', icon: Minus, color: 'text-gray-500', value: '0%' };
    if (diff > 0) return { trend: 'up', icon: TrendingUp, color: 'text-green-500', value: `+${percentage.toFixed(1)}%` };
    return { trend: 'down', icon: TrendingDown, color: 'text-red-500', value: `${percentage.toFixed(1)}%` };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  return (
    <Card className={`transition-all duration-300 ${isAnimating ? 'ring-2 ring-blue-200 scale-105' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          {showTrend && (
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-3 h-3 ${trend.color}`} />
              <span className={`text-xs font-medium ${trend.color}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <span className={`text-2xl font-bold transition-colors duration-300 ${
            isAnimating ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {formatValue(currentValue)}
          </span>
          {previousValue !== currentValue && (
            <span className="ml-2 text-sm text-gray-400">
              (dari {formatValue(previousValue)})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
