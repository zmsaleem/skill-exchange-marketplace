const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Programming', 'Design', 'Music', 'Language', 'Business', 'Science', 'Other'],
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      enum: ['Weekdays', 'Weekends', 'Evenings', 'Flexible'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
