'use client';

import { useState } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface BankingExampleProps {
  client: FhevmClient;
}

export default function BankingExample({ client }: BankingExampleProps) {
  const [balance, setBalance] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEncryptBalance = async () => {
    if (!balance) return;

    setIsProcessing(true);
    try {
      const encryptedBalance = client.encrypt64(BigInt(balance));
      setResult(
        `Encrypted Balance:\n` +
        `Original: $${Number(balance).toLocaleString()}\n` +
        `Encrypted: 0x${Buffer.from(encryptedBalance).toString('hex').substring(0, 40)}...\n\n` +
        `This encrypted value can be stored on-chain without revealing your actual balance.`
      );
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEncryptTransfer = async () => {
    if (!transferAmount || !recipient) return;

    setIsProcessing(true);
    try {
      const encryptedAmount = client.encrypt64(BigInt(transferAmount));
      setResult(
        `Private Transfer Prepared:\n` +
        `To: ${recipient.substring(0, 10)}...${recipient.substring(recipient.length - 8)}\n` +
        `Amount: $${Number(transferAmount).toLocaleString()} (encrypted)\n` +
        `Encrypted Data: 0x${Buffer.from(encryptedAmount).toString('hex').substring(0, 40)}...\n\n` +
        `Send this to your smart contract. Neither the amount nor recipient balance will be publicly visible.`
      );
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card title="🏦 Private Banking Example" description="Encrypt financial transactions for privacy">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Encrypt Account Balance</h4>
          <Input
            type="number"
            label="Account Balance (USD)"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Enter amount"
            helperText="Your balance will be encrypted before storing on-chain"
          />
          <Button
            onClick={handleEncryptBalance}
            isLoading={isProcessing}
            disabled={!balance}
            className="w-full"
          >
            Encrypt Balance
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h4 className="font-semibold text-gray-900">Private Transfer</h4>
          <Input
            type="text"
            label="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
          <Input
            type="number"
            label="Transfer Amount (USD)"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Enter amount"
            helperText="Amount will be encrypted - no one can see transaction values"
          />
          <Button
            onClick={handleEncryptTransfer}
            isLoading={isProcessing}
            disabled={!transferAmount || !recipient}
            className="w-full"
          >
            Prepare Private Transfer
          </Button>
        </div>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Result:</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Privacy Benefits:</strong>
          </p>
          <ul className="mt-2 text-sm text-green-700 space-y-1 list-disc list-inside">
            <li>Account balances remain confidential on-chain</li>
            <li>Transfer amounts are encrypted</li>
            <li>Only you can decrypt your balance with your private key</li>
            <li>Regulatory compliance with full auditability</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
