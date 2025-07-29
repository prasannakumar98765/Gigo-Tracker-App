// app/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { LOCATION_TASK_NAME } from '../utils/backgroundLocation';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [executiveId, setExecutiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const storedId = await AsyncStorage.getItem('executiveId');

        if (!storedRole || !storedId) {
          router.replace('/login');
          return;
        }

        setRole(storedRole);
        setExecutiveId(storedId);

        if (storedRole === 'delivery_executive') {
          await startBackgroundLocationTask();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const startBackgroundLocationTask = async () => {
    try {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        Alert.alert('Permission required', 'Foreground location permission is needed.');
        return;
      }

  

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        Alert.alert('Permission required', 'Background location permission is needed.');
        return;
      }

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!hasStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          distanceInterval: 20, // meters
          timeInterval: 10000, // ms
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Tracking Location',
            notificationBody: 'Your location is being used for delivery tracking.',
            notificationColor: '#0000ff',
          },
          pausesUpdatesAutomatically: false,
        });
        console.log('✅ Background location tracking started');
      }
    } catch (err: any) {
      console.error('❌ Failed to start background task:', err.message);
    }
  };

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
