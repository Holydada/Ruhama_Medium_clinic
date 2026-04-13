"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const injectionController = __importStar(require("../controllers/injection.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Create injection order (doctors only)
router.post('/', (0, auth_1.authorize)('DOCTOR', 'SUPER_ADMIN'), injectionController.createInjectionOrder);
// Get injection orders
router.get('/', injectionController.getInjectionOrders);
// Get injection queue (nurses and injection room staff)
router.get('/queue', (0, auth_1.authorize)('NURSE', 'INJECTION_ROOM', 'SUPER_ADMIN'), injectionController.getInjectionQueue);
// Get injection order by ID
router.get('/:id', injectionController.getInjectionOrderById);
// Get administration history for an order
router.get('/:id/history', injectionController.getAdministrationHistory);
// Administer injection (nurses and injection room staff)
router.post('/:id/administer', (0, auth_1.authorize)('NURSE', 'INJECTION_ROOM', 'SUPER_ADMIN'), injectionController.administerInjection);
// Cancel injection order
router.post('/:id/cancel', (0, auth_1.authorize)('DOCTOR', 'SUPER_ADMIN'), injectionController.cancelInjectionOrder);
exports.default = router;
//# sourceMappingURL=injection.routes.js.map