const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Post = require('./Post');
const Commentaire = require('./Commentaire');
const Like = require('./Like');
const Follow = require('./Follow');
const Notification = require('./Notification');
const CommentaireLike = require('./CommentaireLike');
const Dislike = require('./Dislike');

Utilisateur.hasMany(Post, { foreignKey: 'utilisateur_id' });
Post.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Post.hasMany(Commentaire, { foreignKey: 'post_id' });
Commentaire.belongsTo(Post, { foreignKey: 'post_id' });

Utilisateur.hasMany(Commentaire, { foreignKey: 'utilisateur_id' });
Commentaire.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Commentaire.belongsTo(Commentaire, { as: 'ParentCommentaire', foreignKey: 'parent_id' });
Commentaire.hasMany(Commentaire, { as: 'Reponses', foreignKey: 'parent_id' });

Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });
Utilisateur.hasMany(Like, { foreignKey: 'utilisateur_id' });
Like.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// Dislikes
Post.hasMany(Dislike, { foreignKey: 'post_id' });
Dislike.belongsTo(Post, { foreignKey: 'post_id' });
Utilisateur.hasMany(Dislike, { foreignKey: 'utilisateur_id' });
Dislike.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Commentaire.hasMany(CommentaireLike, { foreignKey: 'commentaire_id' });
CommentaireLike.belongsTo(Commentaire, { foreignKey: 'commentaire_id' });
Utilisateur.hasMany(CommentaireLike, { foreignKey: 'utilisateur_id' });
CommentaireLike.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Follow.belongsTo(Utilisateur, { as: 'Follower', foreignKey: 'follower_id' });
Follow.belongsTo(Utilisateur, { as: 'Following', foreignKey: 'following_id' });
Utilisateur.hasMany(Follow, { as: 'Abonnements', foreignKey: 'follower_id' });
Utilisateur.hasMany(Follow, { as: 'Abonnes', foreignKey: 'following_id' });

Notification.belongsTo(Utilisateur, { as: 'Destinataire', foreignKey: 'destinataire_id' });
Notification.belongsTo(Utilisateur, { as: 'Source', foreignKey: 'source_id' });
Notification.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = {
  sequelize,
  Utilisateur,
  Post,
  Commentaire,
  Like,
  Follow,
  Notification,
  CommentaireLike,
  Dislike
};