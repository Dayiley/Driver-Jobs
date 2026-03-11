const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only WEBP images are allowed."));
};

const uploadJobImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 },
});

module.exports = uploadJobImage;
