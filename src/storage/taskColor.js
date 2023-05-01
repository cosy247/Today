import { getStorage, removeStorage, setStorage } from './storage';

const storageKey = 'taskColor';
const storageValue = new Set(getStorage(storageKey) || ['#54d2d2aa', '#ffcb00aa', '#f8aa4baa', '#ff6150aa', '#ff00ffaa', '#00ff00aa', '#ed8a0aaa', '#f6d912aa']);

export default {
    add({ color }) {
        storageValue.add(color);
    },
    remove({ color }) {
        storageValue.delete(color);
    },
    getAll() {
        return [...storageValue];
    },
};
