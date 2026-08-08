const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'utilisateurs',
  timestamps: true,
  createdAt: 'date_creation',
  updatedAt: false
});

module.exports = Utilisateur;