const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  destinataire_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  source_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('like', 'commentaire', 'follow', 'reponse', 'like_commentaire', 'nouveau_post'),
    allowNull: false
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'date_creation',
  updatedAt: false
});

module.exports = Notification;