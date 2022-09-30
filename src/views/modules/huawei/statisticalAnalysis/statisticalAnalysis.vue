<template>
    <div>
        <el-row :gutter="20">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="卡口管理" name="卡口管理"></el-tab-pane>
                <el-tab-pane label="人员黑名单组管理" name="人员黑名单组管理"></el-tab-pane>
                <el-tab-pane label="布控管理" name="布控管理"></el-tab-pane>
                <el-tab-pane label="人群聚集管理" name="人群聚集管理"></el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row :gutter="20">
            <!-- 卡口管理 -->
            <el-col :span="24" v-show="activeName === '卡口管理'">
                <bayonet-table></bayonet-table>
            </el-col>
            <!-- 人员黑名单组管理 -->
            <el-col :span="24" v-show="activeName === '人员黑名单组管理'">
                <humanBlackListGroup-table></humanBlackListGroup-table>
            </el-col>
            <!-- 布控管理 -->
            <el-col :span="24" v-show="activeName === '布控管理'">
                <distributionControl-table></distributionControl-table>
            </el-col>
            <!-- 人群聚集管理 -->
            <el-col :span="24" v-show="activeName === '人群聚集管理'">
                <crowdGathering-table></crowdGathering-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import bayonetTable from './statisticalAnalysis-bayonet'
import humanBlackListGroupTable from './statisticalAnalysis-humanBlackListGroup'
import distributionControlTable from './statisticalAnalysis-distributionControl'
import crowdGatheringTable from './statisticalAnalysis-crowdGathering'
    export default {
        components:{
            bayonetTable: bayonetTable,
            humanBlackListGroupTable: humanBlackListGroupTable,
            distributionControlTable: distributionControlTable,
            crowdGatheringTable: crowdGatheringTable,
        },
        data(){
            return {
                activeName: '卡口管理'
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>