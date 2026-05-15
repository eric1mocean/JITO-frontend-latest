import { api_route } from "@/constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TaskStatus =
  | "PENDING"
  | "COMPLETED"
  | "INPROGRESS"
  | "OPEN"
  | "REJECTED"
  | "CANCELLED"
  | "ONHOLD";

type TaskDTO = {
  taskId: number;
  taskName: string;
  taskDescription: string;
  taskStatus: TaskStatus;
  taskSeverity: string;
};

type FilteredTasksDTO = {
  getTasksDTOCancelled: TaskDTO[];
  getTasksDTOCompleted: TaskDTO[];
};

type EditableTask = {
  title: string;
  description: string;
  status: TaskStatus;
};

const statusOptions: TaskStatus[] = [
  "PENDING",
  "OPEN",
  "INPROGRESS",
  "ONHOLD",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
];

export default function TeamleaderClosedTasksPage() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [editable, setEditable] = useState<Record<number, EditableTask>>({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<number | null>(null);

  const getUserId = async () => {
    const userRaw = await AsyncStorage.getItem("user");
    if (!userRaw) {
      throw new Error("User not found");
    }
    const parsed = JSON.parse(userRaw);
    setUserId(parsed.id);
    return parsed.id as number;
  };

  const fetchClosedTasks = async () => {
    try {
      setLoading(true);
      await getUserId();
      const response = await axios.get<FilteredTasksDTO>(`${api_route}/getFilteredTasks`);

      const merged = [
        ...response.data.getTasksDTOCancelled,
        ...response.data.getTasksDTOCompleted,
      ];

      setTasks(merged);

      const nextEditable: Record<number, EditableTask> = {};
      for (const task of merged) {
        nextEditable[task.taskId] = {
          title: task.taskName,
          description: task.taskDescription,
          status: task.taskStatus,
        };
      }
      setEditable(nextEditable);
    } catch (error) {
      console.error("Failed to load closed tasks", error);
      Alert.alert("Error", "Failed to load cancelled/completed tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedTasks();
  }, []);

  const updateEditableField = (
    taskId: number,
    field: keyof EditableTask,
    value: string
  ) => {
    setEditable((prev: Record<number, EditableTask>) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const saveTask = async (taskId: number) => {
    try {
      if (!userId) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const data = editable[taskId];
      if (!data?.title?.trim() || !data?.description?.trim()) {
        Alert.alert("Validation", "Title and description are required.");
        return;
      }

      setSavingTaskId(taskId);
      await axios.put(`${api_route}/updateTaskByTeamleader/${taskId}/${userId}`, {
        title: data.title.trim(),
        description: data.description.trim(),
        status: data.status,
      });

      Alert.alert("Success", "Task updated successfully.");
      await fetchClosedTasks();
    } catch (error: any) {
      console.error("Failed to update task", error?.response?.data || error?.message);
      Alert.alert("Error", "Could not update task.");
    } finally {
      setSavingTaskId(null);
    }
  };

  const renderTask = ({ item }: { item: TaskDTO }) => {
    const form = editable[item.taskId];
    if (!form) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.statusBadge}>Current: {item.taskStatus}</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          value={form.title}
          onChangeText={(value: string) => updateEditableField(item.taskId, "title", value)}
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={form.description}
          onChangeText={(value: string) => updateEditableField(item.taskId, "description", value)}
          multiline
          style={[styles.input, styles.textArea]}
        />

        <Text style={styles.label}>Move to status</Text>
        <Picker
          selectedValue={form.status}
          onValueChange={(value: TaskStatus) => updateEditableField(item.taskId, "status", value)}
          style={styles.picker}
        >
          {statusOptions.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveTask(item.taskId)}
          disabled={savingTaskId === item.taskId}
        >
          <Text style={styles.saveText}>
            {savingTaskId === item.taskId ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshBtn} onPress={fetchClosedTasks}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item: TaskDTO) => item.taskId.toString()}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={styles.empty}>No cancelled or completed tasks found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshBtn: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  refreshText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    color: "#1e3a8a",
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
    marginTop: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  picker: {
    height: 50,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 30,
  },
});
