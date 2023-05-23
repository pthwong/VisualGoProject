const express = require("express");
const router = express.Router();

router.put("/:productBarcode", async (req, res) => {
  const productBarcode = req.params.productBarcode;
  let {
    ingredients,
    servings,
    energy,
    energy_kcal,
    fat,
    saturated_fat,
    trans_fat,
    cholesterol,
    carbohydrates,
    sugars,
    fiber,
    proteins,
    sodium,
    vitamin_a,
    vitamin_c,
    calcium,
    iron,
    vtEmail,
  } = req.body;

  console.log("Request body:", req.body);

  vtEmail = vtEmail.replace(/^"|"$/g, "");

  const query = `
    UPDATE \`Nutrition\` SET \`ingredients\` = ?, \`servings\` = ?,\`energy\` = ?,\`energy_kcal\` = ?,\`fat\` = ?, \`saturated_fat\` = ?,\`trans_fat\` = ?,\`cholesterol\` = ?,\`carbohydrates\` = ?,\`sugars\` = ?,\`fiber\` = ?,\`proteins\` = ?,\`sodium\` = ?,\`vitamin_a\` = ?,\`vitamin_c\` = ?,\`calcium\` = ?,\`iron\` = ?,\`vtEmail\` = ? WHERE \`productBarcode\` = ?
  `;

  global.connection.query(
    query,
    [
      ingredients,
      servings,
      energy,
      energy_kcal,
      fat,
      saturated_fat,
      trans_fat,
      cholesterol,
      carbohydrates,
      sugars,
      fiber,
      proteins,
      sodium,
      vitamin_a,
      vitamin_c,
      calcium,
      iron,
      productBarcode,
      vtEmail,
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
        message: "Nutrition info updated successfully",
      });
    }
  );
});

module.exports = router;
