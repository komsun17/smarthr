async function checkAuth(req, res, next) {
  try {
    if (req.session.user) next();
    else res.redirect("/login");
  } catch (err) {
    next(err);
  }
}

module.exports = checkAuth;
