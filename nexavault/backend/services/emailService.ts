export const sendOTPEmail = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
  // 🔐 In production, use nodemailer or an email API like SendGrid/Mailgun
  console.log(`📧 Sending OTP to ${email}: ${otp}`);

  // Simulate email delivery delay (1s)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'OTP sent successfully'
  };
};
