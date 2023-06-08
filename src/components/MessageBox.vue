<template>
    <view class="messageBox">
        <view v-for="item in messages" :key="item.id" :class="`messageBox-item messageBox-${item.type}`">
            <view class="messageBox-icon" v-html="icon[item.type] || defaultIcon"></view>
            {{ item.message }}
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            // 定义全局函数调用时间选择器
            window.$message = (props = {}) => {
                const { type = '', message = '' } = props;
                this.messages.push({
                    id: Date.now(),
                    type,
                    message,
                });
                setTimeout(() => {
                    this.messages.shift();
                }, 2900);
            };

            return {
                messages: [],
                defaultIcon: '&#xe65a;',
                icon: {
                    success: '&#xe656;',
                    warning: '&#xe659;',
                    error: '&#xe657;',
                },
            };
        },
    };
</script>

<style>
    .messageBox {
        position: fixed;
        top: 10rpx;
        left: 0;
        width: 100%;
    }
    .messageBox-item {
        margin: 20rpx auto 0;
        width: 500rpx;
        height: 80rpx;
        padding: 20rpx 50rpx;
        box-sizing: border-box;
        background: #edf2fcf8;
        border-radius: 20rpx;
        line-height: 40rpx;
        border: 1rpx solid #bcc1ca88;
        color: #333;
        animation: messageBox-item 3s;
    }
    .messageBox-success {
        background: #f0f9ebf8;
        border-color: #bac2b688;
        color: #67c23a;
    }
    .messageBox-warning {
        background: #fdf6ecf8;
        border-color: #dbd2c588;
        color: #e6a23c;
    }
    .messageBox-error {
        background: #fef0f0f8;
        border-color: #c0b8b888;
        color: #f56c6c;
    }
    @keyframes messageBox-item {
        0% {
            margin-top: -80rpx;
            opacity: 0;
        }
        20% {
            margin-top: 20rpx;
            opacity: 1;
        }
        80% {
            margin-top: 20rpx;
            opacity: 1;
        }
        100% {
            margin-top: -80rpx;
            opacity: 0;
        }
    }
    .messageBox-icon {
        display: inline-block;
        margin-right: 10rpx;
    }
</style>
