import { api_route } from '@/constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
const ActionBtn = ({ label, onPress, color = "#007BFF" }) => {
    return (
        <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: color }]}
            onPress={onPress}
        >
            <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
    );
};
enum TaskStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    INPROGRESS = "INPROGRESS",
    OPEN = "OPEN",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    ONHOLD = "ONHOLD"
}

type TaskDTO = {
    id: number;
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
    severity: string;
};

const UserTasksPage = () => {

    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

    const getUserId = async () => {
        const user = await AsyncStorage.getItem("user");

        if (!user) throw new Error("User not found");

        const parsed = JSON.parse(user);
        setUserId(parsed.id);

        return parsed.id;
    };

    
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const uid = await getUserId();

            const response = await axios.get<TaskDTO[]>(
                `${api_route}/getAllUserTasks/${uid}`
            );

            setTasks(response.data);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    
    const changeStatus = async (
   taskId: number,
   newStatus: TaskStatus
) => {
   try {

      if (!userId) {
         return;
      }

      await axios.put(
         `${api_route}/changeStatus`,
         {
            userId: userId,
            taskId: taskId,
            newStatus: newStatus
         }
      );

      await fetchTasks();

   } catch (err: any) {

      console.error(
         "Update error:",
         err.response?.data || err.message
      );
   }
};

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderActions = (task: TaskDTO) => {

        switch (task.status) {

            case TaskStatus.PENDING:
            case TaskStatus.OPEN:
                return (
                    <View style={styles.actions}>
                        <ActionBtn label="Start" onPress={() => changeStatus(task.id, TaskStatus.INPROGRESS)} />
                        <ActionBtn label="Reject" color="#dc3545" onPress={() => changeStatus(task.id, TaskStatus.REJECTED)} />
                    </View>
                );

            case TaskStatus.INPROGRESS:
                return (
                    <View style={styles.actions}>
                        <ActionBtn label="Complete" color="#28a745" onPress={() => changeStatus(task.id, TaskStatus.COMPLETED)} />
                        <ActionBtn label="On Hold" color="#fd7e14" onPress={() => changeStatus(task.id, TaskStatus.ONHOLD)} />
                    </View>
                );

            case TaskStatus.ONHOLD:
                return (
                    <View style={styles.actions}>
                        <ActionBtn label="Resume" onPress={() => changeStatus(task.id, TaskStatus.INPROGRESS)} />
                        <ActionBtn label="Cancel" color="#6c757d" onPress={() => changeStatus(task.id, TaskStatus.CANCELLED)} />
                    </View>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.refreshBtn} onPress={fetchTasks}>
                <Text style={{ color: "#fff" }}>Refresh</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>

                        <View style={styles.header}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={[styles.badge, styles[item.status.toLowerCase()]]}>
                                {item.status}
                            </Text>
                        </View>

                        <Text style={styles.description}>{item.description}</Text>

                        <View style={styles.footer}>
                            <Text style={styles.meta}>Severity: {item.severity}</Text>
                            <Text style={styles.meta}>Deadline: {item.deadline}</Text>
                        </View>

                        {renderActions(item)}

                    </View>
                )}
            />

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 10,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    refreshBtn: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10
    },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6
    },
    title: {
        fontSize: 16,
        fontWeight: "bold"
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        color: "#fff"
    },

    pending: { backgroundColor: "#ffc107" },
    completed: { backgroundColor: "#28a745" },
    inprogress: { backgroundColor: "#17a2b8" },
    open: { backgroundColor: "#007bff" },
    rejected: { backgroundColor: "#dc3545" },
    cancelled: { backgroundColor: "#6c757d" },
    onhold: { backgroundColor: "#fd7e14" },

    description: {
        color: "#555",
        marginBottom: 8
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },
    meta: {
        fontSize: 12,
        color: "#888"
    },
    actions: {
        flexDirection: "row",
        gap: 6
    },
    actionBtn: {
        flex: 1,
        padding: 6,
        borderRadius: 6,
        alignItems: "center"
    },
    actionText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600"
    }
});

export default UserTasksPage;
