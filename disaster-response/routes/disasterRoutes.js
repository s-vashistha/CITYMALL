const express = require('express');
const router = express.Router();

const {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster,
  getResourcesNearby,
  getSocialMedia,
  geocodeLocation,
  verifyImage
} = require('../controllers/disasterController');

// CRUD Routes
router.post('/', createDisaster);
router.get('/', getDisasters);
router.put('/:id', updateDisaster);
router.delete('/:id', deleteDisaster);

// Geospatial + Mock Data
router.get('/:id/resources', getResourcesNearby);
router.get('/:id/social-media', getSocialMedia);

// Geocode endpoint
router.post('/geocode', geocodeLocation);

//verifyImage
router.post('/:id/verify-image', verifyImage);

module.exports = router;
