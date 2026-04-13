"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/database.ts
var database_exports = {};
__export(database_exports, {
  default: () => database_default
});
var import_client, prisma, database_default;
var init_database = __esm({
  "src/config/database.ts"() {
    "use strict";
    import_client = require("@prisma/client");
    prisma = new import_client.PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
    });
    database_default = prisma;
  }
});

// src/services/email-templates.ts
function registrationReceivedTemplate(fullName, roleLabel2) {
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
                Thank you for registering as <strong style="color: #0ea5e9;">${roleLabel2}</strong> with Ruhama Metekiya Medium Clinic Healthcare Management System.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-left: 4px solid #0ea5e9; border-radius: 4px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #334155; margin: 0 0 10px 0; font-size: 15px; font-weight: 600;">
                      \u{1F4CB} Registration Status
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
                \u{1F4E7} info@ruhamametekiyamediumclinic.net<br>
                \u{1F310} ruhamametekiyamediumclinic.net
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
function adminNewRegistrationTemplate(applicantEmail, fullName, roleLabel2, adminDashboardUrl) {
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
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">\u26A0\uFE0F New Staff Registration</h1>
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
                            ${roleLabel2}
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
                \u{1F4E7} info@ruhamametekiyamediumclinic.net
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
                <span style="font-size: 48px;">\u2705</span>
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
                      \u{1F4E7} One More Step Required
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
                \u{1F4E7} info@ruhamametekiyamediumclinic.net<br>
                \u{1F310} ruhamametekiyamediumclinic.net
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
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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
                      \u26A0\uFE0F Important Security Notice
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
                      \u{1F4DD} How to use this code:
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
                \u2022 Never share this code with anyone<br>
                \u2022 This code expires in 15 minutes<br>
                \u2022 Only use this code on the official Ruhama Clinic website
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
                \u{1F4E7} info@ruhamametekiyamediumclinic.net<br>
                \u{1F310} ruhamametekiyamediumclinic.net
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
                      \u{1F389} First Login Instructions
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
                      \u{1F4DD} How to login:
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
                      \u23F0 Important Notes
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
                \u{1F4E7} info@ruhamametekiyamediumclinic.net<br>
                \u{1F310} ruhamametekiyamediumclinic.net
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
var LOGO_URL;
var init_email_templates = __esm({
  "src/services/email-templates.ts"() {
    "use strict";
    LOGO_URL = "https://ruhamametekiyamediumclinic.net/logo.jpg?v=1";
  }
});

// src/services/email.service.ts
var email_service_exports = {};
__export(email_service_exports, {
  EmailService: () => EmailService,
  emailService: () => emailService,
  getEmailConfigStatus: () => getEmailConfigStatus
});
function readEnv() {
  return {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 465),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    fromName: process.env.EMAIL_FROM_NAME || "Ruhama Clinic",
    adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    appBaseUrl: process.env.APP_BASE_URL || process.env.FRONTEND_URL || process.env.BASE_URL || "http://localhost:5173"
  };
}
function getTransporter() {
  if (transporterCache !== void 0) {
    return transporterCache;
  }
  const { host, port, user, pass } = readEnv();
  if (!host || !user || !pass) {
    transporterCache = null;
    return null;
  }
  const secureExplicit = process.env.EMAIL_SECURE;
  const secure = secureExplicit === "true" ? true : secureExplicit === "false" ? false : port === 465;
  transporterCache = import_nodemailer.default.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Always set TLS options for cPanel compatibility
    tls: {
      rejectUnauthorized: false
      // Accept self-signed certificates (common with cPanel)
    },
    // For port 587 (STARTTLS)
    ...secure === false && port === 587 ? {
      requireTLS: true
    } : {},
    // Enable debug logging
    debug: process.env.NODE_ENV === "development",
    logger: process.env.NODE_ENV === "development"
  });
  return transporterCache;
}
function getEmailConfigStatus() {
  const { host, user, pass } = readEnv();
  if (host && user && pass) {
    return { configured: true };
  }
  return {
    configured: false,
    hint: "Set EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in backend/.env"
  };
}
var import_nodemailer, transporterCache, fromHeader, EmailService, emailService;
var init_email_service = __esm({
  "src/services/email.service.ts"() {
    "use strict";
    import_nodemailer = __toESM(require("nodemailer"));
    init_email_templates();
    fromHeader = () => {
      const { user, fromName } = readEnv();
      return `"${fromName}" <${user}>`;
    };
    EmailService = class {
      /** Sent right after a staff member submits self-registration (simple confirmation only). */
      async sendRegistrationReceivedEmail(toEmail, fullName, roleLabel2) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
          console.warn("[email] SMTP not configured \u2014 skipping registration-received email.");
          console.warn("[email] Missing config:", { hasTransporter: !!t, hasUser: !!user });
          return;
        }
        console.log(`[email] Attempting to send registration email to ${toEmail}...`);
        try {
          await t.sendMail({
            from: fromHeader(),
            to: toEmail,
            replyTo: adminEmail,
            subject: "Registration Received - Ruhama Metekiya Medium Clinic",
            html: registrationReceivedTemplate(escapeHtml(fullName), escapeHtml(roleLabel2))
          });
          console.log(`\u2705 [email] Registration received email sent successfully to ${toEmail}`);
        } catch (error) {
          console.error(`\u274C [email] Failed to send registration email to ${toEmail}:`, error);
          throw error;
        }
      }
      /** Notify clinic admin that a new staff registration needs review. */
      async sendAdminNewRegistrationAlert(applicantEmail, fullName, roleLabel2) {
        const t = getTransporter();
        const { user, adminEmail, appBaseUrl } = readEnv();
        if (!t || !user || !adminEmail) {
          console.warn("[email] SMTP not configured \u2014 skipping admin alert email.");
          return;
        }
        const adminDashboardUrl = `${appBaseUrl.replace(/\/$/, "")}/admin/approvals`;
        await t.sendMail({
          from: fromHeader(),
          to: adminEmail,
          replyTo: user,
          subject: `[Action Required] New Staff Registration: ${fullName}`,
          html: adminNewRegistrationTemplate(
            escapeHtml(applicantEmail),
            escapeHtml(fullName),
            escapeHtml(roleLabel2),
            adminDashboardUrl
          )
        });
        console.log(`[email] Admin alert sent to ${adminEmail}`);
      }
      /** Sent after admin approves the user — includes the email verification link. */
      async sendApprovalAndVerificationEmail(toEmail, fullName, token) {
        const t = getTransporter();
        const { user, adminEmail, appBaseUrl } = readEnv();
        if (!t || !user) {
          console.warn("[email] SMTP not configured \u2014 skipping approval / verification email.");
          console.warn("[email] Missing config:", { hasTransporter: !!t, hasUser: !!user });
          return;
        }
        console.log(`[email] Attempting to send approval email to ${toEmail}...`);
        const verificationUrl = `${appBaseUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(token)}`;
        try {
          await t.sendMail({
            from: fromHeader(),
            to: toEmail,
            replyTo: adminEmail,
            subject: "\u2705 Account Approved - Activate Your Access",
            html: approvalAndVerificationTemplate(escapeHtml(fullName), verificationUrl)
          });
          console.log(`\u2705 [email] Approval / verification email sent successfully to ${toEmail}`);
        } catch (error) {
          console.error(`\u274C [email] Failed to send approval email to ${toEmail}:`, error);
          throw error;
        }
      }
      /** Send email change OTP to the NEW email address. */
      async sendEmailChangeOTP(newEmail, fullName, otp) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
          console.warn("[email] SMTP not configured \u2014 skipping email change OTP.");
          console.warn("[email] Missing config:", { hasTransporter: !!t, hasUser: !!user });
          return;
        }
        console.log(`[email] Attempting to send email change OTP to ${newEmail}...`);
        try {
          await t.sendMail({
            from: fromHeader(),
            to: newEmail,
            replyTo: adminEmail,
            subject: "\u{1F510} Your Email Change OTP - Ruhama Clinic",
            html: emailChangeOTPTemplate(escapeHtml(fullName), escapeHtml(newEmail), otp)
          });
          console.log(`\u2705 [email] Email change OTP sent successfully to ${newEmail}`);
        } catch (error) {
          console.error(`\u274C [email] Failed to send email change OTP to ${newEmail}:`, error);
          throw error;
        }
      }
      /** Send first login OTP after admin approval. */
      async sendFirstLoginOTP(toEmail, fullName, otp) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
          console.warn("[email] SMTP not configured \u2014 skipping first login OTP.");
          console.warn("[email] Missing config:", { hasTransporter: !!t, hasUser: !!user });
          return;
        }
        console.log(`[email] Attempting to send first login OTP to ${toEmail}...`);
        try {
          await t.sendMail({
            from: fromHeader(),
            to: toEmail,
            replyTo: adminEmail,
            subject: "\u{1F389} Account Approved - Your First Login OTP",
            html: firstLoginOTPTemplate(escapeHtml(fullName), escapeHtml(toEmail), otp)
          });
          console.log(`\u2705 [email] First login OTP sent successfully to ${toEmail}`);
        } catch (error) {
          console.error(`\u274C [email] Failed to send first login OTP to ${toEmail}:`, error);
          throw error;
        }
      }
      /** Generic HTML email (contact form, etc.). */
      async sendEmail(opts) {
        const t = getTransporter();
        const { user, adminEmail } = readEnv();
        if (!t || !user) {
          console.warn("[email] SMTP not configured \u2014 skipping sendEmail.");
          return;
        }
        await t.sendMail({
          from: fromHeader(),
          to: opts.to,
          replyTo: adminEmail,
          subject: opts.subject,
          html: opts.html
        });
      }
    };
    emailService = new EmailService();
  }
});

// src/server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);

// src/app.ts
var import_config = require("dotenv/config");
var import_express22 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_morgan = __toESM(require("morgan"));
init_database();

