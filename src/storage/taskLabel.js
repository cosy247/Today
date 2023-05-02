import { getStorage, removeStorage, setStorage } from './storage';

const storageKey = 'taskColor';
const storageRealValue = getStorage(storageKey);
const storageValue =
    storageRealValue.length == 0
        ? [
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
          ]
        : storageRealValue;
export default {
    getAll() {
        return storageValue;
    },
};
