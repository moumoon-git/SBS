/**
 * @author tanjinfeng
 * @date 2020-10-31
 * @desc 风险排查-工单统计页面
 */
 
<template>
    <div>
        <sv-template
            ref="template"
            title="工单统计"
            :tableRequest="tableRequest"
        >
            <template #left__content>
                <div class="ticket-statistics__left">
                    <!-- 树形搜索框 -->
                    <sv-input-tree-search
                        v-model="treeSearchKeyword"
                        width="calc(100% - 20px)"
                        @change="currentGroupId='';getTree();getTableList();"
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
            <template #upper__container>
                <div class="ticket-statistics__date">
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
                <div class="ticket-statistics__header">
                    <div
                        v-for="(statItem, statIndex) in stat"
                        :key="`stat_item_${statIndex}`"
                    >
                        <div>{{statItem.num}}</div>
                        <div>{{statItem.name}}</div>
                    </div>
                    <div class="ticket-statistics__pie" ref="pie"></div>
                    <div class="ticket-statistics__line" ref="broken_line"></div>
                </div>
            </template>
            <template #middle__operation>
                <!-- 搜索框 -->
                <sv-input-search class="ticket-statistics__search" width="200px"/>
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
                        <!-- 1:待核实 2： 核实 3：待处理4：处理中  -->
                        {{scope.row.status == '1' ? '待核实' : scope.row.status == '2' ? '核实' : scope.row.status == '3' ? '待处理' : scope.row.status == '4' ? '处理中' : '其他'}}
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
        <sv-dialog
            ref="viewDialog"
            title="查看详情"
        ></sv-dialog>
    </div>
</template>

<script>
import echarts from 'echarts'

export default {
    name: 'TicketStatistics',
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
                }
            },
            // 统计数据
            stat: []
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
            // this.tableRequest.params.PlatformId = ''
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
                    this.treeLoading = false
                }
            })
        },
        /**
         * @method
         * @desc 获取统计数据
         */
        getStatistics() {
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/event/eventinfo/viewCountTotal?startTime=${this.dateRange[0]}&endTime=${this.dateRange[1]}`)
            .then(res=>{
                console.log(res)
                if (res.data.code == 0) {
                    this.stat = []
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
                            name
                        })
                    })
                    this.drawPieGraph()
                }
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
         * @desc 选择日期范围变更，获取树形、统计、列表数据
         */
        handleDateChange() {
            this.tableRequest.params.startTime = dateRange[0]
            this.tableRequest.params.endTime = dateRange[1]
            this.getTree()
            this.getStatistics()
            this.getTableList()
        },
        /**
         * @method
         * @desc 点击打开查看详情弹窗
         * @param {Object} data 列表行数据
         */
        openViewDetailDialog(data) {
            this.$refs.viewDialog.visible = true
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/event/eventinfo/searchOneById?id=${data.id}`)
            .then(res => {
                if (res.code == 0) {
                    // res.data.data
                }
            })
        },
        /**
         * @method
         * @desc 绘制饼图
         */
        drawPieGraph() {
            const PieGraph = echarts.init(this.$refs.pie)
            let seriesData = []
            this.stat.forEach(item => {
                seriesData.push({
                    value: item.num,
                    name: item.name
                })
            })
            const option = {
                series: [{
                    type: 'pie',
                    center: ['20%', '50%'],
                    radius: '50%',
                    data: seriesData
                }]
            }
            PieGraph.setOption(option)
        }
    },
    mounted() {
        this.getTree()
        this.getStatistics()
    },
    watch: {
        /**
         * @watch
         * @desc 树形点击时，获取对应分组的列表数据
         */
        currentGroupId(newVal) {
            this.tableRequest.params.PlatformId = newVal
            this.getTableList()
        },
        /**
         * @watch
         * @desc 日期范围按钮
         */
        dateButton(newVal) {}
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
    height: 200px;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
        flex-grow: 1;
        text-align: center;
        border: 1px solid green;
    }
}
// 饼图
.ticket-statistics__pie {
    height: 200px;
    width: 200px;
    overflow: hidden;
}
// 折线图
.ticket-statistics__line {
    height: 200px;
    overflow: hidden;
}
.ticket-statistics__search {
    position: absolute;
    left: 120px;
}
</style>