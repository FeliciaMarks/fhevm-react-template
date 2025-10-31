'use client';

import { useState } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ComputationDemoProps {
  client: FhevmClient;
}

export default function ComputationDemo({ client }: ComputationDemoProps) {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<'add' | 'multiply' | 'compare'>('add');
  const [result, setResult] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);

  const handleCompute = async () => {
    if (!value1 || !value2) return;

    setIsComputing(true);
    try {
      const encrypted1 = client.encrypt32(Number(value1));
      const encrypted2 = client.encrypt32(Number(value2));

      setResult(
        `Encrypted values ready for on-chain computation:\n` +
        `Value 1: 0x${Buffer.from(encrypted1).toString('hex').substring(0, 20)}...\n` +
        `Value 2: 0x${Buffer.from(encrypted2).toString('hex').substring(0, 20)}...\n` +
        `Operation: ${operation.toUpperCase()}\n\n` +
        `Note: Actual computation happens on-chain via smart contract`
      );
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card title="Homomorphic Computation" description="Perform operations on encrypted data">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Value 1"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Enter first value"
          />
          <Input
            type="number"
            label="Value 2"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Enter second value"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <div className="flex gap-2">
            {(['add', 'multiply', 'compare'] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  operation === op
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!value1 || !value2}
          className="w-full"
        >
          Compute (Prepare for On-Chain)
        </Button>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Result:</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Homomorphic operations (addition, multiplication, comparison)
            are performed on encrypted values on-chain. The smart contract receives encrypted
            inputs and produces encrypted outputs without ever seeing the plaintext values.
          </p>
        </div>
      </div>
    </Card>
  );
}
