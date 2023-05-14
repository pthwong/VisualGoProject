const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let {
    productBarcode,
    productBrand,
    productName,
    productCountry,
    productUnit,
    tagName,
    productDesc,
    // vtEmail,
  } = req.body;

  console.log("Request body:", req.body);

  // vtEmail = vtEmail.replace(/^"|"$/g, "");

  const query = `
    INSERT INTO \`Product\` (\`productBarcode\`, \`productBrand\`, \`productName\`, \`productCountry\`, \`productUnit\`, \`tagName\`, \`productDesc\`) VALUES (?,?,?,?,?,?,?)
  `;
  //INSERT INTO \`Product\` (\`productBarcode\`, \`productBrand\`, \`productName\`, \`productCountry\`, \`productUnit\`, \`tagName\`, \`productDesc\`) VALUES (?,?,?,?,?,?,?)

  global.connection.query(
    query,
    [
      productBarcode,
      productBrand,
      productName,
      productCountry,
      productUnit,
      tagName,
      productDesc,

      // vtEmail,
    ],
    (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error", err });
        return;
      }
      res.status(201).json({
        success: true,
        message: "Product info created successfully",
      });
    }
  );
});

module.exports = router;
