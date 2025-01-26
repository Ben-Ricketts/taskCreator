const Task = require('../models/taskModel');

exports.getTasks = async (req, res) => {
  try {
    const findTasks = await Task.find();

    const sanitizedTasks = findTasks.map(task => ({
      id: task._id,
      task: task.task,
      status: task.status,
    }));

    res.status(200).json({
      message: 'Items found',
      tasks: sanitizedTasks,
    });
  } catch (err) {
    console.error('Error in getTasks:', err.message);
    res.status(400).json({
      message: 'Failed to fetch tasks',
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const findTask = await Task.findById(req.params.id);
    const sanitizedTask = {
      id: findTask._id,
      task: findTask.task,
      status: findTask.status,
    };

    res.status(200).json({
      message: 'Task found',
      Task: sanitizedTask,
    });
  } catch (err) {
    console.error('Error in getTask:', err.message);
    res.status(400).json({
      message: 'Failed to fetch task',
    });
  }
};

exports.postTasks = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
    };
    const task = await Task.create(taskData);

    const sanitizedTask = {
      id: task._id,
      task: task.task,
      status: task.status,
    };
    res.status(200).json({
      message: 'Task created successfully',
      task: sanitizedTask,
    });
  } catch (err) {
    console.error('Error in postTasks:', err.message);
    res.status(400).json({
      message: 'Failed to create task',
    });
    console.log(err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTask = await Task.findByIdAndDelete(id);
    const sanitizedTask = {
      id: deleteTask._id,
      task: deleteTask.task,
      status: deleteTask.status,
    };

    res.status(200).json({
      message: 'delete sucessfully',
      result: sanitizedTask,
    });
  } catch (err) {
    console.error('Error in deleteTask:', err.message);
    res.status(400).json({
      message: 'Failed to delete task',
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const sanitizedTask = {
      id: updatedTask._id,
      task: updatedTask.task,
      status: updatedTask.status,
    };

    res.status(200).json(sanitizedTask);
  } catch (err) {
    console.error('Error in updateTask:', err.message);
    res.status(400).json({
      message: 'Failed to update task',
    });
  }
};
