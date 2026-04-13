"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;

const doctor_service_1 = require("../services/doctor.service");

class DoctorController {
  constructor() {
    this.doctorService = new doctor_service_1.DoctorService();
  }

  /**
   * GET /doctor/queue
   * Get doctor's patient queue
   */
  async getQueue(req, res) {
    try {
      const doctorId = req.user.id;
      const queue = await this.doctorService.getDoctorQueue(doctorId);
      
      res.json({
        success: true,
        data: queue
      });
    } catch (error) {
      console.error('[DoctorController] getQueue error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch queue'
      });
    }
  }

  /**
   * GET /doctor/visit/:visitId
   * Get patient details for encounter
   */
  async getVisitDetails(req, res) {
    try {
      const doctorId = req.user.id;
      const { visitId } = req.params;
      
      const details = await this.doctorService.getPatientForEncounter(visitId, doctorId);
      
      res.json({
        success: true,
        data: details
      });
    } catch (error) {
      console.error('[DoctorController] getVisitDetails error:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Visit not found'
      });
    }
  }

  /**
   * POST /doctor/encounter
   * Create doctor encounter
   */
  async createEncounter(req, res) {
    try {
      const doctorId = req.user.id;
      const { visitId, ...data } = req.body;

      if (!visitId) {
        res.status(400).json({
          success: false,
          error: 'visitId is required'
        });
        return;
      }

      if (!data.chiefComplaint || !data.diagnosis) {
        res.status(400).json({
          success: false,
          error: 'chiefComplaint and diagnosis are required'
        });
        return;
      }

      const encounter = await this.doctorService.createEncounter(visitId, doctorId, data);
      
      res.status(201).json({
        success: true,
        message: 'Encounter created successfully',
        data: encounter
      });
    } catch (error) {
      console.error('[DoctorController] createEncounter error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create encounter'
      });
    }
  }

  /**
   * POST /doctor/prescription
   * Create prescription
   */
  async createPrescription(req, res) {
    try {
      const doctorId = req.user.id;
      const { visitId, medications, instructions } = req.body;

      if (!visitId || !medications || !Array.isArray(medications) || medications.length === 0) {
        res.status(400).json({
          success: false,
          error: 'visitId and medications array are required'
        });
        return;
      }

      const prescription = await this.doctorService.createPrescription(visitId, doctorId, {
        medications,
        instructions
      });
      
      res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: prescription
      });
    } catch (error) {
      console.error('[DoctorController] createPrescription error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create prescription'
      });
    }
  }

  /**
   * POST /doctor/lab-order
   * Create lab order
   */
  async createLabOrder(req, res) {
    try {
      const doctorId = req.user.id;
      const { visitId, tests, clinicalNotes, urgency } = req.body;

      if (!visitId || !tests || !Array.isArray(tests) || tests.length === 0) {
        res.status(400).json({
          success: false,
          error: 'visitId and tests array are required'
        });
        return;
      }

      const labOrder = await this.doctorService.createLabOrder(visitId, doctorId, {
        tests,
        clinicalNotes,
        urgency
      });
      
      res.status(201).json({
        success: true,
        message: 'Lab order created successfully',
        data: labOrder
      });
    } catch (error) {
      console.error('[DoctorController] createLabOrder error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create lab order'
      });
    }
  }

  /**
   * POST /doctor/injection-order
   * Create injection order
   */
  async createInjectionOrder(req, res) {
    try {
      const doctorId = req.user.id;
      const { visitId, medicationName, dosage, route, frequency, duration, instructions } = req.body;

      if (!visitId || !medicationName || !dosage || !route) {
        res.status(400).json({
          success: false,
          error: 'visitId, medicationName, dosage, and route are required'
        });
        return;
      }

      const injectionOrder = await this.doctorService.createInjectionOrder(visitId, doctorId, {
        medicationName,
        dosage,
        route,
        frequency,
        duration,
        instructions
      });
      
      res.status(201).json({
        success: true,
        message: 'Injection order created successfully',
        data: injectionOrder
      });
    } catch (error) {
      console.error('[DoctorController] createInjectionOrder error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create injection order'
      });
    }
  }

  /**
   * POST /doctor/lab-order
   * Create lab order
   */
  async createLabOrder(req, res) {
    try {
      const doctorId = req.user.id;
      const { patientId, visitId, testIds, priority, clinicalNotes } = req.body;

      if (!patientId || !testIds || testIds.length === 0) {
        res.status(400).json({
          success: false,
          error: 'patientId and testIds are required'
        });
        return;
      }

      const labOrder = await this.doctorService.createLabOrder(visitId, doctorId, {
        patientId,
        testIds,
        priority: priority || 'ROUTINE',
        clinicalNotes
      });

      res.status(201).json({
        success: true,
        message: 'Lab order created successfully',
        data: labOrder
      });
    } catch (error) {
      console.error('[DoctorController] createLabOrder error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create lab order'
      });
    }
  }

  /**
   * PATCH /doctor/visit/:visitId/complete
   * Complete visit
   */
  async completeVisit(req, res) {
    try {
      const doctorId = req.user.id;
      const { visitId } = req.params;

      const visit = await this.doctorService.completeVisit(visitId, doctorId);
      
      res.json({
        success: true,
        message: 'Visit completed successfully',
        data: visit
      });
    } catch (error) {
      console.error('[DoctorController] completeVisit error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to complete visit'
      });
    }
  }

  /**
   * GET /doctor/stats
   * Get doctor statistics
   */
  async getStats(req, res) {
    try {
      const doctorId = req.user.id;
      const stats = await this.doctorService.getDoctorStats(doctorId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('[DoctorController] getStats error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch statistics'
      });
    }
  }
}

exports.DoctorController = DoctorController;
