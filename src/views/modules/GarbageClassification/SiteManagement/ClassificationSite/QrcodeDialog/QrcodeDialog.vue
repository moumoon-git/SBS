<template>
    <transition name="fadeout">
        <div
            class="qrcode-dialog"
            v-if="visible"
        >
            <div class="qrcode-dialog__shade" @click="visible = false"></div>
            <div class="qrcode-dialog__main">
                <div class="qrcode-dialog__header">
                    {{title}}
                </div>
                <div
                    class="qrcode-dialog__close"
                    @click="visible = false"
                ></div>
                <div class="qrcode-dialog__content">
                    <img
                        :src="src"
                        alt=""
                        ref="qrcode"
                    >
                    <div v-if="range.length > 0">投放时间</div>
                    <div
                        v-for="(item, index) in range"
                        :key="`time_range_${index}`"
                    >
                        <span style="display:inline-block;width:45px;text-align:center;">{{item.startTime}}</span>
                        <span>~</span>
                        <span style="display:inline-block;width:45px;text-align:center;">{{item.endTime}}</span>
                    </div>
                </div>
                <div class="qrcode-dialog__footer">
                    <sv-button @click="saveQrcode">保存二维码</sv-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'QrcodeDialog',
    props: {
        api: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            visible: false,
            src: '',
            id: '',
            range: [],
            title: ''
        }
    },
    methods: {
        init(row) {
            this.id = row.id
            this.title = row.name || '二维码'
            this.range = []
            this.src = row.qrCode && row.qrCode.length && row.qrCode.indexOf('http') > -1 ? row.qrCode : window.SITE_CONFIG.cloudUrl + row.qrCode
            this.getData()
            this.visible = true
        },
        /**
         * @method
         * @desc 获取基本信息页面的信息
         * @param {String} id 数据的id
         */
        getData() {
            this.loading = true
            const request = {
                method: 'get',
                url: this.api[0],
                baseURL: window.SITE_CONFIG.baseUrl,
                params: {
                    id: this.id,
                    token: this.$cookie.get('token')
                }
            }
            this.$http(request)
            .then(response => {
                if(response.data.code == 0) {
                    if(response.data.data.launchTimeList && response.data.data.launchTimeList.length > 0) {
                        this.range = response.data.data.launchTimeList
                    }
                } else {
                    console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】')
                }
                this.loading = false
            })
            .catch(error => {
                console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】')
                this.loading = false
            })
        },
        /**
         * @method
         * @desc 下载保存图片
         */
        saveQrcode() {
            const request = {
                method: 'get',
                url:  this.api[1],
                baseURL: window.SITE_CONFIG.baseUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    token: this.$cookie.get('token')
                },
                params: {
                    id: this.id,
                    token: this.$cookie.get('token')
                },
                responseType: 'arraybuffer'
            }
            this.$http(request).then(
                response => {
                    let a = document.createElement('a')
                    a.href = window.URL.createObjectURL(new Blob([response.data], {type: 'image/jpg'}))
                    a.download = '二维码.png'
                    document.body.appendChild(a)   // 兼容Firefox浏览器
                    a.click()
                    a.remove()
                }
            ).catch(
                error => {
                    console.log('导出失败！错误信息：【\n', error, '\n】')
                }
            )
        }
    },
    mounted() {
        // 监听ESC按键
        this.$nextTick(() => {
            document.addEventListener('keyup', e => {
                e.keyCode === 27 ? this.visible = false : null
            })
        })
    }
}
</script>

