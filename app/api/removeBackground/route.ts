import { NextResponse } from 'next/server';
import axios from 'axios';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY; // Ensure this is set in your environment variables

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return NextResponse.json({ base64Image });
  } catch (error: any) {
    console.error('Error removing background:', error);
    return NextResponse.json({ error: 'Failed to remove background' }, { status: 500 });
  }
} 