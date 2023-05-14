var express = require("express");
var router = express.Router();

router.get("/:postID", function (req, res, next) {
  const postID = req.params.postID;
  console.log(postID);
  connection.query(
    "SELECT * FROM News WHERE postID = ?",
    [postID],
    (error, results) => {
      if (error) {
        res.send({ status: 500, error: error, response: null });
      } else {
        // const result = results[0];
        // Adjusting the start and end datetime to GMT+8
        console.log(results);
        var startDateTime = new Date(results[0].postStartDateTime);
        var endDateTime = new Date(results[0].postEndDateTime);
        startDateTime.setHours(startDateTime.getHours());
        endDateTime.setHours(endDateTime.getHours());
        results[0].postStartDateTime = startDateTime.toISOString();
        results[0].postEndDateTime = endDateTime.toISOString();

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
