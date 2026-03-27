const Resource = require('../models/Resource');

const allowedCategories = [
  'Tools & Equipment',
  'Home & Furniture',
  'Electronics',
  'Sports & Outdoor',
  'Kitchen & Cooking',
  'Event & Party Supplies',
  'Books & Learning',
  'Baby & Kids Items',
  'Miscellaneous',
];

const formatMongooseErrors = (error) => {
  const errors = {};

  if (error.errors) {
    for (const key in error.errors) {
      errors[key] = error.errors[key].message;
    }
  }

  return errors;
};

const validateResourceData = ({ title, category, description, location }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Title is required.';
  }

  if (!category || !category.trim()) {
    errors.category = 'Category is required.';
  } else if (!allowedCategories.includes(category.trim())) {
    errors.category = 'Invalid category selected.';
  }

  if (!description || !description.trim()) {
    errors.description = 'Description is required.';
  }

  if (!location || !location.trim()) {
    errors.location = 'Location is required.';
  }

  return errors;
};

const createResource = async (req, res) => {
  try {
    const { title, category, description, location, availabilityStatus } = req.body;

    const errors = validateResourceData({ title, category, description, location });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation failed.',
        errors,
      });
    }

    const resource = await Resource.create({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      location: location.trim(),
      availabilityStatus: availabilityStatus ? availabilityStatus.trim() : 'Available',
      createdBy: req.user.id,
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed.',
        errors: formatMongooseErrors(error),
      });
    }

    res.status(500).json({ message: 'Failed to create resource' });
  }
};

// Get all resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('createdBy', 'name email');
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
};

// Get resource by ID
const getResourceByID = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'name email');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resource' });
  }
};

// Update resource by ID
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorised to update this resource' });
    }

    const { title, category, description, location, availabilityStatus } = req.body;

    const errors = validateResourceData({ title, category, description, location });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation failed.',
        errors,
      });
    }

    resource.title = title.trim();
    resource.category = category.trim();
    resource.description = description.trim();
    resource.location = location.trim();
    resource.availabilityStatus = availabilityStatus ? availabilityStatus.trim() : resource.availabilityStatus;

    const updatedResource = await resource.save();

    res.status(200).json(updatedResource);
  } catch (error) {
    console.error('Update resource error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed.',
        errors: formatMongooseErrors(error),
      });
    }

    res.status(500).json({ message: 'Failed to update resource' });
  }
};

// Delete resource by ID
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorised to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resource' });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceByID,
  updateResource,
  deleteResource,
};