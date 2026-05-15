import { api_route } from "@/constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

type UserDto = {
  id: number;
  username: string;
  email: string;
  createDate: string;
  active: boolean;
};

type LoggedUser = {
  userId: number;
};

export default function AdminInactiveUsersScreen() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>("");

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsed: { id: number } = JSON.parse(userData);
        setLoggedUser({ userId: parsed.id });
      }
    } catch {
      console.log("Error loading user");
    }
  };

  const fetchInactiveUsers = async () => {
  if (!loggedUser) return;

  try {
    setLoading(true);

    const url =
      keyword && keyword.trim() !== ""
        ? `${api_route}/getAllInactiveUsers/${loggedUser.userId}/${keyword}`
        : `${api_route}/getAllInactiveUsersV2/${loggedUser.userId}`;
    const response = await axios.get<UserDto[]>(url);

    setUsers(response.data);
  } catch (err) {
    console.log("Fetch error", err);
  } finally {
    setLoading(false);
  }
};

  const approveUser = async (userId: number) => {
    if (!loggedUser) return;

    try {
      await axios.put(
        `${api_route}/approveUserActivationRequest/${userId}/${loggedUser.userId}`
      );
      fetchInactiveUsers();
    } catch (e) {
      console.log("Approve error", e);
    }
  };

  const rejectUser = async (userId: number) => {
    if (!loggedUser) return;

    try {
      await axios.delete(
        `${api_route}/deleteUser/${userId}/${loggedUser.userId}`
      );
      fetchInactiveUsers();
    } catch (e) {
      console.log("Reject error", e);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      fetchInactiveUsers();
    }
  }, [loggedUser, keyword]);

  const renderItem = ({ item }: { item: UserDto }) => (
    <View style={styles.card}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.date}>{item.createDate}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => approveUser(item.id)}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => rejectUser(item.id)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor="#888"
        value={keyword}
        onChangeText={(text) => setKeyword(text ?? "")}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
      ) : !users.length ? (
        <View style={styles.center}>
          <Text style={{ color: "#555" }}>No inactive users</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  card: {
    backgroundColor: "#f9fbff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },

  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },

  email: {
    color: "#555",
    marginTop: 4,
  },

  date: {
    color: "#777",
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  approveBtn: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  center: {
    marginTop: 40,
    alignItems: "center",
  },

  input: {
    backgroundColor: "#eef4ff",
    color: "#111",
    padding: 12,
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
});
