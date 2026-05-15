import { api_route } from "@/constants/API";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Notification = {
  id: number;
  label: string;
  description: string;
  actionDate: string;
  notificationType: "USER_RELATED" | "TASK_RELATED";
  read: boolean;
};

type NotificationsByType = {
  userNotifications: Notification[];
  taskNotifications: Notification[];
};

export default function NotificationsScreen() {
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [taskNotifications, setTaskNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get<NotificationsByType>(
        `${api_route}/getNotifications`
      );

      const sortedUsers = [...res.data.userNotifications].sort(
        (a, b) =>
          new Date(b.actionDate).getTime() -
          new Date(a.actionDate).getTime()
      );
      const sortedTasks = [...res.data.taskNotifications].sort(
        (a, b) =>
          new Date(b.actionDate).getTime() -
          new Date(a.actionDate).getTime()
      );

      setUserNotifications(sortedUsers);
      setTaskNotifications(sortedTasks);
    } catch (e) {
      console.log("Error fetching notifications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const isOld = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    return diff > 24 * 60 * 60 * 1000;
  };

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const old = isOld(item.actionDate);
    const isCollapsed = collapsed[item.id];

    return (
      <TouchableOpacity
        onPress={() => toggleCollapse(item.id)}
        style={[
          styles.card,
          old && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.label}>{item.label}</Text>

        {!isCollapsed && (
          <>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.date}>{item.actionDate}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {/* USER SECTION */}
      <Text style={styles.sectionTitle}>User Notifications</Text>
      <FlatList
        data={userNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* TASK SECTION */}
      <Text style={styles.sectionTitle}>Task Notifications</Text>
      <FlatList
        data={taskNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#111",
  },

  card: {
    backgroundColor: "#f1f5ff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  label: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1e3a8a",
  },

  desc: {
    marginTop: 6,
    color: "#444",
  },

  date: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },
});