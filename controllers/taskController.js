const Task = require('../models/Task');
const mongoose = require('mongoose'); // Added mongoose import

// Ensure Task is properly imported
console.log('Task model:', typeof Task, Task.modelName);

exports.createTask = async (req, res) => {
  try {
    const { taskString, description, estimatedMinutes } = req.body;
    
    if (!taskString || !description || !estimatedMinutes) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide taskString, description and estimatedMinutes' 
      });
    }
    
    const task = new Task({
      taskString,
      description,
      estimatedMinutes
    });
    
    const savedTask = await task.save();
    
    return res.status(201).json({
      success: true,
      data: savedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get tasks - all or filtered by IDs
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    const { ids } = req.query;
    
    if (ids) {
      // Convert comma-separated IDs to array
      const idArray = ids.split(',');
      tasks = await Task.find({ _id: { $in: idArray } });
    } else {
      tasks = await Task.find({});  // Added empty object parameter
    }
    
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: ${taskId}. Must be a valid MongoDB ObjectId.`
      });
    }
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }
    
    // Check if status is valid
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in-progress, completed'
      });
    }
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${taskId}`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
