import { api_route } from '@/constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TaskDTO = {
    taskId: number,
    taskName: string,
    taskDescription: string,
    taskStatus: string,
    taskSeverity: string
}

type User = {
    id: number
}

type FilteredTasksDTO = {
    getTasksDTOPending: TaskDTO[];
    getTasksDTOCompleted: TaskDTO[];
    getTasksDTOInProgress: TaskDTO[];
    getTasksDTOOpen: TaskDTO[];
    getTasksDTORejected: TaskDTO[];
    getTasksDTOCancelled: TaskDTO[];
    getTasksDTOOnHold: TaskDTO[];
}

const TasksListPage = () => {

    const [tasks, setTasks] = useState<TaskDTO[]>([])
    const [user, setUser] = useState<User | null>(null)

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem("user")
            console.log(userData) 
            if (userData) {
                const parsedUser: User = JSON.parse(userData)
                setUser(parsedUser)
            }
        } catch (e) {
            console.log("Error loading user")
        }
    }

    const fetchTasks = async () => {
        try {
            const response = await axios.get<FilteredTasksDTO>(`${api_route}/getFilteredTasks`)
            // Flatten all tasks from all categories
            const allTasks = [
                ...response.data.getTasksDTOPending,
                ...response.data.getTasksDTOCompleted,
                ...response.data.getTasksDTOInProgress,
                ...response.data.getTasksDTOOpen,
                ...response.data.getTasksDTORejected,
                ...response.data.getTasksDTOCancelled,
                ...response.data.getTasksDTOOnHold,
            ]
            setTasks(allTasks)
            console.log("Tasks fetched successfully:", allTasks.length, "tasks")
        } catch (e: any) {
            console.error("Error fetching tasks:", e?.response?.data || e?.message || e)
            Alert.alert("Error", `Failed to fetch tasks: ${e?.message || "Unknown error"}`)
        }
    }

    const deleteTask = async (taskId: number) => {
        if (!user) {
            Alert.alert("Error", "User not loaded")
            return
        }

        try {
            await axios.delete(`${api_route}/deleteTask/${taskId}/${user.id}`)
            setTasks(prev => prev.filter(t => t.taskId !== taskId))
            Alert.alert("Success", "Task deleted successfully")
        } catch (e: any) {
            console.error("Error deleting task:", e?.response?.data || e?.message || e)
            Alert.alert("Error", `Failed to delete task: ${e?.message || "Unknown error"}`)
        }
    }

    const confirmDelete = (taskId: number) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteTask(taskId)
                }
            ]
        )
    }

    useEffect(() => {
        loadUser()
        fetchTasks()
    }, [])

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={fetchTasks}>
                <Text style={styles.refresh}>Refresh</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.taskId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.taskName}</Text>
                        <Text style={styles.description}>{item.taskDescription}</Text>

                        <View style={styles.row}>
                            <Text>Status: {item.taskStatus}</Text>
                            <Text>Severity: {item.taskSeverity}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => confirmDelete(item.taskId)}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 10,
    },
    refresh: {
        marginBottom: 10,
        fontWeight: "bold"
    },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold"
    },
    description: {
        color: "#555",
        marginVertical: 5
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        padding: 8,
        borderRadius: 6,
        alignItems: "center"
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold"
    }
})

export default TasksListPage;