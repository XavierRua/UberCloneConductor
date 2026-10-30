// AI-assisted: see docs/AI_LOG.md #15
// Prueba TEMPORAL de conexión con Firestore. Se reemplaza en el siguiente avance.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './src/config/firebaseConfig';

export default function App() {
  const [message, setMessage] = useState('Probando conexión con Firebase...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        await setDoc(doc(db, 'connectionTest', 'ping'), { createdAt: Date.now() });
        setMessage('Conexión exitosa con Firestore');
      } catch (error) {
        setMessage(`Error al conectar: ${error.message}`);
      }
    };
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      {/* Mensaje con el resultado de la prueba */}
      <Text style={styles.text}>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 16, textAlign: 'center' },
});