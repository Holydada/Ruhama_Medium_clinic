/** Professional email templates for Ruhama Metekiya Medium Clinic */
export declare function registrationReceivedTemplate(fullName: string, roleLabel: string): string;
export declare function adminNewRegistrationTemplate(applicantEmail: string, fullName: string, roleLabel: string, adminDashboardUrl: string): string;
export declare function approvalAndVerificationTemplate(fullName: string, verificationUrl: string): string;
declare function escapeHtml(text: string): string;
export { escapeHtml };
export declare function emailChangeOTPTemplate(fullName: string, newEmail: string, otp: string): string;
export declare function firstLoginOTPTemplate(fullName: string, email: string, otp: string): string;
//# sourceMappingURL=email-templates.d.ts.map