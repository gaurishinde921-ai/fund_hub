exports.signup = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  const existing = users.find((u) => u.email === email);
  if (existing)
    return res.status(400).json({ success: false, message: "Email already exists" });

  users.push({ username, email, password });

  return res.json({ success: true, message: "Signup successful!" });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user)
    return res.status(401).json({ success: false, message: "Invalid email or password" });

  return res.json({ success: true, user });
};
