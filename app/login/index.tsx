// screens/LoginScreen.js
import { api_route } from '@/constants/API';
import { storeData } from '@/hooks/localstorage';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';


const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ['confirmPassword'],
  });
type ApiSchema = z.infer<typeof schema>;

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data : ApiSchema) => {
    try {
    const response = await axios.post(`${api_route}/loginUser/`, data);
    console.log(response.data);
    storeData("user",JSON.stringify(response.data));
    //@ts-ignore
    router.push('/home');
    Alert.alert('Success', 'Logged in successfully!');
  } catch (error: any) {
    
  const message = (error as ApiError).response?.data?.message || "Try with different credentials.";
  
    Alert.alert("Error", message);
    };
  }

  

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
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

      <Text>Re-enter password</Text>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity onPress={() => router.push('/register')}>
      <Text style={styles.linkText}>Don't have an account? Register</Text>
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