class ApiResponse {
  constructor(statusCode, message = "success", crackItData) {
    this.statusCode = statusCode || 200;
    this.message = message || "successfully";
    this.success = true;
    this.crackItData = crackItData;
  }
}

module.exports = ApiResponse;
