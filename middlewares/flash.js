function flash(req, res, next) {
  res.locals.message = req.session.flashMessage || null;
  req.session.flashMessage = null;
  next();
}

module.exports = flash;