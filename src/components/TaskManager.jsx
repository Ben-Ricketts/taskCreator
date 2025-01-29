import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  Alert,
} from 'react-native';
import ToDoItems from './ToDoItems';
import CreateTask from './CreateTask';
import TaskButton from './TasksButton';
import axios from 'axios';
import { getDeviceId } from '../utils/deviceId';

function TaskManager() {
  const renderServer = 'https://tasksapp-ntnb.onrender.com/api/tasks';
  const [message, setMessage] = useState('tasks');
  const [task, setTask] = useState([]);
  const [filteredTasks, setFilteredTask] = useState(task);
  const [deviceId, setDeviceId] = useState(null);

  // Initialize device ID
  useEffect(() => {
    const initDeviceId = async () => {
      try {
        const id = await getDeviceId();
        console.log('Device ID initialized');
        setDeviceId(id);
      } catch (error) {
        console.error('Error initializing device ID');
      }
    };
    initDeviceId();
  }, []);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks from:', renderServer);
      const response = await axios.get(`${renderServer}?deviceId=${deviceId}`);
      console.log('Response:', response.data);
      const taskValues = response.data.tasks.filter(
        task => task.deviceId === deviceId
      );
      const filterTasksByStatus = taskValues.filter(
        task => task.status === 'tasks'
      );
      setTask(taskValues);
      setFilteredTask(filterTasksByStatus);
      return taskValues;
    } catch (err) {
      console.error('Error fetching tasks:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: `${renderServer}?deviceId=${deviceId}`
      });
      setTask([]);
      setFilteredTask([]);
      return [];
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchTasks();
    }
  }, [deviceId]);

  const tasksHandler = async () => {
    setMessage('tasks');
    const currentTasks = await fetchTasks(); // Get fresh data
    const tasks = currentTasks.filter(t => t.status === 'tasks');
    setFilteredTask(tasks);
  };

  const inProgressHandler = async () => {
    setMessage('In Progress');
    const currentTasks = await fetchTasks(); // Get fresh data
    const inProgressTasks = currentTasks.filter(
      t => t.status === 'in progress'
    );
    console.log('In Progress Tasks:', inProgressTasks);
    setFilteredTask(inProgressTasks);
  };

  const completeHandler = async () => {
    setMessage('complete');
    const currentTasks = await fetchTasks(); // Get fresh data
    const completeTasks = currentTasks.filter(t => t.status === 'complete');
    setFilteredTask(completeTasks);
  };

  const addTaskHandler = async newTask => {
    try {
      const response = await axios.post(renderServer, {
        task: newTask,
        status: 'tasks',
        deviceId: deviceId,
      });

      const newTaskData = response.data.task;
      setTask(prevTasks => [...prevTasks, newTaskData]);

      // If we're currently viewing 'tasks', update filteredTasks too
      if (message === 'tasks') {
        setFilteredTask(prevFiltered => [...prevFiltered, newTaskData]);
      }
    } catch (err) {
      console.error('Error creating task:', err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text
          className={`text-4xl font-bold text-center uppercase ${
            message === 'In Progress'
              ? 'text-inProgress'
              : message === 'complete'
              ? 'text-green-500'
              : 'text-primary'
          }`}
        >
          {message}
        </Text>
        <CreateTask addTaskHandler={addTaskHandler} />
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="space-y-4">
          <ToDoItems
            task={filteredTasks}
            setTask={setTask}
            fetchTasks={fetchTasks}
            filteredTask={filteredTasks}
            setFilteredTask={setFilteredTask}
          />
        </View>
      </ScrollView>

      <View className="px-4 py-6 space-y-4">
        <TaskButton
          tasksHandler={tasksHandler}
          inProgressHandler={inProgressHandler}
          completeHandler={completeHandler}
        />
      </View>
    </SafeAreaView>
  );
}

export default TaskManager;
