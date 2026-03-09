const express = require("express");
const router = express.Router();

const adminOnly = require("../middleware/adminOnly");
const uploadJobImage = require("../middleware/uploadJobImage");
const csrfProtection = require("../middleware/csrfProtection");

const {
  listJobs,
  newJobShow,
  createJob,
  editJobShow,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// todos logueados
router.get("/", listJobs);

// solo admin
router.get("/new", adminOnly, newJobShow);
router.post(
  "/",
  adminOnly,
  uploadJobImage.single("image"),
  csrfProtection,
  createJob
);

router.get("/:id/edit", adminOnly, editJobShow);
router.post(
  "/:id/update",
  adminOnly,
  uploadJobImage.single("image"),
  csrfProtection,
  updateJob
);

router.post("/:id/delete", adminOnly, deleteJob);

module.exports = router;