import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';

function ToDoItems({
  task,
  setTask,
  fetchTasks,
  filteredTask,
  setFilteredTask,
}) {
  const renderServer = 'https://tasksapp-ntnb.onrender.com/';

  // Handlers

  const handleDelete = async id => {
    try {
      await axios.delete(`${renderServer}/${id}`);
      const updatedTasks = task.filter(t => t._id !== id);
      setTask(updatedTasks);
    } catch (err) {
      console.log('Error deleting task:', err);
    }
  };

  const deleteButtonHandler = async taskId => {
    try {
      await axios.delete(`${renderServer}/${taskId}`);

      // Remove from main task list
      const updatedTasks = task.filter(t => t._id !== taskId);
      setTask(updatedTasks);

      // Remove from filtered tasks
      const newFilteredTasks = filteredTask.filter(t => t._id !== taskId);
      setFilteredTask(newFilteredTasks);
    } catch (err) {
      console.log('Error deleting task:', err);
    }
  };

  const startButtonHandler = async taskId => {
    try {
      const response = await axios.patch(`${renderServer}/${taskId}`, {
        status: 'in progress',
      });
      const updatedTask = response.data;

      // Update main task list
      const updatedTasks = task.map(t => (t._id === taskId ? updatedTask : t));
      setTask(updatedTasks);

      // Remove from filtered tasks since it's no longer in 'tasks' status
      const newFilteredTasks = task.filter(t =>
        t._id === taskId ? false : t.status === 'tasks'
      );
      setFilteredTask(newFilteredTasks);
    } catch (err) {
      console.log('Error updating task status:', err);
    }
  };

  const updateButtonHandler = async (taskId, status) => {
    try {
      const response = await axios.patch(`${renderServer}/${taskId}`, {
        status: 'complete',
      });
      const updatedTask = response.data;

      // Update main task list
      const updatedTasks = task.map(t => (t._id === taskId ? updatedTask : t));
      setTask(updatedTasks);

      // Remove from filtered tasks since it's now complete
      const newFilteredTasks = task.filter(t =>
        t._id === taskId
          ? false
          : t.status === 'tasks' || t.status === 'in progress'
      );
      setFilteredTask(newFilteredTasks);
    } catch (err) {
      console.log('Error updating task status:', err);
    }
  };

  const handleStatus = async (id, currentStatus) => {
    let newStatus;
    if (currentStatus === 'tasks') {
      newStatus = 'in progress';
    } else if (currentStatus === 'in progress') {
      newStatus = 'complete';
    } else {
      newStatus = 'tasks';
    }

    try {
      await axios.patch(`${renderServer}/${id}`, {
        status: newStatus,
      });
      const updatedTasks = task.map(t =>
        t._id === id ? { ...t, status: newStatus } : t
      );
      setTask(updatedTasks);
    } catch (err) {
      console.log('Error updating status:', err);
    }
  };

  return (
    <View className="space-y-4">
      {task.map(item => (
        <View
          key={item._id}
          className={`flex-row justify-between items-center p-4 rounded-lg ${
            item.status === 'complete'
              ? 'bg-green-100'
              : item.status === 'in progress'
              ? 'bg-secondary/20'
              : 'bg-white'
          }`}
        >
          <View></View>
          <View className="flex-1">
            <TouchableOpacity
              className="flex-1"
              onPress={() => handleStatus(item._id, item.status)}
            >
              <Text
                className={`text-lg ${
                  item.status === 'complete' ? 'line-through text-gray-500' : ''
                }`}
              >
                {item.task}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row space-x-2">
            {item.status === 'tasks' && (
              <TouchableOpacity
                onPress={() => startButtonHandler(item._id)}
                className="bg-secondary px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Start</Text>
              </TouchableOpacity>
            )}

            {item.status === 'in progress' && (
              <TouchableOpacity
                onPress={() => updateButtonHandler(item._id, item.status)}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Complete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => deleteButtonHandler(item._id)}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

export default ToDoItems;
