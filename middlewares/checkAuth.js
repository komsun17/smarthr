module.exports = (req, res, next) => {
  console.log('CheckAuth middleware - Session:', req.session.user ? 'exists' : 'not found');
  
  if (req.session && req.session.user && req.session.user.id) {
    console.log('User authenticated:', req.session.user.username);
    return next();
  }
  
  console.log('User not authenticated, redirecting to login');
  res.redirect('/login');
};
