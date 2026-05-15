import { Route, useRootNavigationState, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return; 
    router.replace('/register' as Route);
  }, [navigationState, router]);

  return null;
}
