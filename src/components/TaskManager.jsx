import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
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

  const tasksHandler = () => {
    setMessage('tasks');
    const tasks = task.filter(t => t.status === 'tasks');
    setFilteredTask(tasks);
  };

  const inProgressHandler = () => {
    setMessage('In Progress');
    const inProgressTasks = task.filter(t => t.status === 'in progress');
    setFilteredTask(inProgressTasks);
  };

  const completeHandler = () => {
    setMessage('complete');
    const completeTasks = task.filter(t => t.status === 'complete');
    setFilteredTask(completeTasks);
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!deviceId) {
        console.log('No deviceId yet, skipping fetch');
        return;
      }
      try {
        console.log('Fetching tasks with deviceId:', deviceId);
        const headers = {
          'X-Device-ID': deviceId,
        };
        console.log('Request headers:', headers);
        const response = await axios.get(renderServer, {
          headers: headers
        });
        const taskValues = response.data.tasks;
        setTask(taskValues);
      } catch (err) {
        console.error('Error fetching tasks:', err.response?.data || err.message);
      }
    };

    fetchItem();
  }, [deviceId, renderServer]);

  const addTaskHandler = async newTask => {
    if (!deviceId) {
      console.log('No deviceId available, cannot create task');
      return;
    }
    if (task.length === 0) return;

    try {
      console.log('Creating new task with deviceId:', deviceId);
      const headers = {
        'X-Device-ID': deviceId,
      };
      console.log('Request headers:', headers);
      const response = await axios.post(
        renderServer,
        {
          task: newTask,
          status: 'tasks',
        },
        {
          headers: headers
        }
      );
      const newTaskData = response.data.newPost;
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
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="space-y-4">
          <ToDoItems task={filteredTasks} setTask={setTask} />
        </View>
      </ScrollView>

      <View className="px-4 py-6 space-y-4">
        <CreateTask addTaskHandler={addTaskHandler} />
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
