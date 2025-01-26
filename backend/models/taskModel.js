const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, 'please enter a task to complete'],
  },
  status: {
    type: String,
    default: 'tasks',
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
