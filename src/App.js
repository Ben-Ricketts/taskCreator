import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import ToDoItems from "./components/ToDoItems";
import TasksButton from "./components/TasksButton";
import TaskManager from "./components/TaskManager";

export default function App() {
  return (
    <View style={styles.container}>
      <TaskManager />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
