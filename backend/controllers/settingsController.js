const { success, error } = require("../utils/responseHandler");

// GET settings
exports.getSettings = (req, res) => {
  try {
    return success(res, "Settings fetched", {
      userId: req.user.id,
      theme: "light",
      notifications: true
    });
  } catch (err) {
    return error(res, "Failed to fetch settings");
  }
};

// UPDATE settings
exports.updateSettings = (req, res) => {
  try {
    const { theme, notifications } = req.body;

    if (!theme) {
      return error(res, "Theme is required");
    }

    return success(res, "Settings updated", {
      userId: req.user.id,
      theme,
      notifications
    });

  } catch (err) {
    return error(res, "Update failed");
  }
};