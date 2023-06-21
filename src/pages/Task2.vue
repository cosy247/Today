<template>
    <view class="home-root" :style="{ left: showAddTask ? '-50%' : '0%' }">
        <view class="home-header">
            <view>{{ year }}年{{ month }}月</view>
            <view @click="showAddTask = true">&#xe624;</view>
        </view>
        <!-- <view class="home-calendar">
            <view class="home-calendar-weeks">
                <view class="home-calendar-week" v-for="item in '一二三四五六日'">{{ item }}</view>
            </view>
            <view class="home-calendar-days" :style="{ height: `${Math.ceil(days.length / 7) * 130}rpx` }">
                <view :class="{ 'home-calendar-day': true, 'home-calendar-hidden': item.month !== this.month }" v-for="item in days">
                    <view :class="{ 'home-calendar-num': true, 'home-calendar-current': item.day === this.day }">{{ item.day }}</view>
                    <view :class="{ 'home-calendar-tag': 1, 'home-calendar-tag-special': item.isSpecial }">{{ item.tag }}</view>
                </view>
            </view>
        </view> -->
        <TaskCalendar :year="year" :month="month" :day="day"/>
        <TaskList :year="year" :month="month" :day="day"/>
        <!-- <view class="home-task">
            <view class="home-task-header">
                <view class="home-task-header-date">{{ month }}月{{ day }}日</view>
                <view class="home-task-header-interval">{{ intervalDay }}</view>
            </view>
            <view class="home-task-items">
                <view v-for="item in tasks" :key="item.id" :class="{ 'home-task-item': 1, 'home-task-item-touch': touchTaskId === item.id }" @touchmove="taskItemTouchMove(item, $event)" @touchstart="taskItemTouchStart(item, $event)" @touchend="taskItemTouchEnd(item, $event)">
                    <view class="home-task-item-title-status"></view>
                    <view>
                        <view class="home-task-item-title">{{ item.title }}</view>
                        <view class="home-task-item-info">
                            <view class="home-task-item-info-time" v-show="taskInfos[item.id].datatime">&#xe60f;&nbsp;{{ taskInfos[item.id].datatime }}</view>
                            <view class="home-task-item-info-addr" v-show="item.addr">&#xe615;&nbsp;{{ item.addr }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view> -->
    </view>

    <!-- 实例 -->
    <!-- <Tab class="home-tab" :style="{ bottom: showAddTask ? '-100%' : '' }" /> -->
    <!-- <AddTask class="home-add" :style="{ left: showAddTask ? 0 : '110%' }" :hide="hiddenAddTask" :taskData="addTaskData" /> -->

    <!-- 单例 -->
    <DatetimePickerVue />
    <MessageBox />
</template>