// src/middleware/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({
    success: false,
    error: {
      message,
      ...process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err
      }
    }
  });
};
var notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`
    }
  });
};

// src/routes/auth.routes.ts
var import_express = require("express");

// src/services/auth.service.ts
var import_client2 = require("@prisma/client");
init_database();

// src/utils/bcrypt.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var SALT_ROUNDS = 10;
var hashPassword = async (password) => {
  return import_bcryptjs.default.hash(password, SALT_ROUNDS);
};
var comparePassword = async (password, hash) => {
  return import_bcryptjs.default.compare(password, hash);
};

// src/utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
var generateToken = (payload) => {
  const options = {
    expiresIn: JWT_EXPIRES_IN
  };
  return import_jsonwebtoken.default.sign(payload, JWT_SECRET, options);
};
var verifyToken = (token) => {
  try {
    return import_jsonwebtoken.default.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// src/services/auth.service.ts
init_email_service();
var emailService2 = new EmailService();
function roleLabel(role) {
  return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
var AuthService = class {
  async register(data) {
    const existingUser = await database_default.user.findUnique({
      where: { email: data.email }
    });
    if (existingUser) {
      throw new Error("Email already registered");
    }
    const passwordHash = await hashPassword(data.password);
    const user = await database_default.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        department: data.department,
        employmentType: data.employmentType,
        isActive: false,
        isApproved: false,
        emailVerified: false
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isApproved: true,
        createdAt: true
      }
    });
    try {
      await emailService2.sendRegistrationReceivedEmail(user.email, user.fullName, roleLabel(user.role));
      console.log(`\u2705 Registration email sent successfully to ${user.email}`);
    } catch (e) {
      console.error("\u274C Registration notification email failed:", e);
      console.error("Email error details:", {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : void 0,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      });
    }
    try {
      await emailService2.sendAdminNewRegistrationAlert(user.email, user.fullName, roleLabel(user.role));
      console.log(`\u2705 Admin alert email sent successfully`);
    } catch (e) {
      console.error("\u274C Admin alert email failed:", e);
      console.error("Admin email error details:", {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : void 0
      });
    }
    return user;
  }
  async registerPatientPortal(data) {
    const existingUser = await database_default.user.findUnique({
      where: { email: data.email }
    });
    if (existingUser) {
      throw new Error("Email already registered");
    }
    const card = data.cardNumber.trim().toUpperCase();
    const patient = await database_default.patient.findUnique({
      where: { cardNumber: card }
    });
    if (!patient) {
      throw new Error(
        "No clinic record found for this card number. Please register at reception first, then link your portal account."
      );
    }
    if (patient.fullName.trim().toLowerCase() !== data.fullName.trim().toLowerCase()) {
      throw new Error("Full name does not match our records for this card number");
    }
    const incomingYmd = data.dateOfBirth.trim().slice(0, 10);
    const storedYmd = new Date(patient.dateOfBirth).toISOString().slice(0, 10);
    if (incomingYmd !== storedYmd) {
      throw new Error("Date of birth does not match our records");
    }
    const alreadyLinked = await database_default.user.findFirst({
      where: { patientLinkId: patient.id }
    });
    if (alreadyLinked) {
      throw new Error("A portal account is already linked to this patient record");
    }
    const passwordHash = await hashPassword(data.password);
    const user = await database_default.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName.trim(),
        role: import_client2.UserRole.PATIENT,
        patientLinkId: patient.id,
        isApproved: true,
        isActive: true,
        emailVerified: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    });
    return user;
  }
  /** Profile + clinical / supervision flags for API responses. */
  async enrichUserForClient(userId) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        department: true,
        employmentType: true,
        isActive: true,
        isApproved: true,
        emailVerified: true,
        profilePhoto: true,
        createdAt: true,
        patientLinkId: true,
        clinicalPersonaUserId: true,
        supervisedByUserId: true,
        supervisedBy: { select: { id: true, fullName: true, role: true } }
      }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const linkedAdmin = user.role === import_client2.UserRole.DOCTOR ? await database_default.user.findFirst({
      where: { clinicalPersonaUserId: user.id, role: "SUPER_ADMIN" },
      select: { id: true, fullName: true, email: true }
    }) : null;
    return {
      ...user,
      canSwitchToClinical: user.role === import_client2.UserRole.SUPER_ADMIN && Boolean(user.clinicalPersonaUserId),
      canSwitchToAdmin: Boolean(linkedAdmin),
      linkedAdmin: linkedAdmin ?? void 0
    };
  }
  async login(email, password, otp) {
    const user = await database_default.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    if (!user.isApproved) {
      throw new Error("Account pending approval");
    }
    if (!user.isActive) {
      throw new Error("Account is inactive");
    }
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }
    const isFirstLogin = !user.emailVerified && user.emailVerificationToken;
    if (isFirstLogin) {
      if (!otp) {
        throw new Error("FIRST_LOGIN_OTP_REQUIRED");
      }
      if (user.emailVerificationToken !== otp) {
        throw new Error("Invalid OTP code");
      }
      const otpAge = Date.now() - (user.verificationEmailSentAt?.getTime() || 0);
      const twentyFourHours = 24 * 60 * 60 * 1e3;
      if (otpAge > twentyFourHours) {
        throw new Error("OTP has expired. Please contact administrator.");
      }
      await database_default.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: /* @__PURE__ */ new Date(),
          emailVerificationToken: null,
          verificationEmailSentAt: null
        }
      });
      console.log(`\u2705 [auth] First login OTP verified for ${user.email}`);
    }
    const requireEmailVerified = process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === "true" || process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === "1";
    if (requireEmailVerified && !user.emailVerified && !isFirstLogin) {
      throw new Error("Please verify your email before login");
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      patientId: user.patientLinkId || void 0
    });
    await database_default.user.update({
      where: { id: user.id },
      data: { lastLogin: /* @__PURE__ */ new Date() }
    });
    // Delete old sessions for this user to prevent duplicate token errors
    await database_default.userSession.deleteMany({
      where: { userId: user.id }
    });
    await database_default.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
        // 24 hours
      }
    });
    const profile = await this.enrichUserForClient(user.id);
    return {
      user: profile,
      token,
      expiresIn: 86400
    };
  }
  /** Super admin switches into their linked doctor account (same browser session token swap). */
  async switchToClinicalPersona(superAdminUserId) {
    const admin = await database_default.user.findUnique({
      where: { id: superAdminUserId },
      select: {
        id: true,
        role: true,
        clinicalPersonaUserId: true,
        isActive: true,
        isApproved: true,
        emailVerified: true
      }
    });
    if (!admin || admin.role !== import_client2.UserRole.SUPER_ADMIN) {
      throw new Error("Only super admins can switch to a clinical account");
    }
    if (!admin.clinicalPersonaUserId) {
      throw new Error("No linked doctor account is configured for this admin");
    }
    const requireEmailVerified = process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === "true" || process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === "1";
    if (!admin.isActive || !admin.isApproved || requireEmailVerified && !admin.emailVerified) {
      throw new Error("Admin account is not allowed to switch sessions");
    }
    const doctor = await database_default.user.findUnique({
      where: { id: admin.clinicalPersonaUserId }
    });
    if (!doctor || doctor.role !== import_client2.UserRole.DOCTOR) {
      throw new Error("Linked clinical account is missing or not a doctor");
    }
    if (!doctor.isActive || !doctor.isApproved || requireEmailVerified && !doctor.emailVerified) {
      throw new Error("Doctor account is inactive or not verified");
    }
    const token = generateToken({
      id: doctor.id,
      email: doctor.email,
      role: doctor.role,
      patientId: void 0
    });
    // Delete old sessions for this user to prevent duplicate token errors
    await database_default.userSession.deleteMany({
      where: { userId: doctor.id }
    });
    await database_default.userSession.create({
      data: {
        userId: doctor.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
      }
    });
    const user = await this.enrichUserForClient(doctor.id);
    return { user, token, expiresIn: 86400 };
  }
  /** Linked doctor switches back to their super admin account. */
  async switchToAdminPersona(doctorUserId) {
    const admin = await database_default.user.findFirst({
      where: { clinicalPersonaUserId: doctorUserId, role: import_client2.UserRole.SUPER_ADMIN }
    });
    if (!admin) {
      throw new Error("No super admin account is linked to this doctor login");
    }
    const requireEmailVerified = process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === "true" || process.env.REQUIRE_EMAIL_VERIFIED_FOR_LOGIN === "1";
    if (!admin.isActive || !admin.isApproved || requireEmailVerified && !admin.emailVerified) {
      throw new Error("Admin account is not available");
    }
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      patientId: void 0
    });
    // Delete old sessions for this user to prevent duplicate token errors
    await database_default.userSession.deleteMany({
      where: { userId: admin.id }
    });
    await database_default.userSession.create({
      data: {
        userId: admin.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
      }
    });
    const user = await this.enrichUserForClient(admin.id);
    return { user, token, expiresIn: 86400 };
  }
  async logout(token) {
    await database_default.userSession.deleteMany({
      where: { token }
    });
  }
  async getCurrentUser(userId) {
    return this.enrichUserForClient(userId);
  }
  async verifyEmail(token) {
    const user = await database_default.user.findFirst({
      where: {
        emailVerificationToken: token,
        isApproved: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    });
    if (!user) {
      throw new Error("Invalid or expired verification token");
    }
    await database_default.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: /* @__PURE__ */ new Date(),
        emailVerificationToken: null
      }
    });
    return user;
  }
  async getDoctors() {
    return database_default.user.findMany({
      where: {
        role: "DOCTOR",
        isActive: true,
        isApproved: true
      },
      select: {
        id: true,
        fullName: true,
        department: true,
        employmentType: true
      },
      orderBy: { fullName: "asc" }
    });
  }
};

// src/controllers/auth.controller.ts
var authService = new AuthService();
var AuthController = class {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Registration submitted for approval",
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async registerPatient(req, res) {
    try {
      const user = await authService.registerPatientPortal(req.body);
      res.status(201).json({
        success: true,
        message: "Patient portal account created. You can sign in now.",
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async login(req, res) {
    try {
      const { email, password, otp } = req.body;
      const result = await authService.login(email, password, otp);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === "FIRST_LOGIN_OTP_REQUIRED") {
        res.status(403).json({
          success: false,
          error: "First login OTP required",
          errorCode: "OTP_REQUIRED",
          requiresOTP: true
        });
        return;
      }
      res.status(401).json({
        success: false,
        error: error.message,
        errorCode: "AUTH_FAILED"
      });
    }
  }
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        await authService.logout(token);
      }
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async me(req, res) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async verifyEmail(req, res) {
    try {
      const token = String(req.query.token || "").trim();
      if (!token) {
        res.status(400).json({
          success: false,
          error: "Verification token is required"
        });
        return;
      }
      const user = await authService.verifyEmail(token);
      res.json({
        success: true,
        message: "Email verified successfully",
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getDoctors(_req, res) {
    try {
      const doctors = await authService.getDoctors();
      res.json({
        success: true,
        data: doctors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async switchToClinical(req, res) {
    try {
      const result = await authService.switchToClinicalPersona(req.user.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
  async switchToAdmin(req, res) {
    try {
      const result = await authService.switchToAdminPersona(req.user.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

// src/middleware/auth.ts
var authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "No token provided",
        errorCode: "NO_TOKEN"
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const errorCode = error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID";
    const errorMessage = error.name === "TokenExpiredError" ? "Token has expired" : "Invalid or expired token";
    res.status(401).json({
      success: false,
      error: errorMessage,
      errorCode
    });
  }
};
var authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        errorCode: "NO_TOKEN"
      });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Forbidden - Insufficient permissions",
        errorCode: "FORBIDDEN"
      });
      return;
    }
    next();
  };
};

// src/middleware/rateLimiters.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var isProd = process.env.NODE_ENV === "production";
var loginRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: isProd ? 25 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many login attempts from this location. Please wait a few minutes and try again."
    });
  }
});
var registerRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 60 * 1e3,
  max: isProd ? 12 : 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many registration attempts. Please try again later or contact the clinic administrator."
    });
  }
});

// src/middleware/validation.ts
var import_zod = require("zod");
var validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof import_zod.z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: "Validation failed",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
};

// src/routes/auth.routes.ts
var import_zod2 = require("zod");
var router = (0, import_express.Router)();
var authController = new AuthController();
var registerSchema = import_zod2.z.object({
  email: import_zod2.z.string().email("Invalid email format"),
  password: import_zod2.z.string().min(8, "Password must be at least 8 characters"),
  fullName: import_zod2.z.string().min(2, "Full name is required"),
  phone: import_zod2.z.string().optional(),
  role: import_zod2.z.enum(["SUPER_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB_TECH", "FINANCE", "EMERGENCY", "INJECTION_ROOM"]),
  department: import_zod2.z.string().optional(),
  employmentType: import_zod2.z.enum(["FULL_TIME", "PART_TIME"]).optional()
});
var registerPatientSchema = import_zod2.z.object({
  email: import_zod2.z.string().email("Invalid email format"),
  password: import_zod2.z.string().min(8, "Password must be at least 8 characters"),
  fullName: import_zod2.z.string().min(2, "Full name is required"),
  cardNumber: import_zod2.z.string().min(3, "Clinic card number is required"),
  dateOfBirth: import_zod2.z.string().min(8, "Date of birth is required")
});
var loginSchema = import_zod2.z.object({
  email: import_zod2.z.string().email("Invalid email format"),
  password: import_zod2.z.string().min(1, "Password is required")
});
router.post(
  "/register",
  registerRateLimiter,
  validate(registerSchema),
  authController.register.bind(authController)
);
router.post(
  "/register-patient",
  registerRateLimiter,
  validate(registerPatientSchema),
  authController.registerPatient.bind(authController)
);
router.post("/login", loginRateLimiter, validate(loginSchema), authController.login.bind(authController));
router.post("/logout", authenticate, authController.logout.bind(authController));
router.get("/me", authenticate, authController.me.bind(authController));
router.get("/verify-email", authController.verifyEmail.bind(authController));
router.get("/doctors", authenticate, authController.getDoctors.bind(authController));
router.post(
  "/switch-clinical",
  authenticate,
  authorize("SUPER_ADMIN"),
  authController.switchToClinical.bind(authController)
);
router.post(
  "/switch-admin",
  authenticate,
  authorize("DOCTOR"),
  authController.switchToAdmin.bind(authController)
);
var auth_routes_default = router;

// src/routes/patient.routes.ts
var import_express2 = require("express");

// src/services/patient.service.ts
init_database();

// src/utils/withDb.ts
var import_client3 = require("@prisma/client");
async function withDb(fn) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof import_client3.Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          throw new Error("A record with this unique value already exists");
        case "P2003":
          throw new Error("Invalid reference: related record was not found");
        case "P2025":
          throw new Error("Record not found");
        default:
          throw new Error(e.message || "Database error");
      }
    }
    throw e;
  }
}

// src/services/patient.service.ts
var PatientService = class {
  async createPatient(data, registeredById) {
    if (!data?.fullName || !String(data.fullName).trim()) {
      throw new Error("fullName is required");
    }
    if (!data?.sex || !["MALE", "FEMALE"].includes(data.sex)) {
      throw new Error("sex must be MALE or FEMALE");
    }
    if (!data?.dateOfBirth) {
      throw new Error("dateOfBirth is required");
    }
    const dob = new Date(data.dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      throw new Error("dateOfBirth is invalid");
    }
    const registrar = await database_default.user.findUnique({
      where: { id: registeredById },
      select: { id: true }
    });
    if (!registrar) {
      throw new Error("Registering user not found");
    }
    return withDb(async () => {
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      const count = await database_default.patient.count();
      const cardNumber = `RH-${year}-${String(count + 1).padStart(5, "0")}`;
      return database_default.patient.create({
        data: {
          cardNumber,
          fullName: String(data.fullName).trim(),
          sex: data.sex,
          dateOfBirth: dob,
          phone: data.phone,
          address: data.address,
          kebele: data.kebele,
          wereda: data.wereda,
          photoUrl: data.photoUrl,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies,
          bloodType: data.bloodType,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
          // Enhanced medical history fields
          hasAllergies: data.hasAllergies || false,
          allergyDetails: data.allergyDetails,
          hasDiabetes: data.hasDiabetes || false,
          hasHypertension: data.hasHypertension || false,
          hasAsthma: data.hasAsthma || false,
          hasHeartDisease: data.hasHeartDisease || false,
          hasKidneyDisease: data.hasKidneyDisease || false,
          hasEpilepsy: data.hasEpilepsy || false,
          currentMedications: data.currentMedications,
          familyHistory: data.familyHistory,
          surgicalHistory: data.surgicalHistory,
          socialHistory: data.socialHistory,
          // Data integrity fields
          isIncomplete: data.isIncomplete || false,
          incompleteReason: data.incompleteReason,
          registeredById
        },
        include: {
          registeredBy: {
            select: {
              id: true,
              fullName: true,
              role: true
            }
          }
        }
      });
    });
  }
  async getPatients(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.isIncomplete !== void 0) {
      where.isIncomplete = params.isIncomplete;
    }
    if (!params.showArchived) {
      where.archivedAt = null;
    }
    if (params.search) {
      where.OR = [
        { fullName: { contains: params.search, mode: "insensitive" } },
        { cardNumber: { contains: params.search, mode: "insensitive" } },
        { phone: { contains: params.search } }
      ];
    }
    const [patients, total] = await Promise.all([
      database_default.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          registeredBy: {
            select: {
              fullName: true,
              role: true
            }
          },
          visits: {
            select: {
              visitDate: true
            },
            orderBy: {
              visitDate: "desc"
            },
            take: 1
          }
        }
      }),
      database_default.patient.count({ where })
    ]);
    return {
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getPatientById(id) {
    const patient = await database_default.patient.findUnique({
      where: { id },
      include: {
        registeredBy: {
          select: {
            fullName: true,
            role: true
          }
        },
        visits: {
          orderBy: { visitDate: "desc" },
          take: 10,
          include: {
            assignedDoctor: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    });
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  }
  async updatePatient(id, data) {
    return withDb(async () => {
      const existing = await database_default.patient.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Patient not found");
      }
      const patch = {};
      const assign = (key, val) => {
        if (val === void 0) return;
        patch[key] = val;
      };
      assign("fullName", data.fullName !== void 0 ? String(data.fullName).trim() : void 0);
      assign("phone", data.phone);
      assign("address", data.address);
      assign("kebele", data.kebele);
      assign("wereda", data.wereda);
      assign("photoUrl", data.photoUrl);
      assign("medicalHistory", data.medicalHistory);
      assign("allergies", data.allergies);
      assign("bloodType", data.bloodType);
      assign("emergencyContactName", data.emergencyContactName);
      assign("emergencyContactPhone", data.emergencyContactPhone);
      if (Object.keys(patch).length === 0) {
        throw new Error("No valid fields to update");
      }
      return database_default.patient.update({
        where: { id },
        data: patch,
        include: {
          registeredBy: {
            select: {
              fullName: true,
              role: true
            }
          }
        }
      });
    });
  }
  async getPatientHistory(id) {
    const patient = await database_default.patient.findUnique({
      where: { id },
      include: {
        visits: {
          orderBy: { visitDate: "desc" },
          include: {
            assignedDoctor: {
              select: {
                fullName: true
              }
            },
            prescriptions: {
              include: {
                items: true
              }
            },
            labOrders: {
              include: {
                items: true
              }
            },
            ultrasoundOrders: true
          }
        }
      }
    });
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  }
  async deletePatient(id) {
    return withDb(async () => {
      const patient = await database_default.patient.findUnique({
        where: { id },
        include: {
          visits: true,
          prescriptions: true,
          labOrders: true,
          ultrasoundOrders: true,
          injectionOrders: true,
          transactions: true,
          invoices: true
        }
      });
      if (!patient) {
        throw new Error("Patient not found");
      }
      if (patient.visits.length > 0) {
        throw new Error("Cannot delete patient with existing visits. Please archive instead.");
      }
      await database_default.patient.delete({
        where: { id }
      });
      return { id, deleted: true };
    });
  }
  /**
   * Check for duplicate patients using fuzzy matching
   */
  async checkDuplicates(data) {
    const matches = [];
    const candidates = await database_default.patient.findMany({
      where: {
        archivedAt: null,
        // Only check active patients
        OR: [
          // Fuzzy name match
          { fullName: { contains: data.fullName.split(" ")[0], mode: "insensitive" } },
          // Phone match
          ...data.phone ? [{ phone: data.phone }] : []
        ]
      },
      include: {
        // visits: { // visits relation doesn't exist on Patient model
        // orderBy: { visitDate: 'desc' },
        // take: 1,
        // },
      },
      take: 10
    });
    for (const candidate of candidates) {
      let score = 0;
      const reasons = [];
      const nameSimilarity = this.calculateNameSimilarity(
        data.fullName.toLowerCase(),
        candidate.fullName.toLowerCase()
      );
      if (nameSimilarity > 0.7) {
        score += nameSimilarity * 50;
        reasons.push(`Name similarity: ${Math.round(nameSimilarity * 100)}%`);
      }
      if (data.dateOfBirth && candidate.dateOfBirth) {
        const inputDob = new Date(data.dateOfBirth).toISOString().split("T")[0];
        const candidateDob = candidate.dateOfBirth.toISOString().split("T")[0];
        if (inputDob === candidateDob) {
          score += 30;
          reasons.push("Exact date of birth match");
        }
      }
      if (data.phone && candidate.phone && data.phone === candidate.phone) {
        score += 20;
        reasons.push("Phone number match");
      }
      if (score >= 50) {
        matches.push({
          patient: {
            id: candidate.id,
            cardNumber: candidate.cardNumber,
            fullName: candidate.fullName,
            sex: candidate.sex,
            dateOfBirth: candidate.dateOfBirth,
            phone: candidate.phone,
            photoUrl: candidate.photoUrl,
            lastVisit: null
            // candidate.visits[0]?.visitDate || null,
          },
          similarityScore: Math.min(Math.round(score), 100),
          matchReasons: reasons
        });
      }
    }
    matches.sort((a, b) => b.similarityScore - a.similarityScore);
    return matches;
  }
  /**
   * Simple name similarity calculation
   */
  calculateNameSimilarity(name1, name2) {
    const words1 = name1.split(/\s+/).filter((w) => w.length > 2);
    const words2 = name2.split(/\s+/).filter((w) => w.length > 2);
    if (words1.length === 0 || words2.length === 0) return 0;
    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }
    return matches / Math.max(words1.length, words2.length);
  }
  /**
   * Archive a patient (soft delete)
   */
  async archivePatient(id, reason, archivedBy) {
    return withDb(async () => {
      const patient = await database_default.patient.findUnique({
        where: { id },
        include: {
          visits: true
        }
      });
      if (!patient) {
        throw new Error("Patient not found");
      }
      if (patient.archivedAt) {
        throw new Error("Patient is already archived");
      }
      const archived = await database_default.patient.update({
        where: { id },
        data: {
          archivedAt: /* @__PURE__ */ new Date(),
          archivedBy,
          archivedReason: reason
        },
        include: {
          registeredBy: {
            select: {
              fullName: true,
              role: true
            }
          }
        }
      });
      return archived;
    });
  }
  /**
   * Restore an archived patient
   */
  async restorePatient(id) {
    return withDb(async () => {
      const patient = await database_default.patient.findUnique({
        where: { id }
      });
      if (!patient) {
        throw new Error("Patient not found");
      }
      if (!patient.archivedAt) {
        throw new Error("Patient is not archived");
      }
      return database_default.patient.update({
        where: { id },
        data: {
          archivedAt: null,
          archivedBy: null,
          archivedReason: null
        }
      });
    });
  }
  /**
   * Complete an incomplete patient registration
   */
  async completeRegistration(id, data) {
    return withDb(async () => {
      const patient = await database_default.patient.findUnique({
        where: { id }
      });
      if (!patient) {
        throw new Error("Patient not found");
      }
      if (!patient.isIncomplete) {
        throw new Error("Patient registration is already complete");
      }
      const patch = {
        isIncomplete: false,
        incompleteReason: null
      };
      if (data.phone) patch.phone = data.phone;
      if (data.address) patch.address = data.address;
      if (data.emergencyContactName) patch.emergencyContactName = data.emergencyContactName;
      if (data.emergencyContactPhone) patch.emergencyContactPhone = data.emergencyContactPhone;
      if (data.medicalHistory) patch.medicalHistory = data.medicalHistory;
      if (data.allergies) patch.allergies = data.allergies;
      if (data.bloodType) patch.bloodType = data.bloodType;
      if (data.hasAllergies !== void 0) patch.hasAllergies = data.hasAllergies;
      if (data.allergyDetails) patch.allergyDetails = data.allergyDetails;
      if (data.hasDiabetes !== void 0) patch.hasDiabetes = data.hasDiabetes;
      if (data.hasHypertension !== void 0) patch.hasHypertension = data.hasHypertension;
      if (data.hasAsthma !== void 0) patch.hasAsthma = data.hasAsthma;
      if (data.hasHeartDisease !== void 0) patch.hasHeartDisease = data.hasHeartDisease;
      if (data.hasKidneyDisease !== void 0) patch.hasKidneyDisease = data.hasKidneyDisease;
      if (data.hasEpilepsy !== void 0) patch.hasEpilepsy = data.hasEpilepsy;
      if (data.currentMedications) patch.currentMedications = data.currentMedications;
      if (data.familyHistory) patch.familyHistory = data.familyHistory;
      if (data.surgicalHistory) patch.surgicalHistory = data.surgicalHistory;
      if (data.socialHistory) patch.socialHistory = data.socialHistory;
      return database_default.patient.update({
        where: { id },
        data: patch,
        include: {
          registeredBy: {
            select: {
              fullName: true,
              role: true
            }
          }
        }
      });
    });
  }
  /**
   * Get patient visits with full details
   */
  async getPatientVisits(patientId) {
    const visits = await database_default.patientVisit.findMany({
      where: { patientId },
      orderBy: { visitDate: "desc" },
      include: {
        assignedDoctor: {
          select: {
            id: true,
            fullName: true
          }
        },
        triageRecords: {
          orderBy: { triageAt: "desc" },
          take: 1
        },
        doctorEncounters: {
          orderBy: { startedAt: "desc" }
        }
      }
    });
    return visits.map((visit) => ({
      id: visit.id,
      visitDate: visit.visitDate,
      visitType: visit.visitType,
      chiefComplaint: visit.triageRecords[0]?.chiefComplaint,
      diagnosis: visit.doctorEncounters[0]?.primaryDiagnosis,
      doctorName: visit.assignedDoctor?.fullName || "Not assigned",
      status: visit.status
    }));
  }
  /**
   * Get patient lab results
   */
  async getPatientLabResults(patientId) {
    const labOrders = await database_default.labOrder.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            test: true
          }
        }
      }
    });
    const results = [];
    for (const order of labOrders) {
      for (const item of order.items) {
        results.push({
          id: item.id,
          testName: item.testName,
          result: item.result || "Pending",
          status: item.status,
          orderedDate: order.createdAt,
          completedDate: item.completedAt,
          isAbnormal: item.isAbnormal || false
        });
      }
    }
    return results;
  }
  /**
   * Get patient prescriptions
   */
  async getPatientPrescriptions(patientId) {
    const prescriptions = await database_default.prescription.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            drug: true
          }
        }
      }
    });
    const results = [];
    for (const prescription of prescriptions) {
      for (const item of prescription.items) {
        results.push({
          id: item.id,
          medicationName: item.drugName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          prescribedDate: prescription.createdAt,
          status: prescription.status
        });
      }
    }
    return results;
  }
  /**
   * Get patient vital signs history
   */
  async getPatientVitals(patientId) {
    const vitals = await database_default.vitalSigns.findMany({
      where: {
        visit: {
          patientId
        }
      },
      orderBy: { recordedAt: "desc" },
      take: 50
      // Last 50 vital sign records
    });
    return vitals.map((vital) => ({
      id: vital.id,
      recordedDate: vital.recordedAt,
      bloodPressure: vital.bloodPressure,
      heartRate: vital.heartRate,
      temperature: vital.temperature,
      oxygenSaturation: vital.oxygenSaturation,
      weight: vital.weight
    }));
  }
};

// src/controllers/patient.controller.ts
var patientService = new PatientService();
var PatientController = class {
  async createPatient(req, res) {
    try {
      const patient = await patientService.createPatient(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPatients(req, res) {
    try {
      const { page, limit, search } = req.query;
      const result = await patientService.getPatients({
        page: page ? Number(page) : void 0,
        limit: limit ? Number(limit) : void 0,
        search
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPatientById(req, res) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      res.json({
        success: true,
        data: patient
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async updatePatient(req, res) {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      res.json({
        success: true,
        message: "Patient updated successfully",
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPatientHistory(req, res) {
    try {
      const history = await patientService.getPatientHistory(req.params.id);
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async deletePatient(req, res) {
    try {
      const result = await patientService.deletePatient(req.params.id);
      res.json({
        success: true,
        message: "Patient deleted successfully",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async checkDuplicates(req, res) {
    try {
      const { fullName, dateOfBirth, phone } = req.body;
      if (!fullName) {
        res.status(400).json({
          success: false,
          error: "fullName is required"
        });
        return;
      }
      const matches = await patientService.checkDuplicates({
        fullName,
        dateOfBirth,
        phone
      });
      res.json({
        success: true,
        data: {
          matches,
          count: matches.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async archivePatient(req, res) {
    try {
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        res.status(400).json({
          success: false,
          error: "Archive reason is required"
        });
        return;
      }
      const patient = await patientService.archivePatient(
        req.params.id,
        reason,
        req.user.id
      );
      res.json({
        success: true,
        message: "Patient archived successfully",
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async restorePatient(req, res) {
    try {
      const patient = await patientService.restorePatient(req.params.id);
      res.json({
        success: true,
        message: "Patient restored successfully",
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async completeRegistration(req, res) {
    try {
      const patient = await patientService.completeRegistration(
        req.params.id,
        req.body
      );
      res.json({
        success: true,
        message: "Patient registration completed successfully",
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPatientVisits(req, res) {
    try {
      const { patientId } = req.params;
      const visits = await patientService.getPatientVisits(patientId);
      res.json({
        success: true,
        data: visits
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getPatientLabResults(req, res) {
    try {
      const { patientId } = req.params;
      const results = await patientService.getPatientLabResults(patientId);
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getPatientPrescriptions(req, res) {
    try {
      const { patientId } = req.params;
      const prescriptions = await patientService.getPatientPrescriptions(patientId);
      res.json({
        success: true,
        data: prescriptions
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getPatientVitals(req, res) {
    try {
      const { patientId } = req.params;
      const vitals = await patientService.getPatientVitals(patientId);
      res.json({
        success: true,
        data: vitals
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
var patientController = new PatientController();

// src/routes/patient.routes.ts
var import_zod3 = require("zod");
var router2 = (0, import_express2.Router)();
var patientController2 = new PatientController();
var createPatientSchema = import_zod3.z.object({
  fullName: import_zod3.z.string().min(2, "Full name is required"),
  sex: import_zod3.z.enum(["MALE", "FEMALE"]),
  dateOfBirth: import_zod3.z.string(),
  phone: import_zod3.z.string().optional(),
  address: import_zod3.z.string().optional(),
  kebele: import_zod3.z.string().optional(),
  wereda: import_zod3.z.string().optional(),
  photoUrl: import_zod3.z.string().optional(),
  medicalHistory: import_zod3.z.string().optional(),
  allergies: import_zod3.z.string().optional(),
  bloodType: import_zod3.z.string().optional(),
  emergencyContactName: import_zod3.z.string().optional(),
  emergencyContactPhone: import_zod3.z.string().optional(),
  // Enhanced medical history fields
  hasAllergies: import_zod3.z.boolean().optional(),
  allergyDetails: import_zod3.z.string().optional(),
  hasDiabetes: import_zod3.z.boolean().optional(),
  hasHypertension: import_zod3.z.boolean().optional(),
  hasAsthma: import_zod3.z.boolean().optional(),
  hasHeartDisease: import_zod3.z.boolean().optional(),
  hasKidneyDisease: import_zod3.z.boolean().optional(),
  hasEpilepsy: import_zod3.z.boolean().optional(),
  currentMedications: import_zod3.z.string().optional(),
  familyHistory: import_zod3.z.string().optional(),
  surgicalHistory: import_zod3.z.string().optional(),
  socialHistory: import_zod3.z.string().optional(),
  // Data integrity fields
  isIncomplete: import_zod3.z.boolean().optional(),
  incompleteReason: import_zod3.z.string().optional()
});
var checkDuplicatesSchema = import_zod3.z.object({
  fullName: import_zod3.z.string().min(2, "Full name is required"),
  dateOfBirth: import_zod3.z.string().optional(),
  phone: import_zod3.z.string().optional()
});
var archivePatientSchema = import_zod3.z.object({
  reason: import_zod3.z.string().min(5, "Archive reason must be at least 5 characters")
});
router2.use(authenticate);
router2.post(
  "/",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  validate(createPatientSchema),
  patientController2.createPatient.bind(patientController2)
);
router2.get("/", patientController2.getPatients.bind(patientController2));
router2.get("/:id", patientController2.getPatientById.bind(patientController2));
router2.get("/:id/history", patientController2.getPatientHistory.bind(patientController2));
router2.get("/:patientId/visits", patientController2.getPatientVisits.bind(patientController2));
router2.get("/:patientId/lab-results", patientController2.getPatientLabResults.bind(patientController2));
router2.get("/:patientId/prescriptions", patientController2.getPatientPrescriptions.bind(patientController2));
router2.get("/:patientId/vitals", patientController2.getPatientVitals.bind(patientController2));
router2.put("/:id", patientController2.updatePatient.bind(patientController2));
router2.delete(
  "/:id",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  patientController2.deletePatient.bind(patientController2)
);
router2.post(
  "/check-duplicates",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  validate(checkDuplicatesSchema),
  patientController2.checkDuplicates.bind(patientController2)
);
router2.put(
  "/:id/archive",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  validate(archivePatientSchema),
  patientController2.archivePatient.bind(patientController2)
);
router2.put(
  "/:id/restore",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  patientController2.restorePatient.bind(patientController2)
);
router2.put(
  "/:id/complete-registration",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  patientController2.completeRegistration.bind(patientController2)
);
var patient_routes_default = router2;

// src/routes/visit.routes.ts
var import_express3 = require("express");

// src/services/visit.service.ts
init_database();

// src/services/notification.service.ts
var import_client4 = require("@prisma/client");
var prisma2 = new import_client4.PrismaClient();
var NotificationService = class {
  /**
   * Get user notifications
   */
  async getUserNotifications(userId, options) {
    const where = { userId };
    if (options?.unreadOnly) {
      where.isRead = false;
    }
    const notifications = await prisma2.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit || 50
    });
    return notifications;
  }
  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return await prisma2.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }
  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await prisma2.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    return await prisma2.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: /* @__PURE__ */ new Date()
      }
    });
  }
  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    return await prisma2.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: /* @__PURE__ */ new Date()
      }
    });
  }
  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    const notification = await prisma2.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    return await prisma2.notification.delete({
      where: { id: notificationId }
    });
  }
  /**
   * Create notification
   */
  async createNotification(data) {
    return await prisma2.notification.create({
      data: {
        ...data,
        isRead: false
      }
    });
  }
  /**
   * Notify multiple users
   */
  async notifyMultipleUsers(userIds, data) {
    const notifications = userIds.map((userId) => ({
      userId,
      ...data,
      isRead: false
    }));
    return await prisma2.notification.createMany({
      data: notifications
    });
  }
  /**
   * Notify by role
   */
  async notifyByRole(role, data) {
    const users = await prisma2.user.findMany({
      where: {
        role,
        isActive: true
      },
      select: { id: true }
    });
    const userIds = users.map((u) => u.id);
    return await this.notifyMultipleUsers(userIds, data);
  }
  /**
   * Create lab result notification
   */
  async notifyLabResult(labOrderId) {
    const labOrder = await prisma2.labOrder.findUnique({
      where: { id: labOrderId },
      include: {
        orderedBy: true,
        patient: {
          select: {
            fullName: true
          }
        },
        items: {
          where: {
            isAbnormal: true
          }
        }
      }
    });
    if (!labOrder) return;
    const hasAbnormal = labOrder.items.length > 0;
    const priority = hasAbnormal ? "HIGH" : "NORMAL";
    await this.createNotification({
      userId: labOrder.orderedById,
      notificationType: hasAbnormal ? "CRITICAL_LAB_RESULT" : "LAB_RESULT",
      title: hasAbnormal ? "\u26A0\uFE0F Abnormal Lab Results" : "Lab Results Available",
      message: `Lab results for ${labOrder.patient.fullName} are ready${hasAbnormal ? " with abnormal values" : ""}`,
      relatedId: labOrderId,
      actionUrl: `/doctor/orders?orderId=${labOrderId}`
    });
  }
  /**
   * Create adverse event notification
   */
  async notifyAdverseEvent(injectionAdministrationId) {
    const administration = await prisma2.injectionAdministration.findUnique({
      where: { id: injectionAdministrationId },
      include: {
        injectionOrder: {
          include: {
            orderedBy: true,
            patient: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    });
    if (!administration || !administration.adverseEventOccurred) return;
    await this.createNotification({
      userId: administration.injectionOrder.orderedById,
      notificationType: "ADVERSE_EVENT",
      title: "\u{1F6A8} Adverse Event Reported",
      message: `Adverse event during injection for ${administration.injectionOrder.patient.fullName}: ${administration.adverseEventDetails}`,
      relatedId: injectionAdministrationId,
      actionUrl: `/nurse/injection-queue?administrationId=${injectionAdministrationId}`
    });
    await this.notifyByRole("DOCTOR", {
      notificationType: "ADVERSE_EVENT",
      title: "\u{1F6A8} Adverse Event Alert",
      message: `Adverse event reported for ${administration.injectionOrder.patient.fullName}`,
      relatedId: injectionAdministrationId
    });
  }
  /**
   * Create critical patient notification
   */
  async notifyCriticalPatient(visitId) {
    const visit = await prisma2.patientVisit.findUnique({
      where: { id: visitId },
      include: {
        patient: {
          select: {
            fullName: true
          }
        },
        assignedDoctor: true
      }
    });
    if (!visit || visit.triageLevel !== "CRITICAL") return;
    if (visit.assignedDoctorId) {
      await this.createNotification({
        userId: visit.assignedDoctorId,
        notificationType: "CRITICAL_PATIENT",
        title: "\u{1F6A8} Critical Patient Alert",
        message: `Critical patient ${visit.patient.fullName} requires immediate attention`,
        relatedId: visitId,
        actionUrl: `/doctor/queue`
      });
    }
  }
};
var notificationService = new NotificationService();

// src/services/finance.service.ts
init_database();
var FinanceService = class {
  /**
   * Get comprehensive financial report
   */
  async getFinancialReport(startDate, endDate) {
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        patient: {
          select: {
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    const revenueByType = transactions.reduce((acc, t) => {
      const type = t.transactionType;
      if (!acc[type]) {
        acc[type] = { count: 0, amount: 0 };
      }
      acc[type].count += 1;
      acc[type].amount += t.amount;
      return acc;
    }, {});
    const paymentMethods = transactions.reduce((acc, t) => {
      const method = t.paymentMethod;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count += 1;
      acc[method].amount += t.amount;
      return acc;
    }, {});
    const dailyRevenue = transactions.reduce((acc, t) => {
      const date = t.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += t.amount;
      return acc;
    }, {});
    return {
      period: { startDate, endDate },
      totalRevenue: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
      totalTransactions: transactions.length,
      revenueByType,
      paymentMethods,
      dailyRevenue,
      transactions
    };
  }
  /**
   * Get outstanding receivables
   */
  async getOutstandingReceivables() {
    const pending = await database_default.financialTransaction.findMany({
      where: {
        paymentStatus: {
          in: ["PENDING"]
        }
      },
      include: {
        patient: {
          select: {
            fullName: true,
            cardNumber: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    const summary = {
      totalOutstanding: pending.reduce((sum, t) => sum + Number(t.amount), 0),
      count: pending.length,
      aged: {
        current: pending.filter((t) => {
          const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1e3 * 60 * 60 * 24));
          return days <= 30;
        }).length,
        thirtyDays: pending.filter((t) => {
          const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1e3 * 60 * 60 * 24));
          return days > 30 && days <= 60;
        }).length,
        sixtyDays: pending.filter((t) => {
          const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1e3 * 60 * 60 * 24));
          return days > 60 && days <= 90;
        }).length,
        ninetyPlus: pending.filter((t) => {
          const days = Math.floor((Date.now() - t.createdAt.getTime()) / (1e3 * 60 * 60 * 24));
          return days > 90;
        }).length
      },
      transactions: pending
    };
    return summary;
  }
  // Transaction Management
  async createTransaction(data) {
    if (!data?.transactionType || !String(data.transactionType).trim()) {
      throw new Error("transactionType is required");
    }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    if (!data.paymentMethod) {
      throw new Error("paymentMethod is required");
    }
    const count = await database_default.financialTransaction.count();
    const transactionNumber = `TXN-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(6, "0")}`;
    const transaction = await withDb(
      () => database_default.financialTransaction.create({
        data: {
          transactionNumber,
          patientId: data.patientId,
          visitId: data.visitId,
          transactionType: data.transactionType,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          paymentStatus: "PAID",
          referenceNumber: data.referenceNumber,
          description: data.description,
          collectedById: data.collectedById
        },
        include: {
          patient: {
            select: {
              cardNumber: true,
              fullName: true
            }
          },
          collectedBy: {
            select: {
              fullName: true
            }
          }
        }
      })
    );
    return transaction;
  }
  async getTransactions(params) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.startDate || params.endDate) {
      where.transactionDate = {};
      if (params.startDate) {
        where.transactionDate.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        const endDate = new Date(params.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.transactionDate.lte = endDate;
      }
    }
    if (params.paymentMethod) {
      where.paymentMethod = params.paymentMethod;
    }
    if (params.paymentStatus) {
      where.paymentStatus = params.paymentStatus;
    }
    if (params.transactionType) {
      where.transactionType = params.transactionType;
    }
    if (params.patientId) {
      where.patientId = params.patientId;
    }
    const [transactions, total] = await Promise.all([
      database_default.financialTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { transactionDate: "desc" },
        include: {
          patient: {
            select: {
              cardNumber: true,
              fullName: true
            }
          },
          collectedBy: {
            select: {
              fullName: true
            }
          }
        }
      }),
      database_default.financialTransaction.count({ where })
    ]);
    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async markTransactionPaid(id, referenceNumber) {
    const existing = await database_default.financialTransaction.findUnique({
      where: { id },
      select: { paymentStatus: true }
    });
    if (!existing) {
      throw new Error("Transaction not found");
    }
    if (existing.paymentStatus !== "PENDING") {
      throw new Error("Only pending transactions can be marked paid");
    }
    return withDb(
      () => database_default.financialTransaction.update({
        where: { id },
        data: {
          paymentStatus: "PAID",
          paymentMethod: "CASH",
          ...referenceNumber && { referenceNumber }
        },
        include: {
          patient: {
            select: {
              cardNumber: true,
              fullName: true
            }
          }
        }
      })
    );
  }
  async requestRefund(id, reason, requestedById) {
    const transaction = await database_default.financialTransaction.findUnique({
      where: { id }
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.paymentStatus !== "PAID") {
      throw new Error("Only paid transactions can be requested for refund");
    }
    await database_default.auditLog.create({
      data: {
        userId: requestedById,
        action: "REFUND_REQUESTED",
        resource: "financial_transactions",
        resourceId: id,
        newValues: {
          reason,
          requestedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    return {
      transactionId: id,
      status: "REQUESTED",
      reason
    };
  }
  async approveRefund(id, reason, approvedById) {
    const transaction = await database_default.financialTransaction.findUnique({
      where: { id }
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.paymentStatus !== "PAID") {
      throw new Error("Only paid transactions can be refunded");
    }
    const refunded = await database_default.financialTransaction.update({
      where: { id },
      data: {
        paymentStatus: "REFUNDED",
        description: `${transaction.description || ""} | REFUND_APPROVED: ${reason}`.trim()
      },
      include: {
        patient: {
          select: {
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    await database_default.auditLog.create({
      data: {
        userId: approvedById,
        action: "REFUND_APPROVED",
        resource: "financial_transactions",
        resourceId: id,
        newValues: {
          reason,
          approvedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      }
    });
    return refunded;
  }
  // Invoice Management
  async createInvoice(data) {
    if (!data?.patientId) {
      throw new Error("patientId is required");
    }
    if (!data.items?.length) {
      throw new Error("Invoice must include at least one line item");
    }
    for (const item of data.items) {
      if (!item.itemType?.trim() || !item.itemDescription?.trim()) {
        throw new Error("Each invoice item requires itemType and itemDescription");
      }
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        throw new Error("Each invoice item requires quantity greater than 0");
      }
      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        throw new Error("Each invoice item requires a non-negative unitPrice");
      }
    }
    const count = await database_default.invoice.count();
    const invoiceNumber = `INV-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(6, "0")}`;
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const invoice = await withDb(
      () => database_default.invoice.create({
        data: {
          invoiceNumber,
          patientId: data.patientId,
          visitId: data.visitId,
          totalAmount,
          paidAmount: 0,
          status: "UNPAID",
          issuedById: data.issuedById,
          items: {
            create: data.items.map((item) => ({
              itemType: item.itemType,
              itemDescription: item.itemDescription,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice
            }))
          }
        },
        include: {
          items: true,
          patient: {
            select: {
              cardNumber: true,
              fullName: true
            }
          },
          issuedBy: {
            select: {
              fullName: true
            }
          }
        }
      })
    );
    return invoice;
  }
  async getInvoices(params) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.patientId) {
      where.patientId = params.patientId;
    }
    if (params.startDate || params.endDate) {
      where.issuedAt = {};
      if (params.startDate) {
        where.issuedAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        const endDate = new Date(params.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.issuedAt.lte = endDate;
      }
    }
    const [invoices, total] = await Promise.all([
      database_default.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issuedAt: "desc" },
        include: {
          items: true,
          patient: {
            select: {
              cardNumber: true,
              fullName: true
            }
          },
          issuedBy: {
            select: {
              fullName: true
            }
          }
        }
      }),
      database_default.invoice.count({ where })
    ]);
    return {
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async payInvoice(id, amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }
    const invoice = await database_default.invoice.findUnique({ where: { id } });
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (invoice.status === "PAID") {
      throw new Error("Invoice is already paid");
    }
    const newPaidAmount = Number(invoice.paidAmount) + amount;
    const totalAmount = Number(invoice.totalAmount);
    let status = "UNPAID";
    if (newPaidAmount >= totalAmount) {
      status = "PAID";
    } else if (newPaidAmount > 0) {
      status = "PARTIALLY_PAID";
    }
    if (newPaidAmount > totalAmount + 1e-4) {
      throw new Error("Payment amount exceeds invoice balance");
    }
    const updatedInvoice = await withDb(
      () => database_default.invoice.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          status,
          ...status === "PAID" && { paidAt: /* @__PURE__ */ new Date() }
        },
        include: {
          items: true,
          patient: {
            select: {
              fullName: true,
              cardNumber: true
            }
          }
        }
      })
    );
    return updatedInvoice;
  }
  // Reports
  async getRevenueReport(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        transactionDate: { gte: start, lte: end },
        paymentStatus: "PAID"
      }
    });
    const totalRevenue = transactions.reduce(
      (sum, txn) => sum + Number(txn.amount),
      0
    );
    const byPaymentMethod = transactions.reduce((acc, txn) => {
      const method = txn.paymentMethod;
      acc[method] = (acc[method] || 0) + Number(txn.amount);
      return acc;
    }, {});
    const byType = transactions.reduce((acc, txn) => {
      const type = txn.transactionType;
      acc[type] = (acc[type] || 0) + Number(txn.amount);
      return acc;
    }, {});
    return {
      totalRevenue,
      transactionCount: transactions.length,
      byPaymentMethod,
      byType,
      period: { startDate, endDate }
    };
  }
  async getDailyRevenue(date) {
    const targetDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
    const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        transactionDate: { gte: startDate, lte: endDate },
        paymentStatus: "PAID"
      }
    });
    const totalRevenue = transactions.reduce(
      (sum, txn) => sum + Number(txn.amount),
      0
    );
    return {
      date: targetDate.toISOString().split("T")[0],
      totalRevenue,
      transactionCount: transactions.length,
      transactions
    };
  }
  /** Get daily revenue for RECEPTION/SUPER_ADMIN - only card fees and ultrasound fees */
  async getReceptionDailyRevenue(date) {
    const targetDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
    const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        transactionDate: { gte: startDate, lte: endDate },
        paymentStatus: "PAID",
        transactionType: {
          in: ["CARD_FEE", "ULTRASOUND_FEE"]
        }
      }
    });
    const totalRevenue = transactions.reduce(
      (sum, txn) => sum + Number(txn.amount),
      0
    );
    const byType = transactions.reduce((acc, txn) => {
      const type = txn.transactionType;
      acc[type] = (acc[type] || 0) + Number(txn.amount);
      return acc;
    }, {});
    return {
      date: targetDate.toISOString().split("T")[0],
      totalRevenue,
      transactionCount: transactions.length,
      byType,
      summary: {
        cardFees: byType["CARD_FEE"] || 0,
        ultrasoundFees: byType["ULTRASOUND_FEE"] || 0
      }
    };
  }
  /** Get daily revenue for FINANCE - excludes card fees and ultrasound fees */
  async getFinanceDailyRevenue(date) {
    const targetDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
    const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        transactionDate: { gte: startDate, lte: endDate },
        paymentStatus: "PAID",
        transactionType: {
          notIn: ["CARD_FEE", "ULTRASOUND_FEE"]
        }
      }
    });
    const totalRevenue = transactions.reduce(
      (sum, txn) => sum + Number(txn.amount),
      0
    );
    const byType = transactions.reduce((acc, txn) => {
      const type = txn.transactionType;
      acc[type] = (acc[type] || 0) + Number(txn.amount);
      return acc;
    }, {});
    return {
      date: targetDate.toISOString().split("T")[0],
      totalRevenue,
      transactionCount: transactions.length,
      byType,
      transactions
    };
  }
  /** Get pharmacy revenue - pharmacy sales only */
  async getPharmacyDailyRevenue(date) {
    const targetDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
    const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        transactionDate: { gte: startDate, lte: endDate },
        paymentStatus: "PAID",
        transactionType: {
          in: ["PHARMACY_SALE", "MEDICATION_PAYMENT"]
        }
      }
    });
    const totalRevenue = transactions.reduce(
      (sum, txn) => sum + Number(txn.amount),
      0
    );
    return {
      date: targetDate.toISOString().split("T")[0],
      totalRevenue,
      transactionCount: transactions.length,
      transactions
    };
  }
  async getDailyCloseoutSummary(date) {
    const targetDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);
    const transactions = await database_default.financialTransaction.findMany({
      where: {
        transactionDate: { gte: startDate, lte: endDate }
      }
    });
    const paid = transactions.filter((t) => t.paymentStatus === "PAID");
    const pending = transactions.filter((t) => t.paymentStatus === "PENDING");
    const refunded = transactions.filter((t) => t.paymentStatus === "REFUNDED");
    const totalCollected = paid.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalPending = pending.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalRefunded = refunded.reduce((sum, t) => sum + Number(t.amount), 0);
    const byMethod = paid.reduce(
      (acc, t) => {
        const key = t.paymentMethod;
        acc[key] = (acc[key] || 0) + Number(t.amount);
        return acc;
      },
      {}
    );
    return {
      date: startDate.toISOString().slice(0, 10),
      totalTransactions: transactions.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      refundedCount: refunded.length,
      totals: {
        collected: totalCollected,
        pending: totalPending,
        refunded: totalRefunded,
        net: totalCollected - totalRefunded
      },
      byMethod
    };
  }
  async createSystemCharge(data) {
    if (!data?.transactionType?.trim()) {
      throw new Error("transactionType is required");
    }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new Error("System charge amount must be greater than 0");
    }
    const count = await database_default.financialTransaction.count();
    const transactionNumber = `TXN-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(6, "0")}`;
    return withDb(
      () => database_default.financialTransaction.create({
        data: {
          transactionNumber,
          patientId: data.patientId,
          visitId: data.visitId,
          transactionType: data.transactionType,
          amount: data.amount,
          paymentMethod: "CASH",
          paymentStatus: "PENDING",
          description: data.description
        }
      })
    );
  }
  async createPaidSystemCharge(data) {
    if (!data?.transactionType?.trim()) {
      throw new Error("transactionType is required");
    }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new Error("System charge amount must be greater than 0");
    }
    const count = await database_default.financialTransaction.count();
    const transactionNumber = `TXN-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(6, "0")}`;
    return withDb(
      () => database_default.financialTransaction.create({
        data: {
          transactionNumber,
          patientId: data.patientId,
          visitId: data.visitId,
          transactionType: data.transactionType,
          amount: data.amount,
          paymentMethod: "CASH",
          paymentStatus: "PAID",
          description: data.description,
          collectedById: data.collectedById
        }
      })
    );
  }
};

// src/services/visit.service.ts
var notificationService2 = new NotificationService();
var financeService = new FinanceService();
var VISIT_STATUSES = ["REGISTERED", "IN_QUEUE", "IN_CONSULTATION", "COMPLETED"];
async function assertDoctorUser(userId) {
  const user = await database_default.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true }
  });
  if (!user) {
    throw new Error("Doctor not found");
  }
  if (user.role !== "DOCTOR" && user.role !== "SUPER_ADMIN") {
    throw new Error("Assigned user must be a doctor");
  }
}
var VisitService = class {
  async createVisit(data) {
    const patient = await database_default.patient.findUnique({
      where: { id: data.patientId },
      select: { id: true }
    });
    if (!patient) {
      throw new Error("Patient not found");
    }
    if (data.assignedDoctorId) {
      await assertDoctorUser(data.assignedDoctorId);
    }
    const lastVisit = await database_default.patientVisit.findFirst({
      where: { patientId: data.patientId },
      orderBy: { visitDate: "desc" }
    });
    let cardFee = 30;
    if (lastVisit && data.visitType === "REPEAT") {
      const daysSinceLastVisit = Math.floor(
        (Date.now() - lastVisit.visitDate.getTime()) / (1e3 * 60 * 60 * 24)
      );
      if (daysSinceLastVisit <= 30) {
        cardFee = 0;
      }
    }
    const visitCount = await database_default.patientVisit.count({
      where: { patientId: data.patientId }
    });
    const visit = await withDb(
      () => database_default.patientVisit.create({
        data: {
          patientId: data.patientId,
          visitNumber: visitCount + 1,
          visitType: data.visitType,
          visitDate: /* @__PURE__ */ new Date(),
          cardFee,
          serviceType: data.serviceType,
          assignedDoctorId: data.assignedDoctorId,
          status: "REGISTERED",
          registeredById: data.registeredById
        },
        include: {
          patient: {
            select: {
              id: true,
              cardNumber: true,
              fullName: true,
              sex: true,
              dateOfBirth: true,
              phone: true
            }
          },
          assignedDoctor: {
            select: {
              id: true,
              fullName: true,
              department: true
            }
          }
        }
      })
    );
    let totalRevenue = 0;
    if (Number(visit.cardFee) > 0) {
      await financeService.createPaidSystemCharge({
        patientId: visit.patientId,
        visitId: visit.id,
        transactionType: "CARD_FEE",
        amount: Number(visit.cardFee),
        description: `Card fee for visit ${visit.visitNumber}`,
        collectedById: data.registeredById
      });
      totalRevenue += Number(visit.cardFee);
    }
    if (data.serviceType === "ULTRASOUND" && data.ultrasoundFee && data.ultrasoundFee > 0) {
      await financeService.createPaidSystemCharge({
        patientId: visit.patientId,
        visitId: visit.id,
        transactionType: "ULTRASOUND_FEE",
        amount: data.ultrasoundFee,
        description: `Ultrasound service fee - ${data.visitType === "FOLLOW_UP" ? "Follow-up" : "One-time"}`,
        collectedById: data.registeredById
      });
      totalRevenue += data.ultrasoundFee;
    }
    return { ...visit, totalRevenue };
  }
  async getVisits(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.date) {
      const startDate = new Date(params.date);
      const endDate = new Date(params.date);
      endDate.setHours(23, 59, 59, 999);
      where.visitDate = {
        gte: startDate,
        lte: endDate
      };
    }
    if (params.status) {
      where.status = params.status;
    }
    if (params.doctorId) {
      where.assignedDoctorId = params.doctorId;
    }
    if (params.serviceType) {
      where.serviceType = params.serviceType;
    }
    if (params.unassignedOnly) {
      where.assignedDoctorId = null;
    }
    const [visits, total] = await Promise.all([
      database_default.patientVisit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { visitDate: "desc" },
        include: {
          patient: {
            select: {
              id: true,
              cardNumber: true,
              fullName: true,
              sex: true,
              dateOfBirth: true,
              photoUrl: true
            }
          },
          assignedDoctor: {
            select: {
              fullName: true,
              department: true
            }
          }
        }
      }),
      database_default.patientVisit.count({ where })
    ]);
    const stats = await database_default.patientVisit.groupBy({
      by: ["status"],
      where: params.date ? {
        visitDate: {
          gte: new Date(params.date),
          lte: new Date(new Date(params.date).setHours(23, 59, 59, 999))
        }
      } : {},
      _count: true
    });
    return {
      visits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count;
        return acc;
      }, {})
    };
  }
  async getVisitById(id) {
    const visit = await database_default.patientVisit.findUnique({
      where: { id },
      include: {
        patient: true,
        assignedDoctor: {
          select: {
            fullName: true,
            department: true,
            phone: true
          }
        },
        prescriptions: {
          include: {
            items: true
          }
        },
        labOrders: {
          include: {
            items: true
          }
        },
        ultrasoundOrders: true,
        injectionOrders: true,
        transactions: true
      }
    });
    if (!visit) {
      throw new Error("Visit not found");
    }
    return visit;
  }
  async updateVisitStatus(id, status) {
    if (!VISIT_STATUSES.includes(status)) {
      throw new Error(`Invalid visit status: ${status}`);
    }
    return withDb(
      () => database_default.patientVisit.update({
        where: { id },
        data: { status },
        include: {
          patient: {
            select: {
              fullName: true,
              cardNumber: true
            }
          }
        }
      })
    );
  }
  async assignDoctor(visitId, doctorId) {
    await assertDoctorUser(doctorId);
    const visit = await withDb(
      () => database_default.patientVisit.update({
        where: { id: visitId },
        data: {
          assignedDoctorId: doctorId,
          status: "IN_QUEUE"
        },
        include: {
          patient: true,
          assignedDoctor: {
            select: {
              fullName: true,
              department: true
            }
          }
        }
      })
    );
    return visit;
  }
  async saveSoapNote(visitId, authorId, payload) {
    const visit = await database_default.patientVisit.findUnique({ where: { id: visitId } });
    if (!visit) {
      throw new Error("Visit not found");
    }
    if (!payload.patientId || payload.patientId !== visit.patientId) {
      throw new Error("patientId does not match this visit");
    }
    if (payload.isDraft !== true) {
      const required = ["chiefComplaint", "subjective", "objective", "assessment", "plan"];
      for (const key of required) {
        const v = payload[key];
        if (!v || !String(v).trim()) {
          throw new Error(`${key} is required`);
        }
      }
      if (String(payload.assessment).trim().length < 10) {
        throw new Error("assessment must be at least 10 characters");
      }
    }
    await database_default.auditLog.create({
      data: {
        userId: authorId,
        action: payload.isDraft ? "SOAP_NOTE_DRAFT_SAVED" : "SOAP_NOTE_SAVED",
        resource: "patient_visits",
        resourceId: visitId,
        newValues: payload
      }
    });
    return { visitId, saved: true };
  }
  async getEncounterTimeline(visitId) {
    const [visit, prescriptionRows, labRows, injectionRows, ultrasoundRows, txRows, logs] = await Promise.all([
      database_default.patientVisit.findUnique({
        where: { id: visitId },
        include: {
          registeredBy: { select: { fullName: true, role: true } },
          assignedDoctor: { select: { fullName: true, role: true } }
        }
      }),
      database_default.prescription.findMany({
        where: { visitId },
        select: { id: true, createdAt: true, status: true, doctor: { select: { fullName: true, role: true } } }
      }),
      database_default.labOrder.findMany({
        where: { visitId },
        select: { id: true, orderedAt: true, status: true, orderedBy: { select: { fullName: true, role: true } } }
      }),
      database_default.injectionOrder.findMany({
        where: { visitId },
        select: { id: true, createdAt: true, status: true, orderedBy: { select: { fullName: true, role: true } } }
      }),
      database_default.ultrasoundOrder.findMany({
        where: { visitId },
        select: { id: true, createdAt: true, status: true, orderedBy: { select: { fullName: true, role: true } } }
      }),
      database_default.financialTransaction.findMany({
        where: { visitId },
        select: {
          id: true,
          createdAt: true,
          transactionType: true,
          paymentStatus: true,
          collectedBy: { select: { fullName: true, role: true } }
        }
      }),
      database_default.auditLog.findMany({
        where: {
          OR: [{ resourceId: visitId }, { resource: "patient_visits", resourceId: visitId }]
        },
        orderBy: { timestamp: "desc" },
        include: { user: { select: { fullName: true, role: true } } },
        take: 100
      })
    ]);
    if (!visit) {
      throw new Error("Visit not found");
    }
    const synthesized = [
      {
        id: `visit-${visit.id}`,
        action: `VISIT_${visit.status}`,
        createdAt: visit.createdAt,
        resource: "patient_visits",
        user: visit.registeredBy || null
      },
      ...prescriptionRows.map((p) => ({
        id: `rx-${p.id}`,
        action: `PRESCRIPTION_${p.status}`,
        createdAt: p.createdAt,
        resource: "prescriptions",
        user: p.doctor || null
      })),
      ...labRows.map((l) => ({
        id: `lab-${l.id}`,
        action: `LAB_ORDER_${l.status}`,
        createdAt: l.orderedAt,
        resource: "lab_orders",
        user: l.orderedBy || null
      })),
      ...injectionRows.map((i) => ({
        id: `inj-${i.id}`,
        action: `INJECTION_ORDER_${i.status}`,
        createdAt: i.createdAt,
        resource: "injection_orders",
        user: i.orderedBy || null
      })),
      ...ultrasoundRows.map((u) => ({
        id: `us-${u.id}`,
        action: `ULTRASOUND_ORDER_${u.status}`,
        createdAt: u.createdAt,
        resource: "ultrasound_orders",
        user: u.orderedBy || null
      })),
      ...txRows.map((t) => ({
        id: `txn-${t.id}`,
        action: `${t.transactionType}_${t.paymentStatus}`,
        createdAt: t.createdAt,
        resource: "financial_transactions",
        user: t.collectedBy || null
      }))
    ];
    const merged = [...logs, ...synthesized].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 200);
    return merged;
  }
  async recordNurseVitals(visitId, userId, vitals) {
    const visit = await database_default.patientVisit.findUnique({ where: { id: visitId } });
    if (!visit) {
      throw new Error("Visit not found");
    }
    const nums = [
      ["bloodPressureSystolic", vitals.bloodPressureSystolic],
      ["bloodPressureDiastolic", vitals.bloodPressureDiastolic],
      ["temperature", vitals.temperature],
      ["heartRate", vitals.heartRate],
      ["respiratoryRate", vitals.respiratoryRate],
      ["oxygenSaturation", vitals.oxygenSaturation]
    ];
    for (const [name, val] of nums) {
      if (!Number.isFinite(val)) {
        throw new Error(`${name} must be a valid number`);
      }
    }
    if (vitals.weight !== void 0 && !Number.isFinite(vitals.weight)) {
      throw new Error("weight must be a valid number");
    }
    if (vitals.height !== void 0 && !Number.isFinite(vitals.height)) {
      throw new Error("height must be a valid number");
    }
    if (vitals.bmi !== void 0 && !Number.isFinite(vitals.bmi)) {
      throw new Error("bmi must be a valid number");
    }
    await database_default.auditLog.create({
      data: {
        userId,
        action: "NURSE_VITALS_RECORDED",
        resource: "patient_visits",
        resourceId: visitId,
        newValues: vitals
      }
    });
    return { visitId, recorded: true };
  }
};

// src/controllers/visit.controller.ts
var visitService = new VisitService();
var VisitController = class {
  async createVisit(req, res) {
    try {
      const visit = await visitService.createVisit({
        ...req.body,
        registeredById: req.user.id
      });
      res.status(201).json({
        success: true,
        message: "Visit created successfully",
        data: visit
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getVisits(req, res) {
    try {
      const { page, limit, date, status, doctorId, serviceType, unassignedOnly } = req.query;
      const result = await visitService.getVisits({
        page: page ? Number(page) : void 0,
        limit: limit ? Number(limit) : void 0,
        date,
        status,
        doctorId,
        serviceType,
        unassignedOnly: unassignedOnly === "true" || unassignedOnly === "1"
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async getVisitById(req, res) {
    try {
      const visit = await visitService.getVisitById(req.params.id);
      res.json({
        success: true,
        data: visit
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async updateVisitStatus(req, res) {
    try {
      const { status } = req.body;
      const visit = await visitService.updateVisitStatus(req.params.id, status);
      res.json({
        success: true,
        message: "Visit status updated",
        data: visit
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async assignDoctor(req, res) {
    try {
      const { doctorId } = req.body;
      const visit = await visitService.assignDoctor(req.params.id, doctorId);
      res.json({
        success: true,
        message: "Doctor assigned successfully",
        data: visit
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async saveSoapNote(req, res) {
    try {
      const result = await visitService.saveSoapNote(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({
        success: true,
        message: "SOAP note saved successfully",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getEncounterTimeline(req, res) {
    try {
      const timeline = await visitService.getEncounterTimeline(req.params.id);
      res.json({
        success: true,
        data: timeline
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async recordNurseVitals(req, res) {
    try {
      const result = await visitService.recordNurseVitals(
        req.params.id,
        req.user.id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Vital signs recorded",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

// src/routes/visit.routes.ts
var import_zod4 = require("zod");
var router3 = (0, import_express3.Router)();
var visitController = new VisitController();
var createVisitSchema = import_zod4.z.object({
  patientId: import_zod4.z.string().uuid(),
  visitType: import_zod4.z.enum(["NEW", "REPEAT", "FOLLOW_UP"]),
  serviceType: import_zod4.z.enum(["OPD", "ULTRASOUND", "EMERGENCY", "INJECTION"]),
  assignedDoctorId: import_zod4.z.string().uuid().optional()
});
var updateStatusSchema = import_zod4.z.object({
  status: import_zod4.z.enum(["REGISTERED", "IN_QUEUE", "IN_CONSULTATION", "COMPLETED"])
});
var assignDoctorSchema = import_zod4.z.object({
  doctorId: import_zod4.z.string().uuid()
});
var saveSoapSchema = import_zod4.z.object({
  patientId: import_zod4.z.string().uuid(),
  chiefComplaint: import_zod4.z.string().min(3),
  subjective: import_zod4.z.string().min(10),
  objective: import_zod4.z.string().min(10),
  assessment: import_zod4.z.string().min(10),
  plan: import_zod4.z.string().min(10),
  vitalSigns: import_zod4.z.object({
    bloodPressure: import_zod4.z.string().optional(),
    temperature: import_zod4.z.string().optional(),
    heartRate: import_zod4.z.string().optional(),
    respiratoryRate: import_zod4.z.string().optional(),
    oxygenSaturation: import_zod4.z.string().optional()
  }).optional(),
  isDraft: import_zod4.z.boolean().optional()
});
var nurseVitalsSchema = import_zod4.z.object({
  bloodPressureSystolic: import_zod4.z.number().min(50).max(250),
  bloodPressureDiastolic: import_zod4.z.number().min(30).max(150),
  temperature: import_zod4.z.number().min(35).max(42),
  heartRate: import_zod4.z.number().min(40).max(200),
  respiratoryRate: import_zod4.z.number().min(8).max(40),
  oxygenSaturation: import_zod4.z.number().min(70).max(100),
  weight: import_zod4.z.number().min(1).max(300).optional(),
  height: import_zod4.z.number().min(50).max(250).optional(),
  bmi: import_zod4.z.number().optional(),
  notes: import_zod4.z.string().optional()
});
router3.use(authenticate);
router3.post(
  "/",
  authorize("RECEPTIONIST", "SUPER_ADMIN", "NURSE"),
  validate(createVisitSchema),
  visitController.createVisit.bind(visitController)
);
router3.get("/", visitController.getVisits.bind(visitController));
router3.post(
  "/:id/nurse-vitals",
  authorize("NURSE", "SUPER_ADMIN"),
  validate(nurseVitalsSchema),
  visitController.recordNurseVitals.bind(visitController)
);
router3.get("/:id", visitController.getVisitById.bind(visitController));
router3.patch(
  "/:id/status",
  validate(updateStatusSchema),
  visitController.updateVisitStatus.bind(visitController)
);
router3.patch(
  "/:id/assign-doctor",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  validate(assignDoctorSchema),
  visitController.assignDoctor.bind(visitController)
);
router3.post(
  "/:id/soap",
  authorize("DOCTOR", "SUPER_ADMIN"),
  validate(saveSoapSchema),
  visitController.saveSoapNote.bind(visitController)
);
router3.get(
  "/:id/timeline",
  authorize("DOCTOR", "NURSE", "SUPER_ADMIN"),
  visitController.getEncounterTimeline.bind(visitController)
);
var visit_routes_default = router3;

// src/routes/prescription.routes.ts
var import_express4 = require("express");

// src/services/prescription.service.ts
init_database();
var PrescriptionService = class {
  async createPrescription(data) {
    if (!data.items?.length) {
      throw new Error("Prescription must include at least one line item");
    }
    for (const item of data.items) {
      if (!item.drugName?.trim()) {
        throw new Error("Each item requires drugName");
      }
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        throw new Error("Each item requires quantity greater than 0");
      }
    }
    const visit = await database_default.patientVisit.findUnique({
      where: { id: data.visitId },
      select: { id: true, patientId: true }
    });
    if (!visit) {
      throw new Error("Visit not found");
    }
    if (visit.patientId !== data.patientId) {
      throw new Error("patientId does not match this visit");
    }
    const doctor = await database_default.user.findUnique({
      where: { id: data.doctorId },
      select: { role: true }
    });
    if (!doctor || doctor.role !== "DOCTOR" && doctor.role !== "SUPER_ADMIN") {
      throw new Error("Invalid prescribing user");
    }
    for (const item of data.items) {
      if (item.drugId) {
        const drug = await database_default.drug.findUnique({
          where: { id: item.drugId },
          select: { id: true, isActive: true }
        });
        if (!drug) {
          throw new Error(`Drug not found: ${item.drugId}`);
        }
        if (!drug.isActive) {
          throw new Error(`Drug is inactive: ${item.drugId}`);
        }
      }
    }
    const count = await database_default.prescription.count();
    const prescriptionNumber = `RX-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(5, "0")}`;
    const prescription = await withDb(
      () => database_default.prescription.create({
        data: {
          prescriptionNumber,
          visitId: data.visitId,
          patientId: data.patientId,
          doctorId: data.doctorId,
          notes: data.notes,
          status: "PENDING",
          items: {
            create: data.items.map((item) => ({
              drugId: item.drugId,
              drugName: item.drugName,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              quantity: item.quantity,
              instructions: item.instructions
            }))
          }
        },
        include: {
          items: {
            include: {
              drug: true
            }
          },
          patient: {
            select: {
              cardNumber: true,
              fullName: true,
              sex: true,
              dateOfBirth: true
            }
          },
          doctor: {
            select: {
              fullName: true,
              department: true
            }
          },
          visit: {
            select: {
              visitNumber: true,
              visitDate: true
            }
          }
        }
      })
    );
    return prescription;
  }
  async getPrescriptions(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.patientId) {
      where.patientId = params.patientId;
    }
    if (params.doctorId) {
      where.doctorId = params.doctorId;
    }
    if (params.date) {
      const startDate = new Date(params.date);
      const endDate = new Date(params.date);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }
    const [prescriptions, total] = await Promise.all([
      database_default.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              drug: true
            }
          },
          patient: {
            select: {
              cardNumber: true,
              fullName: true,
              sex: true,
              dateOfBirth: true
            }
          },
          doctor: {
            select: {
              fullName: true,
              department: true
            }
          },
          dispensedBy: {
            select: {
              fullName: true
            }
          }
        }
      }),
      database_default.prescription.count({ where })
    ]);
    return {
      prescriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getPrescriptionById(id) {
    const prescription = await database_default.prescription.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            drug: true
          }
        },
        patient: true,
        doctor: {
          select: {
            fullName: true,
            department: true,
            phone: true
          }
        },
        visit: true,
        dispensedBy: {
          select: {
            fullName: true
          }
        }
      }
    });
    if (!prescription) {
      throw new Error("Prescription not found");
    }
    return prescription;
  }
  async dispensePrescription(id, dispensedById, dispenseDetails) {
    const existing = await database_default.prescription.findUnique({
      where: { id },
      select: { status: true }
    });
    if (!existing) {
      throw new Error("Prescription not found");
    }
    if (existing.status !== "PENDING") {
      throw new Error("Only pending prescriptions can be dispensed");
    }
    const prescription = await withDb(
      () => database_default.prescription.update({
        where: { id },
        data: {
          status: "DISPENSED",
          dispensedAt: /* @__PURE__ */ new Date(),
          dispensedById
        },
        include: {
          items: true,
          patient: {
            select: {
              fullName: true,
              cardNumber: true
            }
          }
        }
      })
    );
    await database_default.auditLog.create({
      data: {
        userId: dispensedById,
        action: "PRESCRIPTION_DISPENSED",
        resource: "prescriptions",
        resourceId: id,
        newValues: dispenseDetails || {}
      }
    });
    return prescription;
  }
  async cancelPrescription(id) {
    const existing = await database_default.prescription.findUnique({
      where: { id },
      select: { status: true }
    });
    if (!existing) {
      throw new Error("Prescription not found");
    }
    if (existing.status !== "PENDING") {
      throw new Error("Only pending prescriptions can be cancelled");
    }
    return withDb(
      () => database_default.prescription.update({
        where: { id },
        data: {
          status: "CANCELLED"
        }
      })
    );
  }
  // Get prescription queue for pharmacy
  async getPrescriptionQueue(params) {
    const take = params?.limit && params.limit > 0 ? Math.min(params.limit, 500) : 300;
    const prescriptions = await database_default.prescription.findMany({
      where: {
        status: "PENDING"
      },
      orderBy: { createdAt: "asc" },
      take,
      include: {
        items: true,
        patient: {
          select: {
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true
          }
        },
        doctor: {
          select: {
            fullName: true
          }
        }
      }
    });
    return prescriptions;
  }
};

// src/controllers/prescription.controller.ts
var prescriptionService = new PrescriptionService();
var PrescriptionController = class {
  async createPrescription(req, res) {
    try {
      const prescription = await prescriptionService.createPrescription({
        ...req.body,
        doctorId: req.user.id
      });
      res.status(201).json({
        success: true,
        message: "Prescription created successfully",
        data: prescription
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPrescriptions(req, res) {
    try {
      const { page, limit, status, patientId, doctorId, date } = req.query;
      const result = await prescriptionService.getPrescriptions({
        page: page ? Number(page) : void 0,
        limit: limit ? Number(limit) : void 0,
        status,
        patientId,
        doctorId,
        date
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPrescriptionById(req, res) {
    try {
      const prescription = await prescriptionService.getPrescriptionById(req.params.id);
      res.json({
        success: true,
        data: prescription
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async dispensePrescription(req, res) {
    try {
      const prescription = await prescriptionService.dispensePrescription(
        req.params.id,
        req.user.id,
        {
          labelPrinted: Boolean(req.body?.labelPrinted),
          substitutionMade: Boolean(req.body?.substitutionMade),
          substitutionReason: req.body?.substitutionReason,
          counselProvided: Boolean(req.body?.counselProvided),
          notes: req.body?.notes
        }
      );
      res.json({
        success: true,
        message: "Prescription dispensed successfully",
        data: prescription
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async cancelPrescription(req, res) {
    try {
      const prescription = await prescriptionService.cancelPrescription(req.params.id);
      res.json({
        success: true,
        message: "Prescription cancelled",
        data: prescription
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getPrescriptionQueue(req, res) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : void 0;
      const prescriptions = await prescriptionService.getPrescriptionQueue({
        limit: Number.isFinite(limit) ? limit : void 0
      });
      res.json({
        success: true,
        data: prescriptions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// src/routes/prescription.routes.ts
var import_zod5 = require("zod");
var router4 = (0, import_express4.Router)();
var prescriptionController = new PrescriptionController();
var createPrescriptionSchema = import_zod5.z.object({
  visitId: import_zod5.z.string().uuid(),
  patientId: import_zod5.z.string().uuid(),
  items: import_zod5.z.array(import_zod5.z.object({
    drugId: import_zod5.z.string().uuid().optional(),
    drugName: import_zod5.z.string().min(1),
    dosage: import_zod5.z.string().min(1),
    frequency: import_zod5.z.string().min(1),
    duration: import_zod5.z.string().min(1),
    quantity: import_zod5.z.number().positive(),
    instructions: import_zod5.z.string().optional()
  })).min(1),
  notes: import_zod5.z.string().optional()
});
router4.use(authenticate);
router4.post(
  "/",
  authorize("DOCTOR", "SUPER_ADMIN"),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription.bind(prescriptionController)
);
router4.get("/", prescriptionController.getPrescriptions.bind(prescriptionController));
router4.get(
  "/queue",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  prescriptionController.getPrescriptionQueue.bind(prescriptionController)
);
router4.get("/:id", prescriptionController.getPrescriptionById.bind(prescriptionController));
router4.post(
  "/:id/dispense",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  prescriptionController.dispensePrescription.bind(prescriptionController)
);
router4.post(
  "/:id/cancel",
  authorize("DOCTOR", "PHARMACIST", "SUPER_ADMIN"),
  prescriptionController.cancelPrescription.bind(prescriptionController)
);
var prescription_routes_default = router4;

// src/routes/lab.routes.ts
var import_express5 = require("express");
var import_client5 = require("@prisma/client");
var router5 = (0, import_express5.Router)();
var prisma3 = new import_client5.PrismaClient();
router5.get("/tests", authenticate, async (req, res) => {
  try {
    const tests = await prisma3.labTest.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        testName: true,
        testCategory: true,
        price: true
      },
      orderBy: {
        testCategory: "asc"
      }
    });
    const formattedTests = tests.map((test) => ({
      id: test.id,
      name: test.testName,
      category: test.testCategory || "Other",
      price: test.price ? Number(test.price) : 0
    }));
    res.json({
      success: true,
      data: formattedTests
    });
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch lab tests"
    });
  }
});
router5.get("/orders", authenticate, async (req, res) => {
  try {
    const { status, limit } = req.query;
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    const orders = await prisma3.labOrder.findMany({
      where: whereClause,
      take: limit ? parseInt(limit) : 50,
      orderBy: {
        orderedAt: "desc"
      },
      include: {
        patient: {
          select: {
            id: true,
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true
          }
        },
        orderedBy: {
          select: {
            fullName: true
          }
        },
        items: {
          include: {
            test: true
          }
        }
      }
    });
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      orderedAt: order.orderedAt.toISOString(),
      status: order.status,
      urgency: order.priority,
      patient: {
        id: order.patient.id,
        cardNumber: order.patient.cardNumber,
        fullName: order.patient.fullName,
        sex: order.patient.sex,
        dateOfBirth: order.patient.dateOfBirth.toISOString()
      },
      orderedBy: order.orderedBy,
      items: order.items.map((item) => ({
        id: item.id,
        testName: item.testName,
        status: item.status,
        result: item.result,
        isAbnormal: item.isAbnormal
      }))
    }));
    res.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error("Error fetching lab orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch lab orders"
    });
  }
});
router5.post("/orders/:orderId/results", authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, result, isAbnormal } = req.body;
    await prisma3.labOrderItem.update({
      where: { id: itemId },
      data: {
        result,
        isAbnormal: isAbnormal || false,
        status: "COMPLETED"
      }
    });
    res.json({
      success: true,
      message: "Result added successfully"
    });
  } catch (error) {
    console.error("Error adding lab result:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add result"
    });
  }
});
router5.patch("/orders/:orderId/status", authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    await prisma3.labOrder.update({
      where: { id: orderId },
      data: {
        status,
        completedAt: status === "COMPLETED" ? /* @__PURE__ */ new Date() : void 0,
        verifiedAt: status === "VERIFIED" ? /* @__PURE__ */ new Date() : void 0,
        verifiedById: status === "VERIFIED" ? req.user?.id : void 0
      }
    });
    res.json({
      success: true,
      message: "Status updated successfully"
    });
  } catch (error) {
    console.error("Error updating lab order status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update status"
    });
  }
});
var lab_routes_default = router5;

// src/routes/pharmacy.routes.ts
var import_express6 = require("express");

// src/services/pharmacy.service.ts
init_database();
var PharmacyService = class {
  // Drug Management
  async createDrug(data) {
    if (!data?.drugName || !String(data.drugName).trim()) {
      throw new Error("drugName is required");
    }
    return withDb(
      () => database_default.drug.create({
        data: {
          ...data,
          drugName: String(data.drugName).trim(),
          isActive: true
        }
      })
    );
  }
  async getDrugs(params) {
    const where = {};
    if (params.search) {
      where.OR = [
        { drugName: { contains: params.search, mode: "insensitive" } },
        { genericName: { contains: params.search, mode: "insensitive" } },
        { brandName: { contains: params.search, mode: "insensitive" } }
      ];
    }
    if (params.category) {
      where.drugCategory = params.category;
    }
    if (params.isActive !== void 0) {
      where.isActive = params.isActive;
    }
    const page = params.page && params.page > 0 ? params.page : 1;
    const limitRaw = params.limit && params.limit > 0 ? params.limit : 500;
    const limit = Math.min(limitRaw, 1e3);
    const skip = (page - 1) * limit;
    const [drugs, total] = await Promise.all([
      database_default.drug.findMany({
        where,
        skip,
        take: limit,
        orderBy: { drugName: "asc" }
      }),
      database_default.drug.count({ where })
    ]);
    return {
      drugs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  // Stock Management
  async addStock(data) {
    if (!Number.isFinite(data.quantityInStock) || data.quantityInStock <= 0) {
      throw new Error("quantityInStock must be greater than 0");
    }
    if (!Number.isFinite(data.unitPrice) || data.unitPrice < 0 || !Number.isFinite(data.sellingPrice) || data.sellingPrice < 0) {
      throw new Error("unitPrice and sellingPrice must be non-negative numbers");
    }
    const exp = new Date(data.expiryDate);
    if (Number.isNaN(exp.getTime())) {
      throw new Error("expiryDate is invalid");
    }
    const drug = await database_default.drug.findUnique({ where: { id: data.drugId }, select: { id: true, isActive: true } });
    if (!drug) {
      throw new Error("Drug not found");
    }
    if (!drug.isActive) {
      throw new Error("Cannot add stock for an inactive drug");
    }
    return withDb(
      () => database_default.pharmacyStock.create({
        data: {
          ...data,
          expiryDate: exp,
          receivedDate: /* @__PURE__ */ new Date(),
          status: "AVAILABLE"
        },
        include: {
          drug: true
        }
      })
    );
  }
  async getStock(params) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.search) {
      where.drug = {
        OR: [
          { drugName: { contains: params.search, mode: "insensitive" } },
          { genericName: { contains: params.search, mode: "insensitive" } }
        ]
      };
    }
    if (params.status) {
      where.status = params.status;
    }
    if (params.lowStock) {
      where.quantityInStock = {
        lte: database_default.pharmacyStock.fields.reorderLevel
      };
    }
    const [stocks, total] = await Promise.all([
      database_default.pharmacyStock.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          drug: true
        }
      }),
      database_default.pharmacyStock.count({ where })
    ]);
    return {
      stocks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getStockById(id) {
    const stock = await database_default.pharmacyStock.findUnique({
      where: { id },
      include: {
        drug: true
      }
    });
    if (!stock) {
      throw new Error("Stock not found");
    }
    return stock;
  }
  async updateStock(id, data) {
    if (data.quantityInStock !== void 0 && (!Number.isFinite(data.quantityInStock) || data.quantityInStock < 0)) {
      throw new Error("quantityInStock must be a non-negative number");
    }
    const updateData = {
      ...data.quantityInStock !== void 0 && { quantityInStock: data.quantityInStock },
      ...data.status !== void 0 && { status: data.status }
    };
    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update");
    }
    return withDb(
      () => database_default.pharmacyStock.update({
        where: { id },
        data: updateData,
        include: {
          drug: true
        }
      })
    );
  }
  async getLowStockAlerts() {
    const alerts = await database_default.pharmacyStock.findMany({
      where: {
        OR: [
          {
            quantityInStock: {
              lte: database_default.pharmacyStock.fields.reorderLevel
            }
          },
          {
            status: "LOW"
          }
        ]
      },
      include: {
        drug: true
      },
      orderBy: { quantityInStock: "asc" }
    });
    return alerts;
  }
  async getExpiringStock(daysThreshold = 90, limit) {
    const thresholdDate = /* @__PURE__ */ new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const take = limit && limit > 0 ? Math.min(limit, 1e3) : 500;
    const expiringStock = await database_default.pharmacyStock.findMany({
      where: {
        expiryDate: {
          lte: thresholdDate
        },
        status: {
          not: "EXPIRED"
        }
      },
      include: {
        drug: true
      },
      orderBy: { expiryDate: "asc" },
      take
    });
    return expiringStock;
  }
  // Dispensing
  async dispenseStock(data) {
    if (!Number.isFinite(data.quantity) || data.quantity <= 0) {
      throw new Error("Dispense quantity must be greater than 0");
    }
    const stock = await database_default.pharmacyStock.findUnique({
      where: { id: data.stockId }
    });
    if (!stock) {
      throw new Error("Stock not found");
    }
    if (stock.quantityInStock < data.quantity) {
      throw new Error("Insufficient stock");
    }
    const newQuantity = stock.quantityInStock - data.quantity;
    let newStatus = stock.status;
    if (newQuantity === 0) {
      newStatus = "OUT_OF_STOCK";
    } else if (newQuantity <= stock.reorderLevel) {
      newStatus = "LOW";
    }
    const updatedStock = await withDb(
      () => database_default.pharmacyStock.update({
        where: { id: data.stockId },
        data: {
          quantityInStock: newQuantity,
          status: newStatus
        },
        include: {
          drug: true
        }
      })
    );
    return updatedStock;
  }
};

// src/controllers/pharmacy.controller.ts
var pharmacyService = new PharmacyService();
var createDrug = async (req, res) => {
  try {
    const drug = await pharmacyService.createDrug(req.body);
    res.status(201).json({
      success: true,
      message: "Drug created successfully",
      data: drug
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
var getDrugs = async (req, res) => {
  try {
    const { search, category, isActive, page, limit } = req.query;
    const result = await pharmacyService.getDrugs({
      search,
      category,
      isActive: isActive === "true",
      page: page ? Number(page) : void 0,
      limit: limit ? Number(limit) : void 0
    });
    res.json({
      success: true,
      data: result.drugs,
      ...page || limit ? { pagination: result.pagination } : {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
var addStock = async (req, res) => {
  try {
    const stock = await pharmacyService.addStock(req.body);
    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: stock
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
var getStock = async (req, res) => {
  try {
    const { page, limit, search, status, lowStock } = req.query;
    const result = await pharmacyService.getStock({
      page: page ? Number(page) : void 0,
      limit: limit ? Number(limit) : void 0,
      search,
      status,
      lowStock: lowStock === "true"
    });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
var getStockById = async (req, res) => {
  try {
    const stock = await pharmacyService.getStockById(req.params.id);
    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};
var updateStock = async (req, res) => {
  try {
    const stock = await pharmacyService.updateStock(req.params.id, req.body);
    res.json({
      success: true,
      message: "Stock updated successfully",
      data: stock
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
var getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await pharmacyService.getLowStockAlerts();
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
var getExpiringStock = async (req, res) => {
  try {
    const { days, limit } = req.query;
    const expiringStock = await pharmacyService.getExpiringStock(
      days ? Number(days) : void 0,
      limit ? Number(limit) : void 0
    );
    res.json({
      success: true,
      data: expiringStock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
var dispenseStock = async (req, res) => {
  try {
    const stock = await pharmacyService.dispenseStock(req.body);
    res.json({
      success: true,
      message: "Stock dispensed successfully",
      data: stock
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// src/routes/pharmacy.routes.ts
var router6 = (0, import_express6.Router)();
router6.use(authenticate);
router6.post(
  "/drugs",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  createDrug
);
router6.get("/drugs", getDrugs);
router6.post(
  "/stock",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  addStock
);
router6.get("/stock", getStock);
router6.get(
  "/stock/alerts",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  getLowStockAlerts
);
router6.get(
  "/stock/expiring",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  getExpiringStock
);
router6.get("/stock/:id", getStockById);
router6.patch(
  "/stock/:id",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  updateStock
);
router6.post(
  "/dispense",
  authorize("PHARMACIST", "SUPER_ADMIN"),
  dispenseStock
);
var pharmacy_routes_default = router6;

// src/routes/ultrasound.routes.ts
var import_express7 = require("express");

// src/services/ultrasound.service.ts
init_database();
var financeService2 = new FinanceService();
var UltrasoundService = class {
  async createUltrasoundOrder(data) {
    const count = await database_default.ultrasoundOrder.count();
    const orderNumber = `US-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(5, "0")}`;
    const price = data.isFollowUp ? 400 : 200;
    const order = await database_default.ultrasoundOrder.create({
      data: {
        orderNumber,
        visitId: data.visitId,
        patientId: data.patientId,
        ultrasoundType: data.ultrasoundType,
        isFollowUp: data.isFollowUp,
        price,
        clinicalIndication: data.clinicalIndication,
        orderedById: data.orderedById,
        status: "SCHEDULED",
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null
      },
      include: {
        patient: {
          select: {
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true,
            phone: true
          }
        },
        orderedBy: {
          select: {
            fullName: true,
            department: true
          }
        },
        visit: {
          select: {
            visitNumber: true,
            visitDate: true
          }
        }
      }
    });
    await financeService2.createSystemCharge({
      patientId: data.patientId,
      visitId: data.visitId,
      transactionType: "ULTRASOUND_FEE",
      amount: price,
      description: `Ultrasound order ${order.orderNumber}`
    });
    return order;
  }
  async getUltrasoundOrders(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.patientId) {
      where.patientId = params.patientId;
    }
    if (params.date) {
      const startDate = new Date(params.date);
      const endDate = new Date(params.date);
      endDate.setHours(23, 59, 59, 999);
      where.scheduledDate = { gte: startDate, lte: endDate };
    }
    const [orders, total] = await Promise.all([
      database_default.ultrasoundOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          patient: {
            select: {
              cardNumber: true,
              fullName: true,
              sex: true,
              dateOfBirth: true
            }
          },
          orderedBy: {
            select: {
              fullName: true
            }
          }
        }
      }),
      database_default.ultrasoundOrder.count({ where })
    ]);
    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getUltrasoundOrderById(id) {
    const order = await database_default.ultrasoundOrder.findUnique({
      where: { id },
      include: {
        patient: true,
        visit: true,
        orderedBy: {
          select: {
            fullName: true,
            department: true,
            phone: true
          }
        }
      }
    });
    if (!order) {
      throw new Error("Ultrasound order not found");
    }
    return order;
  }
  async updateUltrasoundStatus(id, status) {
    const order = await database_default.ultrasoundOrder.update({
      where: { id },
      data: {
        status,
        ...status === "COMPLETED" && { completedAt: /* @__PURE__ */ new Date() }
      },
      include: {
        patient: {
          select: {
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    return order;
  }
  async addUltrasoundArtifact(orderId, uploadedById, data) {
    const artifact = await database_default.auditLog.create({
      data: {
        userId: uploadedById,
        action: "ULTRASOUND_ARTIFACT_ADDED",
        resource: "ultrasound_orders",
        resourceId: orderId,
        newValues: {
          name: data.name,
          url: data.url,
          type: data.type || "REPORT_LINK",
          notes: data.notes || ""
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });
    return artifact;
  }
  async getUltrasoundArtifacts(orderId) {
    const artifacts = await database_default.auditLog.findMany({
      where: {
        action: "ULTRASOUND_ARTIFACT_ADDED",
        resource: "ultrasound_orders",
        resourceId: orderId
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });
    return artifacts;
  }
  async getScheduledUltrasounds(date) {
    const targetDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
    const endDate = new Date(targetDate.setHours(23, 59, 59, 999));
    const orders = await database_default.ultrasoundOrder.findMany({
      where: {
        scheduledDate: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"]
        }
      },
      orderBy: { scheduledDate: "asc" },
      include: {
        patient: {
          select: {
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true,
            phone: true
          }
        },
        orderedBy: {
          select: {
            fullName: true
          }
        }
      }
    });
    return orders;
  }
};

// src/controllers/ultrasound.controller.ts
var ultrasoundService = new UltrasoundService();
var createUltrasoundOrder = async (req, res) => {
  try {
    const order = await ultrasoundService.createUltrasoundOrder({
      ...req.body,
      orderedById: req.user.id
    });
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create ultrasound order"
    });
  }
};
var getUltrasoundOrders = async (req, res) => {
  try {
    const result = await ultrasoundService.getUltrasoundOrders(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch ultrasound orders"
    });
  }
};
var getUltrasoundOrderById = async (req, res) => {
  try {
    const order = await ultrasoundService.getUltrasoundOrderById(req.params.id);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message || "Ultrasound order not found"
    });
  }
};
var updateUltrasoundStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await ultrasoundService.updateUltrasoundStatus(req.params.id, status);
    res.json({
      success: true,
      data: order,
      message: "Ultrasound status updated"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update ultrasound status"
    });
  }
};
var getScheduledUltrasounds = async (req, res) => {
  try {
    const { date } = req.query;
    const orders = await ultrasoundService.getScheduledUltrasounds(date);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch scheduled ultrasounds"
    });
  }
};
var addUltrasoundArtifact = async (req, res) => {
  try {
    const { name, url, type, notes } = req.body;
    if (!name || !url) {
      res.status(400).json({ success: false, error: "name and url are required" });
      return;
    }
    const artifact = await ultrasoundService.addUltrasoundArtifact(req.params.id, req.user.id, {
      name,
      url,
      type,
      notes
    });
    res.status(201).json({
      success: true,
      data: artifact,
      message: "Ultrasound artifact added"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to add ultrasound artifact"
    });
  }
};
var getUltrasoundArtifacts = async (req, res) => {
  try {
    const artifacts = await ultrasoundService.getUltrasoundArtifacts(req.params.id);
    res.json({
      success: true,
      data: artifacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch ultrasound artifacts"
    });
  }
};

// src/routes/ultrasound.routes.ts
var router7 = (0, import_express7.Router)();
router7.use(authenticate);
router7.post(
  "/",
  authorize("DOCTOR", "RECEPTIONIST", "SUPER_ADMIN"),
  createUltrasoundOrder
);
router7.get("/", getUltrasoundOrders);
router7.get("/scheduled", getScheduledUltrasounds);
router7.get("/:id", getUltrasoundOrderById);
router7.patch("/:id/status", updateUltrasoundStatus);
router7.get("/:id/artifacts", getUltrasoundArtifacts);
router7.post("/:id/artifacts", addUltrasoundArtifact);
var ultrasound_routes_default = router7;

// src/routes/injection.routes.ts
var import_express8 = require("express");

// src/services/injection.service.ts
init_database();
var financeService3 = new FinanceService();
var InjectionService = class {
  async createInjectionOrder(data) {
    const count = await database_default.injectionOrder.count();
    const orderNumber = `INJ-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(count + 1).padStart(5, "0")}`;
    const order = await database_default.injectionOrder.create({
      data: {
        orderNumber,
        visitId: data.visitId,
        patientId: data.patientId,
        medicationName: data.medicationName,
        dosage: data.dosage,
        route: data.route,
        frequency: data.frequency,
        duration: data.duration,
        notes: data.notes,
        orderedById: data.orderedById,
        status: "PENDING"
      },
      include: {
        patient: {
          select: {
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true,
            allergies: true
          }
        },
        orderedBy: {
          select: {
            fullName: true,
            department: true
          }
        },
        visit: {
          select: {
            visitNumber: true,
            visitDate: true
          }
        }
      }
    });
    const configuredFee = Number(process.env.INJECTION_FEE || 0);
    if (configuredFee > 0) {
      await financeService3.createSystemCharge({
        patientId: data.patientId,
        visitId: data.visitId,
        transactionType: "INJECTION_FEE",
        amount: configuredFee,
        description: `Injection order ${order.orderNumber}`
      });
    }
    const nurses = await database_default.user.findMany({
      where: {
        role: {
          in: ["NURSE", "INJECTION_ROOM"]
        },
        isActive: true
      }
    });
    for (const nurse of nurses) {
      await database_default.notification.create({
        data: {
          userId: nurse.id,
          notificationType: "NEW_INJECTION_ORDER",
          title: "New Injection Order",
          message: `New injection order for ${order.patient.fullName} - ${data.medicationName}`,
          relatedId: order.id
        }
      });
    }
    return order;
  }
  // ============================================
  // INJECTION ADMINISTRATION (5 RIGHTS CHECK)
  // ============================================
  async administerInjection(data) {
    if (!data.rightPatientChecked || !data.rightMedicationChecked || !data.rightDoseChecked || !data.rightRouteChecked || !data.rightTimeChecked) {
      throw new Error("All 5 Rights must be checked before administration");
    }
    const order = await database_default.injectionOrder.findUnique({
      where: { id: data.orderId },
      include: {
        patient: {
          select: {
            fullName: true,
            cardNumber: true
          }
        },
        orderedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
    if (!order) {
      throw new Error("Injection order not found");
    }
    if (order.status === "ADMINISTERED") {
      throw new Error("Injection already administered");
    }
    return withDb(
      () => database_default.$transaction(async (tx) => {
        const administration = await tx.injectionAdministration.create({
          data: {
            orderId: data.orderId,
            rightPatientChecked: data.rightPatientChecked,
            rightMedicationChecked: data.rightMedicationChecked,
            rightDoseChecked: data.rightDoseChecked,
            rightRouteChecked: data.rightRouteChecked,
            rightTimeChecked: data.rightTimeChecked,
            site: data.site,
            route: data.route,
            batchNumber: data.batchNumber,
            lotNumber: data.lotNumber,
            expiryDate: data.expiryDate,
            vitalsBefore: data.vitalsBefore,
            vitalsAfter: data.vitalsAfter,
            adverseReaction: data.adverseReaction || false,
            reactionType: data.reactionType,
            reactionSeverity: data.reactionSeverity,
            reactionDetails: data.reactionDetails,
            actionTaken: data.actionTaken,
            consumablesUsed: data.consumablesUsed,
            administeredById: data.administeredById,
            witnessedById: data.witnessedById,
            notes: data.notes
          },
          include: {
            administeredBy: {
              select: {
                fullName: true,
                role: true
              }
            }
          }
        });
        await tx.injectionOrder.update({
          where: { id: data.orderId },
          data: {
            status: "ADMINISTERED"
          }
        });
        if (data.adverseReaction && order.orderedBy) {
          await tx.notification.create({
            data: {
              userId: order.orderedBy.id,
              notificationType: "ADVERSE_REACTION",
              title: "\u26A0\uFE0F Adverse Reaction Reported",
              message: `Adverse reaction reported for ${order.patient.fullName} after ${order.medicationName} injection`,
              relatedId: order.id
            }
          });
        }
        return administration;
      })
    );
  }
  async getInjectionOrders(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.patientId) {
      where.patientId = params.patientId;
    }
    if (params.date) {
      const startDate = new Date(params.date);
      const endDate = new Date(params.date);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt = { gte: startDate, lte: endDate };
    }
    const [orders, total] = await Promise.all([
      database_default.injectionOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          patient: {
            select: {
              cardNumber: true,
              fullName: true,
              sex: true,
              dateOfBirth: true,
              allergies: true
            }
          },
          orderedBy: {
            select: {
              fullName: true
            }
          },
          administrations: {
            include: {
              administeredBy: {
                select: {
                  fullName: true
                }
              }
            }
          }
        }
      }),
      database_default.injectionOrder.count({ where })
    ]);
    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getInjectionOrderById(id) {
    const order = await database_default.injectionOrder.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            visits: {
              where: {
                vitalSigns: {
                  some: {}
                }
              },
              include: {
                vitalSigns: {
                  orderBy: {
                    recordedAt: "desc"
                  },
                  take: 1
                }
              },
              orderBy: {
                visitDate: "desc"
              },
              take: 1
            }
          }
        },
        visit: true,
        orderedBy: {
          select: {
            fullName: true,
            department: true,
            phone: true
          }
        },
        administrations: {
          include: {
            administeredBy: {
              select: {
                fullName: true,
                role: true
              }
            }
          },
          orderBy: {
            administeredAt: "desc"
          }
        }
      }
    });
    if (!order) {
      throw new Error("Injection order not found");
    }
    return order;
  }
  async cancelInjectionOrder(id, reason) {
    const order = await database_default.injectionOrder.update({
      where: { id },
      data: {
        status: "CANCELLED",
        notes: reason
      }
    });
    return order;
  }
  async getInjectionQueue() {
    const orders = await database_default.injectionOrder.findMany({
      where: {
        status: "PENDING"
      },
      orderBy: { createdAt: "asc" },
      include: {
        patient: {
          select: {
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true,
            allergies: true
          }
        },
        orderedBy: {
          select: {
            fullName: true
          }
        }
      }
    });
    return orders;
  }
  async getAdministrationHistory(orderId) {
    return await database_default.injectionAdministration.findMany({
      where: { orderId },
      orderBy: { administeredAt: "desc" },
      include: {
        administeredBy: {
          select: {
            fullName: true,
            role: true
          }
        }
      }
    });
  }
};
var injectionService = new InjectionService();

// src/controllers/injection.controller.ts
var injectionService2 = new InjectionService();
var createInjectionOrder = async (req, res) => {
  try {
    const order = await injectionService2.createInjectionOrder({
      ...req.body,
      orderedById: req.user.id
    });
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create injection order"
    });
  }
};
var getInjectionOrders = async (req, res) => {
  try {
    const result = await injectionService2.getInjectionOrders(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch injection orders"
    });
  }
};
var getInjectionOrderById = async (req, res) => {
  try {
    const order = await injectionService2.getInjectionOrderById(req.params.id);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message || "Injection order not found"
    });
  }
};
var administerInjection = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    const administration = await injectionService2.administerInjection({
      orderId: req.params.id,
      administeredById: req.user.id,
      // 5 Rights Check
      rightPatientChecked: Boolean(req.body.rightPatientChecked),
      rightMedicationChecked: Boolean(req.body.rightMedicationChecked),
      rightDoseChecked: Boolean(req.body.rightDoseChecked),
      rightRouteChecked: Boolean(req.body.rightRouteChecked),
      rightTimeChecked: Boolean(req.body.rightTimeChecked),
      // Administration Details
      site: req.body.site,
      route: req.body.route,
      batchNumber: req.body.batchNumber,
      lotNumber: req.body.lotNumber,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : void 0,
      // Vitals
      vitalsBefore: req.body.vitalsBefore,
      vitalsAfter: req.body.vitalsAfter,
      // Adverse Events
      adverseReaction: Boolean(req.body.adverseReaction),
      reactionType: req.body.reactionType,
      reactionSeverity: req.body.reactionSeverity,
      reactionDetails: req.body.reactionDetails,
      actionTaken: req.body.actionTaken,
      // Consumables
      consumablesUsed: req.body.consumablesUsed,
      witnessedById: req.body.witnessedById,
      notes: req.body.notes
    });
    res.json({
      success: true,
      data: administration,
      message: "Injection administered successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to administer injection"
    });
  }
};
var getAdministrationHistory = async (req, res) => {
  try {
    const history = await injectionService2.getAdministrationHistory(req.params.id);
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch administration history"
    });
  }
};
var cancelInjectionOrder = async (req, res) => {
  try {
    const order = await injectionService2.cancelInjectionOrder(req.params.id);
    res.json({
      success: true,
      data: order,
      message: "Injection order cancelled"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to cancel injection order"
    });
  }
};
var getInjectionQueue = async (req, res) => {
  try {
    const orders = await injectionService2.getInjectionQueue();
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch injection queue"
    });
  }
};

// src/routes/injection.routes.ts
var router8 = (0, import_express8.Router)();
router8.use(authenticate);
router8.post(
  "/",
  authorize("DOCTOR", "SUPER_ADMIN"),
  createInjectionOrder
);
router8.get("/", getInjectionOrders);
router8.get(
  "/queue",
  authorize("NURSE", "INJECTION_ROOM", "SUPER_ADMIN"),
  getInjectionQueue
);
router8.get("/:id", getInjectionOrderById);
router8.get("/:id/history", getAdministrationHistory);
router8.post(
  "/:id/administer",
  authorize("NURSE", "INJECTION_ROOM", "SUPER_ADMIN"),
  administerInjection
);
router8.post(
  "/:id/cancel",
  authorize("DOCTOR", "SUPER_ADMIN"),
  cancelInjectionOrder
);
var injection_routes_default = router8;

// src/routes/finance.routes.ts
var import_express9 = require("express");

// src/controllers/finance.controller.ts
var financeService4 = new FinanceService();
var createTransaction = async (req, res) => {
  try {
    const transaction = await financeService4.createTransaction({
      ...req.body,
      collectedById: req.user.id
    });
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create transaction"
    });
  }
};
var getTransactions = async (req, res) => {
  try {
    const result = await financeService4.getTransactions(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch transactions"
    });
  }
};
var markTransactionPaid = async (req, res) => {
  try {
    const { referenceNumber } = req.body;
    const transaction = await financeService4.markTransactionPaid(
      req.params.id,
      referenceNumber
    );
    res.json({
      success: true,
      data: transaction,
      message: "Transaction marked as paid"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to mark transaction as paid"
    });
  }
};
var requestRefund = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !String(reason).trim()) {
      res.status(400).json({
        success: false,
        error: "Refund reason is required"
      });
      return;
    }
    const result = await financeService4.requestRefund(
      req.params.id,
      String(reason),
      req.user.id
    );
    res.json({
      success: true,
      data: result,
      message: "Refund request submitted for approval"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to request refund"
    });
  }
};
var approveRefund = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !String(reason).trim()) {
      res.status(400).json({
        success: false,
        error: "Approval reason is required"
      });
      return;
    }
    const result = await financeService4.approveRefund(
      req.params.id,
      String(reason),
      req.user.id
    );
    res.json({
      success: true,
      data: result,
      message: "Refund approved and posted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to approve refund"
    });
  }
};
var createInvoice = async (req, res) => {
  try {
    const invoice = await financeService4.createInvoice({
      ...req.body,
      issuedById: req.user.id
    });
    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create invoice"
    });
  }
};
var getInvoices = async (req, res) => {
  try {
    const result = await financeService4.getInvoices(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch invoices"
    });
  }
};
var payInvoice = async (req, res) => {
  try {
    const { amount } = req.body;
    const invoice = await financeService4.payInvoice(req.params.id, amount);
    res.json({
      success: true,
      data: invoice,
      message: "Payment recorded successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process payment"
    });
  }
};
var getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: "Start date and end date are required"
      });
      return;
    }
    const report = await financeService4.getRevenueReport(
      startDate,
      endDate
    );
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate revenue report"
    });
  }
};
var getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;
    const userRole = req.user?.role;
    let report;
    if (userRole === "RECEPTIONIST") {
      report = await financeService4.getReceptionDailyRevenue(date);
    } else if (userRole === "SUPER_ADMIN") {
      report = await financeService4.getDailyRevenue(date);
    } else if (userRole === "FINANCE") {
      report = await financeService4.getFinanceDailyRevenue(date);
    } else if (userRole === "PHARMACIST") {
      report = await financeService4.getPharmacyDailyRevenue(date);
    } else {
      report = await financeService4.getDailyRevenue(date);
    }
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get daily revenue"
    });
  }
};
var getDailyCloseoutSummary = async (req, res) => {
  try {
    const { date } = req.query;
    const summary = await financeService4.getDailyCloseoutSummary(date);
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get daily closeout summary"
    });
  }
};

// src/routes/finance.routes.ts
var router9 = (0, import_express9.Router)();
router9.use(authenticate);
router9.post(
  "/transactions",
  authorize("RECEPTIONIST", "FINANCE", "SUPER_ADMIN"),
  createTransaction
);
router9.get(
  "/transactions",
  authorize("FINANCE", "SUPER_ADMIN"),
  getTransactions
);
router9.patch(
  "/transactions/:id/pay",
  authorize("FINANCE", "SUPER_ADMIN"),
  markTransactionPaid
);
router9.post(
  "/transactions/:id/refund-request",
  authorize("FINANCE", "SUPER_ADMIN"),
  requestRefund
);
router9.post(
  "/transactions/:id/refund-approve",
  authorize("SUPER_ADMIN"),
  approveRefund
);
router9.post(
  "/invoices",
  authorize("RECEPTIONIST", "FINANCE", "SUPER_ADMIN"),
  createInvoice
);
router9.get(
  "/invoices",
  authorize("FINANCE", "SUPER_ADMIN"),
  getInvoices
);
router9.post(
  "/invoices/:id/pay",
  authorize("RECEPTIONIST", "FINANCE", "SUPER_ADMIN"),
  payInvoice
);
router9.get(
  "/reports/revenue",
  authorize("FINANCE", "SUPER_ADMIN"),
  getRevenueReport
);
router9.get(
  "/reports/daily",
  authorize("RECEPTIONIST", "FINANCE", "PHARMACIST", "SUPER_ADMIN"),
  getDailyRevenue
);
router9.get(
  "/closeout/daily",
  authorize("FINANCE", "SUPER_ADMIN"),
  getDailyCloseoutSummary
);
var finance_routes_default = router9;

// src/routes/notification.routes.ts
var import_express10 = require("express");

// src/controllers/notification.controller.ts
var NotificationController = class {
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { unreadOnly, limit } = req.query;
      const notifications = await notificationService.getUserNotifications(userId, {
        unreadOnly: unreadOnly === "true",
        limit: limit ? parseInt(limit) : void 0
      });
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);
      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const notification = await notificationService.markAsRead(id, userId);
      res.json({
        success: true,
        data: notification,
        message: "Notification marked as read"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await notificationService.markAllAsRead(userId);
      res.json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await notificationService.deleteNotification(id, userId);
      res.json({
        success: true,
        message: "Notification deleted"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
var notificationController = new NotificationController();

// src/routes/notification.routes.ts
var router10 = (0, import_express10.Router)();
router10.use(authenticate);
router10.get("/", (req, res) => notificationController.getNotifications(req, res));
router10.get("/unread-count", (req, res) => notificationController.getUnreadCount(req, res));
router10.put("/:id/read", (req, res) => notificationController.markAsRead(req, res));
router10.put("/read-all", (req, res) => notificationController.markAllAsRead(req, res));
router10.delete("/:id", (req, res) => notificationController.deleteNotification(req, res));
var notification_routes_default = router10;

// src/routes/admin.routes.ts
var import_express11 = require("express");

// src/services/admin.service.ts
var import_client6 = require("@prisma/client");
init_database();
init_email_service();
var emailService3 = new EmailService();
function toPositiveInt(value, fallback) {
  if (value === void 0 || value === null || value === "") return fallback;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
var AdminService = class {
  // User Management
  async getPendingUsers() {
    const users = await database_default.user.findMany({
      where: {
        isApproved: false,
        role: { not: import_client6.UserRole.PATIENT }
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        department: true,
        employmentType: true,
        createdAt: true
      }
    });
    return users;
  }
  async approveUser(userId, approvedById) {
    const firstLoginOTP = Math.floor(1e5 + Math.random() * 9e5).toString();
    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    const user = await database_default.user.update({
      where: { id: userId },
      data: {
        isApproved: true,
        isActive: true,
        emailVerified: false,
        emailVerificationToken: firstLoginOTP,
        // Store OTP here
        verificationEmailSentAt: /* @__PURE__ */ new Date(),
        approvedById,
        approvedAt: /* @__PURE__ */ new Date()
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isApproved: true,
        isActive: true,
        emailVerified: true
      }
    });
    await this.createAuditLog({
      userId: approvedById,
      action: "USER_APPROVED_OTP_SENT",
      resource: "users",
      resourceId: userId,
      newValues: {
        isApproved: true,
        isActive: true,
        firstLoginOTP,
        otpExpiresAt: otpExpiry.toISOString()
      }
    });
    try {
      console.log(`[admin] Sending first login OTP to ${user.email}...`);
      await emailService3.sendFirstLoginOTP(user.email, user.fullName, firstLoginOTP);
      console.log(`\u2705 [admin] First login OTP sent successfully to ${user.email}`);
    } catch (err) {
      console.error(
        "\u274C [email] First login OTP email failed (user is still approved). Check EMAIL_* in backend/.env:",
        err
      );
      console.error("[email] Error details:", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : void 0,
        email: user.email,
        fullName: user.fullName
      });
    }
    return user;
  }
  async rejectUser(userId, approvedById) {
    const user = await database_default.user.delete({
      where: { id: userId }
    });
    await this.createAuditLog({
      userId: approvedById,
      action: "USER_REJECTED",
      resource: "users",
      resourceId: userId,
      oldValues: user
    });
    return { message: "User rejected and removed" };
  }
  async getAllUsers(params) {
    const page = toPositiveInt(params.page, 1);
    const limit = Math.min(toPositiveInt(params.limit, 50), 500);
    const skip = (page - 1) * limit;
    const where = {};
    if (params.role) {
      where.role = params.role;
    }
    if (params.isActive !== void 0) {
      where.isActive = params.isActive;
    }
    const [users, total] = await Promise.all([
      database_default.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          department: true,
          employmentType: true,
          isActive: true,
          isApproved: true,
          lastLogin: true,
          createdAt: true,
          clinicalPersonaUserId: true,
          supervisedByUserId: true,
          supervisedBy: { select: { id: true, fullName: true, role: true } }
        }
      }),
      database_default.user.count({ where })
    ]);
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async updateUserStatus(userId, isActive, adminId) {
    const user = await database_default.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true
      }
    });
    await this.createAuditLog({
      userId: adminId,
      action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      resource: "users",
      resourceId: userId,
      newValues: { isActive }
    });
    return user;
  }
  async updateUserRole(userId, role, adminId) {
    if (!Object.values(import_client6.UserRole).includes(role)) {
      throw new Error("Invalid role");
    }
    const oldUser = await database_default.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    const user = await database_default.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    });
    await this.createAuditLog({
      userId: adminId,
      action: "USER_ROLE_CHANGED",
      resource: "users",
      resourceId: userId,
      oldValues: { role: oldUser?.role },
      newValues: { role }
    });
    return user;
  }
  // Audit Logs
  async createAuditLog(data) {
    const log = await database_default.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource || data.tableName,
        resourceId: data.resourceId || data.recordId,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
        newValues: data.newValues ? JSON.stringify(data.newValues) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    });
    return log;
  }
  async getAuditLogs(params) {
    const page = toPositiveInt(params.page, 1);
    const limit = Math.min(toPositiveInt(params.limit, 50), 200);
    const skip = (page - 1) * limit;
    const where = {};
    if (params.userId) {
      where.userId = params.userId;
    }
    if (params.action) {
      where.action = params.action;
    }
    if (params.tableName) {
      where.tableName = params.tableName;
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        const endDate = new Date(params.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }
    const [logs, total] = await Promise.all([
      database_default.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              role: true
            }
          }
        }
      }),
      database_default.auditLog.count({ where })
    ]);
    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  // System Statistics
  async getSystemStats() {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalPatients,
      todayVisits,
      todayRevenue
    ] = await Promise.all([
      database_default.user.count(),
      database_default.user.count({ where: { isActive: true } }),
      database_default.user.count({ where: { isApproved: false } }),
      database_default.patient.count(),
      database_default.patientVisit.count({
        where: {
          visitDate: {
            gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))
          }
        }
      }),
      database_default.financialTransaction.aggregate({
        where: {
          transactionDate: {
            gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))
          },
          paymentStatus: "PAID"
        },
        _sum: {
          amount: true
        }
      })
    ]);
    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers
      },
      patients: {
        total: totalPatients
      },
      visits: {
        today: todayVisits
      },
      revenue: {
        today: Number(todayRevenue._sum.amount ?? 0)
      }
    };
  }
  async getDashboardStats(startDate, endDate) {
    const start = startDate ? new Date(startDate) : new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
    const end = endDate ? new Date(endDate) : new Date((/* @__PURE__ */ new Date()).setHours(23, 59, 59, 999));
    const [
      visits,
      prescriptions,
      labOrders,
      ultrasoundOrders,
      revenue
    ] = await Promise.all([
      database_default.patientVisit.count({
        where: { visitDate: { gte: start, lte: end } }
      }),
      database_default.prescription.count({
        where: { createdAt: { gte: start, lte: end } }
      }),
      database_default.labOrder.count({
        where: { orderedAt: { gte: start, lte: end } }
      }),
      database_default.ultrasoundOrder.count({
        where: { createdAt: { gte: start, lte: end } }
      }),
      database_default.financialTransaction.aggregate({
        where: {
          transactionDate: { gte: start, lte: end },
          paymentStatus: "PAID"
        },
        _sum: { amount: true }
      })
    ]);
    return {
      visits,
      prescriptions,
      labOrders,
      ultrasoundOrders,
      revenue: Number(revenue._sum.amount ?? 0),
      period: { startDate: start, endDate: end }
    };
  }
  async getUserById(id) {
    const user = await database_default.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        department: true,
        employmentType: true,
        isActive: true,
        isApproved: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        patientLinkId: true,
        clinicalPersonaUserId: true,
        supervisedByUserId: true,
        supervisedBy: { select: { id: true, fullName: true, role: true } },
        clinicalPersona: { select: { id: true, fullName: true, email: true, role: true } }
      }
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async updateUserProfile(targetId, data, adminId) {
    const existing = await database_default.user.findUnique({ where: { id: targetId } });
    if (!existing) {
      throw new Error("User not found");
    }
    const patch = {};
    if (data.fullName !== void 0) {
      const name = String(data.fullName).trim();
      if (!name) throw new Error("fullName cannot be empty");
      patch.fullName = name;
    }
    if (data.phone !== void 0) patch.phone = data.phone || null;
    if (data.department !== void 0) patch.department = data.department || null;
    if (data.employmentType !== void 0) {
      const et = data.employmentType;
      patch.employmentType = et === "FULL_TIME" || et === "PART_TIME" ? et : null;
    }
    if (Object.keys(patch).length === 0) {
      throw new Error("No valid fields to update");
    }
    const user = await database_default.user.update({
      where: { id: targetId },
      data: patch,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        department: true,
        employmentType: true,
        isActive: true,
        isApproved: true,
        lastLogin: true,
        createdAt: true
      }
    });
    await this.createAuditLog({
      userId: adminId,
      action: "USER_PROFILE_UPDATED",
      resource: "users",
      resourceId: targetId,
      newValues: patch
    });
    return user;
  }
  async deleteUser(targetId, adminId) {
    if (targetId === adminId) {
      throw new Error("You cannot delete your own account");
    }
    const target = await database_default.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        _count: {
          select: {
            registeredPatients: true,
            registeredVisits: true,
            assignedVisits: true,
            prescriptions: true,
            transactions: true,
            invoices: true
          }
        }
      }
    });
    if (!target) {
      throw new Error("User not found");
    }
    if (target.role === import_client6.UserRole.SUPER_ADMIN) {
      const others = await database_default.user.count({
        where: { role: import_client6.UserRole.SUPER_ADMIN, id: { not: targetId } }
      });
      if (others === 0) {
        throw new Error("Cannot delete the last Super Admin account");
      }
    }
    const hasRelatedRecords = Object.values(target._count).some((count) => count > 0);
    if (hasRelatedRecords) {
      await database_default.user.update({
        where: { id: targetId },
        data: { isActive: false, isApproved: false }
      });
      await this.createAuditLog({
        userId: adminId,
        action: "USER_DEACTIVATED_DELETE_BLOCKED",
        resource: "users",
        resourceId: targetId,
        newValues: {
          reason: "Related records exist; user was deactivated instead of deleted",
          relatedRecords: target._count
        }
      });
      return {
        mode: "deactivated",
        message: `User "${target.fullName}" has related records (${target._count.registeredPatients} patients, ${target._count.registeredVisits} visits, etc.). The account was deactivated instead of being deleted.`
      };
    }
    await database_default.userSession.deleteMany({ where: { userId: targetId } });
    await database_default.notification.deleteMany({ where: { userId: targetId } });
    try {
      await database_default.user.delete({ where: { id: targetId } });
      await this.createAuditLog({
        userId: adminId,
        action: "USER_DELETED",
        resource: "users",
        resourceId: targetId,
        oldValues: { email: target.email, role: target.role, fullName: target.fullName }
      });
      return { mode: "deleted", message: `User account "${target.fullName}" has been permanently removed` };
    } catch (e) {
      if (e instanceof import_client6.Prisma.PrismaClientKnownRequestError && (e.code === "P2003" || e.code === "P2014")) {
        await database_default.user.update({
          where: { id: targetId },
          data: { isActive: false, isApproved: false }
        });
        await this.createAuditLog({
          userId: adminId,
          action: "USER_DEACTIVATED_DELETE_BLOCKED",
          resource: "users",
          resourceId: targetId,
          newValues: {
            reason: "Foreign key constraint prevented deletion; user was deactivated",
            error: e.code
          }
        });
        return {
          mode: "deactivated",
          message: `User "${target.fullName}" has related records in the system. The account was deactivated instead of being deleted.`
        };
      }
      console.error("Unexpected error deleting user:", e);
      throw new Error(`Failed to delete user: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }
  async getRoleSummary() {
    const grouped = await database_default.user.groupBy({
      by: ["role"],
      _count: { role: true }
    });
    return grouped.map((g) => ({
      role: g.role,
      count: g._count.role
    }));
  }
  /** Rows for CSV / JSON export (report builder). */
  async getReportExportData(type, start, end) {
    const safeEnd = new Date(end);
    safeEnd.setHours(23, 59, 59, 999);
    switch (type) {
      case "daily-revenue": {
        const rows = await database_default.financialTransaction.findMany({
          where: {
            transactionDate: { gte: start, lte: safeEnd },
            paymentStatus: "PAID"
          },
          orderBy: { transactionDate: "asc" },
          include: {
            patient: { select: { fullName: true, cardNumber: true } }
          }
        });
        return {
          filename: `revenue_${start.toISOString().slice(0, 10)}_${safeEnd.toISOString().slice(0, 10)}.csv`,
          headers: ["transactionNumber", "date", "type", "amount", "method", "patient", "cardNumber"],
          rows: rows.map((r) => ({
            transactionNumber: r.transactionNumber,
            date: r.transactionDate.toISOString(),
            type: r.transactionType,
            amount: Number(r.amount),
            method: r.paymentMethod,
            patient: r.patient?.fullName ?? "",
            cardNumber: r.patient?.cardNumber ?? ""
          }))
        };
      }
      case "patient-visits": {
        const rows = await database_default.patientVisit.findMany({
          where: { visitDate: { gte: start, lte: safeEnd } },
          orderBy: { visitDate: "desc" },
          include: {
            patient: { select: { fullName: true, cardNumber: true } },
            assignedDoctor: { select: { fullName: true } }
          }
        });
        return {
          filename: `visits_${start.toISOString().slice(0, 10)}_${safeEnd.toISOString().slice(0, 10)}.csv`,
          headers: ["visitNumber", "date", "patient", "card", "status", "service", "doctor"],
          rows: rows.map((v) => ({
            visitNumber: v.visitNumber,
            date: v.visitDate.toISOString(),
            patient: v.patient.fullName,
            card: v.patient.cardNumber,
            status: v.status,
            service: v.serviceType,
            doctor: v.assignedDoctor?.fullName ?? ""
          }))
        };
      }
      case "lab-tests": {
        const rows = await database_default.labOrder.findMany({
          where: { orderedAt: { gte: start, lte: safeEnd } },
          orderBy: { orderedAt: "desc" },
          include: {
            patient: { select: { fullName: true, cardNumber: true } },
            items: { select: { testName: true, status: true } }
          }
        });
        return {
          filename: `lab_orders_${start.toISOString().slice(0, 10)}.csv`,
          headers: ["orderNumber", "orderedAt", "status", "patient", "card", "items"],
          rows: rows.map((o) => ({
            orderNumber: o.orderNumber,
            orderedAt: o.orderedAt.toISOString(),
            status: o.status,
            patient: o.patient.fullName,
            card: o.patient.cardNumber,
            items: o.items.map((i) => `${i.testName}:${i.status}`).join("; ")
          }))
        };
      }
      case "pharmacy-sales": {
        const rows = await database_default.prescription.findMany({
          where: {
            status: "DISPENSED",
            dispensedAt: { gte: start, lte: safeEnd }
          },
          orderBy: { dispensedAt: "desc" },
          include: {
            patient: { select: { fullName: true, cardNumber: true } },
            items: { select: { drugName: true, quantity: true } }
          }
        });
        return {
          filename: `pharmacy_dispensed_${start.toISOString().slice(0, 10)}.csv`,
          headers: ["prescriptionNumber", "dispensedAt", "patient", "card", "lines"],
          rows: rows.map((p) => ({
            prescriptionNumber: p.prescriptionNumber,
            dispensedAt: p.dispensedAt ? p.dispensedAt.toISOString() : "",
            patient: p.patient.fullName,
            card: p.patient.cardNumber,
            lines: p.items.map((i) => `${i.drugName}x${i.quantity}`).join("; ")
          }))
        };
      }
      case "staff-performance": {
        const rows = await database_default.auditLog.groupBy({
          by: ["userId"],
          where: {
            createdAt: { gte: start, lte: safeEnd },
            userId: { not: null }
          },
          _count: { id: true }
        });
        const users = await database_default.user.findMany({
          where: { id: { in: rows.map((r) => r.userId).filter(Boolean) } },
          select: { id: true, fullName: true, email: true, role: true }
        });
        const map = new Map(users.map((u) => [u.id, u]));
        return {
          filename: `staff_activity_${start.toISOString().slice(0, 10)}.csv`,
          headers: ["user", "email", "role", "actionsLogged"],
          rows: rows.map((r) => {
            const u = r.userId ? map.get(r.userId) : void 0;
            return {
              user: u?.fullName ?? r.userId ?? "",
              email: u?.email ?? "",
              role: u?.role ?? "",
              actionsLogged: r._count.id
            };
          })
        };
      }
      case "inventory-status": {
        const rows = await database_default.pharmacyStock.findMany({
          where: { status: { not: "EXPIRED" } },
          include: { drug: { select: { drugName: true } } },
          orderBy: { quantityInStock: "asc" },
          take: 2e3
        });
        return {
          filename: `inventory_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`,
          headers: ["drug", "batch", "qty", "reorderLevel", "status", "expiry"],
          rows: rows.map((s) => ({
            drug: s.drug.drugName,
            batch: s.batchNumber,
            qty: s.quantityInStock,
            reorderLevel: s.reorderLevel,
            status: s.status,
            expiry: s.expiryDate.toISOString().slice(0, 10)
          }))
        };
      }
      case "appointment-analytics":
      case "department-performance": {
        const visits = await database_default.patientVisit.groupBy({
          by: ["serviceType"],
          where: { visitDate: { gte: start, lte: safeEnd } },
          _count: { id: true }
        });
        return {
          filename: `visits_by_service_${start.toISOString().slice(0, 10)}.csv`,
          headers: ["serviceType", "visitCount"],
          rows: visits.map((v) => ({
            serviceType: v.serviceType,
            visitCount: v._count.id
          }))
        };
      }
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }
};

