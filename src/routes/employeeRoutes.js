const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  searchEmployees,
} = require("../controllers/employeeController");


router.get("/employees/search", authMiddleware, searchEmployees);


router.get("/employees", authMiddleware, getAllEmployees);


router.post(
  "/employees",
  authMiddleware,
  upload.single("profilePicture"),
  createEmployee
);


router.get("/employees/:eid", authMiddleware, getEmployeeById);


router.put(
  "/employees/:eid",
  authMiddleware,
  upload.single("profilePicture"),
  updateEmployeeById
);


router.delete("/employees", authMiddleware, deleteEmployeeById);

module.exports = router;