<script>
    import taskStorage from '../storage/task.js';
    import Tab from '../components/Tab';
    import AddTask from './AddTask';
    import DatetimePickerVue from '../components/DatetimePicker';
    import MessageBox from '../components/MessageBox';
    import TaskCalendar from '../components/TaskCalendar';
    import TaskList from '../components/TaskList';

    export default {
        components: { Tab, AddTask, DatetimePickerVue, MessageBox, TaskCalendar, TaskList },
        data: () => ({
            /** 当前年 */
            year: 0,
            /** 当前月 */
            month: 0,
            /** 当前日 */
            day: 0,
            /** 任务列表 */
            tasks: [],
            /** 任务单页面信息[{offset, isTouch, hide, datatime}] */
            taskInfos: {},
            /** 是否显示添加任务界面 */
            showAddTask: false,
            /** 触摸开始的x */
            touchStartX: 0,
            /** 触摸开始的y */
            touchStartY: 0,
            /** 任务条触摸开始的时间 */
            touchStartTime: 0,
            /** 当前触摸的任务id */
            touchTaskId: null,
            /** 任务条滑动最大值 */
            touchOffsetMax: uni.upx2px(150),
            /** 任务添加的默认数据，用户任务修改 */
            addTaskData: {},
        }),
        beforeMount() {
            const now = new Date();
            this.year = now.getFullYear();
            this.month = now.getMonth() + 1;
            this.day = now.getDate();
            this.updateData(false);
        },
        methods: {
            /**
             * @description: 任务更新数据
             * @param {bool} update: 是否需要更新源数据
             */
            updateData(update = true) {
                update && taskStorage.update();
                this.tasks = taskStorage.getDay().sort((t1, t2) => (t2.done.top == t1.done.top ? t2.id - t1.id : t2.done.top - t1.done.top));
                this.taskInfos = this.tasks.reduce((infos, item) => {
                    if (!infos[item.id]) {
                        infos[item.id] = { offset: 0, isTouch: false, hide: false, datatime: this.getItemDatatime(item) };
                    }
                    return infos;
                }, this.taskInfos);
            },
            /**
             * @description: 获取任务时间
             */
            getItemDatatime(item) {
                if (item.datetime.start) {
                    item.datetime.start = new Date(item.datetime.start);
                    item.datetime.end = new Date(item.datetime.end);
                    item.recycle.time.start = new Date(item.recycle.time.start);
                    item.recycle.time.end = new Date(item.recycle.time.end);
                }
                if (item.recycle.type == 'one') {
                    const allDays = Math.round((new Date(item.datetime.end.toLocaleDateString()) - new Date(item.datetime.start.toLocaleDateString())) / 1000 / 60 / 60 / 24);
                    const currentDay = Math.round((new Date().setHours(0) - new Date(item.datetime.start.toLocaleDateString())) / 1000 / 60 / 60 / 24);
                    if (item.isAllDay) {
                        return allDays > 0 ? `全天(${currentDay + 1}/${allDays + 1})` : '全天';
                    } else {
                        const start = currentDay == 0 ? item.datetime.start.toLocaleTimeString().slice(0, 5) : '0:0';
                        const end = currentDay == allDays ? item.datetime.end.toLocaleTimeString().slice(0, 5) : '0:0';
                        return (start === end ? start : `${start}-${end}`) + (allDays > 0 ? `(${currentDay + 1}/${allDays + 1})` : '');
                    }
                } else {
                    if (item.isAllDay) {
                        return '全天';
                    } else {
                        const start = item.recycle.time.start.slice(11, 16);
                        const end = item.recycle.time.end.slice(11, 16);
                        return end === start ? start : `${start} - ${end}`;
                    }
                }
            },
            /**
             * @description: 隐藏添加任务界面
             */
            hiddenAddTask() {
                this.showAddTask = false;
                this.addTaskData = {};
                this.updateData();
            },
            /**
             * @description: 开始移动taskItem
             */
            taskItemTouchStart({ id }, { touches: [{ clientX, clientY }] }) {
                this.touchStartX = clientX;
                this.touchStartY = clientY;
                this.touchStartTime = +Date.now().valueOf();
                this.touchTaskId = id;
                setTimeout(() => {
                    this.touchTaskId = null;
                    alert(id);
                }, 1500);
            },
            /**
             * @description: 移动taskItem
             */
            taskItemTouchMove() {
                this.touchTaskId = null;
            },
            /**
             * @description: 移动taskItem结束
             */
            taskItemTouchEnd(task) {
                this.touchTaskId = null;
                const touchSpanTime = (new Date() - this.touchStartTime);
                if(touchSpanTime < 500) {
                    if (task.done.count >= task.count) return;
                    task.done.count++;
                    this.updateData();
                }
            },
            /**
             * @description: 点击任务编辑事件回调
             */
            editTask(task) {
                this.taskInfos[task.id].offset = 0;
                this.addTaskData = JSON.parse(JSON.stringify(task));
                this.showAddTask = true;
            },
            /**
             * @description: 点击任务重置事件回调
             */
            resetTask(task) {
                task.done.count = 0;
                this.taskInfos[task.id].offset = 0;
                this.updateData();
            },
            /**
             * @description: 置顶任务
             */
            toTopTask(task) {
                this.taskInfos[task.id].hide = true;
                this.taskInfos[task.id].offset = 0;
                setTimeout(() => {
                    task.done.top = +new Date().valueOf();
                    this.taskInfos[task.id].hide = false;
                    this.updateData();
                }, 310);
            },
            /**
             * @description: 点击任务删除事件回调
             */
            deleteTask({ id }) {
                this.taskInfos[id].hide = true;
                this.taskInfos[id].offset = 0;
                setTimeout(() => {
                    taskStorage.remove(id);
                    this.updateData();
                }, 310);
            },
            /**
             * @description: 点击任务条事件回调：完成一次任务
             * @param {object} task: 完成的任务
             */
            countTask(task) {
                if (task.done.count >= task.count) return;
                task.done.count++;
                this.updateData();
            },
        },
    };
</script>

<style>
    .home-root {
        position: absolute;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: 0.3s;
    }
    .home-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30rpx 40rpx 0;
        font-size: 40rpx;
        font-weight: 900;
    }
</style>
