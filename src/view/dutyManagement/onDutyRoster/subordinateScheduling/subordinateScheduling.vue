<!-- subordinate Scheduling 下级排班-->
<!--
    * @description
    * @author
    * @lastEditors yangqingdong
    * @lastEditTime 2020/9/8 18:16
    -->
<template>
  <el-container class="container" id="subordinateScheduling">
    <el-aside>
      <div class="buttonGroup">
        <!-- <el-button @click="dialogAsignSchedule = true" type="primary">下发排班任务</el-button> -->
        <el-button @click="openDialogPatternDefinition" type="primary"
          >模式定义</el-button
        >
        <el-button @click="openDialogSubordinateDefinition" type="primary"
          >部门分组定义</el-button
        >
      </div>
      <pattern-definition
        :dialogPatternDefinition.sync="dialogPatternDefinition"
        :patternListProp="patternList"
        @setSelectedPattern="setSelectedPattern"
        v-if="dialogPatternDefinition"
      ></pattern-definition>
      <subordinate-definition
        v-if="dialogSubordinateDefinition"
        :dialogSubordinateDefinition.sync="dialogSubordinateDefinition"
        :allGroupList="allGroupList"
        :selectedGroupList="groupList"
        @setGroupList="setGroupList"
      ></subordinate-definition>
      <asign-schedule
        v-if="dialogAsignSchedule"
        :dialogAsignSchedule.sync="dialogAsignSchedule"
        :group-list="groupList"
      ></asign-schedule>
      <div class="selectGroupBlock">
        <el-table
          :data="groupList"
          :show-header="false"
          :row-class-name="rowClassName"
          @row-click="handleRowClick"
          :row-style="handleStyle"
          style="width: 100%"
          height="700px"
        >
          <el-table-column prop="name"></el-table-column>
        </el-table>
      </div>
    </el-aside>

    <el-main style="padding: 20px 0 0 10px;">
      <div class="block" style="margin-bottom: 2%">
        <div
          class="demonstration"
          style="display: inline-block; margin-right: 5%; font-weight: bold"
        >
          日期： {{ date }}
        </div>
        <div class="demonstration" style="display: inline-block">
          月份选择：
        </div>
        <el-date-picker
          v-model="dateValue"
          type="month"
          placeholder="选择日期"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
          @change="handelMonthChange"
          :clearable="false"
        ></el-date-picker>
        <el-button
          @click="exportStreet"
          type="primary"
          style="margin-left: 100px"
          >导出</el-button
        >
      </div>

      <el-table
        style="box-shadow: none;"
        :data="formattedSchedulingList"
        :span-method="objectSpanMethod"
        :row-style="{ height: '48px' }"
        border
        height="700px"
        ref="schedulingTable"
        :header-cell-style="{
          'background-color': '#F0F5FF',
          color: '#333333',
          'font-size': '16px',
          'font-weight': 'bold',
        }"
      >
        <el-table-column label="日期" width="150" align="center">
          <template slot-scope="scope">
            <div
              style="text-align: center; font-size: 14px; font-weight: bold"
              :style="{ color: scope.row.type ? '#333' : '#FF3333' }"
            >
              <div>{{ scope.row.date }}</div>
              <div>{{ scope.row.week }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="className"
          label="班次"
          width="150"
          align="center"
        ></el-table-column>

        <el-table-column
          v-for="(item, ind) in mode"
          :key="ind"
          :label="item.name"
          header-align="center"
          align="center"
        >
          <el-table-column
            :prop="'name' + item.name"
            label="人员姓名"
            align="center"
          ></el-table-column>
          <el-table-column
            :prop="'mobile' + item.name"
            label="手机电话"
            align="center"
          ></el-table-column>
          <el-table-column
            :prop="'tel' + item.name"
            label="办公电话"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
// import myTable from "@/components/tables/tables"
// /view/integratedCommunication/icpPhone/icpPhonePage/mixin
import mixin from "../../../integratedCommunication/icpPhone/icpPhonePage/mixin";
import PatternDefinition from "./patternDefinition";
import SubordinateDefinition from "./subordinateDefinition";
import AsignSchedule from "./asignSchedule";
import { platformTreeDataTranslate } from "@/utils";
import exportFile from '@/view/tool/exportFile' // 下载文件


export default {
  name: "subordinateScheduling",
  mixins: [mixin],
  components: {
    PatternDefinition,
    SubordinateDefinition,
    AsignSchedule,
  },
  data() {
    return {
      deptMenu: [], // 部门菜单
      deptId: 17,
      deptTableData: [],
      currentRow: "",
      dateValue: "",
      date: "",

      tableColumnNames: [
        {
          label: "日期",
          prop: "day",
        },
        {
          label: "值班人员",
          prop: "contactorNames",
        },
        {
          label: "排班名称",
          prop: "dutyFrequencyName",
        },
      ],

      dialogAsignSchedule: false,
      dialogPatternDefinition: false,
      dialogSubordinateDefinition: false,

      groupList: [],
      allGroupList: [],

      schedulingList: [],
      formattedSchedulingList: [],

      mode: [
        {
          classesId: null,
          createTime: "2020-08-28 09:43:34",
          deptId: null,
          id: 7,
          modeId: 1,
          name: "领导",
          numble: 3,
          sysIStatus: 0,
          sysVcRemark: null,
          updateTime: "2020-08-28 09:43:34.0",
        },
        {
          classesId: null,
          createTime: "2020-08-28 09:43:34",
          deptId: null,
          id: 8,
          modeId: 1,
          name: "值班员",
          numble: 5,
          sysIStatus: 0,
          sysVcRemark: null,
          updateTime: "2020-08-28 09:43:34.0",
        },
      ],
      maxNumble: 0,
      dateSpan: [],
      singleSpan: [],

      patternList: "",
      selectedPattern: "",

      currentRowIndex: 0,
      baseUrl: window.g.ApiUrl,
    };
  },
  created() {
    let day = new Date();
    this.date = day.formatDate("yyyy年MM月dd日");
    this.dateValue = day.formatDate("yyyy-MM");
    console.log(this.dateValue);
    // this.getDeptChildren(); // 注释原因：bug 13383 接口不再使用
    // this.getMonthlyList()

    this.$api.subordinateGetSelectedGroup().then((res) => {
      this.groupList = res.data;
      this.deptId = this.groupList[this.currentRowIndex].deptId;
      this.getCurrentModeAndTable(this.dateValue, this.deptId);
      //this.getAllByDate(this.dateValue, this.deptId);
    });
  },
  methods: {
    openDialogSubordinateDefinition() {
      // this.$api.subordinateGetAllGroup().then((res) => {
      //   this.allGroupList = res.data;
      //   this.dialogSubordinateDefinition = true;

      //   this.$api
      //     .subordinateGetAllByDate({
      //       date: this.dateValue,
      //       deptId: this.deptId,
      //     })
      //     .then((res) => {
      //       this.schedulingList = res.data;
      //     });
      // });
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/platform/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            const data = response.data.data;
            data.forEach((item) => {
              item.deptId = item.id;
              item.id = undefined;
              item.name = item.platformName;
            });
            this.allGroupList = platformTreeDataTranslate(data);
            this.dialogSubordinateDefinition = true;
            this.$api
              .subordinateGetAllByDate({
                date: this.dateValue,
                deptId: this.deptId,
              })
              .then((res) => {
                this.schedulingList = res.data;
              });
          }
        });
    },
    openDialogPatternDefinition() {
      this.getPatternList();
    },
    getPatternList() {
      let params = {};
      let promiseList = [];
      const thisvm = this;
      this.$api.subordinateModeGetModeList(params).then((res) => {
        thisvm.patternList = res.data;
        for (let i = 0; i < thisvm.patternList.length; i++) {
          thisvm.patternList[i].editable = false;

          promiseList.push(
            new Promise((resolve, reject) => {
              let params = {
                id: thisvm.patternList[i].id,
              };
              thisvm.$api.subordinateModeGetClassesList(params).then((res) => {
                thisvm.patternList[i].dutyOrderData = {
                  dutyOrders: res.data,
                };
                resolve();
              });
            })
          );
          promiseList.push(
            new Promise((resolve, reject) => {
              let params = {
                id: thisvm.patternList[i].id,
              };
              thisvm.$api.subordinateModeGetRoleList(params).then((res) => {
                thisvm.patternList[i].dutyRoleData = {
                  dutyRoles: res.data,
                };
                resolve();
              });
            })
          );
        }
        Promise.all(promiseList)
          .then((rspList) => {
            rspList.map(() => {
              //console.log("kkk");
            });
          })
          .then(() => {
            this.dialogPatternDefinition = true;
          });
      });
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.deptId = Number(key);
      this.getMonthlyList(this.dateValue, this.deptId);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log(this.currentRow);
      this.getDateNow();
    },
    handleClick(row) {
      console.log(row);
    },
    // handelMonthChange() {
    //   console.log(this.dateValue);
    //   console.log(this.deptId);
    //   if (this.deptId) this.getMonthlyList(this.dateValue, this.deptId);
    //   else {
    //     this.$message({
    //       message: "请选择下级单位",
    //       type: "warning",
    //     });
    //   }
    // },
    getCurrentModeAndTable(date, deptId) {
      this.$api
        .subordinateGetCurrentMode({
          date: date,
          deptId: deptId,
        })
        .then((res) => {
          this.mode = res.data;
          this.getAllByDate(date, deptId);
        });
    },
    getAllByDate(date, deptId) {
      this.$api
        .subordinateGetAllByDate({
          date: date,
          deptId: deptId,
        })
        .then((res) => {
          this.schedulingList = res.data.sort(function (a, b) {
            return a.date > b.date ? 1 : -1;
          });
          this.formattedSchedulingList = this.dataFormat();
          // this.$nextTick(() => {
          //   this.$refs.schedulingTable.doLayout();
          // });
        });
    },
    handelMonthChange() {
      this.getCurrentModeAndTable(this.dateValue, this.deptId);
      //this.getAllByDate(this.dateValue, this.deptId);
    },

    // 获取当天日期
    getDateNow() {
      let day = new Date();
      console.log(day);
      this.dateValue = day.formatDate("yyyy-MM-dd");
      console.log(this.dateValue);
    },

    // 获取传达单位
    getDeptChildren() {
      let data = {};
      this.$api.getDeptChildren(data).then((res) => {
        console.log(res);
        if (res.errorcode !== 0) {
          this.$message({
            message: "请求下级单位失败",
            type: "warning",
          });
        } else {
          this.deptMenu = res.data;
        }
      });
    },
    // 获取下级部门当月排班
    getMonthlyList(date, deptId) {
      let data = {
        date,
        deptId,
      };
      console.log(data);
      this.$api.monthlyListInLowerDept(data).then((res) => {
        console.log(res);
        if (res.errorcode !== 0) {
          this.$message({
            message: "请求排班数据失败",
            type: "warning",
          });
        } else {
          this.deptTableData = res.data.dutyPlans;
          console.log(this.deptTableData);
          // console.log(this.deptTableData);
          // this.deptMenu = res.data
        }
      });
    },

    setGroupList() {
      this.$api.subordinateGetSelectedGroup().then((res) => {
        this.groupList = res.data;
        this.currentRowIndex = 0;
      });
      //this.groupList = groupList;
    },
    setSelectedPattern(pattern) {
      this.selectedPattern = pattern;
    },

    rowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    handleRowClick(row, column, event) {
      if (row.index != this.currentRowIndex) {
        this.currentRowIndex = row.index;
        this.deptId = this.groupList[this.currentRowIndex].deptId;
        this.getCurrentModeAndTable(this.dateValue, this.deptId);
        //this.getAllByDate(this.dateValue, this.deptId);
      }
    },
    handleStyle({ row, rowIndex }) {
      if (this.currentRowIndex == rowIndex) {
        return { color: "rgba(0, 153, 255, 1)" };
      }
    },

    dataFormat() {
      let formattedList = [];

      let nameList = [];
      this.maxNumble = 0;
      for (let i = 0; i < this.mode.length; i++) {
        if (this.mode[i].numble > this.maxNumble) {
          this.maxNumble = this.mode[i].numble;
        }
        nameList.push({
          name: "name" + this.mode[i].name,
          mobile: "mobile" + this.mode[i].name,
          tel: "tel" + this.mode[i].name,
        });
        if (this.mode[i].numble == 1) {
          this.singleSpan.push(true);
        } else {
          this.singleSpan.push(false);
        }
      }
      for (let item of this.schedulingList) {
        //item是日期

        let tmpDate = item.date;
        this.dateSpan = this.maxNumble * item.data.length;

        for (let item2 of item.data) {
          //item2是班次
          let tmpClassName = item2.name;
          let tmpType = item2.type;

          for (let i = 0; i < this.maxNumble; i++) {
            let person = {
              date: tmpDate,
              week: this.getWeek(tmpDate),
              className: tmpClassName,
              type: tmpType,
            };
            item2.appDutySubordinateGroupRoles.forEach((item3, index3) => {
              let index4;
              for (let j = 0; j < this.mode.length; j++) {
                if (this.mode[j].name == item3.name) {
                  index4 = j;
                  break;
                }
              }
              if (index4 || index4 === 0) {
                person[nameList[index4].name] = "";
                person[nameList[index4].mobile] = "";
                person[nameList[index4].tel] = "";
                if (item3.appDutySubordinates[i]) {
                  person[nameList[index4].name] =
                    item3.appDutySubordinates[i].contacotrName;
                  person[nameList[index4].mobile] =
                    item3.appDutySubordinates[i].contacotrMobile;
                  person[nameList[index4].tel] =
                    item3.appDutySubordinates[i].contacotrTelPhone;
                }
              }
            });
            formattedList.push(JSON.parse(JSON.stringify(person)));
          }
        }
      }
      this.dateSpan = this.generateSpan(formattedList);
      return formattedList;
    },
    generateSpan(list) {
      let span = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i - 1] && list[i].date == list[i - 1].date) {
          span.push({
            rowspan: 0,
            colspan: 0,
          });
        } else {
          let count = 0;
          for (let j = i; j < list.length; j++) {
            if (list[i].date == list[j].date) {
              count++;
            }
          }
          span.push({
            rowspan: count,
            colspan: 1,
          });
        }
      }
      return span;
    },
    // 获取星期
    getWeek(time) {
      return "星期" + "日一二三四五六".charAt(new Date(time).getDay());
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return this.dateSpan[rowIndex];
      }
      if (columnIndex === 1) {
        if (rowIndex % this.maxNumble === 0) {
          return {
            rowspan: this.maxNumble,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      for (let i = 0; i < this.singleSpan.length; i++) {
        if (this.singleSpan[i]) {
          if (
            columnIndex === i * 3 + 2 ||
            columnIndex === i * 3 + 3 ||
            columnIndex === i * 3 + 4
          ) {
            if (rowIndex % this.maxNumble === 0) {
              return {
                rowspan: this.maxNumble,
                colspan: 1,
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0,
              };
            }
          }
        }
      }
    },
    // 导出
    exportStreet() {
      var url = '/eos/duty/subordinate/getAllByDateExcel'
      exportFile({
        url:window.g.ApiUrl + url,
        method:'get',
        params:{
          date:this.dateValue,
          deptId:this.deptId,
          Authorization:localStorage.getItem("token")?localStorage.getItem("token") : ""
        },
        token:this.$cookie.get('token')
      })
    },
  },
};
</script>

<style scoped>
#subordinateScheduling .container {
  margin: 20px 30px;
  background: #ffffff;
}
#subordinateScheduling .buttonGroup {
  position: relative;
  margin-top: 20px;
  /* height: 85px;
  width: 408px;
  padding-top: 20px; */
}

#subordinateScheduling .el-menu-vertical-demo {
  position: relative;
  top: 85px;
  /* border: 1px solid yellow; */
}

#subordinateScheduling .selectGroupBlock {
  margin-top: 25px;
  border: 1px solid rgba(188, 188, 188, 1);
}

.el-table >>> .el-table--border {
  border-color: #c9dcfe;
}
.el-table >>> th {
  border-color: #c9dcfe;
}
.el-table >>> td {
  border-color: #c9dcfe;
}
</style>
