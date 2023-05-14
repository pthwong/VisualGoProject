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
  } = req.body;

  console.log("Request body:", req.body);

  const query = `
    UPDATE \`Nutrition\` SET \`ingredients\` = ?, \`servings\` = ?,\`energy\` = ?,\`energy_kcal\` = ?,\`fat\` = ?, \`saturated_fat\` = ?,\`trans_fat\` = ?,\`cholesterol\` = ?,\`carbohydrates\` = ?,\`sugars\` = ?,\`fiber\` = ?,\`proteins\` = ?,\`sodium\` = ?,\`vitamin_a\` = ?,\`vitamin_c\` = ?,\`calcium\` = ?,\`iron\` = ? WHERE \`productBarcode\` = ?
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
