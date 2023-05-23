const { utcToZonedTime, format } = require("date-fns-tz");
const express = require("express");
const router = express.Router();
const timeZone = "Asia/Hong_Kong";

function convertToTimeZoneAndFormat(dateString, timeZone) {
  const date = new Date(dateString);
  const zonedDate = utcToZonedTime(date, timeZone);
  const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone });

  return formattedDate;
}

router.put("/:postID", async (req, res) => {
  const postID = req.params.postID;
  let {
    postTitle,
    postDescribe,
    postStartDateTime,
    postEndDateTime,
    postBuilding,
    district,
    vtEmail,
  } = req.body;

  console.log("Request body:", req.body);

  postStartDateTime = convertToTimeZoneAndFormat(postStartDateTime, timeZone);
  postEndDateTime = convertToTimeZoneAndFormat(postEndDateTime, timeZone);

  vtEmail = vtEmail.replace(/^"|"$/g, "");

  const query = `
    UPDATE \`News\` SET \`postTitle\` = ?, \`postDescribe\` = ?,\`postStartDateTime\` = ?,\`postEndDateTime\` = ?,\`postBuilding\` = ?,\`districtID\` = ?,\`vtEmail\` = ? WHERE \`postID\` = ?
  `;

  console.log("Start: ", postStartDateTime, "\nEnd: ", postEndDateTime);
  console.log("building: ", postBuilding);

  global.connection.query(
    query,
    [
      postTitle,
      postDescribe,
      postStartDateTime,
      postEndDateTime,
      postBuilding,
      district,
      vtEmail,
      postID,
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
        message: "Community news updated successfully",
      });
    }
  );
});

module.exports = router;
