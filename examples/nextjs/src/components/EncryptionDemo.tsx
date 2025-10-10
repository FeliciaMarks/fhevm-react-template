'use client';

import { useState } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import { encryptRating, encryptPercentage, toHexString } from '@fhevm/sdk';

interface EncryptionDemoProps {
  client: FhevmClient;
}

export default function EncryptionDemo({ client }: EncryptionDemoProps) {
  const [rating, setRating] = useState<number>(5);
  const [percentage, setPercentage] = useState<number>(50);
  const [customValue, setCustomValue] = useState<string>('');
  const [encryptedResult, setEncryptedResult] = useState<string>('');
  const [resultType, setResultType] = useState<string>('');

  const handleEncryptRating = () => {
    try {
      const encrypted = encryptRating(client, rating);
      setEncryptedResult(toHexString(encrypted));
      setResultType(`euint8 (Rating: ${rating})`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEncryptPercentage = () => {
    try {
      const encrypted = encryptPercentage(client, percentage);
      setEncryptedResult(toHexString(encrypted));
      setResultType(`euint8 (Percentage: ${percentage}%)`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEncryptCustom = (bitSize: 8 | 16 | 32 | 64) => {
    try {
      const value = parseInt(customValue);
      if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
      }

      let encrypted: Uint8Array;
      switch (bitSize) {
        case 8:
          encrypted = client.encrypt8(value);
          break;
        case 16:
          encrypted = client.encrypt16(value);
          break;
        case 32:
          encrypted = client.encrypt32(value);
          break;
        case 64:
          encrypted = client.encrypt64(value);
          break;
      }

      setEncryptedResult(toHexString(encrypted));
      setResultType(`euint${bitSize} (Value: ${value})`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Encryption */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Encrypt Rating (1-10)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating: {rating}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <button
            onClick={handleEncryptRating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Encrypt Rating
          </button>
        </div>
      </div>

      {/* Percentage Encryption */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Encrypt Percentage (0-100)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentage: {percentage}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <button
            onClick={handleEncryptPercentage}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Encrypt Percentage
          </button>
        </div>
      </div>

      {/* Custom Value Encryption */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Encrypt Custom Value</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Value
            </label>
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Enter a number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleEncryptCustom(8)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              euint8
            </button>
            <button
              onClick={() => handleEncryptCustom(16)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              euint16
            </button>
            <button
              onClick={() => handleEncryptCustom(32)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              euint32
            </button>
            <button
              onClick={() => handleEncryptCustom(64)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              euint64
            </button>
          </div>
        </div>
      </div>

      {/* Encrypted Result */}
      {encryptedResult && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Encrypted Result</h3>
          <p className="text-sm text-gray-600 mb-3">Type: {resultType}</p>
          <div className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
            <code className="text-xs text-gray-800 break-all">{encryptedResult}</code>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            This encrypted value can now be sent to your smart contract
          </p>
        </div>
      )}
    </div>
  );
}
