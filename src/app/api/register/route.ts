import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { sendRegistrationEmail } from '@/lib/email';
import { z } from 'zod';

// Validation schema
const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  event: z.string().min(1, 'Event selection is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
});

export async function POST(request: Request) {
  try {
    console.log('Starting registration process...');
    const body = await request.json();
    console.log('Received registration data:', body);
    
    // Validate input using Zod
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors);
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { fullName, email, event, experienceLevel } = validationResult.data;
    console.log('Validated data:', { fullName, email, event, experienceLevel });

    // Check for existing registration
    console.log('Checking for existing registration...');
    const registrationsRef = collection(db, 'registrations');
    const q = query(
      registrationsRef, 
      where('email', '==', email),
      where('event', '==', event)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log('Found existing registration');
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 400 }
      );
    }

    // Add registration to Firestore
    console.log('Adding registration to Firestore...');
    const registrationData = {
      fullName,
      email,
      event,
      experienceLevel,
      createdAt: new Date().toISOString(),
      status: 'pending',
      registrationIP: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      lastUpdated: new Date().toISOString()
    };

    const docRef = await addDoc(registrationsRef, registrationData);
    console.log('Registration added successfully with ID:', docRef.id);

    // Send confirmation email
    console.log('Sending confirmation email...');
    try {
      console.log('Email details:', {
        to: email,
        event: event,
        fullName: fullName,
        apiKey: process.env.RESEND_API_KEY ? 'Present' : 'Missing'
      });
      const emailResult = await sendRegistrationEmail(email, fullName, event);
      console.log('Email API Response:', emailResult);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with the registration process even if email fails
    }

    return NextResponse.json({
      message: 'Registration successful',
      registrationId: docRef.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process registration';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
