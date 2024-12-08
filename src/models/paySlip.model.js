const { default: mongoose } = require("mongoose");
const schemaFields = require("../utils/schemaFieldUtils");

const paySlipFields = {
  // Company Details
  companyName: schemaFields.requiredAndString,
  companyLogo: schemaFields.requiredAndString,
  companyLocation: schemaFields.requiredAndString, // Added location
  // Date
  paySlipMonth: schemaFields.requiredAndString, // Added paySlipMonth
  salaryDate: schemaFields.requiredAndString, // Added salaryDate
  // Personal Details
  employeeName: schemaFields.requiredAndString,
  employeeId: schemaFields.requiredAndString, // Changed from employeeNumber
  designation: schemaFields.requiredAndString,
  department: schemaFields.requiredAndString,
  dateOfJoining: schemaFields.requiredAndString,
  pfAccountNumber: schemaFields.StringWithDefault("Not provided"), // Changed pfNumber to pfAccountNumber
  uan: schemaFields.StringWithDefault("Not provided"), // Added UAN (Universal Account Number)
  
  // Leave Details
  casualLeaveAvailable: schemaFields.requiredNumberWithDefault(0),
  casualLeaveUsed: schemaFields.requiredNumberWithDefault(0),
  casualLeaveBalance: schemaFields.requiredNumberWithDefault(0),
  sickLeaveAvailable: schemaFields.requiredNumberWithDefault(0),
  sickLeaveUsed: schemaFields.requiredNumberWithDefault(0),
  sickLeaveBalance: schemaFields.requiredNumberWithDefault(0),
  balanceLeaveAvailable: schemaFields.requiredNumberWithDefault(0),
  balanceLeaveUsed: schemaFields.requiredNumberWithDefault(0),
  balanceLeaveBalance: schemaFields.requiredNumberWithDefault(0),
  compOffAvailable: schemaFields.requiredNumberWithDefault(0),
  compOffUsed: schemaFields.requiredNumberWithDefault(0),
  compOffBalance: schemaFields.requiredNumberWithDefault(0),
  totalLeaveBalance: schemaFields.requiredNumberWithDefault(0),

  // Salary Components
  basic: schemaFields.requiredNumberWithDefault(0),
  hra: schemaFields.requiredNumberWithDefault(0),
  conveyance: schemaFields.requiredNumberWithDefault(0),
  fixedAllowance: schemaFields.requiredNumberWithDefault(0),
  grossEarnings: schemaFields.requiredNumberWithDefault(0),

  // Deductions
  epfContribution: schemaFields.requiredNumberWithDefault(0),
  professionalTax: schemaFields.requiredNumberWithDefault(0),
  lopDeduction: schemaFields.requiredNumberWithDefault(0),
  totalDeductions: schemaFields.requiredNumberWithDefault(0),
  totalNetPay: schemaFields.requiredNumberWithDefault(0),

  // Total Summary
  netPay: schemaFields.requiredAndString, // Used for net pay in ₹ format
  amountInWords: schemaFields.requiredAndString, // Added amountInWords for displaying in words
  paidDays: schemaFields.requiredNumberWithDefault(0),
  lopDays: schemaFields.requiredNumberWithDefault(0),
};

const PaySlipSchema = mongoose.Schema(paySlipFields,{timestamp:true,collection:"PaySlip"});

const PaySlipModel = mongoose.model("PaySlip", PaySlipSchema);

module.exports = {PaySlipModel};