import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FileText, Download } from 'lucide-react';
import { ModuleSubnav } from '../../components/layout/ModuleSubnav';
import { financeModuleSubnav } from '../../navigation/moduleSubnavItems';

export const InvoiceGeneration: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    services: [{ name: '', amount: 0 }],
    taxRate: 15
  });

  const subtotal = formData.services.reduce((sum, s) => sum + s.amount, 0);
  const tax = (subtotal * formData.taxRate) / 100;
  const total = subtotal + tax;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Invoice Generation</h1>

      <ModuleSubnav items={financeModuleSubnav} ariaLabel="Finance sections" />

      <Card className="p-6 mt-4">
        <div className="space-y-4">
          <Input
            label="Patient Name"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
          />

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
            {formData.services.map((service, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
                <Input placeholder="Service name" />
                <Input type="number" placeholder="Amount" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2">Add Service</Button>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({formData.taxRate}%):</span>
                <span className="font-medium">{tax.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">{total.toFixed(2)} ETB</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="primary" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
