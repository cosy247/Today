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
//         /** 任务是否存在结束 */
//         isForever: false,
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
//         /** 任务置顶系数 */
//         top: 0
//     }
// },

const storageKey = 'task';
const storageValue = getStorage(storageKey) || [];

export default {
    /**
     * @description: 添加任务
     */
    add(task) {
        task.id = Date.now();
        task.do = { count: 0, top: 0 };
        storageValue.push(task);
        this.update();
    },
    /**
     * @description: 修改任务
     */
    edit(id, task) {
        const oldTask = storageValue.find((item) => item.id == id);
        Object.assign(oldTask, task);
        oldTask.id = id;
        this.update();
    },
    /**
     * @description: 移除任务
     */
    remove(id) {
        const index = storageValue.findIndex((item) => item.id == id);
        storageValue.splice(index, 1);
        this.update();
    },
    /**
     * @description: 获取全部任务
     */
    getAll() {
        return [...storageValue];
    },
    /**
     * @description: 获取指定日期的任务
     */
    getDay(date = new Date()) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        const dateStartValue = date.valueOf();
        const weekDay = date.getDay();
        date.setHours(24);
        const dateEndValue = date.valueOf();
        date.setHours(-24 * weekDay);
        const dateWeekValue = date.valueOf();
        
        return storageValue.filter((item) => {
            const itemDateStartValue = new Date(item.datetime.start).valueOf();
            const itemDateEndValue = item.datetime.end ? new Date(item.datetime.end).valueOf() : Infinity;
            if (itemDateStartValue > dateEndValue && itemDateEndValue < dateStartValue) {
                return false;
            }
            if (item.recycle.type === 'one') {
                return true;
            } else if (item.recycle.type === 'week') {
                if(!item.recycle.weekIndexs.includes(weekDay)) {
                    return false;
                }
                if(item.recycle.interval > 0) {
                    const itemWeekDateValue = new Date().setDate(weekDay);
                    return item.recycle.weekIndexs.includes(weekDay);
                }
                return true;
            } else if (item.recycle.type === 'moon') {
                return item.recycle.weekIndexs.moonIndexs(weekDay);
            }
        });
    },
    /**
     * @description: 同步数据到库
     */
    update() {
        setStorage(storageKey, storageValue);
    },
};
