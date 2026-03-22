const { success, error } = require("../utils/responseHandler");

// GET profile
exports.getProfile = (req, res) => {
  try {
    return success(res, "Profile fetched", {
      userId: req.user.id,
      email: req.user.email,
      name: "Test User"
    });
  } catch (err) {
    return error(res, "Failed to fetch profile");
  }
};

// UPDATE profile
exports.updateProfile = (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return error(res, "All fields required");
    }

    return success(res, "Profile updated", {
      userId: req.user.id,
      name,
      email
    });

  } catch (err) {
    return error(res, "Update failed");
  }
};