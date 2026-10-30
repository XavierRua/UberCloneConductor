import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveData = async (key, value) => {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.log('Error al guardar:', error);
  }
};


export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.log('Error al leer:', error);
    return null;
  }
};


export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error al eliminar:', error);
  }
};


export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log('Error al limpiar todo:', error);
  }
};


export const getAllData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    return result; // [[llave, valor], [llave, valor], ...]
  } catch (error) {
    console.log('Error al leer todas las llaves:', error);
    return [];
  }
};