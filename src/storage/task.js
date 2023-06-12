import { getStorage, removeStorage, setStorage } from './storage';

// const dataTYpe = {
//     2023: {
//         6: {
//             11: {
//                 475823: {
//                     link: '2023/5/20/586458',
//                 },
//                 34285723: {
//                     links: ['2023/5/20/586458'],
//                     task: {
//                         links: ['2023/6/20/34512', '2023/6/24/43452'],
//                         task: {
//                             /** 任务id，添加时生成 */
//                             id: 0,
//                             /** 任务标题 */
//                             title: '',
//                             /** 任务打开次数 */
//                             count: 1,
//                             /** 是否为全天任务 */
//                             isAllDay: true,
//                             /** 任务地点 */
//                             addr: '',
//                             /** 任务标签，默认为第一个label */
//                             label: {
//                                 color: taskLabelStorage.getAll()[0].color,
//                                 title: taskLabelStorage.getAll()[0].title,
//                             },
//                             /** 任务循环 */
//                             recycle: {
//                                 /** 循环类型，one，day，week, moon */
//                                 type: 'one',
//                                 /** 循环间隔 */
//                                 interval: 0,
//                                 /** 周循环 */
//                                 weekIndexs: [1, 2, 3, 4, 5],
//                                 /** 月循环 */
//                                 moonIndexs: [now.getDate()],
//                                 /** 任务非全天的执行时间 */
//                                 time: {
//                                     start: now,
//                                     end: now,
//                                 },
//                                 /** 任务是否存在结束 */
//                                 isForever: false,
//                             },
//                             /** 任务存在的日期时间 */
//                             datetime: {
//                                 start: now,
//                                 end: now,
//                             },
//                             /** 任务执行数据 */
//                             done: {
//                                 /** 任务目前执行次数 */
//                                 count: 0,
//                                 /** 任务置顶系数 */
//                                 top: 0,
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     },
//     forever: [],
// };

const storageKey = 'task';
const storageValue = getStorage(storageKey) || { forever: [] };

