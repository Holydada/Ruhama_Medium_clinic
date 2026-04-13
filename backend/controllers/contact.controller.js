"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const contact_service_1 = require("../services/contact.service");
exports.contactController = {
    // Submit a new contact message (public)
    async submitMessage(req, res) {
        try {
            const { fullName, email, phone, subject, message } = req.body;
            if (!fullName || !email || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'Full name, email, and message are required',
                });
            }
            const contactMessage = await contact_service_1.contactService.createMessage({
                fullName,
                email,
                phone,
                subject,
                message,
            });
            return res.status(201).json({
                success: true,
                message: 'Your message has been sent successfully. We will get back to you soon!',
                data: contactMessage,
            });
        }
        catch (error) {
            console.error('Error submitting contact message:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to submit message. Please try again later.',
            });
        }
    },
    // Get all contact messages (admin only)
    async getAllMessages(req, res) {
        try {
            const { status, page = '1', limit = '20' } = req.query;
            const messages = await contact_service_1.contactService.getAllMessages({
                status: status,
                page: parseInt(page),
                limit: parseInt(limit),
            });
            return res.status(200).json({
                success: true,
                data: messages,
            });
        }
        catch (error) {
            console.error('Error fetching contact messages:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch messages',
            });
        }
    },
    // Get a single message by ID (admin only)
    async getMessageById(req, res) {
        try {
            const { id } = req.params;
            const message = await contact_service_1.contactService.getMessageById(id);
            if (!message) {
                return res.status(404).json({
                    success: false,
                    error: 'Message not found',
                });
            }
            return res.status(200).json({
                success: true,
                data: message,
            });
        }
        catch (error) {
            console.error('Error fetching message:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch message',
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
                    error: 'Response text is required',
                });
            }
            const updatedMessage = await contact_service_1.contactService.respondToMessage(id, response, userId);
            return res.status(200).json({
                success: true,
                message: 'Response sent successfully',
                data: updatedMessage,
            });
        }
        catch (error) {
            console.error('Error responding to message:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to send response',
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
                    error: 'Status is required',
                });
            }
            const updatedMessage = await contact_service_1.contactService.updateMessageStatus(id, status);
            return res.status(200).json({
                success: true,
                message: 'Status updated successfully',
                data: updatedMessage,
            });
        }
        catch (error) {
            console.error('Error updating message status:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to update status',
            });
        }
    },
    // Delete a message (admin only)
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            await contact_service_1.contactService.deleteMessage(id);
            return res.status(200).json({
                success: true,
                message: 'Message deleted successfully',
            });
        }
        catch (error) {
            console.error('Error deleting message:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to delete message',
            });
        }
    },
};
//# sourceMappingURL=contact.controller.js.map