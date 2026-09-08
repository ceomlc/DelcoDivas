import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFICATION_EMAIL = 'delcodivas@gmail.com';
const FROM_EMAIL = 'Delco Divas <onboarding@resend.dev>';

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
  try {
    console.log(`Attempting to send password reset email to: ${email} from: ${FROM_EMAIL}`);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Password Reset Request - Delco Divas Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #000; color: #fff;">
          <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Password Reset Request</h1>
          <p style="font-size: 16px; color: #fff;">You requested to reset your password for the Delco Divas admin panel.</p>
          <p style="font-size: 16px; color: #fff;">Click the button below to reset your password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #888; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
          <p style="color: #888; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #D4AF37; font-size: 12px; word-break: break-all;">${resetLink}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Password reset email error:', JSON.stringify(error));
      return false;
    }

    console.log(`Password reset email sent successfully to: ${email}, id: ${data?.id}`);
    return true;
  } catch (error) {
    console.error('Password reset email service error:', error);
    return false;
  }
}

interface EmailNotification {
  subject: string;
  html: string;
}

export async function sendNotificationEmail(notification: EmailNotification): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject: notification.subject,
      html: notification.html,
    });

    if (error) {
      console.error('Email send error:', error);
      return false;
    }

    console.log(`Email sent: ${notification.subject}`);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}

export function formatNewsletterNotification(email: string): EmailNotification {
  return {
    subject: 'New Newsletter Subscriber - Delco Divas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Newsletter Subscriber</h1>
        <p style="font-size: 16px; color: #333;">Someone just subscribed to your newsletter!</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
        </div>
        <p style="color: #666; font-size: 14px;">View all subscribers in your <a href="https://delcodivas.com/admin/dashboard" style="color: #D4AF37;">admin dashboard</a>.</p>
      </div>
    `,
  };
}

export function formatSignupNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string | null;
  referralSource?: string | null;
  eventId?: string | null;
}): EmailNotification {
  return {
    subject: 'New Event Registration - Delco Divas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Event Registration</h1>
        <p style="font-size: 16px; color: #333;">Someone just registered for an event!</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          ${data.eventId ? `<p><strong>Event ID:</strong> ${data.eventId}</p>` : ''}
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          ${data.referralSource ? `<p><strong>Referral Source:</strong> ${data.referralSource}</p>` : ''}
        </div>
        <p style="color: #666; font-size: 14px;">View all registrations in your <a href="https://delcodivas.com/admin/dashboard" style="color: #D4AF37;">admin dashboard</a>.</p>
      </div>
    `,
  };
}

export function formatContactNotification(data: {
  name: string;
  email: string;
  message: string;
  itemId?: string | null;
}): EmailNotification {
  return {
    subject: 'New Merchandise Inquiry - Delco Divas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Merchandise Inquiry</h1>
        <p style="font-size: 16px; color: #333;">Someone is interested in your merchandise!</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong> ${data.message}</p>
          ${data.itemId ? `<p><strong>Item ID:</strong> ${data.itemId}</p>` : ''}
        </div>
        <p style="color: #666; font-size: 14px;">View all inquiries in your <a href="https://delcodivas.com/admin/dashboard" style="color: #D4AF37;">admin dashboard</a>.</p>
      </div>
    `,
  };
}

export function formatReviewNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  eventAttended: string;
  rating: string;
  review: string;
  canFeature?: string | null;
}): EmailNotification {
  return {
    subject: `New Review (${data.rating}/5) - Delco Divas`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Review Submitted</h1>
        <p style="font-size: 16px; color: #333;">Someone left a review!</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Event Attended:</strong> ${data.eventAttended}</p>
          <p><strong>Rating:</strong> ${data.rating}/5</p>
          <p><strong>Review:</strong> ${data.review}</p>
          <p><strong>Can Feature:</strong> ${data.canFeature || 'yes'}</p>
        </div>
        <p style="color: #666; font-size: 14px;">View all reviews in your <a href="https://delcodivas.com/admin/dashboard" style="color: #D4AF37;">admin dashboard</a>.</p>
      </div>
    `,
  };
}
