<template>
    <view class="addTask-root background">
        <view class="addTask-header">
            <view class="addTask-header-close" @click="hidePage">&#xe658;</view>
            <view class="addTask-header-title font">添加代办</view>
            <view class="addTask-header-add" @click="createTask">&#xe664;</view>
        </view>
        <view class="addTask-content">
            <view class="addTask-content-title" :style="{ background: task.label.color }">
                <input type="text" placeholder="输入标题" v-model="task.title" />
            </view>
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">任务标签：</view>
            </view>
            <view class="addTask-content-labels">
                <view class="addTask-content-label" v-for="item in labels" :style="{ background: item.color }" @click="task.label.color = item.color">
                    {{ item.title }}
                </view>
            </view>
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">打卡次数：</view>
            </view>
            <view class="addTask-content-counts">
                <view class="addTask-content-count" :style="{ background: task.count == count ? task.label.color : '' }" v-for="count in taskCount" @click="task.count = count">{{ count }}</view>
                <input class="addTask-content-count" :style="{ background: task.count == taskCountInput ? task.label.color : '' }" type="number" v-model="taskCountInput" placeholder="自" @blur="changeTaskCount" />
            </view>
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">任务循环：</view>
                <view class="addTask-content-recycles">
                    <view class="addTask-content-recycle" v-for="item in taskRecycles" :style="{ background: item.type == task.recycle.type ? task.label.color : '' }" @click="task.recycle.type = item.type">{{ item.text }}</view>
                </view>
            </view>

            <!-- 不同任务循环显示不同选择 -->
            <view class="addTask-content-block" :style="{ borderLeftColor: task.label.color }">
                <!-- 一次任务循环 -->
                <view v-show="task.recycle.type == 'one'">
                    <!-- 时间选择 -->
                    <view class="addTask-content-titleLine">
                        <view class="addTask-content-subTitle">任务日期：</view>
                        <view class="addTask-content-dateTypes">
                            <view class="addTask-content-dateType" v-for="(item, index) in ['全天', '非全天']" :style="{ background: index == task.isAllDay ? '' : task.label.color }" @click="task.isAllDay = !index">{{ item }}</view>
                        </view>
                    </view>
                    <view class="addTask-content-datetime">
                        <view class="addTask-content-datetime-select" @click="selecteTaskStart">
                            {{ task.datetime.start.toLocaleDateString() }}
                            <br />
                            {{ task.isAllDay ? '' : task.datetime.start.toLocaleTimeString().slice(0, 5) }}
                        </view>
                        <view class="addTask-content-datetime-tip" :style="{ color: task.label.color }">
                            共{{ intervalTime.day }}天
                            <view v-if="!task.isAllDay">{{ String(intervalTime.hours).padStart(2, 0) }}:{{ String(intervalTime.minutes).padStart(2, 0) }}小时</view>
                        </view>
                        <view class="addTask-content-datetime-select" @click="selecteTaskEnd">
                            {{ task.datetime.end.toLocaleDateString() }}
                            <br />
                            {{ task.isAllDay ? '' : task.datetime.end.toLocaleTimeString().slice(0, 5) }}
                        </view>
                    </view>
                </view>
                <!-- 循环 -->
                <view v-show="task.recycle.type !== 'one'">
                    <!-- 时间间隔 -->
                    <view class="addTask-content-titleLine">
                        <view class="addTask-content-subTitle">任务间隔：</view>
                    </view>
                    <view class="addTask-content-interval">
                        <view class="addTask-content-tip">
                            {{ intervalTip }}
                        </view>
                        <view class="addTask-content-interval-count">
                            <view class="addTask-content-interval-option" @click="task.recycle.interval != 0 && task.recycle.interval--">&#xea6d;</view>
                            <view :style="{ color: task.label.color }">{{ task.recycle.interval }}天</view>
                            <view class="addTask-content-interval-option" @click="task.recycle.interval++">&#xea6e;</view>
                        </view>
                    </view>
                    <!-- 时间选择 -->
                    <view v-show="task.recycle.type !== 'day'">
                        <view class="addTask-content-titleLine">
                            <view class="addTask-content-subTitle">时间选择：</view>
                        </view>
                        <!-- 按周循环的任务 -->
                        <view class="addTask-content-selectWeeks" v-show="task.recycle.type == 'week'">
                            <view class="addTask-content-selectWeek" v-for="(item, index) in '一二三四五六日'" @click="selectWeekDay(index + 1)" :style="{ background: task.recycle.weekIndexs.includes(index + 1) ? task.label.color : '' }">{{ item }}</view>
                        </view>
                        <!-- 按月循环的任务 -->
                        <view class="addTask-content-selectMoons" v-show="task.recycle.type == 'moon'">
                            <view class="addTask-content-selectMoon" v-for="(item, index) in 31" @click="selectMoonDay(index + 1)" :style="{ background: task.recycle.moonIndexs.includes(index + 1) ? task.label.color : '' }">{{ item }}</view>
                            <view class="addTask-content-clearMoon" @click="task.recycle.moonIndexs = []">清空</view>
                        </view>
                    </view>
                    <!-- 任务日期 -->
                    <view class="addTask-content-titleLine">
                        <view class="addTask-content-subTitle">任务日期：</view>
                        <view class="addTask-content-dateTypes">
                            <view class="addTask-content-dateType" :style="{ background: !task.recycle.isForever ? task.label.color : '' }" @click="task.recycle.isForever = !task.recycle.isForever">存在结束</view>
                            <view class="addTask-content-dateType" :style="{ background: task.recycle.isForever ? task.label.color : '' }" @click="task.recycle.isForever = !task.recycle.isForever">永不结束</view>
                        </view>
                    </view>
                    <view class="addTask-content-datetime" v-show="!task.recycle.isForever">
                        <view class="addTask-content-datetime-select" @click="selecteDateStart">
                            {{ task.datetime.start.toLocaleDateString().slice(0, 10) }}
                        </view>
                        <view class="addTask-content-datetime-tip" :style="{ color: task.label.color }">共{{ intervalTime.day }}天</view>
                        <view class="addTask-content-datetime-select" @click="selecteDateEnd">
                            {{ task.datetime.end.toLocaleDateString().slice(0, 10) }}
                        </view>
                    </view>
                    <view class="addTask-content-datetime" v-show="task.recycle.isForever">
                        <view class="addTask-content-datetime-select" @click="selecteDateStart">
                            {{ task.datetime.start.toLocaleDateString().slice(0, 10) }}
                        </view>
                        <view class="addTask-content-datetime-tip" :style="{ color: task.label.color }">共N天</view>
                        <view class="addTask-content-datetime-select">----/--/--</view>
                    </view>
                    <!-- 执行时间 -->
                    <view class="addTask-content-titleLine">
                        <view class="addTask-content-subTitle">执行时间：</view>
                        <view class="addTask-content-dateTypes">
                            <view class="addTask-content-dateType" v-for="(item, index) in ['全天', '非全天']" :style="{ background: index == task.isAllDay ? '' : task.label.color }" @click="task.isAllDay = !index">{{ item }}</view>
                        </view>
                    </view>
                    <view class="addTask-content-datetime" v-show="!task.isAllDay">
                        <view class="addTask-content-datetime-select" @click="selecteTimeStart">
                            {{ task.recycle.time.start.toLocaleTimeString().slice(0, 5) }}
                        </view>
                        <view class="addTask-content-datetime-tip" :style="{ color: task.label.color }">共{{ String(intervalRuntime.hours).padStart(2, 0) }}:{{ String(intervalRuntime.minutes).padStart(2, 0) }}小时</view>
                        <view class="addTask-content-datetime-select" @click="selecteTimeEnd">
                            {{ task.recycle.time.end.toLocaleTimeString().slice(0, 5) }}
                        </view>
                    </view>
                    <view class="addTask-content-datetime" v-show="task.isAllDay">
                        <view />
                        全天
                        <view />
                    </view>
                </view>
            </view>
            <!-- 任务地点 -->
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">任务地点</view>
                <view class="addTask-content-dateTypes">
                    <picker :range="commonAddresses" @change="selectTaskAddr">
                        <view class="addTask-content-selectAddr">常用地点</view>
                    </picker>
                </view>
            </view>
            <view class="addTask-content-addr">
                <input v-model="task.addr" placeholder="无指定地点" />
            </view>
        </view>
    </view>
