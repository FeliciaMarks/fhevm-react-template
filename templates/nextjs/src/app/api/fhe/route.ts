import { NextRequest, NextResponse } from 'next/server';
import { FhevmClient } from '@fhevm/sdk';

export async function POST(request: NextRequest) {
  try {
    const { operation, value, type } = await request.json();

    const client = new FhevmClient({
      network: {
        chainId: 11155111,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
      },
    });

    await client.init();

    let result;
    switch (operation) {
      case 'encrypt':
        switch (type) {
          case 'uint8':
            result = client.encrypt8(Number(value));
            break;
          case 'uint16':
            result = client.encrypt16(Number(value));
            break;
          case 'uint32':
            result = client.encrypt32(Number(value));
            break;
          case 'uint64':
            result = client.encrypt64(BigInt(value));
            break;
          case 'bool':
            result = client.encryptBool(Boolean(value));
            break;
          default:
            return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
        }
        break;
      default:
        return NextResponse.json({ error: 'Unsupported operation' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