// src/controllers/admin.controller.ts
var adminService = new AdminService();
var getPendingUsers = async (_req, res) => {
  try {
    const users = await adminService.getPendingUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch pending users"
    });
  }
};
var approveUser = async (req, res) => {
  try {
    const user = await adminService.approveUser(req.params.id, req.user.id);
    res.json({
      success: true,
      data: user,
      message: "User approved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to approve user"
    });
  }
};
var rejectUser = async (req, res) => {
  try {
    const result = await adminService.rejectUser(req.params.id, req.user.id);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to reject user"
    });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch users"
    });
  }
};
var updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await adminService.updateUserStatus(
      req.params.id,
      isActive,
      req.user.id
    );
    res.json({
      success: true,
      data: user,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update user status"
    });
  }
};
var updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(
      req.params.id,
      role,
      req.user.id
    );
    res.json({
      success: true,
      data: user,
      message: "User role updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update user role"
    });
  }
};
var getAuditLogs = async (req, res) => {
  try {
    const result = await adminService.getAuditLogs(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch audit logs"
    });
  }
};
var getSystemStats = async (_req, res) => {
  try {
    const stats = await adminService.getSystemStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch system stats"
    });
  }
};
var getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await adminService.getDashboardStats(
      startDate,
      endDate
    );
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch dashboard stats"
    });
  }
};
var getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      error: error.message || "Failed to fetch user"
    });
  }
};
var updateUserProfile = async (req, res) => {
  try {
    const user = await adminService.updateUserProfile(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: user, message: "Profile updated" });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to update user"
    });
  }
};
var deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to delete user"
    });
  }
};
var getRoleSummary = async (_req, res) => {
  try {
    const data = await adminService.getRoleSummary();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch role summary"
    });
  }
};
function buildCsv(headers, rows) {
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [
    headers.map((h) => esc(h)).join(","),
    ...rows.map((row) => headers.map((h) => esc(row[h])).join(","))
  ];
  return lines.join("\r\n");
}
var exportReport = async (req, res) => {
  try {
    const { type, startDate, endDate, format } = req.query;
    if (!type || typeof type !== "string") {
      res.status(400).json({ success: false, error: "type is required" });
      return;
    }
    const start = startDate ? new Date(String(startDate)) : new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
    const end = endDate ? new Date(String(endDate)) : /* @__PURE__ */ new Date();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      res.status(400).json({ success: false, error: "Invalid date range" });
      return;
    }
    const { filename, headers, rows } = await adminService.getReportExportData(type, start, end);
    const fmt = format && String(format).toLowerCase() || "csv";
    if (fmt === "json") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/\.csv$/, ".json")}"`);
      res.send(JSON.stringify({ headers, rows }, null, 2));
      return;
    }
    const csv = buildCsv(headers, rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send("\uFEFF" + csv);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Export failed"
    });
  }
};

