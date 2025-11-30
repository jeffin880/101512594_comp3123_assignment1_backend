const Employee = require("../models/Employee");

// 3) GET /api/v1/emp/employees  (200)
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    const formatted = employees.map((emp) => ({
      employee_id: emp._id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department,
      profilePicture: emp.profilePicture || null,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Get all employees error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// 4) POST /api/v1/emp/employees  (201)
exports.createEmployee = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !position ||
      !salary ||
      !date_of_joining ||
      !department
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // NEW: handle uploaded file
    let profilePicture = null;
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }

    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
      profilePicture,
    });

    res.status(201).json({
      message: "Employee created successfully.",
      employee_id: employee._id,
    });
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// 5) GET /api/v1/emp/employees/:eid  (200)
exports.getEmployeeById = async (req, res) => {
  try {
    const { eid } = req.params;

    const employee = await Employee.findById(eid);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      employee_id: employee._id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      position: employee.position,
      salary: employee.salary,
      date_of_joining: employee.date_of_joining,
      department: employee.department,
      profilePicture: employee.profilePicture || null,
    });
  } catch (err) {
    console.error("Get employee by ID error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// 6) PUT /api/v1/emp/employees/:eid  (200)
exports.updateEmployeeById = async (req, res) => {
  try {
    const { eid } = req.params;

    // NEW: allow updating profilePicture via uploaded file
    const updates = { ...req.body };
    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }

    const employee = await Employee.findByIdAndUpdate(eid, updates, {
      new: true,
    });

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee details updated successfully.",
    });
  } catch (err) {
    console.error("Update employee error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// 7) DELETE /api/v1/emp/employees?eid=xxx  (204)
exports.deleteEmployeeById = async (req, res) => {
  try {
    const { eid } = req.query;

    if (!eid) {
      return res.status(400).json({
        status: false,
        message: "eid query parameter is required",
      });
    }

    const employee = await Employee.findByIdAndDelete(eid);

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    // 204: no body
    res.status(204).send();
  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// SEARCH: GET /api/v1/emp/employees/search?department=...&position=...
exports.searchEmployees = async (req, res) => {
  try {
    const { department, position } = req.query;

    const filter = {};

    if (department) {
      filter.department = department;
    }

    if (position) {
      filter.position = position;
    }

    const employees = await Employee.find(filter);

    const formatted = employees.map((emp) => ({
      employee_id: emp._id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department,
      profilePicture: emp.profilePicture || null,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Search employees error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
