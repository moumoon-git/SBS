<template>
  <div>
    <el-row>
      <el-col :span="17" style="padding: 0 0 0 30px">
        <nav-button
          @autoScheduling="autoScheduling"
          @Reset="Reset"
          @setup="setup"
          @notification="notification"
          @weekDuling="weekDuling"
          @saveScheduling="saveScheduling"
          @changeMonth="changeMonth"
        ></nav-button>
        <!--短信通知-->
        <el-dialog
          :close-on-click-modal="false"
          title="短信通知"
          width="50%"
          :visible.sync="Dialog"
        >
          <div class="msg" v-for="(item, index) in msgclass" :key="index">
            <p style="text-align: left; margin-left: 160px">
              {{ item.className }}:{{ item.day }} <span>{{ item.person }}</span>
            </p>
            <el-input
              class="el_input"
              type="textarea"
              placeholder="请输入内容"
              v-model="remark[index]"
            ></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="Dialog = false">取 消</el-button>
            <el-button type="primary" @click="msgsuccess">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 选择人员弹窗 -->
        <selectMansDialog
          ref="selectDialog"
          selectTitle="选择联系人"
          :selectData="outerVisible"
          @close="outerVisible = false"
          @closeDialog="outerVisible = false"
          @addMans="change"
        >
        </selectMansDialog>
        <!-- <el-dialog title="联系人选择" :close-on-click-modal="false" width='50%' :visible.sync="outerVisible">
         <div class="top">
             <el-input class="input" type="primary" placeholder="请输入内容" v-model="text"></el-input><el-button @click="soush">查询</el-button>
         </div>
         <div class="main">
           <div class="left">
             <el-scrollbar style="height: 100%">
              <el-tree :data="data2" style="max-height: 400px" node-key="id" check-on-click-node @node-click="handleNodeClick" :props="defaultProps"></el-tree>
             </el-scrollbar>
           </div>
          <div class="right">
            <el-scrollbar style="height: 100%">
              <el-checkbox-group style="max-height: 400px"
          v-model="checkboxGroup1">
          <el-checkbox class="checkbox" v-for="(item,city) in mans" :label="item" :key="city"><p><span>{{item.name}}</span><span>{{item.position}}</span></p>
              <p>{{item.mobile}}</p></el-checkbox>
        </el-checkbox-group>
          <div class="page">
            //分页器
          <el-pagination :small="pagingSize1" :page-size="pageSize1" :total="total1"
                            @current-change="handleNodeClick(treeId)"
                            :current-page.sync="currentPage1"
                            layout="total, prev, pager, next, jumper"></el-pagination>
          </div>
            </el-scrollbar>
          </div>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="change">确 定</el-button>
        </div>
             </el-dialog> -->
        <!-- 止 -->
        <div class="contentStyle">
          <el-header style="height: 52px; line-height: 52px; text-align: left">
            <table-button-duty
              :msg="month"
              @axios="axios"
              @Refresh="Refresh"
              @monthlyList="monthlyList"
              @importTemplate="importTemplate"
              @saveScheduling="saveScheduling"
            ></table-button-duty>
          </el-header>
          <el-main style="padding: 12px 20px">
            <!--表格-->
            <div class="tableContainer">
              <table-module
                id="table-content"
                :tableColumn="tableColumn"
                :tableData="tableData"
                @handleCellClick="handleCellClick"
                @cellClick="cellClick"
                @personDelete="personDelete"
              ></table-module>
            </div>
          </el-main>
        </div>
      </el-col>
      <el-col :span="7" style="padding: 0 30px">
        <div class="contactsPanel">
          <el-row>
            <div class="beonDuty">值班人员快速替换</div>
            <tag
              :dataName="dataName"
              @addman="addman"
              @handleClose="handleClose"
            ></tag>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog";
