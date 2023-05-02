<template>
    <view class="datetimePicker-root">
        <view class="datetimePicker-mask" @click="$props.closeCallback(null)"></view>
        <view class="datetimePicker-main">
            <view class="datetimePicker-header">
                <view class="datetimePicker-header-today font" @click="goToday">今天</view>
                <view class="datetimePicker-header-lastMoon" @click="lastMoon"></view>
                <view class="datetimePicker-header-date">{{ year }}年{{ moon }}月</view>
                <view class="datetimePicker-header-nextMoon" @click="nextMoon"></view>
                <view class="datetimePicker-header-close font" @click="$props.closeCallback(null)">×</view>
            </view>
            <view class="datatimePicker-weeks">
                <view class="datetimePicker-week font" v-for="item in '一二三四五六日'">{{ item }}</view>
            </view>
            <view class="datatimePicker-days">
                <view :class="{ 'datetimePicker-moonDay': item.getMonth() + 1 == moon, 'datetimePicker-selected': selectedDateString == item.toLocaleDateString() }" v-for="item in days" @click="selectedDateString = item.toLocaleDateString()">{{ item.getDate() }}</view>
            </view>
            <view class="datatimePicker-buttons">
                <view class="datatimePicker-button" @click="$props.closeCallback(new Date(selectedDateString))">确定</view>
                <view class="datatimePicker-button" @click="$props.closeCallback(null)">取消</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: ['closeCallback'],
        data() {
            const now = new Date();
            return {
                year: now.getFullYear(),
                moon: now.getMonth() + 1,
                selectedDateString: new Date().toLocaleDateString()
            };
        },
        computed: {
            days() {
                const days = [];
                const dateString = `${this.$data.year}/${this.$data.moon}`;
                const startDay = new Date(dateString);
                startDay.setDate(1);
                if (startDay.getDay() != 1) {
                    startDay.setDate(startDay.getDate() - ((startDay.getDay() + 6) % 7));
                }
                while (days.length < 42) {
                    days.push(new Date(startDay));
                    startDay.setDate(startDay.getDate() + 1);
                }
                return days;
            },
        },
        methods: {
            nextMoon() {
                if (this.$data.moon == 12) {
                    this.$data.moon = 1;
                    this.$data.year++;
                } else {
                    this.$data.moon++;
                }
            },
            lastMoon() {
                if (this.$data.moon == 1) {
                    this.$data.moon = 12;
                    this.$data.year--;
                } else {
                    this.$data.moon--;
                }
            },
            goToday() {
                const now = new Date();
                this.$data.year = now.getFullYear();
                this.$data.moon = now.getMonth() + 1;
                this.$data.selectedDateString = now.toLocaleDateString();
            },
        },
    };
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
        animation: datetimePickerMask 0.3s;
    }
    @keyframes datetimePickerMask {
        0% {
            background: #8880;
        }
    }
    .datetimePicker-main {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border-radius: 30rpx 30rpx 0 0;
        font-size: var(--fontSize-s);
        animation: datetimePickerMain 0.3s;
    }
    @keyframes datetimePickerMain {
        0% {
            bottom: -110%;
        }
    }
    .datetimePicker-header {
        padding: 40rpx 40rpx 0;
        box-sizing: border-box;
        position: relative;
        margin: 0 auto;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        line-height: 0;
    }
    .datetimePicker-header-today {
        position: absolute;
        left: 30rpx;
        top: 50rpx;
        font-size: var(--fontSize-s);
    }
    .datetimePicker-header-date {
        margin: 0 20rpx;
    }
    .datetimePicker-header-lastMoon,
    .datetimePicker-header-nextMoon {
        width: 20rpx;
        height: 20rpx;
        border-top: 6rpx #888 solid;
        border-left: 6rpx #888 solid;
        transform-origin: center center;
    }
    .datetimePicker-header-lastMoon {
        transform: rotate(-45deg);
    }
    .datetimePicker-header-nextMoon {
        transform: rotate(135deg);
    }
    .datetimePicker-header-close {
        position: absolute;
        right: 30rpx;
        top: 50rpx;
        font-size: var(--fontSize-s);
    }
    .datatimePicker-weeks {
        padding: 40rpx 40rpx 20rpx;
        border-bottom: 2rpx #888 solid;
        color: #888;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .datatimePicker-days {
        padding: 40rpx 40rpx 20rpx;
        border-bottom: 2rpx #888 solid;
        color: #888;
        display: grid;
        grid: repeat(6, 78.7rpx) / repeat(7, 1fr);
        line-height: 78.7rpx;
        text-align: center;
        grid-gap: 20rpx;
        font-weight: 900;
    }
    .datetimePicker-moonDay {
        color: #111;
    }
    .datatimePicker-buttons {
        padding: 40rpx;
        display: flex;
        align-items: center;
    }
    .datatimePicker-button {
        width: 100%;
        text-align: center;
        border-radius: 100rpx;
        background: #007aff;
        line-height: 2.2em;
        justify-content: space-evenly;
        border: 2rpx solid #86e724;
        color: white;
        font-weight: 900;
        margin: 0 20rpx;
    }
    .datetimePicker-selected {
        border-radius: 50%;
        background: #007aff;
        color: white;
    }
</style>
