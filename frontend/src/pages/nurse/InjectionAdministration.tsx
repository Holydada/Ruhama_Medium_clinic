import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { ArrowLeft, Save, AlertTriangle, CheckCircle2, Syringe } from 'lucide-react';

interface InjectionOrder {
  id: string;
  orderNumber: string;
  medicationName: string;
  dosage: string;
  route: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  patient: {
    fullName: string;
    cardNumber: string;
    sex: string;
    dateOfBirth: string;
    allergies?: string;
  };
  orderedBy: {
    fullName: string;
  };
}

export const InjectionAdministration = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<InjectionOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 5 Rights Check
  const [rightPatientChecked, setRightPatientChecked] = useState(false);
  const [rightMedicationChecked, setRightMedicationChecked] = useState(false);
  const [rightDoseChecked, setRightDoseChecked] = useState(false);
  const [rightRouteChecked, setRightRouteChecked] = useState(false);
  const [rightTimeChecked, setRightTimeChecked] = useState(false);

  // Administration Details
  const [site, setSite] = useState('');
  const [route, setRoute] = useState('IM');
  const [batchNumber, setBatchNumber] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Vitals Before
  const [bpBefore, setBpBefore] = useState('');
  const [pulseBefore, setPulseBefore] = useState('');
  const [tempBefore, setTempBefore] = useState('');
  const [spo2Before, setSpo2Before] = useState('');

  // Vitals After
  const [bpAfter, setBpAfter] = useState('');
  const [pulseAfter, setPulseAfter] = useState('');
  const [tempAfter, setTempAfter] = useState('');
  const [spo2After, setSpo2After] = useState('');

  // Adverse Events
  const [adverseReaction, setAdverseReaction] = useState(false);
  const [reactionType, setReactionType] = useState('');
  const [reactionSeverity, setReactionSeverity] = useState('');
  const [reactionDetails, setReactionDetails] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  // Consumables
  const [syringeUsed, setSyringeUsed] = useState(true);
  const [needleUsed, setNeedleUsed] = useState(true);
  const [alcoholSwabUsed, setAlcoholSwabUsed] = useState(true);
  const [glovesUsed, setGlovesUsed] = useState(true);

  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/injections/${id}`);
      setOrder(response.data.data);
      setRoute(response.data.data.route);
    } catch (error) {
      toast.error('Failed to load injection order');
    } finally {
      setLoading(false);
    }
  };

  const allRightsChecked = 
    rightPatientChecked &&
    rightMedicationChecked &&
    rightDoseChecked &&
    rightRouteChecked &&
    rightTimeChecked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRightsChecked) {
      toast.error('All 5 Rights must be checked before administration');
      return;
    }

    if (!site || !batchNumber) {
      toast.error('Site and batch number are required');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/injections/${id}/administer`, {
        rightPatientChecked,
        rightMedicationChecked,
        rightDoseChecked,
        rightRouteChecked,
        rightTimeChecked,
        site,
        route,
        batchNumber,
        lotNumber,
        expiryDate: expiryDate || undefined,
        vitalsBefore: {
          bp: bpBefore,
          pulse: pulseBefore ? parseInt(pulseBefore) : undefined,
          temp: tempBefore ? parseFloat(tempBefore) : undefined,
          spo2: spo2Before ? parseInt(spo2Before) : undefined,
        },
        vitalsAfter: {
          bp: bpAfter,
          pulse: pulseAfter ? parseInt(pulseAfter) : undefined,
          temp: tempAfter ? parseFloat(tempAfter) : undefined,
          spo2: spo2After ? parseInt(spo2After) : undefined,
        },
        adverseReaction,
        reactionType: adverseReaction ? reactionType : undefined,
        reactionSeverity: adverseReaction ? reactionSeverity : undefined,
        reactionDetails: adverseReaction ? reactionDetails : undefined,
        actionTaken: adverseReaction ? actionTaken : undefined,
        consumablesUsed: [
          { item: 'Syringe', quantity: syringeUsed ? 1 : 0 },
          { item: 'Needle', quantity: needleUsed ? 1 : 0 },
          { item: 'Alcohol Swab', quantity: alcoholSwabUsed ? 1 : 0 },
          { item: 'Gloves', quantity: glovesUsed ? 1 : 0 },
        ],
        notes,
      });

      toast.success('Injection administered successfully');
      navigate('/nurse/injection-queue');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to administer injection');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-400">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/nurse/injection-queue')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Queue
          </Button>
          <h1 className="text-3xl font-bold text-slate-50">Injection Administration</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-slate-50 font-medium">{order.patient.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Card Number</p>
                  <p className="text-slate-50 font-medium">{order.patient.cardNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Sex</p>
                  <p className="text-slate-50 font-medium">{order.patient.sex}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Age</p>
                  <p className="text-slate-50 font-medium">
                    {new Date().getFullYear() - new Date(order.patient.dateOfBirth).getFullYear()} years
                  </p>
                </div>
              </div>
              {order.patient.allergies && (
                <Alert variant="warning">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Allergies:</strong> {order.patient.allergies}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Medication</p>
                  <p className="text-slate-50 font-medium">{order.medicationName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Dosage</p>
                  <p className="text-slate-50 font-medium">{order.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Route</p>
                  <p className="text-slate-50 font-medium">{order.route}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Ordered By</p>
                  <p className="text-slate-50 font-medium">{order.orderedBy.fullName}</p>
                </div>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm text-slate-400">Notes</p>
                  <p className="text-slate-300">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5 Rights Check */}
          <Card className={allRightsChecked ? 'border-green-500' : 'border-yellow-500'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="w-5 h-5" />
                5 Rights Verification
                {allRightsChecked && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-700 rounded hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightPatientChecked}
                  onChange={(e) => setRightPatientChecked(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-medium">Right Patient - Verified patient identity</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-700 rounded hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightMedicationChecked}
                  onChange={(e) => setRightMedicationChecked(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-medium">Right Medication - Confirmed medication name</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-700 rounded hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightDoseChecked}
                  onChange={(e) => setRightDoseChecked(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-medium">Right Dose - Verified dosage amount</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-700 rounded hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightRouteChecked}
                  onChange={(e) => setRightRouteChecked(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-medium">Right Route - Confirmed administration route</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-700 rounded hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightTimeChecked}
                  onChange={(e) => setRightTimeChecked(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-medium">Right Time - Verified timing is appropriate</span>
              </label>
            </CardContent>
          </Card>

          {/* Administration Details */}
          <Card>
            <CardHeader>
              <CardTitle>Administration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Injection Site <span className="text-red-500">*</span>
                  </label>
                  <Select value={site} onValueChange={setSite} required>
                    <option value="">Select site...</option>
                    <option value="LEFT_DELTOID">Left Deltoid</option>
                    <option value="RIGHT_DELTOID">Right Deltoid</option>
                    <option value="LEFT_DORSOGLUTEAL">Left Dorsogluteal</option>
                    <option value="RIGHT_DORSOGLUTEAL">Right Dorsogluteal</option>
                    <option value="LEFT_VASTUS_LATERALIS">Left Vastus Lateralis</option>
                    <option value="RIGHT_VASTUS_LATERALIS">Right Vastus Lateralis</option>
                    <option value="LEFT_VENTROGLUTEAL">Left Ventrogluteal</option>
                    <option value="RIGHT_VENTROGLUTEAL">Right Ventrogluteal</option>
                    <option value="ABDOMEN">Abdomen</option>
                    <option value="LEFT_THIGH">Left Thigh</option>
                    <option value="RIGHT_THIGH">Right Thigh</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Route</label>
                  <Select value={route} onValueChange={setRoute}>
                    <option value="IM">Intramuscular (IM)</option>
                    <option value="IV">Intravenous (IV)</option>
                    <option value="SC">Subcutaneous (SC)</option>
                    <option value="ID">Intradermal (ID)</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Batch Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="Enter batch number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Lot Number</label>
                  <Input
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="Enter lot number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitals Before */}
          <Card>
            <CardHeader>
              <CardTitle>Vitals Before Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">BP</label>
                  <Input
                    value={bpBefore}
                    onChange={(e) => setBpBefore(e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pulse</label>
                  <Input
                    type="number"
                    value={pulseBefore}
                    onChange={(e) => setPulseBefore(e.target.value)}
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Temp (°C)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={tempBefore}
                    onChange={(e) => setTempBefore(e.target.value)}
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">SpO2 (%)</label>
                  <Input
                    type="number"
                    value={spo2Before}
                    onChange={(e) => setSpo2Before(e.target.value)}
                    placeholder="98"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitals After */}
          <Card>
            <CardHeader>
              <CardTitle>Vitals After Administration (15-30 min)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">BP</label>
                  <Input
                    value={bpAfter}
                    onChange={(e) => setBpAfter(e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pulse</label>
                  <Input
                    type="number"
                    value={pulseAfter}
                    onChange={(e) => setPulseAfter(e.target.value)}
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Temp (°C)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={tempAfter}
                    onChange={(e) => setTempAfter(e.target.value)}
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">SpO2 (%)</label>
                  <Input
                    type="number"
                    value={spo2After}
                    onChange={(e) => setSpo2After(e.target.value)}
                    placeholder="98"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adverse Events */}
          <Card className={adverseReaction ? 'border-red-500' : ''}>
            <CardHeader>
              <CardTitle>Adverse Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={adverseReaction}
                  onChange={(e) => setAdverseReaction(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 font-medium">Adverse Reaction Observed</span>
              </label>

              {adverseReaction && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Reaction Type</label>
                      <Input
                        value={reactionType}
                        onChange={(e) => setReactionType(e.target.value)}
                        placeholder="e.g., Rash, Swelling, Anaphylaxis"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
                      <Select value={reactionSeverity} onValueChange={setReactionSeverity}>
                        <option value="">Select severity...</option>
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Reaction Details</label>
                    <Textarea
                      value={reactionDetails}
                      onChange={(e) => setReactionDetails(e.target.value)}
                      rows={2}
                      placeholder="Describe the adverse reaction..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Action Taken</label>
                    <Textarea
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      rows={2}
                      placeholder="Describe actions taken to manage the reaction..."
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Consumables */}
          <Card>
            <CardHeader>
              <CardTitle>Consumables Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={syringeUsed}
                    onChange={(e) => setSyringeUsed(e.target.checked)}
                  />
                  <span className="text-slate-300">Syringe</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={needleUsed}
                    onChange={(e) => setNeedleUsed(e.target.checked)}
                  />
                  <span className="text-slate-300">Needle</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alcoholSwabUsed}
                    onChange={(e) => setAlcoholSwabUsed(e.target.checked)}
                  />
                  <span className="text-slate-300">Alcohol Swab</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={glovesUsed}
                    onChange={(e) => setGlovesUsed(e.target.checked)}
                  />
                  <span className="text-slate-300">Gloves</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional observations or notes..."
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/nurse/injection-queue')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={submitting || !allRightsChecked}
            >
              {submitting ? 'Administering...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Administer Injection
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
