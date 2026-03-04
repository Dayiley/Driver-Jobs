const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "Admin access only.");
    return res.redirect("/");
  }
  next();
};

module.exports = adminOnly;
