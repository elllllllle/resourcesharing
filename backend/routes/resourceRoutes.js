const express = require('express');
const { createResource, getResources, getResourceByID, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getResources)
    .post(protect, createResource);

router.route('/:id')
    .get(getResourceByID)
    .put(protect, updateResource)
    .delete(protect, deleteResource);

module.exports = router;
