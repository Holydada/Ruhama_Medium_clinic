/** Exposed for /health — no secrets. */
export declare function getEmailConfigStatus(): {
    configured: boolean;
    hint?: string;
};
export declare class EmailService {
    /** Sent right after a staff member submits self-registration (simple confirmation only). */
    sendRegistrationReceivedEmail(toEmail: string, fullName: string, roleLabel: string): Promise<void>;
    /** Notify clinic admin that a new staff registration needs review. */
    sendAdminNewRegistrationAlert(applicantEmail: string, fullName: string, roleLabel: string): Promise<void>;
    /** Sent after admin approves the user — includes the email verification link. */
    sendApprovalAndVerificationEmail(toEmail: string, fullName: string, token: string): Promise<void>;
    /** Send email change OTP to the NEW email address. */
    sendEmailChangeOTP(newEmail: string, fullName: string, otp: string): Promise<void>;
    /** Send first login OTP after admin approval. */
    sendFirstLoginOTP(toEmail: string, fullName: string, otp: string): Promise<void>;
}
//# sourceMappingURL=email.service.d.ts.map