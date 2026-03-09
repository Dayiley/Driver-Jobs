const express = require("express");
const router = express.Router();

const userOnly = require("../middleware/userOnly");

const {
  listProfiles,
  newProfileShow,
  createProfile,
  editProfileShow,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

router.get("/", listProfiles);
router.get("/new", userOnly, newProfileShow);
router.post("/", userOnly, createProfile);

router.get("/:id/edit", userOnly, editProfileShow);
router.post("/:id/update", userOnly, updateProfile);
router.post("/:id/delete", userOnly, deleteProfile);

module.exports = router;
