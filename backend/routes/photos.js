const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Photo, User, Album } = require('../models');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Get all photos (public or user's own)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, userId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    // If userId is specified, get that user's photos, otherwise get all public photos
    if (userId) {
      where.userId = userId;
      // Only show private photos if it's the current user is logined
      if (parseInt(userId) !== req.user.id) {
        where.isPublic = true;
      }
    } else {
      // Show all public photos plus current user's private photos 
      where[require('sequelize').Op.or] = [
        { isPublic: true },
        { userId: req.user.id }
      ];
    }

    if (search) {
      where[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } },
        { tags: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: photos } = await Photo.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      photos,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single photo
router.get('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Check if user has access to this photo
    if (!photo.isPublic && photo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ photo });
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload photo
router.post('/', auth, upload.single('photo'), [
  body('title').trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim(),
  body('tags').optional().trim(),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Photo file is required' });
    }

    const { title, description, tags, isPublic, albumId } = req.body;

    const photo = await Photo.create({
      title,
      description,
      filename: req.file.filename,
      filepath: req.file.path,
      filesize: req.file.size,
      mimetype: req.file.mimetype,
      userId: req.user.id,
      tags,
      isPublic: isPublic !== undefined ? isPublic : true,
      albumId: albumId || null
    });

    const photoWithUser = await Photo.findByPk(photo.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: photoWithUser
    });
  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Update photo
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim(),
  body('tags').optional().trim(),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const photo = await Photo.findByPk(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Check ownership
    if (photo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, tags, isPublic } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (tags !== undefined) updates.tags = tags;
    if (isPublic !== undefined) updates.isPublic = isPublic;

    await photo.update(updates);

    const updatedPhoto = await Photo.findByPk(photo.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'fullName']
      }]
    });

    res.json({
      message: 'Photo updated successfully',
      photo: updatedPhoto
    });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete photo
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Check ownership
    if (photo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    if (fs.existsSync(photo.filepath)) {
      fs.unlinkSync(photo.filepath);
    }

    await photo.destroy();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
