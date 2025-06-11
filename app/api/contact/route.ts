import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const { name, email, eventType, message } = data;
    if (!name || !email || !eventType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // In a production environment, you would:
    // 1. Send email using a service like SendGrid, Mailgun, etc.
    // 2. Save to a database
    // 3. Integrate with a CRM
    
    // For now, we'll just log the submission and return success
    console.log('Contact form submission:', data);
    
    // Example of how you might integrate with an email service:
    // await sendEmail({
    //   to: 'adornphoto.eventrentals@gmail.com',
    //   from: email,
    //   subject: `New inquiry from ${name}`,
    //   text: `
    //     Name: ${name}
    //     Email: ${email}
    //     Phone: ${data.phone || 'Not provided'}
    //     Event Type: ${eventType}
    //     Preferred Contact: ${data.preferredContact || 'email'}
    //     
    //     Message:
    //     ${message}
    //   `
    // });
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you within 24 hours.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}