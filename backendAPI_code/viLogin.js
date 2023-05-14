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
  const query =
    "SELECT * FROM VisuallyImpairedUser WHERE viEmail = ? AND viPw = ?";

  global.connection.query(query, [email, password], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

    if (result.length > 0) {
      const user = result[0];
      const viToken = jwt.sign({ email: user.email }, SECRET_KEY, {
        expiresIn: "1m",
      });
      res.json({
        success: true,
        viEmail: user.viEmail,
        //  vtEmail = vtEmail.replace(/^"|"$/g, "");
        viName: user.viName,
        districtID: user.districtID,
        viBuilding: user.viBuilding,
        viToken,
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

module.exports = router;
