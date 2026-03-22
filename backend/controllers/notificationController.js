const { success, error } = require("../utils/responseHandler");

// GET notifications
exports.getNotifications = (req, res) => {
  try {
    return success(res, "Notifications fetched", {
      userId: req.user.id,
      notifications: [
        {
          id: 1,
          message: "New request received"
        },
        {
          id: 2,
          message: "Payment successful"
        }
      ]
    });
  } catch (err) {
    return error(res, "Failed to fetch notifications");
  }
};