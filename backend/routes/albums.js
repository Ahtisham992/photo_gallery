const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Album, Photo, User } = require('../models');
const auth = require('../middleware/auth');

// Get all albums (public or user's own)
router.get('/', auth, async (req, res) => {
  try {
    const { userId } = req.query;

    const where = {};
    
    if (userId) {
      where.userId = userId;
      if (parseInt(userId) !== req.user.id) {
        where.isPublic = true;
      }
    } else {
      where[require('sequelize').Op.or] = [
        { isPublic: true },
        { userId: req.user.id }
      ];
    }

    const albums = await Album.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Photo,
          as: 'coverPhoto',
          attributes: ['id', 'filename', 'filepath']
        },
        {
          model: Photo,
          as: 'photos',
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Add photo count to each album
    const albumsWithCount = albums.map(album => {
      const albumData = album.toJSON();
      albumData.photoCount = albumData.photos ? albumData.photos.length : 0;
      delete albumData.photos; // Remove photos array, keep only count
      return albumData;
    });

    res.json({ albums: albumsWithCount });
  } catch (error) {
    console.error('Get albums error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single album with photos
router.get('/:id', auth, async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Photo,
          as: 'photos',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'fullName']
          }]
        },
        {
          model: Photo,
          as: 'coverPhoto',
          attributes: ['id', 'filename', 'filepath']
        }
      ]
    });

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Check access
    if (!album.isPublic && album.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ album });
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create album
router.post('/', auth, [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('eventDate').optional().isISO8601(),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, location, eventDate, isPublic } = req.body;

    const album = await Album.create({
      name,
      description,
      location,
      eventDate,
      isPublic: isPublic !== undefined ? isPublic : true,
      userId: req.user.id
    });

    const albumWithUser = await Album.findByPk(album.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'fullName']
      }]
    });

    res.status(201).json({
      message: 'Album created successfully',
      album: albumWithUser
    });
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update album
router.put('/:id', auth, [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('eventDate').optional().isISO8601(),
  body('isPublic').optional().isBoolean(),
  body('coverPhotoId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const album = await Album.findByPk(req.params.id);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (album.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, description, location, eventDate, isPublic, coverPhotoId } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (location !== undefined) updates.location = location;
    if (eventDate !== undefined) updates.eventDate = eventDate;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (coverPhotoId !== undefined) {
      // Verify photo belongs to this album
      const photo = await Photo.findByPk(coverPhotoId);
      if (photo && photo.albumId === album.id) {
        updates.coverPhotoId = coverPhotoId;
      }
    }

    await album.update(updates);

    const updatedAlbum = await Album.findByPk(album.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Photo,
          as: 'coverPhoto',
          attributes: ['id', 'filename', 'filepath']
        }
      ]
    });

    res.json({
      message: 'Album updated successfully',
      album: updatedAlbum
    });
  } catch (error) {
    console.error('Update album error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete album
router.delete('/:id', auth, async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (album.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove album reference from photos (don't delete photos)
    await Photo.update(
      { albumId: null },
      { where: { albumId: album.id } }
    );

    await album.destroy();

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Delete album error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add photo to album
router.post('/:id/photos/:photoId', auth, async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    const photo = await Photo.findByPk(req.params.photoId);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (album.userId !== req.user.id || photo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await photo.update({ albumId: album.id });

    res.json({ message: 'Photo added to album successfully' });
  } catch (error) {
    console.error('Add photo to album error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove photo from album
router.delete('/:id/photos/:photoId', auth, async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    const photo = await Photo.findByPk(req.params.photoId);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (album.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await photo.update({ albumId: null });

    res.json({ message: 'Photo removed from album successfully' });
  } catch (error) {
    console.error('Remove photo from album error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
