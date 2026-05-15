import { api_route } from "@/constants/API";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
/*
"taskId": 7,
  "taskName": "Task 2 from 29.08",
  "taskDescription": "Second task created on 29.08",
  "taskStatus": "PENDING",
  "taskSeverity": "MEDIUM",
  "users": [],
  "taskDeadline": "2025-08-30"
*/

type userDetails = {
  userId: number,
  userEmail: string,
  userName: string,
  userImage: string 
}

type taskDetails = {
  taskName: string,
  taskDescription: string,
  taskStatus: string,
  taskSeverity: string,
  users: userDetails[],
  taskDeadline: string
}


export default function TaskDetails() {
  const { id } = useLocalSearchParams(); 
  const [task, setTask] = useState<taskDetails>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${api_route}/getTask/${id}`);
        const data = await res.json();
        setTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.taskName}</Text>
      <Text style={styles.description}>{task.taskDescription}</Text>


      <Text style={styles.info}>Status: {task.taskStatus}</Text>
      <Text style={styles.info}>Severity: {task.taskSeverity}</Text>
      <Text style={styles.info}>Deadline: {task.taskDeadline}</Text>

      <Text style={[styles.title, { marginTop: 20 }]}>Users</Text>
      <FlatList
        data={task.users}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userEmail}>{item.userEmail}</Text>
          </View>
        )}
      />
    </View>
  );
  

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
  userCard: {
    marginVertical: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
  },
});
