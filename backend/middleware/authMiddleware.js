module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token"
      });
    }

    // TEMP: fake validation (later replaced by Firebase/JWT)
    if (token !== "valid-token") {
      return res.status(403).json({
        success: false,
        message: "Invalid token"
      });
    }

    // ❗ Assign user context so controllers can use req.user
    req.user = {
      id: "user123",
      email: "test@gmail.com"
    };

    next();

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Auth error"
    });
  }
};