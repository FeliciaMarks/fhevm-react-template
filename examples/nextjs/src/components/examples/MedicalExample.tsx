'use client';

import { useState } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface MedicalExampleProps {
  client: FhevmClient;
}

export default function MedicalExample({ client }: MedicalExampleProps) {
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEncryptVitals = async () => {
    if (!bloodPressure && !heartRate && !glucoseLevel) return;

    setIsProcessing(true);
    try {
      const encrypted: any = {};
      let resultText = 'Encrypted Medical Data:\n\n';

      if (bloodPressure) {
        encrypted.bp = client.encrypt16(Number(bloodPressure));
        resultText += `Blood Pressure: ${bloodPressure} mmHg\n`;
        resultText += `Encrypted: 0x${Buffer.from(encrypted.bp).toString('hex').substring(0, 30)}...\n\n`;
      }

      if (heartRate) {
        encrypted.hr = client.encrypt8(Number(heartRate));
        resultText += `Heart Rate: ${heartRate} bpm\n`;
        resultText += `Encrypted: 0x${Buffer.from(encrypted.hr).toString('hex').substring(0, 30)}...\n\n`;
      }

      if (glucoseLevel) {
        encrypted.glucose = client.encrypt16(Number(glucoseLevel));
        resultText += `Glucose Level: ${glucoseLevel} mg/dL\n`;
        resultText += `Encrypted: 0x${Buffer.from(encrypted.glucose).toString('hex').substring(0, 30)}...\n\n`;
      }

      resultText += 'This sensitive health data is now encrypted and can be safely stored on-chain.\n';
      resultText += 'Only authorized parties with proper keys can access the actual values.';

      setResult(resultText);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = () => {
    setBloodPressure('');
    setHeartRate('');
    setGlucoseLevel('');
    setResult('');
  };

  return (
    <Card title="🏥 Private Medical Records" description="Encrypt sensitive health data">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Enter Vital Signs</h4>

          <Input
            type="number"
            label="Blood Pressure (Systolic mmHg)"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="e.g., 120"
            helperText="Normal range: 90-120 mmHg"
          />

          <Input
            type="number"
            label="Heart Rate (bpm)"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="e.g., 75"
            helperText="Normal range: 60-100 bpm"
          />

          <Input
            type="number"
            label="Glucose Level (mg/dL)"
            value={glucoseLevel}
            onChange={(e) => setGlucoseLevel(e.target.value)}
            placeholder="e.g., 100"
            helperText="Normal fasting range: 70-100 mg/dL"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleEncryptVitals}
              isLoading={isProcessing}
              disabled={!bloodPressure && !heartRate && !glucoseLevel}
              className="flex-1"
            >
              Encrypt Health Data
            </Button>
            <Button
              onClick={handleClearData}
              variant="outline"
              disabled={isProcessing}
            >
              Clear
            </Button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Encrypted Data:</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800">
            <strong>HIPAA Compliance Benefits:</strong>
          </p>
          <ul className="mt-2 text-sm text-purple-700 space-y-1 list-disc list-inside">
            <li>Patient data encrypted at all times</li>
            <li>Immutable audit trail on blockchain</li>
            <li>Granular access control via decryption permissions</li>
            <li>Research on encrypted data without exposing patient privacy</li>
            <li>Secure sharing between healthcare providers</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <strong>Use Case:</strong> Medical institutions can store patient vitals on-chain,
            run analytics on encrypted data, and only decrypt when necessary with proper authorization.
            This enables privacy-preserving medical research and secure health record management.
          </p>
        </div>
      </div>
    </Card>
  );
}
