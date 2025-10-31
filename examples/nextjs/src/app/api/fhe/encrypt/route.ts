import { NextRequest, NextResponse } from 'next/server';
import { FhevmClient } from '@fhevm/sdk';

export async function POST(request: NextRequest) {
  try {
    const { value, type = 'uint32' } = await request.json();

    if (value === undefined || value === null) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }

    const client = new FhevmClient({
      network: {
        chainId: 11155111,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
      },
    });

    await client.init();

    let encrypted;
    switch (type) {
      case 'uint8':
        encrypted = client.encrypt8(Number(value));
        break;
      case 'uint16':
        encrypted = client.encrypt16(Number(value));
        break;
      case 'uint32':
        encrypted = client.encrypt32(Number(value));
        break;
      case 'uint64':
        encrypted = client.encrypt64(BigInt(value));
        break;
      case 'bool':
        encrypted = client.encryptBool(Boolean(value));
        break;
      default:
        return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      encrypted,
      type,
      originalValue: value,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
