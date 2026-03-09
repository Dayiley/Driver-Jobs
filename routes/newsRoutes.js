const express = require("express");
const router = express.Router();
const { listNews, refreshNews } = require("../controllers/newsController");

router.get("/", listNews);
router.post("/refresh", refreshNews);

module.exports = router;
