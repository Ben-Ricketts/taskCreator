import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

function CreateTask({ addTaskHandler }) {
  const [enteredTask, setEnteredTask] = useState('');

  const taskInputHandler = enteredText => {
    setEnteredTask(enteredText);
  };

  const addTaskButtonHandler = () => {
    if (enteredTask.trim().length === 0) return;
    addTaskHandler(enteredTask);
    setEnteredTask('');
  };

  return (
    <View className="flex-row space-x-2">
      <TextInput
        className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-200"
        placeholder="Add a new task..."
        value={enteredTask}
        onChangeText={taskInputHandler}
      />
      <TouchableOpacity
        className="bg-primary px-6 py-3 rounded-lg"
        onPress={addTaskButtonHandler}
      >
        <Text className="text-white font-semibold">Add</Text>
      </TouchableOpacity>
    </View>
  );
}

// Trial to see if bens branch working

export default CreateTask;
