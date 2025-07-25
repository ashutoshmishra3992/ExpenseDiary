export const generateOTPEmailHTML = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ExpenseDiary OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; 
                 background-color: #f8f9fa;">
      <table cellpadding="0" cellspacing="0" width="100%" 
             style="background-color: #f8f9fa; padding: 40px 0;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" width="600" 
                   style="background-color: #ffffff; border-radius: 12px; 
                          box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                          overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, 
                           #764ba2 100%); padding: 40px 30px; 
                           text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; 
                             font-weight: bold;">💰 ExpenseDiary</h1>
                  <p style="color: #e8eaf6; margin: 8px 0 0 0; 
                            font-size: 16px;">
                            Your Personal Finance Companion</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; 
                             font-size: 24px; text-align: center;">
                             Verification Code</h2>
                  <p style="color: #666666; margin: 0 0 30px 0; 
                            font-size: 16px; line-height: 1.5; 
                            text-align: center;">
                    We received a request to sign in to your ExpenseDiary 
                    account. Use the verification code below to complete 
                    your sign-in:
                  </p>
                  
                  <!-- OTP Box -->
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <div style="background-color: #f8f9ff; 
                                    border: 2px dashed #667eea; 
                                    border-radius: 8px; padding: 25px; 
                                    display: inline-block;">
                          <span style="font-size: 32px; font-weight: bold; 
                                       color: #667eea; letter-spacing: 8px; 
                                       font-family: 'Courier New', monospace;">
                                       ${otp}</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #666666; margin: 30px 0 0 0; 
                            font-size: 14px; line-height: 1.5; 
                            text-align: center;">
                    This code will expire in <strong>10 minutes</strong> 
                    for your security.
                  </p>
                  
                  <!-- Security Notice -->
                  <div style="background-color: #fff3cd; 
                              border-left: 4px solid #ffc107; 
                              padding: 15px; margin: 30px 0 0 0; 
                              border-radius: 4px;">
                    <p style="color: #856404; margin: 0; font-size: 14px;">
                      <strong>🔒 Security Notice:</strong> Never share this 
                      code with anyone. ExpenseDiary will never ask for your 
                      verification code via phone or email.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; 
                           text-align: center; 
                           border-top: 1px solid #e9ecef;">
                  <p style="color: #6c757d; margin: 0; font-size: 14px;">
                    If you didn't request this code, please ignore this email 
                    or <a href="#" style="color: #667eea; 
                    text-decoration: none;">contact support</a>.
                  </p>
                  <p style="color: #6c757d; margin: 15px 0 0 0; 
                            font-size: 12px;">
                    © 2025 ExpenseDiary. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
};

export const generateOTPEmailText = (otp: string): string => {
  return `Your ExpenseDiary verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

© 2025 ExpenseDiary`;
};
