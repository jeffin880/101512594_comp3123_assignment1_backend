// backend/src/routes/employeeRoutes.js
import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// GET /api/v1/employees  -> list all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    console.log('Returning employees count:', employees.length);
    return res.status(200).json(employees);
  } catch (err) {
    console.error('Get employees error:', err);
    return res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

export default router;
