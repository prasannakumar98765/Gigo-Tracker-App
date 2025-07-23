import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import socket from '../socket';

interface Executive {
  _id: string;
  name: string;
  status: string;
  currentLocation?: {
    lat: number;
    lng: number;  // changed from lan
  };
}

export default function Admin() {
  const [executives, setExecutives] = useState<Record<string, Executive>>({});

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/delivery/executives')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data: Executive[]) => {
        const execMap: Record<string, Executive> = {};
        data.forEach((exec) => {
          execMap[exec._id] = exec;
        });
        setExecutives(execMap);
      })
      .catch((error) => {
        console.error('Failed to fetch executives:', error);
      });

    const handleUpdate = (data: {
      executiveId: string;
      lat: number;
      lng: number;  // changed from lan
    }) => {
      setExecutives((prev) => ({
        ...prev,
        [data.executiveId]: {
          ...prev[data.executiveId],
          currentLocation: { lat: data.lat, lng: data.lng },
        },
      }));
    };

    socket.on('executiveLocationUpdated', handleUpdate);

    return () => {
      socket.off('executiveLocationUpdated', handleUpdate);
    };
  }, []);

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: 20.5937,
        longitude: 78.9629,
        latitudeDelta: 5,
        longitudeDelta: 5,
      }}
    >
      {Object.values(executives).map((exec) =>
        exec.currentLocation?.lat ? (
          <Marker
            key={exec._id}
            coordinate={{
              latitude: exec.currentLocation.lat,
              longitude: exec.currentLocation.lng,  // changed from lan
            }}
            title={exec.name}
            description={`Status: ${exec.status}`}
          />
        ) : null
      )}
    </MapView>
  );
}
