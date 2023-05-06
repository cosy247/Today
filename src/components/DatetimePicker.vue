<template>
    <view :class="{ 'datetimePicker-root': 1, 'datetimePicker-show': show }">
        <view class="datetimePicker-mask" @click="cancelHandel"></view>
        <view class="datetimePicker-main">
            <view class="datetimePicker-header">
                <view class="datetimePicker-header-today font" @click="goToday">今天</view>
                <view class="datetimePicker-header-lastMoon" @click="lastMoon"></view>
                <view class="datetimePicker-header-date">{{ year }}年{{ moon }}月</view>
                <view class="datetimePicker-header-nextMoon" @click="nextMoon"></view>
                <view class="datetimePicker-header-close font" @click="cancelHandel">×</view>
            </view>
            <view class="datetimePicker-weeks">
                <view class="datetimePicker-week font" v-for="item in '一二三四五六日'">{{ item }}</view>
            </view>
            <view class="datetimePicker-days">
                <view :class="{ 'datetimePicker-moonDay': item[1] == moon }" v-for="item in days" :style="item[0] == year && item[1] == moon && item[2] == day ? `color:#fff; background:${color}` : ''" @click="[year, moon, day] = item">{{ item[2] }}</view>
            </view>
            <view class="datetimePicker-time">
                <view class="datetimePicker-time-hours" @click="showSelectHours = true">
                    {{ hours }}
                </view>
                <view>:</view>
                <view class="datetimePicker-time-minute" @click="showSelectMinute = true">
                    {{ minute }}
                </view>
                <view class="datetimePicker-time-selects" v-show="showSelectHours">
                    <view class="datetimePicker-time-select" v-for="(item, index) in 24" @click="(hours = index), (showSelectHours = false)" :style="{ background: hours == index ? color : '' }">{{ index }}</view>
                </view>
                <view class="datetimePicker-time-selects" v-show="showSelectMinute">
                    <view class="datetimePicker-time-select" v-for="(item, index) in 60" @click="(minute = index), (showSelectMinute = false)" :style="{ background: minute == index ? color : '' }">{{ index }}</view>
                </view>
            </view>
            <view class="datetimePicker-buttons">
                <view class="datetimePicker-button" :style="`background:${color}`" @click="submitHandel">确定</view>
                <view class="datetimePicker-button" :style="`background:${color}`" @click="cancelHandel">取消</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            const now = new Date();

            window.$datetiemPicker = (props = {}) => {
                const { datetime = now, color = '#007aff', submit, cancel } = props;
                const date = new Date(datetime);
                this.$data.year = date.getFullYear();
                this.$data.moon = date.getMonth() + 1;
                this.$data.day = date.getDate();
                this.$data.hours = date.getHours();
                this.$data.minute = date.getMinutes();
                this.$data.color = color;
                this.$data.submit = submit;
                this.$data.cancel = cancel;
                this.$data.show = true;
            };

            return {
                color: '#ff7aff',
                year: now.getFullYear(),
                day: now.getDay(),
                moon: now.getMonth() + 1,
                hours: now.getHours(),
                minute: now.getMinutes(),
                submit: null,
                cancel: null,

                show: false,
                showSelectHours: false,
                showSelectMinute: false,
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
                    days.push(new Date(startDay).toLocaleDateString().split('/'));
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
                this.$data.day = now.getDate();
            },
            submitHandel() {
                const { year, moon, day, hours, minute, submit } = this.$data;
                this.$data.show = false;
                if (typeof submit == 'function') {
                    const datetime = new Date(`${year}/${moon}/${day} ${hours}:${minute}:00`);
                    submit(datetime);
                }
            },
            cancelHandel() {
                const { cancel } = this.$data;
                this.$data.show = false;
                typeof cancel == 'function' && cancel;
            },
        },
    };
</script>

<style scoped>
    .datetimePicker-root {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 9999;
        pointer-events: none;
    }
    .datetimePicker-show {
        pointer-events: auto;
    }
    .datetimePicker-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: #8880;
        z-index: -1;
        transition: 0.3s;
    }
    .datetimePicker-show > .datetimePicker-mask {
        background: #8888;
    }
    .datetimePicker-main {
        position: absolute;
        bottom: -100%;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border-radius: 30rpx 30rpx 0 0;
        font-size: var(--fontSize-s);
        transition: 0.3s;
    }
    .datetimePicker-show > .datetimePicker-main {
        bottom: 0%;
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
    .datetimePicker-weeks {
        padding: 40rpx 40rpx 20rpx;
        border-bottom: 2rpx #888 solid;
        color: #888;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .datetimePicker-days {
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
        border-radius: 50%;
    }
    .datetimePicker-buttons {
        padding: 40rpx;
        display: flex;
        align-items: center;
    }
    .datetimePicker-time {
        position: relative;
        padding: 25rpx 100rpx;
        border-bottom: 2rpx #888 solid;
        color: #111;
        font-weight: 900;
        display: flex;
        justify-content: space-evenly;
    }
    .datetimePicker-time-selects {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        align-items: center;
        overflow: auto;
    }
    .datetimePicker-time-select {
        flex-shrink: 0;
        font-size: var(--fontSize-s);
        width: 2em;
        line-height: 2em;
        border-radius: 50%;
        margin: 0 10rpx;
        text-align: center;
    }
    .datetimePicker-button {
        width: 100%;
        text-align: center;
        border-radius: 100rpx;
        line-height: 2.2em;
        justify-content: space-evenly;
        border: 2rpx solid #86e724;
        color: white;
        font-weight: 900;
        margin: 0 20rpx;
    }
</style>
