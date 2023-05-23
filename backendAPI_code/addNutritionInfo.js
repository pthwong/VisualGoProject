const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let {
    productBarcode,
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
    INSERT INTO \`Nutrition\` (\`productBarcode\`, \`ingredients\`, \`servings\`, \`energy\`, \`energy_kcal\`, \`fat\`, \`saturated_fat\`, \`trans_fat\`, \`cholesterol\`, \`carbohydrates\`, \`sugars\`, \`proteins\`, \`fiber\`, \`sodium\`, \`vitamin_a\`, \`vitamin_c\`, \`calcium\`, \`iron\`, \`vtEmail\`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  global.connection.query(
    query,
    [
      productBarcode,
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
        message: "Nutrition info created successfully",
      });
    }
  );
});

module.exports = router;
