"use strict";
/** Professional email templates for Ruhama Metekiya Medium Clinic */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationReceivedTemplate = registrationReceivedTemplate;
exports.adminNewRegistrationTemplate = adminNewRegistrationTemplate;
exports.approvalAndVerificationTemplate = approvalAndVerificationTemplate;
exports.escapeHtml = escapeHtml;
exports.emailChangeOTPTemplate = emailChangeOTPTemplate;
exports.firstLoginOTPTemplate = firstLoginOTPTemplate;
const LOGO_URL = 'https://ruhamametekiyamediumclinic.net/logo.jpg?v=1';
function registrationReceivedTemplate(fullName, roleLabel) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="Ruhama Clinic Logo" style="max-width: 120px; height: auto; margin-bottom: 20px; border-radius: 8px; background: white; padding: 10px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Registration Received</h1>
              <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Ruhama Metekiya Medium Clinic</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullName},</p>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering as <strong style="color: #0ea5e9;">${roleLabel}</strong> with Ruhama Metekiya Medium Clinic Healthcare Management System.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-left: 4px solid #0ea5e9; border-radius: 4px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #334155; margin: 0 0 10px 0; font-size: 15px; font-weight: 600;">
                      📋 Registration Status
                    </p>
                    <p style="color: #475569; margin: 0; font-size: 14px; line-height: 1.6;">
                      Your registration has been received and is pending administrator approval. You will receive an activation email once your account is approved.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;">
                <strong>Security Notice:</strong> If you did not submit this registration, please contact us immediately at info@ruhamametekiyamediumclinic.net
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Ruhama Metekiya Medium Clinic
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
                Healthcare Management System<br>
                📧 info@ruhamametekiyamediumclinic.net<br>
                🌐 ruhamametekiyamediumclinic.net
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
}
function adminNewRegistrationTemplate(applicantEmail, fullName, roleLabel, adminDashboardUrl) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Staff Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="Ruhama Clinic Logo" style="max-width: 100px; height: auto; margin-bottom: 20px; border-radius: 8px; background: white; padding: 10px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">⚠️ New Staff Registration</h1>
              <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Action Required</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; font-weight: 600;">
                A new staff member has registered and is awaiting your approval:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 120px;"><strong>Name:</strong></td>
                        <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">${applicantEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;"><strong>Role:</strong></td>
                        <td style="color: #1e293b; font-size: 14px;">
                          <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                            ${roleLabel}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${adminDashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);">
                      Review & Approve Registration
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Ruhama Metekiya Medium Clinic
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
                Admin Notification - This is an automated message<br>
                📧 info@ruhamametekiyamediumclinic.net
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
}
function approvalAndVerificationTemplate(fullName, verificationUrl) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="Ruhama Clinic Logo" style="max-width: 100px; height: auto; margin-bottom: 20px; border-radius: 8px; background: white; padding: 10px;" />
              <div style="background: #ffffff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 48px;">✅</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600;">Account Approved!</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your registration has been approved</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullName},</p>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! Your staff account has been <strong style="color: #10b981;">approved</strong> by the administrator.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #065f46; margin: 0 0 10px 0; font-weight: 600; font-size: 15px;">
                      📧 One More Step Required
                    </p>
                    <p style="color: #047857; margin: 0; font-size: 14px; line-height: 1.6;">
                      Please verify your email address to activate full access to the Healthcare Management System.
                    </p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; padding: 18px 45px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                      Verify Email & Activate Account
                    </a>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #64748b; font-size: 13px; margin: 0 0 12px 0; font-weight: 600;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="color: #0ea5e9; font-size: 12px; word-break: break-all; margin: 0; font-family: 'Courier New', monospace;">
                      ${verificationUrl}
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;">
                <strong>Security Note:</strong> This verification link is unique to your account. If you did not request this account, please contact the clinic administrator immediately.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Ruhama Metekiya Medium Clinic
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
                Healthcare Management System<br>
                📧 info@ruhamametekiyamediumclinic.net<br>
                🌐 ruhamametekiyamediumclinic.net
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
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function emailChangeOTPTemplate(fullName, newEmail, otp) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Change OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="Ruhama Clinic Logo" style="max-width: 120px; height: auto; margin-bottom: 20px; border-radius: 8px; background: white; padding: 10px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Email Change Verification</h1>
              <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Ruhama Metekiya Medium Clinic</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullName},</p>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                You have requested to change your email address to <strong style="color: #0ea5e9;">${newEmail}</strong>.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 15px; font-weight: 600;">
                      ⚠️ Important Security Notice
                    </p>
                    <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">
                      Use the One-Time Password (OTP) below to complete your email change. This code will expire in 15 minutes.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- OTP Display -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); border-radius: 12px; padding: 30px; display: inline-block;">
                      <p style="color: #e0f2fe; margin: 0 0 10px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                      <p style="color: #ffffff; margin: 0; font-size: 48px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #334155; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                      📝 How to use this code:
                    </p>
                    <ol style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                      <li>Go back to the Settings page</li>
                      <li>Enter this 6-digit code in the OTP field</li>
                      <li>Click "Verify OTP" to complete the change</li>
                    </ol>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;">
                <strong>Didn't request this change?</strong> If you did not request to change your email address, please ignore this email and contact us immediately at info@ruhamametekiyamediumclinic.net. Your current email address will remain unchanged.
              </p>
              
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <strong>Security Tips:</strong><br>
                • Never share this code with anyone<br>
                • This code expires in 15 minutes<br>
                • Only use this code on the official Ruhama Clinic website
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Ruhama Metekiya Medium Clinic
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
                Healthcare Management System<br>
                📧 info@ruhamametekiyamediumclinic.net<br>
                🌐 ruhamametekiyamediumclinic.net
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
}
function firstLoginOTPTemplate(fullName, email, otp) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your First Login OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="Ruhama Clinic Logo" style="max-width: 120px; height: auto; margin-bottom: 20px; border-radius: 8px; background: white; padding: 10px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Ruhama Clinic!</h1>
              <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Your Account Has Been Approved</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullName},</p>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Congratulations! Your account has been approved by the administrator. You can now access the Ruhama Metekiya Medium Clinic Healthcare Management System.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #065f46; margin: 0 0 10px 0; font-size: 15px; font-weight: 600;">
                      🎉 First Login Instructions
                    </p>
                    <p style="color: #047857; margin: 0; font-size: 14px; line-height: 1.6;">
                      For security, your first login requires a One-Time Password (OTP). Use the code below to complete your first login. After this, you can login normally with your email and password.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- OTP Display -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); border-radius: 12px; padding: 30px; display: inline-block;">
                      <p style="color: #e0f2fe; margin: 0 0 10px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your First Login OTP</p>
                      <p style="color: #ffffff; margin: 0; font-size: 48px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #334155; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                      📝 How to login:
                    </p>
                    <ol style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                      <li>Go to the login page</li>
                      <li>Enter your email: <strong>${email}</strong></li>
                      <li>Enter your password (the one you set during registration)</li>
                      <li>Enter the OTP code above when prompted</li>
                      <li>Click "Verify & Login"</li>
                    </ol>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                      ⏰ Important Notes
                    </p>
                    <ul style="color: #78350f; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                      <li>This OTP is valid for 24 hours</li>
                      <li>You only need this OTP for your FIRST login</li>
                      <li>After first login, use email and password normally</li>
                      <li>Keep this code confidential</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;">
                <strong>Need help?</strong> If you have any questions or didn't request this account, please contact the administrator at info@ruhamametekiyamediumclinic.net
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Ruhama Metekiya Medium Clinic
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
                Healthcare Management System<br>
                📧 info@ruhamametekiyamediumclinic.net<br>
                🌐 ruhamametekiyamediumclinic.net
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
}
//# sourceMappingURL=email-templates.js.map