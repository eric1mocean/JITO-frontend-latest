import { api_route } from "@/constants/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters"),

  description: z
    .string()
    .min(
      15,
      "Description should be within 15 and 100 characters"
    )
    .max(
      100,
      "Description should be within 15 and 100 characters"
    ),

  deadline: z
    .string()
    .min(
      6,
      "Deadline must occur within 5 minutes and 1 month after the establishment date"
    ),

  severity: z
    .string()
    .min(
      3,
      "Severity must be chosen between LOW, MEDIUM and HIGH"
    ),
});

export default function CreateTask() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`${api_route}/createTask`, data);

      Alert.alert(
        "Success",
        "Task created successfully!"
      );
    } catch (error) {
      Alert.alert(JSON.stringify(error));
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create task</Text>

        <View style={styles.card}>
          
          <Text style={styles.label}>Title</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color="#64748B"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Task title"
                  placeholderTextColor="#94A3B8"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />

          {errors.title && (
            <Text style={styles.error}>
              {errors.title.message}
            </Text>
          )}

          
          <Text style={styles.label}>Description</Text>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.inputContainer,
                  styles.multilineContainer,
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#64748B"
                  style={{ marginTop: 10 }}
                />

                <TextInput
                  style={[
                    styles.input,
                    styles.multilineInput,
                  ]}
                  placeholder="Task description"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />

          {errors.description && (
            <Text style={styles.error}>
              {errors.description.message}
            </Text>
          )}

          
          <Text style={styles.label}>Deadline</Text>

          <Controller
            control={control}
            name="deadline"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#64748B"
                />

                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />

          {errors.deadline && (
            <Text style={styles.error}>
              {errors.deadline.message}
            </Text>
          )}

          
          <Text style={styles.label}>Severity</Text>

          <View style={styles.pickerContainer}>
            <Ionicons
              name="warning-outline"
              size={20}
              color="#64748B"
              style={{ marginLeft: 12 }}
            />

            <Controller
              control={control}
              name="severity"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) =>
                    onChange(itemValue)
                  }
                  style={styles.picker}
                  dropdownIconColor="#475569"
                >
                  <Picker.Item
                    label="Low"
                    value="LOW"
                  />

                  <Picker.Item
                    label="Medium"
                    value="MEDIUM"
                  />

                  <Picker.Item
                    label="High"
                    value="HIGH"
                  />
                </Picker>
              )}
            />
          </View>

          {errors.severity && (
            <Text style={styles.error}>
              {errors.severity.message}
            </Text>
          )}

          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#fff"
            />

            <Text style={styles.createButtonText}>
              Create task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

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
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#fff",

    borderRadius: 24,

    padding: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
    marginTop: 14,
  },

  inputContainer: {
    backgroundColor: "#F8FAFC",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    borderRadius: 16,

    paddingHorizontal: 14,
    paddingVertical: 4,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 6,
  },

  multilineContainer: {
    alignItems: "flex-start",
    minHeight: 120,
  },

  input: {
    flex: 1,

    fontSize: 16,
    color: "#0F172A",

    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  multilineInput: {
    minHeight: 100,
  },

  pickerContainer: {
    backgroundColor: "#F8FAFC",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 6,
  },

  picker: {
    flex: 1,
    color: "#0F172A",
  },

  error: {
    color: "#EF4444",
    marginBottom: 4,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "500",
  },

  createButton: {
    marginTop: 28,

    backgroundColor: "#2563EB",

    borderRadius: 18,

    paddingVertical: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 5,
  },

  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});