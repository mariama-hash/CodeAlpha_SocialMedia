const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'date_creation',
  updatedAt: false
});

module.exports = Post;