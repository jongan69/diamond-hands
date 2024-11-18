// route.ts
import { NextResponse } from 'next/server';
import { enqueueBlendTask } from '../taskQueue'; // hypothetical task queue module

export async function POST(request: Request) {
    const { userImageUrl, transparentImageUrl, overlayImageUrl } = await request.json();

    if (!userImageUrl || !transparentImageUrl || !overlayImageUrl) {
        return NextResponse.json({ error: 'Invalid image URLs' }, { status: 400 });
    }

    try {
        const taskId = await enqueueBlendTask({ userImageUrl, transparentImageUrl, overlayImageUrl });
        return NextResponse.json({ taskId });
    } catch (error: any) {
        console.error(`Error enqueuing blend task: ${error.message}`);
        return NextResponse.json({ error: 'Failed to enqueue blend task' }, { status: 500 });
    }
}