import { api_route } from '@/constants/API';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';


const schema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().min(15, 'Descripton should be within 15 and 100 characters').max(100, 'Descripton should be within 15 and 100 characters'),
  deadline: z.string().min(6, 'Deadline must occur within 5 minutes and 1 month after the establishment date'),
  severity: z.string().min(3, 'Severity must be chosen between LOW, MEDIUM and HIGH')
});

export default function CreateTask() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${api_route}/createTask`, data);
      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {

      Alert.alert(JSON.stringify(error));
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create task</Text>

      <Text>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}


      <Text>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}


      <Text>Deadline</Text>
      <Controller
        control={control}
        name="deadline"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}

            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.deadline && <Text style={styles.error}>{errors.deadline.message}</Text>}

      <Text>Severity</Text>
      <Controller
        control={control}
        name="severity"
        render={({ field: { onChange, value } }) => (
          <Picker
            onValueChange={(itemValue) => onChange(itemValue)}
            selectedValue={value}
            style={{ height: 50 }}>
            <Picker.Item label="Low" value="LOW" />
            <Picker.Item label="Medium" value="MEDIUM" />
            <Picker.Item label="High" value="HIGH" />
          </Picker>
        )}
      />
      {errors.severity && <Text style={styles.error}>{errors.severity.message}</Text>}


      <Button title="Create" onPress={handleSubmit(onSubmit)} />


    </View>

  )

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  linkText: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});