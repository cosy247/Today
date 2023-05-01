import { getStorage, removeStorage, setStorage } from "./storage";

const storageKey = 'task';
const storageValue = [...getStorage(storageKey)];

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