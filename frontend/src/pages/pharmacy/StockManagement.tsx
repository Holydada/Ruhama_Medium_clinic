import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { pharmacyModuleSubnav } from '../../navigation/moduleSubnavItems';

interface MedicationStock {
  id: string;
  drugName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  location: string;
}

export const StockManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'expiring' | 'out'>('all');
  const [medications, setMedications] = useState<MedicationStock[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStock = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/pharmacy/stock', { params: { limit: 500 } });
      const stocks = resp.data?.data?.stocks || [];
      setMedications(
        stocks.map((s: any) => ({
          id: s.id,
          drugName: s.drug?.drugName || 'Unknown',
          genericName: s.drug?.genericName || '',
          strength: s.drug?.strength || '',
          dosageForm: s.drug?.dosageForm || '',
          currentStock: Number(s.quantityInStock ?? 0),
          reorderLevel: Math.max(1, Number(s.reorderLevel ?? 1)),
          unitPrice: Number(s.unitPrice ?? 0),
          expiryDate: s.expiryDate ? String(s.expiryDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
          batchNumber: s.batchNumber || '—',
          supplier: s.supplier || '—',
          location: s.location || '—',
        }))
      );
    } catch {
      toast.error('Failed to load stock.');
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStock();
  }, []);

  const getStockStatus = (med: MedicationStock) => {
    if (med.currentStock === 0) return 'out';
    if (med.currentStock <= med.reorderLevel * 0.5) return 'critical';
    if (med.currentStock <= med.reorderLevel) return 'low';
    return 'good';
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const monthsUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilExpiry <= 3;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      out: { variant: 'danger' as const, label: 'Out of Stock', icon: '⚠' },
      critical: { variant: 'danger' as const, label: 'Critical', icon: '🔴' },
      low: { variant: 'warning' as const, label: 'Low Stock', icon: '🟡' },
      good: { variant: 'success' as const, label: 'In Stock', icon: '🟢' },
    };
    return variants[status as keyof typeof variants] || variants.good;
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const status = getStockStatus(med);
    const expiring = isExpiringSoon(med.expiryDate);

    if (filterStatus === 'all') return true;
    if (filterStatus === 'low') return status === 'low' || status === 'critical';
    if (filterStatus === 'expiring') return expiring;
    if (filterStatus === 'out') return status === 'out';
    
    return true;
  });

  const stats = {
    totalItems: medications.length,
    lowStock: medications.filter(m => getStockStatus(m) === 'low' || getStockStatus(m) === 'critical').length,
    outOfStock: medications.filter(m => getStockStatus(m) === 'out').length,
    expiringSoon: medications.filter(m => isExpiringSoon(m.expiryDate)).length,
    totalValue: medications.reduce((sum, m) => sum + (m.currentStock * m.unitPrice), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Stock Management</h1>
            <p className="text-slate-400 mt-1">Manage pharmacy inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => void loadStock()} isLoading={loading}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/pharmacy/stock-entry')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Stock
            </Button>
          </div>
        </div>

        <ModuleSubnav items={pharmacyModuleSubnav} ariaLabel="Pharmacy sections" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Items</p>
                <p className="text-3xl font-bold text-slate-50 mt-1">{stats.totalItems}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Low Stock</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.lowStock}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Out of Stock</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{stats.outOfStock}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Expiring Soon</p>
                <p className="text-3xl font-bold text-orange-400 mt-1">{stats.expiringSoon}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Value</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card variant="elevated">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search medications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'low', label: 'Low Stock' },
                  { value: 'expiring', label: 'Expiring' },
                  { value: 'out', label: 'Out of Stock' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filterStatus === filter.value
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Medication Inventory</CardTitle>
            <CardDescription>{filteredMedications.length} items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Medication</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Batch</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Expiry</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Location</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Value</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map((med) => {
                    const status = getStockStatus(med);
                    const statusInfo = getStatusBadge(status);
                    const expiring = isExpiringSoon(med.expiryDate);
                    const stockPercentage = (med.currentStock / med.reorderLevel) * 100;

                    return (
                      <tr key={med.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-slate-50">{med.drugName}</p>
                            <p className="text-xs text-slate-400">{med.genericName} • {med.strength} {med.dosageForm}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-bold text-slate-50">{med.currentStock}</p>
                            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full ${
                                  status === 'out' ? 'bg-red-500' :
                                  status === 'critical' ? 'bg-red-500' :
                                  status === 'low' ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Reorder: {med.reorderLevel}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={statusInfo.variant} size="sm">
                            {statusInfo.icon} {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-mono text-slate-300">{med.batchNumber}</p>
                          <p className="text-xs text-slate-500">{med.supplier}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className={`text-sm font-semibold ${expiring ? 'text-orange-400' : 'text-slate-300'}`}>
                            {new Date(med.expiryDate).toLocaleDateString()}
                          </p>
                          {expiring && (
                            <Badge variant="warning" size="sm" className="mt-1">
                              Expiring Soon
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-400">{med.location}</td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-bold text-emerald-400">{formatCurrency(med.currentStock * med.unitPrice)}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(med.unitPrice)}/unit</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredMedications.length === 0 && (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-slate-400">No medications found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
