const express = require("express");
const router = express.Router();

router.get("*", (req, res) => res.render("route404"));

module.exports = router;