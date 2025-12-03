const sequelize = require('../config/database');
const User = require('./User');
const Photo = require('./Photo');
const Album = require('./Album');

// Define associations
User.hasMany(Photo, {
  foreignKey: 'userId',
  as: 'photos',
  onDelete: 'CASCADE'
});

Photo.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Album, {
  foreignKey: 'userId',
  as: 'albums',
  onDelete: 'CASCADE'
});

Album.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Album.hasMany(Photo, {
  foreignKey: 'albumId',
  as: 'photos'
});

Photo.belongsTo(Album, {
  foreignKey: 'albumId',
  as: 'album'
});

Album.belongsTo(Photo, {
  foreignKey: 'coverPhotoId',
  as: 'coverPhoto'
});

module.exports = {
  sequelize,
  User,
  Photo,
  Album
};
