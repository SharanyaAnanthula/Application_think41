const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  updateTaskStatus 
} = require('../controllers/taskController');

// Create a new task
router.post('/', createTask);

// Get all tasks or tasks by IDs
router.get('/', getTasks);

// Update task status
router.put('/:id', updateTaskStatus);

module.exports = router;