</template>

<script>
    import taskLabelStorage from '../storage/taskLabel.js';
    import taskStorage from '../storage/task.js';
    import { watch } from 'vue';

    const now = new Date();
    now.setSeconds(0);

    export default {
        props: ['hide', 'taskData'],
        data: () => ({
            /** 全部任务标签 */
            labels: taskLabelStorage.getAll(),
            /** 任务次数 */
            taskCount: [1, 2, 3, 5],
            /** 任务自定义次数 */
            taskCountInput: '',
            /** 任务循环类型 */
            taskRecycles: [
                {
                    type: 'one',
                    text: '一次',
                },
                {
                    type: 'day',
                    text: '按天',
                },
                {
                    type: 'week',
                    text: '按周',
                },
                {
                    type: 'moon',
                    text: '按月',
                },
            ],
            /** 常用任务地址 */
            commonAddresses: ['家', '公司', '学校', '公园'],
            /** 任务信息对象 */
            task: {
                /** 任务id，传入是表示为修改任务 */
                id: null,
                /** 任务标题 */
                title: '',
                /** 任务打开次数 */
                count: 1,
                /** 是否为全天任务 */
                isAllDay: true,
                /** 任务地点 */
                addr: '',
                /** 任务标签，默认为第一个label */
                label: {
                    color: taskLabelStorage.getAll()[0].color,
                    title: taskLabelStorage.getAll()[0].title,
                },
                /** 任务循环 */
                recycle: {
                    /** 循环类型，one，day，week, moon */
                    type: 'one',
                    /** 循环间隔 */
                    interval: 0,
                    /** 周循环 */
                    weekIndexs: [1, 2, 3, 4, 5],
                    /** 月循环 */
                    moonIndexs: [now.getDate()],
                    /** 任务非全天的执行时间 */
                    time: {
                        start: now,
                        end: now,
                    },
                    /** 任务是否存在结束 */
                    isForever: false,
                },
                /** 任务存在的日期时间 */
                datetime: {
                    start: now,
                    end: now,
                },
            },
        }),
        beforeMount() {
            watch(
                () => this.$props.taskData,
                () => {
                    this.task = { ...this.task, ...this.$props.taskData };
                    this.task.recycle.time.start = new Date(this.task.recycle.time.start);
                    this.task.recycle.time.end = new Date(this.task.recycle.time.end);
                    this.task.datetime.start = new Date(this.task.datetime.start);
                    this.task.datetime.end = new Date(this.task.datetime.end);
                }
            );
        },
        computed: {
            /** 任务循环时间间隔提醒语句 */
            intervalTip() {
                const {
                    taskRecycles,
                    task: {
                        recycle: { type, interval },
                    },
                } = this;
                const recycle = taskRecycles.find((r) => r.type == type);
                const intervalText = recycle.text[1];
                if (interval == 0) {
                    return `每${intervalText}都会创建一次任务`;
                } else {
                    return `每隔${interval}${intervalText}就会创建一次任务`;
                }
            },
            /** 时间选择的时间区间长度 */
            intervalTime() {
                const {
                    task: {
                        isAllDay,
                        datetime: { start, end },
                        recycle: { type },
                    },
                } = this;
                const allMinutes = Math.round((end - start) / 1000 / 60);
                let day;
                if (type == 'one') {
                    day = isAllDay ? Math.ceil(allMinutes / 60 / 24) + 1 : Math.floor(allMinutes / 60 / 24);
                } else {
                    day = Math.ceil(allMinutes / 60 / 24) + 1;
                }
                return {
                    day,
                    hours: Math.floor((allMinutes % (60 * 24)) / 60),
                    minutes: (allMinutes % 60) + 1,
                };
            },
            /** intervalRuntime */
            intervalRuntime() {
                const {
                    task: {
                        recycle: {
                            time: { start, end },
                        },
                    },
                } = this;
                const allMinute = Math.round(((end - start) / 1000 / 60) % (60 * 24)) + 1;

                return {
                    hours: Math.floor(allMinute / 60),
                    minutes: allMinute % 60,
                };
            },
        },
        methods: {
            /**
             * @description: 事件回调：改变任务的打卡次数
             */
            changeTaskCount({ detail: { value } }) {
                this.task.count = this.taskCountInput = value <= 0 ? 1 : value;
            },
            /**
             * @description: 事件回调：选择周循环的莫一天，选择或取消
             */
            selectWeekDay(weekIndex) {
                if (this.task.recycle.weekIndexs.includes(weekIndex)) {
                    this.task.recycle.weekIndexs = this.task.recycle.weekIndexs.filter(item => item != weekIndex)
                } else {
                    this.task.recycle.weekIndexs.push(weekIndex);
                }
            },
            /**
             * @description: 事件回调：选择月循环的莫一天，选择或取消
             */
            selectMoonDay(moonIndex) {
                if (this.task.recycle.moonIndexs.includes(moonIndex)) {
                    this.task.recycle.moonIndexs = this.task.recycle.moonIndexs.filter(item => item != moonIndex)
                } else {
                    this.task.recycle.moonIndexs.push(moonIndex);
                }
            },
            /**
             * @description: 事件回调：选择任务整体开始时间
             */
            selecteTaskStart() {
                window.$datetiemPicker({
                    color: this.task.label.color,
                    datetime: this.task.datetime.start,
                    selectTime: !this.task.isAllDay,
                    submit: (date) => {
                        this.task.datetime.start = date;
                        if (this.task.datetime.end < this.task.datetime.start) {
                            this.task.datetime.end = this.task.datetime.start;
                        }
                    },
                });
            },
            /**
             * @description: 事件回调：选择任务整体结束时间
             */
            selecteTaskEnd() {
                window.$datetiemPicker({
                    color: this.task.label.color,
                    datetime: this.task.datetime.end,
                    minDatetime: this.task.datetime.start,
                    selectTime: !this.task.isAllDay,
                    submit: (date) => {
                        this.task.datetime.end = date;
                    },
                });
            },
            /**
             * @description: 选择任务开始日期
             */
            selecteDateStart() {
                window.$datetiemPicker({
                    color: this.task.label.color,
                    datetime: this.task.datetime.start,
                    selectTime: this.task.recycle.type == 'one' && !this.task.isAllDay,
                    submit: (date) => {
                        this.task.datetime.start = date;
                        if (this.task.datetime.end < this.task.datetime.start) {
                            this.task.datetime.end = this.task.datetime.start;
                        }
                    },
                });
            },
            /**
             * @description: 选择任务结束日期
             */
            selecteDateEnd() {
                window.$datetiemPicker({
                    color: this.task.label.color,
                    datetime: this.task.datetime.end,
                    minDatetime: this.task.datetime.start,
                    selectTime: this.task.recycle.type == 'one' && !this.task.isAllDay,
                    submit: (date) => {
                        this.task.datetime.end = date;
                    },
                });
            },
            /**
             * @description: 选择任务执行开始时间
             */
            selecteTimeStart() {
                window.$datetiemPicker({
                    color: this.task.label.color,
                    datetime: this.task.recycle.time.start,
                    selectDate: false,
                    submit: (date) => {
                        this.task.recycle.time.start = date;
                        if (this.task.recycle.time.end < this.task.recycle.time.start) {
                            this.task.recycle.time.end = this.task.recycle.time.start;
                        }
                    },
                });
            },
            /**
             * @description: 选择任务执行结束时间
             */
            selecteTimeEnd() {
                window.$datetiemPicker({
                    color: this.task.label.color,
                    datetime: this.task.recycle.time.end,
                    selectDate: false,
                    submit: (date) => {
                        this.task.recycle.time.end = date;
                        if (this.task.recycle.time.end < this.task.recycle.time.start) {
                            this.task.recycle.time.end = this.task.recycle.time.start;
                        }
                    },
                });
            },
            /**
             * @description: 选择任务常用地址回调
             */
            selectTaskAddr({ detail: { value } }) {
                this.task.addr = this.commonAddresses[value];
            },
            /**
             * @description: 创建任务
             */
            createTask() {
                if (!this.task.title) {
                    window.$message({
                        type: 'warning',
                        message: '请输入任务标题',
                    });
                    return;
                }
                if (this.task.id) {
                    taskStorage.edit(this.task.id, this.task);
                } else {
                    taskStorage.add(this.task);
                }
                this.hidePage();
            },
            /**
             * @description: 隐藏界面
             */
            hidePage() {
                this.resetTaskData();
                this.hide();
            },
            /**
             * @description: 重置task数据
             */
            resetTaskData() {
                this.task = {
                    id: null,
                    title: '',
                    count: 1,
                    isAllDay: true,
                    addr: '',
                    label: {
                        color: taskLabelStorage.getAll()[0].color,
                        title: taskLabelStorage.getAll()[0].title,
                    },
                    recycle: {
                        type: 'one',
                        interval: 0,
                        weekIndexs: [1, 2, 3, 4, 5],
                        moonIndexs: [now.getDate()],
                        time: {
                            start: now,
                            end: now,
                        },
                    },
                    datetime: {
                        start: now,
                        end: now,
                    },
                };
                this.taskCountInput = '';
            },
        },
    };
