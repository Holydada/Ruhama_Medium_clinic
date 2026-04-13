"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const client_1 = require("@prisma/client");
const email_service_1 = require("./email.service");
const prisma = new client_1.PrismaClient();
exports.contactService = {
    // Create a new contact message
    async createMessage(data) {
        const contactMessage = await prisma.contactMessage.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                status: 'PENDING',
            },
        });
        // Send notification email to admin
        try {
            await email_service_1.emailService.sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@ruhamaclinic.com',
                subject: `New Contact Message: ${data.subject || 'No Subject'}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Message Received</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${data.fullName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
              ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Please log in to the admin panel to respond to this message.
            </p>
          </div>
        `,
            });
        }
        catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
            // Don't fail the request if email fails
        }
        // Send confirmation email to user
        try {
            await email_service_1.emailService.sendEmail({
                to: data.email,
                subject: 'We received your message - Ruhama Clinic',
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
        `,
            });
        }
        catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }
        return contactMessage;
    },
    // Get all messages with optional filtering
    async getAllMessages(options) {
        const { status, page = 1, limit = 20 } = options;
        const skip = (page - 1) * limit;
        const where = status ? { status: status } : {};
        const [messages, total] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.contactMessage.count({ where }),
        ]);
        return {
            messages,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    // Get a single message by ID
    async getMessageById(id) {
        return await prisma.contactMessage.findUnique({
            where: { id },
        });
    },
    // Respond to a message and send email to user
    async respondToMessage(id, response, respondedBy) {
        const message = await prisma.contactMessage.findUnique({
            where: { id },
        });
        if (!message) {
            throw new Error('Message not found');
        }
        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: {
                response,
                respondedBy,
                respondedAt: new Date(),
                status: 'RESPONDED',
            },
        });
        // Send response email to user
        try {
            await email_service_1.emailService.sendEmail({
                to: message.email,
                subject: `Re: ${message.subject || 'Your inquiry'} - Ruhama Clinic`,
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
        `,
            });
        }
        catch (emailError) {
            console.error('Failed to send response email:', emailError);
            throw new Error('Failed to send response email to user');
        }
        return updatedMessage;
    },
    // Update message status
    async updateMessageStatus(id, status) {
        return await prisma.contactMessage.update({
            where: { id },
            data: { status: status },
        });
    },
    // Delete a message
    async deleteMessage(id) {
        return await prisma.contactMessage.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=contact.service.js.map