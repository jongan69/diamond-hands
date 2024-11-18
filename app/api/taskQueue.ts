import mongoose, { Schema, Document, Model } from 'mongoose';
import ApiframeClient from 'apiframe-js';

interface ITask extends Document {
  id: string;
  data: any;
  status: 'queued' | 'processing' | 'finished' | 'failed';
  result?: any;
  error?: any;
}

const APIFRAME_API_KEY = process.env.APIFRAME_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

if (!APIFRAME_API_KEY || !MONGODB_URI) {
  console.error('APIFRAME_API_KEY', APIFRAME_API_KEY);
  console.error('MONGODB_URI', MONGODB_URI);
  throw new Error('APIFRAME_API_KEY or MONGODB_URI is not set');
}

const client = new ApiframeClient(APIFRAME_API_KEY, true);

// Define the task schema
const taskSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  status: { type: String, required: true },
  result: { type: Object },
  error: { type: String },
});

// Create the task model
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

// Initialize MongoDB connection
const initMongoDB = async () => {
    try {
     mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
        socketTimeoutMS: 45000, // Adjust the socket timeout as needed
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
};

// Function to enqueue a blend task
export const enqueueBlendTask = async (taskData: any) => {
  await initMongoDB();

  try {
    const response = await client.blend({
      image_urls: [taskData.userImageUrl, taskData.transparentImageUrl, taskData.overlayImageUrl],
      dimension: 'square',
      process_mode: 'fast',
    });

    if (!response || !response.task_id) {
      throw new Error('Invalid response from blend API');
    }

    const taskId = response.task_id;
    const task = new Task({ id: taskId, data: taskData, status: 'queued' });
    await task.save();
    console.log(`Task ${taskId} stored with status 'queued'`);
    processTask(taskId);
    return taskId;
  } catch (error: any) {
    console.error(`Error enqueuing blend task: ${error.message}`);
    throw error;
  }
};

// Function to get the status of a task
export const getTaskStatus = async (taskId: string) => {
  await initMongoDB();

  const task = await Task.findOne({ id: taskId });
  if (!task) {
    console.error(`Task ${taskId} not found in database`);
    throw new Error('Task not found');
  }
  if (task.status === 'finished') {
    return { status: task.status, image_urls: task.result.image_urls };
  } else {
    return { status: task.status };
  }
};

// Function to process a task
const processTask = async (taskId: string) => {
  await initMongoDB();

  const task = await Task.findOne({ id: taskId });
  if (!task) return;

  task.status = 'processing';
  await task.save();
  console.log(`Task ${taskId} is processing`);

  try {
    let result;
    while (true) {
      result = await client.fetch({ task_id: taskId });
      if (result.status === 'finished') {
        console.log(`Task ${taskId} finished successfully`);
        task.status = 'finished';
        task.result = { image_urls: result.image_urls };
        await task.save();
        break;
      }
      if (result.status === 'failed') {
        console.error(`Task ${taskId} failed during blending`);
        throw new Error('Blend API failed');
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } catch (error: any) {
    console.error(`Error processing task ${taskId}:`, error);
    task.status = 'failed';
    task.error = error.message;
    await task.save();
  }
}; 