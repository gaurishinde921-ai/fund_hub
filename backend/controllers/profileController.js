exports.saveProfile = (req, res) => {
  try {
    const {
      startupName,
      username,
      category,
      mobile,
      gender,
      address,
      pincode
    } = req.body;

    const profilePic = req.file ? req.file.filename : null;

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully!",
      data: {
        startupName,
        username,
        category,
        mobile,
        gender,
        address,
        pincode,
        profilePic
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
