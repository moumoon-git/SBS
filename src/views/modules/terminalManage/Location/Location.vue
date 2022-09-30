<template>
    <div class="location">
        <template v-if="!displayOnly">
            <div class="location__search">
                <input
                    class="location__search__inner"
                    placeholder="请输入要搜索的地点"
                    v-model="searchKeyword"
                    @change="handleSearch"
                >
                <div
                    class="location__search__button"
                    @click="handleSearch"
                ></div>
                <div
                    class="location__search__result"
                    v-if="searchKeyword"
                    ref="searchResultContainer"
                >
                    &nbsp;&nbsp;正在搜索...
                </div>
            </div>
            <div class="location__hint">注：可鼠标点击手动定位</div>
        </template>
        <div class="location__map" ref="map"></div>
        <div class="location__address">
            {{currentAddress}}
            <sv-button
                class="location__confirm"
                @click="confirm"
                v-if="!displayOnly"
            >确定位置</sv-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'location',
    props: {
        // 初始地址
        address: {
            type: String,
            default: ''
        },
        // 初始经纬度
        lngLat: {
            type: Array,
        },
        // 只查看，不能搜索和定位
        displayOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 当前的地图对象
            currentMap: '',
            // 当前地址
            currentAddress: '',
            // 当前经纬度
            currentLngLat: '',
            // 初始中心点所在的城市，用于限定搜索范围
            currentCity: '',
            // 搜索关键词
            searchKeyword: '',
            // 当前的搜索组件对象
            currentPlaceSearch: '',
            // 当前的点击落点
            currentMarker: '',
        }
    },
    methods: {
        /**
         * @method
         * @desc 初始化地图
         */
        init() {
            // 初始化高德地图
            const map = new AMap.Map(this.$refs.map, {
                // 缩放级别
                zoom: 15,
                // 初始中心点
                center: this.currentLngLat
            })
            this.currentMap = map
            if(this.address) {
                const marker = new AMap.Marker({
                    map,
                    position: this.currentLngLat,
                })
                this.currentMarker = marker
            }
            // 不是单纯展示的时候，增加点击定位操作
            if(!this.displayOnly) {
                // 坐标转换地址组件
                const geocoder = new AMap.Geocoder({extensions: 'all'})
                // 获取初始点所在的城市
                geocoder.getAddress(
                    this.currentLngLat,
                    (status, result) => {
                        if (status === 'complete' && result.regeocode) {
                            this.currentCity = result.regeocode.addressComponent.citycode
                        } else {
                            console.log('坐标地址转换失败！错误信息：【\n', status, result, '\n】')
                        }
                    }
                )
                // 点击定位
                map.on('click', event => {
                    // 清除地图
                    if(this.currentMarker.setMap) {
                        this.currentMarker.setMap(null)
                    }
                    // 地图中心移动到点击处
                    const marker = new AMap.Marker({
                        map,
                        position: [event.lnglat.getLng(), event.lnglat.getLat()],
                    })
                    this.currentMarker = marker
                    // 坐标转换地址
                    geocoder.getAddress(
                        [event.lnglat.getLng(), event.lnglat.getLat()],
                        (status, result) => {
                            if (status === 'complete' && result.regeocode) {
                                const address = result.regeocode.formattedAddress
                                this.currentAddress = address
                                this.currentLngLat = [event.lnglat.getLng(), event.lnglat.getLat()]
                                map.panTo([event.lnglat.getLng(), event.lnglat.getLat()])
                            } else {
                                console.log('坐标地址转换失败！错误信息：【\n', status, result, '\n】')
                            }
                        }
                    )
                })
            }
            // 添加UI控件
            AMapUI.loadUI(
                ['control/BasicControl'],
                BasicControl => {
                    // 图层切换控件
                    map.addControl(new BasicControl.LayerSwitcher({
                        position: 'tr'
                    }))
                    // 缩放控件，显示Zoom值
                    map.addControl(new BasicControl.Zoom({
                        position: 'lb'
                    }));
                }
            )
        },
        /**
         * @method
         * @desc 确认位置，向父组件传递地址和经纬度
         */
        confirm() {
            if(this.currentLngLat[0] && this.currentLngLat[1] && this.currentAddress) {
                this.$emit('confirm', this.currentAddress, this.currentLngLat)
            }
        },
        /**
         * @method
         * @desc 执行搜索
         */
        handleSearch() {
            AMap.plugin('AMap.PlaceSearch', _ => {
                // 清除上一次搜索的结果
                if(this.currentPlaceSearch.clear) {
                    this.currentPlaceSearch.clear()
                }
                // 创建一个新的搜索
                const placeSearch = new AMap.PlaceSearch({
                    city: this.currentCity,
                    citylimit: true,
                    map: this.currentMap,
                    autoFitView: true,
                    panel: this.$refs.searchResultContainer
                })
                this.currentPlaceSearch = placeSearch
                placeSearch.search(this.searchKeyword)
                // 搜索结果增加点击监听
                placeSearch.on('markerClick', e => {
                    this.currentAddress = e.data.pname + e.data.cityname + e.data.adname + e.data.address
                    this.currentLngLat = [e.data.location.lng, e.data.location.lat]
                })
                placeSearch.on('listElementClick', e => {
                    this.currentAddress = e.data.pname + e.data.cityname + e.data.adname + e.data.address
                    this.currentLngLat = [e.data.location.lng, e.data.location.lat]
                })
            })
        }
    },
    mounted() {
        // 有初始值使用初始值，没有则使用平台的经纬度和地址
        this.currentLngLat = this.lngLat[0] && this.lngLat[1] ? this.lngLat : [this.$cookie.get('longitude'), this.$cookie.get('latitude')]
        this.currentAddress = this.address ? this.address : ''
        this.$nextTick(() => {
            this.init()
        })
    },
    watch: {
        address: function(val) {
            this.currentLngLat = this.lngLat[0] && this.lngLat[1] ? this.lngLat : [this.$cookie.get('longitude'), this.$cookie.get('latitude')]
            this.currentAddress = this.address ? this.address : ''
            this.$nextTick(() => {
                this.init()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.location {
    position: relative;
    color: #666666;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    &__search {
        transition: all 0.1s;
        border: 1px solid #DDDDDD;
        &:hover {
            border: 1px solid #b4b4b4;
        }
        &:focus-within {
            border: 1px solid #0091FF;
        }
        border-radius: 3px;
        display: flex;
        width: 250px;
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
        font-size: 14px;
        margin-bottom: 15px;
        position: relative;
        &__inner {
            border: none;
            outline: none;
            flex: 1;
            &::-webkit-input-placeholder {
                color: #DDDDDD;
            }
        }
        &__button {
            width: 40px;
            height: 100%;
            background: #DDDDDD;
            cursor: pointer;
            position: relative;
            &::after {
                content: '';
                background: no-repeat center/100% 100% url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAwNzM3MDEyMDkzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MzMiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTg4My42MjY2NjcgODIzLjA0bC0xNDUuMDY2NjY3LTE0NC42NEEzMzcuOTIgMzM3LjkyIDAgMCAwIDgxMC42NjY2NjcgNDY5LjMzMzMzM2EzNDEuMzMzMzMzIDM0MS4zMzMzMzMgMCAxIDAtMzQxLjMzMzMzNCAzNDEuMzMzMzM0IDMzNy45MiAzMzcuOTIgMCAwIDAgMjA5LjA2NjY2Ny03Mi4xMDY2NjdsMTQ0LjY0IDE0NS4wNjY2NjdhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMCA2MC41ODY2NjcgMCA0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDAtNjAuNTg2NjY3ek0yMTMuMzMzMzMzIDQ2OS4zMzMzMzNhMjU2IDI1NiAwIDEgMSAyNTYgMjU2IDI1NiAyNTYgMCAwIDEtMjU2LTI1NnoiIHAtaWQ9IjE1MzQiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=);
                display: block;
                width: 20px;
                height: 20px;
                position: absolute;
                right: 10px;
                top: 3px;
            }
            &:active::after {
                top: 4px;
            }
        }
        &:hover &__button {
            background: #b4b4b4;
        }
        &:focus-within &__button {
            background: #0091FF;
        }
        &__result {
            width: calc(100% + 2px);
            max-height: 400px;
            border-radius: 6px;
            background: #ffffff;
            box-shadow: 0px 5px 5px 3px rgba(0, 0, 0, 0.1);
            position: absolute;
            z-index: 100;
            left: -1px;
            top: 30px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 0;
            }
        }
    }
    &__hint {
        position: absolute;
        top: 45px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: rgba(245, 248, 255, .86);
        z-index: 1;
        user-select: none;
    }
    &__map {
        width: 100%;
        min-height: 574px;
        flex: 1;
    }
    &__address {
        width: calc(100% - 150px);
        min-height: 50px;
        position: relative;
        margin: 15px 70px;
        &::before {
            content: '地址名称：';
            display: block;
            width: 70px;
            height: 50px;
            position: absolute;
            left: -70px;
            top: 0;
        }
    }
    &__confirm {
        position: absolute;
        right: -80px;
        top: 0;
    }
}
</style>