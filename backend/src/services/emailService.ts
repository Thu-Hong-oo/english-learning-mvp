import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
export const emailTemplates = {
  verification: (username: string, verificationUrl: string) => ({
    subject: 'Xác thực email - English Website',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Xin chào ${username}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại English Website.</p>
        <p>Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Xác thực Email
          </a>
        </div>
        <p>Hoặc copy link này vào trình duyệt:</p>
        <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
        <p>Link này sẽ hết hạn sau 24 giờ.</p>
        <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Email này được gửi tự động, vui lòng không trả lời.
        </p>
      </div>
    `
  }),
  
  welcome: (username: string) => ({
    subject: 'Chào mừng bạn đến với English Website!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Chào mừng ${username}!</h2>
        <p>Chúc mừng! Email của bạn đã được xác thực thành công.</p>
        <p>Bây giờ bạn có thể:</p>
        <ul>
          <li>Đăng nhập vào tài khoản</li>
          <li>Tham gia các khóa học</li>
          <li>Làm bài tập và kiểm tra</li>
          <li>Theo dõi tiến độ học tập</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
             style="background-color: #059669; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Đăng nhập ngay
          </a>
        </div>
        <p>Chúc bạn học tập hiệu quả!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          English Website Team
        </p>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to: string, template: keyof typeof emailTemplates, data: any) => {
  try {
    const emailContent = emailTemplates[template](data.username, data.verificationUrl || '');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, username: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  return await sendEmail(email, 'verification', {
    username,
    verificationUrl
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, username: string) => {
  return await sendEmail(email, 'welcome', { username });
};
