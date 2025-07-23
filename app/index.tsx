import { useRouter } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="🚚 Executive Tracker" onPress={() => router.push('/executive?eid=EXEC1')} />
      <Button title="🗺 Admin Map View" onPress={() => router.push('/admin')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 20, padding: 20 },
});
