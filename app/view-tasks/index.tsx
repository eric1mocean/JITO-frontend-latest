import { api_route } from '@/constants/API';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type TaskDTO = {

    taskId: number,
    taskName: string,
    taskDescription: string,
    taskStatus: string,
    taskSeverity: string,
    users: UserDTO[]
}

type UserDTO = {

    userId: number,
    userEmail: string,
    userName: string,
    userImage: string
}

type FilteredTasksDTO = {

    getTasksDTOPending: TaskDTO[],
    getTasksDTOCompleted: TaskDTO[],
    getTasksDTOInProgress: TaskDTO[],
    getTasksDTOOpen: TaskDTO[],
    getTasksDTORejected: TaskDTO[],
    getTasksDTOCancelled: TaskDTO[],
    getTasksDTOOnHold: TaskDTO[]

}

const AssignTaskPage = () => {
    const [tasks, setTasks] = useState<FilteredTasksDTO | null>(null)
    const [tasksToShow, setTasksToShow] = useState<TaskDTO[]>([])
    const [activeTab, setActiveTab] = useState("Pending");


    const handleFetchedTasks = async () => {
        const response = await axios.get<FilteredTasksDTO>(`${api_route}/getFilteredTasks`)
        setTasks(response.data)
        setTasksToShow(response.data.getTasksDTOPending)
        console.log(response.data.getTasksDTOPending)
    }
    useEffect(() => {
        handleFetchedTasks()

    }, [])
    const handlePress = (taskId: string) => {
        router.push({
            pathname: "/view-task-details/view-tasks/[id]",
            params: { id: taskId },
        });
    };

    if (tasks == null) return (
        <Text>Loading</Text>
    )

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleFetchedTasks}>Refresh</TouchableOpacity>
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => { setActiveTab("Pending"); setTasksToShow(tasks.getTasksDTOPending); }} style={[styles.tabButton, activeTab === "Pending" && tabstyles.tabButtonActive]}><Text>Pending</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("Completed"); setTasksToShow(tasks.getTasksDTOCompleted) }} style={[styles.tabButton, activeTab === "Completed" && tabstyles.tabButtonActive]}><Text>Completed</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("In progress"); setTasksToShow(tasks.getTasksDTOInProgress) }} style={[styles.tabButton, activeTab === "In progress" && tabstyles.tabButtonActive]}><Text>In Progress</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("Open"); setTasksToShow(tasks.getTasksDTOOpen) }} style={[styles.tabButton, activeTab === "Open" && tabstyles.tabButtonActive]}><Text>Open</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("Rejected"); setTasksToShow(tasks.getTasksDTORejected) }} style={[styles.tabButton, activeTab === "Rejected" && tabstyles.tabButtonActive]}><Text>Rejected</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("Cancelled"); setTasksToShow(tasks.getTasksDTOCancelled) }} style={[styles.tabButton, activeTab === "Cancelled" && tabstyles.tabButtonActive]}><Text>Cancelled</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("On hold"); setTasksToShow(tasks.getTasksDTOOnHold) }} style={[styles.tabButton, activeTab === "On hold" && tabstyles.tabButtonActive]}><Text>On Hold</Text></TouchableOpacity>


            </View>
            <FlatList
                data={tasksToShow}
                keyExtractor={(item) => item.taskId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.headerRow}>
                            <Text style={styles.taskName}>{item.taskName}</Text>
                            <Text style={[styles.badge, styles[item.taskStatus.toLowerCase()]]}>
                                {item.taskStatus}
                            </Text>
                        </View>

                        <Text style={styles.description}>{item.taskDescription}</Text>

                        <View style={styles.footerRow}>
                            <Text style={styles.severity}>Severity: {item.taskSeverity}</Text>
                            <Text style={styles.users}>👥 {item.users.length} users</Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#007BFF",
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                borderRadius: 5,
                                alignItems: "center",
                            }}
                            onPress={() => handlePress(item.taskId.toString())}
                        >
                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                                View task details
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        flexWrap: "wrap",          
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    taskName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        color: "#fff",
        fontWeight: "bold",
        overflow: "hidden",
    },
    open: { backgroundColor: "#28a745" },
    pending: { backgroundColor: "#ffc107" },
    closed: { backgroundColor: "#dc3545" },
    rejected: { backgroundColor: "#646583ff" },
    completed: { backgroundColor: "#2fe5dfff" },
    cancelled: { backgroundColor: "#7d0612ff" },
    onhold: { backgroundColor: "#dd6825ff" },



    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 8,
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    severity: {
        fontSize: 12,
        color: "#888",
    },
    users: {
        fontSize: 12,
        color: "#888",
    },
    tabButton: {
        width: "33.33%",           
        padding: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2,
    },
    taskText: {
        fontSize: 16,
        flex: 1,
    },
    picker: {
        width: 150,
    },
});
const tabstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#ffffff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    tabButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#e9ecef",
    },
    tabButtonActive: {
        backgroundColor: "#007bff",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#495057",
    },
    tabTextActive: {
        color: "#ffffff",
    },
});




export default AssignTaskPage;