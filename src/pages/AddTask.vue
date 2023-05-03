<template>
    <view class="addTask-root background">
        <view class="addTask-header">
            <view class="addTask-header-close" @click="$props.hide">&#xe658;</view>
            <view class="addTask-header-title font">添加代办</view>
            <view class="addTask-header-add">&#xe664;</view>
        </view>
        <view class="addTask-content">
            <view class="addTask-content-title" :style="{ background: task.label.color }">
                <input type="text" placeholder="输入标题" />
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
                <view class="addTask-content-subTitle">任务次数：</view>
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
            <view class="addTask-content-block" :style="{ borderLeftColor: task.label.color }">
                <view v-show="['day', 'week', 'moon'].includes(task.recycle.type)">
                    <view class="addTask-content-subTitle">时间间隔：</view>
                    <view class="addTask-content-interval">
                        <view class="addTask-content-tip">
                            {{ intervalTip }}
                        </view>
                        <view class="addTask-content-interval-count">
                            <view class="addTask-content-interval-option" @click="task.recycle.interval != 0 && task.recycle.interval--">&#xea6d;</view>
                            <view :style="{ color: task.label.color }">{{ task.recycle.interval }}</view>
                            <view class="addTask-content-interval-option" @click="task.recycle.interval++">&#xea6e;</view>
                        </view>
                    </view>
                </view>

                <view v-show="['day', 'week', 'moon'].includes(task.recycle.type)">
                    <view class="addTask-content-subTitle" v-show="task.recycle.type != 'day'">时间选择：</view>
                    <view class="addTask-content-selectWeeks" v-show="task.recycle.type == 'week'">
                        <view class="addTask-content-selectWeek" v-for="(item, index) in '一二三四五六日'" @click="selectWeek(index)" :style="{ background: task.recycle.weekIndexs.has(index) ? task.label.color : '' }">{{ item }}</view>
                    </view>
                    <view class="addTask-content-selectMoons" v-show="task.recycle.type == 'moon'">
                        <view class="addTask-content-selectMoon" v-for="(item, index) in 31" @click="selectMoonStart(index)" :style="{ background: task.recycle.moonIndexs.has(index) ? task.label.color : '' }">{{ item }}</view>
                        <view class="addTask-content-clearMoon" @click="task.recycle.moonIndexs = new Set()">清空</view>
                    </view>
                </view>

                <view class="addTask-content-titleLine">
                    <view class="addTask-content-subTitle">任务时间：</view>
                    <view class="addTask-content-dateTypes">
                        <view class="addTask-content-dateType" v-for="(item, index) in ['全天', '非全天']" :style="{ background: index == task.isAllDay ? '' : task.label.color }" @click="task.isAllDay = !index">{{ item }}</view>
                    </view>
                </view>
                <view class="addTask-content-datetime">
                    <view class="addTask-content-datetime-select" @click="selecteDatetimeStart">
                        {{ task.datetime.start.toLocaleDateString() }}
                        <br />
                        {{ task.isAllDay ? '' : task.datetime.start.toLocaleTimeString().slice(0, 5) }}
                    </view>
                    <view class="addTask-content-datetime-tip" :style="{ color: task.label.color }">
                        共{{ 1 + Math.round((task.datetime.end - task.datetime.start) / 1000 / 24 / 60 / 60)}}天
                        <br />
                        {{ task.isAllDay ? '' : task.datetime.start.toLocaleTimeString().slice(0, 5) }}
                    </view>
                    <view class="addTask-content-datetime-select" @click="selecteDatetimeEnd">
                        {{ task.datetime.end.toLocaleDateString() }}
                        <br />
                        {{ task.isAllDay ? '' : task.datetime.end.toLocaleTimeString().slice(0, 5) }}
                    </view>
                </view>
            </view>
        </view>
        <DatetimePicker :show="showDatetimePicker" :closeCallback="selecteDateCallback" />
    </view>
</template>

<script>
    import { reactive, ref } from 'vue';
    import taskLabelStorage from '../storage/taskLabel.js';
    import DatetimePicker from '../components/DatetimePicker.vue';

    export default {
        components: { DatetimePicker },
        props: ['hide'],
        data: () => ({
            labels: reactive(taskLabelStorage.getAll()),
            taskCount: [1, 2, 3, 5],
            taskCountInput: ref(),
            showDatetimePicker: false,
            selecteDateType: '', // 选择时间的类型，start为开始时间，end为结束时间
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
            task: {
                count: 1,
                isAllDay: false,
                label: {
                    color: taskLabelStorage.getAll()[0].color,
                    title: taskLabelStorage.getAll()[0].title,
                },
                recycle: {
                    type: 'one',
                    interval: 0,
                    weekIndexs: new Set([0, 1, 2, 3, 4]),
                    moonIndexs: new Set([]),
                    datetime: {
                        start: new Date(),
                        end: new Date(),
                    },
                },
                datetime: {
                    start: new Date(),
                    end: new Date(),
                },
            },
        }),
        computed: {
            intervalTip() {
                const {
                    taskRecycles,
                    task: {
                        recycle: { type, interval },
                    },
                } = this.$data;
                const recycle = taskRecycles.find((r) => r.type == type);
                const intervalText = recycle.text[1];
                if (interval == 0) {
                    return `每${intervalText}都会创建一次任务`;
                } else {
                    return `每隔${interval}${intervalText}就会创建一次任务`;
                }
            },
        },
        methods: {
            changeTaskCount({ detail: { value } }) {
                this.$data.taskCountInput = value <= 0 ? 1 : value;
                this.$data.task.count = value <= 0 ? 1 : value;
            },
            selectWeek(weekIndex) {
                const {
                    task: {
                        recycle: { weekIndexs },
                    },
                } = this.$data;
                if (weekIndexs.has(weekIndex)) {
                    weekIndexs.delete(weekIndex);
                } else {
                    weekIndexs.add(weekIndex);
                }
            },
            selectMoonStart(moonIndex) {
                const {
                    task: {
                        recycle: { moonIndexs },
                    },
                } = this.$data;
                if (moonIndexs.has(moonIndex)) {
                    moonIndexs.delete(moonIndex);
                } else {
                    moonIndexs.add(moonIndex);
                }
            },
            selectMoonEnd(moonIndex) {
                const {
                    task: {
                        recycle: { moonIndexs },
                    },
                } = this.$data;
                if (moonIndexs.has(moonIndex)) {
                    moonIndexs.delete(moonIndex);
                } else {
                    moonIndexs.add(moonIndex);
                }
            },
            selecteDatetimeStart() {
                this.$data.showDatetimePicker = true;
                this.$data.selecteDateType = 'start';
            },
            selecteDatetimeEnd() {
                this.$data.showDatetimePicker = true;
                this.$data.selecteDateType = 'end';
            },
            selecteDateCallback(date) {
                this.$data.showDatetimePicker = false;
                if(!date) return;
                if (this.$data.selecteDateType == 'start') {
                    this.$data.task.datetime.start = date;
                } else {
                    this.$data.task.datetime.end = date;
                }
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
        content: "";
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
</style>
