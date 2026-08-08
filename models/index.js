const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Post = require('./Post');
const Commentaire = require('./Commentaire');
const Like = require('./Like');
const Follow = require('./Follow');

// Un utilisateur a plusieurs posts
Utilisateur.hasMany(Post, { foreignKey: 'utilisateur_id' });
Post.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// Un post a plusieurs commentaires
Post.hasMany(Commentaire, { foreignKey: 'post_id' });
Commentaire.belongsTo(Post, { foreignKey: 'post_id' });

// Un utilisateur a plusieurs commentaires
Utilisateur.hasMany(Commentaire, { foreignKey: 'utilisateur_id' });
Commentaire.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// Un post a plusieurs likes
Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

// Un utilisateur a plusieurs likes
Utilisateur.hasMany(Like, { foreignKey: 'utilisateur_id' });
Like.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// Follow : relations multiples vers Utilisateur
Follow.belongsTo(Utilisateur, { as: 'Follower', foreignKey: 'follower_id' });
Follow.belongsTo(Utilisateur, { as: 'Following', foreignKey: 'following_id' });
Utilisateur.hasMany(Follow, { as: 'Abonnements', foreignKey: 'follower_id' });
Utilisateur.hasMany(Follow, { as: 'Abonnes', foreignKey: 'following_id' });

module.exports = {
  sequelize,
  Utilisateur,
  Post,
  Commentaire,
  Like,
  Follow
};