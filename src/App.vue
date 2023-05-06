<script>
    export default {
        onLaunch: function () {
            // console.log('App Launch');
        },
        onShow: function () {
            // console.log('App Show');
        },
        onHide: function () {
            // console.log('App Hide');
        },
    };
</script>

<style>
    /*********************** font ***********************/
    @font-face {
        font-family: 'iconfont'; /* Project id 4045984 */
        src: url('//at.alicdn.com/t/c/font_4045984_1b2afz26zzz.woff2?t=1682954519206') format('woff2'), url('//at.alicdn.com/t/c/font_4045984_1b2afz26zzz.woff?t=1682954519206') format('woff'), url('//at.alicdn.com/t/c/font_4045984_1b2afz26zzz.ttf?t=1682954519206') format('truetype');
    }

    @font-face {
        font-family: 'app-font'; /* Project id 4045984 */
        src: url('../static/font/font.ttf') format('truetype');
    }

    * {
        padding: 0;
        margin: 0;
        font-family: iconfont;
    }

    .font {
        font-family: app-font, iconfont;
    }

    span {
        font-family: inherit;
    }

    :root {
        --fontSize-ss: 28rpx;
        --fontSize-s: 35rpx;
        --fontSize-m: 50rpx;
        --fontSize-l: 65rpx;
    }

    /*********************** background ***********************/
    .background {
        background: -webkit-linear-gradient(top, transparent 40rpx, rgb(218, 218, 106) 41rpx), -webkit-linear-gradient(left, rgb(241, 245, 246) 40rpx, rgb(218, 218, 106) 41rpx);
        background-size: 42rpx 42rpx;
    }
</style>
