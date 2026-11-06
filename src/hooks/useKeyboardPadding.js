//Entrada #39

import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export default function useKeyboardPadding() {
  const [padding, setPadding] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setPadding(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setPadding(0);
    });

    // Función de limpieza: deja de escuchar el teclado cuando la pantalla se cierra
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return padding;
}