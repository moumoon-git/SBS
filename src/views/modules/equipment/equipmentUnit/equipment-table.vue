<template>
  <el-row class="equipment-table">
    <el-col :span="24">
      <el-table
        :data="tableData"
        border
        style="width: 100%">

        <el-table-column
          prop="devId"
          label="设备编号"
          sortable
        >
        </el-table-column>


        <el-table-column
          :show-overflow-tooltip="true"
          prop="devName"
          label="设备名称"
        >
        </el-table-column>

        <el-table-column
          prop="devType"
          label="设备类型"
        >
        </el-table-column>

        <el-table-column  prop="devStatus" label="设备状态" >
          <template slot-scope="scope">
            <span v-if="scope.row.devStatus == '0'" style="color: #479DFF" >正常</span>
            <span v-if="scope.row.devStatus == '1'" style="color: #e65c6d">预警</span>
            <span v-else-if="scope.row.devStatus == '2'" style="color: #e65c6d">报警</span>
            <span v-else-if="scope.row.devStatus == '3'" style="color: #cece00">离线</span>
            <span v-else-if="scope.row.devStatus == '4'" style="color: #e65c6d">异常</span>
            <span v-else-if="scope.row.devStatus == '5'" style="color: #e65c6d">故障</span>
            <span v-else-if="scope.row.devStatus == '9'" style="color: #479DFF">就绪</span>
            <!--<span v-else style="color: #83b8c2">未知</span>-->
          </template>
        </el-table-column>

        <el-table-column
          prop="devPosition"
          label="设备地址"
        >
        </el-table-column>


        <el-table-column
          :show-overflow-tooltip="true"
          prop="videoAddress"
          label="设备视频"
          width="200px"
        >
          <!--https://www.w3school.com.cn/i/movie.ogg-->
          <template slot-scope="scope">
            <video style="width: 175px;height: 65px" :src="scope.row.videoAddress" controls="controls">
            </video>
          </template>

        </el-table-column>


        <!--增加事件类型ID、事件类型ID、处理状态标志、是否关闭标志隐藏框-->
        <el-table-column
          fixed="right"
          header-align="center"
          align="left"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"  @click="formFindHandleClick(scope.row)"
                       style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">编辑
            </el-button>

            <el-button type="text" size="small"  @click="formCloseHandleClick(scope.row)"
                       style="border:none;background:none;color:#e65c6d;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">删除
            </el-button>
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


      formatterPlatformName(row){
        return (row.townName==null?"":row.townName) + row.platformName;
      },

      formatterTime(row){
        return row.gmtCreate.substr(0,10);
      },

      //查看
      formFindHandleClick(val){
        //alert("子组件点击查看，触发父组件方法")
        this.$emit("formFindHandleClick",val);
      },

      //编辑
      formUpdateHandleClick(val){
        this.$emit("formUpdateHandleClick",val);
      },

      //关闭
      formCloseHandleClick(val){

        this.$confirm('此操作将删除该设备, 是否继续?', '提示', {
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

    }

  }
</script>

<style lang="scss">
  .equipment-table{
    .el-tooltip__popper{
      max-width:45%;
    }
    tr{
      th{
        div{
          text-align: center;
        }
      }
      td{
        div{
          text-align: center;
        }
      }
    }
  }

</style>
