const { Like, Commentaire, Post, CommentaireLike, Notification, Dislike } = require('../models');

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
      await Dislike.destroy({ where: { post_id, utilisateur_id } });

      const post = await Post.findByPk(post_id);
      if (post && post.utilisateur_id !== utilisateur_id) {
        await Notification.create({
          destinataire_id: post.utilisateur_id,
          source_id: utilisateur_id,
          type: 'like',
          post_id
        });
      }
    }

    res.redirect(req.get('Referrer') || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Affiche un post avec ses commentaires (et leurs réponses)
exports.voirPost = async (req, res) => {
  try {
    const { Utilisateur, Like: LikeModel } = require('../models');

    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: Utilisateur },
        { model: LikeModel },
        {
          model: Commentaire,
          where: { parent_id: null },
          required: false,
          include: [
            { model: Utilisateur },
            { model: CommentaireLike },
            {
              model: Commentaire,
              as: 'Reponses',
              include: [{ model: Utilisateur }, { model: CommentaireLike }],
              separate: true,
              order: [['id', 'ASC']]
            }
          ],
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
      utilisateurId,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Ajoute un commentaire (ou une réponse si parent_id est fourni)
exports.ajouterCommentaire = async (req, res) => {
  try {
    const { contenu, parent_id } = req.body;
    const post_id = req.params.id;
    const utilisateur_id = req.session.utilisateur.id;

    if (!contenu || contenu.trim() === '') {
      return res.redirect(`/posts/${post_id}`);
    }

    await Commentaire.create({
      post_id,
      utilisateur_id,
      contenu,
      parent_id: parent_id || null
    });

    if (parent_id) {
      // Notification au propriétaire du commentaire parent
      const commentaireParent = await Commentaire.findByPk(parent_id);
      if (commentaireParent && commentaireParent.utilisateur_id !== utilisateur_id) {
        await Notification.create({
          destinataire_id: commentaireParent.utilisateur_id,
          source_id: utilisateur_id,
          type: 'reponse',
          post_id
        });
      }
    } else {
      // Notification au propriétaire du post
      const post = await Post.findByPk(post_id);
      if (post && post.utilisateur_id !== utilisateur_id) {
        await Notification.create({
          destinataire_id: post.utilisateur_id,
          source_id: utilisateur_id,
          type: 'commentaire',
          post_id
        });
      }
    }

    res.redirect(`/posts/${post_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Supprime un commentaire (uniquement le sien)
exports.supprimerCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findOne({
      where: { id: req.params.id, utilisateur_id: req.session.utilisateur.id }
    });

    if (!commentaire) {
      return res.status(403).send('Action non autorisée');
    }

    const post_id = commentaire.post_id;
    await commentaire.destroy();

    res.redirect(`/posts/${post_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Like / unlike un commentaire (toggle)
exports.toggleLikeCommentaire = async (req, res) => {
  try {
    const commentaire_id = req.params.id;
    const utilisateur_id = req.session.utilisateur.id;

    const likeExistant = await CommentaireLike.findOne({ where: { commentaire_id, utilisateur_id } });

    if (likeExistant) {
      await likeExistant.destroy();
    } else {
      await CommentaireLike.create({ commentaire_id, utilisateur_id });

      const commentaire = await Commentaire.findByPk(commentaire_id);
      if (commentaire && commentaire.utilisateur_id !== utilisateur_id) {
        await Notification.create({
          destinataire_id: commentaire.utilisateur_id,
          source_id: utilisateur_id,
          type: 'like_commentaire',
          post_id: commentaire.post_id
        });
      }
    }

    res.redirect(req.get('Referrer') || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

// Dislike / retirer dislike sur un post (toggle) — retire aussi le like existant s'il y en a un
exports.toggleDislike = async (req, res) => {
  try {
    const post_id = req.params.id;
    const utilisateur_id = req.session.utilisateur.id;

    const dislikeExistant = await Dislike.findOne({ where: { post_id, utilisateur_id } });

    if (dislikeExistant) {
      await dislikeExistant.destroy();
    } else {
      await Dislike.create({ post_id, utilisateur_id });
      // Si l'utilisateur avait liké, on retire le like (comme sur la plupart des réseaux sociaux)
      await Like.destroy({ where: { post_id, utilisateur_id } });
    }

    res.redirect(req.get('Referrer') || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};