/**
 * @author tanjinfeng
 * @date 2020-10-31
 * @desc 风险排查-工单统计页面
 */
 
<template>
    <div class="ticket-statistics">
        <sv-template
            ref="template"
            title="工单统计"
            :tableRequest="tableRequest"
            @collapse="resize"
        >
            <!-- A. 左边栏 -->
            <template #left__content>
                <div class="ticket-statistics__left">
                    <!-- 树形搜索框 -->
                    <sv-input-tree-search
                        v-model="treeSearchKeyword"
                        width="calc(100% - 20px)"
                        @change="
                            currentGroupId=''
                            getTree()
                            getTableList()
                            getStatistics()
                            getTrend()
                        "
                    />
                    <!-- 树形控件 -->
                    <div
                        class="ticket-statistics__left__tree sv-tree"
                        v-loading="treeLoading"
                        element-loading-spinner="sv-loading"
                    >
                        <div
                            @click="currentGroupId = ''"
                            class="ticket-statistics__left__tree__item"
                            :class="{'ticket-statistics__left__tree__item-selected': currentGroupId == ''}"
                        >全部工单统计</div>
                        <div
                            v-for="(treeItem, treeIndex) in treeList"
                            :key="`tree_item_${treeIndex}`"
                            @click="currentGroupId = treeItem.eventTypeName"
                            class="ticket-statistics__left__tree__item"
                            :class="{'ticket-statistics__left__tree__item-selected': treeItem.eventTypeName == currentGroupId}"
                        >
                            {{treeIndex + 1}}.&nbsp;{{treeItem.platformName}}&nbsp;-&nbsp;{{treeItem.total}}件
                        </div>
                    </div>
                </div>
            </template>
            <!-- B. 上方栏 -->
            <template #upper__container>
                <!-- B-1. 顶部日期选择器 -->
                <div class="ticket-statistics__date">
                    <!-- 日期快捷按钮 -->
                    <div class="ticket-statistics__date__button">
                        <div
                            :class="{'ticket-statistics__date__button-active': dateButton === 1}"
                            @click="dateButton = 1"
                        >今日</div>
                        <div
                            :class="{'ticket-statistics__date__button-active': dateButton === 2}"
                            @click="dateButton = 2"
                        >本周</div>
                        <div
                            :class="{'ticket-statistics__date__button-active': dateButton === 3}"
                            @click="dateButton = 3"
                        >本月</div>
                        <div
                            :class="{'ticket-statistics__date__button-active': dateButton === 4}"
                            @click="dateButton = 4"
                        >全年</div>
                    </div>
                    <!-- 日期范围选择器 -->
                    <sv-select-date v-model="dateRange" @change="handleDateChange()"/>
                </div>
                <!-- B-2. 顶部三卡片 -->
                <div class="ticket-statistics__header">
                    <!-- B-2-1. 工单总数 -->
                    <div
                        class="ticket-statistics__header__data"
                        v-loading="statLoading"
                        element-loading-spinner="sv-loading"
                    >
                        <div>
                            <div>{{statTotal}}</div>
                            <div>工单总数</div>
                        </div>
                        <div
                            class="ticket-statistics__header__data__arrow"
                            :style="dataPageIndex === 0 ? 'cursor: not-allowed' : ''"
                            @click="dataPageIndex !== 0 ? dataPageIndex-- : null"
                        ></div>
                        <div
                            class="ticket-statistics__header__data__arrow"
                            :style="dataPageIndex === dataPageTotal - 1 ? 'cursor: not-allowed' : ''"
                            @click="dataPageIndex !== dataPageTotal - 1 ? dataPageIndex++ : null"
                        ></div>
                        <div class="ticket-statistics__header__data__card">
                            <div
                                v-for="(statPage, statPageIndex) in dataPageTotal"
                                :key="`stat_page_${statPageIndex}`"
                                :class="`ticket-statistics__header__data__${dataPageIndex}`"
                            >
                                <div
                                    v-for="(statItem, statIndex) in stat.slice(statPageIndex * 4, statPageIndex * 4 + 4)"
                                    :key="`stat_item_${statIndex}`"
                                >
                                    <div>{{statItem.num}}</div>
                                    <div>{{statItem.name}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- B-2-2. 工单占比 -->
                    <div
                        class="ticket-statistics__header__pie"
                        v-loading="statLoading"
                        element-loading-spinner="sv-loading"
                    >
                        <div class="ticket-statistics__header__title">工单占比</div>
                        <div class="ticket-statistics__header__pie__left" ref="pie"></div>
                        <div class="ticket-statistics__header__pie__right">
                            <div
                                :class="`ticket-statistics__header__pie__right__item_${piePageIndex * 5 + pieIndex}`"
                                v-for="(pieItem, pieIndex) in stat.slice(piePageIndex * 5, piePageIndex * 5 + 5)"
                                :key="`pie_item_${pieIndex}`"
                                @mouseover="
                                    PieGraph.dispatchAction({type: 'downplay', seriesIndex: 0})
                                    PieGraph.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: piePageIndex * 5 + pieIndex})
                                    currentActive = piePageIndex * 5 + pieIndex
                                "
                            >
                                {{pieItem.name}}
                                <span style="float:right">{{pieItem.percentage}}%</span>
                            </div>
                            <div class="ticket-statistics__header__pie__right__arrow">
                                <div
                                    :class="{'ticket-statistics__header__pie__right__arrow-disabled': piePageIndex === 0}"
                                    @click="piePageIndex !== 0 ? piePageIndex-- : null"></div>
                                <div
                                    :class="{'ticket-statistics__header__pie__right__arrow-disabled': piePageIndex === piePageTotal - 1}"
                                    @click="piePageIndex !== piePageTotal - 1 ? piePageIndex++ : null"></div>
                            </div>
                        </div>
                    </div>
                    <!-- B-2-3. 工单趋势 -->
                    <div
                        class="ticket-statistics__header__trend"
                        v-loading="statLoading"
                        element-loading-spinner="sv-loading"
                    >
                        <div class="ticket-statistics__header__title">工单趋势</div>
                        <sv-select
                            v-model="trendSelect"
                            :clearable="false"
                            width="80px"
                            placeholder=""
                            :options="trendSelectOptions"
                            @change="drawTrend"
                        />
                        <div class="ticket-statistics__header__trend__inner" ref="trend"></div>
                    </div>
                </div>
            </template>
            <!-- C. 下方表格 -->
            <template #middle__operation>
                <!-- 搜索框 -->
                <sv-input-search class="ticket-statistics__search" v-model="tableRequest.params.search" width="200px" @change="getTableList()"/>
            </template>
            <template #middle__table>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="平台名称"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.platformName"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="工单类型"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.eventTypeName"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="工单描述"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.eventDescription"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="报送时间"
                    prop="reportTime"
                />
                <el-table-column
                    header-align="center"
                    align="center"
                    label="工单状态"
                >
                    <template slot-scope="scope">
                        <span style="color:#F94E36" v-if="scope.row.status == '1'">待核实</span>
                        <span style="color:#16C88B" v-else-if="scope.row.status == '2'">核实</span>
                        <span style="color:#F94E36" v-else-if="scope.row.status == '3'">待处理</span>
                        <span style="color:#F8B10C" v-else-if="scope.row.status == '4'">处理中</span>
                        <span style="color:#16C88B" v-else-if="scope.row.status == '5'">已处理</span>
                        <span style="color:#FF8171" v-else-if="scope.row.status == '6'">超出职责</span>
                        <span v-else>其他</span>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="操作"
                    width="120"
                >
                    <template slot-scope="scope">
                        <sv-table-operation
                            :display="['view']"
                            @view="openViewDetailDialog(scope.row)"
                        />
                    </template>
                </el-table-column>
            </template>
        </sv-template>
        <!-- 查看弹窗 -->
        <ViewDialog ref="ViewDialog"/>
    </div>
