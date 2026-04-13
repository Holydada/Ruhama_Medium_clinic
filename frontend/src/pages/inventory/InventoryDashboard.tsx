import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Activity, AlertTriangle, Package, TrendingDown, Calendar, Plus, RefreshCw } from 'lucide-react';

export const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, expiringSoon: 0, outOfStock: 0 });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [expiringItems, setExpiringItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsResp, lowStockResp, expiringResp] = await Promise.all([
        api.get('/inventory/stats'),
        api.get('/inventory/low-stock'),
        api.get('/inventory/expiring-soon'),
      ]);
      setStats(statsResp.data.data);
      setLowStockItems(lowStockResp.data.data);
      setExpiringItems(expiringResp.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><Activity className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-50">Inventory Dashboard</h1>
          <div className="flex gap-3">
            <Button onClick={loadDashboard} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
            <Button onClick={() => navigate('/inventory/receive')} variant="primary"><Plus className="w-4 h-4 mr-2" />Receive Delivery</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Items</p>
                  <p className="text-3xl font-bold text-slate-50 mt-1">{stats.totalItems}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg"><Package className="w-6 h-6 text-blue-500" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Low Stock</p>
                  <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.lowStock}</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg"><TrendingDown className="w-6 h-6 text-yellow-500" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Expiring Soon</p>
                  <p className="text-3xl font-bold text-orange-500 mt-1">{stats.expiringSoon}</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-lg"><Calendar className="w-6 h-6 text-orange-500" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{stats.outOfStock}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingDown className="w-5 h-5 text-yellow-500" />Low Stock Items</CardTitle></CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No low stock items</p>
              ) : (
                <div className="space-y-2">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="p-3 border border-yellow-500 bg-yellow-950/10 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-50">{item.name}</p>
                          <p className="text-sm text-slate-400">Current: {item.quantity} {item.unit}</p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400">Low Stock</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" />Expiring Soon</CardTitle></CardHeader>
            <CardContent>
              {expiringItems.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No items expiring soon</p>
              ) : (
                <div className="space-y-2">
                  {expiringItems.map(item => (
                    <div key={item.id} className="p-3 border border-orange-500 bg-orange-950/10 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-50">{item.name}</p>
                          <p className="text-sm text-slate-400">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400">Expiring</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button onClick={() => navigate('/inventory/receive')} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Plus className="w-6 h-6" /><span className="text-sm">Receive Delivery</span>
              </Button>
              <Button onClick={() => navigate('/inventory/transfer')} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Package className="w-6 h-6" /><span className="text-sm">Stock Transfer</span>
              </Button>
              <Button onClick={() => navigate('/inventory/adjustment')} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <TrendingDown className="w-6 h-6" /><span className="text-sm">Adjustment</span>
              </Button>
              <Button onClick={() => navigate('/inventory/levels')} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Package className="w-6 h-6" /><span className="text-sm">Stock Levels</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
