<!--@author：wzm-->
<template>
  <div class="out">
    <span>名称</span>
    <el-input v-model="search" style="width: 200px"></el-input>
    <span>年份</span>
    <el-date-picker
      v-model="year"
      type="year"
      placeholder="选择日期"
      value-format="yyyy"
    ></el-date-picker>
    <el-button @click="go" type="primary">查询</el-button>
    <span style="float: right;">
      <el-button @click="addHandle" type="primary">新增</el-button>
      <!-- 弹窗 -->
      <el-dialog
        :title="(form.group.id ? '修改' : '新增') + '节假日'"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" class="legalDate">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input
              v-model="form.group.name"
              auto-complete="off"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <!-- 石景山需求采用万年历 author:xuchuanxging lastUpdateTime:2020-12-17 -->
          <el-form-item label="法定节假日" :label-width="formLabelWidth">
            <div v-for="(item, index) in holidayAndvacations">
              <div style="position: relative">
                <el-date-picker
                  v-model="item.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  readonly
                  style="margin: 5px"
                  @click.stop.native="
                    idx = index;
                    holidayAndvacationsVisible = true;
                    restDayVisible = false;
                  "
                >
                </el-date-picker>

                <vue-better-calendar
                  v-if="index == idx && holidayAndvacationsVisible"
                  @select-range-date="
                    getDate($event, index, 'holidayAndvacations')
                  "
                  mode="range"
                  class="aaaa"
                  style="
                    position: absolute;
                    top: 50px;
                    background-color: white;
                    z-index: 9999;
                    width: 360px;
                  "
                ></vue-better-calendar>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  v-if="index == 0"
                  @click="addHolidayAndvacations"
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-close"
                  v-else
                  @click="delHolidayAndvacations(item, index)"
                ></el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="法定调班日" :label-width="formLabelWidth">
            <div v-for="(item, i) in restDay">
              <div style="position: relative">
                <el-date-picker
                  v-model="item.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  readonly
                  style="margin: 5px"
                  @click.stop.native="
                    holidayAndvacationsVisible = false;
                    idx = i;
                    restDayVisible = true;
                  "
                >
                </el-date-picker>
                <vue-better-calendar
                  v-if="i == idx && restDayVisible"
                  @select-range-date="getDate($event, i, 'restDay')"
                  mode="range"
                  style="
                    position: absolute;
                    top: 50px;
                    background-color: white;
                    z-index: 9999;
                    width: 360px;
                  "
                ></vue-better-calendar>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  v-if="i == 0"
                  @click="addRestDay"
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-close"
                  v-else
                  @click="delRestDay(item, i)"
                ></el-button>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="节假日类型" label-width="120px" style="text-align:left">
            <el-col :span="23">
              <el-radio-group v-model="form.type">
                <el-radio :label="0">法定节假日</el-radio>
                <el-radio :label="1">法定调班日</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.begin" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期(包含当天)" :label-width="formLabelWidth">
            <el-date-picker v-model="form.over" type="date" placeholder="选择日期(包含当天)"></el-date-picker>
          </el-form-item> -->
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="form.group.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrEdit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 止 -->
      <el-button type="primary" @click="openchange">修改</el-button>
      <!-- 弹窗 -->
      <el-dialog
        title="修改节假日"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible1"
      >
        <el-form>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input
              v-model="name"
              auto-complete="off"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="节假日类型"
            label-width="120px"
            style="text-align: left"
          >
            <el-col :span="23">
              <el-radio-group v-model="type">
                <el-radio :label="0">法定节假日</el-radio>
                <el-radio :label="1">法定调班日</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="record"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="结束日期(包含当天)"
            :label-width="formLabelWidth"
          >
            <el-date-picker
              v-model="overtime"
              type="date"
              placeholder="选择日期(包含当天)"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="daytext"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>

          <el-button type="primary" @click="change">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 止 -->
      <el-button type="primary" @click="delet">删除</el-button>

      <!--       <el-dialog title="提示" :visible.sync="dialogFormVisible2" width="30%" center>-->
      <!--                <span>确定要删除该节假日么？</span>-->
      <!--                <span slot="footer" class="dialog-footer">-->
      <!--                <el-button @click="dialogFormVisible2 = false">取 消</el-button>-->
      <!--                <el-button type="primary" @click="del">确 定</el-button>-->
      <!--                </span>-->
      <!--              </el-dialog>-->
    </span>
    <!-- <my-table :tableColumn="tableColumn" @handleCurrentChange="test" :tableData="tableData"></my-table> -->
    <el-table
      style="margin-top: 10px;"
      ref="singleTable"
      :data="tableData"
      :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
      @row-click="test"
      stripe
      border
      highlight-current-row
      height="450"
    >
      <el-table-column
        prop="name"
        label="名称"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column label="法定节假日" align="center" :resizable="false">
        <template
          slot-scope="scope"
          v-if="
            scope.row.appDutyFestivals && scope.row.appDutyFestivals.length > 0
          "
        >
          <div v-for="item in scope.row.appDutyFestivals" :key="item.id">
            <p v-if="!item.type">
              {{ item.date + "~" + item.overtime }}
            </p>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="放假天数"
        align="center"
        :resizable="false"
        prop="holidayDuration"
      >
      </el-table-column>

      <el-table-column label="法定调班日" align="center" :resizable="false">
        <template
          slot-scope="scope"
          v-if="
            scope.row.appDutyFestivals && scope.row.appDutyFestivals.length > 0
          "
        >
          <div v-for="item in scope.row.appDutyFestivals" :key="item.id">
            <p v-if="item.type">
              {{ item.date + "~" + item.overtime }}
            </p>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="调班天数"
        align="center"
        :resizable="false"
        prop="restDuration"
      >
      </el-table-column>
    </el-table>
    <!-- //分页器 -->
    <el-pagination
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<script>
import myTable from "@/components/tables/tables";

