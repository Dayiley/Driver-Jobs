const Job = require("../models/Job");
const parseValidationErrors = require("../utils/parseValidationErrors");

const listJobs = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();

    const filter = {};

    if (q) {
      filter.$or = [
        { companyName: { $regex: q, $options: "i" } },
        { positionTitle: { $regex: q, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.render("jobs/list", {
      jobs,
      q,
    });

  } catch (e) {
    next(e);
  }
};

const newJobShow = (req, res) => {
  res.render("jobs/form", {
    mode: "create",
    job: { companyName: "", positionTitle: "", detailsUrl: "", imageUrl: "" },
  });
};

const createJob = async (req, res, next) => {
    try {
      const { companyName, positionTitle, detailsUrl, imageUrl } = req.body;
  
      const trimmedUrl = (imageUrl || "").trim();
  
      // Si NO hay archivo y NO hay URL => error
      if (!req.file && !trimmedUrl) {
        req.flash("error", "Please provide an image URL or upload a WEBP image.");
        return res.render("jobs/form", {
          mode: "create",
          job: { companyName, positionTitle, detailsUrl, imageUrl: trimmedUrl },
        });
      }
  
      await Job.create({
        companyName,
        positionTitle,
        detailsUrl,
        imageUrl: trimmedUrl || undefined,
        imageFile: req.file ? req.file.filename : undefined,
        createdBy: req.user._id,
      });
  
      req.flash("info", "Job created.");
      res.redirect("/jobs");
    } catch (e) {
      if (e.name === "ValidationError") {
        parseValidationErrors(e, req);
        return res.render("jobs/form", { mode: "create", job: req.body });
      }
      next(e);
    }
  };

const editJobShow = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }
    res.render("jobs/form", { mode: "edit", job });
  } catch (e) {
    next(e);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { companyName, positionTitle, detailsUrl, imageUrl } = req.body;
    const trimmedUrl = (imageUrl || "").trim();

    const update = { companyName, positionTitle, detailsUrl };

    // Prioridad: si sube archivo, usamos archivo
    if (req.file) {
      update.imageFile = req.file.filename;
      update.imageUrl = undefined; // opcional: limpiar URL si ahora hay archivo
    } else {
      // si no hay archivo, permitimos URL (o limpiar si viene vacía)
      update.imageUrl = trimmedUrl || undefined;
      // y NO tocamos imageFile para no perder el anterior
    }

    // Regla: no permitir que quede sin imagen si el job no tenía ninguna
    const existing = await Job.findById(req.params.id);
    if (!existing) {
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }

    const willHaveFile = req.file ? true : !!existing.imageFile;
    const willHaveUrl = req.file ? false : !!trimmedUrl; // si sube archivo, URL se limpia arriba
    if (!willHaveFile && !willHaveUrl) {
      req.flash("error", "Please keep an image URL or upload a WEBP image.");
      return res.render("jobs/form", {
        mode: "edit",
        job: { ...existing.toObject(), ...req.body, _id: existing._id },
      });
    }

    await Job.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    req.flash("info", "Job updated.");
    res.redirect("/jobs");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseValidationErrors(e, req);
      return res.render("jobs/form", {
        mode: "edit",
        job: { ...req.body, _id: req.params.id },
      });
    }
    next(e);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }
    req.flash("info", "Job deleted.");
    res.redirect("/jobs");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listJobs,
  newJobShow,
  createJob,
  editJobShow,
  updateJob,
  deleteJob,
};