</script>

<style>
    .addTask-root {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
    }
    .addTask-header {
        padding: 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--fontSize-m);
    }
    .addTask-header-add {
        float: right;
    }
    .addTask-content {
        padding: 30rpx 40rpx;
        flex: 1;
        overflow-y: auto;
    }
    .addTask-content-title {
        padding: 50rpx;
        border-radius: 60rpx;
        box-sizing: border-box;
    }
    .addTask-content-title input {
        text-align: center;
        width: 100%;
        font-size: var(--fontSize-m);
    }
    .addTask-content-titleLine {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60rpx;
        margin: 40rpx 0 20rpx;
    }
    .addTask-content-subTitle {
        font-size: var(--fontSize-s);
    }
    .addTask-content-labels {
        display: flex;
        width: 100%;
        overflow-x: auto;
    }
    .addTask-content-label {
        font-size: var(--fontSize-s);
        text-align: center;
        flex-shrink: 0;
        padding: 0 20rpx;
        height: 50rpx;
        border-radius: 10rpx;
        color: #333;
    }
    .addTask-content-label + .addTask-content-label {
        margin-left: 20rpx;
    }
    .addTask-content-counts {
        display: flex;
        width: 100%;
        justify-content: space-evenly;
    }
    .addTask-content-count {
        width: 100rpx;
        background: #fffd;
        text-align: center;
        font-size: var(--fontSize-s);
        border-radius: 15rpx;
        padding: 5rpx 20rpx;
    }
    .addTask-content-count + .addTask-content-count {
        margin-left: 20rpx;
    }
    .addTask-content-recycles {
        display: flex;
        justify-content: space-evenly;
        background: #aaa8;
        border-radius: 10rpx;
        padding: 5rpx;
    }
    .addTask-content-recycle {
        text-align: center;
        font-size: var(--fontSize-s);
        padding: 3rpx 20rpx;
        border-radius: 15rpx;
        vertical-align: middle;
        position: relative;
    }
    .addTask-content-recycle + .addTask-content-recycle::before {
        content: '';
        left: -1rpx;
        top: 0;
        position: absolute;
        display: inline-block;
        height: 100%;
        width: 3rpx;
        background: #555;
    }
    .addTask-content-block {
        border-left: 15rpx solid #000;
        padding: 10rpx 0 10rpx 30rpx;
    }
    .addTask-content-block::before {
        content: '';
        display: block;
        margin-top: -40rpx;
    }
    .addTask-content-interval {
        background: #fffd;
        margin-top: 20rpx;
        padding: 20rpx 20rpx 20rpx 30rpx;
        border-radius: 20rpx;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
    }
    .addTask-content-tip {
        font-size: var(--fontSize-ss);
        line-height: 1.5em;
    }
    .addTask-content-interval-count {
        display: flex;
        font-size: var(--fontSize-s);
        font-weight: 900;
    }
    .addTask-content-interval-option {
        border-radius: 5rpx;
        width: 50rpx;
        line-height: 50rpx;
        text-align: center;
        margin: 0 15rpx;
        color: #333;
    }
    .addTask-content-selectWeeks {
        margin-top: 20rpx;
        display: flex;
        justify-content: space-between;
    }
    .addTask-content-selectWeek {
        width: 75rpx;
        height: 75rpx;
        line-height: 75rpx;
        border-radius: 15rpx;
        border: 4rpx solid #222;
        box-sizing: border-box;
        text-align: center;
        font-size: var(--fontSize-s);
        background: #fffd;
    }
    .addTask-content-selectMoons {
        position: relative;
        margin-top: 20rpx;
        width: 105%;
    }
    .addTask-content-selectMoon {
        display: inline-block;
        width: 75rpx;
        height: 75rpx;
        margin-right: 17rpx;
        line-height: 75rpx;
        border-radius: 15rpx;
        border: 4rpx solid #222;
        box-sizing: border-box;
        text-align: center;
        font-size: var(--fontSize-s);
        background: #fffd;
    }
    .addTask-content-selectMoon:nth-child(7n) {
        margin-right: 0rpx;
    }
    .addTask-content-selectMoon:nth-child(n + 8) {
        margin-top: 17rpx;
    }
    .addTask-content-clearMoon {
        position: absolute;
        display: inline-block;
        width: 167rpx;
        height: 75rpx;
        line-height: 75rpx;
        border-radius: 15rpx;
        border: 4rpx solid #222;
        box-sizing: border-box;
        text-align: center;
        font-size: var(--fontSize-s);
        background: #fffd;
        right: 5%;
        letter-spacing: 10rpx;
        bottom: 0;
    }
    .addTask-content-datetime {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--fontSize-s);
        background: #fffd;
        border-radius: 20rpx;
        padding: 0 20rpx;
        height: 130rpx;
        box-sizing: border-box;
    }
    .addTask-content-dateTypes {
        display: flex;
        justify-content: space-evenly;
        background: #aaa8;
        border-radius: 10rpx;
        padding: 5rpx;
    }
    .addTask-content-dateType {
        text-align: center;
        font-size: var(--fontSize-s);
        padding: 3rpx 20rpx;
        border-radius: 15rpx;
        vertical-align: middle;
        position: relative;
    }
    .addTask-content-dateType + .addTask-content-dateType::before {
        content: '';
        left: -1rpx;
        top: 0;
        position: absolute;
        display: inline-block;
        height: 100%;
        width: 3rpx;
        background: #555;
    }
    .addTask-content-datetime-select {
        text-align: center;
    }
    .addTask-content-datetime-tip {
        text-align: center;
        font-weight: 900;
    }
    .addTask-content-addr {
        background: #fffd;
        border-radius: 10rpx;
        padding: 20rpx;
        box-sizing: border-box;
    }
    .addTask-content-addr input {
        text-align: center;
        flex: 1;
    }
</style>
