import { NextResponse } from 'next/server';
import { getTaskStatus } from '../taskQueue'; // hypothetical task queue module

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    try {
        const status = await getTaskStatus(taskId);
        console.log('status', status);
        return NextResponse.json({ status });
    } catch (error: any) {
        console.error(`Error fetching task status: ${error.message}`);
        return NextResponse.json({ error: 'Failed to fetch task status' }, { status: 500 });
    }
} 