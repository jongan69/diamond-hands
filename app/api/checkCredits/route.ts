import { NextResponse } from 'next/server';
import ApiframeClient from 'apiframe-js';

const APIFRAME_API_KEY = process.env.APIFRAME_API_KEY; // Ensure this is set in your environment variables
const client = new ApiframeClient(APIFRAME_API_KEY, true);

export async function GET() {
  try {
    const accountInfo = await client.account();
    return NextResponse.json({ credits: accountInfo.credits });
  } catch (error: any) {
    console.error('Error fetching account info:', error);
    return NextResponse.json({ error: 'Failed to fetch account info' }, { status: 500 });
  }
} 