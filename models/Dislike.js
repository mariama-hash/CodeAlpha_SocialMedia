const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dislike = sequelize.define('Dislike', {
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
  }
}, {
  tableName: 'dislikes',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['post_id', 'utilisateur_id'] }
  ]
});

module.exports = Dislike;