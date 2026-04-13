import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Activity, Server, Database, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: string;
  memory: {
    rss: string;
    heapUsed: string;
    heapTotal: string;
  };
  performance: {
    recentRequests: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  statusCodes: Record<number, number>;
  errorRate: number;
}

export default function SystemMonitoring() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const [healthRes, statsRes] = await Promise.all([
        api.get('/monitoring/health'),
        api.get('/monitoring/metrics'),
      ]);
      
      setHealth(healthRes.data);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      await api.post('/monitoring/cache/clear');
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'primary' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </Button>
          <Button variant="outline" onClick={loadData}>
            Refresh Now
          </Button>
          <Button variant="outline" onClick={clearCache}>
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">
                {health?.status || 'Unknown'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-lg font-semibold">{health?.uptime || 'N/A'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Server className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Memory Used</p>
              <p className="text-lg font-semibold">{health?.memory.heapUsed || 'N/A'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Database className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Requests (5min)</p>
              <p className="text-lg font-semibold">
                {health?.performance.recentRequests || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      {stats && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Response Time</p>
              <p className="text-2xl font-bold">{stats.averageResponseTime.toFixed(2)}ms</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Error Rate</p>
              <p className={`text-2xl font-bold ${stats.errorRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.errorRate.toFixed(2)}%
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Min Response Time</p>
              <p className="text-xl font-semibold">{stats.minResponseTime.toFixed(2)}ms</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Max Response Time</p>
              <p className="text-xl font-semibold">{stats.maxResponseTime.toFixed(2)}ms</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">P95 Response Time</p>
              <p className="text-xl font-semibold">{stats.p95ResponseTime.toFixed(2)}ms</p>
            </div>
          </div>

          {/* Status Codes */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">HTTP Status Codes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.statusCodes).map(([code, count]) => (
                <div key={code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className={`font-semibold ${
                    parseInt(code) >= 400 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {code}
                  </span>
                  <span className="text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Memory Usage */}
      {health && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Memory Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">RSS</p>
              <p className="text-xl font-semibold">{health.memory.rss}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Heap Used</p>
              <p className="text-xl font-semibold">{health.memory.heapUsed}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Heap Total</p>
              <p className="text-xl font-semibold">{health.memory.heapTotal}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts */}
      {stats && stats.errorRate > 5 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">High Error Rate Detected</p>
              <p className="text-sm text-red-700">
                The system is experiencing an error rate of {stats.errorRate.toFixed(2)}%. 
                Please investigate immediately.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
