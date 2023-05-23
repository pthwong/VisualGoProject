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

router.put("/:productBarcode", async (req, res) => {
  const productBarcode = req.params.productBarcode;
  let {
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
    UPDATE \`Product\` SET \`productBrand\` = ?, \`productName\` = ?,\`productCountry\` = ?,\`productUnit\` = ?,\`tagName\` = ?, \`productDesc\` = ?, \`bestBefore\` = ?, \`eatBefore\` = ?, \`useBefore\` = ?,\`vtEmail\` = ? WHERE \`productBarcode\` = ?
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
      bestBefore,
      eatBefore,
      useBefore,
      vtEmail,
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
        message: "Product info updated successfully",
      });
    }
  );
});

module.exports = router;
