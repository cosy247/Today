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
                        <view class="home-task-item-info-time" v-show="taskInfos[item.id].datatime">&#xe60f;&nbsp;{{ taskInfos[item.id].datatime }}</view>
                        <view class="home-task-item-info-addr" v-show="item.addr">&#xe615;&nbsp;{{ item.addr }}</view>
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
    export default {};
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
