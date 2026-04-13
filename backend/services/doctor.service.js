"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;

const database_1 = require("../config/database");

class DoctorService {
  /**
   * Get doctor's patient queue (patients assigned by reception)
   */
  async getDoctorQueue(doctorId) {
    const visits = await database_1.default.patientVisit.findMany({
      where: {
        assignedDoctorId: doctorId,
        status: {
          in: ['WAITING', 'IN_PROGRESS']
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            cardNumber: true,
            fullName: true,
            sex: true,
            dateOfBirth: true,
            phone: true,
            photoUrl: true,
            allergies: true,
            hasAllergies: true,
            hasDiabetes: true,
            hasHypertension: true,
            currentMedications: true
          }
        },
        triageRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            chiefComplaint: true,
            temperature: true,
            bloodPressure: true,
            heartRate: true,
            respiratoryRate: true,
            oxygenSaturation: true,
            weight: true,
            height: true,
            triageLevel: true
          }
        }
      },
      orderBy: {
        visitDate: 'asc'
      }
    });

    return visits.map(visit => {
      const age = this.calculateAge(visit.patient.dateOfBirth);
      const triage = visit.triageRecords[0];
      
      return {
        id: visit.id,
        visitId: visit.id,
        visitNumber: visit.visitNumber,
        visitType: visit.visitType,
        status: visit.status,
        visitDate: visit.visitDate,
        patient: {
          ...visit.patient,
          age
        },
        chiefComplaint: triage?.chiefComplaint || null,
        vitals: triage ? {
          temperature: triage.temperature,
          bloodPressure: triage.bloodPressure,
          heartRate: triage.heartRate,
          respiratoryRate: triage.respiratoryRate,
          oxygenSaturation: triage.oxygenSaturation,
          weight: triage.weight,
          height: triage.height
        } : null,
        triageLevel: triage?.triageLevel || null
      };
    });
  }

  /**
   * Get patient details for encounter
   */
  async getPatientForEncounter(visitId, doctorId) {
    const visit = await database_1.default.patientVisit.findFirst({
      where: {
        id: visitId,
        assignedDoctorId: doctorId
      },
      include: {
        patient: true,
        triageRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        doctorEncounters: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!visit) {
      throw new Error('Visit not found or not assigned to you');
    }

    const age = this.calculateAge(visit.patient.dateOfBirth);

    return {
      visit: {
        id: visit.id,
        visitNumber: visit.visitNumber,
        visitType: visit.visitType,
        visitDate: visit.visitDate,
        status: visit.status
      },
      patient: {
        ...visit.patient,
        age
      },
      currentTriage: visit.triageRecords[0] || null,
      previousEncounters: visit.doctorEncounters || []
    };
  }

  /**
   * Create doctor encounter (consultation record)
   */
  async createEncounter(visitId, doctorId, data) {
    // Verify visit belongs to doctor
    const visit = await database_1.default.patientVisit.findFirst({
      where: {
        id: visitId,
        assignedDoctorId: doctorId
      }
    });

    if (!visit) {
      throw new Error('Visit not found or not assigned to you');
    }

    // Create encounter
    const encounter = await database_1.default.doctorEncounter.create({
      data: {
        visitId: visitId,
        patientId: visit.patientId,
        doctorId: doctorId,
        chiefComplaint: data.chiefComplaint,
        historyOfPresentIllness: data.historyOfPresentIllness || null,
        reviewOfSystems: data.reviewOfSystems || null,
        physicalExamination: data.physicalExamination || null,
        diagnosis: data.diagnosis,
        icdCodes: data.icdCodes || null,
        treatmentPlan: data.treatmentPlan || null,
        followUpInstructions: data.followUpInstructions || null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        notes: data.notes || null
      }
    });

    // Update visit status
    await database_1.default.patientVisit.update({
      where: { id: visitId },
      data: {
        status: 'IN_PROGRESS',
        chiefComplaint: data.chiefComplaint,
        diagnosis: data.diagnosis
      }
    });

    return encounter;
  }

  /**
   * Create prescription
   */
  async createPrescription(visitId, doctorId, data) {
    const visit = await database_1.default.patientVisit.findFirst({
      where: {
        id: visitId,
        assignedDoctorId: doctorId
      }
    });

    if (!visit) {
      throw new Error('Visit not found or not assigned to you');
    }

    const prescription = await database_1.default.prescription.create({
      data: {
        patientId: visit.patientId,
        visitId: visitId,
        prescribedById: doctorId,
        medications: JSON.stringify(data.medications),
        instructions: data.instructions || null,
        status: 'PENDING'
      }
    });

    return prescription;
  }

  /**
   * Create lab order
   */
  async createLabOrder(visitId, doctorId, data) {
    const visit = await database_1.default.patientVisit.findFirst({
      where: {
        id: visitId,
        assignedDoctorId: doctorId
      }
    });

    if (!visit) {
      throw new Error('Visit not found or not assigned to you');
    }

    // Generate order number
    const orderCount = await database_1.default.labOrder.count();
    const orderNumber = `LAB-${String(orderCount + 1).padStart(6, '0')}`;

    // Get or create lab tests
    const testItems = await Promise.all(
      data.tests.map(async (test) => {
        // Try to find existing test by code
        let labTest = await database_1.default.labTest.findFirst({
          where: { testCode: test.testCode }
        });

        // If not found, create it
        if (!labTest) {
          labTest = await database_1.default.labTest.create({
            data: {
              testCode: test.testCode,
              testName: test.testName,
              testCategory: 'General',
              price: 0,
              isActive: true
            }
          });
        }

        return {
          testId: labTest.id,
          testName: test.testName,
          notes: test.instructions || null,
          status: 'PENDING'
        };
      })
    );

    // Create lab order with items
    const labOrder = await database_1.default.labOrder.create({
      data: {
        orderNumber,
        patientId: visit.patientId,
        visitId: visitId,
        orderedById: doctorId,
        priority: data.urgency || 'ROUTINE',
        clinicalNotes: data.clinicalNotes || null,
        status: 'PENDING',
        items: {
          create: testItems
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
    });

    return labOrder;
  }

  /**
   * Create injection order
   */
  async createInjectionOrder(visitId, doctorId, data) {
    const visit = await database_1.default.patientVisit.findFirst({
      where: {
        id: visitId,
        assignedDoctorId: doctorId
      }
    });

    if (!visit) {
      throw new Error('Visit not found or not assigned to you');
    }

    const injectionOrder = await database_1.default.injectionOrder.create({
      data: {
        patientId: visit.patientId,
        visitId: visitId,
        orderedById: doctorId,
        medicationName: data.medicationName,
        dosage: data.dosage,
        route: data.route,
        frequency: data.frequency || null,
        duration: data.duration || null,
        instructions: data.instructions || null,
        status: 'PENDING'
      }
    });

    return injectionOrder;
  }

  /**
   * Complete visit
   */
  async completeVisit(visitId, doctorId) {
    const visit = await database_1.default.patientVisit.findFirst({
      where: {
        id: visitId,
        assignedDoctorId: doctorId
      }
    });

    if (!visit) {
      throw new Error('Visit not found or not assigned to you');
    }

    const updatedVisit = await database_1.default.patientVisit.update({
      where: { id: visitId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    return updatedVisit;
  }

  /**
   * Get doctor statistics
   */
  async getDoctorStats(doctorId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [waiting, inProgress, completed, totalToday] = await Promise.all([
      database_1.default.patientVisit.count({
        where: {
          assignedDoctorId: doctorId,
          status: 'WAITING'
        }
      }),
      database_1.default.patientVisit.count({
        where: {
          assignedDoctorId: doctorId,
          status: 'IN_PROGRESS'
        }
      }),
      database_1.default.patientVisit.count({
        where: {
          assignedDoctorId: doctorId,
          status: 'COMPLETED',
          completedAt: {
            gte: today
          }
        }
      }),
      database_1.default.patientVisit.count({
        where: {
          assignedDoctorId: doctorId,
          visitDate: {
            gte: today
          }
        }
      })
    ]);

    return {
      patientsWaiting: waiting,
      patientsInProgress: inProgress,
      patientsCompleted: completed,
      totalToday: totalToday
    };
  }

  /**
   * Helper: Calculate age from date of birth
   */
  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

exports.DoctorService = DoctorService;
