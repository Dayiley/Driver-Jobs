const Profile = require("../models/Profile");
const parseValidationErrors = require("../utils/parseValidationErrors");

const listProfiles = async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { createdBy: req.user._id };

    const profiles = await Profile.find(query).sort({ createdAt: -1 });
    res.render("profiles/list", { profiles });
  } catch (e) {
    next(e);
  }
};

const newProfileShow = (req, res) => {
  res.render("profiles/form", {
    mode: "create",
    profile: {
      fullName: "",
      positionType: "driver",
      yearsExperience: 0,
      state: "",
      availableFrom: "",
    },
  });
};

const createProfile = async (req, res, next) => {
  try {
    const { fullName, positionType, yearsExperience, state, availableFrom } =
      req.body;

    await Profile.create({
      fullName,
      positionType,
      yearsExperience,
      state,
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      createdBy: req.user._id,
    });

    req.flash("info", "Profile created.");
    res.redirect("/profiles");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseValidationErrors(e, req);
      return res.render("profiles/form", {
        mode: "create",
        profile: req.body,
      });
    }
    next(e);
  }
};

const editProfileShow = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      req.flash("error", "Profile not found.");
      return res.redirect("/profiles");
    }

    const availableFrom = profile.availableFrom
      ? new Date(profile.availableFrom).toISOString().slice(0, 10)
      : "";

    res.render("profiles/form", {
      mode: "edit",
      profile: {
        ...profile.toObject(),
        availableFrom,
      },
    });
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, positionType, yearsExperience, state, availableFrom } =
      req.body;

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      {
        fullName,
        positionType,
        yearsExperience,
        state,
        availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      req.flash("error", "Profile not found.");
      return res.redirect("/profiles");
    }

    req.flash("info", "Profile updated.");
    res.redirect("/profiles");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseValidationErrors(e, req);
      return res.render("profiles/form", {
        mode: "edit",
        profile: { ...req.body, _id: req.params.id },
      });
    }
    next(e);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      req.flash("error", "Profile not found.");
      return res.redirect("/profiles");
    }

    req.flash("info", "Profile deleted.");
    res.redirect("/profiles");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listProfiles,
  newProfileShow,
  createProfile,
  editProfileShow,
  updateProfile,
  deleteProfile,
};
