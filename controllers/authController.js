const bcrypt = require('bcrypt');
const { Utilisateur } = require('../models');

exports.formulaireInscription = (req, res) => {
  res.render('auth/inscription', { erreur: null });
};

exports.inscrire = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    const utilisateurExistant = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExistant) {
      return res.render('auth/inscription', { erreur: 'Cet email est déjà utilisé.' });
    }

    const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      email,
      mot_de_passe: mot_de_passe_hash
    });

    req.session.utilisateur = {
      id: nouvelUtilisateur.id,
      nom: nouvelUtilisateur.nom
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/inscription', { erreur: 'Une erreur est survenue.' });
  }
};

exports.formulaireConnexion = (req, res) => {
  res.render('auth/connexion', { erreur: null });
};

exports.connecter = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.render('auth/connexion', { erreur: 'Email ou mot de passe incorrect.' });
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!motDePasseValide) {
      return res.render('auth/connexion', { erreur: 'Email ou mot de passe incorrect.' });
    }

    req.session.utilisateur = {
      id: utilisateur.id,
      nom: utilisateur.nom
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/connexion', { erreur: 'Une erreur est survenue.' });
  }
};

exports.deconnecter = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};