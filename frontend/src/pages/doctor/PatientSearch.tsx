import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, User, Calendar } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  cardNumber: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

export const PatientSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'አበበ ተስፋዬ',
      cardNumber: 'RH-2026-001',
      age: 45,
      gender: 'Male',
      phone: '+251911234567',
      lastVisit: '2026-03-21',
      status: 'active'
    },
    {
      id: '2',
      name: 'ፋጡማ አህመድ',
      cardNumber: 'RH-2026-002',
      age: 32,
      gender: 'Female',
      phone: '+251911234568',
      lastVisit: '2026-03-20',
      status: 'active'
    }
  ]);

  const filteredPatients = patients.filter(patient => {
    const term = searchTerm.toLowerCase();
    switch (searchBy) {
      case 'name':
        return patient.name.toLowerCase().includes(term);
      case 'card':
        return patient.cardNumber.toLowerCase().includes(term);
      case 'phone':
        return patient.phone.includes(term);
      default:
        return true;
    }
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Search</h1>

      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="name">By Name</option>
            <option value="card">By Card Number</option>
            <option value="phone">By Phone</option>
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">
                    {patient.cardNumber} • {patient.age}y, {patient.gender}
                  </p>
                  <p className="text-sm text-gray-600">{patient.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={patient.status === 'active' ? 'success' : 'default'}>
                  {patient.status}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Last visit: {patient.lastVisit}
                </p>
              </div>
              <Button variant="primary">View Chart</Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No patients found</p>
        </Card>
      )}
    </div>
  );
};
