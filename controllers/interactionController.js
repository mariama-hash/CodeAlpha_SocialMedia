const { Like, Commentaire, Post } = require('../models');

// Like / unlike un post (toggle)
exports.toggleLike = async (req, res) => {
  try {
    const post_id = req.params.id;
    const utilisateur_id = req.session.utilisateur.id;

    const likeExistant = await Like.findOne({ where: { post_id, utilisateur_id } });

    if (likeExistant) {
      await likeExistant.destroy();
    } else {
      await Like.create({ post_id, utilisateur_id });
    }

    res.redirect(req.get('Referrer') || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Affiche un post avec ses commentaires
exports.voirPost = async (req, res) => {
  try {
    const { Utilisateur, Like: LikeModel } = require('../models');

    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: Utilisateur },
        { model: LikeModel },
        {
          model: Commentaire,
          include: [{ model: Utilisateur }],
          separate: true,
          order: [['id', 'ASC']]
        }
      ]
    });

    if (!post) return res.status(404).send('Post introuvable');

    const utilisateurId = req.session.utilisateur.id;
    const aLike = post.Likes.some(like => like.utilisateur_id === utilisateurId);

    res.render('posts/detail', {
      post,
      aLike,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Ajoute un commentaire
exports.ajouterCommentaire = async (req, res) => {
  try {
    const { contenu } = req.body;
    const post_id = req.params.id;
    const utilisateur_id = req.session.utilisateur.id;

    if (!contenu || contenu.trim() === '') {
      return res.redirect(`/posts/${post_id}`);
    }

    await Commentaire.create({ post_id, utilisateur_id, contenu });
    res.redirect(`/posts/${post_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};