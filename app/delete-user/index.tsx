import { api_route } from '@/constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type UserDTO = {
    id: number,
    userName: string,
    userEmail: string
}

type LoggedUser = {
    userId: number
}

const UsersPage = () => {

    const [users, setUsers] = useState<UserDTO[]>([])
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null)

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem("user")
            if (userData) {
                const parsed: { id: number } = JSON.parse(userData)
                setLoggedUser({ userId: parsed.id }) 
            }
        } catch (e) {
            console.log("Error loading user")
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get<UserDTO[]>(`${api_route}/getUsers`)
            setUsers(response.data)
        } catch (e) {
            console.log("Error fetching users")
        }
    }

    const deleteUser = async (userToDeleteId: number) => {
        if (!loggedUser) {
            console.log("User not loaded")
            return
        }

        try {
            await axios.delete(
                `${api_route}/deleteUser/${userToDeleteId}/${loggedUser.userId}`
            )

            setUsers(prev => prev.filter(u => u.id !== userToDeleteId))
        } catch (e) {
            console.log("Error deleting user")
        }
    }

    const confirmDelete = (userId: number) => {
        Alert.alert(
            "Delete User",
            "Are you sure you want to delete this user?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteUser(userId)
                }
            ]
        )
    }

    useEffect(() => {
        loadUser()
        fetchUsers()
    }, [])

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={fetchUsers}>
                <Text style={styles.refresh}>Refresh</Text>
            </TouchableOpacity>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.userName}</Text>
                        <Text style={styles.email}>{item.userEmail}</Text>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => confirmDelete(item.id)}
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
    name: {
        fontSize: 16,
        fontWeight: "bold"
    },
    email: {
        color: "#555",
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

export default UsersPage;