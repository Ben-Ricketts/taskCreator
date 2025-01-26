import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHA256 } from 'crypto-js';

const DEVICE_ID_KEY = '@TaskApp:deviceId';

const hashDeviceId = (deviceId) => {
  const hashedId = SHA256(deviceId).toString();
  console.log('Generated hash for device ID:', hashedId);
  return hashedId;
};

const generateDeviceId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const rawDeviceId = `device_${timestamp}_${random}`;
  console.log('Generated raw device ID:', rawDeviceId);
  return hashDeviceId(rawDeviceId);
};

export const getDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    console.log('Retrieved device ID from storage:', deviceId);
    if (!deviceId) {
      console.log('No device ID found, generating new one...');
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      console.log('Saved new device ID to storage:', deviceId);
    }
    return deviceId;
  } catch (error) {
    console.error('Error managing device ID:', error);
    return null;
  }
};
