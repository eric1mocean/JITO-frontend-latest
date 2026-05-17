import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>


        <Stack.Screen name="register/index" options={{ title: 'Register' }} />
        <Stack.Screen name="login/index" options={{ title: 'Login' }} />
        <Stack.Screen name="home/index" options={{ title: 'Home' }} />
        <Stack.Screen name="create-task/index" options={{ title: 'Create task' }} />
        <Stack.Screen name="view-tasks/index" options={{ title: 'View tasks' }} />
        <Stack.Screen name="teamleader-closed-tasks/index" options={{ title: 'Edit closed tasks' }} />
        <Stack.Screen name="assign-task/index" options={{ title: 'Assign task' }} />
        <Stack.Screen name="delete-task/index" options={{ title: 'Delete tasks' }} />
        <Stack.Screen name="delete-user/index" options={{ title: 'Delete users' }} />
        <Stack.Screen name="view-task-details/view-tasks/[id]" options={{ title: 'Task details' }} /> 
        <Stack.Screen name="user-tasks/index" options={{ title: "User tasks" }}  />
        <Stack.Screen name="inactive-users/index" options={{ title: "Inactive users" }} />
        <Stack.Screen name="notification-page/index" options={{ title: "Notifications" }}  
  
        


/>


      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}