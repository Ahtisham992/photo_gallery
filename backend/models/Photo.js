const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  filepath: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  filesize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimetype: {
    type: DataTypes.STRING(50),
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
  tags: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  albumId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'albums',
      key: 'id'
    },
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'photos',
  timestamps: true
});

module.exports = Photo;
