const { utcToZonedTime, format } = require("date-fns-tz");
const express = require("express");
const router = express.Router();
const timeZone = "Asia/Hong_Kong";

function convertToTimeZoneAndFormat(dateString, timeZone) {
  if (dateString === null) {
    return null;
  }
  const date = new Date(dateString);
  const zonedDate = utcToZonedTime(date, timeZone);
  const formattedDate = format(zonedDate, "yyyy-MM-dd", { timeZone });

  return formattedDate;
}

router.post("/", async (req, res) => {
  let {
    productBarcode,
    productBrand,
    productName,
    productCountry,
    productUnit,
    tagName,
    bestBefore,
    eatBefore,
    useBefore,
    productDesc,
    vtEmail,
  } = req.body;

  console.log("Request body:", req.body);

  vtEmail = vtEmail.replace(/^"|"$/g, "");

  bestBefore = convertToTimeZoneAndFormat(bestBefore, timeZone);
  eatBefore = convertToTimeZoneAndFormat(eatBefore, timeZone);
  useBefore = convertToTimeZoneAndFormat(useBefore, timeZone);

  const query = `
    INSERT INTO \`Product\` (\`productBarcode\`, \`productBrand\`, \`productName\`, \`productCountry\`, \`productUnit\`, \`tagName\`, \`bestBefore\`,\`eatBefore\`,\`useBefore\`,\`productDesc\`,\`vtEmail\`) VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `;

  global.connection.query(
    query,
    [
      productBarcode,
      productBrand,
      productName,
      productCountry,
      productUnit,
      tagName,
      bestBefore,
      eatBefore,
      useBefore,
      productDesc,
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
        message: "Product info created successfully",
      });
    }
  );
});

module.exports = router;
