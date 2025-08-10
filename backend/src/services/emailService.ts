import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
export const emailTemplates = {
  verification: (username: string, otp: string) => ({
    subject: 'Xác thực email - English Website',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Xin chào ${username}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại English Website.</p>
        <p>Mã xác thực email của bạn là:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f3f4f6; border: 2px solid #2563eb; border-radius: 8px; 
                      padding: 20px; display: inline-block; font-family: monospace;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${otp}</span>
          </div>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          Mã này sẽ hết hạn sau 10 phút.
        </p>
        <p style="text-align: center; margin-top: 20px;">
          <strong>Lưu ý:</strong> Không chia sẻ mã này với bất kỳ ai.
        </p>
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
    let emailContent;
    if (template === 'verification') {
      emailContent = emailTemplates[template](data.username, data.otp || '');
    } else {
      emailContent = emailTemplates[template](data.username);
    }
    
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, username: string, otp: string) => {
  return await sendEmail(email, 'verification', {
    username,
    otp
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, username: string) => {
  return await sendEmail(email, 'welcome', { username });
};
