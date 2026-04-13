import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { QuickLabOrder } from './QuickLabOrder';
import { QuickPrescription } from './QuickPrescription';
import { QuickInjectionOrder } from './QuickInjectionOrder';
import { QuickUltrasoundOrder } from './QuickUltrasoundOrder';
import {
  TestTube,
  Pill,
  Syringe,
  Scan,
  Plus,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface QuickOrderPanelProps {
  patientId: string;
  visitId?: string;
  onOrderCreated?: () => void;
}

type OrderType = 'lab' | 'prescription' | 'injection' | 'ultrasound' | null;

export const QuickOrderPanel = ({ patientId, visitId, onOrderCreated }: QuickOrderPanelProps) => {
  const [activeModal, setActiveModal] = useState<OrderType>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const handleOrderCreated = () => {
    setActiveModal(null);
    if (onOrderCreated) {
      onOrderCreated();
    }
    // Refresh recent orders
    loadRecentOrders();
  };

  const loadRecentOrders = async () => {
    // TODO: Implement recent orders loading
  };

  const orderButtons = [
    {
      type: 'lab' as OrderType,
      icon: TestTube,
      label: 'Lab Order',
      color: 'purple',
      description: 'Order lab tests',
    },
    {
      type: 'prescription' as OrderType,
      icon: Pill,
      label: 'Prescription',
      color: 'green',
      description: 'Write prescription',
    },
    {
      type: 'injection' as OrderType,
      icon: Syringe,
      label: 'Injection',
      color: 'blue',
      description: 'Order injection',
    },
    {
      type: 'ultrasound' as OrderType,
      icon: Scan,
      label: 'Ultrasound',
      color: 'orange',
      description: 'Order ultrasound',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-purple-500/50',
      green: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50',
      blue: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/50',
      orange: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {orderButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.type}
                  onClick={() => setActiveModal(button.type)}
                  className={`p-4 rounded-lg border-2 transition-all ${getColorClasses(button.color)}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-6 h-6" />
                    <span className="font-medium text-sm">{button.label}</span>
                    <span className="text-xs opacity-75">{button.description}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {recentOrders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Recent Orders</h4>
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-2 bg-slate-800/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      {order.type === 'lab' && <TestTube className="w-4 h-4 text-purple-400" />}
                      {order.type === 'prescription' && <Pill className="w-4 h-4 text-green-400" />}
                      {order.type === 'injection' && <Syringe className="w-4 h-4 text-blue-400" />}
                      {order.type === 'ultrasound' && <Scan className="w-4 h-4 text-orange-400" />}
                      <span className="text-sm text-slate-300">{order.description}</span>
                    </div>
                    <Badge size="sm" variant={order.status === 'COMPLETED' ? 'success' : 'default'}>
                      {order.status === 'COMPLETED' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'lab'}
        onClose={() => setActiveModal(null)}
        title="Quick Lab Order"
        size="lg"
      >
        <QuickLabOrder
          patientId={patientId}
          visitId={visitId}
          onSuccess={handleOrderCreated}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'prescription'}
        onClose={() => setActiveModal(null)}
        title="Quick Prescription"
        size="lg"
      >
        <QuickPrescription
          patientId={patientId}
          visitId={visitId}
          onSuccess={handleOrderCreated}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'injection'}
        onClose={() => setActiveModal(null)}
        title="Quick Injection Order"
        size="md"
      >
        <QuickInjectionOrder
          patientId={patientId}
          visitId={visitId}
          onSuccess={handleOrderCreated}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'ultrasound'}
        onClose={() => setActiveModal(null)}
        title="Quick Ultrasound Order"
        size="md"
      >
        <QuickUltrasoundOrder
          patientId={patientId}
          visitId={visitId}
          onSuccess={handleOrderCreated}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>
    </>
  );
};
