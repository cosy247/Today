<template>
    <view :class="{ 'datetimePicker-root': 1, 'datetimePicker-show': show }">
        <view class="datetimePicker-mask" @click="cancelHandel"></view>
        <view class="datetimePicker-main">
            <view class="datetimePicker-header">
                <view class="datetimePicker-header-today font" @click="goToday">今天</view>
                <view @click="lastYear">&#xe641;</view>
                <view @click="lastMoon">&#xe640;</view>
                <view>{{ year }}年{{ moon }}月</view>
                <view @click="nextMoon">&#xe63e;</view>
                <view @click="nextYear">&#xe642;</view>
                <view class="datetimePicker-header-close font" @click="cancelHandel">&#xe658;</view>
            </view>
            <view class="datetimePicker-weeks">
                <view class="datetimePicker-week font" v-for="item in '一二三四五六日'">{{ item }}</view>
            </view>
            <view class="datetimePicker-days">
                <view :class="{ 'datetimePicker-moonDay': item[1] == moon, 'detetimePicker-dis': !checkDateCanSelect(item) }" v-for="item in days" :style="item[0] == year && item[1] == moon && item[2] == day ? `color:#fff; background:${color}` : ''" @click="[year, moon, day] = item">{{ item[2] }}</view>
            </view>
            <view class="datetimePicker-time" v-show="selectTime">
                <view class="datetimePicker-time-hours" @click="isShowSelectHours = true">
                    {{ hours }}
                </view>
                <view>:</view>
                <view class="datetimePicker-time-minute" @click="isShowSelectMinute = true">
                    {{ minute }}
                </view>
                <view class="datetimePicker-time-selects" v-show="isShowSelectHours" ref="selectHours">
                    <view class="datetimePicker-time-select" v-for="(item, index) in 24" @click="(hours = index), (isShowSelectHours = false)" :style="{ background: hours == index ? color : '' }">{{ index }}</view>
                </view>
                <view class="datetimePicker-time-selects" v-show="isShowSelectMinute" ref="selectMinute">
                    <view class="datetimePicker-time-select" v-for="(item, index) in 60" @click="(minute = index), (isShowSelectMinute = false)" :style="{ background: minute == index ? color : '' }">{{ index }}</view>
                </view>
            </view>
            <view class="datetimePicker-buttons">
                <view class="datetimePicker-button" :style="`background:${color}`" @click="submitHandel">确定</view>
                <view class="datetimePicker-button" :style="`background:${color}`" @click="cancelHandel">取消</view>
            </view>
        </view>
        <view />
    </view>
</template>

