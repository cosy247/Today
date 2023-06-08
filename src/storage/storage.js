const storageObject = {};

export function setStorage(key, data) {
    storageObject[key] = data;
    uni.setStorageSync(key, data);
}

export function getStorage(key) {
    if (storageObject.hasOwnProperty(key)) {
        return storageObject[key];
    } else {
        const data = uni.getStorageSync(key);
        storageObject[key] = data;
        return data;
    }
}

export function removeStorage(key) {
    delete storageObject[key];
    uni.removeStorageSync(key);
}
