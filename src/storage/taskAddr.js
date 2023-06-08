import { getStorage, removeStorage, setStorage } from './storage';

const storageDefaultValue = ['家','学校','公司','公园'];

const storageKey = 'taskColor';
const storageRealValue = getStorage(storageKey) || [];
const storageValue = storageRealValue.length == 0 ? storageDefaultValue : storageRealValue;

export default {
    getAll() {
        return storageValue;
    },
};
