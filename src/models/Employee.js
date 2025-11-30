
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    position: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    date_of_joining: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
