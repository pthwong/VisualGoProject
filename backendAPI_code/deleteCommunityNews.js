const express = require("express");
const router = express.Router();

router.delete("/:postID", async (req, res) => {
  const postID = req.params.postID;

  const query = `
    DELETE FROM \`News\` WHERE \`postID\` = ?
`;
  //DELETE FROM `News` WHERE `postID` = 76

  global.connection.query(query, [postID], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error", err });
      return;
    }
    res.status(201).json({
      success: true,
      message: "Community news deleted successfully",
    });
  });
});

module.exports = router;
