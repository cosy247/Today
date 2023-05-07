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
            <view v-for="task in tasks" :key="task.id" class="task-item" :style="`background: ${task.background}`">
                <view>{{ task.title }}</view>
            </view>
        </view>
        <Tab class="task-tab" :style="{ bottom: showAddTask ? '-100%' : '' }" />
        <AddTask class="task-add" :style="{ left: showAddTask ? 0 : '110%' }" :hide="hiddenAddTask" />
    </view>
    <DatetimePickerVue />
</template>

<script>
    import { ref } from 'vue';
    import task from '../storage/task.js';
    import Tab from '../components/Tab';
    import AddTask from './AddTask';
    import DatetimePickerVue from '../components/DatetimePicker.vue';

    export default {
        components: { Tab, AddTask, DatetimePickerVue },
        data: () => ({
            tasks: task.getAll(),
            showAddTask: false,
        }),
        methods: {
            hiddenAddTask() {
                this.$data.showAddTask = false;
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
        padding: 30rpx;
        margin-top: 30rpx;
        height: 700rpx;
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
