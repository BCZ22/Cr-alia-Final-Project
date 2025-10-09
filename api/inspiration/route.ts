import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Construct the path to the JSON file in the backend directory
    const jsonDirectory = path.resolve(process.cwd(), '../../../backend/data');
    const filePath = path.join(jsonDirectory, 'carousel-templates.json');
    
    // Read the file content
    const fileContents = await fs.readFile(filePath, 'utf8');
    
    // Parse the JSON data
    const data = JSON.parse(fileContents);
    
    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read inspiration data:', error);
    return NextResponse.json({ error: 'Failed to load inspiration data' }, { status: 500 });
  }
}
