const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommentaireLike = sequelize.define('CommentaireLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  commentaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'commentaire_likes',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['commentaire_id', 'utilisateur_id'] }
  ]
});

module.exports = CommentaireLike;