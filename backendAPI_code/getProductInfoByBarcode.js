var express = require("express");
var router = express.Router();

router.get("/:productBarcode", function (req, res, next) {
  const productBarcode = req.params.productBarcode;
  console.log(productBarcode);
  connection.query(
    "SELECT * FROM Product WHERE productBarcode = ?",
    [productBarcode],
    (error, results) => {
      if (error) {
        res.send({ status: 500, error: error, response: null });
      } else {
        console.log(results);

        res.send({
          status: 200,
          error: null,
          response: results[0],
        });
      }
    }
  );
});

module.exports = router;
