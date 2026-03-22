exports.success = (res, message, data = {}) => {
  return res.json({
    success: true,
    message,
    data
  });
};

exports.error = (res, message, status = 400) => {
  return res.status(status).json({
    success: false,
    message
  });
};