import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, status } = body;

    // Validate input
    if (!registrationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['approved', 'rejected', 'pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update the registration status
    const registrationRef = doc(db, 'registrations', registrationId);
    await updateDoc(registrationRef, {
      status,
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
