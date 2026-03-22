const { success, error } = require("../utils/responseHandler");

// SUBMIT KYC
exports.submitKYC = (req, res) => {
  try {
    const { name, document } = req.body;

    if (!name || !document) {
      return error(res, "All fields required");
    }

    return success(res, "KYC submitted", {
      userId: req.user.id,
      name,
      document
    });

  } catch (err) {
    return error(res, "Submission failed");
  }
};

// GET STATUS
exports.getKYCStatus = (req, res) => {
  try {
    return success(res, "KYC status fetched", {
      userId: req.user.id,
      status: "pending"
    });
  } catch (err) {
    return error(res, "Failed to fetch status");
  }
};