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
    /* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
    @font-face {
        font-family: 'iconfont'; /* Project id 4045984 */
        src: url('//at.alicdn.com/t/c/font_4045984_g9hcdgv5ac5.woff2?t=1686191568043') format('woff2'), url('//at.alicdn.com/t/c/font_4045984_g9hcdgv5ac5.woff?t=1686191568043') format('woff'), url('//at.alicdn.com/t/c/font_4045984_g9hcdgv5ac5.ttf?t=1686191568043') format('truetype');
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

    .background {
        background: -webkit-linear-gradient(top, transparent 40rpx, rgb(218, 218, 106) 41rpx), -webkit-linear-gradient(left, rgb(241, 245, 246) 40rpx, rgb(218, 218, 106) 41rpx);
        background-size: 42rpx 42rpx;
    }
</style>
