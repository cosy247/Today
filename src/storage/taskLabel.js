import { getStorage, removeStorage, setStorage } from './storage';

const storageDefaultValue = [
    {
        color: '#54d2d2aa',
        title: '其他',
    },
    {
        color: '#ffcb00aa',
        title: '学习',
    },
    {
        color: '#f8aa4baa',
        title: '健身',
    },
    {
        color: '#ff6150aa',
        title: '家务',
    },
];

const storageKey = 'taskColor';
const storageRealValue = getStorage(storageKey) || [];
const storageValue = storageRealValue.length == 0 ? storageDefaultValue : storageRealValue;

export default {
    getAll() {
        return storageValue;
    },
};
