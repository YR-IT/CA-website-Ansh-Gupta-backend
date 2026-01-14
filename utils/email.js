const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email to user (confirmation)
const sendUserConfirmationEmail = async (userEmail, userName, subject) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"A S GUPTA AND CO" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Thank you for contacting A S GUPTA AND CO',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>A S GUPTA AND CO</h1>
              <p>Chartered Accountants</p>
            </div>
            <div class="content">
              <h2>Dear ${userName},</h2>
              <p>Thank you for reaching out to us regarding "<strong>${subject}</strong>".</p>
              <p>We have received your inquiry and our team will review it shortly. One of our experts will get back to you within 24-48 business hours.</p>
              <p>If your matter is urgent, please feel free to call us directly at <strong>+91 90340 59226</strong>.</p>
              <br>
              <p>Best Regards,</p>
              <p><strong>A S GUPTA AND CO</strong><br>
              Chartered Accountants<br>
              3A Savitry Enclave, VIP Road, Zirakpur<br>
              Phone: +91 90340 59226</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('User confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    return false;
  }
};

// Send email to admin (notification)
const sendAdminNotificationEmail = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1e3a8a; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${contactData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${contactData.email}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${contactData.phone || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${contactData.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${contactData.message}</div>
              </div>
              <div class="field">
                <div class="label">Submitted At:</div>
                <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
};

module.exports = {
  sendUserConfirmationEmail,
  sendAdminNotificationEmail
};
