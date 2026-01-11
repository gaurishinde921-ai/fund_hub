// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
  console.log("📁 'uploads' folder created automatically");
}

// ================== MULTER CONFIG ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ================== TEMP USER DB (TEMPORARY) ==================
const users = [];

// ================== AUTH ROUTES ==================

// Signup
app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ success: false, message: "All fields are required" });

  const exists = users.find((u) => u.email === email);
  if (exists)
    return res.status(400).json({ success: false, message: "Email already exists" });

  users.push({ username, email, password });
  res.json({ success: true, message: "Signup successful" });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user)
    return res.status(401).json({ success: false, message: "Invalid email or password" });

  res.json({ success: true, user });
});

// ================== PROFILE UPLOAD ROUTE ==================
app.post("/api/profile", upload.single("profilePic"), (req, res) => {
  const { startupName, username, category, mobile, gender, address, pincode } =
    req.body;

  if (!startupName || !username || !category || !mobile || !gender || !address || !pincode)
    return res.status(400).json({ success: false, message: "All fields are required" });

  const profileData = {
    profilePic: req.file ? `/uploads/${req.file.filename}` : null,
    startupName,
    username,
    category,
    mobile,
    gender,
    address,
    pincode,
  };

  console.log("📌 Profile Saved:", profileData);
  res.json({
    success: true,
    message: "Profile saved successfully!",
    data: profileData,
  });
});

// =============================================================
//              🟦 RAZORPAY INTEGRATION (OPTION B)
// =============================================================

// 1️⃣ Create Razorpay Instance
const razorpay = new Razorpay({
  key_id: "rzp_test_xxxxxxxxxx",       // << REPLACE WITH YOUR KEY
  key_secret: "xxxxxxxxxxxxxxxx",     // << REPLACE WITH YOUR SECRET
});

// 2️⃣ Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({ success: true, order });
  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// 3️⃣ Verify Payment API
app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.log("Verification Error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("🚀 FundHub backend is running!");
});

// ================== START SERVER ==================
app.listen(PORT, () =>
  console.log(`🚀 Backend running at: http://localhost:${PORT}`)
);






























