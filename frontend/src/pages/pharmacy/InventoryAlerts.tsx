import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Package, 
  Calendar,
  TrendingDown,
  Search,
  Download
} from 'lucide-react';
import { toast } from '../../lib/toast';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';

interface InventoryAlert {
  id: string;
  drugName: string;
  genericName: string;
  currentStock: number;
  reorderLevel: number;
  expiryDate: string;
  batchNumber: string;
  alertType: 'low-stock' | 'out-of-stock' | 'expiring-soon' | 'expired';
  priority: 'high' | 'medium' | 'low';
  location: string;
  supplier: string;
}

export const InventoryAlerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [alerts] = useState<InventoryAlert[]>([
    {
      id: '1',
      drugName: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      currentStock: 15,
      reorderLevel: 50,
      expiryDate: '2026-04-15',
      batchNumber: 'BT-2025-001',
      alertType: 'low-stock',
      priority: 'high',
      location: 'Main Store',
      supplier: 'EPHARM'
    },
    {
      id: '2',
      drugName: 'Paracetamol 500mg',
      genericName: 'Paracetamol',
      currentStock: 0,
      reorderLevel: 100,
      expiryDate: '2026-12-31',
      batchNumber: 'BT-2025-002',
      alertType: 'out-of-stock',
      priority: 'high',
      location: 'Main Store',
      supplier: 'Addis Pharmaceutical'
    },
    {
      id: '3',
      drugName: 'Metformin 850mg',
      genericName: 'Metformin',
      currentStock: 200,
      reorderLevel: 100,
      expiryDate: '2026-04-30',
      batchNumber: 'BT-2025-003',
      alertType: 'expiring-soon',
      priority: 'medium',
      location: 'Main Store',
      supplier: 'Cadila'
    },
    {
      id: '4',
      drugName: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      currentStock: 50,
      reorderLevel: 0,
      expiryDate: '2026-03-15',
      batchNumber: 'BT-2024-015',
      alertType: 'expired',
      priority: 'high',
      location: 'Dispensary',
      supplier: 'Julphar'
    },
    {
      id: '5',
      drugName: 'Ciprofloxacin 500mg',
      genericName: 'Ciprofloxacin',
      currentStock: 25,
      reorderLevel: 75,
      expiryDate: '2027-01-15',
      batchNumber: 'BT-2025-010',
      alertType: 'low-stock',
      priority: 'medium',
      location: 'Main Store',
      supplier: 'EPHARM'
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'out-of-stock': return <Package className="w-5 h-5" />;
      case 'low-stock': return <TrendingDown className="w-5 h-5" />;
      case 'expiring-soon': return <Calendar className="w-5 h-5" />;
      case 'expired': return <AlertCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'out-of-stock': return 'red';
      case 'low-stock': return 'orange';
      case 'expiring-soon': return 'yellow';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityVariant = (priority: string): 'danger' | 'warning' | 'default' => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || alert.alertType === filterType;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const stats = {
    total: alerts.length,
    outOfStock: alerts.filter(a => a.alertType === 'out-of-stock').length,
    lowStock: alerts.filter(a => a.alertType === 'low-stock').length,
    expiring: alerts.filter(a => a.alertType === 'expiring-soon' || a.alertType === 'expired').length,
    highPriority: alerts.filter(a => a.priority === 'high').length
  };

  const handleExport = () => {
    toast.info('Export started. CSV generation will be available in reporting service.');
  };

  const handleReorder = (item: InventoryAlert) => {
    toast.info(`Purchase order request created for ${item.drugName}.`);
  };

  const handleDispose = (item: InventoryAlert) => {
    if (window.confirm(`Mark ${item.drugName} (${item.batchNumber}) for disposal?`)) {
      toast.success('Item marked for disposal.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor stock levels and expiry dates</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon={Search}
              placeholder="Search by drug name or batch number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'out-of-stock' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('out-of-stock')}
            >
              Out of Stock
            </Button>
            <Button
              variant={filterType === 'low-stock' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('low-stock')}
            >
              Low Stock
            </Button>
            <Button
              variant={filterType === 'expiring-soon' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('expiring-soon')}
            >
              Expiring
            </Button>
            <Button
              variant={filterType === 'expired' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('expired')}
            >
              Expired
            </Button>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const color = getAlertColor(alert.alertType);
          return (
            <Card key={alert.id} className={`p-6 border-l-4 border-${color}-500`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
                      {getAlertIcon(alert.alertType)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{alert.drugName}</h3>
                      <p className="text-sm text-gray-600">{alert.genericName}</p>
                    </div>
                    <Badge variant={getPriorityVariant(alert.priority)}>
                      {alert.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <Badge variant="default">
                      {alert.alertType.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Current Stock</p>
                      <p className={`font-bold ${alert.currentStock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {alert.currentStock} units
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reorder Level</p>
                      <p className="font-medium text-gray-900">{alert.reorderLevel} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Batch Number</p>
                      <p className="font-medium text-gray-900">{alert.batchNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Expiry Date</p>
                      <p className={`font-medium ${
                        new Date(alert.expiryDate) < new Date() ? 'text-red-600' :
                        new Date(alert.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'text-yellow-600' :
                        'text-gray-900'
                      }`}>
                        {alert.expiryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{alert.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Supplier:</span>
                    <span>{alert.supplier}</span>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {(alert.alertType === 'low-stock' || alert.alertType === 'out-of-stock') && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleReorder(alert)}
                    >
                      Reorder
                    </Button>
                  )}
                  {alert.alertType === 'expired' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDispose(alert)}
                    >
                      Dispose
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No alerts found</p>
        </Card>
      )}
    </div>
  );
};
