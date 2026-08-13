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
    const { Notification } = require('../models');
    const following_id = parseInt(req.params.id);
    const follower_id = req.session.utilisateur.id;

    if (following_id === follower_id) {
      return res.redirect(`/profil/${following_id}`);
    }

    const cible = await Utilisateur.findByPk(following_id);
    const relationExistante = await Follow.findOne({ where: { follower_id, following_id } });

    if (relationExistante) {
      await relationExistante.destroy();
      req.session.flashMessage = `Vous ne suivez plus ${cible.nom}.`;
    } else {
      await Follow.create({ follower_id, following_id });
      await Notification.create({
        destinataire_id: following_id,
        source_id: follower_id,
        type: 'follow'
      });
      req.session.flashMessage = `Vous suivez maintenant ${cible.nom} !`;
    }

    res.redirect(req.get('Referrer') || `/profil/${following_id}`);
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

// Liste des abonnés d'un utilisateur
exports.voirAbonnes = async (req, res) => {
  try {
    const profilId = parseInt(req.params.id);
    const utilisateurConnecteId = req.session.utilisateur.id;
    const profil = await Utilisateur.findByPk(profilId);
    if (!profil) return res.status(404).send('Utilisateur introuvable');

    const relations = await Follow.findAll({
      where: { following_id: profilId },
      include: [{ model: Utilisateur, as: 'Follower' }]
    });

    const mesAbonnements = await Follow.findAll({ where: { follower_id: utilisateurConnecteId } });
    const suivisIds = mesAbonnements.map(f => f.following_id);

    const utilisateurs = relations.map(r => ({
      ...r.Follower.toJSON(),
      estSuivi: suivisIds.includes(r.Follower.id)
    }));

    res.render('profil/liste-utilisateurs', {
      titre: `Abonnés de ${profil.nom}`,
      utilisateurs,
      utilisateurConnecteId,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Liste des abonnements d'un utilisateur
exports.voirAbonnements = async (req, res) => {
  try {
    const profilId = parseInt(req.params.id);
    const utilisateurConnecteId = req.session.utilisateur.id;
    const profil = await Utilisateur.findByPk(profilId);
    if (!profil) return res.status(404).send('Utilisateur introuvable');

    const relations = await Follow.findAll({
      where: { follower_id: profilId },
      include: [{ model: Utilisateur, as: 'Following' }]
    });

    const mesAbonnements = await Follow.findAll({ where: { follower_id: utilisateurConnecteId } });
    const suivisIds = mesAbonnements.map(f => f.following_id);

    const utilisateurs = relations.map(r => ({
      ...r.Following.toJSON(),
      estSuivi: suivisIds.includes(r.Following.id)
    }));

    res.render('profil/liste-utilisateurs', {
      titre: `Abonnements de ${profil.nom}`,
      utilisateurs,
      utilisateurConnecteId,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};