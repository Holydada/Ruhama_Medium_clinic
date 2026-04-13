import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DollarSign, Check } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { receptionModuleSubnav } from '../../navigation/moduleSubnavItems';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export const ServiceSelection: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services: Service[] = [
    { id: '1', name: 'Consultation', category: 'Medical', price: 200, description: 'General consultation' },
    { id: '2', name: 'Ultrasound', category: 'Imaging', price: 500, description: 'Ultrasound examination' },
    { id: '3', name: 'X-Ray', category: 'Imaging', price: 300, description: 'X-ray imaging' },
    { id: '4', name: 'ECG', category: 'Diagnostic', price: 150, description: 'Electrocardiogram' },
    { id: '5', name: 'Blood Test', category: 'Laboratory', price: 250, description: 'Complete blood count' }
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const total = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Selection</h1>

      <ModuleSubnav items={receptionModuleSubnav} ariaLabel="Reception workflow" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-4">
        {services.map(service => (
          <Card
            key={service.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedServices.includes(service.id)
                ? 'border-2 border-blue-500 bg-blue-50'
                : 'border-2 border-gray-200'
            }`}
            onClick={() => toggleService(service.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
                <Badge variant="default" className="mt-2">{service.category}</Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{service.price} ETB</p>
                {selectedServices.includes(service.id) && (
                  <Check className="w-6 h-6 text-blue-600 mt-2" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Selected Services</p>
            <p className="text-2xl font-bold text-gray-900">{selectedServices.length}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-blue-600">{total} ETB</p>
          </div>
          <Button variant="primary" disabled={selectedServices.length === 0}>
            Proceed to Payment
          </Button>
        </div>
      </Card>
    </div>
  );
};
