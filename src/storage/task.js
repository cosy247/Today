import { getStorage, removeStorage, setStorage } from './storage';

const storageKey = 'task';
const storageValue = getStorage(storageKey) || [];

export default {
    add(task) {
        task.id = Date.now();
        task.do = { count: 0 };
        storageValue.push(task);
        setStorage(storageKey, storageValue);
    },
    remove(id) {
        const index = storageValue.findIndex((item) => item.id == id);
        storageValue.splice(index, 1);
        setStorage(storageKey, storageValue);
    },
    getAll() {
        return [...storageValue];
    },
};
