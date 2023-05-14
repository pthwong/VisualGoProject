const express = require("express");
const router = express.Router();

router.put("/:productBarcode", async (req, res) => {
  const productBarcode = req.params.productBarcode;
  let {
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
    UPDATE \`Product\` SET \`productBrand\` = ?, \`productName\` = ?,\`productCountry\` = ?,\`productUnit\` = ?,\`tagName\` = ?, \`productDesc\` = ? WHERE \`productBarcode\` = ?
  `;

  global.connection.query(
    query,
    [
      productBrand,
      productName,
      productCountry,
      productUnit,
      tagName,
      productDesc,
      productBarcode,
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
        message: "Product info updated successfully",
      });
    }
  );
});

module.exports = router;
