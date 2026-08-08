const { Utilisateur, Post, Follow, Like, Commentaire } = require('../models');

// Affiche le profil d'un utilisateur
exports.voirProfil = async (req, res) => {
  try {
    const profilId = parseInt(req.params.id);
    const utilisateurConnecteId = req.session.utilisateur.id;

    const profil = await Utilisateur.findByPk(profilId);
    if (!profil) return res.status(404).send('Utilisateur introuvable');

    const posts = await Post.findAll({
      where: { utilisateur_id: profilId },
      include: [{ model: Like }, { model: Commentaire }],
      order: [['id', 'DESC']]
    });

    const nbAbonnes = await Follow.count({ where: { following_id: profilId } });
    const nbAbonnements = await Follow.count({ where: { follower_id: profilId } });

    const suisDejaAbonne = await Follow.findOne({
      where: { follower_id: utilisateurConnecteId, following_id: profilId }
    });

    res.render('profil/voir', {
      profil,
      posts,
      nbAbonnes,
      nbAbonnements,
      suisDejaAbonne: !!suisDejaAbonne,
      estMonProfil: profilId === utilisateurConnecteId,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Follow / unfollow (toggle)
exports.toggleFollow = async (req, res) => {
  try {
    const following_id = parseInt(req.params.id);
    const follower_id = req.session.utilisateur.id;

    if (following_id === follower_id) {
      return res.redirect(`/profil/${following_id}`);
    }

    const relationExistante = await Follow.findOne({ where: { follower_id, following_id } });

    if (relationExistante) {
      await relationExistante.destroy();
    } else {
      await Follow.create({ follower_id, following_id });
    }

    res.redirect(`/profil/${following_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Formulaire de modification du profil
exports.formulaireModifier = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.session.utilisateur.id);
    res.render('profil/modifier', { utilisateur, erreur: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Modifie le profil (nom + bio)
exports.modifierProfil = async (req, res) => {
  try {
    const { nom, bio } = req.body;
    const utilisateur = await Utilisateur.findByPk(req.session.utilisateur.id);

    const donneesAMettreAJour = { nom, bio };
    if (req.file) {
      donneesAMettreAJour.avatar = '/uploads/avatars/' + req.file.filename;
    }

    await utilisateur.update(donneesAMettreAJour);

    req.session.utilisateur.nom = nom;
    req.session.utilisateur.avatar = utilisateur.avatar;
    res.redirect(`/profil/${utilisateur.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};