import tableButtonDuty from "@/view/dutyManagement/onDutyRoster/workforceManagement/deskButton/tableButtonDuty";
import navButton from "@/view/dutyManagement/onDutyRoster/workforceManagement/deskButton/navButton";
import tableModule from "@/components/tables/wzmtable";
import tag from "@/components/tag/tag";
//导出表格的依赖
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "workforceManagement",
  components: {
    navButton,
    tableButtonDuty,
    tableModule,
    tag,
    selectMansDialog,
  },
  data() {
    return {
      Dialog: false,
      msgdialog: "",
      outerVisible: false, //弹窗的
      text: "", //弹窗input
      data2: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkboxGroup1: [],
      mans: "",
      // 分页器(弹窗)
      total1: 0, //数据总数
      pageSize1: 10, //每页条数
      currentPage1: 1, //当前页数
      pagingSize1: true, //分页大小
      name: null, //选中的表格
      month: "",
      tableColumn: [], //表头
      tableData: [], //表格数据,//表格数据
      dataName: [],
      pagingSize: false, //分页大小
      cellClickData: [],
      changeTableData: [],
      treeId: "",
      array: "",
      msgclass: [],
      remark: [],
      // arrr:[
      //     {
      //
      // remark:[],
      // }
      // ],
      ids: [],
      beforeDate: "", //本周周一的时间
      msgRow: "",
    };
  },
  watch: {
    month: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.beforeDate = "";
          this.msgRow = "";
        }
      },
      deep: true,
    },
  },
  methods: {
    handleClose(tag) {
      this.dataName.splice(this.dataName.indexOf(tag), 1);
    },
    handleCellClick(row, cell) {
      console.log(row, name);
      this.name = row;
      this.setup();
    },
    // 刷新
    Refresh() {
      this.axios();
    },
    Reset() {
      this.$confirm("确认重置排班, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let params = { date: this.month };
            // let {data} = await this.$api.clearDuty(params);
            this.$api.deleteDuty(params).then((res) => {
              // console.log('res: ', res);
              if (res.errorcode === 0) {
                this.$message.success("重置排班成功");
                this.axios();
              }
            });
          } catch (e) {
            console.log("handleReset: ", e);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 导入
    importTemplate() {
      // console.log(this.month)
      const UrlRoot = window.g.ApiUrl;
      window.location.href =
        UrlRoot + "/eos/duty/dutyPlan/importTemplates?date=" + this.month;
    },
    //设置人员
    setup() {
      if (this.cellClickData.length == 0) {
        this.$message({
          message: "请选择一个日期的班次",
          type: "warning",
        });
        return;
      }
      let index = this.cellClickData[0],
        tableName = this.cellClickData[1];
      /*判断所选日期是否小于当前日期*/
      if (!this.getDateTime(this.changeTableData[index].day)) {
        this.$message({
          message: "所选日期小于当前日期!",
          type: "warning",
        });
        return;
      }
      this.$refs.selectDialog.empty();
      this.outerVisible = true;
      this.checkboxGroup1 = [];
    },
    // 请求人员
    handleNodeClick(num) {
      console.log(num);
      let page = this.currentPage1 - 1;
      //当点击左侧tree列表时，重置page从0开始
      console.log(this.treeId.id, num.id);
      if (this.treeId && this.treeId.id != num.id) {
        page = 0;
        this.currentPage1 = 1;
      }
      this.treeId = num;
      let id = num.id;
      let data = {
        groupId: id,
        searchText: this.text,
        page: page,
        size: 10,
      };
      console.log(data);
      this.$api.contactorList(data).then((res) => {
        console.log(res);
        this.total1 = res.data.totalCount;
        this.mans = res.data.list;
      });
    },
    //  分页器1(弹窗)
    /*handleCurrentChangein(){
                this.handleNodeClick(this.treeId);
            },*/
    change(checkboxGroup1) {
      let index = this.cellClickData[0],
        tableName = this.cellClickData[1];
      /*判断该单元格是否为空且该单元格是否已达上限人数*/
      let chackLength = checkboxGroup1.length,
        tableDataLength = this.changeTableData[index][tableName + "data"]
          .length,
        totalLength = this.changeTableData[index][tableName].man;

      //根据人员id获取对应信息
      let data = { data: checkboxGroup1 };
      this.$api.appContactors(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        checkboxGroup1 = res.data;
        if (
          chackLength == totalLength ||
          (tableDataLength == totalLength && chackLength < totalLength)
        ) {
          if (tableDataLength == 0) {
            /*清空已排版的人员*/
            this.changeTableData[index][tableName + "data"] = [];
            let stringName = "";
            for (let i = 0; i < chackLength; i++) {
              stringName += checkboxGroup1[i].name + "，";
              this.changeTableData[index][tableName + "data"][i] = {
                person: checkboxGroup1[i].name,
                cnctId: checkboxGroup1[i].id,
              };
            }
            this.tableData[index][tableName] = stringName.substring(
              0,
              stringName.length - 1
            );
            this.outerVisible = false;
          } else {
            this.$confirm("该班次已排班，是否替换原值班人员", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                /*清空已排版的人员*/
                this.changeTableData[index][tableName + "data"] = [];
                let stringName = "";
                for (let i = 0; i < chackLength; i++) {
                  stringName += checkboxGroup1[i].name + "，";
                  this.changeTableData[index][tableName + "data"][i] = {
                    person: checkboxGroup1[i].name,
                    cnctId: checkboxGroup1[i].id,
                  };
                }
                this.tableData[index][tableName] = stringName.substring(
                  0,
                  stringName.length - 1
                );
                this.outerVisible = false;
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          }
        } else if (chackLength + tableDataLength <= totalLength) {
          for (let i = 0; i < chackLength; i++) {
            let flag = 1;
            for (let j = 0; j < tableDataLength; j++) {
              /*重复的人员不添加进数组*/
              if (
                this.changeTableData[index][tableName + "data"][j].cnctId ==
                checkboxGroup1[i].id
              ) {
                flag = 0;
                break;
              }
            }
            if (flag) {
              this.tableData[index][tableName] =
                this.tableData[index][tableName].length == 0
                  ? checkboxGroup1[i].name
                  : this.tableData[index][tableName] +
                    "，" +
                    checkboxGroup1[i].name;
              var newData = {};
              newData.person = checkboxGroup1[i].name;
              newData.cnctId = checkboxGroup1[i].id;
              this.changeTableData[index][tableName + "data"].push(newData);
              this.outerVisible = false;
              this.$message({
                message: "设置人员成功",
                type: "success",
              });
            }
          }
        } else {
          this.$message({
            message: "所选人数超出班次管理规定人数",
            type: "warning",
          });
        }
      });
    },
    // 导出
    monthlyList() {
      const UrlRoot = window.g.ApiUrl;
      window.location.href =
        UrlRoot + "/eos/duty/dutyPlan/exportMonthlyList?date=" + this.month;
    },
    //转时间戳
    formatDateTime(time) {
      var date = time;
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      // var d = date.getDate();
      // d = d < 10 ? ('0' + d) : d;
      return y + "-" + m;
    },
    //转时间戳,精确到天
    getDateTime(times) {
      var date = new Date();
      var y = date.getFullYear();
      var m =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var nowTimes = y + "-" + m + "-" + d; //获取当前实际日期
      return Date.parse(nowTimes) <= Date.parse(times);
    },
    addman(item) {
      /*判断是否已单击选择单元格*/
      if (this.cellClickData.length != 0) {
        let index = this.cellClickData[0],
          tableName = this.cellClickData[1];
        /*判断所选日期是否小于当前日期*/
        if (!this.getDateTime(this.changeTableData[index].day)) {
          console.log(123);
          this.$message({
            message: "所选日期小于当前日期!",
            type: "warning",
          });
          return;
        }
        /*判断该单元格是否为空且该单元格是否已达上限人数*/
        if (
          this.changeTableData[index][tableName + "data"].length != 0 &&
          this.changeTableData[index][tableName + "data"].length >=
            this.changeTableData[index][tableName].man
        ) {
          this.$confirm("该班次已排班，是否替换原值班人员", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.tableData[index][tableName] = item.name;
              /*清空已排版的人员*/
              this.changeTableData[index][tableName + "data"] = [];
              this.changeTableData[index][tableName + "data"][0] = {
                person: item.name,
                cnctId: item.id,
              };
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          let flag = 1;
          for (
            let i = 0;
            i < this.changeTableData[index][tableName + "data"].length;
            i++
          ) {
            if (
              this.changeTableData[index][tableName + "data"][i].person ==
              item.name
            ) {
              flag = 0;
              this.$message({
                message: "该人员已在当前排班中!",
                type: "warning",
              });
              break;
            }
          }
          if (flag) {
            this.tableData[index][tableName] =
              this.tableData[index][tableName].length == 0
                ? item.name
                : this.tableData[index][tableName] + "，" + item.name;
            var newData = {};
            newData.person = item.name;
            newData.cnctId = item.id;
            this.changeTableData[index][tableName + "data"].push(newData);
          }
        }
      }
    },
    //页面加载数据
    axios(key) {
      //key存在只获取array

      let data = {
        //  date:resDate
        date: this.month,
      };
      //  请求
      this.$api.historyAndScheduling(data).then((res) => {
        this.array = res.data;
        if (key) return;
        // 动态班次列，取数据的第一个数据就可以了
        var plan = res.data[0].plans;
        var tableColumn = [];
        var item = {
          prop: "day",
          label: "日期",
        };
        tableColumn.push(item);
        for (var i = 0; i < plan.length; i++) {
          let label = plan[i].dutyFrequency.name;
          if (
            plan[i].dutyFrequency.startTime &&
            plan[i].dutyFrequency.endTime
          ) {
            label +=
              "\n" +
              plan[i].dutyFrequency.startTime +
              " 至 " +
              plan[i].dutyFrequency.endTime;
          }
          var item = {
            prop: plan[i].dutyFrequency.name,
            label: label,
          };
          tableColumn.push(item);
        }
        //创建表头
        this.tableColumn = tableColumn;
        // console.log(this.tableColumn);
        // 返回的数据赋值给table
        let tableData = [];
        this.changeTableData = [];
        for (let i = 0; i < res.data.length; i++) {
          let plan = res.data[i].plans;
          tableData.push({
            day: res.data[i].day,
          });
          this.changeTableData.push({
            day: res.data[i].day,
          });
          for (let j = 0; j < plan.length; j++) {
            let dutyFrequencyName = plan[j].dutyFrequency.name;
            let contactorList = plan[j].contactorList;
            let str = [];
            let personData = [];
            let publicpersonData = {
              dutyFrequencyId: plan[j].dutyFrequency.id,
              data: res.data[i].day,
              name: plan[j].dutyFrequency.name,
              man: plan[j].dutyFrequency.man,
            };
            for (let k = 0; k < contactorList.length; k++) {
              personData.push({
                person: contactorList[k].person,
                cnctId: contactorList[k].cnctId,
              });
              if (str != "") {
                str += "，" + contactorList[k].person;
              } else {
                str = contactorList[k].person;
              }
            }
            tableData[i][dutyFrequencyName] = str;
            this.changeTableData[i][dutyFrequencyName] = publicpersonData;
            this.changeTableData[i][dutyFrequencyName + "data"] = personData;
          }
        }
        this.tableData = tableData;
      });
    },
    //弹窗人
    ajax() {
      let data = {
        data: {},
      };
      this.$api.telephoneGroupingTree(data).then((res) => {
        this.data2 = res.data;
      });
    },
    // 按钮渲染
    rightaxios() {
      let data = {
        //  date:resDate
        date: this.month,
      };
      //  请求
      this.$api.allman(data).then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          //this.dataName[res.data[i].name] = res.data[i].id;
          //this.dataName.push(res.data[i].name);
          this.dataName.push({ name: res.data[i].name, id: res.data[i].id });
        }
        console.log(this.dataName);
      });
    },

    cellClick(row, column, cell, event) {
      this.msgRow = row;
      for (let i = 0; i < this.tableData.length; i++) {
        if (row.day == this.tableData[i].day) {
          this.cellClickData[0] = i;
          this.cellClickData[1] = column.property;
          break;
        }
      }
    },
    /*保存排班*/
    saveScheduling() {
      let date = this.changeTableData[0].day.slice(0, -3);
      let data = { data: [], date: date };
      for (let i = 0; i < this.changeTableData.length; i++) {
        for (let j in this.changeTableData[i]) {
          if (
            Object.prototype.toString.call(this.changeTableData[i][j]) ===
            "[object Object]"
          ) {
            if (this.changeTableData[i][j + "data"].length != 0) {
              for (
                let k = 0;
                k < this.changeTableData[i][j + "data"].length;
                k++
              ) {
                data.data.push({
                  name: this.changeTableData[i][j].name, //班次名称
                  date: this.changeTableData[i][j].data,
                  dutyFrequencyId: this.changeTableData[i][j].dutyFrequencyId, //班次id
                  person: this.changeTableData[i][j + "data"][k]["person"], //值班人姓名
                  cnctId: this.changeTableData[i][j + "data"][k]["cnctId"], //值班人id
                });
              }
            }
          }
        }
      }
      //console.log(data)
      this.$api.saveScheduling(data).then((res) => {
        if (res.errorcode === 0) {
          this.$message({
            message: "保存排班成功",
            type: "success",
          });
          this.axios(1);
        }
      });
    },
    getStart(time) {
      /*本周的最早一天*/
      let valueMonly = new Date(this.msgRow.day);
      let valueMonlyData = valueMonly.getTime();
      let beforeDate = new Date(valueMonlyData); //当前时间
      let oneDayLong = 24 * 60 * 60 * 1000; //一天的毫秒数
      let c_time = beforeDate.getTime(); //当前时间的毫秒时间
      let c_day = beforeDate.getDay() || 7; //当前时间的星期几
      let m_time = c_time - (c_day - 1) * oneDayLong; //当前周一的毫秒时间
      let monday = new Date(m_time); //设置周一时间对象
      let m_year = monday.getFullYear();
      let m_month = monday.getMonth() + 1;
      let m_date = monday.getDate();
      if (m_month <= 9) {
        m_month = "0" + m_month;
      }
      if (m_date <= 9) {
        m_date = "0" + m_date;
      }
      let theFirstDay = `${m_year}-${m_month}-${m_date}`;
      let wreeFirstDay = new Date(theFirstDay);
      let wreeFirstDayTime = wreeFirstDay.getTime(); //一周的最早一天

      /*本周的最后一天的时间*/
      let dateEnd = this.getEnd(this.msgRow.day);
      let lastDay = new Date(dateEnd);
      let lastDayTime = lastDay.getTime(); //一周的最晚一天

      /*现在的时间*/
      let keepDate = new Date(time); //当前时间
      let nowDate = keepDate.getTime();

      if (wreeFirstDayTime <= nowDate && lastDayTime >= nowDate) {
        return true;
      } else {
        return false;
      }
    },
    //获得本周最后一天
    getEnd(time) {
      let now = new Date(time);
      let nowTime = now.getTime();
      let day = now.getDay() || 7;
      let oneDayLong = 24 * 60 * 60 * 1000;
      let MondayTime = nowTime - (day - 1) * oneDayLong;
      let monday = new Date(MondayTime);
      let year = monday.getFullYear();
      let month = monday.getMonth() + 1;
      let day2 = monday.getDate() + 6;
      let day3 = this.getDaysInMonth(year, month, 0); //获得这个月有多少天
      if (day2 > day3) {
        //这里是有错误的，但是不影响我们需求的实现!
        let day3 = monday.setDate(monday.getDate() + 6);

        let lastDay = new Date(day3);

        let lastDayD = lastDay.getDate();
        month = month + 1;
        if (month <= 9) {
          month = "0" + month;
        }
        if (lastDayD <= 9) {
          lastDayD = "0" + lastDayD;
        }
        let endTime = year + "-" + month + "-" + lastDayD;
        return endTime;
      } else {
        if (month <= 9) {
          month = "0" + month;
        }
        if (day2 <= 9) {
          day2 = "0" + day2;
        }
        let endTime = year + "-" + month + "-" + day2;
        return endTime;
      }
    },
    getDaysInMonth(year, month) {
      month = parseInt(month, 10) + 1;
      let temp = new Date(year, month, 0);
      return temp.getDate();
    },
    // 周自动排班
    weekDuling() {
      //获取右侧人员列表，用于添加进自动排班中
      let person = this.dataName,
        personIndex = 0;

      /*将值班人员排班添加到changeTableData,可用与向后台保存自动排班*/
      //遍历table每一行
      for (let i = 0; i < this.changeTableData.length; i++) {
        //判断日期是否不小于当前日期
        if (this.getStart(this.tableData[i].day)) {
          //遍历changeTableData每行对应的单元格
          for (let j in this.changeTableData[i]) {
            //判断changeTableData存放的是否是一个对象
            if (
              Object.prototype.toString.call(this.changeTableData[i][j]) ===
              "[object Object]"
            ) {
              //判断当前单元格设置的人数是否超出了总的能进入排班人数
              if (this.changeTableData[i][j].man > person.length) {
                console.log(this.changeTableData[i][j], person.length);
                this.$message({
                  message:
                    "抱歉，班次名称为“" +
                    this.changeTableData[i][j].name +
                    "”所设置的人数超出自动排班队列中的人数！",
                  type: "warning",
                });
                return;
              }
              //判断当前单元格是否排班已打人数上限
              for (
                let k = this.changeTableData[i][j + "data"].length;
                k < this.changeTableData[i][j].man;
                k++
              ) {
                //排班未达人数上限，对其进行自动添加新的人员
                //对当前单元格的人员进行遍历，如果有重复(冲突)，则将获取person下一个将要新添加进来的人员
                for (
                  let l = 0;
                  l < this.changeTableData[i][j + "data"].length;
                  l++
                ) {
                  if (
                    this.changeTableData[i][j + "data"][l].cnctId ==
                    person[personIndex].id
                  ) {
                    personIndex =
                      personIndex + 1 >= person.length ? 0 : personIndex + 1;
                    //冲突时应对当前单元格进行新的遍历，避免后续任然可能添加进重复的人员
                    l = 0;
                  }
                }
                //添加新的人员
                this.changeTableData[i][j + "data"].push({
                  person: person[personIndex].name,
                  cnctId: person[personIndex].id,
                });
                personIndex =
                  personIndex + 1 >= person.length ? 0 : personIndex + 1;
              }
            }
          }
        }
      }
      /*更新tableData，用于单元格展示值班人员*/
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.getStart(this.tableData[i].day)) {
          for (let j = 0; j < this.changeTableData.length; j++) {
            if (this.changeTableData[j].day == this.tableData[i].day) {
              for (let k in this.changeTableData[j]) {
                if (
                  Object.prototype.toString.call(this.changeTableData[j][k]) ===
                  "[object Object]"
                ) {
                  let personName = "";
                  for (
                    let l = 0;
                    l < this.changeTableData[j][k + "data"].length;
                    l++
                  ) {
                    personName +=
                      this.changeTableData[j][k + "data"][l].person + "，";
                  }
                  this.tableData[i][k] =
                    personName == ""
                      ? ""
                      : personName.substring(0, personName.length - 1);
                }
              }
            }
          }
        }
      }
      this.$message({
        message: "自动排班成功",
        type: "success",
      });
    },
    /*月自动排班*/
    autoScheduling() {
      //获取右侧人员列表，用于添加进自动排班中
      let person = this.dataName,
        personIndex = 0;

      /*将值班人员排班添加到changeTableData,可用与向后台保存自动排班*/
      //遍历table每一行
      for (let i = 0; i < this.changeTableData.length; i++) {
        //判断日期是否不小于当前日期
        if (this.getDateTime(this.tableData[i].day)) {
          //遍历changeTableData每行对应的单元格
          for (let j in this.changeTableData[i]) {
            //判断changeTableData存放的是否是一个对象
            if (
              Object.prototype.toString.call(this.changeTableData[i][j]) ===
              "[object Object]"
            ) {
              //判断当前单元格设置的人数是否超出了总的能进入排班人数
              if (this.changeTableData[i][j].man > person.length) {
                console.log(this.changeTableData[i][j], person.length);
                this.$message({
                  message:
                    "抱歉，班次名称为“" +
                    this.changeTableData[i][j].name +
                    "”所设置的人数超出自动排班队列中的人数！",
                  type: "warning",
                });
                return;
              }
              //判断当前单元格是否排班已打人数上限
              for (
                let k = this.changeTableData[i][j + "data"].length;
                k < this.changeTableData[i][j].man;
                k++
              ) {
                //排班未达人数上限，对其进行自动添加新的人员
                //对当前单元格的人员进行遍历，如果有重复(冲突)，则将获取person下一个将要新添加进来的人员
                for (
                  let l = 0;
                  l < this.changeTableData[i][j + "data"].length;
                  l++
                ) {
                  if (
                    this.changeTableData[i][j + "data"][l].cnctId ==
                    person[personIndex].id
                  ) {
                    personIndex =
                      personIndex + 1 >= person.length ? 0 : personIndex + 1;
                    //冲突时应对当前单元格进行新的遍历，避免后续任然可能添加进重复的人员
                    l = 0;
                  }
                }
                //添加新的人员
                this.changeTableData[i][j + "data"].push({
                  person: person[personIndex].name,
                  cnctId: person[personIndex].id,
                });
                console.log(this.changeTableData[i]);
                personIndex =
                  personIndex + 1 >= person.length ? 0 : personIndex + 1;
              }
            }
          }
        }
      }
      /*更新tableData，用于单元格展示值班人员*/
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.getDateTime(this.tableData[i].day)) {
          for (let j = 0; j < this.changeTableData.length; j++) {
            if (this.changeTableData[j].day == this.tableData[i].day) {
              for (let k in this.changeTableData[j]) {
                if (
                  Object.prototype.toString.call(this.changeTableData[j][k]) ===
                  "[object Object]"
                ) {
                  let personName = "";
                  for (
                    let l = 0;
                    l < this.changeTableData[j][k + "data"].length;
                    l++
                  ) {
                    personName +=
                      this.changeTableData[j][k + "data"][l].person + "，";
                  }
                  this.tableData[i][k] =
                    personName == ""
                      ? ""
                      : personName.substring(0, personName.length - 1);
                }
              }
            }
          }
        }
      }
      this.$message({
        message: "自动排班成功",
        type: "success",
      });
    },
    notification() {
      if (this.cellClickData.length == 0) {
        this.$message({
          message: "请选择一个日期的班次",
          type: "warning",
        });
        return;
      }
      let index = this.cellClickData[0],
        tableName = this.cellClickData[1];
      /*判断所选日期是否小于当前日期*/
      if (!this.getDateTime(this.changeTableData[index].day)) {
        this.$message({
          message: "所选日期要小于当前日期!",
          type: "warning",
        });
        return;
      }
      this.Dialog = true;
      /* tem = [];
                for(let i = 0; i< this.array.length; i++){
                    if(this.array[i].day == this.msgRow.day){
                        tem = this.array[i];
                    }
                }*/
      let tem = this.array.filter((o) => o.day == this.msgRow.day)[0] || {};
      for (let i in tem["plans"]) {
        let tem2 = "";
        for (let j = 0; j < tem["plans"][i]["contactorList"].length; j++) {
          tem2 += tem["plans"][i]["contactorList"][j].person + "，";
          //console.log(this.ids.indexOf(tem['plans'][i]['contactorList'][j].cnctId))
          this.ids.indexOf(tem["plans"][i]["contactorList"][j].cnctId) == -1 &&
            this.ids.push(tem["plans"][i]["contactorList"][j].cnctId);
        }
        //console.log(tem['plans'][i]['dutyFrequency'].name)
        this.msgclass[i] = {
          className: tem["plans"][i]["dutyFrequency"].name,
          day: tem.day,
          person: tem2,
          remark: "",
        };
      }
      /* console.log(this.ids)
                console.log(this.array)
                //this.msgclass=msgman
                // this.msgRow.push({remark:''})
                console.log(this.msgRow)*/
      //console.log(this.msgclass)
    },
    //改变日期刷新table
    changeMonth(date) {
      if (date) {
        this.month = this.formatDateTime(date);
        this.axios();
      }
    },
    msgsuccess() {
      /*console.log(this.msgclass.id);
                console.log(this.msgclass)
                console.log(this.remark)*/
      let msg = "";
      for (let i = 0; i < this.msgclass.length; i++) {
        //console.log(i+1+':班次:'+this.msgclass[i].className+';时间:'+this.msgclass[i].day+';人员：'+this.msgclass[i].person+'备注:'+this.remark[i])
        if (this.remark[i] == undefined) {
          this.remark[i] = "";
        }
        let temp =
          i +
          1 +
          ":班次:" +
          this.msgclass[i].className +
          ";时间:" +
          this.msgclass[i].day +
          ";人员：" +
          this.msgclass[i].person +
          "备注:" +
          this.remark[i] +
          "\n";
        msg = msg + temp;
      }
      // console.log(msg)
      // alert(msg)
      // let text=''
      // for(let n=0;n<msg.length;n++){
      //     text=msg[n]
      // }
      if (this.ids.length == 0) {
        this.$message({
          message: "没有安排人员或者保存班次",
          type: "warning",
        });
        return;
      }
      let data = {
        data: {
          contactorId: this.ids,
          content: msg,
        },
      };
      // console.log(this.ids)
      // return;
      this.$api.dutyplan(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
        } else {
          this.ids = [];
          this.$message({
            message: "发送成功!",
            type: "success",
          });
          this.Dialog = false;
        }
      });
    },
    soush() {
      let data = {
        searchText: this.text,
        page: this.currentPage1 - 1,
        size: this.pageSize1,
      };
      //console.log(data)
      this.$api.contactorList(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
        this.mans = res.data.list;
        this.total1 = res.data.totalCount;
      });
    },
    /**
     * @description: 单击单元格删除数据
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {checkShift} :班次名
     * @param {date} :当前行日期
     * @return {}
     */
    personDelete(checkShift, date) {
      let today = new Date();
      /*判断所选日期是否小于当前日期*/
      if (
        +new Date(date) <
        +new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ) {
        this.$message.error("所选日期小于当前日期");
        return;
      }
      // 删除表格显示的数据
      this.tableData.map((v) => {
        if (v.day == date) {
          v[checkShift] = [];
        }
      });
      // 删除保存排班后给后端的数据
      this.changeTableData.map((item) => {
        if (item.day == date) {
          item[checkShift + "data"] = [];
        }
      });
    },
  },
  created: function () {
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var resDate = y + "-" + m;
    this.month = resDate;
    // this.$refs.tableButtonDuty.getData(this.month)
    this.axios();
    this.ajax();
    this.rightaxios();
  },
};
</script>

<style scoped>
.contactsPanel {
  width: 100%;
  height: 777px;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
  overflow-y: auto;
}
.contentStyle {
  margin-top: 16px;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
.tableContainer {
  height: 622px;
  padding: 6px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
  border: 1px solid rgba(211, 215, 219, 1);
}
.beonDuty {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(50, 50, 50, 1);
}
.main {
  width: 100%;
  display: flex;
}
.left {
  width: 50%;
}
.right {
  width: 50%;
  height: 620px;
  /* background-color: #ccc; */
  position: relative;
}
.page {
  position: absolute;
  margin: 0 auto;
  bottom: 0;
}
.checkbox {
  margin-top: 10px;
  width: 180px;
  text-align: left !important;
  height: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.input {
  width: 300px;
  margin: 0 20px;
}
.dialog-footer {
  text-align: center;
}
.el_input {
  width: 600px;
}
</style>
