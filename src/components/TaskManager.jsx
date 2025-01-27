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
  const renderServer = 'http://192.168.1.15:3000/api/tasks';
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

  const deviceid = () => {
    Alert.alert('Device ID', deviceId);
  };

  const tasksHandler = () => {
    console.log(deviceId);
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

  // Get request

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(renderServer);
        const taskValues = response.data.tasks;
        console.log('Tasks from server:', taskValues);
        setTask(taskValues);
      } catch (err) {
        console.error(
          'Error fetching tasks:',
          err.response?.data || err.message
        );
      }
    };

    fetchItem();
  }, []);

  // Post request

  const addTaskHandler = async newTask => {
    if (task.length === 0) return;

    try {
      const response = await axios.post(renderServer, {
        task: newTask,
        status: 'tasks',
        deviceId: deviceId,
      });

      const newTaskData = response.data.task;
      setTask(prevTasks => [...prevTasks, newTaskData]);
      Alert.alert(
        'Task created',
        `Task: ${newTask}\nStatus: tasks\nDevice ID: ${deviceId}`
      );

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
        <View>
          <Button title="Device ID" onPress={deviceid} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TaskManager;
