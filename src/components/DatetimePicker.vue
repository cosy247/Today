<template>
    <view class="datetimePicker-root">
        <view class="datetimePicker-mask"></view>
        <view class="datetimePicker-main">
            <view class="datetimePicker-header">
                <view class="datetimePicker-header-lastMoon">&lt;</view>
                <view class="datetimePicker-header-date">2023年12月</view>
                <view class="datetimePicker-header-nextMoon">&gt;</view>
                <view class="datetimePicker-header"></view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {};
</script>

<style>
    .datetimePicker-root {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1000;
    }
    .datetimePicker-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: #8888;
        z-index: -1;
    }
    .datetimePicker-main {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 30rpx;
        box-sizing: border-box;
        background: #fff;
        border-radius: 30rpx 30rpx 0 0;
        font-size: var(--fontSize-s);
    }
    .datetimePicker-header {
        margin: 0 auto;
        width: fit-content;
        display: flex;
    }
    .datetimePicker-header-yearMoon {
        margin: 0 auto;
        width: fit-content;
        display: flex;
    }
</style>