// src/routes/admin.routes.ts
var router11 = (0, import_express11.Router)();
router11.use(authenticate);
router11.use(authorize("SUPER_ADMIN"));
router11.get("/reports/export", exportReport);
router11.get("/roles/summary", getRoleSummary);
router11.get("/users/pending", getPendingUsers);
router11.post("/users/:id/approve", approveUser);
router11.post("/users/:id/reject", rejectUser);
router11.get("/users", getAllUsers);
router11.get("/users/:id", getUserById);
router11.patch("/users/:id/status", updateUserStatus);
router11.patch("/users/:id/role", updateUserRole);
router11.patch("/users/:id", updateUserProfile);
router11.delete("/users/:id", deleteUser);
router11.get("/audit-logs", getAuditLogs);
router11.get("/stats/system", getSystemStats);
router11.get("/stats/dashboard", getDashboardStats);
var admin_routes_default = router11;

// src/routes/chat.routes.ts
var import_express12 = require("express");

// src/services/chat.service.ts
var import_client7 = require("@prisma/client");
init_database();
var ChatService = class {
  async getPeerSummary(userId) {
    return database_default.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        role: true,
        department: true,
        email: true,
        profilePhoto: true
      }
    });
  }
  async listChatUsers(currentUserId) {
    return database_default.user.findMany({
      where: {
        id: { not: currentUserId },
        isActive: true,
        isApproved: true,
        role: { not: import_client7.UserRole.PATIENT }
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        department: true,
        profilePhoto: true
      },
      orderBy: { fullName: "asc" }
    });
  }
  async getConversation(currentUserId, withUserId) {
    const rows = await database_default.notification.findMany({
      where: {
        userId: currentUserId,
        notificationType: "CHAT_DM",
        relatedId: withUserId
      },
      orderBy: { createdAt: "asc" },
      take: 200
    });
    return rows.map((row) => {
      let senderId = "";
      let senderName = "Unknown";
      if (row.title.startsWith("FROM:")) {
        const rest = row.title.slice(5);
        const pipe = rest.indexOf("|");
        if (pipe >= 0) {
          senderId = rest.slice(0, pipe);
          senderName = rest.slice(pipe + 1).trim() || "Unknown";
        } else {
          senderId = rest;
        }
      }
      return {
        id: row.id,
        senderId,
        senderName,
        message: row.message,
        createdAt: row.createdAt,
        isOwn: senderId === currentUserId
      };
    });
  }
  async sendMessage(senderId, recipientId, message) {
    const sender = await database_default.user.findUnique({
      where: { id: senderId },
      select: { fullName: true }
    });
    if (!sender) {
      throw new Error("Sender not found");
    }
    const payloadTitle = `FROM:${senderId}|${sender.fullName}`;
    const [recipientMessage, senderCopy] = await database_default.$transaction([
      database_default.notification.create({
        data: {
          userId: recipientId,
          notificationType: "CHAT_DM",
          title: payloadTitle,
          message,
          relatedId: senderId,
          isRead: false
        }
      }),
      database_default.notification.create({
        data: {
          userId: senderId,
          notificationType: "CHAT_DM",
          title: payloadTitle,
          message,
          relatedId: recipientId,
          isRead: true,
          readAt: /* @__PURE__ */ new Date()
        }
      })
    ]);
    return { recipientMessage, senderCopy };
  }
};

