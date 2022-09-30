<template>
    <div class="inspectionSheetManagement">
        <div class="option-bar">
            <!-- 3. 时间选择 -->
            <el-date-picker
                v-model="dateValue"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="small">
            </el-date-picker>
            <!-- 1. 检查状态 -->
            <el-select v-model="queryList.type" placeholder="检查类型"  clearable @change="getWorkData" size="small">
                <el-option
                    v-for="item in checkTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                </el-option>
            </el-select>
            <!-- 2. 处置状态 -->
            <el-select v-model="queryList.status" placeholder="处置状态" clearable @change="getWorkData" size="small">
                <el-option
                    v-for="item in handleStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- 4. 关键字搜索 -->
            <el-input 
                suffix-icon="el-icon-search"
                v-model="queryList.search"
                placeholder="请输入处理对象/情况说明/负责人"
                style="width:300px;"
                clearable
                size="small"
                @change="getWorkData">
            </el-input>
            <el-button
                plain
                size="small"
                type="primary"
                @click="getWorkData"
            >
                搜索
            </el-button>
            <!-- 5. 导出按钮 -->
            <el-button plain type="primary" size="small">导出</el-button>
            <!-- 6. 发布按钮 -->
            <el-button  size="small" type="primary" style="margin-left:2px;margin-top:3px" @click="showReleaseSheet(-1)">发布工单</el-button> 
        </div>
        <!-- 右侧表单内容 -->
        <el-row class="table-content">
            <el-table
                :data="sheetTableData"
                style="width: 100%; text-align: center;height:700px"
                    height="700">
                <!-- 1. 工单名称 -->
                <el-table-column
                    prop="name"
                    label="工单名称"
                    width="260">
                </el-table-column>
                <!-- 2. 工单类型 -->
                <el-table-column
                    prop="workType"
                    label="工单类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.workType==0">自定义工单</span>
                        <span v-if="scope.row.workType==1">巡查工单</span>
                    </template>
                </el-table-column>
                <!-- 3. 工单属性 -->
                <el-table-column
                    prop=""
                    label="工单属性">
                    <template slot-scope="scope">
                        <span>{{workPropertyIdToName(scope.row.workProperty)}}</span>
                    </template>
                </el-table-column>
                <!-- 4. 工单地点 -->
                <el-table-column
                    prop="workPlace"
                    label="工单地点">
                </el-table-column>
                <!-- 5. 发布时间 -->
                <el-table-column
                    prop="gmtCreate"
                    label="发布时间">
                </el-table-column>
                <!-- 6. 工单负责人 -->
                <el-table-column
                    prop=""
                    label="工单负责人">
                    <template slot-scope="scope">
                        <span style="color:#0091FF">{{scope.row.contactorIdString}}</span>
                    </template>
                </el-table-column>
                <!-- 7. 工单时限 -->
                <el-table-column
                    label="工单时限"
                    width='200%'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEndtime==0">无限制时间</span>
                        <span v-else>
                            {{scope.row.endDate}} {{scope.row.endTime}}
                            <br>
                            <span v-if="isOutTime(scope.row.endDate, scope.row.endTime)">{{isOutTime(scope.row.endDate, scope.row.endTime)}}</span>
                            <span v-else style="color:#F66E6E">已超时</span>
                        </span>
                    </template>
                </el-table-column>
                <!-- 8. 工单状态 -->
                <el-table-column
                    prop=""
                    label="工单状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1" style="color:#0BD295">已处置</span>
                        <span v-if="scope.row.status==0" style="color:#F7B500">处置中</span>
                        <span v-if="scope.row.status==-1" style="color:#999999">已取消</span>
                    </template>
                </el-table-column>
                <!-- 9.催办次数 -->
                <el-table-column
                    prop="urgeCount"
                    label="催办次数"
                />
                <!-- 10. 操作按钮 -->
                <el-table-column
                    prop=""
                    label="操作"
                    width="260">
                    <template slot-scope="scope">
                        <!-- <img class="operation-icon" src="./img/operation-view-active.png" alt="查看" @click="showViewSheet(scope.$index)"/> -->
            <span v-if="true">
              <img
                class="operation-icon"
                src="../../../../assets/img/show.svg"
                alt="查看"
                style="cursor: pointer; width: 20px; margin-right: 10px"
                @click="showViewSheet(scope.row.id)"
              >
              <img
                class="operation-icon"
                src="../../../../assets/img/edit.svg"
                alt="编辑"
                style="cursor: pointer; width: 20px; margin-right: 10px"
                @click="showReleaseSheet(scope.row.id)"
              >
              <img
                class="operation-icon"
                src="../../../../assets/img/del.svg"
                alt="删除"
                style="cursor: pointer; width: 20px; margin-right: 10px"
                @click="deletRow(scope.row.id)"
              ><span
                v-if="scope.row.status == 0"
                style="
                  border: none;
                  background: none;
                  color: #76d672;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                  cursor: pointer;
                "
                @click="formReminderlHandleClick(scope.row)"
              >催办</span>
                        </span>
                        <span v-else>
                            <img class="operation-icon" src="../../../../assets/img/show.svg" alt="查看"
                            style="cursor:pointer;width:20px;margin-right: 10px"/>
                            <img class="operation-icon" src="../../../../assets/img\edit.svg" alt="编辑"
                            style="cursor:pointer;width:20px;margin-right: 10px"/>
                            <img class="operation-icon" src="../../../../assets/img\del.svg" alt="删除"
                   style="cursor:pointer;width:20px;margin-right: 10px"/>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryList.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryList.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
        </el-pagination>
        <!-- 发布/编辑工单弹窗 -->
        <releaseSheet ref="releaseSheet" :workPropertyList="this.workPropertyList" :getWorkData="this.getWorkData" :editWhich="this.editWhich"></releaseSheet>
        <!-- 查询弹窗 -->
        <!-- <viewSheet :ref="'viewSheet'+scope.$index" :sheetTableData="sheetTableData" :currentRow="scope.$index" style="font-weight:normal;text-align:left;"></viewSheet> -->
        <viewSheet ref="viewSheet" :viewWhich="this.viewWhich"></viewSheet>
        <!-- 编辑工单弹窗 -->
        <!-- <editSheet :ref="'editSheet'+scope.$index" :sheetTableData="sheetTableData" :currentRow="scope.$index" style="font-weight:normal;text-align:left;"></editSheet> -->
        <!-- <editSheet :sheetTableData="sheetTableData" :workPropertyList="this.workPropertyList" :getWorkData="this.getWorkData" ref="editSheet" style="font-weight:normal;text-align:left;"></editSheet> -->
    </div>
