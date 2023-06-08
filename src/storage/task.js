import { getStorage, removeStorage, setStorage } from './storage';


// /** 任务信息对象 */
// task: {
//     /** 任务id，添加时生成 */
//     id: 0,
//     /** 任务标题 */
//     title: '',
//     /** 任务打开次数 */
//     count: 1,
//     /** 是否为全天任务 */
//     isAllDay: true,
//     /** 任务地点 */
//     addr: '',
//     /** 任务标签，默认为第一个label */
//     label: {
//         color: taskLabelStorage.getAll()[0].color,
//         title: taskLabelStorage.getAll()[0].title,
//     },
//     /** 任务循环 */
//     recycle: {
//         /** 循环类型，one，day，week, moon */
//         type: 'one',
//         /** 循环间隔 */
//         interval: 0,
//         /** 周循环 */
//         weekIndexs: new Set([1, 2, 3, 4, 5]),
//         /** 月循环 */
//         moonIndexs: new Set([now.getDate()]),
//         /** 任务非全天的执行时间 */
//         time: {
//             start: now,
//             end: now,
//         },
//     },
//     /** 任务存在的日期时间 */
//     datetime: {
//         start: now,
//         end: now,
//     },
//     /** 任务执行数据 */
//     do: {
//         /** 任务目前执行次数 */
//         count: 0
//     }
// },

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
