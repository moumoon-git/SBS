<!--@author：yf-->
<template>
  <div>
    <div
      style="
        display: flex;
        text-align: left;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
      "
    >
      <label>报送单位:</label>
      <el-select
        v-model="value"
        clearable
        placeholder="请选择"
        @change="chaneMsg"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!--        <div style="width: 100%;height: 450px;overflow: auto">-->
    <!--            <el-card class="box-card"  v-for="o in 8" :key="o" style="margin: 5px 0">-->
    <!--              <div slot="header" class="clearfix" style="text-align: left">-->
    <!--                <span>title</span>-->
    <!--                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-upload2"></el-button>-->
    <!--              </div>-->
    <!--              <div class="text item">-->
    <!--                内容-->
    <!--              </div>-->
    <!--            </el-card>-->
    <!--        </div>-->
    <div class="myTable">
      <my-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        @handleCurrentChange="handleCurrentChange"
      ></my-table>
    </div>

    <div style="margin-top: 20px">
      <el-button type="primary" size="small" @click="addAdj"
        >添加到批示</el-button
      >
    </div>

    <!--      <el-col :span="16">-->
    <!--        -->
    <!--      </el-col>-->
  </div>
</template>

<script>
import myTable from '@/yz_components/tables/tables';
export default {
  name: 'messageHistory',
  components: {
    myTable,
  },
  data() {
    return {
      options: [
        {
          value: '全部',
          label: '全部',
        },
      ],
      total: 0, //总数据
      pageSize: 1, //第几页
      currentPage: 10, //每页多少条数据
      pagingSize: false, //分页大小
      value: '全部', //报送单位
      tableColumn: [
        {
          prop: 'operatorName',
          label: '值班员',
        },
        {
          prop: 'contactorName',
          label: '联系人',
        },
        {
          prop: 'contactorWorkUnit',
          label: '单位',
        },
        // {
        //   prop: "position",
        //   label: "职务"
        // },
        {
          prop: 'called',
          label: '电话号码',
        },
      ], //表头
      tableData: [], //表格数据
      eventId: '', //事件ID
      tabRowData: [], //表格数据
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getTabData();
      this.getMsg();
    });
  },
  methods: {
    chaneMsg(val) {
      if (
        this.eventId == '' ||
        this.eventId == null ||
        this.eventID == 'newID'
      ) {
        this.$message({
          message: '请先保存事件',
          type: 'warning',
        });
        return;
      }
      console.log(val);
      if (val == '全部') {
        this.getTabData();
      } else {
        let data = {
          eventId: this.eventId,
          unit: val == '查询未知单位' ? '' : val,
        };
        this.$api.selectSmsHistoryByEventAndUnit(data).then((res) => {
          if (res.errorcode == '0') {
            this.tableColumn = [
              {
                prop: 'operator',
                label: '值班员',
              },
              {
                prop: 'contactor',
                label: '联系人',
              },
              {
                prop: 'workUnit',
                label: '单位',
              },
              // {
              //   prop: "position",
              //   label: "职务"
              // },
              {
                prop: 'called',
                label: '电话号码',
              },
            ]; //表头
            this.tableData = res.data;
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    getMsg() {
      //获取短信单位
      if (
        this.eventId == '' ||
        this.eventId == null ||
        this.eventId == 'newID'
      ) {
        return;
      }

      let data = {
        eventId: this.eventId,
      };
      this.$api.selectSmsDepartment(data).then((res) => {
        if (res.errorcode == 0) {
          let arr = [
            {
              value: '全部',
              label: '全部',
            },
          ];

          for (let i = 0; i < res.data.length; i++) {
            if (
              res.data[i] == '' ||
              res.data[i] == null ||
              res.data[i] == undefined
            ) {
              res.data[i] = '查询未知单位';
            }
            arr.push({
              value: res.data[i],
              label: res.data[i],
            });
          }
          this.options = arr;
        }
      });
    },
    getTabData() {
      this.eventId = sessionStorage.getItem('newID');
      if (
        this.eventId == '' ||
        this.eventId == null ||
        this.eventId == 'newID'
      ) {
        return;
      }
      let data = {
        eventId: this.eventId,
      };
      // this.$api.selectSmsHistory(data).then((res) => {
      //   if(res.errorcode==0){
      //     this.tableData=res.data
      //   }
      // })
      this.$api.getSmsHistory(data).then((res) => {
        if (res.errorcode == 0) {
          this.tableColumn = [
            {
              prop: 'operatorName',
              label: '值班员',
            },
            {
              prop: 'contactorName',
              label: '联系人',
            },
            {
              prop: 'contactorWorkUnit',
              label: '单位',
            },
            // {
            //   prop: "position",
            //   label: "职务"
            // },
            {
              prop: 'called',
              label: '电话号码',
            },
          ]; //表头
          this.tableData = res.data;
        }
      });
    },
    addAdj() {
      //添加到批示
      if (
        this.tabRowData == '' ||
        this.tabRowData == [] ||
        this.tabRowData == null
      ) {
        this.$message({
          message: '请选中表格中某一行再添加',
          type: 'warning',
        });
        return;
      }
      let add = {
        data: {
          byFax: 0,
          byPhone: 0,
          bySms: 0,
          eventId: this.eventId,
          approval: this.tabRowData.content,
          approvaltype: '指示',
          leadername: this.tabRowData.contactor,
          approvalTime: this.tabRowData.sendTime,
        },
      };
      this.$api.leadAdd(add).then((res) => {
        if (res.errorcode == '0') {
          this.$message({
            message: '已成功添加至领导批示',
            type: 'success',
          });
          this.$emit('refreshEvent'); //刷新右侧内容
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(row) {
      //表格点击
      this.tabRowData = [];
      this.tabRowData = row;
    },
  },
};
</script>

<style scoped>
.myTable {
  border: 1px solid #ddd;
  padding: 10px 15px;
  margin: 10px;
}
.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
}
</style>
