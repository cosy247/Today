<template>
    <view class="addTask-root background">
        <view class="addTask-header">
            <view class="addTask-header-close" @click="$props.hide">&#xe658;</view>
            <view class="addTask-header-title font">添加代办</view>
            <view class="addTask-header-add">&#xe664;</view>
        </view>
        <view class="addTask-content">
            <view class="addTask-content-title" :style="{ background: task.color }">
                <input type="text" placeholder="输入标题" />
            </view>
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">选择主体颜色：</view>
            </view>
            <view class="addTask-content-colors">
                <view class="addTask-content-color" v-for="color in colors" :style="{ background: color }" @click="task.color = color"></view>
            </view>
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">任务次数：</view>
            </view>
            <view class="addTask-content-numbers">
                <view class="addTask-content-number" :style="{ background: task.number == number ? task.color : '' }" v-for="number in taskNumber" @click="task.number = number">{{ number }}</view>
                <input class="addTask-content-number" :style="{ background: task.number == taskNumberInput ? task.color : '' }" type="number" v-model="taskNumberInput" placeholder="自" @blur="changeTaskNumber" />
            </view>
            <view class="addTask-content-titleLine">
                <view class="addTask-content-subTitle">任务循环：</view>
                <view class="addTask-content-recycles">
                    <view class="addTask-content-recycle" v-for="item in taskRecycles" :style="{ background: item.type == task.recycle.type ? task.color : '' }" @click="task.recycle.type = item.type">{{ item.text }}</view>
                </view>
            </view>
            <view class="addTask-content-titleLine" v-show="task.recycle.type != 'one'">
                <view class="addTask-content-subTitle">时间间隔：</view>
            </view>
        </view>
    </view>
</template>

<script>
    import { reactive, ref } from 'vue';
    import taskColorStorage from '../storage/taskColor.js';

    export default {
        props: ['hide'],
        data: () => ({
            colors: reactive(taskColorStorage.getAll()),
            taskNumber: [1, 2, 3, 5],
            taskNumberInput: ref(),
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
                color: ref(taskColorStorage.getAll()[0]),
                number: 1,
                recycle: {
                    type: 'one',
                },
            },
        }),
        methods: {
            changeTaskNumber({ detail: { value } }) {
                this.$data.task.number = value;
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
        margin: 40rpx 0 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .addTask-content-subTitle {
        font-size: var(--fontSize-s);
    }
    .addTask-content-colors {
        display: flex;
        width: 100%;
        overflow-x: auto;
    }
    .addTask-content-color {
        flex-shrink: 0;
        width: 100rpx;
        height: 50rpx;
        border-radius: 10rpx;
    }
    .addTask-content-color + .addTask-content-color {
        margin-left: 20rpx;
    }
    .addTask-content-numbers {
        display: flex;
        width: 100%;
        justify-content: space-evenly;
    }
    .addTask-content-number {
        width: 100rpx;
        background: #fff;
        text-align: center;
        font-size: var(--fontSize-s);
        border-radius: 15rpx;
        padding: 5rpx 20rpx;
    }
    .addTask-content-number + .addTask-content-number {
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
    .addTask-content-recycleDay {
        background: #fffa;
        padding: 30rpx;
        border-radius: 20rpx;
    }
</style>
