<template>
    <div class="monitor-dialog">
        <sv-dialog
            ref="dialog"
            title="查看监控"
            @cancel="$refs.dialog.visible = false"
            @modal="$refs.dialog.visible = false"
        >
            <div class="monitor-dialog__container">
                <iframe
                    frameborder="0"
                    height="100%"
                    width="100%"
                    :src="`/static/LiveMonitorVideo.html?user=${monitorVideoConfig.user}&key=${monitorVideoConfig.key}&ip=${monitorVideoConfig.ip}&guid=${monitorVideoConfig.guid}`"
                    style="border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;"
                ></iframe>
            </div>
            <!-- 隐藏页脚 -->
            <template #footer><span></span></template>
        </sv-dialog>
    </div>
</template>

<script>
export default {
    name: 'MonitorDialog',
    data() {
        return {
            monitorVideoConfig: {
                user: '',
                key: '',
                ip: '',
                guid: ''
            }
        }
    },
    methods: {
        init(indexCode) {
            this.monitorVideoConfig.guid = indexCode
            this.$refs.dialog.visible = true
        },
        getMonitorVideoConfig() {
            // 获取账号
            this.$http
            .get(`${window.SITE_CONFIG.baseUrl}/sys/config/infoByKey?key=SH_SP_USER`)
            .then(response => {
                if(response.data.code == 0) {
                    this.monitorVideoConfig.user = response.data.config.paramValue ? response.data.config.paramValue : ''
                } else {
                    console.log('获取监控视频登录用户账号失败！错误信息：【\n', response, '\n】')
                }
            })
            .catch(error => {
                console.log('获取监控视频登录用户账号失败！错误信息：【\n', error, '\n】')
            })
            // 获取密码
            this.$http
            .get(`${window.SITE_CONFIG.baseUrl}/sys/config/infoByKey?key=SH_SP_PASSWORD`)
            .then(response => {
                if(response.data.code == 0) {
                    this.monitorVideoConfig.key = response.data.config.paramValue ? response.data.config.paramValue : ''
                } else {
                    console.log('获取监控视频登录用户密码失败！错误信息：【\n', response, '\n】')
                }
            })
            .catch(error => {
                console.log('获取监控视频登录用户密码失败！错误信息：【\n', error, '\n】')
            })
            // 获取IP地址
            this.$http
            .get(`${window.SITE_CONFIG.baseUrl}/sys/config/infoByKey?key=SH_SP_IP`)
            .then(response => {
                if(response.data.code == 0) {
                    this.monitorVideoConfig.ip = response.data.config.paramValue ? response.data.config.paramValue : ''
                } else {
                    console.log('获取监控视频登录用户IP地址失败！错误信息：【\n', response, '\n】')
                }
            })
            .catch(error => {
                console.log('获取监控视频登录用户IP地址失败！错误信息：【\n', error, '\n】')
            })
        }
    },
    mounted() {
        this.getMonitorVideoConfig()
    }
}
</script>

<style lang="scss" scoped>
.monitor-dialog {
    &__container {
        width: 700px;
        height: 600px;
        overflow: hidden;
    }
}
</style>