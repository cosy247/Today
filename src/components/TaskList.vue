<template>
    <view class="home-task">
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
                        <view class="home-task-item-info-time">&#xe60f;&nbsp;{{ getTaskDatatime(item) }}</view>
                        <view class="home-task-item-info-addr" v-if="item.addr">&nbsp;&#xe615;&nbsp;{{ item.addr }}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- <view class="home-task-item-options" :style="`opacity: ${taskInfos[item.id].offset / this.touchOffsetMax}`">
                <view class="home-task-item-option" @click="editTask(item)">&#xe622;</view>
                <view class="home-task-item-option" @click="resetTask(item)">&#xe648;</view>
                <view class="home-task-item-option" @click="deleteTask(item)">&#xe658;</view>
            </view> -->
    </view>
</template>

<script>
    import taskStorage from '../storage/task.js';
    export default {
        props: ['year', 'month', 'day'],
        data: () => ({}),
        computed: {
            intervalDay() {
                const intervalDay = Math.round((new Date(`${this.year}/${this.month}/${this.day}`) - new Date().setHours(0)) / 1000 / 60 / 60 / 24);
                if (intervalDay == 0) {
                    return '今天';
                } else if (intervalDay > 0) {
                    return `${intervalDay}天前`;
                } else if (intervalDay < 0) {
                    return `${-intervalDay}天后`;
                }
            },
            tasks() {
                return taskStorage.getDay(`${this.year}/${this.month}/${this.day}`);
            },
        },
        methods: {
            getTaskDatatime(task) {
                if (task.datetime.start) {
                    task.datetime.start = new Date(task.datetime.start);
                    task.datetime.end = new Date(task.datetime.end);
                    task.recycle.time.start = new Date(task.recycle.time.start);
                    task.recycle.time.end = new Date(task.recycle.time.end);
                }
                if (task.recycle.type == 'one') {
                    const allDays = Math.round((new Date(task.datetime.end.toLocaleDateString()) - new Date(task.datetime.start.toLocaleDateString())) / 1000 / 60 / 60 / 24);
                    const currentDay = Math.round((new Date().setHours(0) - new Date(task.datetime.start.toLocaleDateString())) / 1000 / 60 / 60 / 24);
                    if (task.isAllDay) {
                        return allDays > 0 ? `全天(${currentDay + 1}/${allDays + 1})` : '全天';
                    } else {
                        const start = currentDay == 0 ? task.datetime.start.toLocaleTimeString().slice(0, 5) : '0:0';
                        const end = currentDay == allDays ? task.datetime.end.toLocaleTimeString().slice(0, 5) : '0:0';
                        return (start === end ? start : `${start}-${end}`) + (allDays > 0 ? `(${currentDay + 1}/${allDays + 1})` : '');
                    }
                } else {
                    if (task.isAllDay) {
                        return '全天';
                    } else {
                        const start = task.recycle.time.start.slice(11, 16);
                        const end = task.recycle.time.end.slice(11, 16);
                        return end === start ? start : `${start} - ${end}`;
                    }
                }
            },
        },
    };
</script>

<style scoped>
    /* home-task */
    .home-task {
        margin: 50rpx 30rpx 0;
    }
    .home-task-header {
        display: flex;
        align-items: baseline;
    }
    .home-task-header-date {
        font-size: 40rpx;
    }
    .home-task-header-interval {
        font-size: 30rpx;
        margin-left: 15rpx;
    }
    .home-task-items {
        margin-top: 30rpx;
    }
    .home-task-item {
        background: #fff;
        padding: 20rpx 30rpx;
        border-radius: 30rpx;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        transition: 0.3s;
    }
    .home-task-item-touch {
        transform: scale(0.95);
    }
    .home-task-item-title-status {
        width: 15rpx;
        height: 15rpx;
        border: 6rpx solid rgb(142, 169, 243);
        border-radius: 50%;
        margin-right: 25rpx;
    }
    .home-task-item-title {
        font-size: 40rpx;
    }
    .home-task-item-info {
        margin-top: 5rpx;
        font-size: 20rpx;
        color: #888;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        width: 570rpx;
    }
    .home-task-item-info-time,
    .home-task-item-info-addr {
        display: inline;
    }
    .home-task-item-options {
        position: absolute;
        display: flex;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
    }
    .home-task-item-option {
        margin-left: 10rpx;
    }
</style>
