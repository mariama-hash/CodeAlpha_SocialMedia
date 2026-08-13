const { Post, Utilisateur, Commentaire, Like, Dislike, Follow, Notification } = require('../models');

// Fil d'actualité — tous les posts, plus récents en premier
exports.fil = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Utilisateur },
        { model: Like },
        { model: Dislike },
        { model: Commentaire }
      ],
      order: [['id', 'DESC']]
    });

    const utilisateurId = req.session.utilisateur.id;

    const mesAbonnements = await Follow.findAll({ where: { follower_id: utilisateurId } });
    const suivisIds = mesAbonnements.map(f => f.following_id);

    const postsAvecLike = posts.map(post => {
      const aLike = post.Likes.some(like => like.utilisateur_id === utilisateurId);
      const aDislike = post.Dislikes.some(d => d.utilisateur_id === utilisateurId);
      const estSuivi = suivisIds.includes(post.utilisateur_id);
      return { ...post.toJSON(), aLike, aDislike, estSuivi };
    });

    res.render('posts/fil', {
      posts: postsAvecLike,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Crée un nouveau post
exports.creerPost = async (req, res) => {
  try {
    const { contenu } = req.body;
    const utilisateur_id = req.session.utilisateur.id;

    if (!contenu || contenu.trim() === '') {
      return res.redirect('/');
    }

    const donnees = { utilisateur_id, contenu };
    if (req.file) {
      donnees.image = '/uploads/posts/' + req.file.filename;
    }

    const nouveauPost = await Post.create(donnees);

    // Notifie tous les abonnés de cet utilisateur
    const abonnes = await Follow.findAll({ where: { following_id: utilisateur_id } });
    for (const abonne of abonnes) {
      await Notification.create({
        destinataire_id: abonne.follower_id,
        source_id: utilisateur_id,
        type: 'nouveau_post',
        post_id: nouveauPost.id
      });
    }

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};
// Supprime un post (uniquement son propre post)
exports.supprimerPost = async (req, res) => {
  try {
    await Post.destroy({
      where: { id: req.params.id, utilisateur_id: req.session.utilisateur.id }
    });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};