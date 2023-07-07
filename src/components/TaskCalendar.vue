<template>
    <view class="taskCalendar">
        <view class="taskCalendar-weeks">
            <view class="taskCalendar-week" v-for="item in '一二三四五六日'">{{ item }}</view>
        </view>
        <view class="taskCalendar-cont" @touchend="scrollCont" ref="daysCont">
            <view class="taskCalendar-days">
                <view :class="{ 'taskCalendar-day': true, 'taskCalendar-hidden': !item.isCurrentMonth }" v-for="item in lastDays">
                    <view :class="{ 'taskCalendar-num': true, 'taskCalendar-current': item.day === this.day }" @click="changeDate(item)">{{ item.day }}</view>
                    <view :class="{ 'taskCalendar-tag': 1, 'taskCalendar-tag-special': item.isSpecial }">{{ item.tag }}</view>
                </view>
            </view>
            <view class="taskCalendar-days">
                <view :class="{ 'taskCalendar-day': true, 'taskCalendar-hidden': !item.isCurrentMonth }" v-for="item in days">
                    <view :class="{ 'taskCalendar-num': true, 'taskCalendar-current': item.day === this.day }" @click="changeDate(item)">{{ item.day }}</view>
                    <view :class="{ 'taskCalendar-tag': 1, 'taskCalendar-tag-special': item.isSpecial }">{{ item.tag }}</view>
                </view>
            </view>
            <view class="taskCalendar-days">
                <view :class="{ 'taskCalendar-day': true, 'taskCalendar-hidden': !item.isCurrentMonth }" v-for="item in nextDays">
                    <view :class="{ 'taskCalendar-num': true, 'taskCalendar-current': item.day === this.day }" @click="changeDate(item)">{{ item.day }}</view>
                    <view :class="{ 'taskCalendar-tag': 1, 'taskCalendar-tag-special': item.isSpecial }">{{ item.tag }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import calendarFormatter from '../js/lunarCalendar';

    export default {
        props: ['year', 'month', 'day'],
        emits: ['changeDate'],
        data: () => ({}),
        computed: {
            days() {
                return this.getMonthDays(this.year, this.month);
            },
            lastDays() {
                if (this.month == 1) {
                    return this.getMonthDays(this.year - 1, 12);
                } else {
                    return this.getMonthDays(this.year, this.month - 1);
                }
            },
            nextDays() {
                if (this.month == 12) {
                    return this.getMonthDays(this.year + 1, 1);
                } else {
                    return this.getMonthDays(this.year, this.month + 1);
                }
            },
        },
        methods: {
            getMonthDays(year, month) {
                const days = [];
                const startDay = new Date(`${year}/${month}/1`);
                startDay.setHours(-24 * startDay.getDay() + 24);
                while (startDay.getMonth() < month) {
                    const lunar = calendarFormatter.solar2lunar(this.year, this.month, startDay.getDate());
                    const day = {
                        year: startDay.getFullYear(),
                        month: startDay.getMonth() + 1,
                        day: startDay.getDate(),
                        isSpecial: false,
                        isCurrentMonth: startDay.getMonth() + 1 == month,
                    };
                    if (lunar.Term) {
                        day.tag = lunar.Term;
                        day.isSpecial = true;
                    } else {
                        day.tag = lunar.IDayCn === '初一' ? lunar.IMonthCn : lunar.IDayCn;
                    }
                    days.push(day);
                    startDay.setHours(24);
                }
                return days;
            },
            changeDate(date) {
                this.$emit('changeDate', date);
            },
            scrollCont(e) {
                const el = this.$refs.daysCont.$el;
                console.log(el.scrollWidth, el.scrollLeft);
            }
        },
    };
</script>

<style scoped>
    /* taskCalendar */
    .taskCalendar {
        font-size: 35rpx;
        margin: 20rpx 10rpx 0;
    }
    .taskCalendar-weeks {
        margin-top: 20rpx;
        display: flex;
    }
    .taskCalendar-week {
        text-align: center;
        width: 100%;
        font-size: 28rpx;
    }
    .taskCalendar-cont {
        margin-top: 30rpx;
        display: flex;
        width: 100%;
        overflow-x: scroll;
        height: 700rpx;
    }
    .taskCalendar-days {
        display: grid;
        grid: auto-flow 1fr / repeat(7, 1fr);
        transition: height 0.3s;
        overflow: hidden;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
    }
    .taskCalendar-day {
        text-align: center;
        font-weight: 600;
    }
    .taskCalendar-hidden {
        visibility: hidden;
        pointer-events: none;
    }
    .taskCalendar-num {
        border-radius: 50%;
        width: 1.8em;
        height: 1.8em;
        line-height: 1.8em;
        text-align: center;
        margin: auto;
    }
    .taskCalendar-current {
        background: rgb(101, 194, 231);
        color: #fff;
    }
    .taskCalendar-tag {
        color: #888;
        margin-top: 0rpx;
        font-size: 20rpx;
        font-weight: 500;
    }
    .taskCalendar-tag-special {
        color: #000;
    }
</style>
