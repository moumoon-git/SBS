<template>
  <div class="taskManagement">
    <el-row :gutter="20" style="margin:0">
      <div style="display:flex;justify-content:space-between;margin: 6px 10px 0px;">
        <p class="thetitle">任务详情</p>
        <el-button
          @click="$router.push({path: '/Linkage/taskManagement/taskManagement',query: {
                  page,
                }})"
        >返回</el-button>
      </div>
    </el-row>
    <!-- 
     <el-tabs v-model="task" @tab-click="handleClick">
          <el-tab-pane label="任务信息" name="taskManagementInfo"></el-tab-pane>
          <el-tab-pane label="任务跟踪" name="taskManagementTrack" v-if="taskInfo.mailContactorList.length>0"></el-tab-pane>
          <el-tab-pane label="排查对象跟踪表" name="taskManagementTrack" v-if="taskInfo.epiRegisterList.length>0"></el-tab-pane>
    </el-tabs>-->

    <!-- 任务切换 -->
    <task-management-info :task-info="taskInfo" :page="page" :taskId="taskId"></task-management-info>
  </div>
</template>

<script>
import taskManagementInfo from "./taskManagement-info";
import bus from "@/views/common/js/eventBus";

export default {
  name: "taskManagement-update",
  data() {
    return {
      taskId: "", //点击的任务id，
      taskInfo: {}, //任务信息数据
      page: 0
    };
  },
  created() {
    this.taskId = this.$route.query.id;
    this.page = this.$route.query.page;
    this.getTaskInfo();
    // console.log('created-update',this.taskInfo)
  },
  methods: {
    // 获取任务信息
    getTaskInfo() {
      this.$http({
        url: this.$http.adornUrl(`/task/taskInfor/getOneAndLink`),
        method: "get",
        params: this.$http.adornParams({ id: this.taskId })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.taskInfo = data.data;
          // console.log(this.taskInfo)
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handleClick(type) {
      this.task = type.name;
    }
  },
  components: {
    taskManagementInfo
  }
};
</script>

<style lang="scss" scoped>
.taskManagement {
  // padding: 0 20px;
  .taskTab {
    position: relative;
  }
  .thetitle {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    letter-spacing: 3px;
    &::before {
      content: "";
      display: inline-block;
      width: 2px;
      height: 13px;
      background: rgba(63, 146, 254, 1);
      margin-right: 10px;
    }
  }
  .back {
    position: absolute;
    right: 0;
    top: 0;
  }
  /deep/ .el-button:focus,
  .el-button:hover {
    color: white;
    border-color: rgb(185, 232, 227);
    background-color: #1890ff;
  }
}
</style>