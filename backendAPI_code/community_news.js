var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  connection.query("SELECT * FROM News", function (error, results, fields) {
    if (error) {
      res.send({ status: 500, error: error, response: null });
    } else {
      // Adjusting the start and end datetime to GMT+8
      results.forEach(function (result) {
        var startDateTime = new Date(result.postStartDateTime);
        var endDateTime = new Date(result.postEndDateTime);
        startDateTime.setHours(startDateTime.getHours());
        endDateTime.setHours(endDateTime.getHours());
        result.postStartDateTime = startDateTime.toISOString();
      });

      res.send({
        status: 200,
        error: null,
        response: results,
      });
    }
  });
});

module.exports = router;