<script>
    export default {
        data() {
            const now = new Date();

            // 定义全局函数调用时间选择器
            window.$datetiemPicker = (props = {}) => {
                const { datetime = now, color = '#007aff', maxDatetime, minDatetime, selectTime = true, submit, cancel } = props;
                const date = new Date(datetime);

                this.year = date.getFullYear();
                this.moon = date.getMonth() + 1;
                this.day = date.getDate();
                this.hours = date.getHours();
                this.minute = date.getMinutes();

                this.selectTime = selectTime;
                this.minDatetime = minDatetime ? new Date(minDatetime).toLocaleString().split(/ |\/|:/) : ['0', '0', '0', '0', '0', '0'];
                this.maxDatetime = maxDatetime ? new Date(maxDatetime).toLocaleString().split(/ |\/|:/) : ['9999', '0', '0', '0', '0', '0'];
                this.submit = submit;
                this.cancel = cancel;

                this.color = color;

                this.show = true;
                this.isShowSelectHours = false;
                this.isShowSelectMinute = false;
            };

            return {
                /** 主題顔色 */
                color: '#ff7aff',

                /** 年份 */
                year: now.getFullYear(),
                /** 月份 */
                moon: now.getMonth() + 1,
                /** 号数 */
                day: now.getDay(),
                /** 小时 */
                hours: now.getHours(),
                /** 分钟 */
                minute: now.getMinutes(),

                /** 小时时间是否可算 */
                selectTime: false,
                /** 最小选择时间，[年，月，日，小时，分钟，秒] */
                minDatetime: ['0', '0', '0', '0', '0', '0'],
                /** 最大选择时间，[年，月，日，小时，分钟，秒] */
                maxDatetime: ['9999', '0', '0', '0', '0', '0'],

                /** 确认的回调函数 */
                submit: null,
                /** 取消的回调函数 */
                cancel: null,

                /** 是否显示组件 */
                show: false,
                /** 是否显示小时选择器 */
                isShowSelectHours: false,
                /** 是否显示分钟选择器 */
                isShowSelectMinute: false,
            };
        },
        watch: {
            async isShowSelectHours(data) {
                if (!data) return;
                await this.$nextTick();
                const hoursContDom = this.$refs.selectHours.$el;
                const contWidth = parseInt(getComputedStyle(hoursContDom).width);
                const sty = getComputedStyle(hoursContDom.firstElementChild);
                const itemWidth = parseFloat(sty.width) + parseFloat(sty.marginLeft) + parseFloat(sty.marginRight);
                hoursContDom.scrollLeft = this.hours * itemWidth - contWidth / 2 + itemWidth / 2;
            },
            async isShowSelectMinute(data) {
                if (!data) return;
                await this.$nextTick();
                const minuteContDom = this.$refs.selectMinute.$el;
                const contWidth = parseInt(getComputedStyle(minuteContDom).width);
                const sty = getComputedStyle(minuteContDom.firstElementChild);
                const itemWidth = parseFloat(sty.width) + parseFloat(sty.marginLeft) + parseFloat(sty.marginRight);
                minuteContDom.scrollLeft = this.minute * itemWidth - contWidth / 2 + itemWidth / 2;
            },
        },
        computed: {
            // 获取当前月的日期时间，数组中每天都为一个数组：[年，月，日]
            days() {
                const days = [];
                const dateString = `${this.year}/${this.moon}`;
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
            // 下一个月
            nextMoon() {
                if (this.moon == 12) {
                    this.moon = 1;
                    this.year++;
                } else {
                    this.moon++;
                }
            },
            // 上一个月
            lastMoon() {
                if (this.moon == 1) {
                    this.moon = 12;
                    this.year--;
                } else {
                    this.moon--;
                }
            },
            // 下一个月
            nextYear() {
                this.year++;
            },
            // 上一个月
            lastYear() {
                this.year--;
            },
            // 选择今天
            goToday() {
                const now = new Date();
                this.year = now.getFullYear();
                this.moon = now.getMonth() + 1;
                this.day = now.getDate();
            },
            // 检查目标日期是否可选
            checkDateCanSelect([year, moon, day]) {
                const {
                    minDatetime: [minYear, minMoon, minDay],
                    maxDatetime: [maxYear, maxMoon, maxDay],
                } = this;
                const dateNumber = +`${year}${moon.padStart(2, 0)}${day.padStart(2, 0)}`;
                const minDatetiemNumber = +`${minYear}${minMoon.padStart(2, 0)}${minDay.padStart(2, 0)}`;
                const maxDatetiemNumber = +`${maxYear}${maxMoon.padStart(2, 0)}${maxDay.padStart(2, 0)}`;
                return dateNumber >= minDatetiemNumber && dateNumber <= maxDatetiemNumber;
            },
            // 确认日期时间选择
            submitHandel() {
                const { year, moon, day, hours, minute, submit } = this;
                this.show = false;
                if (typeof submit == 'function') {
                    const datetime = new Date(`${year}/${moon}/${day} ${hours}:${minute}:00`);
                    submit(datetime);
                }
            },
            // 取消日期时间选择
            cancelHandel() {
                const { cancel } = this;
                this.show = false;
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
        position: relative;
        padding: 20rpx 40rpx 0;
        box-sizing: border-box;
        position: relative;
        margin: 0 auto;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        font-size: var(--fontSize-s);
    }
    .datetimePicker-header view {
        margin: 0 5rpx;
    }
    .datetimePicker-header-today {
        position: absolute;
        left: 40rpx;
        top: 15rpx;
    }
    .datetimePicker-header-close {
        position: absolute;
        right: 40rpx;
        top: 15rpx;
    }
    .datetimePicker-header-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    .detetimePicker-dis {
        text-decoration: line-through;
        color: #888;
        pointer-events: none;
    }
</style>
