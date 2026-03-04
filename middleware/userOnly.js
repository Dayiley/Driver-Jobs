const userOnly = (req, res, next) => {
    if (req.user?.role === "admin") {
      req.flash("error", "Admins can view profiles, but cannot edit them.");
      return res.redirect("/profiles");
    }
    next();
  };
  
  module.exports = userOnly;