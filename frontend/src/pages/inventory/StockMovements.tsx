import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Search, Calendar, ArrowRight } from 'lucide-react';

export default function StockMovements() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadMovements();
  }, [dateFilter]);

  const loadMovements = async () => {
    try {
      const response = await api.get('/api/v1/inventory/movements', {
        params: { date: dateFilter || undefined }
      });
      setMovements(response.data.data);
    } catch (error) {
      console.error('Failed to load movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovements = movements.filter(m =>
    m.item?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'IN': return 'success';
      case 'OUT': return 'warning';
      case 'TRANSFER': return 'default';
      case 'ADJUSTMENT': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Stock Movements</h1>
          <p className="text-slate-400 mt-1">Complete audit trail of inventory changes</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search items or movement type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800">
              {filteredMovements.map((movement) => (
                <div key={movement.id} className="p-4 hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getMovementColor(movement.type)}>
                          {movement.type}
                        </Badge>
                        <span className="text-slate-50 font-medium">{movement.item?.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Quantity: {movement.quantity}</span>
                        {movement.fromLocation && movement.toLocation && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-2">
                              <span>{movement.fromLocation}</span>
                              <ArrowRight className="w-3 h-3" />
                              <span>{movement.toLocation}</span>
                            </div>
                          </>
                        )}
                        <span>•</span>
                        <span>By: {movement.user?.firstName} {movement.user?.lastName}</span>
                      </div>

                      {movement.notes && (
                        <p className="text-sm text-slate-400 mt-2">{movement.notes}</p>
                      )}
                    </div>

                    <div className="text-right text-sm text-slate-400">
                      <div>{new Date(movement.createdAt).toLocaleDateString()}</div>
                      <div>{new Date(movement.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredMovements.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  No movements found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
