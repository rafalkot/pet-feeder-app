import { SecureStore } from 'expo'

export const Storage = {
    get: async(key) => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (err) {
            console.log('err' + err);
            throw new Error(err)
        }
    },
    set: async (key, data) => {
        console.log('Sotrage set key:' + key + ' data: ' + data)
        return SecureStore.setItemAsync(key, data)
    },
    clear: async (key) => {
        return SecureStore.deleteItemAsync(key)
    },
}