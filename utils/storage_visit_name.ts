import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  },

    // New method to clear storage
    clearStorage: async (): Promise<void> => {
        try {
          await AsyncStorage.clear();
          console.log('AsyncStorage has been cleared successfully');
        } catch (error) {
          console.error('Error clearing AsyncStorage:', error);
        }
      },
      // Optional: Method to remove a specific key
      removeItem: async (key: string): Promise<void> => {
        try {
          await AsyncStorage.removeItem(key);
          console.log(`Item with key '${key}' has been removed from AsyncStorage`);
        } catch (error) {
          console.error(`Error removing item with key '${key}' from AsyncStorage:`, error);
        }
      }
};

