const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Commentaire = sequelize.define('Commentaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'commentaires',
  timestamps: true,
  createdAt: 'date_creation',
  updatedAt: false
});

module.exports = Commentaire;