// src/controllers/chat.controller.ts
var chatService = new ChatService();
var ChatController = class {
  async getUsers(req, res) {
    try {
      const users = await chatService.listChatUsers(req.user.id);
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async getConversation(req, res) {
    try {
      const peerId = req.params.userId;
      const [messages, peer] = await Promise.all([
        chatService.getConversation(req.user.id, peerId),
        chatService.getPeerSummary(peerId)
      ]);
      res.json({ success: true, data: { messages, peer } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async sendMessage(req, res) {
    try {
      const { recipientId, message } = req.body;
      if (!recipientId || !message) {
        res.status(400).json({ success: false, error: "recipientId and message are required" });
        return;
      }
      const result = await chatService.sendMessage(req.user.id, recipientId, message);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

// src/routes/chat.routes.ts
var router12 = (0, import_express12.Router)();
var chatController = new ChatController();
router12.use(authenticate);
router12.get("/users", chatController.getUsers.bind(chatController));
router12.get("/conversations/:userId", chatController.getConversation.bind(chatController));
router12.post("/messages", chatController.sendMessage.bind(chatController));
var chat_routes_default = router12;

// src/routes/patientPortal.routes.ts
var import_express13 = require("express");

// src/services/patientPortal.service.ts
var import_client8 = require("@prisma/client");
init_database();
var patientService2 = new PatientService();
var PatientPortalService = class {
  async getDashboard(userId, audit) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: { role: true, patientLinkId: true }
    });
    if (!user || user.role !== import_client8.UserRole.PATIENT || !user.patientLinkId) {
      throw new Error("Portal profile is not linked to a patient record");
    }
    const patient = await patientService2.getPatientById(user.patientLinkId);
    await database_default.auditLog.create({
      data: {
        userId,
        action: "PATIENT_PORTAL_DASHBOARD_ACCESS",
        resource: "patients",
        resourceId: user.patientLinkId,
        newValues: { scope: "portal_dashboard" },
        ipAddress: audit?.ipAddress,
        userAgent: audit?.userAgent
      }
    });
    return {
      profile: {
        fullName: patient.fullName,
        cardNumber: patient.cardNumber,
        sex: patient.sex,
        dateOfBirth: patient.dateOfBirth,
        phone: patient.phone,
        allergies: patient.allergies,
        bloodType: patient.bloodType
      },
      recentVisits: patient.visits.map((v) => ({
        id: v.id,
        visitDate: v.visitDate,
        status: v.status,
        serviceType: v.serviceType,
        doctor: v.assignedDoctor?.fullName ?? null
      }))
    };
  }
};

// src/controllers/patientPortal.controller.ts
var service = new PatientPortalService();
var getPatientPortalDashboard = async (req, res) => {
  try {
    const data = await service.getDashboard(req.user.id, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || void 0
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to load portal"
    });
  }
};

// src/routes/patientPortal.routes.ts
var router13 = (0, import_express13.Router)();
router13.use(authenticate);
router13.use(authorize("PATIENT"));
router13.get("/dashboard", getPatientPortalDashboard);
var patientPortal_routes_default = router13;

// src/routes/user.routes.ts
var import_express14 = require("express");
var import_multer = __toESM(require("multer"));

// src/services/user.service.ts
init_database();
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var UserService = class {
  async getProfile(userId) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        department: true,
        employmentType: true,
        isActive: true,
        emailVerified: true,
        profilePhoto: true,
        createdAt: true,
        lastLogin: true
      }
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async updateProfile(userId, data) {
    const updateData = {};
    if (data.fullName?.trim()) {
      updateData.fullName = data.fullName.trim();
    }
    if (data.phone !== void 0) {
      updateData.phone = data.phone?.trim() || null;
    }
    if (data.department !== void 0) {
      updateData.department = data.department?.trim() || null;
    }
    const user = await database_default.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        department: true,
        profilePhoto: true
      }
    });
    return user;
  }
  async changePassword(userId, currentPassword, newPassword) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }
    const newPasswordHash = await hashPassword(newPassword);
    await database_default.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });
    await database_default.auditLog.create({
      data: {
        userId,
        action: "PASSWORD_CHANGED",
        resource: "users",
        resourceId: userId,
        newValues: JSON.stringify({ changedAt: (/* @__PURE__ */ new Date()).toISOString() })
      }
    });
  }
  async requestEmailChange(userId, newEmail, password) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: { email: true, passwordHash: true, fullName: true }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Password is incorrect");
    }
    const existingUser = await database_default.user.findUnique({
      where: { email: newEmail.toLowerCase().trim() }
    });
    if (existingUser) {
      throw new Error("Email is already in use");
    }
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1e3);
    await database_default.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: otp,
        verificationEmailSentAt: /* @__PURE__ */ new Date()
      }
    });
    await database_default.auditLog.create({
      data: {
        userId,
        action: "EMAIL_CHANGE_REQUESTED",
        resource: "users",
        resourceId: userId,
        oldValues: JSON.stringify({ currentEmail: user.email }),
        newValues: JSON.stringify({
          newEmail: newEmail.toLowerCase().trim(),
          otp,
          expiresAt: otpExpiry.toISOString()
        })
      }
    });
    const { EmailService: EmailService2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
    const emailService4 = new EmailService2();
    await emailService4.sendEmailChangeOTP(
      newEmail.toLowerCase().trim(),
      user.fullName,
      otp
    );
    return { newEmail: newEmail.toLowerCase().trim() };
  }
  async confirmEmailChange(userId, otp) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerificationToken: true,
        verificationEmailSentAt: true
      }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const emailChangeRequest = await database_default.auditLog.findFirst({
      where: {
        userId,
        action: "EMAIL_CHANGE_REQUESTED"
      },
      orderBy: {
        timestamp: "desc"
      }
    });
    if (!emailChangeRequest) {
      throw new Error("No email change request found");
    }
    const newValues = JSON.parse(emailChangeRequest.newValues);
    const storedOtp = newValues.otp;
    if (storedOtp !== otp) {
      throw new Error("Invalid OTP code");
    }
    const expiresAt = new Date(newValues.expiresAt);
    if (expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("OTP has expired. Please request a new one.");
    }
    const newEmail = newValues.newEmail;
    const oldValues = JSON.parse(emailChangeRequest.oldValues);
    const oldEmail = oldValues.currentEmail;
    const existingUser = await database_default.user.findUnique({
      where: { email: newEmail }
    });
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email is already in use");
    }
    const updatedUser = await database_default.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        emailVerificationToken: null,
        verificationEmailSentAt: null,
        emailVerified: true,
        emailVerifiedAt: /* @__PURE__ */ new Date()
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    });
    await database_default.auditLog.create({
      data: {
        userId,
        action: "EMAIL_CHANGED",
        resource: "users",
        resourceId: userId,
        oldValues: JSON.stringify({ email: oldEmail }),
        newValues: JSON.stringify({ email: newEmail })
      }
    });
    return updatedUser;
  }
  async uploadProfilePhoto(userId, file) {
    const uploadsDir = process.env.UPLOAD_DIR || "./uploads";
    const profilePhotosDir = import_path.default.join(uploadsDir, "profile-photos");
    await import_promises.default.mkdir(profilePhotosDir, { recursive: true });
    const ext = import_path.default.extname(file.originalname);
    const filename = `${userId}-${Date.now()}${ext}`;
    const filepath = import_path.default.join(profilePhotosDir, filename);
    await import_promises.default.writeFile(filepath, file.buffer);
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: { profilePhoto: true }
    });
    if (user?.profilePhoto) {
      const relativePath = user.profilePhoto.replace(/^\//, "").replace(/\//g, import_path.default.sep);
      const oldPath = import_path.default.join(uploadsDir, relativePath);
      await import_promises.default.unlink(oldPath).catch(() => {
      });
    }
    const photoUrl = `/uploads/profile-photos/${filename}`;
    await database_default.user.update({
      where: { id: userId },
      data: { profilePhoto: photoUrl }
    });
    console.log(`[uploadProfilePhoto] \u2705 Photo uploaded: ${photoUrl}`);
    console.log(`[uploadProfilePhoto] File saved to: ${filepath}`);
    return photoUrl;
  }
  async deleteProfilePhoto(userId) {
    const user = await database_default.user.findUnique({
      where: { id: userId },
      select: { profilePhoto: true }
    });
    if (!user?.profilePhoto) {
      return;
    }
    const uploadsDir = process.env.UPLOAD_DIR || "./uploads";
    const relativePath = user.profilePhoto.replace(/^\//, "").replace(/\//g, import_path.default.sep);
    const filepath = import_path.default.join(uploadsDir, relativePath);
    await import_promises.default.unlink(filepath).catch(() => {
    });
    await database_default.user.update({
      where: { id: userId },
      data: { profilePhoto: null }
    });
    console.log(`[deleteProfilePhoto] \u2705 Photo deleted for user ${userId}`);
  }
};

