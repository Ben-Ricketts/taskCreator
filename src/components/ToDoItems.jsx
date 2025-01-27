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

function ToDoItems({ task, setTask }) {
  const renderServer = 'http://192.168.1.15:3000/api/tasks';

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

  const startButtonHandler = async taskId => {
    try {
      const response = await axios.patch(`${renderServer}/${taskId}`, {
        status: 'in progress',
      });
      const updatedTasks = task.map(t =>
        t._id === taskId ? response.data : t
      );
      setTask(updatedTasks);
    } catch (err) {
      console.log('Error updating task status:', err);
    }
  };

  const updateButtonHandler = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'in progress' ? 'complete' : 'tasks';
    try {
      const response = await axios.patch(`${renderServer}/${taskId}`, {
        status: newStatus,
      });
      const updatedTasks = task.map(t =>
        t._id === taskId ? response.data : t
      );
      setTask(updatedTasks);
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
                className="bg-inProgress px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
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
