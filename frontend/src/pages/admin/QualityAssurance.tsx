import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Wrench } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface QACheck {
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
}

interface QAReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  checks: QACheck[];
  timestamp: string;
}

export default function QualityAssurance() {
  const [report, setReport] = useState<QAReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/qa/report');
      setReport(response.data);
    } catch (error) {
      console.error('Failed to load QA report:', error);
      toast.error('Failed to load quality assurance report');
    } finally {
      setLoading(false);
    }
  };

  const runAutoFix = async () => {
    setFixing(true);
    try {
      const response = await api.post('/qa/auto-fix');
      const { fixed, errors } = response.data;
      
      if (fixed.length > 0) {
        toast.success(`Fixed ${fixed.length} issues`);
      }
      
      if (errors.length > 0) {
        toast.error(`${errors.length} issues could not be fixed automatically`);
      }
      
      // Reload report
      await loadReport();
    } catch (error) {
      console.error('Auto-fix error:', error);
      toast.error('Failed to run auto-fix');
    } finally {
      setFixing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'FAIL':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'bg-green-50 border-green-200';
      case 'FAIL':
        return 'bg-red-50 border-red-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const groupedChecks = report?.checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, QACheck[]>);

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Assurance</h1>
          <p className="text-gray-600 mt-1">
            System health checks and data integrity validation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadReport} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={runAutoFix} disabled={fixing}>
            <Wrench className="h-4 w-4 mr-2" />
            {fixing ? 'Fixing...' : 'Auto-Fix Issues'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Checks</p>
                <p className="text-2xl font-bold">{report.summary.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{report.summary.passed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{report.summary.warnings}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{report.summary.failed}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Checks by Category */}
      {groupedChecks && Object.entries(groupedChecks).map(([category, checks]) => (
        <Card key={category} className="p-6">
          <h2 className="text-lg font-semibold mb-4">{category}</h2>
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{check.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        check.status === 'PASS' ? 'bg-green-200 text-green-800' :
                        check.status === 'FAIL' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{check.message}</p>
                    
                    {check.details && Object.keys(check.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                          View Details
                        </summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border border-gray-200 overflow-auto">
                          {JSON.stringify(check.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Last Updated */}
      {report && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {new Date(report.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
}
