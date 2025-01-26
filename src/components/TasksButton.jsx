import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

function TaskButton({ tasksHandler, inProgressHandler, completeHandler }) {
  return (
    <View className="flex-row justify-between px-2">
      <TouchableOpacity
        onPress={tasksHandler}
        className="bg-primary px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={inProgressHandler}
        className="bg-secondary px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">In Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={completeHandler}
        className="bg-green-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Complete</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TaskButton;