// src/controllers/user.controller.ts
var userService = new UserService();
var getMyProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch profile"
    });
  }
};
var updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, department } = req.body;
    const profile = await userService.updateProfile(req.user.id, {
      fullName,
      phone,
      department
    });
    res.json({
      success: true,
      data: profile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to update profile"
    });
  }
};
var changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: "Current password and new password are required"
      });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters"
      });
      return;
    }
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to change password"
    });
  }
};
var requestEmailChange = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    console.log(`[requestEmailChange] User ${req.user.id} requesting email change to ${newEmail}`);
    if (!newEmail || !password) {
      res.status(400).json({
        success: false,
        error: "New email and password are required"
      });
      return;
    }
    await userService.requestEmailChange(req.user.id, newEmail, password);
    console.log(`[requestEmailChange] \u2705 OTP sent successfully to ${newEmail}`);
    res.json({
      success: true,
      message: "OTP sent to your new email address"
    });
  } catch (error) {
    console.error(`[requestEmailChange] \u274C Error:`, error.message);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to request email change"
    });
  }
};
var confirmEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log(`[confirmEmailChange] User ${req.user.id} verifying OTP: ${otp}`);
    if (!otp) {
      res.status(400).json({
        success: false,
        error: "OTP code is required"
      });
      return;
    }
    const result = await userService.confirmEmailChange(req.user.id, otp);
    console.log(`[confirmEmailChange] \u2705 Email changed successfully to ${result.email}`);
    res.json({
      success: true,
      data: result,
      message: "Email changed successfully"
    });
  } catch (error) {
    console.error(`[confirmEmailChange] \u274C Error:`, error.message);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to confirm email change"
    });
  }
};
var uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
      return;
    }
    const photoUrl = await userService.uploadProfilePhoto(req.user.id, req.file);
    res.json({
      success: true,
      data: { photoUrl },
      message: "Profile photo uploaded successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to upload photo"
    });
  }
};
var deleteProfilePhoto = async (req, res) => {
  try {
    await userService.deleteProfilePhoto(req.user.id);
    res.json({
      success: true,
      message: "Profile photo deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to delete photo"
    });
  }
};

// src/routes/user.routes.ts
var router14 = (0, import_express14.Router)();
var upload = (0, import_multer.default)({
  storage: import_multer.default.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  }
});
router14.use(authenticate);
router14.get("/doctors", async (req, res) => {
  try {
    const doctors = await (await Promise.resolve().then(() => (init_database(), database_exports))).default.user.findMany({
      where: {
        role: "DOCTOR",
        isActive: true,
        isApproved: true
      },
      select: {
        id: true,
        fullName: true,
        department: true,
        phone: true
      },
      orderBy: { fullName: "asc" }
    });
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch doctors"
    });
  }
});
router14.get("/staff", async (req, res) => {
  try {
    const staff = await (await Promise.resolve().then(() => (init_database(), database_exports))).default.user.findMany({
      where: {
        role: {
          in: ["DOCTOR", "NURSE", "INJECTION_NURSE", "ULTRASOUND_TECHNICIAN"]
        },
        isActive: true,
        isApproved: true
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        department: true,
        phone: true
      },
      orderBy: [{ role: "asc" }, { fullName: "asc" }]
    });
    const groupedStaff = {
      doctors: staff.filter((s) => s.role === "DOCTOR"),
      nurses: staff.filter((s) => s.role === "NURSE"),
      injectionStaff: staff.filter((s) => s.role === "INJECTION_NURSE"),
      ultrasoundTechs: staff.filter((s) => s.role === "ULTRASOUND_TECHNICIAN"),
      all: staff
    };
    res.json({
      success: true,
      data: groupedStaff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch staff"
    });
  }
});
router14.get("/profile", getMyProfile);
router14.patch("/profile", updateMyProfile);
router14.post("/change-password", changePassword);
router14.post("/request-email-change", requestEmailChange);
router14.post("/confirm-email-change", confirmEmailChange);
router14.post("/profile-photo", upload.single("photo"), uploadProfilePhoto);
router14.delete("/profile-photo", deleteProfilePhoto);
var user_routes_default = router14;

// src/routes/uploads.routes.ts
var import_express15 = require("express");
var import_path2 = __toESM(require("path"));
var import_promises2 = __toESM(require("fs/promises"));
var router15 = (0, import_express15.Router)();
router15.get("/profile-photos/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      res.status(400).json({ success: false, error: "Invalid filename" });
      return;
    }
    const uploadsDir = process.env.UPLOAD_DIR || "./uploads";
    const filepath = import_path2.default.join(uploadsDir, "profile-photos", filename);
    try {
      await import_promises2.default.access(filepath);
    } catch {
      res.status(404).json({ success: false, error: "Photo not found" });
      return;
    }
    const ext = import_path2.default.extname(filename).toLowerCase();
    const contentTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp"
    };
    const contentType = contentTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.sendFile(import_path2.default.resolve(filepath));
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to serve photo" });
  }
});
var uploads_routes_default = router15;

// src/routes/appointment.routes.ts
var import_express16 = require("express");

// src/services/appointment.service.ts
init_database();
var AppointmentService = class {
  /**
   * Create a new appointment with conflict detection
   */
  async createAppointment(data) {
    return withDb(async () => {
      const patient = await database_default.patient.findUnique({
        where: { id: data.patientId }
      });
      if (!patient) {
        throw new Error("Patient not found");
      }
      const doctor = await database_default.user.findUnique({
        where: { id: data.doctorId }
      });
      if (!doctor || doctor.role !== "DOCTOR") {
        throw new Error("Invalid doctor");
      }
      const conflict = await this.checkConflict(
        data.doctorId,
        data.startTime,
        data.endTime
      );
      if (conflict) {
        throw new Error(`Appointment conflict: ${conflict}`);
      }
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      const count = await database_default.appointment.count();
      const appointmentNumber = `APT-${year}-${String(count + 1).padStart(5, "0")}`;
      return database_default.appointment.create({
        data: {
          appointmentNumber,
          patientId: data.patientId,
          doctorId: data.doctorId,
          appointmentDate: new Date(data.appointmentDate),
          // Convert to DateTime
          startTime: data.startTime,
          endTime: data.endTime,
          serviceType: data.serviceType,
          reason: data.reason,
          notes: data.notes,
          status: "SCHEDULED"
        },
        include: {
          patient: {
            select: {
              id: true,
              cardNumber: true,
              fullName: true,
              phone: true,
              photoUrl: true
            }
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              department: true
            }
          }
        }
      });
    });
  }
  /**
   * Check for appointment conflicts
   */
  async checkConflict(doctorId, startTime, endTime, excludeAppointmentId) {
    const conflicts = await database_default.appointment.findMany({
      where: {
        doctorId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : void 0,
        status: {
          in: ["SCHEDULED", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"]
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });
    if (conflicts.length > 0) {
      return `Doctor already has an appointment at this time`;
    }
    return null;
  }
  /**
   * Get appointments with filters
   */
  async getAppointments(params) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;
    const where = {};
    if (params.doctorId) where.doctorId = params.doctorId;
    if (params.patientId) where.patientId = params.patientId;
    if (params.status) where.status = params.status;
    if (params.date) {
      const date = new Date(params.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.appointmentDate = {
        gte: date,
        lt: nextDay
      };
    }
    const [appointments, total] = await Promise.all([
      database_default.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ appointmentDate: "asc" }, { startTime: "asc" }],
        include: {
          patient: {
            select: {
              id: true,
              cardNumber: true,
              fullName: true,
              phone: true,
              photoUrl: true
            }
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              department: true
            }
          }
        }
      }),
      database_default.appointment.count({ where })
    ]);
    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  /**
   * Get appointment by ID
   */
  async getAppointmentById(id) {
    const appointment = await database_default.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            fullName: true,
            department: true,
            phone: true
          }
        },
        visit: true
      }
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return appointment;
  }
  /**
   * Check in appointment and create visit
   */
  async checkInAppointment(id, registeredById) {
    return withDb(async () => {
      const appointment = await database_default.appointment.findUnique({
        where: { id },
        include: { patient: true }
      });
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      if (appointment.status !== "SCHEDULED" && appointment.status !== "CONFIRMED") {
        throw new Error(`Cannot check in appointment with status: ${appointment.status}`);
      }
      const updated = await database_default.appointment.update({
        where: { id },
        data: {
          status: "CHECKED_IN",
          checkedInAt: /* @__PURE__ */ new Date()
        }
      });
      const visitCount = await database_default.patientVisit.count({
        where: { patientId: appointment.patientId }
      });
      const visit = await database_default.patientVisit.create({
        data: {
          patientId: appointment.patientId,
          visitNumber: visitCount + 1,
          visitType: "FOLLOW_UP",
          serviceType: appointment.serviceType,
          assignedDoctorId: appointment.doctorId,
          registeredById,
          isWalkIn: false,
          appointmentId: appointment.id,
          arrivedAt: /* @__PURE__ */ new Date(),
          status: "IN_QUEUE"
        },
        include: {
          patient: true,
          assignedDoctor: {
            select: {
              fullName: true
            }
          }
        }
      });
      return { appointment: updated, visit };
    });
  }
  /**
   * Cancel appointment
   */
  async cancelAppointment(id, reason, cancelledBy) {
    return withDb(async () => {
      const appointment = await database_default.appointment.findUnique({
        where: { id }
      });
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
        throw new Error(`Cannot cancel appointment with status: ${appointment.status}`);
      }
      return database_default.appointment.update({
        where: { id },
        data: {
          status: "CANCELLED",
          cancelledAt: /* @__PURE__ */ new Date(),
          cancelledBy,
          cancellationReason: reason
        },
        include: {
          patient: {
            select: {
              fullName: true,
              phone: true
            }
          },
          doctor: {
            select: {
              fullName: true
            }
          }
        }
      });
    });
  }
  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(id, newDate, newStartTime, newEndTime) {
    return withDb(async () => {
      const appointment = await database_default.appointment.findUnique({
        where: { id }
      });
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      if (appointment.status !== "SCHEDULED" && appointment.status !== "CONFIRMED") {
        throw new Error(`Cannot reschedule appointment with status: ${appointment.status}`);
      }
      const conflict = await this.checkConflict(
        appointment.doctorId,
        newStartTime,
        newEndTime,
        id
      );
      if (conflict) {
        throw new Error(`Rescheduling conflict: ${conflict}`);
      }
      return database_default.appointment.update({
        where: { id },
        data: {
          appointmentDate: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
          status: "RESCHEDULED",
          rescheduledFrom: appointment.startTime.toISOString()
        },
        include: {
          patient: {
            select: {
              fullName: true,
              phone: true
            }
          },
          doctor: {
            select: {
              fullName: true
            }
          }
        }
      });
    });
  }
  /**
   * Mark appointment as no-show
   */
  async markNoShow(id) {
    return withDb(async () => {
      const appointment = await database_default.appointment.findUnique({
        where: { id }
      });
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      const now = /* @__PURE__ */ new Date();
      if (appointment.startTime > now) {
        throw new Error("Cannot mark as no-show before appointment time");
      }
      if (appointment.status === "CHECKED_IN" || appointment.status === "COMPLETED") {
        throw new Error(`Cannot mark as no-show with status: ${appointment.status}`);
      }
      return database_default.appointment.update({
        where: { id },
        data: {
          status: "NO_SHOW"
        }
      });
    });
  }
  /**
   * Uncheck-in appointment (reverse check-in)
   */
  async uncheckInAppointment(id) {
    return withDb(async () => {
      const appointment = await database_default.appointment.findUnique({
        where: { id },
        include: { visit: true }
      });
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      if (appointment.status !== "CHECKED_IN") {
        throw new Error(`Cannot uncheck-in appointment with status: ${appointment.status}`);
      }
      const updated = await database_default.appointment.update({
        where: { id },
        data: {
          status: "SCHEDULED",
          checkedInAt: null
        }
      });
      if (appointment.visit && appointment.visit.status === "IN_QUEUE") {
        await database_default.patientVisit.delete({
          where: { id: appointment.visit.id }
        });
      }
      return updated;
    });
  }
  /**
   * Update appointment status
   */
  async updateStatus(id, status) {
    return database_default.appointment.update({
      where: { id },
      data: { status }
    });
  }
};

