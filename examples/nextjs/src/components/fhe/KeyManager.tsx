'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function KeyManager() {
  const [keyInfo, setKeyInfo] = useState<any>(null);

  const handleGenerateKeys = () => {
    setKeyInfo({
      status: 'Keys are automatically generated during FHEVM client initialization',
      publicKey: 'Generated and used for encryption',
      privateKey: 'Managed securely in wallet - never exposed',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Card title="Key Management" description="Manage encryption keys">
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Security Note:</strong> Encryption keys are automatically managed by the FHEVM SDK.
            Your private keys never leave your wallet and are used to sign decryption requests via EIP-712.
          </p>
        </div>

        <Button onClick={handleGenerateKeys} className="w-full">
          View Key Information
        </Button>

        {keyInfo && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Public Key:</span>
                  <span className="text-gray-900 font-mono text-xs">Auto-generated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Private Key:</span>
                  <span className="text-gray-900 font-mono text-xs">Wallet-managed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Generated:</span>
                  <span className="text-gray-900 text-xs">{new Date(keyInfo.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs font-medium text-gray-700">Client-Side Only</div>
                <div className="text-xs text-gray-500 mt-1">Keys never transmitted</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl mb-1">✍️</div>
                <div className="text-xs font-medium text-gray-700">EIP-712 Signing</div>
                <div className="text-xs text-gray-500 mt-1">Secure decryption flow</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 text-xs text-gray-600">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Public key: Used to encrypt data before sending to blockchain</li>
            <li>Private key: Stays in your wallet, signs decryption requests</li>
            <li>EIP-712: Standard for typed structured data signing</li>
            <li>Never shared: Private keys never leave your device</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
