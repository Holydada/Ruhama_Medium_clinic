import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Search, Send, FileText, User, Building2, AlertCircle } from 'lucide-react';
import { toast } from '../../lib/toast';

interface Referral {
  id: string;
  referralNumber: string;
  patientName: string;
  cardNumber: string;
  age: number;
  gender: string;
  referredTo: string;
  specialty: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  referredBy: string;
  referralDate: string;
  notes: string;
}

export const ReferralManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    patientSearch: '',
    selectedPatient: null as any,
    referredTo: '',
    specialty: '',
    reason: '',
    urgency: 'routine',
    clinicalSummary: '',
    investigations: '',
    currentMedications: '',
    allergies: '',
    vitalSigns: '',
    specialInstructions: ''
  });

  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      referralNumber: 'REF-2026-001',
      patientName: 'አበበ ተስፋዬ',
      cardNumber: 'RH-2026-001',
      age: 45,
      gender: 'Male',
      referredTo: 'Black Lion Hospital',
      specialty: 'Cardiology',
      reason: 'Suspected coronary artery disease',
      urgency: 'urgent',
      status: 'pending',
      referredBy: 'Dr. Sarah',
      referralDate: '2026-03-21',
      notes: 'Patient experiencing chest pain'
    },
    {
      id: '2',
      referralNumber: 'REF-2026-002',
      patientName: 'ፋጡማ አህመድ',
      cardNumber: 'RH-2026-002',
      age: 32,
      gender: 'Female',
      referredTo: 'St. Paul Hospital',
      specialty: 'Obstetrics',
      reason: 'High-risk pregnancy monitoring',
      urgency: 'routine',
      status: 'accepted',
      referredBy: 'Dr. John',
      referralDate: '2026-03-20',
      notes: 'Gestational diabetes'
    }
  ]);

  const specialties = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Obstetrics & Gynecology',
    'Pediatrics',
    'Oncology',
    'Dermatology',
    'Ophthalmology',
    'ENT',
    'Psychiatry',
    'Endocrinology',
    'Gastroenterology'
  ];

  const hospitals = [
    'Black Lion Hospital',
    'St. Paul Hospital',
    'Tikur Anbessa Hospital',
    'Zewditu Hospital',
    'Yekatit 12 Hospital',
    'Gandhi Memorial Hospital',
    'Hayat Hospital',
    'Myungsung Hospital'
  ];

  const getUrgencyVariant = (urgency: string): 'danger' | 'warning' | 'default' => {
    switch (urgency) {
      case 'emergency': return 'danger';
      case 'urgent': return 'warning';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = 
      ref.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referralNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ref.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Referral created successfully.');
    setShowCreateModal(false);
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    accepted: referrals.filter(r => r.status === 'accepted').length,
    urgent: referrals.filter(r => r.urgency === 'urgent' || r.urgency === 'emergency').length
  };

  if (showCreateModal) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            ← Back to Referrals
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Referral</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
              <Input
                icon={Search}
                placeholder="Search patient by name or card number..."
                value={formData.patientSearch}
                onChange={(e) => setFormData({ ...formData, patientSearch: e.target.value })}
              />
            </div>

            {/* Referral Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Referral Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Referred To (Hospital)"
                  required
                  value={formData.referredTo}
                  onChange={(e) => setFormData({ ...formData, referredTo: e.target.value })}
                >
                  <option value="">Select hospital...</option>
                  {hospitals.map(hospital => (
                    <option key={hospital} value={hospital}>{hospital}</option>
                  ))}
                </Select>

                <Select
                  label="Specialty"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                >
                  <option value="">Select specialty...</option>
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </Select>

                <Select
                  label="Urgency"
                  required
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </Select>
              </div>
            </div>

            {/* Clinical Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Clinical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Referral <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Brief reason for referral..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Summary
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={formData.clinicalSummary}
                    onChange={(e) => setFormData({ ...formData, clinicalSummary: e.target.value })}
                    placeholder="Patient history, symptoms, examination findings..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investigations Done
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    value={formData.investigations}
                    onChange={(e) => setFormData({ ...formData, investigations: e.target.value })}
                    placeholder="Lab tests, imaging, etc..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    placeholder="List current medications..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <Input
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="Known allergies..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vital Signs
                    </label>
                    <Input
                      value={formData.vitalSigns}
                      onChange={(e) => setFormData({ ...formData, vitalSigns: e.target.value })}
                      placeholder="BP, Pulse, Temp..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="Any special instructions for the receiving facility..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send Referral
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
          <p className="text-gray-600 mt-1">Manage patient referrals to specialists</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          New Referral
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'accepted' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('accepted')}
            >
              Accepted
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </Button>
          </div>
        </div>
      </Card>

      {/* Referrals List */}
      <div className="space-y-4">
        {filteredReferrals.map((referral) => (
          <Card key={referral.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{referral.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      {referral.cardNumber} • {referral.age}y, {referral.gender}
                    </p>
                  </div>
                  <Badge variant={getUrgencyVariant(referral.urgency)}>
                    {referral.urgency.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusVariant(referral.status)}>
                    {referral.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Referral Number</p>
                    <p className="font-medium text-gray-900">{referral.referralNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Referred To</p>
                    <p className="font-medium text-gray-900">{referral.referredTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Specialty</p>
                    <p className="font-medium text-gray-900">{referral.specialty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{referral.referralDate}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Reason:</strong> {referral.reason}
                  </p>
                  {referral.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Notes:</strong> {referral.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReferrals.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No referrals found</p>
        </Card>
      )}
    </div>
  );
};
