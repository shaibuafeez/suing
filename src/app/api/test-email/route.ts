import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'afeezedeifoshaibu@gmail.com';

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('Testing email configuration...');
    console.log('API Key present:', !!process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'Sui Nigeria <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: 'Test Email - SUI Nigeria',
      html: 'This is a test email to verify the Resend configuration.'
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Test email sent successfully',
      data: data
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
