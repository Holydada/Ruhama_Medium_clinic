import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Download, FileSpreadsheet, Calendar, Users, DollarSign, TestTube, Pill, Package } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
  requiresDateRange: boolean;
  roles: string[];
}

export default function DataExport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const exportOptions: ExportOption[] = [
    {
      id: 'patients',
      title: 'Patient List',
      description: 'Export all patient records with demographics and contact information',
      icon: <Users className="h-6 w-6" />,
      endpoint: '/export/patients',
      requiresDateRange: false,
      roles: ['ADMIN', 'RECEPTION'],
    },
    {
      id: 'visits',
      title: 'Visit Records',
      description: 'Export patient visits with diagnoses and doctor assignments',
      icon: <Calendar className="h-6 w-6" />,
      endpoint: '/export/visits',
      requiresDateRange: true,
      roles: ['ADMIN', 'RECEPTION'],
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Export payment transactions and revenue summary',
      icon: <DollarSign className="h-6 w-6" />,
      endpoint: '/export/financial',
      requiresDateRange: true,
      roles: ['ADMIN', 'FINANCE'],
    },
    {
      id: 'lab-orders',
      title: 'Lab Orders',
      description: 'Export laboratory test orders and results',
      icon: <TestTube className="h-6 w-6" />,
      endpoint: '/export/lab-orders',
      requiresDateRange: true,
      roles: ['ADMIN', 'LAB_TECH'],
    },
    {
      id: 'prescriptions',
      title: 'Prescriptions',
      description: 'Export medication prescriptions and dispensing records',
      icon: <Pill className="h-6 w-6" />,
      endpoint: '/export/prescriptions',
      requiresDateRange: true,
      roles: ['ADMIN', 'PHARMACIST'],
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Export current inventory levels and stock information',
      icon: <Package className="h-6 w-6" />,
      endpoint: '/export/inventory',
      requiresDateRange: false,
      roles: ['ADMIN', 'PHARMACIST'],
    },
  ];

  const handleExport = async (option: ExportOption) => {
    if (option.requiresDateRange && (!startDate || !endDate)) {
      toast.error('Please select start and end dates');
      return;
    }

    if (option.requiresDateRange && new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setLoading(option.id);

    try {
      const params = option.requiresDateRange
        ? { startDate, endDate }
        : {};

      const response = await api.get(option.endpoint, {
        params,
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${option.id}_${Date.now()}.xlsx`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Export completed successfully');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.error || 'Failed to export data');
    } finally {
      setLoading(null);
    }
  };

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
        <p className="text-gray-600 mt-1">
          Export clinic data to Excel format for reporting and analysis
        </p>
      </div>

      {/* Date Range Selector */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Date Range (for time-based exports)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setQuickDateRange(7)}>
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuickDateRange(30)}>
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuickDateRange(90)}>
            Last 3 Months
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(now.toISOString().split('T')[0]);
          }}>
            This Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(now.toISOString().split('T')[0]);
          }}>
            This Year
          </Button>
        </div>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <Card key={option.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                {option.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                
                <Button
                  onClick={() => handleExport(option)}
                  disabled={loading === option.id}
                  className="w-full"
                  size="sm"
                >
                  {loading === option.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export to Excel
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {option.requiresDateRange && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Requires date range
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Export Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Export Tips
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>All exports are in Excel (.xlsx) format for easy analysis</li>
          <li>Large exports may take a few moments to generate</li>
          <li>Exported files include all relevant data fields and are ready for pivot tables</li>
          <li>For custom reports, contact your system administrator</li>
          <li>Exports are logged for audit purposes</li>
        </ul>
      </Card>
    </div>
  );
}
