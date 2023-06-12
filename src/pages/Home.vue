<template>
    <div class="home-day">
        <TaskDay class="home-day-last" />
        <TaskDay class="home-day-current" />
        <TaskDay class="home-day-next" />
    </div>

    <!-- 实例 -->
    <Tab class="task-tab" :style="{ bottom: showAddTask ? '-100%' : '' }" />
    <AddTask class="task-add" :style="{ left: showAddTask ? 0 : '110%' }" :hide="hiddenAddTask" :taskData="addTaskData" />

    <!-- 单例 -->
    <DatetimePicker />
    <MessageBox />
</template>

<script>
    import Tab from '../components/Tab';
    import AddTask from './AddTask';
    import DatetimePicker from '../components/DatetimePicker.vue';
    import MessageBox from '../components/MessageBox.vue';
    import TaskDay from './TaskDay.vue';

    export default {
        components: { Tab, AddTask, DatetimePicker, MessageBox, TaskDay },
    };
</script>

<style>
    .home-day {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
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
