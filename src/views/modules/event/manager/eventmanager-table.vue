<template>
  <el-row>
    <el-col :span="24">
      <el-table
        :data="tableData"
        border
        style="width: 100%">

        <el-table-column
          :show-overflow-tooltip="true"
          prop="platformName"
          label="事件归属"
          >
        </el-table-column>

        <el-table-column
          prop="eventTypeEntity.name"
          label="事件类型"
          >
        </el-table-column>


        <el-table-column
          prop="rpPoliceResponseEntity.responseName"
          label="事件等级"
        >
        </el-table-column>

        <el-table-column
          prop="reportName"
          label="上报人员"
          >
        </el-table-column>

        <el-table-column
          prop="reportTime"
          label="报送时间"
          >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="eventPosition"
          label="事发地点"
          >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="eventDescription"
          label="事件描述"
          >
        </el-table-column>

        <!--<el-table-column
          prop="status"
          label="处理状态"
          width="80"
          :formatter="eventStatusFormatter">
        </el-table-column>-->
        <el-table-column  prop="status" label="事件状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" style="color: #cece00">待核实</span>
            <span v-else-if="scope.row.status == '2'" style="color: #ffb269">核实中</span>
            <span v-else-if="scope.row.status == '3'" style="color: #479DFF">待处理</span>
            <span v-else-if="scope.row.status == '4'" style="color: #785DFF">处理中</span>
            <span v-else-if="scope.row.status == '5'" style="color: #76D672">已处理</span>
            <span v-else-if="scope.row.status == '6'" style="color: #76D672">超出范围</span>
            <span v-else style="color: #83b8c2">未知</span>
          </template>
        </el-table-column>


        <el-table-column
          prop="isClose"
          label="是否关闭"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.isClose == '0'">否</span>
            <span v-else-if="scope.row.isClose == '1'">是</span>
            <span v-else style="color: #83b8c2">未知</span>
          </template>
        </el-table-column>

        <!--增加事件类型ID、事件类型ID、处理状态标志、是否关闭标志隐藏框-->
        <el-table-column
          fixed="right"
          header-align="center"
          align="left"
          label="操作"
          width="230"
          >
          <template slot-scope="scope">
            <el-button type="text" size="small"  @click="formFindHandleClick(scope.row)"
                       style="border:none;background:none;color:#479DFF;font-size: 12px;
                       font-family: MicrosoftYaHei;font-weight: bold;">查看
            </el-button>

            <el-button type="text" size="small" @click="formUpdateHandleClick(scope.row)"
                       style="border:none;background:none;color:#76D672;font-size: 12px;
                       font-family: MicrosoftYaHei;font-weight: bold;">编辑
            </el-button>

            <!--<el-button type="text" size="small" v-if="scope.row.status == 1 && scope.row.isClose != 1"
                       @click="formVerifyHandleClick(scope.row)"
                       style="border:none;background:none;color:#ffa90f;font-size: 12px;
                       font-family: MicrosoftYaHei;font-weight: bold;">核实
            </el-button>-->

            <el-button type="text" size="small" v-if="scope.row.isAutomatic != 1 && scope.row.isClose == 1 && scope.row.status == 1"
                       @click="formVerifyHandleClick(scope.row)"
                       style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">处置
            </el-button>


            <!--<el-button type="text" size="small" v-if="scope.row.status == 3 && scope.row.isClose != 1"
                       @click="formDisposeHandleClick(scope.row)"
                       style="border:none;background:none;color:#785DFF;
                       font-size: 12px;font-family: MicrosoftYaHei;
                       font-weight: bold;">处理
            </el-button>-->


            <el-button type="text" size="small" v-if="scope.row.isClose == 1" @click="formCloseHandleClick(scope.row)"
                       style="border:none;background:none;color:#e65c6d;
                       font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">关闭
            </el-button>

            <!--<el-button v-if="scope.row.isClose == 1 || scope.row.status ==5" type="warning" size="mini" @click="formSurveyHandleClick(scope.row)">调查</el-button>-->
            <!-- <el-button v-if="scope.row.isClose == 1" type="success" size="mini" @click="formCloseHandleClick(scope.row)">开启</el-button>-->
          </template>
        </el-table-column>

      </el-table>
    </el-col>
  </el-row>



</template>

<script>
  export default {
    props:['tableData'],

    data () {
      return {
        //tableDatas: this.tableData
      }
    },

    methods:{

      //查看
      formFindHandleClick(val){
        //alert("子组件点击查看，触发父组件方法")
        this.$emit("formFindHandleClick",val);
      },
      //编辑
      formUpdateHandleClick(val){
        this.$emit("formUpdateHandleClick",val);
      },
      //核实
      formVerifyHandleClick(val) {
        this.$emit("formVerifyHandleClick",val);
      },
      //处理
      formDisposeHandleClick(val) {
        this.$emit("formDisposeHandleClick",val);
      },
      //关闭
      formCloseHandleClick(val){

        this.$confirm('此操作将关闭该事件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //触发
          this.$emit("formCloseHandleClick",val);

        }).catch(() => {
          return;
        });

      },

      //调查反馈
      formSurveyHandleClick(val){
        this.$emit("formSurveyHandleClick",val);
      },

      //表格格式化
      eventCloseFormatter(obj){
        let val = obj.isClose;
        if(val == '0'){
          return "否"
        }else if(val == '1'){
          return "是"
        }else{
          return "其他"
        }
      }
    }

  }
</script>

<style lang="scss">
  .el-tooltip__popper{
    max-width:45%;
  }
</style>
