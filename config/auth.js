module.exports = (req, res, next) => {
  // if not authenticated, redirect to login page
  if (!req.isAuthenticated()) {
    req.flash('reminder', '尚未登入，請先登入')
    return res.redirect('/users/login')
  }
  next()
}