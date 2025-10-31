import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { contractAddress, handle, signature } = await request.json();

    if (!contractAddress || !handle) {
      return NextResponse.json(
        { error: 'Contract address and handle are required' },
        { status: 400 }
      );
    }

    // Note: Actual decryption requires client-side wallet signing
    // This endpoint would be used in conjunction with EIP-712 signatures
    return NextResponse.json({
      success: true,
      message: 'Decryption must be performed client-side with wallet signature',
      contractAddress,
      handle,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
