module.exports = (req, res, next) => {
  // if not authenticated, redirect to login page
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login')
  }
  next()
}