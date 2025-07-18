const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskString: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedMinutes: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Make sure to export the model correctly
const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
