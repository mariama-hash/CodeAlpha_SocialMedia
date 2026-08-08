function estConnecte(req, res, next) {
  if (req.session.utilisateur) {
    return next();
  }
  res.redirect('/auth/connexion');
}

module.exports = { estConnecte };