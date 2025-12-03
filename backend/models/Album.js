const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  coverPhotoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'photos',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'albums',
  timestamps: true
});

module.exports = Album;
