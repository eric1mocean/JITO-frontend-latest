import { api_route } from "@/constants/API";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TaskDTO = {
  taskId: number;
  taskName: string;
  taskDescription: string;
  taskStatus: string;
  taskSeverity: string;
  users: UserDTO[];
};

type UserDTO = {
  userId: number;
  userEmail: string;
  userName: string;
  userImage: string;
};

type FilteredTasksDTO = {
  getTasksDTOPending: TaskDTO[];
  getTasksDTOCompleted: TaskDTO[];
  getTasksDTOInProgress: TaskDTO[];
  getTasksDTOOpen: TaskDTO[];
  getTasksDTORejected: TaskDTO[];
  getTasksDTOCancelled: TaskDTO[];
  getTasksDTOOnHold: TaskDTO[];
};

const AssignTaskPage = () => {
  const [tasks, setTasks] =
    useState<FilteredTasksDTO | null>(null);

  const [tasksToShow, setTasksToShow] = useState<
    TaskDTO[]
  >([]);

  const [activeTab, setActiveTab] =
    useState("Pending");

  const handleFetchedTasks = async () => {
    const response =
      await axios.get<FilteredTasksDTO>(
        `${api_route}/getFilteredTasks`
      );

    setTasks(response.data);
    setTasksToShow(
      response.data.getTasksDTOPending
    );
  };

  useEffect(() => {
    handleFetchedTasks();
  }, []);

  const handlePress = (taskId: string) => {
    router.push({
      pathname:
        "/view-task-details/view-tasks/[id]",
      params: { id: taskId },
    });
  };

  const tabs = [
    {
      label: "Pending",
      dataKey: "getTasksDTOPending",
    },
    {
      label: "Completed",
      dataKey: "getTasksDTOCompleted",
    },
    {
      label: "In Progress",
      dataKey: "getTasksDTOInProgress",
    },
    {
      label: "Open",
      dataKey: "getTasksDTOOpen",
    },
    {
      label: "Rejected",
      dataKey: "getTasksDTORejected",
    },
    {
      label: "Cancelled",
      dataKey: "getTasksDTOCancelled",
    },
    {
      label: "On Hold",
      dataKey: "getTasksDTOOnHold",
    },
  ];

  if (tasks == null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* FILTER TABS */}
      <View style={styles.tabsWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.tabsContainer}
          renderItem={({ item }) => {
            const isActive =
              activeTab === item.label;

            return (
              <TouchableOpacity
                style={[
                  styles.modernTab,
                  isActive &&
                    styles.modernTabActive,
                ]}
                onPress={() => {
                  setActiveTab(item.label);

                  setTasksToShow(
                    tasks[
                      item.dataKey as keyof FilteredTasksDTO
                    ] as TaskDTO[]
                  );
                }}
              >
                <Text
                  style={[
                    styles.modernTabText,
                    isActive &&
                      styles.modernTabTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* TASK LIST */}
      <FlatList
        data={tasksToShow}
        keyExtractor={(item) =>
          item.taskId.toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.taskName}>
                {item.taskName}
              </Text>

              <Text
                style={[
                  styles.badge,
                  styles[
                    item.taskStatus
                      .toLowerCase()
                      .replace(" ", "") as keyof typeof styles
                  ],
                ]}
              >
                {item.taskStatus}
              </Text>
            </View>

            <Text style={styles.description}>
              {item.taskDescription}
            </Text>

            <View style={styles.footerRow}>
              <Text style={styles.severity}>
                Severity: {item.taskSeverity}
              </Text>

              <Text style={styles.users}>
                👥 {item.users.length} users
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                handlePress(
                  item.taskId.toString()
                )
              }
            >
              <Text
                style={styles.detailsButtonText}
              >
                View task details
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingTop: 6,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------- TABS ---------- */

  tabsWrapper: {
    marginBottom: 8,
  },

  tabsContainer: {
    paddingHorizontal: 10,
    gap: 8,
  },

  modernTab: {
    backgroundColor: "#FFFFFF",

    paddingVertical: 7,
    paddingHorizontal: 14,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.03,
    shadowRadius: 2,

    elevation: 1,
  },

  modernTabActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  modernTabText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },

  modernTabTextActive: {
    color: "#fff",
  },

  /* ---------- CARD ---------- */

  card: {
    backgroundColor: "#fff",

    borderRadius: 14,

    padding: 12,

    marginHorizontal: 10,
    marginVertical: 5,

    shadowColor: "#000",

    shadowOpacity: 0.05,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    marginBottom: 4,
  },

  taskName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",

    flex: 1,
    marginRight: 8,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,

    borderRadius: 999,

    color: "#fff",
    fontWeight: "700",

    fontSize: 11,

    overflow: "hidden",
  },

  open: {
    backgroundColor: "#22C55E",
  },

  pending: {
    backgroundColor: "#F59E0B",
  },

  rejected: {
    backgroundColor: "#EF4444",
  },

  completed: {
    backgroundColor: "#2563EB",
  },

  cancelled: {
    backgroundColor: "#6B7280",
  },

  onhold: {
    backgroundColor: "#EA580C",
  },

  inprogress: {
    backgroundColor: "#06B6D4",
  },

  description: {
    fontSize: 13,
    color: "#475569",

    marginBottom: 8,
    lineHeight: 18,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 10,
  },

  severity: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },

  users: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },

  detailsButton: {
    backgroundColor: "#2563EB",

    paddingVertical: 8,

    borderRadius: 10,

    alignItems: "center",
  },

  detailsButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
export default AssignTaskPage;