</template>

<script>
import echarts from 'echarts'
// 查看弹窗
import ViewDialog from '../../word/manager/wordmanager-view'

export default {
    name: 'TicketStatistics',
    components: {
        ViewDialog
    },
    data() {
        return {
            // 树形数据是否正在加载
            treeLoading: false,
            // 树搜索关键词
            treeSearchKeyword: '',
            // 树形数据
            treeList: [],
            // 当前选定分组
            currentGroupId: '',
            // 日期范围按钮取值
            dateButton: 0,
            // 日期选择器取值
            dateRange: ['', ''],
            // 表格数据接口
            tableRequest: {
                api: '/event/eventinfo/listEventinfo',
                params: {
                    PlatformId: '',
                    startTime: '',
                    endTime: '',
                    search: ''
                }
            },
            statLoading: false,
            // 统计数据
            stat: [],
            statTotal: 0,
            // 饼图实例
            PieGraph: '',
            // 工单卡片数据页码
            dataPageIndex: 0,
            // 工单卡片数据总页数
            dataPageTotal: 0,
            // 饼图右侧数据页码
            piePageIndex: 0,
            // 饼图右侧数据总页数
            piePageTotal: 0,
            // 饼图高亮块下标
            currentActive: 0,
            // 趋势图数据
            trend: {
                year: [],
                month: [],
                day: []
            },
            trendSelect: 1,
            trendSelectOptions: [{
                label: '年',
                value: 1
            }, {
                label: '月',
                value: 2
            }, {
                label: '日',
                value: 3
            }],
            // 趋势图实例
            TrendGraph: ''
        }
    },
    methods: {
        /**
         * @method
         * @desc 获取树形数据
         */
        getTree() {
            this.treeLoading = true
            this.currentGroupId = ''
            const request = {
                method: 'get',
                url: `${window.SITE_CONFIG.baseUrl}/event/eventinfo/viewShareCountTotal`,
                params: {
                    startTime: this.dateRange[0],
                    endTime: this.dateRange[1],
                    searchKey: this.treeSearchKeyword
                }
            }
            this.$http(request).then(res => {
                if (res.data.code == 0) {
                    this.treeList = res.data.data
                    this.treeList.sort((a, b) => b.total - a.total)
                    this.treeLoading = false
                }
            })
        },
        /**
         * @method
         * @desc 获取统计数据
         */
        getStatistics() {
            this.statLoading = true
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/event/eventinfo/viewCountTotal?startTime=${this.dateRange[0]}&endTime=${this.dateRange[1]}&paltform=${this.currentGroupId}&typeFlag=1`)
            .then(res=>{
                if (res.data.code == 0) {
                    this.stat = []
                    this.statTotal = 0
                    this.piePageIndex = 0
                    this.piePageTotal = Math.ceil(res.data.data.length / 5)
                    this.dataPageIndex = 0
                    this.dataPageTotal = Math.ceil(res.data.data.length / 4)
                    res.data.data.forEach(item => {
                        this.statTotal += Number(item.total)
                    })
                    res.data.data.forEach(item => {
                        let name = ''
                        // 3：是人员预警工单 4：车辆预警工单 5：疫情预警工单 6： 人群预警工单  7：市场预警工单  9 视屏预警工单  10 ：风险排查工单   11 垃圾分类工单
                        switch(item.eventTypeName) {
                            case '3':
                                name = '人员预警'
                                break
                            case '4':
                                name = '车辆预警'
                                break
                            case '5':
                                name = '疫情预警'
                                break
                            case '6':
                                name = '人群预警'
                                break
                            case '7':
                                name = '市场预警'
                                break
                            case '9':
                                name = '视频预警'
                                break
                            case '10':
                                name = '风险排查'
                                break
                            case '11':
                                name = '垃圾分类'
                                break
                            default:
                                name = '其他'
                        }
                        this.stat.push({
                            num: item.total,
                            name,
                            percentage: this.statTotal ? (100 * Number(item.total)/this.statTotal).toFixed(2) : Number(0).toFixed(2)
                        })
                    })
                    this.drawPieGraph()
                }
                this.statLoading = false
            })
        },
        /**
         * @method
         * @desc 获取列表数据
         */
        getTableList() {
            this.$refs.template.getTableList(this.tableRequest)
        },
        /**
         * @method
         * @desc 获取趋势图数据
         */
        getTrend() {
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/event/eventinfo//viewEventCountTreadTotal?paltform=${this.currentGroupId}`)
            .then(res => {
                if (res.data.code == 0) {
                    this.trend.year = res.data.year
                    this.trend.month = res.data.month
                    this.trend.day = res.data.day
                    this.drawTrend()
                }
            })
        },
        /**
         * @method
         * @desc 选择日期范围变更，获取树形、统计、列表数据
         */
        handleDateChange() {
            if (this.dateRange[0] == '' && this.dateRange[1] == '') {
                this.dateButton = 0
            }
            this.tableRequest.params.startTime = this.dateRange[0]
            this.tableRequest.params.endTime = this.dateRange[1]
            this.getTree()
            this.getStatistics()
            this.getTrend()
            this.getTableList()
        },
        /**
         * @method
         * @desc 点击打开查看详情弹窗
         * @param {Object} data 列表行数据
         */
        openViewDetailDialog(data) {
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/event/eventinfo/searchOneById?id=${data.id}`)
            .then(res => {
                if (res.data.code == 0) {
                    this.$refs.ViewDialog.init(res.data.data)
                }
            })
        },
        /**
         * @method
         * @desc 绘制饼图
         */
        drawPieGraph() {
            const PieGraph = echarts.init(this.$refs.pie)
            const colorList = ['#54A0FF', '#44CC75', '#FBC958', '#FB7293', '#9D96F5','#049DFF', '#83D9FF', '#A3E547', '#FCD75C', '#4481EB', '#46D0ED', '#E4998B', '#D143C9', '#FEB00A', '#FE660A']
            let seriesData = []
            this.stat.forEach((item, index) => {
                seriesData.push({
                    value: item.num,
                    name: item.name
                })
            })
            
            const option = {
                color: colorList,
                series: [{
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['60%', '75%'],
                    avoidLabelOverlap: false,
                    data: seriesData,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: '{top|{c}}{unit|件}\n{btm|{b}}',
                            rich: {
                                top: {
                                    color: '#333333',
                                    fontSize: '26',
                                    fontWeight: 'bold'
                                },
                                unit: {
                                    color: '#333333',
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                },
                                btm: {
                                    color: '#666666',
                                    fontSize: '16'
                                }
                            }
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }]
            }
            PieGraph.setOption(option)
            // 高亮处理
            this.currentActive = 0
            PieGraph.dispatchAction({type: 'downplay', seriesIndex: 0})
            PieGraph.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0})
            PieGraph.on('mouseover', v => {
                if (v.dataIndex != this.currentActive) {
                    PieGraph.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: this.currentActive})
                }
                this.currentActive = v.dataIndex
            })
            PieGraph.on('mouseout', v => {
                PieGraph.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: this.currentActive})
            })
            this.PieGraph = PieGraph
        },
        /**
         * @method
         * @desc 绘制趋势图
         */
        drawTrend() {
            let seriesData = []
            let x = []
            switch(this.trendSelect) {
                case 1:
                    seriesData = this.trend.year.map(e => e.total)
                    x = this.trend.year.map(e => e.eventTypeName)
                    break
                case 2:
                    seriesData = this.trend.month.map(e => e.total)
                    x = this.trend.month.map(e => e.eventTypeName)
                    break
                case 3:
                    seriesData = this.trend.day.map(e => e.total)
                    x = this.trend.day.map(e => e.eventTypeName)
                    break
            }
            const TrendGraph = echarts.init(this.$refs.trend)
            const option = {
                grid: {
                    left: 70,
                    right: 20,
                    top: 15,
                    bottom: 35
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    z: 2,
                    axisPointer: {
                        lineStyle: {
                            color: 'rgba(204, 204, 204, 0.6)'
                        },
                        z: 1
                    },
                    backgroundColor: '#ffffff',
                    padding: [5, 15],
                    textStyle: {
                        color: '#505D6F',
                        fontSize: 14
                    },
                    extraCssText: 'box-shadow: 0px 10px 24px 0px rgba(29, 42, 68, 0.12);text-align: center;',
                    formatter: params => {
                        switch (this.trendSelect) {
                            case 1:
                                return `<div style="color:#505D6F;font-size:14px;">${params[0].name}年</div><div style="color:#333333;font-size:14px;font-weight:bold;">${params[0].value}</div>`
                                break
                            case 2:
                                return `<div style="color:#505D6F;font-size:14px;">${params[0].name.split('-')[0]}年${params[0].name.split('-')[1]}月</div><div style="color:#333333;font-size:14px;font-weight:bold;">${params[0].value}</div>`
                                break
                            case 3:
                                return `<div style="color:#505D6F;font-size:14px;">${params[0].name.split('-')[0]}年${params[0].name.split('-')[1]}月${params[0].name.split('-')[2]}日</div><div style="color:#333333;font-size:14px;font-weight:bold;">${params[0].value}</div>`
                                break
                        }
                    }
                },
                xAxis: {
                    data: x,
                    axisLine: {
                        lineStyle: {
                            color: '#E6E6E6'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666666'
                        }
                    }
                },
                yAxis: [{
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666666',
                            fontSize: 14
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#E6E6E6'
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#0091FF',
                            borderWidth: 1,
                        },
                        emphasis: {
                            borderWidth: 4,
                            shadowBlur: 15,
                            shadowColor: 'rgba(0, 145, 255, 0.3)'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#0091FF',
                            width: 3
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(63, 146, 254, 0.2)'
                                }, {
                                    offset: 1, color: 'rgba(63, 146, 254, 0)'
                                }],
                                global: false
                            }
                        }
                    },
                    data: seriesData
                }]
            }
            TrendGraph.setOption(option)
            this.TrendGraph = TrendGraph
        },
        /**
         * @method
         * @desc 折线图resize
         */
        resize() {
            setTimeout(_ => {
                this.TrendGraph.resize()
            }, 300)
        }
    },
    mounted() {
        this.getTree()
        this.getStatistics()
        this.getTrend()
    },
    watch: {
        /**
         * @watch
         * @desc 树形点击时，获取对应分组的列表数据
         */
        currentGroupId(newVal) {
            this.tableRequest.params.PlatformId = newVal
            this.getTableList()
            this.getStatistics()
            this.getTrend()
        },
        /**
         * @watch
         * @desc 日期范围按钮
         */
        dateButton(newVal) {
            const date = new Date()
            const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const firstDayOfYear = `${date.getFullYear()}-01-01`
            const firstDayOfMonth = `${date.getFullYear()}-${date.getMonth() + 1}-01`
            const firstDayOfWeek = _ => {
                let diff = date.setDate(date.getDate() - date.getDay())
                return `${diff.getFullYear()}-${diff.getMonth() + 1}-${date.getDate()}`
            }
            switch(newVal) {
                case 1:
                    this.dateRange = [today, today]
                    break
                case 2:
                    this.dateRange = [firstDayOfWeek, today]
                case 3:
                    this.dateRange = [firstDayOfMonth, today]
                    break
                case 4:
                    this.dateRange = [firstDayOfYear, today]
                    break
            }
            this.handleDateChange()
        }
    }
}
</script>

<style lang="scss" scoped>
// 左边栏
.ticket-statistics__left {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    // 树形搜索框
    & > .sv-input-tree-search {
        margin: 10px;
        flex-grow: 0;
    }
    // 树形
    &__tree {
        flex: 1;
        &__item {
            cursor: pointer;
            font-size: 14px;
            line-height: 25px;
            padding: 10px 15px;
            color: #606266;
            &:hover {
                background: rgba(0, 145, 255, 0.1);
            }
            &-selected {
                background: rgba(0, 145, 255, 0.1);
                border-left: 2px solid rgba(0, 145, 255, 1);
                color: rgba(0, 145, 255, 1);
            }
        }
    }
}
.ticket-statistics__date {
    margin-bottom: 10px;
    &__button {
        display: inline-block;
        font-size: 0;
        & > div {
            cursor: pointer;
            height: 30px;
            line-height: 28px;
            padding: 0 13px;
            font-size: 14px;
            display: inline-block;
            border: 1px solid #CCCCCC;
            border-right: none;
            background: white;
            &:hover {
                color: #0091FF;
            }
            &:first-child {
                border-radius: 3px 0px 0px 3px;
            }
            &:last-child {
                border-radius: 0px 3px 3px 0px;
                border: 1px solid #CCCCCC;
            }
        }
        &-active {
            background: #0091FF !important;
            border-color: #0091FF !important;
            color: white !important;
        }
    }
}
// 统计数据
.ticket-statistics__header {
    min-width: 1417px;
    height: 300px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    & > div {
        width: 33%;
        height: 100%;
        background: #FFFFFF;
        box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
        border-radius: 3px;
        &:not(:last-child) {
            margin-right: 10px;
        }
    }
    // 左侧数据
    &__data {
        overflow: hidden;
        position: relative;
        // 总数
        & > div:first-child {
            height: 80px;
            line-height: 1.5;
            padding-top: 5px;
            color: white;
            text-align: center;
            position: relative;
            background: linear-gradient(135deg, #60B4FF 0%, #4F9FFF 100%);
            // 数字
            & > div:first-child {
                font-size: 28px;
                font-weight: bold;
                display: inline-block;
                position: relative;
            }
            // 文字
            & > div:last-child {
                font-size: 16px;
                font-weight: normal;
            }
            // 背景
            &:after {
                content: '';
                display: block;
                height: 80px;
                width: 80px;
                position: absolute;
                right: 0;
                top: 0;
                background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzBweCIgaGVpZ2h0PSI2MHB4IiB2aWV3Qm94PSIwIDAgNzAgNjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+UmVjdGFuZ2xl5aSH5Lu9PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjUwJSIgeDI9Ii0yLjIyMDQ0NjA1ZS0xNCUiIHkyPSI1MCUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRkZGRiIgc3RvcC1vcGFjaXR5PSIwLjQ5OTM5OTAzOCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRkZGRkZGIiBzdG9wLW9wYWNpdHk9IjAuMTA0Mzc2MDkzIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMTAwJSIgeDI9IjUwJSIgeTI9Ii0yLjQ4OTQ5ODEzZS0xNSUiIGlkPSJsaW5lYXJHcmFkaWVudC0yIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRkZGRiIgc3RvcC1vcGFjaXR5PSIwLjQ5OTM5OTAzOCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRkZGRkZGIiBzdG9wLW9wYWNpdHk9IjAuMTA0Mzc2MDkzIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IumjjumZqeaOkuafpS3lt6XljZXnu5/orqHlpIfku70tMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY2NS4wMDAwMDAsIC0xMzguMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLlt6XljZXmlbAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzNS4wMDAwMDAsIDEzOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMwLjAwMDAwMCwgLTcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2iIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiBvcGFjaXR5PSIwLjUiIGN4PSI0My41IiBjeT0iNzEuNSIgcj0iMzguNSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2iLWNvcHktMiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0yKSIgb3BhY2l0eT0iMC4zMDAwMDAwMTIiIGN4PSI1NiIgY3k9IjI1IiByPSIyNSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
            }
        }
        // 左右箭头
        &__arrow {
            z-index: 1;
            display: none;
            position: absolute;
            width: 20px;
            height: 30px;
            bottom: 95px;
            cursor: pointer;
            background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIzMHB4IiB2aWV3Qm94PSIwIDAgMjAgMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDEx5aSH5Lu9PC90aXRsZT4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLpo47pmanmjpLmn6Ut5bel5Y2V57uf6K6h5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MzUuMDAwMDAwLCAtMjQ3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTEx5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NDUuMDAwMDAwLCAyNjIuMDAwMDAwKSBzY2FsZSgtMSwgMSkgdHJhbnNsYXRlKC00NDUuMDAwMDAwLCAtMjYyLjAwMDAwMCkgdHJhbnNsYXRlKDQzNS4wMDAwMDAsIDI0Ny4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMCBMMTUsMzAgQzYuNzE1NzI4NzUsMzAgMCwyMy4yODQyNzEyIDAsMTUgQzAsNi43MTU3Mjg3NSA2LjcxNTcyODc1LDAgMTUsMCBMMjAsMCBMMjAsMzAgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0U2RTZFNiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJDb21iaW5lZC1TaGFwZS1Db3B5LTQiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4yNDI2NDEsIDE1LjI0MjY0MSkgc2NhbGUoLTEsIDEpIHJvdGF0ZSgtNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTkuMjQyNjQxLCAtMTUuMjQyNjQxKSAiIHBvaW50cz0iNC41MzU1MzM5MSAxOS45NDk3NDc5IDUuNDMzMzg0MyAxMS40MzMzODQzIDEzLjk0OTc0NzkgMTAuNTM1NTMzOSI+PC9wb2x5bGluZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
            &:hover {
                background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIzMHB4IiB2aWV3Qm94PSIwIDAgMjAgMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDEx5aSH5Lu9PC90aXRsZT4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLpo47pmanmjpLmn6Ut5bel5Y2V57uf6K6h5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MzUuMDAwMDAwLCAtMjQ3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTEx5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NDUuMDAwMDAwLCAyNjIuMDAwMDAwKSBzY2FsZSgtMSwgMSkgdHJhbnNsYXRlKC00NDUuMDAwMDAwLCAtMjYyLjAwMDAwMCkgdHJhbnNsYXRlKDQzNS4wMDAwMDAsIDI0Ny4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMCBMMTUsMzAgQzYuNzE1NzI4NzUsMzAgMCwyMy4yODQyNzEyIDAsMTUgQzAsNi43MTU3Mjg3NSA2LjcxNTcyODc1LDAgMTUsMCBMMjAsMCBMMjAsMzAgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzk5OTk5OSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJDb21iaW5lZC1TaGFwZS1Db3B5LTQiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4yNDI2NDEsIDE1LjI0MjY0MSkgc2NhbGUoLTEsIDEpIHJvdGF0ZSgtNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTkuMjQyNjQxLCAtMTUuMjQyNjQxKSAiIHBvaW50cz0iNC41MzU1MzM5MSAxOS45NDk3NDc5IDUuNDMzMzg0MyAxMS40MzMzODQzIDEzLjk0OTc0NzkgMTAuNTM1NTMzOSI+PC9wb2x5bGluZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
            }
            &:nth-child(3) {
                right: 0;
                background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIzMHB4IiB2aWV3Qm94PSIwIDAgMjAgMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDEx5aSH5Lu9PC90aXRsZT4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLpo47pmanmjpLmn6Ut5bel5Y2V57uf6K6h5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MTUuMDAwMDAwLCAtMjQzLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MTUuMDAwMDAwLCAyNDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjAsMzAgTDE1LDMwIEM2LjcxNTcyODc1LDMwIDAsMjMuMjg0MjcxMiAwLDE1IEMwLDYuNzE1NzI4NzUgNi43MTU3Mjg3NSwwIDE1LDAgTDIwLDAgTDIwLDMwIFoiIGlkPSLot6/lvoQiIGZpbGw9IiNFNkU2RTYiIG9wYWNpdHk9IjAuNjY4MjQ3NzY4Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IkNvbWJpbmVkLVNoYXBlLUNvcHktNCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5LjI0MjY0MSwgMTUuMjQyNjQxKSBzY2FsZSgtMSwgMSkgcm90YXRlKC00NS4wMDAwMDApIHRyYW5zbGF0ZSgtOS4yNDI2NDEsIC0xNS4yNDI2NDEpICIgcG9pbnRzPSI0LjUzNTUzMzkxIDE5Ljk0OTc0NzkgNS40MzMzODQzIDExLjQzMzM4NDMgMTMuOTQ5NzQ3OSAxMC41MzU1MzM5Ij48L3BvbHlsaW5lPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
                &:hover {
                    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIzMHB4IiB2aWV3Qm94PSIwIDAgMjAgMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDEx5aSH5Lu9PC90aXRsZT4KICAgIDxnIGlkPSLpo47pmanmjpLmn6UiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLpo47pmanmjpLmn6Ut5bel5Y2V57uf6K6h5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MTUuMDAwMDAwLCAtMjQzLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MTUuMDAwMDAwLCAyNDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjAsMzAgTDE1LDMwIEM2LjcxNTcyODc1LDMwIDAsMjMuMjg0MjcxMiAwLDE1IEMwLDYuNzE1NzI4NzUgNi43MTU3Mjg3NSwwIDE1LDAgTDIwLDAgTDIwLDMwIFoiIGlkPSLot6/lvoQiIGZpbGw9IiM5OTk5OTkiIG9wYWNpdHk9IjAuNjY4MjQ3NzY4Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IkNvbWJpbmVkLVNoYXBlLUNvcHktNCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5LjI0MjY0MSwgMTUuMjQyNjQxKSBzY2FsZSgtMSwgMSkgcm90YXRlKC00NS4wMDAwMDApIHRyYW5zbGF0ZSgtOS4yNDI2NDEsIC0xNS4yNDI2NDEpICIgcG9pbnRzPSI0LjUzNTUzMzkxIDE5Ljk0OTc0NzkgNS40MzMzODQzIDExLjQzMzM4NDMgMTMuOTQ5NzQ3OSAxMC41MzU1MzM5Ij48L3BvbHlsaW5lPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
                }
            }
        }
        &:hover > &__arrow {
            display: block;
        }
        // 下方卡片
        &__card {
            width: 100%;
            height: 220px;
            overflow: hidden;
            white-space: nowrap;
            // 每4个卡片为一页
            & > div {
                vertical-align: top;
                display: inline-flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 10px;
                align-items: center;
                align-items: flex-start;
                width: 100%;
                height: 100%;
                white-space: normal;
                transition: all 0.5s;
                @for $i from 0 through 100 {
                    &.ticket-statistics__header__data__#{$i} {
                        transform: translateX(-100% * $i);
                        & > div:nth-child(-n+2):nth-child(n+1) {
                            margin-bottom: 10px;
                        }
                    }
                }
                // 每一张卡片
                & > div {
                    text-align: center;
                    width: 49%;
                    height: 95px;
                    display: inline-flex;
                    flex-direction: column;
                    justify-content: center;
                    background: #F9F9FA;
                    border-radius: 3px;
                    & > div:first-child {
                        color: #333333;
                        font-size: 26px;
                        font-weight: bold;
                    }
                    & > div:last-child {
                        color: #666666;
                        font-size: 16px;
                    }
                }
            }
        }
    }
    // 标题
    &__title {
        border-left: 3px solid #0091FF;
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        padding: 0 0 0 14px;
        margin: 10px 15px;
    }
    // 饼图
    &__pie {
        position: relative;
        &__left {
            display: inline-block;
            width: 300px;
            height: 300px;
            position: absolute;
            left: 0px;
            top: 0px;
        }
        &__right {
            width: 150px;
            height: 200px;
            position: absolute;
            right: 20px;
            bottom: 32px;
            $colorList: #54A0FF, #44CC75, #FBC958, #FB7293, #9D96F5, #83D9FF, #A3E547, #FCD75C, #4481EB, #46D0ED, #E4998B, #D143C9, #FEB00A, #FE660A;
            @for $i from 0 through 13 {
                &__item_#{$i} {
                    margin: 0 0 10px 15px;
                    position: relative;
                    font-size: 16px;
                    color: #666666;
                    cursor: pointer;
                    &::before {
                        content: '';
                        background: nth($colorList, $i+1);
                        display: block;
                        width: 10px;
                        height: 10px;
                        border-radius: 6px;
                        position: absolute;
                        left: -15px;
                        top: 8px;
                    }
                }
            }
            // 箭头
            &__arrow {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0;
                & > div {
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    cursor: pointer;
                    background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NDUzMzc0MDYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxNzEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkzLjM3MTkxIDU3LjE1NDU3MyA5MzAuNjI4MDkgNTQwLjYzNTYwOCA5My4zNzE5MSAxMDI0WiIgcC1pZD0iMzE3MiIgZmlsbD0iIzk5OTk5OSI+PC9wYXRoPjwvc3ZnPg==');
                    &.ticket-statistics__header__pie__right__arrow-disabled {
                        cursor: not-allowed;
                        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NDUzMzc0MDYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxNzEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkzLjM3MTkxIDU3LjE1NDU3MyA5MzAuNjI4MDkgNTQwLjYzNTYwOCA5My4zNzE5MSAxMDI0WiIgcC1pZD0iMzE3MiIgZmlsbD0iI0U2RTZFNiI+PC9wYXRoPjwvc3ZnPg==');
                    }
                    &:first-child {
                        transform: rotate(180deg);
                        margin-right: 20px;
                    }
                }
            }
        }
    }
    // 趋势图
    &__trend {
        position: relative;
        .sv-select {
            position: absolute;
            right: 10px;
            top: 10px;
        }
        &__inner {
            height: 264px;
            width: 100%;
        }
    }
}
.ticket-statistics__search {
    position: absolute;
    left: 120px;
}
.ticket-statistics /deep/.middle__header {
    padding: 20px 10px !important;
}
</style>