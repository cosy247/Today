<template>
    <view class="home-calendar">
        <view class="home-calendar-weeks">
            <view class="home-calendar-week" v-for="item in '一二三四五六日'">{{ item }}</view>
        </view>
        <view class="home-calendar-days" :style="{ height: `${Math.ceil(days.length / 7) * 130}rpx` }">
            <view :class="{ 'home-calendar-day': true, 'home-calendar-hidden': item.month !== this.month }" v-for="item in days">
                <view :class="{ 'home-calendar-num': true, 'home-calendar-current': item.day === this.day }">{{ item.day }}</view>
                <view :class="{ 'home-calendar-tag': 1, 'home-calendar-tag-special': item.isSpecial }">{{ item.tag }}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import calendarFormatter from '../js/lunarCalendar';

    export default {
        props: ['date'],
        data() {
            const [year, month, day] = this.$props.date.split('/').map(item => +item);
            return { year, month, day };
        },
        computed: {
            days() {
                const days = [];
                const startDay = new Date(`${this.year}/${this.month}/1`);
                startDay.setHours(-24 * startDay.getDay() + 24);
                while (startDay.getMonth() < this.month) {
                    const lunar = calendarFormatter.solar2lunar(this.year, this.month, startDay.getDate());
                    console.log(startDay.getMonth() + 1);
                    const day = { month: startDay.getMonth() + 1, day: startDay.getDate(), isSpecial: false };
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
        },
    };
</script>

<style scoped>
    /* home-calendar */
    .home-calendar {
        font-size: 35rpx;
        margin: 20rpx 10rpx 0;
    }
    .home-calendar-weeks {
        margin-top: 20rpx;
        display: flex;
    }
    .home-calendar-week {
        text-align: center;
        width: 100%;
    }
    .home-calendar-days {
        margin-top: 30rpx;
        display: grid;
        grid: auto-flow 130rpx / repeat(7, 1fr);
        transition: height 0.3s;
        overflow: hidden;
    }
    .home-calendar-day {
        text-align: center;
        font-weight: 600;
    }
    .home-calendar-hidden {
        visibility: hidden;
        pointer-events: none;
    }
    .home-calendar-num {
        border-radius: 50%;
        width: 1.8em;
        height: 1.8em;
        line-height: 1.8em;
        text-align: center;
        margin: auto;
    }
    .home-calendar-current {
        background: rgb(169, 174, 241);
        color: #fff;
    }
    .home-calendar-tag {
        color: #888;
        margin-top: 0rpx;
        font-size: 20rpx;
    }
    .home-calendar-tag-special {
        color: #000;
    }
</style>
