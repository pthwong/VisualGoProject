const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

function generateSecretKey(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

const SECRET_KEY = generateSecretKey();
console.log("SECRET_KEY:\n", SECRET_KEY);

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM VolunteerUser WHERE vtEmail = ? AND vtPw = ?";

  global.connection.query(query, [email, password], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

    if (result.length > 0) {
      const user = result[0];
      const vtToken = jwt.sign({ email: user.email }, SECRET_KEY, {
        expiresIn: "1m",
      });
      res.json({
        success: true,
        vtEmail: user.vtEmail,
        vtName: user.vtName,
        districtID: user.districtID,
        vtBuilding: user.vtBuilding,
        vtToken,
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

module.exports = router;
