import express from 'express'
import { body } from 'express-validator'
import { validate } from '../utils/validation.js'
import { protect } from '../middleware/auth.js'
import { role } from '../middleware/role.js'
import {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave
} from '../controllers/leaveController.js'

const router = express.Router()

router.post('/', [
  body('leaveType').isIn(['sick', 'vacation', 'personal', 'other']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required')
], validate, protect, createLeave)

router.get('/', protect, getMyLeaves)

router.get('/all', protect, role('employer'), getAllLeaves)

router.put('/:id/approve', protect, role('employer'), approveLeave)

router.put('/:id/reject', protect, role('employer'), rejectLeave)

export default router
