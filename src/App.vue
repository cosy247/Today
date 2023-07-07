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
        src: url('//at.alicdn.com/t/c/font_4045984_ntmualuv72.woff2?t=1686274231478') format('woff2'), url('//at.alicdn.com/t/c/font_4045984_ntmualuv72.woff?t=1686274231478') format('woff'), url('//at.alicdn.com/t/c/font_4045984_ntmualuv72.ttf?t=1686274231478') format('truetype');
    }

    /* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
    @font-face {
        font-family: 'app-font'; /* Project id 4045984 */
        src: url('../static/font/HarmonyOS_Sans_SC_Regular.ttf')  format('truetype');
    }

    * {
        padding: 0;
        margin: 0;
        font-family: iconfont, app-font ;
    }

    :root {
        --fontSize-s: 25rpx;
        --fontSize-m: 50rpx;
        --fontSize-l: 65rpx;
    }

    body {
        background: #fefefe;
    }
</style>