export default {
    /**
     * @description: 添加任务
     */
    add(task) {
        task.id = Date.now();
        task.done = { count: 0, top: 0 };
        if (task.recycle.isForever) {
            storageValue.forever.push(task);
        } else {
            // 将任务储存在第一天,之后的任务用link查找
            const startDate = new Date(task.datetime.start);
            const dateString = startDate.toLocaleDateString();
            const [year, moon, day] = dateString.split('/');
            const links = [];
            const linkTag = `${dateString}/${task.id}`;
            if (!storageValue[year]) storageValue[year] = {};
            if (!storageValue[year][moon]) storageValue[year][moon] = {};
            if (!storageValue[year][moon][day]) storageValue[year][moon][day] = {};
            storageValue[year][moon][day][task.id] = { links, task };

            // 获取link任务开始时间戳
            const startDateValue = new Date(`${dateString} 24:00:00`).valueOf();

            // 获取link任务结束时间戳
            const endtDate = new Date(task.datetime.end);
            const endDateValue = new Date(`${endtDate.toLocaleDateString()} 00:00:00`).valueOf();

            // 循环添加link任务
            if (task.recycle.type === 'one') {
                for (let i = startDateValue; i <= endDateValue; i += 1000 * 60 * 60 * 24) {
                    // 添加link任务
                    const linkDate = new Date(i);
                    const [year, moon, day] = linkDate.toLocaleDateString().split('/');
                    if (!storageValue[year]) storageValue[year] = {};
                    if (!storageValue[year][moon]) storageValue[year][moon] = {};
                    if (!storageValue[year][moon][day]) storageValue[year][moon][day] = {};
                    storageValue[year][moon][day][task.id] = { link: linkTag, done: {} };

                    // 源任务添加link
                    links.push(`${linkDate.toLocaleDateString()}/${task.id}`);
                }
            } else if (task.recycle.type === 'day') {
                let interval = 0;
                for (let i = startDateValue; i <= endDateValue; i += 1000 * 60 * 60 * 24) {
                    // 设置间隔
                    if (task.recycle.interval > 0) {
                        if (++interval === task.recycle.interval) {
                            interval = 0;
                            continue;
                        }
                    }

                    // 添加link任务
                    const linkDate = new Date(i);
                    const [year, moon, day] = linkDate.toLocaleDateString().split('/');
                    if (!storageValue[year]) storageValue[year] = {};
                    if (!storageValue[year][moon]) storageValue[year][moon] = {};
                    if (!storageValue[year][moon][day]) storageValue[year][moon][day] = {};
                    storageValue[year][moon][day][task.id] = { link: linkTag, done: { count: 0 } };

                    // 源任务添加link
                    links.push(`${linkDate.toLocaleDateString()}/${task.id}`);
                }
            } else if (task.recycle.type === 'week') {
                let interval = 0;
                for (let i = startDateValue; i <= endDateValue; i += 1000 * 60 * 60 * 24) {
                    const linkDate = new Date(i);
                    const weekDay = linkDate.getDay();

                    // 设置间隔
                    if (task.recycle.interval > 0) {
                        if (weekDay === 1) interval++;
                        if (interval === task.recycle.interval) {
                            interval = 0;
                            i += 1000 * 60 * 60 * 24 * 6;
                            continue;
                        }
                    }

                    // 添加link任务
                    if (task.recycle.weekIndexs.includes(weekDay)) {
                        const [year, moon, day] = linkDate.toLocaleDateString().split('/');
                        if (!storageValue[year]) storageValue[year] = {};
                        if (!storageValue[year][moon]) storageValue[year][moon] = {};
                        if (!storageValue[year][moon][day]) storageValue[year][moon][day] = {};
                        storageValue[year][moon][day][task.id] = { link: linkTag, done: { count: 0 } };
                    }

                    // 源任务添加link
                    links.push(`${linkDate.toLocaleDateString()}/${task.id}`);
                }
            } else if (task.recycle.type === 'moon') {
                let interval = 0;
                for (let i = startDateValue; i <= endDateValue; i += 1000 * 60 * 60 * 24) {
                    const linkDate = new Date(i);
                    const moonDay = linkDate.getDate();

                    // 设置间隔
                    if (task.recycle.interval > 0) {
                        if (moonDay === 1) interval++;
                        if (interval === task.recycle.interval) {
                            interval = 0;
                            i = linkDate.setMonth(linkDate.getMonth() + 1) - 1000 * 60 * 60 * 24;
                            continue;
                        }
                    }

                    // 添加link任务
                    if (task.recycle.moonIndexs.includes(moonDay)) {
                        const [year, moon, day] = linkDate.toLocaleDateString().split('/');
                        if (!storageValue[year]) storageValue[year] = {};
                        if (!storageValue[year][moon]) storageValue[year][moon] = {};
                        if (!storageValue[year][moon][day]) storageValue[year][moon][day] = {};
                        storageValue[year][moon][day][task.id] = { link: linkTag, done: { count: 0 } };
                    }

                    // 源任务添加link
                    links.push(`${linkDate.toLocaleDateString()}/${task.id}`);
                }
            }
        }
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
        const [year, moon, day] = new Date(date).toLocaleDateString().split('/');
        const tasks = (storageValue[year] && storageValue[year][moon] && storageValue[year][moon][day]) || {};
        return Object.entries(tasks).map(([id, { task, link, done }]) => {
            if (link) {
                const [year, moon, day, id] = link.split('/');
                console.log([year, moon, day, id]);
                const originTask = storageValue[year][moon][day][id].task;
                return {
                    ...originTask,
                    done: new Proxy(done, {
                        get(data, key) {
                            return data.hasOwnProperty(key) ? data[key] : originTask.done[key];
                        },
                        set(data, key, value) {
                            data.hasOwnProperty(key) ? (data[key] = value) : (originTask.done[key] = value);
                            return true;
                        }
                    }),
                };
            } else {
                return task;
            }
        });
    },

    /**
     * @description: 同步数据到库
     */
    update() {
        console.log(storageValue);
        setStorage(storageKey, storageValue);
    },
};