<style scoped lang="scss">
// 弹出动画
@keyframes pop-up {
    from {transform: scale(0) translate(-50%, -50%);}
    to {transform: scale(1) translate(-50%, -50%);}
}
.qrcode-dialog {
    position: fixed;
    z-index: 99999;
    transform-origin: center;
    &__shade {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        opacity: .5;
        z-index: -1;
    }
    &__main {
        width: 464px;
        border-radius: 8px;
        background: linear-gradient(180deg, #0052BE 0%, #4EB7FF 100%);
        box-shadow: 0px 0px 21px 2px rgba(0, 0, 0, 0.15);
        // 屏幕垂直居中
        position: fixed;
        left: 50vw;
        top: 50vh;
        transform: translate(-50%, -50%);
        // 弹出动画
        animation: pop-up 0.3s;
        transform-origin: right top;
    }
    &__header {
        color: #ffffff !important;
        font-size: 32px !important;
        line-height: 32px;
        text-align: center;
        margin: 35px 20px 20px;
    }
    &__close {
        position: absolute;
        right: 15px;
        top: 15px;
        width: 15px;
        height: 15px;
        background: no-repeat url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTk5MTI5MTAzMTcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzODgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMS45NjggMzc2LjIyNCA3OTYuMDk2IDkyLjA5NkM4MzMuNTM2IDU0LjYyNCA4OTQuNCA1NC42MjQgOTMxLjg0IDkyLjA5NiA5NjkuMzEyIDEyOS41NjggOTY5LjMxMiAxOTAuNCA5MzEuODQgMjI3Ljg3Mkw2NDcuNzQ0IDUxMiA5MzEuODQgNzk2LjA5NkM5NjkuMzEyIDgzMy41NjggOTY5LjMxMiA4OTQuNCA5MzEuODQgOTMxLjg3MiA4OTQuNCA5NjkuMzQ0IDgzMy41MzYgOTY5LjM0NCA3OTYuMDk2IDkzMS44NzJMNTExLjk2OCA2NDcuNzQ0IDIyNy44NCA5MzEuODcyQzE5MC40IDk2OS4zNDQgMTI5LjUzNiA5NjkuMzQ0IDkyLjA5NiA5MzEuODcyIDU0LjYyNCA4OTQuNCA1NC42MjQgODMzLjU2OCA5Mi4wOTYgNzk2LjA5NkwzNzYuMjI0IDUxMiA5Mi4wOTYgMjI3Ljg3MkM1NC42MjQgMTkwLjQgNTQuNjI0IDEyOS41NjggOTIuMDk2IDkyLjA5NiAxMjkuNTM2IDU0LjYyNCAxOTAuNCA1NC42MjQgMjI3Ljg0IDkyLjA5Nkw1MTEuOTY4IDM3Ni4yMjRaIiBwLWlkPSIyMzg5IiBmaWxsPSIjQkNDNUNGIj48L3BhdGg+PC9zdmc+) center/100% 100%;
        cursor: pointer;
        &:hover {
            background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTk5MTI5MTAzMTcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzODgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMS45NjggMzc2LjIyNCA3OTYuMDk2IDkyLjA5NkM4MzMuNTM2IDU0LjYyNCA4OTQuNCA1NC42MjQgOTMxLjg0IDkyLjA5NiA5NjkuMzEyIDEyOS41NjggOTY5LjMxMiAxOTAuNCA5MzEuODQgMjI3Ljg3Mkw2NDcuNzQ0IDUxMiA5MzEuODQgNzk2LjA5NkM5NjkuMzEyIDgzMy41NjggOTY5LjMxMiA4OTQuNCA5MzEuODQgOTMxLjg3MiA4OTQuNCA5NjkuMzQ0IDgzMy41MzYgOTY5LjM0NCA3OTYuMDk2IDkzMS44NzJMNTExLjk2OCA2NDcuNzQ0IDIyNy44NCA5MzEuODcyQzE5MC40IDk2OS4zNDQgMTI5LjUzNiA5NjkuMzQ0IDkyLjA5NiA5MzEuODcyIDU0LjYyNCA4OTQuNCA1NC42MjQgODMzLjU2OCA5Mi4wOTYgNzk2LjA5NkwzNzYuMjI0IDUxMiA5Mi4wOTYgMjI3Ljg3MkM1NC42MjQgMTkwLjQgNTQuNjI0IDEyOS41NjggOTIuMDk2IDkyLjA5NiAxMjkuNTM2IDU0LjYyNCAxOTAuNCA1NC42MjQgMjI3Ljg0IDkyLjA5Nkw1MTEuOTY4IDM3Ni4yMjRaIiBwLWlkPSIyMzg5IiBmaWxsPSIjZGJkYmRiIj48L3BhdGg+PC9zdmc+);
        }
    }
    &__content {
        width: 340px;
        background: #FFFFFF;
        margin: 0 auto;
        padding: 10px;
        text-align: center;
        img {
            width: 320px;
            height: 320px;
        }
        & > div {
            font-size: 16px !important;
            color: #333333 !important;
            // 投放时间标题
            &:nth-child(2) {
                font-size: 22px !important;
                font-weight: bold;
                margin: 0 10px 10px;
            }
        }
    }
    &__footer {
        padding: 15px 0 20px;
        text-align: center;
    }
}
// 弹窗消失渐变效果
.fadeout-leave-active{
    transition: opacity .3s;
}
.fadeout-leave-to{
    opacity: 0;
}
</style>