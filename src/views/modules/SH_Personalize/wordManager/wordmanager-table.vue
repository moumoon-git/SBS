<template>
  <el-row class="wordmanager-table">
    <el-col :span="24">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="650px"
      >
        <el-table-column
          prop="id"
          label="事件标号"
          width="80"
        />

        <!--<el-table-column
          :show-overflow-tooltip="true"
          prop="townName"
          label="所属镇街"
        >
        </el-table-column>-->

        <el-table-column
          :show-overflow-tooltip="true"
          prop="platformName"
          :formatter="formatterPlatformName"
          label="所属区域"
        />

        <el-table-column
          prop="eventTypeName"
          label="工单类型"
          width="100"
        />

        <!--<el-table-column
          prop="rpPoliceResponseEntity.responseName"
          label="响应等级"
        >
        </el-table-column>-->

        <!--<el-table-column
          prop="reportName"
          label="上报人员"
         >
        </el-table-column>-->

        <el-table-column
          prop="gmtCreate"
          label="报送时间"
          sortable
        />

        <!--<el-table-column
          :show-overflow-tooltip="true"
          prop="eventPosition"
          label="工单地点"
          >
        </el-table-column>-->

        <el-table-column
          :show-overflow-tooltip="true"
          prop="eventDescription"
          label="工单描述"
        />

        <el-table-column
          prop="urgeCount"
          label="催办次数"
        />
        <!--<el-table-column
          prop="status"
          label="处理状态"
          width="80"
          :formatter="eventStatusFormatter">
        </el-table-column>-->
        <el-table-column
          prop="status"
          label="工单状态"
          width="80"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status == '1'"
              style="color: #cece00"
            >待核实</span>
            <span
              v-else-if="scope.row.status == '2'"
              style="color: #ffb269"
            >核实中</span>
            <span
              v-else-if="scope.row.status == '3'"
              style="color: #479dff"
            >待处理</span>
            <span
              v-else-if="scope.row.status == '4'"
              style="color: #479dff"
            >处理中</span>
            <span
              v-else-if="scope.row.status == '5'"
              style="color: #785dff"
            >已处理</span>
            <span
              v-else-if="scope.row.status == '6'"
              style="color: #e65c6d"
            >超出范围</span>
            <span
              v-else-if="scope.row.status == '7'"
              style="color: #e65c6d"
            >已关闭</span>
            <span
              v-else
              style="color: #83b8c2"
            >未知</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="isClose"
          label="是否关闭"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isClose == '1'">否</span>
            <span v-else-if="scope.row.isClose == '0'">是</span>
            <span
              v-else
              style="color: #83b8c2"
            >未知</span>
          </template>
        </el-table-column>

        <!--增加事件类型ID、事件类型ID、处理状态标志、是否关闭标志隐藏框-->
        <el-table-column
          header-align="center"
          align="left"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <div class="opration">
              <span
                type="text"
                size="small"
                style="
                  border: none;
                  background: none;
                  color: #479dff;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                  cursor: pointer;
                "
                @click="formFindHandleClick(scope.row)"
              >查看
              </span>
              <span
                v-if="
                  scope.row.isAutomatic != 1 &&
                    scope.row.isClose == 1 &&
                    (scope.row.status == 1 || scope.row.status == 3)
                "
                type="text"
                size="small"
                style="
                  border: none;
                  background: none;
                  color: #76d672;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                  cursor: pointer;
                "
                @click="formManuaVerifylHandleClick(scope.row)"
              >派单
              </span>

              <span
                v-if="scope.row.status == 2 || scope.row.status == 4"
                type="text"
                size="small"
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
              >催办
              </span>

              <span
                v-if="
                  scope.row.status == 6 &&
                    scope.row.isClose == 1 &&
                    scope.row.examineFlag != 1 &&
                    scope.row.review == 0
                "
                type="text"
                size="small"
                style="
                  border: none;
                  color: rgb(120, 93, 255);
                  background: none;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                  cursor: pointer;
                "
                @click="formExaminationlHandleClick(scope.row)"
              >审批
              </span>
              <span
                v-if="scope.row.isClose == 1"
                type="text"
                size="small"
                style="
                  border: none;
                  background: none;
                  color: #e65c6d;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                  cursor: pointer;
                "
                @click="formCloseHandleClick(scope.row)"
              >关闭
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      // tableDatas: this.tableData
    };
  },

  methods: {
    formatterPlatformName(row) {
      return (row.townName == null ? '' : row.townName) + row.platformName;
    },

    formatterTime(row) {
      return row.gmtCreate.substr(0, 10);
    },

    // 查看
    formFindHandleClick(val) {
      // alert("子组件点击查看，触发父组件方法")
      this.$emit('formFindHandleClick', val);
    },

    // 手动核实
    formManuaVerifylHandleClick(val) {
      this.$emit('formManuaVerifylHandleClick', val);
    },
    // 审批
    formExaminationlHandleClick(val) {
      this.$emit('formExaminationlHandleClick', val);
    },
    // 手动处置
    formManualDisposalHandleClick(val) {
      this.$emit('formManualDisposalHandleClick', val);
    },
    // 催办
    formReminderlHandleClick(val) {
      // console.log("测试测试");
      this.$emit('formReminderlHandleClick', val);
    },
    // 编辑
    formUpdateHandleClick(val) {
      this.$emit('formUpdateHandleClick', val);
    },
    // 升级工单
    formUpgradeHandleClick(val) {
      this.$emit('formUpgradeHandleClick', val);
    },
    // 调查问卷
    formSurveyHandleClick(val) {
      this.$emit('formSurveyHandleClick', val);
    },
    // 关闭
    formCloseHandleClick(val) {
      this.$confirm('此操作将关闭该事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 触发
          this.$emit('formCloseHandleClick', val);
        })
        .catch(() => {

        });
    },
  },
};
</script>

<style lang="scss">
.wordmanager-table {
  .el-tooltip__popper {
    max-width: 45%;
  }
  tr {
    th {
      div {
        text-align: center;
      }
    }
    td {
      div {
        text-align: center;
      }
    }
  }
}
.opration {
  display: flex;
  justify-content: space-around;
}
</style>
