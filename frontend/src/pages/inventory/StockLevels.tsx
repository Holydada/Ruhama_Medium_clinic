import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Search, Package, AlertTriangle } from 'lucide-react';

export const StockLevels = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStockLevels();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredItems(items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const loadStockLevels = async () => {
    try {
      const response = await api.get('/inventory/stock-levels');
      setItems(response.data.data);
      setFilteredItems(response.data.data);
    } catch (error) {
      toast.error('Failed to load stock levels');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-500/20 text-red-400' };
    if (quantity <= minLevel) return { label: 'Low Stock', color: 'bg-yellow-500/20 text-yellow-400' };
    return { label: 'In Stock', color: 'bg-green-500/20 text-green-400' };
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/inventory-dashboard')} variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          <h1 className="text-3xl font-bold text-slate-50">Stock Levels</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-slate-400" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search items..." className="flex-1" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader><CardTitle>All Items ({filteredItems.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems.map(item => {
                const status = getStockStatus(item.quantity, item.minLevel);
                return (
                  <div key={item.id} className="p-4 border border-slate-700 rounded hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Package className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-50">{item.name}</p>
                          <p className="text-sm text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-50">{item.quantity}</p>
                          <p className="text-sm text-slate-400">{item.unit}</p>
                        </div>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    </div>
                    {item.batches && item.batches.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-400 mb-2">Batches:</p>
                        <div className="flex gap-2 flex-wrap">
                          {item.batches.map((batch: any) => (
                            <div key={batch.id} className="text-xs p-2 bg-slate-800 rounded">
                              <span className="text-slate-300">{batch.batchNumber}</span>
                              <span className="text-slate-500 ml-2">Exp: {new Date(batch.expiryDate).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
