import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In test mode, we can only send to the verified email
const ADMIN_EMAIL = 'afeezedeifoshaibu@gmail.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function sendRegistrationEmail(email: string, fullName: string, event: string) {
  try {
    console.log('Attempting to send email with Resend API key:', process.env.RESEND_API_KEY);
    
    // In test mode, always send to admin email
    const recipientEmail = IS_PRODUCTION ? email : ADMIN_EMAIL;
    
    const { data, error } = await resend.emails.send({
      from: 'Sui Nigeria <onboarding@resend.dev>',
      to: recipientEmail,
      subject: 'Registration Confirmation - SUI Nigeria Event',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #25B96B;">Registration Confirmation</h1>
          ${!IS_PRODUCTION ? `<p style="color: #ff0000;">[TEST MODE] Original recipient: ${email}</p>` : ''}
          <p>Hello ${fullName},</p>
          <p>Thank you for registering for the ${event}. We're excited to have you join us!</p>
          <p>Your registration is currently pending approval. We'll send you another email once your registration is confirmed.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #1A4D2E; margin-top: 0;">Event Details</h2>
            <p style="margin-bottom: 0;"><strong>Event:</strong> ${event}</p>
          </div>
          <p>If you have any questions, please don't hesitate to reach out to us.</p>
          <p>Best regards,<br>SUI Nigeria Team</p>
        </div>
      `,
      // Add reply-to so recipients can reply to the original sender
      reply_to: email
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send confirmation email');
  }
}

export async function sendStatusUpdateEmail(email: string, fullName: string, event: string, status: string) {
  const subject = status === 'approved' 
    ? 'Registration Approved - SUI Nigeria Event'
    : 'Registration Update - SUI Nigeria Event';

  const message = status === 'approved'
    ? 'Your registration has been approved! We look forward to seeing you at the event.'
    : 'Unfortunately, we are unable to accommodate your registration at this time.';

  try {
    await resend.emails.send({
      from: 'SUI Nigeria <events@suinigeria.com>',
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #25B96B;">Registration ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
          <p>Hello ${fullName},</p>
          <p>${message}</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #1A4D2E; margin-top: 0;">Event Details</h2>
            <p style="margin-bottom: 0;"><strong>Event:</strong> ${event}</p>
          </div>
          <p>If you have any questions, please don't hesitate to reach out to us.</p>
          <p>Best regards,<br>SUI Nigeria Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send status update email:', error);
    throw new Error('Failed to send status update email');
  }
}
