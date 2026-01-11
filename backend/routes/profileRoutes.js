const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { saveProfile } = require("../controllers/profileController");

router.post("/profile", upload.single("profilePic"), saveProfile);

module.exports = router;
