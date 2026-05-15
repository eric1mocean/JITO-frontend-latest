// screens/RegisterScreen.js
import { api_route } from '@/constants/API';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';


const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(3)        
});

type ApiSchema = z.infer<typeof schema>;

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data : ApiSchema) => {
  try {
    const response = await axios.post(`${api_route}/createUser`, data);
    Alert.alert('Success', 'Registered successfully!'); 
  } catch (error: any ) {
  const message = (error as ApiError).response?.data?.message || "Try with different credentials";

  Alert.alert("Error", message);
}
    };

  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Text>Username</Text>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text>Password</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        <Text>Role</Text>
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <Picker
            onValueChange={(itemValue) => onChange(itemValue)}
            selectedValue={value}
            style={{ height: 50 }}>
            <Picker.Item label="Developer" value="developer" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Team leader" value="teamleader" />

          </Picker>
        )}
      />
      <Button title="Register" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity onPress={() => router.push('/login')}>
    <Text style={styles.linkText}>Already have an account? Login</Text>
    </TouchableOpacity>

    </View>
  );
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