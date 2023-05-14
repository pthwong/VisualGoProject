const { utcToZonedTime, format } = require("date-fns-tz");
const express = require("express");
const router = express.Router();
const timeZone = "Asia/Shanghai";

function convertToTimeZoneAndFormat(dateString, timeZone) {
  const date = new Date(dateString);
  const zonedDate = utcToZonedTime(date, timeZone);
  const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone });

  return formattedDate;
}

function toMySQLDateTimeWithOffset(isoString, offsetInHours) {
  const date = new Date(isoString);
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  const targetOffset = offsetInHours * 60 * 60 * 1000;
  const dateWithOffset = new Date(
    date.getTime() + timezoneOffset + targetOffset
  );

  return dateWithOffset.toISOString().slice(0, 19).replace("T", " ");
}

router.post("/", async (req, res) => {
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
    INSERT INTO \`News\` (\`postTitle\`, \`postDescribe\`, \`postStartDateTime\`, \`postEndDateTime\`, \`postBuilding\`, \`districtID\`, \`vtEmail\`)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  console.log("Start: ", postStartDateTime, "\nEnd: ", postEndDateTime);

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
        message: "Community news created successfully",
        // postID: results.postID,
      });
    }
  );
});

module.exports = router;