// src/controllers/appointment.controller.ts
var appointmentService = new AppointmentService();
var AppointmentController = class {
  async createAppointment(req, res) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async getAppointments(req, res) {
    try {
      const { doctorId, patientId, status, date, page, limit } = req.query;
      const result = await appointmentService.getAppointments({
        doctorId,
        patientId,
        status,
        date,
        page: page ? Number(page) : void 0,
        limit: limit ? Number(limit) : void 0
      });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  async getAppointmentById(req, res) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);
      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async checkInAppointment(req, res) {
    try {
      const result = await appointmentService.checkInAppointment(
        req.params.id,
        req.user.id
      );
      res.json({
        success: true,
        message: "Appointment checked in successfully",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async cancelAppointment(req, res) {
    try {
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        res.status(400).json({
          success: false,
          error: "Cancellation reason is required"
        });
        return;
      }
      const appointment = await appointmentService.cancelAppointment(
        req.params.id,
        reason,
        req.user.id
      );
      res.json({
        success: true,
        message: "Appointment cancelled successfully",
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async rescheduleAppointment(req, res) {
    try {
      const { appointmentDate, startTime, endTime } = req.body;
      if (!appointmentDate || !startTime || !endTime) {
        res.status(400).json({
          success: false,
          error: "appointmentDate, startTime, and endTime are required"
        });
        return;
      }
      const appointment = await appointmentService.rescheduleAppointment(
        req.params.id,
        new Date(appointmentDate),
        new Date(startTime),
        new Date(endTime)
      );
      res.json({
        success: true,
        message: "Appointment rescheduled successfully",
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async markNoShow(req, res) {
    try {
      const appointment = await appointmentService.markNoShow(req.params.id);
      res.json({
        success: true,
        message: "Appointment marked as no-show",
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
  async uncheckInAppointment(req, res) {
    try {
      const appointment = await appointmentService.uncheckInAppointment(req.params.id);
      res.json({
        success: true,
        message: "Appointment unchecked-in successfully",
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

// src/routes/appointment.routes.ts
var import_zod6 = require("zod");
var router16 = (0, import_express16.Router)();
var appointmentController = new AppointmentController();
var createAppointmentSchema = import_zod6.z.object({
  patientId: import_zod6.z.string().uuid(),
  doctorId: import_zod6.z.string().uuid(),
  appointmentDate: import_zod6.z.string(),
  startTime: import_zod6.z.string(),
  endTime: import_zod6.z.string(),
  serviceType: import_zod6.z.enum(["OPD", "ULTRASOUND", "EMERGENCY", "INJECTION"]),
  reason: import_zod6.z.string().optional(),
  notes: import_zod6.z.string().optional()
});
var cancelAppointmentSchema = import_zod6.z.object({
  reason: import_zod6.z.string().min(5, "Cancellation reason must be at least 5 characters")
});
var rescheduleAppointmentSchema = import_zod6.z.object({
  appointmentDate: import_zod6.z.string(),
  startTime: import_zod6.z.string(),
  endTime: import_zod6.z.string()
});
router16.use(authenticate);
router16.post(
  "/",
  authorize("RECEPTIONIST", "SUPER_ADMIN", "DOCTOR"),
  validate(createAppointmentSchema),
  appointmentController.createAppointment.bind(appointmentController)
);
router16.get("/", appointmentController.getAppointments.bind(appointmentController));
router16.get("/:id", appointmentController.getAppointmentById.bind(appointmentController));
router16.put(
  "/:id/check-in",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  appointmentController.checkInAppointment.bind(appointmentController)
);
router16.put(
  "/:id/cancel",
  authorize("RECEPTIONIST", "SUPER_ADMIN", "DOCTOR"),
  validate(cancelAppointmentSchema),
  appointmentController.cancelAppointment.bind(appointmentController)
);
router16.put(
  "/:id/reschedule",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  validate(rescheduleAppointmentSchema),
  appointmentController.rescheduleAppointment.bind(appointmentController)
);
router16.put(
  "/:id/no-show",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  appointmentController.markNoShow.bind(appointmentController)
);
router16.put(
  "/:id/uncheck-in",
  authorize("RECEPTIONIST", "SUPER_ADMIN"),
  appointmentController.uncheckInAppointment.bind(appointmentController)
);
var appointment_routes_default = router16;

// src/routes/nurse.routes.ts
var import_express17 = require("express");

// src/services/nurse.service.ts
var import_client9 = require("@prisma/client");
var prisma4 = new import_client9.PrismaClient();
var NurseService = class {
  // ============================================
  // TRIAGE MANAGEMENT
  // ============================================
  async createTriageRecord(data) {
    let bmi;
    if (data.weight && data.height) {
      const heightInMeters = data.height / 100;
      bmi = data.weight / (heightInMeters * heightInMeters);
    }
    const triageRecord = await prisma4.triageRecord.create({
      data: {
        ...data,
        bmi,
        alertSent: data.triageLevel === "CRITICAL"
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            photoUrl: true
          }
        },
        visit: true,
        triageBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
    await prisma4.patientVisit.update({
      where: { id: data.visitId },
      data: {
        triageLevel: data.triageLevel,
        status: "IN_QUEUE"
      }
    });
    if (data.triageLevel === "CRITICAL") {
      const visit = await prisma4.patientVisit.findUnique({
        where: { id: data.visitId },
        include: { assignedDoctor: true }
      });
      if (visit?.assignedDoctorId) {
        await prisma4.notification.create({
          data: {
            userId: visit.assignedDoctorId,
            notificationType: "CRITICAL_PATIENT",
            title: "Critical Patient Alert",
            message: `Critical patient: ${triageRecord.patient.fullName} - ${data.chiefComplaint}`,
            relatedId: data.visitId
          }
        });
      }
    }
    return triageRecord;
  }
  async getTriageQueue(filters) {
    const where = {};
    if (filters?.triageLevel) {
      where.triageLevel = filters.triageLevel;
    }
    if (filters?.routedTo) {
      where.routedTo = filters.routedTo;
    }
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.triageAt = {
        gte: startOfDay,
        lte: endOfDay
      };
    }
    return await prisma4.triageRecord.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            photoUrl: true
          }
        },
        visit: {
          include: {
            assignedDoctor: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        triageBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: [
        { triageLevel: "asc" },
        // Critical first
        { triageAt: "asc" }
      ]
    });
  }
  // ============================================
  // VITAL SIGNS MANAGEMENT
  // ============================================
  async recordVitalSigns(data) {
    let bmi;
    if (data.weight && data.height) {
      const heightInMeters = data.height / 100;
      bmi = data.weight / (heightInMeters * heightInMeters);
    }
    const isAbnormal = this.checkAbnormalVitals({
      heartRate: data.heartRate,
      respiratoryRate: data.respiratoryRate,
      temperature: data.temperature,
      oxygenSaturation: data.oxygenSaturation
    });
    const vitalSigns = await prisma4.vitalSigns.create({
      data: {
        ...data,
        bmi,
        isAbnormal
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true
          }
        },
        recordedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
    if (isAbnormal) {
      const visit = await prisma4.patientVisit.findUnique({
        where: { id: data.visitId },
        include: { assignedDoctor: true }
      });
      if (visit?.assignedDoctorId) {
        await prisma4.notification.create({
          data: {
            userId: visit.assignedDoctorId,
            notificationType: "ABNORMAL_VITALS",
            title: "Abnormal Vital Signs",
            message: `Abnormal vitals for ${vitalSigns.patient.fullName}`,
            relatedId: data.visitId
          }
        });
      }
    }
    return vitalSigns;
  }
  checkAbnormalVitals(vitals) {
    if (vitals.heartRate && (vitals.heartRate < 60 || vitals.heartRate > 100)) {
      return true;
    }
    if (vitals.respiratoryRate && (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20)) {
      return true;
    }
    if (vitals.temperature && (vitals.temperature < 36.1 || vitals.temperature > 37.2)) {
      return true;
    }
    if (vitals.oxygenSaturation && vitals.oxygenSaturation < 95) {
      return true;
    }
    return false;
  }
  async getVitalSignsHistory(patientId, visitId) {
    const where = { patientId };
    if (visitId) {
      where.visitId = visitId;
    }
    return await prisma4.vitalSigns.findMany({
      where,
      include: {
        recordedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: { recordedAt: "desc" }
    });
  }
  // ============================================
  // NURSING NOTES
  // ============================================
  async createNursingNote(data) {
    return await prisma4.nursingNote.create({
      data,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true
          }
        },
        createdBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
  async updateNursingNote(id, data) {
    const note = await prisma4.nursingNote.findUnique({
      where: { id }
    });
    if (note?.isLocked) {
      throw new Error("Cannot update locked nursing note");
    }
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1e3);
    if (note && note.createdAt < fifteenMinutesAgo) {
      throw new Error("Cannot update note older than 15 minutes");
    }
    return await prisma4.nursingNote.update({
      where: { id },
      data
    });
  }
  async lockNursingNote(id) {
    return await prisma4.nursingNote.update({
      where: { id },
      data: {
        isLocked: true,
        lockedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  async getNursingNotes(visitId) {
    return await prisma4.nursingNote.findMany({
      where: { visitId },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  // ============================================
  // INJECTION ADMINISTRATION
  // ============================================
  async getInjectionQueue(filters) {
    const where = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.createdAt = {
        gte: startOfDay,
        lte: endOfDay
      };
    }
    return await prisma4.injectionOrder.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            photoUrl: true,
            allergies: true
          }
        },
        visit: {
          include: {
            vitalSigns: {
              orderBy: { recordedAt: "desc" },
              take: 1
            }
          }
        },
        orderedBy: {
          select: {
            id: true,
            fullName: true
          }
        },
        administrations: true
      },
      orderBy: { createdAt: "asc" }
    });
  }
  async administerInjection(data) {
    const administration = await prisma4.injectionAdministration.create({
      data: {
        ...data,
        patientVerified: true,
        medicationVerified: true,
        doseVerified: true,
        routeVerified: true,
        timeVerified: true
      },
      include: {
        order: {
          include: {
            patient: true,
            orderedBy: true
          }
        },
        administeredBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
    await prisma4.injectionOrder.update({
      where: { id: data.orderId },
      data: { status: "ADMINISTERED" }
    });
    await prisma4.financialTransaction.create({
      data: {
        transactionNumber: `INJ-${Date.now()}`,
        patientId: administration.order.patientId,
        visitId: administration.order.visitId,
        transactionType: "INJECTION_FEE",
        amount: 50,
        // Default injection fee
        paymentMethod: "CASH",
        paymentStatus: "PAID",
        description: `Injection: ${administration.order.medicationName}`
      }
    });
    if (data.hasAdverseEvent) {
      await prisma4.notification.create({
        data: {
          userId: administration.order.orderedById,
          notificationType: "ADVERSE_EVENT",
          title: "Adverse Reaction Reported",
          message: `Adverse reaction for ${administration.order.patient.fullName} - ${data.adverseEventType}`,
          relatedId: data.orderId
        }
      });
    } else {
      await prisma4.notification.create({
        data: {
          userId: administration.order.orderedById,
          notificationType: "INJECTION_COMPLETED",
          title: "Injection Completed",
          message: `Injection administered for ${administration.order.patient.fullName}`,
          relatedId: data.orderId
        }
      });
    }
    return administration;
  }
  // ============================================
  // OBSERVATION BOARD
  // ============================================
  async getObservationBoard(location) {
    const where = {
      status: {
        in: ["IN_QUEUE", "IN_CONSULTATION"]
      }
    };
    if (location) {
      where.serviceType = location;
    }
    const visits = await prisma4.patientVisit.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            photoUrl: true
          }
        },
        assignedDoctor: {
          select: {
            id: true,
            fullName: true
          }
        },
        triageRecords: {
          orderBy: { triageAt: "desc" },
          take: 1
        },
        vitalSigns: {
          orderBy: { recordedAt: "desc" },
          take: 1
        },
        injectionOrders: {
          where: { status: "PENDING" }
        },
        labOrders: {
          where: { status: "PENDING" }
        }
      },
      orderBy: [
        { triageLevel: "asc" },
        { visitDate: "asc" }
      ]
    });
    return visits;
  }
};
var nurseService = new NurseService();

// src/controllers/nurse.controller.ts
var NurseController = class {
  // ============================================
  // TRIAGE
  // ============================================
  async createTriage(req, res) {
    try {
      const triageData = {
        ...req.body,
        triageById: req.user.id
      };
      const triage = await nurseService.createTriageRecord(triageData);
      res.status(201).json({
        success: true,
        data: triage,
        message: "Triage record created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getTriageQueue(req, res) {
    try {
      const { triageLevel, routedTo, date } = req.query;
      const queue = await nurseService.getTriageQueue({
        triageLevel,
        routedTo,
        date: date ? new Date(date) : void 0
      });
      res.json({
        success: true,
        data: queue,
        count: queue.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // VITAL SIGNS
  // ============================================
  async recordVitalSigns(req, res) {
    try {
      const vitalData = {
        ...req.body,
        recordedById: req.user.id
      };
      const vitals = await nurseService.recordVitalSigns(vitalData);
      res.status(201).json({
        success: true,
        data: vitals,
        message: "Vital signs recorded successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getVitalSignsHistory(req, res) {
    try {
      const { patientId } = req.params;
      const { visitId } = req.query;
      const history = await nurseService.getVitalSignsHistory(
        patientId,
        visitId
      );
      res.json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // NURSING NOTES
  // ============================================
  async createNursingNote(req, res) {
    try {
      const noteData = {
        ...req.body,
        createdById: req.user.id
      };
      const note = await nurseService.createNursingNote(noteData);
      res.status(201).json({
        success: true,
        data: note,
        message: "Nursing note created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async updateNursingNote(req, res) {
    try {
      const { id } = req.params;
      const note = await nurseService.updateNursingNote(id, req.body);
      res.json({
        success: true,
        data: note,
        message: "Nursing note updated successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async lockNursingNote(req, res) {
    try {
      const { id } = req.params;
      const note = await nurseService.lockNursingNote(id);
      res.json({
        success: true,
        data: note,
        message: "Nursing note locked successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getNursingNotes(req, res) {
    try {
      const { visitId } = req.params;
      const notes = await nurseService.getNursingNotes(visitId);
      res.json({
        success: true,
        data: notes,
        count: notes.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // INJECTION ROOM
  // ============================================
  async getInjectionQueue(req, res) {
    try {
      const { status, date } = req.query;
      const queue = await nurseService.getInjectionQueue({
        status,
        date: date ? new Date(date) : void 0
      });
      res.json({
        success: true,
        data: queue,
        count: queue.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async administerInjection(req, res) {
    try {
      const administrationData = {
        ...req.body,
        administeredById: req.user.id
      };
      const administration = await nurseService.administerInjection(administrationData);
      res.status(201).json({
        success: true,
        data: administration,
        message: "Injection administered successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // OBSERVATION BOARD
  // ============================================
  async getObservationBoard(req, res) {
    try {
      const { location } = req.query;
      const board = await nurseService.getObservationBoard(location);
      res.json({
        success: true,
        data: board,
        count: board.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
var nurseController = new NurseController();

// src/routes/nurse.routes.ts
var router17 = (0, import_express17.Router)();
router17.use(authenticate);
router17.post(
  "/triage",
  authorize(["NURSE", "EMERGENCY"]),
  (req, res) => nurseController.createTriage(req, res)
);
router17.get(
  "/triage/queue",
  authorize(["NURSE", "DOCTOR", "EMERGENCY"]),
  (req, res) => nurseController.getTriageQueue(req, res)
);
router17.post(
  "/vital-signs",
  authorize(["NURSE", "DOCTOR", "EMERGENCY"]),
  (req, res) => nurseController.recordVitalSigns(req, res)
);
router17.get(
  "/vital-signs/:patientId",
  authorize(["NURSE", "DOCTOR", "EMERGENCY"]),
  (req, res) => nurseController.getVitalSignsHistory(req, res)
);
router17.post(
  "/nursing-notes",
  authorize(["NURSE"]),
  (req, res) => nurseController.createNursingNote(req, res)
);
router17.put(
  "/nursing-notes/:id",
  authorize(["NURSE"]),
  (req, res) => nurseController.updateNursingNote(req, res)
);
router17.post(
  "/nursing-notes/:id/lock",
  authorize(["NURSE"]),
  (req, res) => nurseController.lockNursingNote(req, res)
);
router17.get(
  "/nursing-notes/visit/:visitId",
  authorize(["NURSE", "DOCTOR"]),
  (req, res) => nurseController.getNursingNotes(req, res)
);
router17.get(
  "/injection-queue",
  authorize(["NURSE", "INJECTION_ROOM"]),
  (req, res) => nurseController.getInjectionQueue(req, res)
);
router17.post(
  "/injection-administration",
  authorize(["NURSE", "INJECTION_ROOM"]),
  (req, res) => nurseController.administerInjection(req, res)
);
router17.get(
  "/observation-board",
  authorize(["NURSE", "DOCTOR", "EMERGENCY"]),
  (req, res) => nurseController.getObservationBoard(req, res)
);
var nurse_routes_default = router17;

// src/routes/emergency.routes.ts
var import_express18 = require("express");

// src/services/emergency.service.ts
var import_client10 = require("@prisma/client");
var prisma5 = new import_client10.PrismaClient();
var EmergencyService = class {
  // ============================================
  // EMERGENCY CASE MANAGEMENT
  // ============================================
  async createEmergencyCase(data) {
    const caseNumber = `EMG-${Date.now()}`;
    const emergencyCase = await prisma5.emergencyCase.create({
      data: {
        ...data,
        caseNumber,
        status: "ACTIVE",
        triageCompletedAt: /* @__PURE__ */ new Date()
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
    if (data.triageLevel === "CRITICAL") {
      const emergencyDoctors = await prisma5.user.findMany({
        where: {
          role: {
            in: ["DOCTOR", "EMERGENCY"]
          },
          isActive: true
        }
      });
      for (const doctor of emergencyDoctors) {
        await prisma5.notification.create({
          data: {
            userId: doctor.id,
            notificationType: "EMERGENCY_CRITICAL",
            title: "CRITICAL EMERGENCY",
            message: `Critical emergency case: ${data.temporaryName || "Unknown"} - ${data.chiefComplaint}`,
            relatedId: emergencyCase.id
          }
        });
      }
    }
    return emergencyCase;
  }
  async updateEmergencyCase(id, data) {
    const updateData = { ...data };
    if (data.glasgowComaScale && data.glasgowComaScale >= 13) {
      updateData.status = "STABILIZED";
      updateData.stabilizedAt = /* @__PURE__ */ new Date();
    }
    if (!updateData.treatmentStartedAt) {
      updateData.treatmentStartedAt = /* @__PURE__ */ new Date();
    }
    return await prisma5.emergencyCase.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        registeredBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
  async setDisposition(id, data) {
    return await prisma5.emergencyCase.update({
      where: { id },
      data: {
        ...data,
        status: "COMPLETED",
        dispositionAt: /* @__PURE__ */ new Date()
      }
    });
  }
  async convertToFullRegistration(emergencyCaseId, patientData) {
    const emergencyCase = await prisma5.emergencyCase.findUnique({
      where: { id: emergencyCaseId }
    });
    if (!emergencyCase) {
      throw new Error("Emergency case not found");
    }
    if (emergencyCase.isConverted) {
      throw new Error("Emergency case already converted");
    }
    const cardNumber = `CARD-${Date.now()}`;
    const patient = await prisma5.patient.create({
      data: {
        ...patientData,
        cardNumber
      }
    });
    const visit = await prisma5.patientVisit.create({
      data: {
        patientId: patient.id,
        visitNumber: 1,
        visitType: "NEW",
        serviceType: "EMERGENCY",
        cardFee: 0,
        // No card fee for emergency
        status: "IN_CONSULTATION",
        registeredById: patientData.registeredById
      }
    });
    await prisma5.emergencyCase.update({
      where: { id: emergencyCaseId },
      data: {
        patientId: patient.id,
        isConverted: true,
        convertedVisitId: visit.id
      }
    });
    await prisma5.triageRecord.create({
      data: {
        visitId: visit.id,
        patientId: patient.id,
        triageLevel: emergencyCase.triageLevel,
        chiefComplaint: emergencyCase.chiefComplaint,
        bloodPressure: emergencyCase.bloodPressure,
        heartRate: emergencyCase.heartRate,
        respiratoryRate: emergencyCase.respiratoryRate,
        temperature: emergencyCase.temperature ? Number(emergencyCase.temperature) : void 0,
        oxygenSaturation: emergencyCase.oxygenSaturation,
        routedTo: "EMERGENCY",
        triageById: patientData.registeredById
      }
    });
    return {
      patient,
      visit
    };
  }
  async getActiveEmergencyCases() {
    return await prisma5.emergencyCase.findMany({
      where: {
        status: {
          in: ["ACTIVE", "STABILIZED"]
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            photoUrl: true
          }
        },
        registeredBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: [
        { triageLevel: "asc" },
        { arrivedAt: "asc" }
      ]
    });
  }
  async getEmergencyCaseById(id) {
    return await prisma5.emergencyCase.findUnique({
      where: { id },
      include: {
        patient: true,
        convertedVisit: {
          include: {
            patient: true,
            assignedDoctor: true
          }
        },
        registeredBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
  async getEmergencyStatistics(dateFrom, dateTo) {
    const where = {};
    if (dateFrom || dateTo) {
      where.arrivedAt = {};
      if (dateFrom) where.arrivedAt.gte = dateFrom;
      if (dateTo) where.arrivedAt.lte = dateTo;
    }
    const [
      totalCases,
      criticalCases,
      activeCases,
      completedCases,
      convertedCases,
      dischargedCases,
      admittedCases,
      referredCases
    ] = await Promise.all([
      prisma5.emergencyCase.count({ where }),
      prisma5.emergencyCase.count({ where: { ...where, triageLevel: "CRITICAL" } }),
      prisma5.emergencyCase.count({ where: { ...where, status: "ACTIVE" } }),
      prisma5.emergencyCase.count({ where: { ...where, status: "COMPLETED" } }),
      prisma5.emergencyCase.count({ where: { ...where, isConverted: true } }),
      prisma5.emergencyCase.count({ where: { ...where, disposition: "DISCHARGED" } }),
      prisma5.emergencyCase.count({ where: { ...where, disposition: "ADMITTED" } }),
      prisma5.emergencyCase.count({ where: { ...where, disposition: "REFERRED" } })
    ]);
    return {
      totalCases,
      criticalCases,
      activeCases,
      completedCases,
      convertedCases,
      dischargedCases,
      admittedCases,
      referredCases,
      conversionRate: totalCases > 0 ? convertedCases / totalCases * 100 : 0
    };
  }
};
var emergencyService = new EmergencyService();

// src/controllers/emergency.controller.ts
var EmergencyController = class {
  // ============================================
  // EMERGENCY CASE MANAGEMENT
  // ============================================
  async createEmergencyCase(req, res) {
    try {
      const caseData = {
        ...req.body,
        registeredById: req.user.id
      };
      const emergencyCase = await emergencyService.createEmergencyCase(caseData);
      res.status(201).json({
        success: true,
        data: emergencyCase,
        message: "Emergency case created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async updateEmergencyCase(req, res) {
    try {
      const { id } = req.params;
      const emergencyCase = await emergencyService.updateEmergencyCase(id, req.body);
      res.json({
        success: true,
        data: emergencyCase,
        message: "Emergency case updated successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async setDisposition(req, res) {
    try {
      const { id } = req.params;
      const emergencyCase = await emergencyService.setDisposition(id, req.body);
      res.json({
        success: true,
        data: emergencyCase,
        message: "Disposition set successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async convertToFullRegistration(req, res) {
    try {
      const { id } = req.params;
      const patientData = {
        ...req.body,
        registeredById: req.user.id
      };
      const result = await emergencyService.convertToFullRegistration(id, patientData);
      res.json({
        success: true,
        data: result,
        message: "Emergency case converted to full patient registration"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getActiveEmergencyCases(req, res) {
    try {
      const cases = await emergencyService.getActiveEmergencyCases();
      res.json({
        success: true,
        data: cases,
        count: cases.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getEmergencyCaseById(req, res) {
    try {
      const { id } = req.params;
      const emergencyCase = await emergencyService.getEmergencyCaseById(id);
      if (!emergencyCase) {
        res.status(404).json({
          success: false,
          message: "Emergency case not found"
        });
        return;
      }
      res.json({
        success: true,
        data: emergencyCase
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getEmergencyStatistics(req, res) {
    try {
      const { dateFrom, dateTo } = req.query;
      const stats = await emergencyService.getEmergencyStatistics(
        dateFrom ? new Date(dateFrom) : void 0,
        dateTo ? new Date(dateTo) : void 0
      );
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
var emergencyController = new EmergencyController();

// src/routes/emergency.routes.ts
var router18 = (0, import_express18.Router)();
router18.use(authenticate);
var emergencyRoles = ["EMERGENCY", "DOCTOR", "NURSE"];
router18.post(
  "/cases",
  authorize(emergencyRoles),
  (req, res) => emergencyController.createEmergencyCase(req, res)
);
router18.get(
  "/cases/active",
  authorize(emergencyRoles),
  (req, res) => emergencyController.getActiveEmergencyCases(req, res)
);
router18.get(
  "/cases/:id",
  authorize(emergencyRoles),
  (req, res) => emergencyController.getEmergencyCaseById(req, res)
);
router18.put(
  "/cases/:id",
  authorize(emergencyRoles),
  (req, res) => emergencyController.updateEmergencyCase(req, res)
);
router18.post(
  "/cases/:id/disposition",
  authorize(["EMERGENCY", "DOCTOR"]),
  (req, res) => emergencyController.setDisposition(req, res)
);
router18.post(
  "/cases/:id/convert",
  authorize(emergencyRoles),
  (req, res) => emergencyController.convertToFullRegistration(req, res)
);
router18.get(
  "/statistics",
  authorize(["EMERGENCY", "DOCTOR", "SUPER_ADMIN"]),
  (req, res) => emergencyController.getEmergencyStatistics(req, res)
);
var emergency_routes_default = router18;

// src/routes/doctor.routes.ts
var import_express19 = require("express");

// src/services/doctor.service.ts
var import_client11 = require("@prisma/client");
var prisma6 = new import_client11.PrismaClient();
var DoctorService = class {
  // ============================================
  // DOCTOR ENCOUNTER MANAGEMENT
  // ============================================
  async createEncounter(data) {
    return await prisma6.doctorEncounter.create({
      data: {
        ...data,
        status: "IN_PROGRESS"
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            photoUrl: true,
            allergies: true,
            medicalHistory: true
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
  async updateEncounter(id, data) {
    return await prisma6.doctorEncounter.update({
      where: { id },
      data
    });
  }
  async completeEncounter(id, data) {
    const encounter = await prisma6.doctorEncounter.update({
      where: { id },
      data: {
        ...data,
        status: data?.followUpRequired ? "FOLLOW_UP_NEEDED" : "COMPLETED",
        completedAt: /* @__PURE__ */ new Date()
      },
      include: {
        visit: true
      }
    });
    await prisma6.patientVisit.update({
      where: { id: encounter.visitId },
      data: { status: "COMPLETED" }
    });
    if (data?.followUpRequired && data?.followUpDate) {
      const appointmentNumber = `APT-${Date.now()}`;
      await prisma6.appointment.create({
        data: {
          appointmentNumber,
          patientId: encounter.patientId,
          doctorId: encounter.doctorId,
          appointmentDate: data.followUpDate,
          startTime: data.followUpDate,
          endTime: new Date(data.followUpDate.getTime() + 30 * 6e4),
          // 30 minutes
          serviceType: "OPD",
          reason: data.followUpNotes || "Follow-up visit",
          status: "SCHEDULED"
        }
      });
    }
    return encounter;
  }
  async getEncounterById(id) {
    return await prisma6.doctorEncounter.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            photoUrl: true,
            allergies: true,
            medicalHistory: true,
            phone: true,
            address: true
          }
        },
        visit: {
          include: {
            triageRecords: {
              orderBy: { triageAt: "desc" },
              take: 1
            },
            vitalSigns: {
              orderBy: { recordedAt: "desc" },
              take: 1
            },
            prescriptions: {
              include: {
                items: true
              }
            },
            labOrders: {
              include: {
                items: true
              }
            },
            ultrasoundOrders: true,
            injectionOrders: true
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
  // ============================================
  // PATIENT CHART & HISTORY
  // ============================================
  async getPatientChart(patientId) {
    const patient = await prisma6.patient.findUnique({
      where: { id: patientId },
      include: {
        visits: {
          include: {
            assignedDoctor: {
              select: {
                id: true,
                fullName: true
              }
            },
            doctorEncounters: {
              orderBy: { startedAt: "desc" }
            },
            triageRecords: {
              orderBy: { triageAt: "desc" }
            },
            vitalSigns: {
              orderBy: { recordedAt: "desc" }
            },
            prescriptions: {
              include: {
                items: {
                  include: {
                    drug: true
                  }
                },
                dispensedBy: {
                  select: {
                    id: true,
                    fullName: true
                  }
                }
              }
            },
            labOrders: {
              include: {
                items: {
                  include: {
                    test: true
                  }
                }
              }
            },
            ultrasoundOrders: true,
            injectionOrders: {
              include: {
                administrations: true
              }
            }
          },
          orderBy: { visitDate: "desc" }
        },
        sickLeaveCertificates: {
          orderBy: { issuedAt: "desc" }
        },
        medicalCertificates: {
          orderBy: { issuedAt: "desc" }
        }
      }
    });
    return patient;
  }
  async getDoctorQueue(doctorId, date) {
    const where = {
      assignedDoctorId: doctorId,
      status: {
        in: ["IN_QUEUE", "IN_CONSULTATION"]
      }
    };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.visitDate = {
        gte: startOfDay,
        lte: endOfDay
      };
    }
    return await prisma6.patientVisit.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            photoUrl: true,
            allergies: true
          }
        },
        triageRecords: {
          orderBy: { triageAt: "desc" },
          take: 1
        },
        vitalSigns: {
          orderBy: { recordedAt: "desc" },
          take: 1
        },
        doctorEncounters: {
          where: { status: "IN_PROGRESS" }
        }
      },
      orderBy: [
        { triageLevel: "asc" },
        { queuePosition: "asc" },
        { visitDate: "asc" }
      ]
    });
  }
  // ============================================
  // DASHBOARD STATS
  // ============================================
  async getDashboardStats(doctorId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayVisits = await prisma6.patientVisit.findMany({
      where: {
        assignedDoctorId: doctorId,
        visitDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        triageRecords: {
          orderBy: { triageAt: "desc" },
          take: 1
        },
        doctorEncounters: {
          where: {
            doctorId,
            startedAt: {
              gte: today
            }
          }
        }
      }
    });
    const patientsWaiting = todayVisits.filter((v) => v.status === "IN_QUEUE").length;
    const patientsInProgress = todayVisits.filter((v) => v.status === "IN_CONSULTATION").length;
    const patientsCompleted = todayVisits.filter((v) => v.status === "COMPLETED").length;
    const criticalPatients = todayVisits.filter(
      (v) => v.triageLevel === "CRITICAL" && v.status !== "COMPLETED"
    ).length;
    const pendingLabResults = await prisma6.labOrder.count({
      where: {
        orderedById: doctorId,
        status: {
          in: ["IN_PROGRESS", "PENDING"]
        }
      }
    });
    const pendingPrescriptions = await prisma6.prescription.count({
      where: {
        doctorId,
        status: "PENDING"
      }
    });
    const todayAppointments = await prisma6.appointment.count({
      where: {
        doctorId,
        appointmentDate: {
          gte: today,
          lt: tomorrow
        },
        status: {
          in: ["SCHEDULED", "CONFIRMED"]
        }
      }
    });
    const completedEncounters = todayVisits.flatMap((v) => v.doctorEncounters).filter((e) => e.completedAt);
    let averageConsultationTime = 0;
    if (completedEncounters.length > 0) {
      const totalMinutes = completedEncounters.reduce((sum, encounter) => {
        const duration = encounter.completedAt.getTime() - encounter.startedAt.getTime();
        return sum + duration / 6e4;
      }, 0);
      averageConsultationTime = Math.round(totalMinutes / completedEncounters.length);
    }
    return {
      patientsWaiting,
      patientsInProgress,
      patientsCompleted,
      criticalPatients,
      pendingLabResults,
      pendingPrescriptions,
      todayAppointments,
      averageConsultationTime
    };
  }
  async getRecentActivity(doctorId, limit = 10) {
    const activities = [];
    const recentEncounters = await prisma6.doctorEncounter.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: { startedAt: "desc" },
      take: 5
    });
    for (const encounter of recentEncounters) {
      activities.push({
        id: encounter.id,
        type: "CONSULTATION",
        patientName: encounter.patient.fullName,
        description: `Consultation ${encounter.status === "COMPLETED" ? "completed" : "in progress"}`,
        timestamp: encounter.startedAt.toISOString(),
        priority: "NORMAL"
      });
    }
    const recentLabResults = await prisma6.labOrder.findMany({
      where: {
        orderedById: doctorId,
        status: "COMPLETED"
      },
      include: {
        patient: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: { updatedAt: "desc" },
      take: 5
    });
    for (const lab of recentLabResults) {
      activities.push({
        id: lab.id,
        type: "LAB_RESULT",
        patientName: lab.patient.fullName,
        description: "Lab results available",
        timestamp: lab.updatedAt.toISOString(),
        priority: "NORMAL"
      });
    }
    const criticalPatients = await prisma6.patientVisit.findMany({
      where: {
        assignedDoctorId: doctorId,
        triageLevel: "CRITICAL",
        status: {
          in: ["IN_QUEUE", "IN_CONSULTATION"]
        }
      },
      include: {
        patient: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: { visitDate: "desc" },
      take: 3
    });
    for (const visit of criticalPatients) {
      activities.push({
        id: visit.id,
        type: "CRITICAL_ALERT",
        patientName: visit.patient.fullName,
        description: "Critical patient requires immediate attention",
        timestamp: visit.visitDate.toISOString(),
        priority: "HIGH"
      });
    }
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
  }
  async getQueueStats(doctorId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayVisits = await prisma6.patientVisit.findMany({
      where: {
        assignedDoctorId: doctorId,
        visitDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        doctorEncounters: {
          where: {
            doctorId,
            startedAt: {
              gte: today
            }
          }
        }
      }
    });
    const waiting = todayVisits.filter((v) => v.status === "IN_QUEUE").length;
    const inProgress = todayVisits.filter((v) => v.status === "IN_CONSULTATION").length;
    const completed = todayVisits.filter((v) => v.status === "COMPLETED").length;
    const waitingVisits = todayVisits.filter((v) => v.status === "IN_QUEUE");
    let averageWaitTime = 0;
    if (waitingVisits.length > 0) {
      const now = /* @__PURE__ */ new Date();
      const totalWaitMinutes = waitingVisits.reduce((sum, visit) => {
        const waitTime = now.getTime() - visit.visitDate.getTime();
        return sum + waitTime / 6e4;
      }, 0);
      averageWaitTime = Math.round(totalWaitMinutes / waitingVisits.length);
    }
    return {
      waiting,
      inProgress,
      completed,
      averageWaitTime
    };
  }
  async startVisit(visitId, doctorId) {
    const visit = await prisma6.patientVisit.update({
      where: { id: visitId },
      data: { status: "IN_CONSULTATION" },
      include: {
        patient: true
      }
    });
    const existingEncounter = await prisma6.doctorEncounter.findFirst({
      where: {
        visitId,
        doctorId
      }
    });
    if (!existingEncounter) {
      await prisma6.doctorEncounter.create({
        data: {
          visitId,
          patientId: visit.patientId,
          doctorId,
          status: "IN_PROGRESS"
        }
      });
    }
    return visit;
  }
  // ============================================
  // ORDER MANAGEMENT
  // ============================================
  async createLabOrder(data) {
    const orderNumber = `LAB-${Date.now()}`;
    const tests = await prisma6.labTest.findMany({
      where: {
        id: {
          in: data.testIds
        }
      }
    });
    const labOrder = await prisma6.labOrder.create({
      data: {
        orderNumber,
        visitId: data.visitId || null,
        patientId: data.patientId,
        orderedById: data.orderedById,
        priority: data.priority || "ROUTINE",
        clinicalNotes: data.clinicalNotes,
        status: "PENDING",
        items: {
          create: tests.map((test) => ({
            testId: test.id,
            testName: test.testName,
            status: "PENDING"
          }))
        }
      },
      include: {
        items: {
          include: {
            test: true
          }
        },
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    for (const test of tests) {
      if (test.price) {
        await prisma6.financialTransaction.create({
          data: {
            transactionNumber: `LAB-${Date.now()}-${test.id}`,
            patientId: data.patientId,
            visitId: data.visitId || null,
            transactionType: "LAB_TEST",
            amount: test.price,
            paymentMethod: "CASH",
            paymentStatus: "PENDING",
            description: `Lab Test: ${test.testName}`
          }
        });
      }
    }
    const labTechs = await prisma6.user.findMany({
      where: {
        role: "LAB_TECH",
        isActive: true
      }
    });
    for (const tech of labTechs) {
      await prisma6.notification.create({
        data: {
          userId: tech.id,
          notificationType: "NEW_LAB_ORDER",
          title: "New Lab Order",
          message: `New lab order for ${labOrder.patient.fullName} - ${tests.length} test(s)`,
          relatedId: labOrder.id
        }
      });
    }
    return labOrder;
  }
  async createPrescription(data) {
    const prescriptionNumber = `RX-${Date.now()}`;
    const prescription = await prisma6.prescription.create({
      data: {
        prescriptionNumber,
        visitId: data.visitId,
        patientId: data.patientId,
        doctorId: data.doctorId,
        notes: data.notes,
        status: "PENDING",
        items: {
          create: data.items
        }
      },
      include: {
        items: {
          include: {
            drug: true
          }
        },
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    const pharmacists = await prisma6.user.findMany({
      where: {
        role: "PHARMACIST",
        isActive: true
      }
    });
    for (const pharmacist of pharmacists) {
      await prisma6.notification.create({
        data: {
          userId: pharmacist.id,
          notificationType: "NEW_PRESCRIPTION",
          title: "New Prescription",
          message: `New prescription for ${prescription.patient.fullName} - ${data.items.length} medication(s)`,
          relatedId: prescription.id
        }
      });
    }
    return prescription;
  }
  async createInjectionOrder(data) {
    const orderNumber = `INJ-${Date.now()}`;
    const injectionOrder = await prisma6.injectionOrder.create({
      data: {
        ...data,
        orderNumber,
        status: "PENDING"
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    const nurses = await prisma6.user.findMany({
      where: {
        role: {
          in: ["NURSE", "INJECTION_ROOM"]
        },
        isActive: true
      }
    });
    for (const nurse of nurses) {
      await prisma6.notification.create({
        data: {
          userId: nurse.id,
          notificationType: "NEW_INJECTION_ORDER",
          title: "New Injection Order",
          message: `New injection order for ${injectionOrder.patient.fullName} - ${data.medicationName}`,
          relatedId: injectionOrder.id
        }
      });
    }
    return injectionOrder;
  }
  async createUltrasoundOrder(data) {
    const orderNumber = `US-${Date.now()}`;
    const price = data.isFollowUp ? 400 : 200;
    const ultrasoundOrder = await prisma6.ultrasoundOrder.create({
      data: {
        ...data,
        orderNumber,
        price,
        status: "SCHEDULED"
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true
          }
        }
      }
    });
    await prisma6.financialTransaction.create({
      data: {
        transactionNumber: `US-${Date.now()}`,
        patientId: data.patientId,
        visitId: data.visitId,
        transactionType: "ULTRASOUND",
        amount: price,
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        description: `Ultrasound: ${data.ultrasoundType}`
      }
    });
    return ultrasoundOrder;
  }
};
var doctorService = new DoctorService();

// src/controllers/doctor.controller.ts
var DoctorController = class {
  // ============================================
  // DOCTOR ENCOUNTER
  // ============================================
  async createEncounter(req, res) {
    try {
      const encounterData = {
        ...req.body,
        doctorId: req.user.id
      };
      const encounter = await doctorService.createEncounter(encounterData);
      res.status(201).json({
        success: true,
        data: encounter,
        message: "Encounter created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async updateEncounter(req, res) {
    try {
      const { id } = req.params;
      const encounter = await doctorService.updateEncounter(id, req.body);
      res.json({
        success: true,
        data: encounter,
        message: "Encounter updated successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async completeEncounter(req, res) {
    try {
      const { id } = req.params;
      const encounter = await doctorService.completeEncounter(id, req.body);
      res.json({
        success: true,
        data: encounter,
        message: "Encounter completed successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getEncounterById(req, res) {
    try {
      const { id } = req.params;
      const encounter = await doctorService.getEncounterById(id);
      if (!encounter) {
        res.status(404).json({
          success: false,
          message: "Encounter not found"
        });
        return;
      }
      res.json({
        success: true,
        data: encounter
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // PATIENT CHART
  // ============================================
  async getPatientChart(req, res) {
    try {
      const { patientId } = req.params;
      const chart = await doctorService.getPatientChart(patientId);
      if (!chart) {
        res.status(404).json({
          success: false,
          message: "Patient not found"
        });
        return;
      }
      res.json({
        success: true,
        data: chart
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getDoctorQueue(req, res) {
    try {
      const doctorId = req.user.id;
      const { date } = req.query;
      const queue = await doctorService.getDoctorQueue(
        doctorId,
        date ? new Date(date) : void 0
      );
      res.json({
        success: true,
        data: queue,
        count: queue.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // DASHBOARD
  // ============================================
  async getDashboardStats(req, res) {
    try {
      const doctorId = req.user.id;
      const stats = await doctorService.getDashboardStats(doctorId);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getRecentActivity(req, res) {
    try {
      const doctorId = req.user.id;
      const { limit } = req.query;
      const activity = await doctorService.getRecentActivity(
        doctorId,
        limit ? parseInt(limit) : 10
      );
      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getQueueStats(req, res) {
    try {
      const doctorId = req.user.id;
      const stats = await doctorService.getQueueStats(doctorId);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async startVisit(req, res) {
    try {
      const { visitId } = req.params;
      const doctorId = req.user.id;
      const visit = await doctorService.startVisit(visitId, doctorId);
      res.json({
        success: true,
        data: visit,
        message: "Visit started successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // ORDERS
  // ============================================
  async createLabOrder(req, res) {
    try {
      console.log("=== Lab Order Request ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("User:", JSON.stringify(req.user, null, 2));
      const orderData = {
        patientId: req.body.patientId,
        testIds: req.body.testIds,
        priority: req.body.priority,
        clinicalNotes: req.body.clinicalNotes,
        visitId: req.body.visitId,
        orderedById: req.user.id
      };
      console.log("Order data being sent to service:", JSON.stringify(orderData, null, 2));
      const labOrder = await doctorService.createLabOrder(orderData);
      res.status(201).json({
        success: true,
        data: labOrder,
        message: "Lab order created successfully"
      });
    } catch (error) {
      console.error("Lab order creation error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }
  async createPrescription(req, res) {
    try {
      const prescriptionData = {
        ...req.body,
        doctorId: req.user.id
      };
      const prescription = await doctorService.createPrescription(prescriptionData);
      res.status(201).json({
        success: true,
        data: prescription,
        message: "Prescription created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async createInjectionOrder(req, res) {
    try {
      const orderData = {
        ...req.body,
        orderedById: req.user.id
      };
      const injectionOrder = await doctorService.createInjectionOrder(orderData);
      res.status(201).json({
        success: true,
        data: injectionOrder,
        message: "Injection order created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async createUltrasoundOrder(req, res) {
    try {
      const orderData = {
        ...req.body,
        orderedById: req.user.id
      };
      const ultrasoundOrder = await doctorService.createUltrasoundOrder(orderData);
      res.status(201).json({
        success: true,
        data: ultrasoundOrder,
        message: "Ultrasound order created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
var doctorController = new DoctorController();

// src/routes/doctor.routes.ts
var router19 = (0, import_express19.Router)();
router19.use(authenticate);
var doctorRoles = ["DOCTOR", "SUPER_ADMIN"];
router19.post(
  "/encounters",
  authorize(doctorRoles),
  (req, res) => doctorController.createEncounter(req, res)
);
router19.put(
  "/encounters/:id",
  authorize(doctorRoles),
  (req, res) => doctorController.updateEncounter(req, res)
);
router19.post(
  "/encounters/:id/complete",
  authorize(doctorRoles),
  (req, res) => doctorController.completeEncounter(req, res)
);
router19.get(
  "/encounters/:id",
  authorize(doctorRoles),
  (req, res) => doctorController.getEncounterById(req, res)
);
router19.get(
  "/patients/:patientId/chart",
  authorize(doctorRoles),
  (req, res) => doctorController.getPatientChart(req, res)
);
router19.get(
  "/queue",
  authorize(doctorRoles),
  (req, res) => doctorController.getDoctorQueue(req, res)
);
router19.get(
  "/queue/stats",
  authorize(doctorRoles),
  (req, res) => doctorController.getQueueStats(req, res)
);
router19.get(
  "/dashboard/stats",
  authorize(doctorRoles),
  (req, res) => doctorController.getDashboardStats(req, res)
);
router19.get(
  "/dashboard/activity",
  authorize(doctorRoles),
  (req, res) => doctorController.getRecentActivity(req, res)
);
router19.post(
  "/visits/:visitId/start",
  authorize(doctorRoles),
  (req, res) => doctorController.startVisit(req, res)
);
router19.post(
  "/lab-orders",
  authenticate,
  // Only authenticate, skip authorization for now
  (req, res) => doctorController.createLabOrder(req, res)
);
router19.post(
  "/prescriptions",
  authorize(doctorRoles),
  (req, res) => doctorController.createPrescription(req, res)
);
router19.post(
  "/injection-orders",
  authorize(doctorRoles),
  (req, res) => doctorController.createInjectionOrder(req, res)
);
router19.post(
  "/ultrasound-orders",
  authorize(doctorRoles),
  (req, res) => doctorController.createUltrasoundOrder(req, res)
);
var doctor_routes_default = router19;

// src/routes/certificate.routes.ts
var import_express20 = require("express");

// src/services/certificate.service.ts
var import_client12 = require("@prisma/client");
var prisma7 = new import_client12.PrismaClient();
var CertificateService = class {
  // ============================================
  // SICK LEAVE CERTIFICATES
  // ============================================
  async createSickLeaveCertificate(data) {
    const certificateNumber = `SL-${Date.now()}`;
    const endDate = new Date(data.startDate);
    endDate.setDate(endDate.getDate() + data.sickLeaveDays);
    const certificate = await prisma7.sickLeaveCertificate.create({
      data: {
        ...data,
        certificateNumber,
        endDate
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            phone: true,
            address: true
          }
        },
        visit: true,
        issuedBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });
    return certificate;
  }
  async getSickLeaveCertificate(id) {
    return await prisma7.sickLeaveCertificate.findUnique({
      where: { id },
      include: {
        patient: true,
        visit: true,
        issuedBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });
  }
  async getPatientSickLeaveCertificates(patientId) {
    return await prisma7.sickLeaveCertificate.findMany({
      where: { patientId },
      include: {
        issuedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: { issuedAt: "desc" }
    });
  }
  // ============================================
  // MEDICAL CERTIFICATES
  // ============================================
  async createMedicalCertificate(data) {
    const certificateNumber = `MC-${Date.now()}`;
    const certificate = await prisma7.medicalCertificate.create({
      data: {
        ...data,
        certificateNumber
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cardNumber: true,
            sex: true,
            dateOfBirth: true,
            phone: true,
            address: true
          }
        },
        visit: true,
        issuedBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });
    return certificate;
  }
  async updateMedicalCertificate(id, data) {
    return await prisma7.medicalCertificate.update({
      where: { id },
      data,
      include: {
        patient: true,
        issuedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
  async signMedicalCertificate(id, data) {
    const updateData = {};
    if (data.patientSignature) {
      updateData.patientSignature = data.patientSignature;
      updateData.patientSignedAt = /* @__PURE__ */ new Date();
    }
    if (data.doctorSignature) {
      updateData.doctorSignature = data.doctorSignature;
    }
    return await prisma7.medicalCertificate.update({
      where: { id },
      data: updateData
    });
  }
  async getMedicalCertificate(id) {
    return await prisma7.medicalCertificate.findUnique({
      where: { id },
      include: {
        patient: true,
        visit: true,
        issuedBy: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });
  }
  async getPatientMedicalCertificates(patientId) {
    return await prisma7.medicalCertificate.findMany({
      where: { patientId },
      include: {
        issuedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: { issuedAt: "desc" }
    });
  }
  // ============================================
  // PDF GENERATION (Placeholder)
  // ============================================
  async generateSickLeavePDF(certificate) {
    return `/certificates/sick-leave/${certificate.certificateNumber}.pdf`;
  }
  async generateMedicalCertificatePDF(certificate) {
    return `/certificates/medical/${certificate.certificateNumber}.pdf`;
  }
};
var certificateService = new CertificateService();

// src/controllers/certificate.controller.ts
var CertificateController = class {
  // ============================================
  // SICK LEAVE CERTIFICATES
  // ============================================
  async createSickLeaveCertificate(req, res) {
    try {
      const certificateData = {
        ...req.body,
        issuedById: req.user.id
      };
      const certificate = await certificateService.createSickLeaveCertificate(certificateData);
      res.status(201).json({
        success: true,
        data: certificate,
        message: "Sick leave certificate created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getSickLeaveCertificate(req, res) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.getSickLeaveCertificate(id);
      if (!certificate) {
        res.status(404).json({
          success: false,
          message: "Sick leave certificate not found"
        });
        return;
      }
      res.json({
        success: true,
        data: certificate
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getPatientSickLeaveCertificates(req, res) {
    try {
      const { patientId } = req.params;
      const certificates = await certificateService.getPatientSickLeaveCertificates(patientId);
      res.json({
        success: true,
        data: certificates,
        count: certificates.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // ============================================
  // MEDICAL CERTIFICATES
  // ============================================
  async createMedicalCertificate(req, res) {
    try {
      const certificateData = {
        ...req.body,
        issuedById: req.user.id
      };
      const certificate = await certificateService.createMedicalCertificate(certificateData);
      res.status(201).json({
        success: true,
        data: certificate,
        message: "Medical certificate created successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async updateMedicalCertificate(req, res) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.updateMedicalCertificate(id, req.body);
      res.json({
        success: true,
        data: certificate,
        message: "Medical certificate updated successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async signMedicalCertificate(req, res) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.signMedicalCertificate(id, req.body);
      res.json({
        success: true,
        data: certificate,
        message: "Medical certificate signed successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getMedicalCertificate(req, res) {
    try {
      const { id } = req.params;
      const certificate = await certificateService.getMedicalCertificate(id);
      if (!certificate) {
        res.status(404).json({
          success: false,
          message: "Medical certificate not found"
        });
        return;
      }
      res.json({
        success: true,
        data: certificate
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getPatientMedicalCertificates(req, res) {
    try {
      const { patientId } = req.params;
      const certificates = await certificateService.getPatientMedicalCertificates(patientId);
      res.json({
        success: true,
        data: certificates,
        count: certificates.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
var certificateController = new CertificateController();

// src/routes/certificate.routes.ts
var router20 = (0, import_express20.Router)();
router20.use(authenticate);
var doctorRoles2 = ["DOCTOR", "SUPER_ADMIN"];
router20.post(
  "/sick-leave",
  authorize(doctorRoles2),
  (req, res) => certificateController.createSickLeaveCertificate(req, res)
);
router20.get(
  "/sick-leave/:id",
  authorize([...doctorRoles2, "RECEPTIONIST", "FINANCE"]),
  (req, res) => certificateController.getSickLeaveCertificate(req, res)
);
router20.get(
  "/sick-leave/patient/:patientId",
  authorize([...doctorRoles2, "RECEPTIONIST"]),
  (req, res) => certificateController.getPatientSickLeaveCertificates(req, res)
);
router20.post(
  "/medical",
  authorize(doctorRoles2),
  (req, res) => certificateController.createMedicalCertificate(req, res)
);
router20.put(
  "/medical/:id",
  authorize(doctorRoles2),
  (req, res) => certificateController.updateMedicalCertificate(req, res)
);
router20.post(
  "/medical/:id/sign",
  authorize(doctorRoles2),
  (req, res) => certificateController.signMedicalCertificate(req, res)
);
router20.get(
  "/medical/:id",
  authorize([...doctorRoles2, "RECEPTIONIST", "FINANCE"]),
  (req, res) => certificateController.getMedicalCertificate(req, res)
);
router20.get(
  "/medical/patient/:patientId",
  authorize([...doctorRoles2, "RECEPTIONIST"]),
  (req, res) => certificateController.getPatientMedicalCertificates(req, res)
);
var certificate_routes_default = router20;

// src/routes/contact.routes.ts
var import_express21 = require("express");

// src/services/contact.service.ts
var import_client13 = require("@prisma/client");
init_email_service();
var prisma8 = new import_client13.PrismaClient();
var contactService = {
  // Create a new contact message
  async createMessage(data) {
    const contactMessage = await prisma8.contactMessage.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        status: "PENDING"
      }
    });
    try {
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@ruhamaclinic.com",
        subject: `New Contact Message: ${data.subject || "No Subject"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Message Received</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${data.fullName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
              ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Please log in to the admin panel to respond to this message.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }
    try {
      await emailService.sendEmail({
        to: data.email,
        subject: "We received your message - Ruhama Clinic",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank You for Contacting Us</h2>
            <p>Dear ${data.fullName},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Message:</strong></p>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <p>Our team typically responds within 24-48 hours during business days.</p>
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Ruhama Metekiya Medium Clinic</strong>
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }
    return contactMessage;
  },
  // Get all messages with optional filtering
  async getAllMessages(options) {
    const { status, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [messages, total] = await Promise.all([
      prisma8.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma8.contactMessage.count({ where })
    ]);
    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
  // Get a single message by ID
  async getMessageById(id) {
    return await prisma8.contactMessage.findUnique({
      where: { id }
    });
  },
  // Respond to a message and send email to user
  async respondToMessage(id, response, respondedBy) {
    const message = await prisma8.contactMessage.findUnique({
      where: { id }
    });
    if (!message) {
      throw new Error("Message not found");
    }
    const updatedMessage = await prisma8.contactMessage.update({
      where: { id },
      data: {
        response,
        respondedBy,
        respondedAt: /* @__PURE__ */ new Date(),
        status: "RESPONDED"
      }
    });
    try {
      await emailService.sendEmail({
        to: message.email,
        subject: `Re: ${message.subject || "Your inquiry"} - Ruhama Clinic`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Response to Your Message</h2>
            <p>Dear ${message.fullName},</p>
            <p>Thank you for contacting Ruhama Metekiya Medium Clinic. Here is our response to your inquiry:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Original Message:</strong></p>
              <p style="white-space: pre-wrap; color: #6b7280;">${message.message}</p>
            </div>

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <p><strong>Our Response:</strong></p>
              <p style="white-space: pre-wrap;">${response}</p>
            </div>

            <p>If you have any further questions, please don't hesitate to contact us again.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 5px 0;"><strong>Ruhama Metekiya Medium Clinic</strong></p>
              <p style="margin: 5px 0; color: #6b7280;">21 Mazoria Avenue, Sodo, Ethiopia</p>
              <p style="margin: 5px 0; color: #6b7280;">Phone: +251 XXX XXX XXX</p>
              <p style="margin: 5px 0; color: #6b7280;">Email: info@ruhamaclinic.com</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send response email:", emailError);
      throw new Error("Failed to send response email to user");
    }
    return updatedMessage;
  },
  // Update message status
  async updateMessageStatus(id, status) {
    return await prisma8.contactMessage.update({
      where: { id },
      data: { status }
    });
  },
  // Delete a message
  async deleteMessage(id) {
    return await prisma8.contactMessage.delete({
      where: { id }
    });
  }
};

// src/controllers/contact.controller.ts
var contactController = {
  // Submit a new contact message (public)
  async submitMessage(req, res) {
    try {
      const { fullName, email, phone, subject, message } = req.body;
      if (!fullName || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "Full name, email, and message are required"
        });
      }
      const contactMessage = await contactService.createMessage({
        fullName,
        email,
        phone,
        subject,
        message
      });
      return res.status(201).json({
        success: true,
        message: "Your message has been sent successfully. We will get back to you soon!",
        data: contactMessage
      });
    } catch (error) {
      console.error("Error submitting contact message:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to submit message. Please try again later."
      });
    }
  },
  // Get all contact messages (admin only)
  async getAllMessages(req, res) {
    try {
      const { status, page = "1", limit = "20" } = req.query;
      const messages = await contactService.getAllMessages({
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch messages"
      });
    }
  },
  // Get a single message by ID (admin only)
  async getMessageById(req, res) {
    try {
      const { id } = req.params;
      const message = await contactService.getMessageById(id);
      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Message not found"
        });
      }
      return res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error("Error fetching message:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch message"
      });
    }
  },
  // Respond to a message (admin only)
  async respondToMessage(req, res) {
    try {
      const { id } = req.params;
      const { response } = req.body;
      const userId = req.user?.id;
      if (!response) {
        return res.status(400).json({
          success: false,
          error: "Response text is required"
        });
      }
      const updatedMessage = await contactService.respondToMessage(id, response, userId);
      return res.status(200).json({
        success: true,
        message: "Response sent successfully",
        data: updatedMessage
      });
    } catch (error) {
      console.error("Error responding to message:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to send response"
      });
    }
  },
  // Update message status (admin only)
  async updateMessageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          error: "Status is required"
        });
      }
      const updatedMessage = await contactService.updateMessageStatus(id, status);
      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: updatedMessage
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to update status"
      });
    }
  },
  // Delete a message (admin only)
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      await contactService.deleteMessage(id);
      return res.status(200).json({
        success: true,
        message: "Message deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to delete message"
      });
    }
  }
};

// src/routes/contact.routes.ts
var router21 = (0, import_express21.Router)();
router21.post("/submit", contactController.submitMessage);
router21.get("/messages", authenticate, authorize(["SUPER_ADMIN"]), contactController.getAllMessages);
router21.get("/messages/:id", authenticate, authorize(["SUPER_ADMIN"]), contactController.getMessageById);
router21.patch("/messages/:id/respond", authenticate, authorize(["SUPER_ADMIN"]), contactController.respondToMessage);
router21.patch("/messages/:id/status", authenticate, authorize(["SUPER_ADMIN"]), contactController.updateMessageStatus);
router21.delete("/messages/:id", authenticate, authorize(["SUPER_ADMIN"]), contactController.deleteMessage);
var contact_routes_default = router21;

// src/middleware/performance-monitor.ts
function performanceMiddleware(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
}

// src/services/audit-logger.service.ts
var import_client14 = require("@prisma/client");
var prisma9 = new import_client14.PrismaClient();
var auditLogger = {
  async log(data) {
    try {
      await prisma9.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
          newValues: data.newValues ? JSON.stringify(data.newValues) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent
        }
      });
    } catch (error) {
      console.error("Audit log error:", error);
    }
  }
};
function auditMiddleware(req, res, next) {
  const user = req.user;
  res.on("finish", () => {
    if (req.method !== "GET") {
      auditLogger.log({
        userId: user?.id,
        action: req.method,
        resource: req.path,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      });
    }
  });
  next();
}

// src/app.ts
var app = (0, import_express22.default)();
if (process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}
var isProd2 = process.env.NODE_ENV === "production";
app.use(
  (0, import_helmet.default)({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Allow images from different origin
    contentSecurityPolicy: isProd2 ? {
      directives: {
        defaultSrc: ["'none'"],
        baseUri: ["'none'"],
        frameAncestors: ["'none'"]
      }
    } : false,
    hsts: isProd2 ? {
      maxAge: 31536e3,
      includeSubDomains: true,
      preload: false
    } : false
  })
);
var defaultCorsOrigins = ["http://localhost:3001", "http://localhost:5173", "http://localhost:3000"];
var corsOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) || defaultCorsOrigins;
app.use(
  (0, import_cors.default)({
    origin: corsOrigins,
    credentials: true
  })
);
app.use(import_express22.default.json({ limit: "10mb" }));
app.use(import_express22.default.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, import_express22.default.static(process.env.UPLOAD_DIR || "./uploads", {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (filePath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    } else if (filePath.endsWith(".gif")) {
      res.setHeader("Content-Type", "image/gif");
    } else if (filePath.endsWith(".webp")) {
      res.setHeader("Content-Type", "image/webp");
    }
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
}));
if (process.env.NODE_ENV === "development") {
  app.use((0, import_morgan.default)("dev"));
} else {
  app.use((0, import_morgan.default)("combined"));
}
app.use(performanceMiddleware);
app.use(auditMiddleware);
app.get("/health", async (_req, res) => {
  const base = {
    success: true,
    message: "Server is running",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV,
    database: "unknown"
  };
  try {
    await database_default.$queryRaw`SELECT 1`;
    base.database = "ok";
    const { getEmailConfigStatus: getEmailConfigStatus2 } = await Promise.resolve().then(() => (init_email_service(), email_service_exports));
    const email = getEmailConfigStatus2();
    res.json({
      ...base,
      email: email.configured ? "configured" : "not_configured",
      ...email.hint ? { emailHint: email.hint } : {}
    });
  } catch {
    res.status(503).json({
      ...base,
      success: false,
      database: "error",
      error: "Database unreachable"
    });
  }
});
app.use("/api/v1/auth", auth_routes_default);
app.use("/api/v1/patients", patient_routes_default);
app.use("/api/v1/visits", visit_routes_default);
app.use("/api/v1/prescriptions", prescription_routes_default);
app.use("/api/v1/lab", lab_routes_default);
app.use("/api/v1/pharmacy", pharmacy_routes_default);
app.use("/api/v1/ultrasound", ultrasound_routes_default);
app.use("/api/v1/injections", injection_routes_default);
app.use("/api/v1/finance", finance_routes_default);
app.use("/api/v1/notifications", notification_routes_default);
app.use("/api/v1/admin", admin_routes_default);
app.use("/api/v1/chat", chat_routes_default);
app.use("/api/v1/patient-portal", patientPortal_routes_default);
app.use("/api/v1/users", user_routes_default);
app.use("/api/v1/uploads", uploads_routes_default);
app.use("/api/v1/appointments", appointment_routes_default);
app.use("/api/v1/nurse", nurse_routes_default);
app.use("/api/v1/emergency", emergency_routes_default);
app.use("/api/v1/doctor", doctor_routes_default);
app.use("/api/v1/certificates", certificate_routes_default);
app.use("/api/v1/contact", contact_routes_default);
app.use(notFoundHandler);
app.use(errorHandler);
var app_default = app;

// src/services/backup.service.ts
var import_client15 = require("@prisma/client");
var fs3 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
var import_child_process = require("child_process");
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var prisma10 = new import_client15.PrismaClient();
var BackupService = class {
  backupDir = path3.join(process.cwd(), "backups");
  constructor() {
    if (!fs3.existsSync(this.backupDir)) {
      fs3.mkdirSync(this.backupDir, { recursive: true });
    }
  }
  /**
   * Create full database backup
   */
  async createBackup(options = {}) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupName = `backup_${timestamp}`;
    const backupPath = path3.join(this.backupDir, backupName);
    try {
      fs3.mkdirSync(backupPath, { recursive: true });
      await this.backupDatabase(backupPath);
      if (options.includeUploads) {
        await this.backupUploads(backupPath);
      }
      await this.createMetadata(backupPath, options);
      if (options.compress) {
        await this.compressBackup(backupPath);
      }
      console.log(`Backup created successfully: ${backupName}`);
      return backupName;
    } catch (error) {
      console.error("Backup failed:", error);
      throw error;
    }
  }
  /**
   * Backup database using pg_dump
   */
  async backupDatabase(backupPath) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not configured");
    }
    const outputFile = path3.join(backupPath, "database.sql");
    if (dbUrl.includes("postgresql")) {
      const command = `pg_dump "${dbUrl}" > "${outputFile}"`;
      await execAsync(command);
    } else if (dbUrl.includes("mysql")) {
      const command = `mysqldump "${dbUrl}" > "${outputFile}"`;
      await execAsync(command);
    } else if (dbUrl.includes("sqlite")) {
      const dbFile = dbUrl.replace("file:", "");
      fs3.copyFileSync(dbFile, outputFile);
    }
  }
  /**
   * Backup uploads directory
   */
  async backupUploads(backupPath) {
    const uploadsDir = path3.join(process.cwd(), "uploads");
    const backupUploadsDir = path3.join(backupPath, "uploads");
    if (fs3.existsSync(uploadsDir)) {
      await this.copyDirectory(uploadsDir, backupUploadsDir);
    }
  }
  /**
   * Create backup metadata
   */
  async createMetadata(backupPath, options) {
    const metadata = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      options,
      stats: {
        patients: await prisma10.patient.count(),
        visits: await prisma10.visit.count(),
        prescriptions: await prisma10.prescription.count(),
        labOrders: await prisma10.labOrder.count(),
        users: await prisma10.user.count()
      }
    };
    const metadataFile = path3.join(backupPath, "metadata.json");
    fs3.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  }
  /**
   * Compress backup directory
   */
  async compressBackup(backupPath) {
    const archivePath = `${backupPath}.tar.gz`;
    const command = `tar -czf "${archivePath}" -C "${path3.dirname(backupPath)}" "${path3.basename(backupPath)}"`;
    await execAsync(command);
    fs3.rmSync(backupPath, { recursive: true, force: true });
  }
  /**
   * List all backups
   */
  async listBackups() {
    const files = fs3.readdirSync(this.backupDir);
    return files.filter((file) => file.startsWith("backup_")).map((file) => {
      const filePath = path3.join(this.backupDir, file);
      const stats = fs3.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        compressed: file.endsWith(".tar.gz")
      };
    }).sort((a, b) => b.created.getTime() - a.created.getTime());
  }
  /**
   * Restore from backup
   */
  async restoreBackup(backupName) {
    const backupPath = path3.join(this.backupDir, backupName);
    if (!fs3.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }
    try {
      let extractedPath = backupPath;
      if (backupName.endsWith(".tar.gz")) {
        await this.extractBackup(backupPath);
        extractedPath = backupPath.replace(".tar.gz", "");
      }
      await this.restoreDatabase(extractedPath);
      await this.restoreUploads(extractedPath);
      console.log(`Backup restored successfully: ${backupName}`);
    } catch (error) {
      console.error("Restore failed:", error);
      throw error;
    }
  }
  /**
   * Extract compressed backup
   */
  async extractBackup(archivePath) {
    const command = `tar -xzf "${archivePath}" -C "${this.backupDir}"`;
    await execAsync(command);
  }
  /**
   * Restore database
   */
  async restoreDatabase(backupPath) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not configured");
    }
    const sqlFile = path3.join(backupPath, "database.sql");
    if (!fs3.existsSync(sqlFile)) {
      throw new Error("Database backup file not found");
    }
    if (dbUrl.includes("postgresql")) {
      const command = `psql "${dbUrl}" < "${sqlFile}"`;
      await execAsync(command);
    } else if (dbUrl.includes("mysql")) {
      const command = `mysql "${dbUrl}" < "${sqlFile}"`;
      await execAsync(command);
    } else if (dbUrl.includes("sqlite")) {
      const dbFile = dbUrl.replace("file:", "");
      fs3.copyFileSync(sqlFile, dbFile);
    }
  }
  /**
   * Restore uploads
   */
  async restoreUploads(backupPath) {
    const backupUploadsDir = path3.join(backupPath, "uploads");
    const uploadsDir = path3.join(process.cwd(), "uploads");
    if (fs3.existsSync(backupUploadsDir)) {
      if (fs3.existsSync(uploadsDir)) {
        fs3.rmSync(uploadsDir, { recursive: true, force: true });
      }
      await this.copyDirectory(backupUploadsDir, uploadsDir);
    }
  }
  /**
   * Delete old backups
   */
  async cleanOldBackups(retentionDays = 30) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const backups = await this.listBackups();
    let deletedCount = 0;
    for (const backup of backups) {
      if (backup.created < cutoffDate) {
        const backupPath = path3.join(this.backupDir, backup.name);
        fs3.rmSync(backupPath, { recursive: true, force: true });
        deletedCount++;
      }
    }
    return deletedCount;
  }
  /**
   * Copy directory recursively
   */
  async copyDirectory(src, dest) {
    fs3.mkdirSync(dest, { recursive: true });
    const entries = fs3.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path3.join(src, entry.name);
      const destPath = path3.join(dest, entry.name);
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs3.copyFileSync(srcPath, destPath);
      }
    }
  }
  /**
   * Export data to JSON
   */
  async exportToJson(tables) {
    const data = {};
    for (const table of tables) {
      try {
        data[table] = await prisma10[table].findMany();
      } catch (error) {
        console.error(`Error exporting table ${table}:`, error);
      }
    }
    return data;
  }
  /**
   * Schedule automatic backups
   */
  scheduleBackups(intervalHours = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1e3;
    return setInterval(async () => {
      try {
        console.log("Starting scheduled backup...");
        await this.createBackup({ includeUploads: true, compress: true });
        await this.cleanOldBackups(30);
      } catch (error) {
        console.error("Scheduled backup failed:", error);
      }
    }, intervalMs);
  }
};
var backupService = new BackupService();

// src/server.ts
var PORT = process.env.PORT || 3e3;
var server = app_default.listen(PORT, () => {
  console.log(`\u{1F680} Server running on port ${PORT}`);
  console.log(`\u{1F4CA} Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\u{1F517} API: http://localhost:${PORT}/api/v1`);
  console.log(`\u{1F49A} Health: http://localhost:${PORT}/health`);
  if (process.env.ENABLE_AUTO_BACKUP === "true") {
    console.log("\u{1F4E6} Automatic backups enabled");
    backupService.scheduleBackups(24);
  }
});
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
var server_default = server;
//# sourceMappingURL=server.js.map
