exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // TEMP (later Firebase)
    return res.json({
      success: true,
      message: "User registered successfully",
      user: { email }
    });

  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    return res.json({
      success: true,
      message: "Login successful",
      token: "dummy-token"
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};