export default {
  name: "holidayManagement",
  data() {
    return {
      search: "",
      year: "",
      // 分页器
      total: null, //数据总数
      pageSize: 10, //每页条数
      currentPage: 1, //当前页数
      pagingSize: true, //分页大小
      dialogFormVisible: false, //add弹窗
      dialogFormVisible1: false, //修改弹窗
      dialogFormVisible2: false, //删除弹窗
      id: "", //事件id
      name: "", //名字
      type: "", // 类型
      record: "", //开始时间
      overtime: "", //结束日期(包含当天)
      daytext: "", //备注
      form: {
        delete: [],
        group: {
          name: "",
          remark: "",
          appDutyFestivals: [],
        },
      },
      holidayAndvacations: [{ time: "", iDuration: 0, type: 0 }],
      restDay: [{ time: "", iDuration: 0, type: 1 }],
      formLabelWidth: "140px",
      tableColumn: [
        // {
        //   prop: "name",
        //   label: "名称",
        // },
        // {
        //   prop: "type",
        //   label: "节假日类型",
        // },
        {
          prop: "date",
          label: "开始日期",
        },
        {
          prop: "overtime",
          label: "结束日期(包含当天)",
        },
        {
          prop: "duration",
          label: "天数",
        },
      ], //表头
      tableData: [], //表格数据
      holidayAndvacationsVisible: false, // 节假日万年历弹窗
      restDayVisible: false, // 休息日万年历弹窗
      idx: 0, // 判断是哪个索引值的万年历
    };
  },
  components: {
    myTable,
  },
  created() {
    // 点击可是窗体关闭万年历
    document.addEventListener("click", (e) => {
      this.restDayVisible = false;
      this.holidayAndvacationsVisible = false;
    });
  },
  methods: {
    /**
     * @description: 万年历选择范围后的方法
     * @author: xuchuangxing
     * @lastUpdateTime : 2021-1-5 17:30
     * @param {*} d 插件打印的日期 格式：["2019", "04", "25"]
     * @param {*} idx 插入的对应时间索引值
     * @param {*} type 插入的对应节假日类型自定义的变量 1.holidayAndvacations 2.restDay
     * @return {*}
     */
    getDate(d, idx, type) {
      // 同时关闭节假日和调休日两种万年历弹窗
      this.restDayVisible = false;
      this.holidayAndvacationsVisible = false;
      this[type][idx].time = [d[0].join("-"), d[d.length - 1].join("-")]; // 重新组装格式成[2019-04-25,2019-04-26]
    },
    // 刚开始数据
    axios() {
      let data = {
        page: 1,
        size: 10,
        name: "",
        year: "",
      };
      //  请求
      this.$api.holidayManagementList(data).then((res) => {
        console.log(res.data.data);
        // 返回的数据赋值给table
        if (res.data.data) this.tableData = res.data.data;
        this.statisticalDays();
        // 把数据赋值给总共的数据总数total
        this.total = res.data.totalElements;
      });
    },
    /**
     * @description: 统计放假天数和调班天数
     * @param {*} // 原始表格数据
     * @return {*}
     */
    statisticalDays() {
      if (this.tableData.length > 0) {
        // 统计
        this.tableData.map((v) => {
          v.holidayDuration = 0;
          v.restDuration = 0;
          if (v.appDutyFestivals.length > 0) {
            v.appDutyFestivals.map((item) => {
              if (!item.type) {
                v.holidayDuration += item.duration;
              } else {
                v.restDuration += item.duration;
              }
            });
          }
          // 将天数为0时不显示
          v.holidayDuration = v.holidayDuration ? v.holidayDuration : "";
          v.restDuration = v.restDuration ? v.restDuration : "";
        });
      }
    },
    searchApi() {
      // 请求发送后台的参数
      // console.log(this.currentPage)
      let data = {
        name: this.search,
        year: this.year,
        page: this.currentPage,
        size: 10,
      };
      // console.log(data);
      this.$api.holidayManagementList(data).then((res) => {
        // 返回的数据赋值给options
        this.tableData = res.data.data;
        this.statisticalDays();
        // 把数据赋值给总共的数据总数tableData1
        this.total = res.data.totalElements;
      });
    },
    //  分页器
    handleCurrentChange() {
      if (this.data == undefined) {
        this.searchApi();
      } else {
        this.axios();
      }
    },
    go() {
      console.log(this.currentPage);
      let data = {
        year: this.year,
        name: this.search,
        page: this.currentPage,
        size: 10,
      };
      console.log(data);
      this.$api.holidayManagementList(data).then((res) => {
        // 返回的数据赋值给options
        this.tableData = res.data.data;
        this.statisticalDays();
        // 把数据赋值给总共的数据总数tableData1
        this.total = res.data.totalElements;
      });
    },
    // 转时间
    formatDateTime(time) {
      // console.log(time)
      var date = time;
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    // 计算结束时间*****************************************************************
    //   endDateTime(time) {
    //   // console.log(time)
    //   var date = time;
    //   var y = date.getFullYear();
    //   var m = date.getMonth() + 1;
    //   m = m < 10 ? ('0' + m) : m;
    //   var d = date.getDate();
    //   d = d < 10 ? ('0' + d) : d;
    //   return y + '-' + m + '-' + d;
    // },
    addHandle() {
      this.dialogFormVisible = true;
      this.clearData();
    },
    //增加
    addOrEdit() {
      if (this.form.group.name == "") {
        this.$message({
          showClose: true,
          message: "名称不能为空哦!",
          type: "error",
        });
        return;
      }
      let holidayAndvacations = []; // 过滤掉时间为空的
      let restDay = [];
      this.holidayAndvacations.map((v) => {
        if (!!v.time && v.time.length > 0) {
          let date1 = new Date(v.time[0]);
          let date2 = new Date(v.time[1]);
          console.log("date1.getTime(): ", date1.getTime());
          console.log("date2.getTime(): ", date2.getTime());
          let date =
            (date2.getTime() - date1.getTime()) /
            (1000 * 60 * 60 * 24); /*时间天数*/
          v.iDuration = date + 1;
          holidayAndvacations.push(v);
        }
      });
      if (holidayAndvacations.length == 0) {
        this.$message.warning("至少添加一个节假日");
        return;
      }
      this.restDay.map((v) => {
        if (!!v.time && v.time.length > 0) {
          let date1 = new Date(v.time[0]);
          let date2 = new Date(v.time[1]);
          let date =
            (date2.getTime() - date1.getTime()) /
            (1000 * 60 * 60 * 24); /*时间天数*/
          v.iDuration = date + 1;
          restDay.push(v);
        }
      });
      // 重新组装成符合后端的数据 节假日和值班日放一块
      this.form.group.appDutyFestivals = holidayAndvacations.concat(restDay);
      this.form.group.appDutyFestivals.map((v) => {
        v.dtDate = v.time[0];
        v.overtime = v.time[1];
        delete v.time;
      });
      console.log("this.form: ", this.form);
      //一条数据的四个内容
      // console.log(9);
      // let begin = this.formatDateTime(this.form.begin);
      // let over = this.formatDateTime(this.form.over);
      // console.log(begin, over);
      // let date1 = new Date(begin);
      // let date2 = new Date(over);
      // let date =
      //   (date2.getTime() - date1.getTime()) /
      //   (1000 * 60 * 60 * 24); /*时间天数*/
      // console.log(this.form.region);
      // console.log(date);
      // console.log(over);
      // console.log(this.form.text);
      // this.dialogFormVisible = false;
      // let data = {
      //   data: {
      //     name: this.form.region,
      //     overtime: over,
      //     date: begin,
      //     remark: this.form.text,
      //     duration: date + 1, //节日长度（日）
      //     type: this.form.type,
      //   },
      // };
      this.$api.holidayManagementaddList({ data: this.form }).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
          });
          return;
        }
        this.dialogFormVisible = false;
        this.go();
      });
    },
    clearData() {
      this.form.group.name = "";
      this.form.group.id = "";
      this.form.group.delete = [];
      this.holidayAndvacations = [{ time: "", duration: 0, type: 0 }];
      this.restDay = [{ time: "", duration: 0, type: 1 }];
      this.form.group.remark = "";
    },
    timechange(time) {
      var d = new Date(time);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = d.getDay();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    test(row) {
      console.log(row);
      let holidayAndvacations = [];
      let restDay = [];
      this.form.group.id = row.id;
      this.form.group.name = row.name;
      this.form.group.remark = row.remark;
      if (row.appDutyFestivals.length > 0) {
        row.appDutyFestivals.map((v) => {
          if (v.type == 0) {
            holidayAndvacations.push({
              iId: v.id,
              type: v.type,
              iDuration: v.duration,
              time: [v.date, v.overtime],
            }); // 组装成符合日期控件显示格式
          } else {
            restDay.push({
              iId: v.id,
              type: v.type,
              iDuration: v.duration,
              time: [v.date, v.overtime],
            });
          }
        });
        // 有数据才赋值，没数据初始化数据
        if (holidayAndvacations.length > 0) {
          this.holidayAndvacations = holidayAndvacations;
        } else {
          this.holidayAndvacations = [{ time: "", iDuration: 0, type: 0 }];
        }
        if (restDay.length > 0) {
          this.restDay = restDay;
        } else {
          this.restDay = [{ time: "", iDuration: 0, type: 0 }];
        }
      }
    },
    openchange() {
      if (this.form.group.id) {
        this.dialogFormVisible = true;
      } else {
        this.$message({
          type: "info",
          message: "请选择一个节假日",
        });
      }
    },
    // 修改
    change() {
      console.log(this.timechange(this.overtime));
      let overtime = this.timechange(this.overtime);
      console.log(this.record, overtime);
      console.log(this.form.region);
      if (this.name == "" || this.record == "" || this.overtime == "") {
        this.$message({
          showClose: true,
          message: "名称和时间都不能为空哦!",
          type: "error",
        });
      }
      // else if(this.record>overtime) {
      //     console.log(111111111111)
      //     this.$message({
      //         showClose: true,
      //         message: '开始时间必须小于结束时间哦！',
      //         type: 'error'
      //     });
      // }
      else {
        console.log(this.overtime, this.record);
        // let over = this.timechange(this.overtime)
        // let begin = this.timechange(this.record)
        // console.log(hour)
        let date1 = new Date(this.record);
        // console.log(this.record)
        let date2 = new Date(this.overtime);
        console.log(date1, date2);
        let time = Math.ceil(
          (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
        ); /*时间天数*/
        console.log(time);
        if (time >= 0) {
          console.log(this.overtime, this.record);
          let data = {
            data: {
              id: this.id,
              name: this.name,
              date: this.record,
              overtime: this.overtime,
              remark: this.daytext,
              type: this.type,
              duration: time + 1, //节日长度（日）
            },
          };
          console.log("data: ", data);
          this.dialogFormVisible1 = false;
          this.$api.holidayManagementchange(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
              });
              return;
            }
            this.go();
          });
        } else {
          this.$message({
            showClose: true,
            message: "开始时间必须小于结束时间哦！",
            type: "error",
          });
        }
      }
    },
    delet() {
      console.log(this.id);
      if (this.form.group.id) {
        this.$confirm("确认删除该节日, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let data = {
              id: this.form.group.id,
              // dutyLogId: this.bigid,	//duty_log 主键id
            };
            this.$api.holidayManagementdelete(data).then((res) => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              } else {
                this.$message({
                  type: "success",
                  message: "已删除",
                });
              }
              this.go();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message({
          type: "info",
          message: "请选择一个节假日",
        });
      }
    },
    addHolidayAndvacations() {
      this.holidayAndvacations.push({ time: "", iDuration: 0, type: 0 });
    },
    delHolidayAndvacations(item, idx) {
      // 判断是修改 往delete加数据
      if (!!item.iId) {
        this.form.delete.push(item.iId);
      }
      this.holidayAndvacations.splice(idx, 1);
    },
    addRestDay() {
      this.restDay.push({ time: "", iDuration: 0, type: 1 });
    },
    delRestDay(item, idx) {
      if (!!item.iId) {
        this.form.delete.push(item.iId);
      }
      this.restDay.splice(idx, 1);
    },
  },
  mounted() {
    this.axios();
  },
};
</script>

<style scoped>
.out {
  /* padding: 0 30px 0 30px; */
  text-align: left;
}
</style>
<style lang="scss" scoped>
.legalDate{
    // 万年历样式
    /deep/ ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    /deep/ p {
        margin: 0;
    }
    // 去除万年历星期上下边距
    /deep/ .vue-better-calendar .calendar-body .calendar-weeks ul .weekday {
        padding: 0 15px;
    }
    // 去除万年历分页边距
    /deep/ .vue-better-calendar .calendar-header .calendar-ctl {
        padding: 0;
    }
    // 万年历月份根据高度垂直居中
    /deep/
    .vue-better-calendar
    .calendar-header
    .calendar-ctl
    .calendar-ctl-month
    .month
    .select-month-panel
    .item {
        line-height: 20px;
    }
}

</style>
