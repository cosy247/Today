<template>
    <view class="tab-root">
        <view class="tab-content">
            <view class="tab-content-item active">&#xe69d;</view>
            <view class="tab-content-item">&#xe632;</view>
        </view>
    </view>
</template>

<script setup>

</script>

<style scoped>
    .tab-root {
        position: fixed;
        width: 100%;
        bottom: 90rpx;
    }
    .tab-content {
        margin: auto;
        display: flex;
        padding: 20rpx;
        align-items: center;
        justify-content: center;
        background: #eee;
        width: fit-content;
        font-size: 50rpx;
        border-radius: 100rpx;
        color: #555;
        box-shadow: 0 0 10rpx #8888;
    }
    .tab-content-item {
        margin: 0 30rpx;
    }
    .tab-content-item.active {
        color: #111;
        font-weight: 900;
    }
</style>