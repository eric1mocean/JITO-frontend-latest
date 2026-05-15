import { api_route } from "@/constants/API";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider, Menu, Provider } from "react-native-paper";

type user = {
  userId: number,
  userEmail: string,
  userName: string,
  userImage: string
}

type task = {
  id: number,
  title: string,
  description: string,
  deadline: string,
  status: string,
  severity: string
}

type taskWithUsersResponse = {
  users: user[],
  tasks: task[]
}
const AssignForm = () => {
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<{ id: number; title: string } | null>(null);

  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [users, setUsers] = useState<user[]>([])
  const [tasks, setTasks] = useState<task[]>([])

  const handleFetchedTasks = async () => {
    const response = await axios.get<taskWithUsersResponse>(`${api_route}/getUsersWithUnassignedTasks`)
    setUsers(response.data.users)
    setTasks(response.data.tasks)
  }
  useEffect(() => {
    handleFetchedTasks()

  }, [])

  type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

  const handleAssign = async () => {
    if (!selectedUser || !selectedTask) {
      Alert.alert("Error", "Select user & task");
      return;
    }
    try {
    await axios.put(`${api_route}/assignTasks/${selectedUser.id}/${selectedTask.id}`)
    Alert.alert(
      "Succes",
      `${selectedTask.title} has been assigned to ${selectedUser.name}.`
    );
  } catch (error: any) {
    const message = (error as ApiError).response?.data?.message 
    || "There is a posibility that the user might already be assigned to the selected task";
    Alert.alert("Error", message);
  }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.label}>User selection</Text>
        <Menu
          visible={userMenuVisible}
          onDismiss={() => setUserMenuVisible(false)}
          anchor={
            <Button
              title={selectedUser ? selectedUser.name : "Choose user"}
              onPress={() => setUserMenuVisible(true)}
            />
          }
        >
          <ScrollView style={{ maxHeight: 200 }}>
          {users.map((user) => (
            <Menu.Item
              key={user.userId}
              onPress={() => {
                setSelectedUser({ id: user.userId, name: user.userName });
                setUserMenuVisible(false);
              }}
              title={user.userName}
            />
          ))}
          </ScrollView>
        </Menu>
        <Divider style={{ marginVertical: 20 }} /> 

        <Text style={styles.label}>Task selection</Text>
        <Menu
          visible={taskMenuVisible}
          onDismiss={() => setTaskMenuVisible(false)}
          anchor={

          <Button
            title={selectedTask ? selectedTask.title : "Choose task"}
            onPress={() => setTaskMenuVisible(true)}
        />
          }
        >
        <ScrollView style={{ maxHeight: 200 }}>
          {tasks.map((task) => (
            <Menu.Item
              key={task.id}
              onPress={() => {
                setSelectedTask({ id: task.id, title: task.title });
                setTaskMenuVisible(false);
              }}
              title={task.title}
            />
          ))}
        </ScrollView>
      </Menu>

      <Divider style={{ marginVertical: 20 }} />

      <Button
        title="Assign"
        onPress={handleAssign}
        color="#101113ff"
      />

    </View>
    </Provider >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 15,
  },
  dropdown: {
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default AssignForm;