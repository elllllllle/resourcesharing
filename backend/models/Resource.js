const mongoose = require('mongoose');

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

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true,
      enum: {
        values: allowedCategories,
        message: 'Invalid category selected.',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Unavailable'],
      default: 'Available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);