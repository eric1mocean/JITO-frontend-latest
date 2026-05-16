import { api_route } from "@/constants/API";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import { Divider, Menu, Provider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

type user = {
  userId: number;
  userEmail: string;
  userName: string;
  userImage: string;
};

type task = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  severity: string;
};

type taskWithUsersResponse = {
  users: user[];
  tasks: task[];
};

const AssignForm = () => {
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [selectedTask, setSelectedTask] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);

  const [users, setUsers] = useState<user[]>([]);
  const [tasks, setTasks] = useState<task[]>([]);

  const handleFetchedTasks = async () => {
    const response = await axios.get<taskWithUsersResponse>(
      `${api_route}/getUsersWithUnassignedTasks`
    );

    setUsers(response.data.users);
    setTasks(response.data.tasks);
  };

  useEffect(() => {
    handleFetchedTasks();
  }, []);

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
      await axios.put(
        `${api_route}/assignTasks/${selectedUser.id}/${selectedTask.id}`
      );

      Alert.alert(
        "Success",
        `${selectedTask.title} has been assigned to ${selectedUser.name}.`
      );
    } catch (error: any) {
      const message =
        (error as ApiError).response?.data?.message ||
        "There is a possibility that the user might already be assigned to the selected task";

      Alert.alert("Error", message);
    }
  };

  return (
    <Provider>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Assign task</Text>

          {/* USER SECTION */}
          <View style={styles.card}>
            <Text style={styles.label}>User selection</Text>

            <Menu
              visible={userMenuVisible}
              onDismiss={() => setUserMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setUserMenuVisible(true)}
                >
                  <Text style={styles.selectButtonText}>
                    {selectedUser
                      ? selectedUser.name
                      : "Choose user"}
                  </Text>

                  <Ionicons
                    name="chevron-down"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              }
            >
              <ScrollView style={{ maxHeight: 220 }}>
                {users.map((user) => (
                  <Menu.Item
                    key={user.userId}
                    onPress={() => {
                      setSelectedUser({
                        id: user.userId,
                        name: user.userName,
                      });

                      setUserMenuVisible(false);
                    }}
                    title={user.userName}
                    titleStyle={styles.menuItemText}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>

          {/* TASK SECTION */}
          <View style={styles.card}>
            <Text style={styles.label}>Task selection</Text>

            <Menu
              visible={taskMenuVisible}
              onDismiss={() => setTaskMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setTaskMenuVisible(true)}
                >
                  <Text
                    style={styles.selectButtonText}
                    numberOfLines={1}
                  >
                    {selectedTask
                      ? selectedTask.title
                      : "Choose task"}
                  </Text>

                  <Ionicons
                    name="chevron-down"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              }
            >
              <ScrollView style={{ maxHeight: 220 }}>
                {tasks.map((task) => (
                  <Menu.Item
                    key={task.id}
                    onPress={() => {
                      setSelectedTask({
                        id: task.id,
                        title: task.title,
                      });

                      setTaskMenuVisible(false);
                    }}
                    title={task.title}
                    titleStyle={styles.menuItemText}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>

          {/* ASSIGN BUTTON */}
          <TouchableOpacity
            style={styles.assignButton}
            onPress={handleAssign}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#fff"
            />

            <Text style={styles.assignButtonText}>
              Assign task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },

  container: {
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 30,
    alignSelf: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 5,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },

  selectButton: {
    backgroundColor: "#3B82F6",

    borderRadius: 16,

    paddingVertical: 16,
    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 3,
  },

  selectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    maxWidth: "90%",
  },

  menuItemText: {
    fontSize: 16,
    color: "#111827",
  },

  assignButton: {
    marginTop: 10,

    backgroundColor: "#232e45",

    borderRadius: 18,

    paddingVertical: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 5,
  },

  assignButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default AssignForm;