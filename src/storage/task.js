import { getStorage, removeStorage, setStorage } from "./storage";

const storageDefaultValue = [];

const storageKey = 'task';
const storageRealValue = getStorage(storageKey) || [];
const storageValue = storageRealValue.length == 0 ? storageDefaultValue : storageRealValue;

export default {
    add({title, color}) {
        storageValue.push({title, color});
    },
    remove({color}) {
        storageValue.delete(color);
    },
    getAll() {
        return [...storageValue];
    }
}