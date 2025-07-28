// app/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [executiveId, setExecutiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const storedId = await AsyncStorage.getItem('executiveId');

        if (!storedRole || !storedId) {
          router.replace('/login');
          return;
        }

        setRole(storedRole);
        setExecutiveId(storedId);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading user role...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {role === 'delivery_executive' && executiveId && (
        <Button
          title="🚚 Executive Tracker"
          onPress={() => router.push(`/executive?eid=${executiveId}`)}
        />
      )}

      {role === 'admin' && (
        <Button title="🗺 Admin Map View" onPress={() => router.push('/admin')} />
      )}

      <Button
        title="🚪 Logout"
        color="red"
        onPress={async () => {
          await AsyncStorage.clear();
          router.replace('/login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 20, padding: 20 },
});
