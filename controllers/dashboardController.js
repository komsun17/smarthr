exports.getDashboard = async (req, res, next) => {
  try {
    res.render("dashboard", { title: "Dashboard", user: req.session.user });
  } catch (err) {
    next(err);
  }
};
