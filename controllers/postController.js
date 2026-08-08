const { Post, Utilisateur, Commentaire, Like } = require('../models');

// Fil d'actualité — tous les posts, plus récents en premier
exports.fil = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Utilisateur },
        { model: Like },
        { model: Commentaire }
      ],
      order: [['id', 'DESC']]
    });

    const utilisateurId = req.session.utilisateur.id;

    // Ajoute un indicateur "j'ai liké" pour chaque post, utile côté vue
    const postsAvecLike = posts.map(post => {
      const aLike = post.Likes.some(like => like.utilisateur_id === utilisateurId);
      return { ...post.toJSON(), aLike };
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

    await Post.create({ utilisateur_id, contenu });
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