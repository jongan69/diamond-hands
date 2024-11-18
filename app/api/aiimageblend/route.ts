// route.ts
import { NextResponse } from 'next/server';
import ApiframeClient from 'apiframe-js';

const APIFRAME_API_KEY = process.env.APIFRAME_API_KEY; // Ensure this is set in your environment variables
const client = new ApiframeClient(APIFRAME_API_KEY, true);

export async function POST(request: Request) {
    const { userImageUrl, transparentImageUrl, overlayImageUrl } = await request.json();

    // Log the URLs to verify they are correct
    console.log('User Image URL:', userImageUrl);
    console.log('Transparent Image URL:', transparentImageUrl);
    console.log('Overlay Image URL:', overlayImageUrl);

    if (!userImageUrl || !transparentImageUrl || !overlayImageUrl) {
        return NextResponse.json({ error: 'Invalid image URLs' }, { status: 400 });
    }

    try {
        const response = await client.blend({
            image_urls: [userImageUrl, transparentImageUrl, overlayImageUrl],
            dimension: 'square',
            process_mode: 'fast',
        });

        if (!response || !response.task_id) {
            throw new Error('Invalid response from blend API');
        }

        const taskId = response.task_id;

        // Polling for the result
        let result;
        while (true) {
            result = await client.fetch({ task_id: taskId });
            if (result.status === 'finished') {
                break;
            }
            if (result.status === 'failed') {
                throw new Error('Blend API failed');
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
        }

        return NextResponse.json({ image_urls: result.image_urls });
    } catch (error: any) {
        console.error(`Error blending images: ${error.message}`);
        return NextResponse.json({ error: 'Failed to blend images' }, { status: 500 });
    }
}