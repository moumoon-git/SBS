<!-- 事件上报弹窗 eventReportDialog.vue -->
<template>
  <div>
    <el-dialog
      title="事件上报"
      width="1090px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="dialog-style">
      <div class="add-reporting">
        <el-button v-show="type === 'edit'" type="primary" @click="type = 'create'">新增报送</el-button>
        <el-button v-show="type === 'create'" type="primary" @click="type = 'edit'">返回</el-button>
      </div>
      <div v-if="type === 'edit'" class="dialog-content">
        <div class="item">
          <div class="title">报送单位</div>
          <div class="reportingUnit">
            <div
              v-for="(item, index) in unitList"
              :key="item.id" :class="'unit ' + (activeUnit === item.id ? 'active' : '')"
              @click="activeUnit = item.id">
              <span class="unit-name">{{ item.name }}</span>
              <div class="report-times">
                报数次数 {{ item.times }}
              </div>
            </div>
          </div>

          <div class="item">
            <div class="title">报送历史</div>
            <div :loading="loading" v-if="reportHistory.length > 0">
              <el-collapse v-model="activeHistory" @change="handleChange">
                <el-collapse-item v-for="item in reportHistory" :key="item.id">
                  <template slot="title">
                    <div class="el-collapse-title">
                      <span>{{ '第' + item.vcPeriodNumber + '期' }}</span>
                      <span>{{ item.sysDtCreate }}</span>
                    </div>
                  </template>
                  <event-report-form
                    :form-data="item"
                    :event-type-data="eventTypeData"
                    :type="type"
                    @update="updateReportHistory"></event-report-form>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="noList" v-else>暂无值班报送历史</div>
          </div>
        </div>
      </div>
      <div v-if="type === 'create'" class="dialog-content">
        <div class="item">
          <div class="title">报送单位</div>
          <event-report-form
            :type="type"
            :event-type-data="eventTypeData"
            @cancel="type = 'edit'"
            @create="createReport">
          </event-report-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import EventReportForm from '@/view/eventManagement/eventReports/dialog/eventReportForm'

export default {
  name: 'EventReportDialog',
  components: {
    EventReportForm
  },
  data() {
    return {
      eventId: sessionStorage.getItem("newID"), // 事件id
      type: 'edit', // 表单编辑类型 edit 显示报送历史；create 显示新增报送
      gutter:24,
      dialogVisible: true, // 显示弹窗
      activeUnit: 1, // 当前选中报送单位
      activeHistory: 0, // 当前选中展开的报送历史
      unitList: [ // 报送单位列表,目前写死
        {
          id: 1,
          times: 1,
          name: '广东省应急局'
        }
      ],
      reportHistory: [], // 报送历史,
      eventTypeData: [], // 灾害类型
      loading: true, // 加载中
    }
  },
  mounted() {
    // 查询省厅事件报送历史
    this.selectEventReportHistory()
    
    
    // 查询省厅事件灾害类型
    this.selectProvinceCaseClass()
  },
  methods: {
    // 查询省厅事件灾害类型
    selectProvinceCaseClass() {
      this.$api.selectProvinceCaseClass().then(res => {
        if (res.errorcode === 0) {
          this.eventTypeData = res.data
        }
      })
    },
    // 查询省厅事件报送历史
    selectEventReportHistory() {
      let data = {
        eventId: this.eventId
      }
      this.$api.selectEventReportHistory(data).then(res => {
        if (res.errorcode === 0) {
          this.reportHistory = res.data
          this.unitList[0].times = res.data.length
        }
      })
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('close')
    },
    handleChange() {

    },
    // 创建报送
    createReport() {
      // 查询省厅事件报送历史
      this.selectEventReportHistory()
    },
    // 编辑报送
    editReport() {
      console.log('编辑报送')
      // 查询省厅事件报送历史
      this.selectEventReportHistory()
    },
    // 更新报送历史
    updateReportHistory() {
      this.selectEventReportHistory()
    }
  }
}
</script>
<style scoped>
/deep/ .dialog-style .el-dialog {
  margin-top: 40px !important;
}
/deep/ .dialog-style .el-dialog__header {
  background:rgba(241,244,246,1);
  text-align: left !important;
  padding: 10px 20px;
  border-radius: 5px 5px 0 0;
}
/deep/ .dialog-style .el-dialog__headerbtn {
  top: 15px !important;
}
/deep/ .dialog-style .el-dialog__body {
  padding: 14px 30px;
  height: 758px;
  border-radius: 0 0 7px 7px;
  position: relative;
}
.dialog-content {
  height: 100%;
  overflow: scroll;
}
.add-reporting {
  position: absolute;
  right: 40px;
  top: 6px;
  z-index: 1;
}
.item {
  margin-bottom: 14px;
}
.title {
  height:20px;
  font-size:18px;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:20px;
  text-align: left;
  margin-bottom: 17px;
  border-left: 2px solid #0091FF;
  padding-left: 11px;
}
.reportingUnit {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}
.unit {
  width:326px;
  height:74px;
  line-height: 74px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  border:1px solid rgba(234,230,230,1);
  margin-bottom: 20px;
  text-align: left;
  position: relative;
}
.active {
  width:326px;
  height:74px;
  line-height: 74px;
  background:rgba(245,250,255,1);
  box-shadow:0px 6px 7px 3px rgba(213,227,240,0.29);
  border-radius:4px;
  border:1px solid rgba(157,190,255,1);
  text-align: left;
  position: relative;
}
.unit-name {
  margin-left: 17px;
  font-size:17px;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.report-times {
  width:111px;
  height:22px;
  line-height: 22px;
  background:rgba(230,239,255,1);
  border-radius:0px 4px 0px 28px;
  font-size:14px;
  font-weight:400;
  color:rgba(0,145,255,1);
  position: absolute;
  right: 0;
  top: 0;
  padding-left: 24px;
}
/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item {
  margin-bottom: 13px;
}
/deep/ .el-collapse-item__header {
  height:39px;
  background:rgba(240,246,255,1);
  border:1px solid rgba(218,231,248,1);
}
/deep/ .el-collapse-item__wrap {
  border:1px solid rgba(218,231,248,1);
  border-top: none;
}
/deep/ .el-collapse-title {
  width: 100%;
  height:39px;
  line-height: 39px;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}
/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}
.noList{
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 540px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 400px;
}
</style>