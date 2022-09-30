<!--
 * @Author: linhuiting
 * @Date: 2020-10-15 13:53:10
 * @LastEditors: linhuiting
 * @LastEditTime: 2020-10-20 20:06:47
 * @Description: 要情记录之工单信息
 * @FilePath: \SBS\src\views\modules\event\emergency\emergencyhandleOrder.vue
-->
<template>
  <div>
    <InspectionSheetManagement class="mainContent">
      <!-- 整个左边栏 -->
      <template #left__container>   
        <!-- 插入一个空的行内元素则不显示整个左边栏 -->
        <div></div>
      </template>

      <!-- 整个右边栏 -->
      <template #right__container__header>
        <div  class="task-content-header" >
          <div
          class="task-content-header-title"
          >巡查管理</div>
          <span class="task-content-header-button">
          
          <!-- 2. 处置状态 -->
          <el-select v-model="queryList.status" placeholder="处置状态" clearable @change="getWorkData" class="task-content-header-cycle">
            <el-option
              v-for="item in handleStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- 3. 时间选择 -->
          <el-date-picker
            class="task-content-header-date"
            v-model="dateValue"
            type="daterange"
            align="right"
            :unlink-panels="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <!-- 4. 关键字搜索 -->
          <el-input
            class="task-content-header-search"
            suffix-icon="el-icon-search"
            v-model="queryList.search"
            placeholder="请输入关键字"
            clearable
            @change="getWorkData"
             @keyup.enter.native="searchResult()"
          ></el-input>
           <el-button  class="task-content-header-export-button" plain @click="searchResult()">查询</el-button>
          <!-- 5. 导出按钮 -->
          <!-- <el-button plain class="task-content-header-export-button">
            <img src="../../../../assets/img/upload.svg" alt="导出图标" />导出
          </el-button> -->
          <!-- 6. 发布按钮 -->
          <!-- <el-button
            type="primary"
           class="task-content-header-export-button"
            @click="showReleaseSheet(-1)"
          >发布工单</el-button> -->

          </span>
        </div>    
      </template>

    </InspectionSheetManagement>
  </div>
</template>

<script>
import inspectionSheetManagement from "@/views/modules/riskInvestigation/inspectionSheetManagement/inspectionSheetManagement2"

export default {
  data() {
    return {
      searchName:"",
      // 查询条件
      queryList: {
        page: 1,
        limit: 10,
        groupIds: [-1],
        startTime: "",
        endTime: "",
        module: "1",
        property: "",
        status: "",
        type: "",
        search: "",
      },
      // 工单属性列表
      workPropertyList: [],
      // 检查类型可选值
      checkTypeOptions: [
        {
          value: "0",
          label: "自定义工单",
        },
        {
          value: "1",
          label: "巡查工单",
        },
      ],
      // 工单处置状态可选值
      handleStatusOptions: [
        {
          value: "-1",
          label: "已取消",
        },
        {
          value: "0",
          label: "处置中",
        },
        {
          value: "1",
          label: "已处置",
        },
      ],
      // 日期选择栏取值，是一个数组，dateValue[0, 1] = [startTime, endTime]
      dateValue: "",
      // 获取到的表单数据
      sheetTableData: [],
      // 判定弹窗是发布还是编辑
      editWhich: "",
      // 判定查看哪一行表单
      viewWhich: "",
      // 分页器显示数据总数
      totalCount: 0,
    };
  },
    methods: {},
    mounted() {},
    components: {
      'InspectionSheetManagement': inspectionSheetManagement
    }
 
}
</script>

<style scoped>

  .mainContent {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>