</template>

<script>
// 发布编辑工单弹窗组件
import releaseSheet from "../../riskInvestigation/inspectionSheetManagement/releaseSheet/releaseSheet"
// 查看工单弹窗组件
import viewSheet from "../../riskInvestigation/inspectionSheetManagement/viewSheet/viewSheet"
export default {
    name: 'inspectionTable',
    components: {
        releaseSheet,
        viewSheet,
    },
    watch: {
        // 监控日期选择栏，更新查询条件queryList
        dateValue(val) {
            if(val){
                this.queryList.startTime = val[0];
                this.queryList.endTime = val[1];
            } else {
                this.queryList.startTime = '';
                this.queryList.endTime = '';
            }
            this.getWorkData();
        },
        // 监控左侧搜索栏，变更则触发树形的过滤操作
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        // 获取表单数据
        this.getWorkData();
        // 获取工单属性列表
        this.getWorkPropertyList();
        // 获取树形数据
        this.getTreeList();
    },
    methods: {
        // 获取表单数据
        getWorkData() {
            let url = window.SITE_CONFIG['baseUrl'] + "/work/workSheet/list";
            let that = this;
            this.$http
            .post(url, that.queryList, {emulateJSON:true})
            .then(
                function(res) {
                    // 表单列表保存在本地数组sheetTableData中
                    that.sheetTableData = res.data.page.list;
                    that.totalCount = res.data.page.totalCount;
                    console.log("获取表单数据：\n", res,that.totalCount);
                },
                function(res) {
                    console.log("getWorkData()获取数据失败！\n错误信息：\n", res);
                }
            );
        },
        // 获取工单属性列表
        getWorkPropertyList() {
            let url = window.SITE_CONFIG['baseUrl'] + '/work/workProperty/treelist?module=1';
            let that = this;
            this.$http
            .get(url)
            .then(
                function(res) {
                    // 工单属性列表保存在本地数组workPropertyList中
                    for(var item of res.data.data) {
                        that.workPropertyList.push({
                            value: item.id,
                            label: item.name
                        });
                    }
                },
                function(res) {
                    console.log("工单属性列表获取失败！\n错误信息：\n", res);
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                }
            );
        },
        // 根据工单属性id返回对应工单属性名
        workPropertyIdToName(id) {
            for(let item of this.workPropertyList) {
                if(id == item.value) {
                    return item.label;
                }
            }
        },
        // 计算工单时限剩余时间
        isOutTime(date, time) {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let day = now.getDate();
            let hour = now.getHours();
            let minute = now.getMinutes();
            let nowDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';
            let inDate = date + ' ' + time + ':00';
            let dHour = Math.floor((Date.parse(inDate) - Date.parse(nowDate)) / (3600 * 1000));
            if(dHour <= 0 ) {
                return false;
            } else {
                let leftDays = Math.floor(dHour / 24);
                let leftHours = dHour % 24;
                let res = '剩余：' + leftDays + '天' + leftHours + '小时';
                return res;
            }
        },
        // 删除该行数据
        deletRow(id) {
            this.$confirm('确认删除？')
            .then(_ => {
                let send = {
                    ids: [id],
                }
                let url = window.SITE_CONFIG['baseUrl'] + "/work/workSheet/delete";
                let that = this;
                this.$http
                .post(url, send, {emulateJSON:true})
                .then(
                    function(res) {
                        console.log("删除工单成功！", res);
                        // 刷新数据
                        that.getWorkData();
                    },
                    function(res) {
                        console.log("删除工单失败！\n错误信息：\n", res);
                        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                    }
                );
                done();
            })
            .catch(_ => {});
        },
        // 催办
        formReminderlHandleClick(val) {
        // console.log("测试测试");
        this.$emit('formReminderlHandleClick', val);
        },
        // 点击显示“发布/编辑工单”弹窗, index==-1时是发布， else为编辑
        showReleaseSheet(id) {
            this.$refs.releaseSheet.releaseVisible=true;
            this.editWhich = id;
        },
        // 查看工单点击弹窗
        showViewSheet(id) {
            // this.$refs.viewSheet.viewSheetVisible=true;
            this.viewWhich = id;
            this.$refs.viewSheet.init(id);
        },







        /**
         * @method
         * @desc 获取树形数据
         */
        getTreeList() {
            let self = this;
            let url = window.SITE_CONFIG['baseUrl'] + "/investigation/investigationTaskGroup/listTree";
            this.$http
            .get(url)
            .then(
                (res) => {
                    console.log("获取树形成功：【\n", res.data.data, "\n】");
                    self.searchTreeData = res.data.data;
                    self.searchTreeData.push({
                        id: -1,
                        name: "其他",
                        children: null
                    });
                },
                (res) => {
                    console.log("获取树形失败：【\n", res, "\n】");
                }
            )
        },
        // 树形过滤规则
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        /**
         * @method
         * @desc 点击树形数据，传组id查询列表
         */
        clickTree(data) {
            let self = this;
            console.log("点击树形的节点数据:",data);
            this.queryList.groupIds = [];
            (function getChild(data) {
                self.queryList.groupIds.push(data.id);
                if(data.hasOwnProperty('children') && data.children !== null) {
                    for(let item of data.children) {
                        getChild(item);
                    }
                }
            })(data);
            console.log("点击的节点及其子孙id集合：", this.queryList.groupIds);
            this.getWorkData();
        },
        /**
         * @method
         * @desc 点击全部，传空数组，查询所有列表
         */
        getAll() {
            this.queryList.groupIds = [];
            this.getWorkData();
            console.log('alll');
        },
        // 分页器操作
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.queryList.limit = val;
            this.getWorkData();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.queryList.page = val;
            this.getWorkData();
        }
    },
    data() {
        return {
            // 查询条件
            queryList: {
                page: 1,
                limit: 10,
                groupIds: [
                    -1
                ],
                startTime: '',
                endTime: '',
                module: '1',
                property: '',
                status: '',
                type: '',
                search: ''
            },
            // 工单属性列表
            workPropertyList: [],
            // 检查类型可选值
            checkTypeOptions: [{
                value: '0',
                label: '自定义工单'
            }, {
                value: '1',
                label: '巡查工单'
            }],
            // 工单处置状态可选值
            handleStatusOptions: [{
                value: '-1',
                label: '已取消'
            }, {
                value: '0',
                label: '处置中'
            }, {
                value: '1',
                label: '已处置'
            }],
            // 日期选择栏取值，是一个数组，dateValue[0, 1] = [startTime, endTime]
            dateValue: '',
            // 获取到的表单数据
            sheetTableData: [],
            // 判定弹窗是发布还是编辑
            editWhich: '',
            // 判定查看哪一行表单
            viewWhich: '',
            // 左侧搜索栏过滤关键词
            filterText: "",
            // 左侧搜索栏树形数据
            searchTreeData: [],
            // 树形配置
            treeProps: {
                value: 'id',
                children: 'children',
                label: 'name'
            },
            // 分页器显示数据总数
            totalCount: 0,

        }
    }
}
</script>

<style>
    * {
        font-weight: normal;
    }
    .inspectionSheetManagement {
        margin-top: 6px;
    }
  
    .search-keyword {
        margin: 10px auto;
        border-radius: 15px;
    }
    .search-header {
        background-color: rgba(229, 244, 255, 1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        padding-left: 20px;
        line-height: 40px;
        cursor: pointer;
    }
    .table-content {
        margin-top: 20px;
    }
</style>