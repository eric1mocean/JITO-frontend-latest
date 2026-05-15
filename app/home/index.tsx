import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (userData) {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const MenuButton = ({
    title,
    route,
  }: {
    title: string;
    route: any;
  }) => (
    <Pressable
      style={styles.menuButton}
      onPress={() => router.push(route)}
    >
      <Text style={styles.menuButtonText}>{title}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back 👋</Text>

        <Text style={styles.username}>
          {user?.username}
        </Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role?.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.menuContainer}>
        {user?.role === 'teamleader' ? (
          <>
            <MenuButton title="📋 View Tasks" route="/view-tasks" />
            <MenuButton title="➕ Create Task" route="/create-task" />
            <MenuButton title="👥 Assign Task" route="/assign-task" />
            <MenuButton title="🗑 Delete Task" route="/delete-task" />
            <MenuButton
              title="🔔 Notifications"
              route="/notification-page"
            />
          </>
        ) : user?.role === 'admin' ? (
          <>
            <MenuButton
              title="👤 Inactive Users"
              route="/inactive-users"
            />
            <MenuButton title="📋 View Tasks" route="/view-tasks" />
            <MenuButton title="❌ Delete User" route="/delete-user" />
          </>
        ) : (
          <MenuButton title="📋 User Tasks" route="/user-tasks" />
        )}
      </View>
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
    justifyContent: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 5,

    marginBottom: 25,
  },

  title: {
    fontSize: 20,
    color: '#6B7280',
    marginBottom: 8,
  },

  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
  },

  roleBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  roleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },

  email: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },

  menuContainer: {
    gap: 14,
  },

  menuButton: {
    backgroundColor: '#111827',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 3,
  },

  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});