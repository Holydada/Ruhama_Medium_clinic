"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const appointment_service_1 = require("../services/appointment.service");
const appointmentService = new appointment_service_1.AppointmentService();
class AppointmentController {
    async createAppointment(req, res) {
        try {
            const appointment = await appointmentService.createAppointment(req.body);
            res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                data: appointment,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getAppointments(req, res) {
        try {
            const { doctorId, patientId, status, date, page, limit } = req.query;
            const result = await appointmentService.getAppointments({
                doctorId: doctorId,
                patientId: patientId,
                status: status,
                date: date,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    async getAppointmentById(req, res) {
        try {
            const appointment = await appointmentService.getAppointmentById(req.params.id);
            res.json({
                success: true,
                data: appointment,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    async checkInAppointment(req, res) {
        try {
            const result = await appointmentService.checkInAppointment(req.params.id, req.user.id);
            res.json({
                success: true,
                message: 'Appointment checked in successfully',
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async cancelAppointment(req, res) {
        try {
            const { reason } = req.body;
            if (!reason || !reason.trim()) {
                res.status(400).json({
                    success: false,
                    error: 'Cancellation reason is required',
                });
                return;
            }
            const appointment = await appointmentService.cancelAppointment(req.params.id, reason, req.user.id);
            res.json({
                success: true,
                message: 'Appointment cancelled successfully',
                data: appointment,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async rescheduleAppointment(req, res) {
        try {
            const { appointmentDate, startTime, endTime } = req.body;
            if (!appointmentDate || !startTime || !endTime) {
                res.status(400).json({
                    success: false,
                    error: 'appointmentDate, startTime, and endTime are required',
                });
                return;
            }
            const appointment = await appointmentService.rescheduleAppointment(req.params.id, new Date(appointmentDate), new Date(startTime), new Date(endTime));
            res.json({
                success: true,
                message: 'Appointment rescheduled successfully',
                data: appointment,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async markNoShow(req, res) {
        try {
            const appointment = await appointmentService.markNoShow(req.params.id);
            res.json({
                success: true,
                message: 'Appointment marked as no-show',
                data: appointment,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    async uncheckInAppointment(req, res) {
        try {
            const appointment = await appointmentService.uncheckInAppointment(req.params.id);
            res.json({
                success: true,
                message: 'Appointment unchecked-in successfully',
                data: appointment,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=appointment.controller.js.map