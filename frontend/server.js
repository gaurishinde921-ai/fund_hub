const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- Dummy Login API ---
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@example.com" && password === "1234") {
    return res.json({ success: true, message: "Login successful!" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials!" });
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));

