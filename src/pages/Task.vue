<template>
    <view class="task-root background" :style="{ left: showAddTask ? '-50%' : '0%' }">
        <view class="task-header">
            <view class="task-header-time font">今天</view>
            <view class="task-header-precent">10/20</view>
            <view class="task-header-add" @click="showAddTask = true">&#xe624;</view>
        </view>
        <view class="task-items">
            <view class="task-empty" v-if="tasks.length == 0">
                <view class="task-empty-text font">点击右上角加号添加任务</view>
            </view>
            <view v-for="item in tasks" :key="item.id" :class="{ 'task-item': 1, 'task-item-hide': taskInfos[item.id].hide }">
                <view class="task-item-cont" :style="`right: ${taskInfos[item.id].offset}px; transition: right ${taskInfos[item.id].isTouch ? 0 : 0.2}s;`" @touchmove="taskItemTouchMove(item, $event)" @touchstart="taskItemTouchStart(item, $event)" @touchend="taskItemTouchEnd(item, $event)" @click="countTask(item)">
                    <view class="task-item-title">{{ item.title }}</view>
                    <view class="task-item-info">
                        <view class="task-item-info-time" v-show="taskInfos[item.id].datatime">&#xe60f;&nbsp;{{ taskInfos[item.id].datatime }}</view>
                        <view class="task-item-info-addr" v-show="item.addr">&#xe615;&nbsp;{{ item.addr }}</view>
                    </view>
                    <view class="task-item-range" :style="`background: ${item.label.color}; width: ${(item.do.count * 100) / item.count}%; border-color: ${item.label.color};`"></view>
                </view>
                <view class="task-item-options" :style="`opacity: ${taskInfos[item.id].offset / this.touchOffsetMax}`">
                    <view class="task-item-option" @click="editTask(item)">&#xe622;</view>
                    <view class="task-item-option" @click="resetTask(item)">&#xe648;</view>
                    <view class="task-item-option" @click="toTopTask(item)">&#xe62b;</view>
                    <view class="task-item-option" @click="deleteTask(item)">&#xe658;</view>
                </view>
            </view>
        </view>
    </view>

    <!-- 实例 -->
    <Tab class="task-tab" :style="{ bottom: showAddTask ? '-100%' : '' }" />
    <AddTask class="task-add" :style="{ left: showAddTask ? 0 : '110%' }" :hide="hiddenAddTask" :taskData="addTaskData" />

    <!-- 单例 -->
    <DatetimePickerVue />
    <MessageBox />
</template>

<script>
    import task from '../storage/task.js';
    import Tab from '../components/Tab';
    import AddTask from './AddTask';
    import DatetimePickerVue from '../components/DatetimePicker.vue';
    import MessageBox from '../components/MessageBox.vue';

    export default {
        components: { Tab, AddTask, DatetimePickerVue, MessageBox },
        data: () => ({
            /** 任务列表 */
            tasks: [],
            /** 任务单页面信息[{offset, isTouch, hide, datatime}] */
            taskInfos: {},
            /** 是否显示添加任务界面 */
            showAddTask: false,
            /** 任务条触摸开始的x */
            touchStartX: 0,
            /** 任务条触摸开始的时间 */
            touchStartTime: 0,
            /** 任务条滑动最大值 */
            touchOffsetMax: uni.upx2px(250),
            /** 任务添加的默认数据，用户任务修改 */
            addTaskData: {},
        }),
        beforeMount() {
            this.updateData();
        },
        methods: {
            /**
             * @description: 任务更新数据
             */
            updateData() {
                this.tasks = task.getDay().sort((t1, t2) => (t2.do.top == t1.do.top ? t2.id - t1.id : t2.do.top - t1.do.top));
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
            taskItemTouchStart({ id }, { touches: [{ clientX }] }) {
                this.touchStartX = clientX + (this.taskInfos[id].offset || 0);
                this.touchStartTime = +Date.now().valueOf();
                this.taskInfos[id].isTouch = true;
            },
            /**
             * @description: 移动taskItem
             */
            taskItemTouchMove({ id }, { touches: [{ clientX }] }) {
                this.taskInfos[id].offset = this.touchStartX - clientX;
            },
            /**
             * @description: 移动taskItem结束
             */
            taskItemTouchEnd({ id }) {
                this.taskInfos[id].isTouch = false;
                if (this.taskInfos[id].offset >= this.touchOffsetMax || this.taskInfos[id].offset / (+Date.now().valueOf() - this.touchStartTime) > 0.8) {
                    this.taskInfos[id].offset = this.touchOffsetMax;
                } else {
                    this.taskInfos[id].offset = 0;
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
                task.do.count = 0;
                this.taskInfos[task.id].offset = 0;
            },
            /**
             * @description: 置顶任务
             */
            toTopTask(task) {
                this.taskInfos[task.id].hide = true;
                this.taskInfos[task.id].offset = 0;
                setTimeout(() => {
                    task.do.top = +new Date().valueOf();
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
                    task.remove(id);
                    this.updateData();
                }, 310);
            },
            /**
             * @description: 点击任务条事件回调：完成一次任务
             * @param {object} task: 完成的任务
             */
            countTask(task) {
                if (task.do.count >= task.count) return;
                task.do.count++;
            },
        },
    };
</script>

<style>
    .task-root {
        position: absolute;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: 0.3s;
    }
    .task-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx 50rpx;
        font-size: var(--fontSize-m);
    }
    .task-header-time {
    }
    .task-header-add {
    }
    .task-items {
        flex: 1;
        padding-bottom: 200rpx;
        margin-bottom: 20rpx;
        overflow: auto;
    }
    .task-empty {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: var(--fontSize-s);
    }
    .task-item {
        position: relative;
        margin: 30rpx auto 0;
        height: 130rpx;
        width: 600rpx;
        overflow-y: clip;
        transition: 0.3s;
        animation: task-item-toping 0.3s;
    }
    @keyframes task-item-toping {
        0% {
            height: 0rpx;
            margin: 0rpx auto;
        }
    }
    .task-item-hide {
        height: 0rpx;
        margin: 0rpx auto;
    }
    .task-item-cont {
        position: relative;
        padding: 20rpx 50rpx;
        border-radius: 20rpx;
        background: #ccc8;
        box-shadow: inset -10rpx 10rpx 10rpx #aaa4;
        /* border-left: 20rpx solid; */
    }
    .task-item-title {
        position: relative;
        z-index: 2;
        flex: 1;
        font-size: 35rpx;
    }
    .task-item-info {
        position: relative;
        z-index: 2;
        font-size: 10rpx;
        color: #555;
        display: flex;
    }
    .task-item-info-time {
        margin-top: 5rpx;
        margin-right: 15rpx;
    }
    .task-item-info-addr {
        margin-top: 5rpx;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 33rpx;
        white-space: nowrap;
    }
    .task-item-range {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        min-width: 40rpx;
        border-radius: 20rpx;
        z-index: 0;
        box-shadow: inset -10rpx -10rpx 10rpx #aaa8;
        box-sizing: border-box;
        border-left: 20rpx solid inherit;
    }
    .task-item-options {
        position: absolute;
        right: 10rpx;
        top: 50%;
        font-size: 40rpx;
        transform: translateY(-50%);
        display: flex;
    }
    .task-item-option {
        margin-left: 10px;
    }
    .task-tab {
        transition: 0.3s;
    }
    .task-add {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        transition: 0.3s;
    }
</style>
