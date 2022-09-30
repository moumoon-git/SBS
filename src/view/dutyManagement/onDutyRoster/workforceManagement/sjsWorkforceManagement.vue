<template>
  <div>
    <el-row>
      <el-col :span="17" style="padding-right: 10px;">
        <nav-button
          @autoScheduling="monthAutoScheduling"
          @weekDuling="weekAutoScheduling"
          @Reset="handleReset"
          @setup="handleSetup"
          @changeMonth="changeMonth"
          @lastMonth="lastMonth"
        ></nav-button>
        <!--短信通知-->
        <el-dialog
          :close-on-click-modal="false"
          title="短信通知"
          width="50%"
          :visible.sync="msgDialog"
        >
          <div class="msg" v-for="(item, index) in msgClass" :key="index">
            <p style="text-align: left; width: 600px; display: inline-block">
              {{ item.className }}:{{ item.day }}
              <span>{{ item.personName }}</span>
            </p>
            <el-input
              class="el_input"
              type="textarea"
              placeholder="请输入内容"
              v-model="item.remark"
            ></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="msgDialog = false">取 消</el-button>
            <el-button type="primary" @click="handleSendMsg">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 选择人员弹窗 -->
        <selectMansDialog
          v-if="outerVisible"
          ref="selectDialog"
          selectTitle="选择联系人"
          :selectData="outerVisible"
          @close="outerVisible = false"
          @closeDialog="outerVisible = false"
          @addMans="addPerson"
        ></selectMansDialog>
        <div class="contentStyle">
          <el-header style="height: 52px; line-height: 52px; text-align: left">
            <table-button-duty
              :msg="month"
              @axios="getList"
              @Refresh="refresh"
              @monthlyList="exportMonthlyTable"
              @importTemplate="importTemplate"
              @notification="handleShowMsg"
              @saveScheduling="saveScheduling"
              @exportDuty="exportDuty"
              @importFileEmit="importFileFun"
              @importClassFunEmit="importClassFun"
            ></table-button-duty>
          </el-header>
          <el-main style="padding: 12px 20px">
            <!--表格-->
            <div class="tableContainer">
              <el-table
                class="table-class"
                :data="tableData"
                border
                @cell-dblclick="handleClickCell"
                height="100%"
                :header-cell-style="{
                  'background-color': '#F0F5FF',
                  color: '#333333',
                  'font-size': '16px',
                  'font-weight': 'bold'
                }"
              >
                <el-table-column
                  v-for="(item, rowIndex) in tableColumn"
                  :key="item.id"
                  :label="item.label"
                  :prop="item.prop"
                  align="center"
                  header-align="center"
                  :width="item.prop === 'day' ? '110px' : ''"
                >
                  <!-- <template slot-scope="scope">
                  <div
                    v-if="item.children && item.children.length > 1"
                    v-for="child in item.children"
                    :key="child.id"
                    :label="`${child.label}\n\r${child.time}`"
                    :prop="child.prop"
                    align="center"
                    header-align="center"
                  >
                      <div
                        class="person-container"
                        v-if="scope.row[child.prop] && scope.row[child.prop].length > 0"
                      >
                        <span
                          class="person-item"
                          v-for="(person, personIndex) in scope.row[child.prop]"
                          :key="personIndex"
                          @click.stop="handleClickPerson(child, scope.row[child.prop][personIndex], personIndex, child.prop)"
                          :style="personActive(child, scope.row[child.prop][personIndex], personIndex)"
                        >
                          <span>{{ person.dutyContactorName }}</span>
                          <i
                            class="el-icon-phone-outline"
                            v-if="person.dutyContactorMobile"
                            @click.stop="handleClickPhone(person.dutyContactorMobile)"
                          ></i>
                        </span>

                        <i
                          class="el-icon-close delPerson"
                          @click.stop="personDelete(child.prop,scope.row.day)"
                        ></i>
                      </div>
                  </div>
                    </template> -->
                  <template slot-scope="scope">
                    <div
                      v-if="item.prop === 'day'"
                      class="date"
                      style="
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        cursor: pointer;
                        text-align: center;
                        font-size: 14px;
                        font-weight: bold;
                      "
                      :style="{
                        border: dayActive(scope.row[item.prop]),
                        color: colorStyle(scope.row, rowIndex)
                      }"
                      @click.stop="handleClickDay(scope.row)"
                    >
                      <div style="height: 23px">
                        {{ scope.row[item.prop] }}
                      </div>
                      <div style="height: 62px">
                        {{ scope.row.week }}
                      </div>
                    </div>

                    <template
                      v-if="
                        item.prop != 'day' &&
                          scope.row &&
                          scope.row[item.prop] &&
                          scope.row[item.prop].length > 0
                      "
                    >
                      <div
                        v-if="
                          scope.row[item.prop].length <= 1 &&
                            !scope.row[item.prop][0].name
                        "
                        :class="{
                          selectFrequency:
                            frequencyId == item.id &&
                            currentDate == scope.row['day']
                        }"
                        :style="frequencyStyle(scope.row.height)"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        "
                        @click="handleAdd(item.id, scope.row, item.prop, 0)"
                      >
                        <div class="person-container">
                          <span
                            class="person-item"
                            v-for="(person, personIndex) in scope.row[
                              item.prop
                            ][0].dutyList"
                            :key="personIndex"
                            @click.stop="
                              handleClickPerson(
                                scope.row[item.prop][0],
                                person,
                                personIndex,
                                0,
                                item.prop
                              )
                            "
                            :style="
                              personActive(
                                scope.row[item.prop][0],
                                person,
                                personIndex
                              )
                            "
                          >
                            <span>{{ person.dutyContactorName }}</span>
                            <i
                              class="el-icon-phone-outline callPhone"
                              v-if="person.dutyContactorMobile"
                              @click.stop="
                                handleClickPhone(person.dutyContactorMobile)
                              "
                            ></i>
                          </span>
                        </div>
                        <i
                          class="el-icon-close delPerson"
                          @click.stop="
                            personDelete(item.prop, scope.row.day, 0)
                          "
                          v-if="
                            scope.row[item.prop][0].dutyList.length > 0 &&
                              frequencyId == item.id &&
                              currentDate == scope.row['day']
                          "
                        ></i>
                        <span
                          v-if="scope.row[item.prop][0].dutyList.length == 0"
                          >暂无数据</span
                        >
                      </div>

                      <!-- 合并排班 -->
                      <div
                        class="frequency"
                        v-else
                        :style="frequencyStyle(scope.row.height)"
                      >
                        <div
                          class="frequency-container"
                          :style="{
                            height: 100 / scope.row[item.prop].length + '%'
                          }"
                          v-for="(child, frequencyIndex) in scope.row[
                            item.prop
                          ]"
                          :key="child.dutyClassesTimeId"
                          @click="
                            handleAdd(
                              child.dutyClassesTimeId,
                              scope.row,
                              item.prop,
                              frequencyIndex
                            )
                          "
                          :class="{
                            selectFrequency:
                              frequencyId == child.dutyClassesTimeId &&
                              currentDate == scope.row['day']
                          }"
                        >
                          <div
                            class="frequency-name"
                            :class="
                              frequencyIndex == scope.row[item.prop].length - 1
                                ? 'borderStyle'
                                : ''
                            "
                          >
                            <div>{{ child.name }}</div>
                          </div>
                          <div
                            class="frequency-person"
                            :class="{
                              borderStyle:
                                frequencyIndex ==
                                scope.row[item.prop].length - 1,
                              centerStyle: child.dutyList.length == 1
                            }"
                          >
                            <span
                              class="person-item"
                              v-for="(person, personIndex) in child.dutyList"
                              :key="personIndex"
                              @click.stop="
                                handleClickPerson(
                                  child,
                                  person,
                                  personIndex,
                                  frequencyIndex,
                                  item.prop
                                )
                              "
                              :style="personActive(child, person, personIndex)"
                            >
                              <span>{{ person.dutyContactorName }}</span>
                              <i
                                class="el-icon-phone-outline callPhone"
                                v-if="person.dutyContactorMobile"
                                @click.stop="
                                  handleClickPhone(person.dutyContactorMobile)
                                "
                              ></i>
                            </span>

                            <i
                              class="el-icon-close delPerson"
                              @click.stop="
                                personDelete(
                                  item.prop,
                                  scope.row.day,
                                  frequencyIndex
                                )
                              "
                              v-if="
                                child.dutyList &&
                                  child.dutyList.length > 0 &&
                                  frequencyId == child.dutyClassesTimeId &&
                                  currentDate == scope.row['day']
                              "
                            ></i>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="contactsPanel">
          <el-row>
            <div class="beonDuty">
              <span>值班人员快速替换</span>
            </div>
            <div style="color: #999; font-size: 15px; text-align: center;">
              提示：请单击人员替换或单击时段班次名添加人员
            </div>
            <div
              v-for="(item, index) in dataName"
              :key="item.classesId"
              style="padding: 5px; margin-botton: 10px;"
            >
              <!-- v-if="!!item.peoples && item.peoples.length > 0" -->
              <template>
                <div style="display: flex">
                  <div
                    style="
                      border: 1px solid #ccc;
                      height: 28px;
                      line-height: 26px;
                      text-align: center;
                      font-size: 14px;
                      color: #666;
                      width: 91%;
                    "
                  >
                    {{ item.classesName }}
                  </div>
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="showAddPerson(index)"
                    style="height:28px !important;"
                  ></el-button>
                </div>

                <tag
                  class="tag"
                  :dataName="item.peoples"
                  :selectIds="clickPeoplesIds"
                  :idx="index"
                  @addman="changePerson"
                  @handleClose="handleClose"
                  style="
                    padding: 0px 15px 15px 0;
                    border: 1px solid #ccc;
                    border-top: none;
                  "
                ></tag>
              </template>
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 按日期导出弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="determineVisible"
      width="450px"
      :before-close="exportTodaysDutyClose"
    >
      <div style="display: flex; align-items: center">
        <span> 时间段：</span>
        <el-date-picker
          v-model="timeSlot"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="determineVisible = false">取 消</el-button>
        <el-button type="primary" @click="determineExportTodaysDuty"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog";
import tableButtonDuty from "@/view/dutyManagement/onDutyRoster/workforceManagement/deskButton/tableButtonDuty";
import navButton from "@/view/dutyManagement/onDutyRoster/workforceManagement/deskButton/navButton";
import tableModule from "@/components/tables/wzmtable";
import tag from "@/components/tag/tag";
import mixin from "@/view/integratedCommunication/icpPhone/icpPhonePage/mixin";
import { getDutyList, getPeople } from "@/assets/interface/interface";
import $ from "jquery";
import axios from "axios";
import exportFile from '@/view/tool/exportFile' // 下载文件
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js'
const downLoadFile = require('@/utils/downloadFile.js').default;

export default {
  name: "workforceManagement",
  mixins: [mixin, mixin2],
  components: {
    navButton,
    tableButtonDuty,
    tableModule,
    tag,
    selectMansDialog
  },
  props: ["save"],
  data() {
    return {
      isSave: false,
      rawTableData: [], // 列表原数据
      editTableData: [], // 编辑过的列表原数据
      selectRow: "",
      selectColumn: "",
      selectItem: {}, // 选中的人员
      selectTable: {}, // 选中的表格
      msgDialog: false,
      outerVisible: false, //弹窗选择人员
      outerType: "", // 弹窗选择人员类型（新增表格的（table）还是新增替换人员的（tag））
      month: "",
      type: "month", // 判断是月自动排班还是周自动排班
      weekAutoDate: "", // 周自动排班的选中日期
      isShowWeekAutoDate: false, // 用于隐藏周自动排班的选中日期的框框（因为weekAutoDate不能置空）
      tableColumn: [], //表头
      tableData: [], //表格数据
      dataName: [],
      cellClickData: [],
      changeTableData: [],
      msgClass: [],
      initMonth: "", // 选中的月份 GMT格式
      frequencyId: "", // 选中的班次Id
      currentDate: "", // 选中的日期
      editStyle: {
        height: "100%",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center"
      },
      defaultStyle: {
        height: "55px"
      },
      rowdata: [], //选择行数据
      checkShiftIndex: "", // 右边添加班次的班次索引值
      determineVisible: false, // 按日期导出弹窗
      timeSlot: "", // 按日期导出 时间段
      events: [],
      dateOrUnit: "", // 判断是按日期导出还是单位
      isPlatformRoot: true, // 是否当前平台
      platformId: 0, // 当前平台id
      clickPeoples:[], // 班次点击的人员数据
      clickPeoplesIds:[], //班次点击的人员id数据
    };
  },
  computed: {
    /**
     * @description：  设置当前行的边框
     * @author：       xuchuangxing
     * @lastEditor   ：xuchuangxing
     * @updateTime   ：20201020 10:16
     * @param {}
     * @return {}
     */
    dayActive() {
      return function(day) {
        if (day === this.weekAutoDate && this.isShowWeekAutoDate) {
          return "2px solid rgba(144,147,153,.3)";
        } else {
          return "none";
        }
      };
    },
    /**
     * @description：  获取当前行的高度-让所有列都等高
     * @author：       xuchuangxing
     * @lastEditor   ：xuchuangxing
     * @updateTime   ：20201015 20:59
     * @param {}
     * @return {}
     */
    personActive() {
      return function(parentItem, tableItem, index) {
        // console.log('tableItem: ', tableItem);
        let selectItem = this.selectItem;
        let flag =
          // this.compareObject(parentItem, selectItem.parentItem) &&
          // 判断是哪个班次或者分段班次名
          parentItem.dutyClassesTimeId ==
            (selectItem.parentItem
              ? selectItem.parentItem.dutyClassesTimeId
              : "") &&
          tableItem.date === selectItem.date &&
          index === selectItem.personIndex;
        if (flag) {
          return "border: 2px dashed rgba(144,147,153,.3);";
        } else {
          return "";
        }
      };
    },
    /**
     * @description：  获取当前行的高度-让所有列都等高
     * @author：       xuchuangxing
     * @lastEditor   ：xuchuangxing
     * @updateTime   ：20201020 10:16
     * @param {colData} : 当前列数据
     * @param {index}   ：改变的日期索引值
     * @return {}
     */
    frequencyStyle() {
      return function(height) {
        // console.log("height*55/colData.length + px: ", height * 55 + "px");
        return "height:" + (height == 1 ? "85px" : height * 55 + "px");
      };
    },
    /**
     * @description：     获取当前行的值班日类型
     * @author：          xuchuangxing
     * @lastEditor      ：xuchuangxing
     * @updateTime      ：20201020 10:16
     * @param {rowData} : 当前行数据
     * @param {index}   ：改变的日期索引值
     * @return {}
     */
    colorStyle() {
      return function(rowData, rowIndex) {
        // 获取当前行对象所有key
        let frequencyData = [];
        Object.keys(rowData).map(v => {
          if (v.indexOf("parent") > -1) {
            frequencyData.push(rowData[v]);
          }
        });
        // 循环拿到有班次的数据的type
        for (let i = 0; i < frequencyData.length; i++) {
          if (frequencyData[i].length > 0) {
            console.log("v: ", frequencyData[i][0].type);
            return frequencyData[i][0].type == 1 ? "#333" : "#FF3333";
          }
        }
      };
    }
  },
  watch: {
    tableData: {
      handler: function(newVal, oldVal) {
        console.log("监听表格数据：", newVal, oldVal);
        if (oldVal.length !== 0 && newVal !== oldVal) {
          console.log("更新了哦");
          if (!this.isSave) {
            this.$emit("updateData", true);
          }
        }
      }
    },
    save: {
      handler: function(newVal, oldVal) {
        console.log("是否更新：", newVal, oldVal);
        if (newVal) {
          console.log("确定保存");
          this.saveScheduling();
        }
      }
    }
  },
  created() {
    this.month = new Date().formatDate("yyyy-MM");
    this.initMonth = new Date();
    this.getRightList();
    this.getList();
  },
  methods: {
    /**
     * @param
     * @description 导出今日排班数据，单击后下载Excel表
     * @author hexinting
     * @lastEditors hexinting
     * @lastEditTime 2020年12月20日16:06:36
     */
    exportDuty(type) {
      this.dateOrUnit = type;
      this.timeSlot = "";
      this.determineVisible = true;
    },
    determineExportTodaysDuty(type) {
      if (this.timeSlot.length == 0) {
        this.$message.warning("请选择导出日期");
        return;
      }
      let startTime = this.timeSlot[0];
      let endTime = this.timeSlot[1];
      // axios({
      //   method: "get",
      //   url: `${window.g.ApiUrl}/eos/duty/subordinate/getAllByToDayExcel?startTime=${startTime}&endTime=${endTime}`,
      //   responseType: "arraybuffer",
      // })
      //   .then((res) => {
      //     this.determineVisible = false;
      //     console.log("res: ", res);
      //     var elink = document.createElement("a");
      //     elink.download = "石景山" + "值班表.xls";
      //     elink.style.display = "none";
      //     var blob = new Blob([res.data], {
      //       type: "application/vnd.ms-excel application/x-excel",
      //     });

      //     elink.href = URL.createObjectURL(blob);
      //     document.body.appendChild(elink);
      //     elink.click();
      //     document.body.removeChild(elink);
      //   })
      //   .catch(() => {});
      this.determineVisible = false;
      var url = ''
      if (this.dateOrUnit == "date") {
          url = '/eos/duty/subordinate/getAllByToDayExcel'
      } else if (this.dateOrUnit == "unit") {
          url = '/eos/duty/subordinate/getAllByToDayZip'
      }
      exportFile({
        url:window.g.ApiUrl + url,
        method:'get',
        params:{startTime,endTime},
        token:this.$cookie.get('token')
      })
    },
    exportTodaysDutyClose() {
      this.determineVisible = false;
    },
    /**
     * @param
     * @description
     * @author yangqingdong
     * @lastEditors yangqingdong
     * @lastEditTime 2020/9/8 11:15
     */
    compareObject(origin, target) {
      if (typeof target !== "object") {
        //target不是对象/数组
        return origin === target; //直接返回全等的比较结果
      }

      if (typeof origin !== "object") {
        //origin不是对象/数组
        return false; //直接返回false
      }
      for (let key of Object.keys(target)) {
        //遍历target的所有自身属性的key
        if (!this.compareObject(origin[key], target[key])) {
          //递归比较key对应的value，
          //value不等，则两对象不等，结束循环，退出函数，返回false
          return false;
        }
      }
      //遍历结束，所有value都深度比较相等，则两对象相等
      return true;
    },
    /**
     * @description:   初始化tableData
     * @author:        xuchuangxing
     * @lastEditor   ：xuchuangxing
     * @updateTime   ：20201015 20:59
     * @param {}
     * @return {}
     */
    initTableData() {
      let tableData = [];
      let today = this.initMonth;
      let oneDay = 24 * 60 * 60 * 1000;
      if (this.type === "month") {
        // 这个月总共有多少天
        let totalDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        for (let i = 1; i <= totalDay; i++) {
          let obj = {
            day: new Date(today.getFullYear(), today.getMonth(), i).formatDate(
              "yyyy-MM-dd"
            ),
            // 添加星期
            week:
              "星期" +
              "日一二三四五六".charAt(
                new Date(today.getFullYear(), today.getMonth(), i).getDay()
              )
          };
          tableData.push(obj);
        }
      } else if (this.type === "week") {
        // this.month（是一个日期）所在的那一周
        let dayOfWeek = new Date(this.weekAutoDate).getDay();
        // 从星期一开始算第一天
        let weekStart = new Date(
          +new Date(this.weekAutoDate) - (dayOfWeek - 1) * oneDay
        );
        for (let i = 0; i <= 6; i++) {
          let obj = {
            day: new Date(+weekStart + i * oneDay).formatDate("yyyy-MM-dd"),
            // 添加星期
            week:
              "星期" +
              "日一二三四五六".charAt(
                new Date(+weekStart + i * oneDay).getDay()
              )
          };
          tableData.push(obj);
        }
      }
      return tableData;
    },
    /**
     * @description:   重组列表
     * @author:        xuchuangxing
     * @lastEditor   ：xuchuangxing
     * @updateTime   ：20201015 20:59
     * @param {list} ：初始化所有的日期列
     * @return {}
     */
    initTable(list) {
      console.log("重组列表");
      let tableColumn = [];
      let item = {
        id: "day",
        prop: "day",
        label: "日期"
      };
      tableColumn.push(item);
      console.log("重组列表tableColumn: ", tableColumn);
      let tableData = [];
      console.log("重组列表初始：", tableData);
      tableData = this.initTableData();
      console.log("重组列表之后：", tableData);
      console.log("重组列表之后的list：", list);
      list.forEach((m, i) => {
        // 拼凑列表头部信息栏
        let parentObj = {
          id: `parent${i}`,
          prop: `parent${i}`,
          label: `${m.appSjsDutyGroup.name}`,

          children: []
        };
        tableColumn.push(parentObj);
        // 拼凑列表数据
        tableData.forEach(n => {
          m.data.forEach((o, j) => {
            let personList =
              +new Date(o.date) === +new Date(n.day) ? o.data : "";

            // 为了后续方便获取需要添加的班次，分段名的索引值通过dom中获取
            if (personList) {
              if (o.data) {
                if (!n[`parent${i}`]) {
                  n[`parent${i}`] = [];
                }
                if (!n.height) {
                  n.height = 0; // 为了动态显示班次高度
                }
                n[`parent${i}`] = n[`parent${i}`].concat(personList);
                if (n.height < personList.length) {
                  n.height = personList.length;
                }
              }
            }
          });
        });
      });
      this.tableColumn = list && list.length > 0 ? tableColumn : [];
      this.tableData = list && list.length > 0 ? tableData : [];
    },
    // 获取列表数据
    async getList() {
      console.log("获取列表数据");
      try {
        this.type = "month";
        let params = { date: this.month };
        console.log("获取列表数据", params);
        let { data } = await this.$api.getDutyList(params);
        console.log("获取列表数据", { data });
        let list = data || [];
        console.log("获取列表数据", list);
        this.$set(this, "rawTableData", list);
        console.log("获取列表数据raw", list);
        this.$set(this, "editTableData", list);
        console.log("获取列表数据edit", list);
        this.initTable(list);
        console.log("获取列表数据init", list);
      } catch (e) {
        console.log("获取列表数据失败");
      }
    },
    // 获取自动排班的列表数据
    async getAutomaticList() {
      console.log("===========获取自动排班列表数据=======================");
      try {
        let date = this.type === "month" ? this.month : this.weekAutoDate;
        console.log("date: ", date);
        let isMonth = this.type === "month" ? "0" : "1";
        // console.log('isMonth: ', isMonth)
        let params = { date, isMonth };
        // console.log(params)
        let { data } = await this.$api.automaticList(params);
        console.log("data 长度: ", data.length);
        let list = data || [];
        // console.log('list: ', list)
        this.$set(this, "rawTableData", list);
        //console.log('rawTableData: ', list);
        this.$set(this, "editTableData", list);
        //console.log('editTableData: ', list)
        this.initTable(list);
        console.log("initTable之后: ", list);
        this.$message.success("自动排班成功");
        // 隐藏周排班选中的日期选中的框框
        this.isShowWeekAutoDate = false;
        // this.weekAutoDate = '';
      } catch (e) {
        console.log("自动排班: ", e);
      }
      console.log(
        "===========获取自动排班列表数据 执行完毕======================="
      );
    },
    /**
     * @description: 清除表单样式
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {type} 可传字符串或者数组；blue: 蓝色背景；dashed：人员虚线框；solid：日期实线框
     * @return {}
     */
    clearTableStyle(types) {
      console.log("清除表单样式");
      let flag = type => {
        if (Array.isArray(types)) {
          return types.includes(type);
        } else {
          return types === type;
        }
      };
      // 去除选钟的需要添加或者替换的分段班次名或班次样式
      if (flag("blue")) {
        this.frequencyId = "";
        this.currentDate = "";
        this.selectRow = "";
      }
      if (flag("dashed")) {
        this.selectItem = {};
      }
      if (flag("solid")) {
        this.isShowWeekAutoDate = false;
        this.rowdata = "";
      }
    },
    /**
     * @description: 点击表格日期-获取当前行数据
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201018 20:54
     * @param  {row}     ：短信通知要发送的数据
     * @return {}
     */
    handleClickDay(row) {
      this.rowdata = row;
      this.clearTableStyle(["blue", "dashed"]);
      if (this.weekAutoDate === row.day) {
        this.isShowWeekAutoDate = !this.isShowWeekAutoDate;
      } else {
        this.isShowWeekAutoDate = true;
      }
      // this.isShowWeekAutoDate = !(this.weekAutoDate === day);
      this.weekAutoDate = row.day;
    },
    /**
     * @description: 点击表格值班人员
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param  1.parentItem     ：选择替换或者添加的人
     *         2.tableItem      ：属于的班次-获取当前班次数据
     *         3.personIndex    ：得到的分段班次索引值
     *         4.frequencyIndex ：当前行钟-分段班次名索引值-方便后续追踪要添加或替换的对象
     *         5.prop           ：班次名属性-方便获取要添加或替换的班次索引值
     * @return {}
     */
    handleClickPerson(
      parentItem,
      tableItem,
      personIndex,
      frequencyIndex,
      prop
    ) {
      this.clearTableStyle(["blue", "solid"]);
      let obj = {};
      let item = this.selectItem;
      if (
        !(
          // this.compareObject(item.parentItem, parentItem) &&
          (
            parentItem.dutyClassesTimeId ==
              (item.parentItem ? item.parentItem.dutyClassesTimeId : "") && //判断是哪个分段班次名
            tableItem.date === item.date &&
            personIndex === item.personIndex
          )
        )
      ) {
        obj = {
          parentItem,
          prop,
          personIndex,
          frequencyIndex,
          date: tableItem.date
        };
      }
      this.$set(this, "selectItem", obj);
      console.log(this.selectItem);
    },
    // 拨打电话
    handleClickPhone(phone) {
      this.clearTableStyle(["blue", "dashed", "solid"]);
      // this.talkCall({ number: phone });
      this.makePhoneCall(phone, null, null, null);
    },
    // 双击选中单元格
    handleClickCell(row, column) {
      console.log("row: ", row);
      console.log("column: ", column);
      if (column.label !== "日期") {
        this.clearTableStyle(["dashed", "solid"]);
        let day = row.day;
        let prop = column.property;
        if (this.selectRow.day === day && this.selectColumn.property === prop) {
          this.selectRow = "";
          this.selectColumn = "";
        } else {
          this.selectRow = row;
          this.selectColumn = column;
        }
      } else {
        this.$message.error("请双击除日期外的单元格进行修改!");
      }
    },
    // 获取右侧值班人员快速替换数据
    async getRightList() {
      try {
        let { data } = await this.$api.getPeople({ date: this.month });
        this.dataName = data;
      } catch (e) {
        console.log("getRightList", e);
      }
    },
    // 点击右侧值班人员关闭按钮触发
    handleClose(tag, i, idx) {
      this.dataName[idx].peoples.splice(i, 1);
    },
    /**
     * @description: 点击右侧值班人员触发
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {personObj} ：选择替换或者添加的人
     * @return {}
     */
    changePerson(personObj) {
      // console.log(personObj,(this.selectItem.prop),(this.selectRow));
      // console.log(this.selectRow)
      // console.log(this.selectColumn)
      // console.log("personObj: ", personObj);
      if (this.selectItem.prop) {
        let resultObj = this.suspendRule(
          personObj,
          this.selectItem.prop,
          this.selectItem.frequencyIndex,
          this.selectItem.date,
          "替换"
        ); // 判断挂起规则
        if (resultObj) {
          let { startIndex, lastIndex, checkList } = resultObj;
          // 迁移之前的功能没有做数据筛查
          let alertFlag = true
          console.log("lastIndex: ", lastIndex);
          this.editTableData.forEach((m, i) => {
            if (i == startIndex) {
              let item = []; // 当前选中的班次
              let currentIndex = "";
              m.data.map((v, index) => {
                if (v.date == this.selectItem.date) {
                  item = v.data;
                  currentIndex = index;
                }
              });
              let dutyList =
                item[lastIndex] && item[lastIndex].dutyList
                  ? item[lastIndex].dutyList
                  : [];
              // 迁移之前的功能没有做数据筛查
              let typeArr = dutyList.filter(r=>r.dutyContactorName === checkList[0].dutyContactorName)
              if (typeArr.length!=0) {
                this.$message.error(`该人员已存在此班次`);
                alertFlag = false
                return
              }
              dutyList.splice(this.selectItem.personIndex, 1, checkList[0]);
              this.$set(m.data[currentIndex].data[lastIndex], "dutyList", [
                ...dutyList
              ]);
            }
          });
          // 迁移之前的功能没有做数据筛查
          if (alertFlag) {
            this.successAddOrReplace("替换"); // 成功替换后操作
          }
        }
      } else if (this.selectRow) {
        let resultObj = this.suspendRule(
          personObj,
          this.selectColumn.property,
          this.selectColumn.frequencyIndex,
          this.selectRow.day,
          "添加"
        ); // 判断挂起规则
        if (resultObj) {
          let { startIndex, lastIndex, checkList, item } = resultObj;
          let currentIndex = this.getCurrentDateIndex(this.selectRow.day);
          // console.log(checkList[0]);
          // 判断是否存在已存在班次中
          if (
            this.editTableData[startIndex].data[currentIndex].data[lastIndex]
              .dutyList.length > 0
          ) {
            let existIndex = this.editTableData[startIndex].data[
              currentIndex
            ].data[lastIndex].dutyList.findIndex(
              v => v.dutyContactorId == checkList[0].dutyContactorId
            );
            console.log("existIndex: ", existIndex);
            if (existIndex == -1) {
              this.editTableData[startIndex].data[currentIndex].data[
                lastIndex
              ].dutyList.push(checkList[0]); //执行添加逻辑
            } else {
              this.$message.warning("该成员已存在班次中");
              return;
            }
          } else {
            this.editTableData[startIndex].data[currentIndex].data[
              lastIndex
            ].dutyList.push(checkList[0]); //执行添加逻辑
          }
          this.successAddOrReplace("添加"); // 成功添加后操作
        }
      } else {
        this.$message.error("请单击人员替换或单击时段班次名新增人员");
      }
    },
    /**
     * @description: 获取要修改的哪天的数据索引
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {date} ：当前行日期，用于过滤是哪天的班次
     * @return {currentIndex} ：当前行的数据索引值
     */
    getCurrentDateIndex(date) {
      let currentIndex = "";
      this.editTableData.forEach((m, i) => {
        m.data.map((v, index) => {
          if (v.date == date) {
            currentIndex = index;
          }
        });
      });
      return currentIndex;
    },
    /**
     * @description: 挂起规则
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param  1.personObj   ：选择替换或者添加的人
     *         2.prop        ：属于的班次-获取当前班次数据
     *         3.lastIndex   ：得到的分段班次索引值
     *         4.date        ：当前行日期
     *         5.type        ：成功替换或者添加提示语
     * @return 1.startIndex  ：属于的班次索引值-方便追踪要添加或替换的对象
     *         2.lastIndex   ：获取的分段班次索引值
     *         3.checkList   ：重组替换或者添加的人的数据
     *         4.item        ：需要添加或替换的对象
     */
    suspendRule(personObj, prop, lastIndex, date, type) {
      // console.log('prop: ', prop);
      let startIndex = prop.replace("parent", "");
      console.log("startIndex: ", startIndex);
      let item = []; // 当前选中的班次
      if (this.editTableData.length > 0) {
        if (this.editTableData[startIndex].data.length > 0) {
          this.editTableData[startIndex].data.map(v => {
            if (v.data == date) {
              item = v[lastIndex];
            }
          });
        }
      }

      // 判断日期是否是过去的
      console.log("new Date(date): ", new Date(date));
      console.log("new Date()<=new Date(date): ", new Date() < new Date(date));
      if (
        new Date().formatDate("yyyy-MM-dd") >
        new Date(date).formatDate("yyyy-MM-dd")
      ) {
        this.$message.error("请选择当天及之后的日期");
        return;
      }

      // 表格已存在的人员
      console.log("this.tableData: ", this.tableData);
      let selectRow = this.tableData.find(m => m.day === date);
      let cellList = selectRow[prop] ? selectRow[prop] : [];
      // 选中的人员
      let checkList = [];
      [personObj].forEach(m => {
        let currentItem = cellList.find(
          n => n.dutyContactorId === m.contactorId
        );
        // 过滤已存在的人员
        if (!currentItem) {
          let obj = {
            date: selectRow.day,
            dutyContactorId: m.contactorId,
            dutyContactorMobile: m.mobile||m.mobile1||m.mobile2,
            dutyContactorName: m.name,
            dutyContactorSex: m.sex
          };
          checkList.push(obj);
        }
      });
      console.log(cellList);
      console.log(personObj);
      console.log(checkList);
      if (checkList.length <= 0) {
        this.$message.error(`该人员已存在此班次，不需要${type}`);
        this.outerVisible = false;
        return;
      }
      // 判断是否有限制规则

      let selectTime = date; // 选中日期
      let selectChange = new Date(selectTime);
      if (personObj.startDate) {
        console.log("selectChange: ", selectChange);
        if (
          new Date(personObj.startDate) <= selectChange &&
          selectChange <= new Date(personObj.endDate)
        ) {
          this.$message.warning("与替换成员挂起规则日期不符");
          return;
        }
      }
      if (personObj.day) {
        // 转换的日期 0是星期天和，挂起规则 7是星期天
        selectChange = selectChange.getDay() == 0 ? 7 : selectChange.getDay();
        if (personObj.day.indexOf(selectChange) > -1) {
          this.$message.warning("与替换成员挂起规则星期不符");
          return;
        }
      }
      if (personObj.startTime) {
        if (
          new Date(date + " " + personObj.startTime) >=
          new Date(date + " " + item.startTime)
        ) {
          this.$message.warning("与替换成员挂起规则开始时间不符");
          return;
        }
      }
      if (personObj.endTime && !item.toTomorrowStatus) {
        if (
          new Date(date + " " + personObj.endTime) <=
          new Date(date + " " + item.endTime)
        ) {
          this.$message.warning("与替换成员挂起规则结束时间不符");
          return;
        }
      }

      // 是否跨天
      let flag = false;
      flag = !!(item ? item.toTomorrowStatus : false);
      // 女的不能跨天
      if (personObj.sex === "女" && flag) {
        this.$message.error("不能设置女性跨天值班");
        return;
      }
      return { startIndex, lastIndex, checkList, item };
    },
    /**
     * @description: 成功添加或替换后的操作
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20200909 21:18
     * @param {type} :替换或添加提示语
     * @return {}
     */
    successAddOrReplace(type) {
      this.outerVisible = false;
      this.$message.success(`${type}人员成功`);
      this.initTable(this.editTableData);
    },
    // 点击右侧新增按钮新增值班人员快速替换
    showAddPerson(index) {
      this.checkShiftIndex = index;
      // this.$refs.selectDialog.empty();
      this.outerType = "tag";
      this.outerVisible = true;
      this.$nextTick(() => {
        // this.$refs.selectDialog.empty();
      });
    },
    // 新增右侧标签栏的人员
    addTagPerson(checkboxGroup) {
      checkboxGroup.forEach(m => {
        let item = this.dataName[this.checkShiftIndex].peoples.find(
          n => n.contactorId === m.contactorId
        );
        if (!item) {
          this.dataName[this.checkShiftIndex].peoples.push(
            JSON.parse(JSON.stringify(m))
          );
        } else {
          this.$message.error(`“${m.name}”已存在`);
        }
      });
      this.outerVisible = false;
    },
    /**
     * @description: 新增列表的人员
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {checkboxGroup} :需要添加到行中班次或分段班次数据
     * @return {}
     */
    addTablePerson(checkboxGroup) {
      let selectColumn = JSON.parse(JSON.stringify(this.selectColumn));
      let selectRow = JSON.parse(JSON.stringify(this.selectRow));
      console.log("this.selectRow: ", this.selectRow);
      let prop = selectColumn.property;
      let startIndex = prop.replace("parent", "");
      let lastIndex = selectColumn.frequencyIndex;
      console.log(
        "this.getCurrentDateIndex(this.currentDate): ",
        this.getCurrentDateIndex(this.currentDate)
      );
      let currentIndex = this.getCurrentDateIndex(this.currentDate);
      // 是否跨天
      let flag = false;
      let item = this.editTableData[startIndex].data[currentIndex].data[
        lastIndex
      ];
      console.log("item: ", item);
      flag = !!(item ? item.toTomorrowStatus : false);
      // 表格已存在的人员
      let cellList = item.dutyList;
      // 选中的人员
      let checkList = [];
      checkboxGroup.forEach(m => {
        let item = cellList.find(n => n.dutyContactorId === m.contactorId);
        // 过滤已存在的人员
        if (!item) {
          if (flag && m.sex === "女") {
            this.$message.error("不能设置女性跨天值班");
          } else {
            let obj = {
              date: selectRow.day,
              dutyContactorId: m.contactorId,
              dutyContactorMobile: m.mobile||m.mobile1 || m.mobile2,
              dutyContactorName: m.name,
              dutyContactorSex: m.sex
            };
            checkList.push(obj);
          }
        }
      });
      if (checkList.length <= 0) {
        this.outerVisible = false;
        return;
      }
      // 判断该单元格是否为空且该单元格是否已达上限人数
      console.log(
        "this.editTableData[startIndex]: ",
        this.editTableData[startIndex]
      );
      let maxNumber = this.editTableData[startIndex].appSjsDutyGroup.maxNumble;
      let cellNumber = cellList.length;
      let checkLength = checkList.length;
      if (
        checkLength === maxNumber ||
        (cellNumber === maxNumber && checkLength < maxNumber)
      ) {
        this.$confirm("如果该班次已排班，将会替换原值班人员", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.editTableData.forEach((m, i) => {
              if (i == startIndex) {
                // let item = m.appSjsDutyGroupTimeList[lastIndex];
                // let dutyList = item && item.dutyList ? item.dutyList : [];
                // let list = dutyList.filter((m) => m.date !== selectRow.day);
                // this.$set(m.appSjsDutyGroupTimeList[lastIndex], "dutyList", [
                //   ...list,
                //   ...checkList,
                this.editTableData[startIndex].data[currentIndex].data[
                  lastIndex
                ].dutyList = checkList;
              }
            });
            this.outerVisible = false;
            this.$message.success("设置人员成功");
            this.initTable(this.editTableData);
          })
          .catch(() => {
            this.$message.info("已取消");
          });
      } else if (checkLength + cellNumber <= maxNumber) {
        this.editTableData.forEach((m, i) => {
          if (i == startIndex) {
            // let item = m.appSjsDutyGroupTimeList[lastIndex];
            // let dutyList = item && item.dutyList ? item.dutyList : [];
            // this.$set(m.appSjsDutyGroupTimeList[lastIndex], "dutyList", [
            //   ...dutyList,
            //   ...checkList,
            // ]);
            this.editTableData[startIndex].data[currentIndex].data[
              lastIndex
            ].dutyList = checkList;
          }
        });
        this.outerVisible = false;
        this.$message.success("设置人员成功");
        this.initTable(this.editTableData);
      } else {
        this.$message.error("所选人数超出班次管理规定人数");
      }
    },
    // 选择人员弹窗保存触发
    addPerson(ids, list) {
      let personList = [];
      list.forEach(m => {
        let sex = "";
        if (m.sex === 0 || m.sex === "男") {
          sex = "男";
        }
        if (m.sex === 1 || m.sex === "女") {
          sex = "女";
        }
        let obj = {
          contactorId: m.id,
          mobile: m.mobile ||m.mobile1 || m.mobile2,
          name: m.name,
          sex
        };
        personList.push(obj);
      });
      console.log(personList);
      if (this.outerType === "table") {
        this.addTablePerson(personList);
      }
      if (this.outerType === "tag") {
        this.addTagPerson(personList);
      }
    },
    // 点击刷新按钮触发
    refresh() {
      this.getList();
    },
    // 点击模板按钮触发
    importTemplate() {
      const UrlRoot = window.g.ApiUrl;
      window.location.href =
        UrlRoot + "/eos/duty/dutyPlan/importTemplates?date=" + this.month;
    },
    // 获取模板
    importFileFun() {
            const request = {
              method: 'get',
              url: `/app/sjs/duty/outputTemplate?date=${this.month}`,
              baseURL: window.SITE_CONFIG["event"],
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                token: this.$cookie.get('token'),
              },
              responseType: 'arraybuffer',
            };
            downLoadFile(request);
    },
    // 导入
    importClassFun(){
      const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.accept = '.xlsx';
        input.onchange = () => {
          const formData = new FormData();
          console.log(input.files[0])
          formData.append('file', input.files[0]);
          this.$api.inputExcelFun(formData).then(res=>{
            console.log(res)
            if (res.errorcode === 0) {
              this.$message({
                type: 'success',
                message: '导入成功'
              })
              this.getList();
            } else {
              this.$message({
                type: 'error',
                message: '导入失败'
              })
            }
          })
          input.remove();
        };
        input.click();
    },


    // 点击导出按钮触发
    exportMonthlyTable() {
      exportFile({
        url:window.g.ApiUrl + '/app/sjs/duty/outputExcel/sjs',
        method:'get',
        params:{date:this.month},
        token:this.$cookie.get('token')
      })
    },
    // 改变日期刷新table
    changeMonth(date) {
      if (date) {
        this.month = date.formatDate("yyyy-MM");
        this.initMonth = date;
        console.log("this.month: ", this.month);
        this.getList();
      }
    },
    // 月自动排班
    async monthAutoScheduling() {
      console.log("===============月自动排班=====================");
      this.type = "month";
      await this.getAutomaticList();
    },
    // 周自动排班
    async weekAutoScheduling() {
      if (!this.weekAutoDate) {
        this.$message.error("请先从表格里面选择日期");
        return;
      }
      let today = new Date();
      /*判断所选日期是否小于当前日期*/
      if (
        +new Date(this.weekAutoDate) <
        +new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ) {
        this.$message.error("所选日期小于当前日期");
        return;
      }
      this.type = "week";
      await this.getAutomaticList();
    },
    // 点击重置排班按钮触发
    handleReset() {
      this.$confirm("确认重置排班, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let params = { date: this.month };
            // let {data} = await this.$api.clearDuty(params);
            this.$api.clearDuty(params).then(res => {
              // console.log('res: ', res);
              if (res.errorcode === 0) {
                this.$message.success("重置排班成功");
                this.getList();
              }
            });
          } catch (e) {
            console.log("handleReset: ", e);
          }
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 点击设置人员按钮触发
    handleSetup() {
      // let selectColumn = JSON.parse(JSON.stringify(this.selectColumn));
      let selectRow = JSON.parse(JSON.stringify(this.selectRow));
      if (!selectRow) {
        this.$message.error("请单击一个时段班次名");
        return;
      }
      let today = new Date();
      /*判断所选日期是否小于当前日期*/
      if (
        +new Date(selectRow.day) <
        +new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ) {
        this.$message.error("所选日期小于当前日期");
        return;
      }
      // this.$refs.selectDialog.empty();
      this.outerType = "table";
      this.outerVisible = true;

      this.$nextTick(() => {
        // this.$refs.selectDialog.empty();
        let prop = this.selectColumn.property;
        let startIndex = prop.replace("parent", "");
        let lastIndex = this.selectColumn.frequencyIndex;
        let currentIndex = this.getCurrentDateIndex(this.currentDate);
        let item = this.editTableData[startIndex].data[currentIndex].data[
          lastIndex
        ];
        if (item.dutyList.length > 0) {
          let checkContacts = item.dutyList.map(v => {
            return v.dutyContactorId;
          });
          this.$refs.selectDialog.checkboxGroup = checkContacts;
          this.$refs.selectDialog.mansList = item.dutyList;
        } else {
          this.$refs.selectDialog.checkboxGroup = [];
        }
      });
    },
    // 保存排班
    async saveScheduling() {
      try {
        let editTableData = JSON.parse(JSON.stringify(this.editTableData));
        let rawTableData = JSON.parse(JSON.stringify(this.rawTableData));
        if (this.type === "month") {
          editTableData.forEach(m => {
            delete m.id;
            if (
              m.appSjsDutyGroupTimeList &&
              m.appSjsDutyGroupTimeList.length > 0
            ) {
              m.appSjsDutyGroupTimeList.forEach(n => {
                delete n.id;
                if (n.dutyList && n.dutyList.length > 0) {
                  n.dutyList.forEach(o => {
                    delete o.id;
                  });
                }
              });
            }
          });
        }
        if (this.type === "week") {
          editTableData.forEach((m, i) => {
            delete m.id;
            if (
              m.appSjsDutyGroupTimeList &&
              m.appSjsDutyGroupTimeList.length > 0
            ) {
              m.appSjsDutyGroupTimeList.forEach((n, j) => {
                delete n.id;
                let rawDutyList =
                  rawTableData[i].appSjsDutyGroupTimeList[j].dutyList;
                let editDutyList = n.dutyList;
                let dateList = [...new Set(editDutyList.map(o => o.date))];
                // 过滤原数据里面这周的人员
                let list = rawDutyList.filter(o => !dateList.includes(o.date));
                // 合并修改后的人员
                n.dutyList = list.concat(editDutyList);
                if (n.dutyList && n.dutyList.length > 0) {
                  n.dutyList.forEach(o => {
                    delete o.id;
                  });
                }
              });
            }
          });
        }
        let res = await this.$api.saveDuty({ data: editTableData });
        if (res.errorcode === 0) {
          this.$message.success("保存排班成功");
          this.isSave = true;
          this.$emit("updateData", false);
          await this.getList();
        }
      } catch (e) {
        console.log("saveScheduling: ", e);
      }
    },
    // 沿用上月排班
    async lastMonth() {
      try {
        // let date = new Date().formatDate('yyyy-MM');
        // console.log('date: ', date);
        let date = new Date().formatDate("yyyy-MM");
        let dateTimeStamp = new Date(date);
        let clickDate = new Date().formatDate(this.month);
        let clickDateTimeStamp = new Date(clickDate);
        if (clickDateTimeStamp >= dateTimeStamp) {
          let params = {
            date: this.month
          };
          let res = await this.$api.dutyCopy(params);
          if (res.errorcode === 0) {
            this.$message.success("保存排班成功");
            await this.getList();
          }
        } else {
          this.$message.error("请选择当前或之后的月份");
        }
      } catch (e) {
        console.log("saveScheduling: ", e);
      }
    },
    /**
     * @description: 点击短信通知触发
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201018 20:54
     * @param {}
     * @return {}
     */
    handleShowMsg() {
      let selectRow = JSON.parse(JSON.stringify(this.rowdata));
      if (selectRow.length == 0) {
        this.$message.error("请单击一个日期");
        return;
      }
      let today = new Date();
      /*判断所选日期是否小于当前日期*/
      if (
        +new Date(selectRow.day) <
        +new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ) {
        this.$message.error("所选日期小于当前日期");
        return;
      }
      this.msgDialog = true;
      let msgList = [];
      this.editTableData.forEach(m => {
        m.data.forEach(n => {
          if (selectRow.day == n.date) {
            n.data.map(v => {
              let personId = [];
              let personName = [];
              let personPhone = [];
              v.dutyList.forEach(o => {
                personId.push(o.dutyContactorId);
                personName.push(o.dutyContactorName);
                personPhone.push({
                  phone: o.dutyContactorMobile,
                  name: o.dutyContactorName
                });
              });
              let obj = {
                className: `${m.appSjsDutyGroup.name}${
                  v.name ? `(${v.name})` : ""
                }`,
                day: selectRow.day,
                personId,
                personName: personName.join(","),
                personPhone: personPhone,
                remark: ""
              };
              msgList.push(obj);
            });
          }
        });
      });
      this.$set(this, "msgClass", msgList);
    },
    // 点击短信弹窗确定按钮触发
    async handleSendMsg() {
      console.log(this.editTableData)
      let content = "";
      let personIds = [];
      let personNames = [];
      this.msgClass.forEach((n, i) => {
        n.remark = n.remark && n.remark.indexOf('备注') !== 0 ? '备注:' + n.remark : n.remark;
        content += `${i + 1}.班次:${n.className};时间:${
          n.day
        };人员:${n.personName || "无"};${n.remark}\n`;
        personIds = personIds.concat(n.personId);
        const filterData = n.personPhone.filter((el) => !el.phone);
        personNames = personNames.concat(filterData.map((el) => el.name));
      });
      // 去重
      personIds = [...new Set(personIds)];
      if (personIds.length <= 0) {
        this.$message.error("没有安排人员或者保存班次");
        return;
      }
      // 判断电话
      if (personNames.length > 0) {
        const names = personNames.length > 1 ? personNames.join(',') : personNames[0];
        this.$message.error(`${names}联系电话不存在`);
        return;
      }
      let params = {
        data: {
          contactorId: personIds,
          content
        }
      };
      let res = await this.$api.dutyplan(params);
      if (res.errorcode !== 0) {
        this.$message.error(res.msg);
      } else {
        this.$message.success("发送成功!");
        this.msgDialog = false;
      }
    },
    // 改变样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      //指定坐标
      // console.log(row, column, rowIndex, columnIndex);
      if (row === this.selectRow && column === this.selectColumn) {
        return "background:rgb(74, 159, 255); color:#fff";
      } else if (rowIndex === "" && columnIndex === "") {
        return "";
      } else {
        return "";
      }
    },
    /**
     * @description: 单击时段班次名添加样式
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {prop} :班次或分段班次名-方便获取需要删除的索引值
     * @param {date} :当前行日期
     * @param {index} :要删除的对象索引值
     * @return {}
     */
    personDelete(prop, day, index) {
      let date = new Date().formatDate("yyyy-MM-dd");
      let dateTimeStamp = new Date(date);
      let clickDate = new Date().formatDate(day);
      let clickDateTimeStamp = new Date(clickDate);
      console.log("clickDateTimeStamp: ", clickDateTimeStamp);
      console.log("dateTimeStamp: ", dateTimeStamp);
      if (clickDateTimeStamp >= dateTimeStamp) {
        console.log("prop: ", prop);
        let startIndex = prop.replace("parent", "");
        let currentIndex = this.getCurrentDateIndex(day);

        this.editTableData[startIndex].data[currentIndex].data[
          index
        ].dutyList = this.editTableData[startIndex].data[currentIndex].data[
          index
        ].dutyList.filter(v => v.date != day);

        this.outerVisible = false;
        this.$message.success("删除人员成功");
        this.initTable(this.editTableData);
      } else {
        this.$message.warning("所删除成员是历史排班，请选择当天及之后的值班员");
      }
    },
    /**
     * @description: 单击时段班次名添加样式
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201015 20:59
     * @param {id} :选择时段班次名Id
     * @param {date} :选择时段班次名所在日期
     * @return {}
     */
    handleAdd(id, row, prop, frequencyIndex) {
      this.clickPeoplesIds = []
      console.log(id, row, prop, frequencyIndex)
      this.clickPeoples = row[prop][frequencyIndex].dutyList; // 当前点击班次的人员信息
      this.clickPeoples.forEach(item=>{
      this.clickPeoplesIds.push(item.dutyContactorName)
      })
      this.selectRow = row;
      this.selectColumn = Object.assign({}, this.obj, {
        property: prop,
        frequencyIndex: frequencyIndex
      });
      this.currentDate = row.day;
      this.frequencyId = id;
      this.clearTableStyle(["solid", "dashed"]);
    }
    /**
     * @description: 按单位导出方法
     * @author: xuchuangxing
     * @updateTime :2021/1/13 10:49
     * @param {}
     * @return {}
     */
  }
};
</script>

<style lang="scss" scoped>
.borderStyle {
  border-bottom: none !important;
}
.centerStyle {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.table-class {
  width: 100%;
  box-shadow: 0;

  /deep/ .cell {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /*保留换行符*/
    white-space: pre-line;
    width: 100%;

    .person-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      position: relative;

      .person-item {
        display: flex;
        align-items: center;
        padding: 5px 7px 5px 8px;
        font-size: 14px;
        cursor: pointer;

        .el-icon-phone-outline {
          color: #9fc8fe;
          margin-left: 3px;
          display: none;
          // display: inline-block;
        }
        &:hover .callPhone {
          display: inline-block;
        }
      }

      .person-item .active {
        color: #9fc8fe;
        font-weight: bold;
      }
    }
    .delPerson {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
    .frequency {
      width: 100%;
      .frequency-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: relative;
        height: 55px;
        // border: 1px solid #C9DCFE;
        width: 100%;
        color: #666;
        font-size: 14px;
        .frequency-name {
          width: 50%;
          height: 100%;
          border-right: 1px solid #c9dcfe;
          border-bottom: 1px solid #c9dcfe;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .frequency-person {
          width: 50%;
          height: 100%;
          position: relative;
          padding: 7px;
          padding-right: 0;
          overflow-y: scroll;
          border-bottom: 1px solid #c9dcfe;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .person-item {
            padding: 0px 8px;
            flex:1;
            padding-right: 0;
            font-size: 14px;
            cursor: pointer;
            display: inline-block;
            width: 61%;
            box-sizing: border-box;
            text-align: justify;
            text-align-last: justify;

            .el-icon-phone-outline {
              color: #9fc8fe;
              margin-left: 3px;
              display: none;
              // display: inline-block;
            }
            &:hover .callPhone {
              display: inline-block;
            }
          }
          .person-item .active {
            color: #9fc8fe;
            font-weight: bold;
          }
          &:hover .callPhone {
            display: inline-block;
          }
          .delPerson {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
          }
        }
      }
    }
    .selectFrequency {
      background: rgb(74, 159, 255);
      color: #fff !important;
    }
  }
}

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
  // padding: 6px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
  // border: 1px solid rgba(211, 215, 219, 1);
}

.beonDuty {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(50, 50, 50, 1);
  padding: 10px 20px;

  span {
    position: relative;
    line-height: 18px;

    &:before {
      position: absolute;
      content: "";
      background-color: #409eff;
      width: 3px;
      height: 18px;
      left: -9px;
      top: 1px;
    }
  }
}

.tag {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  /deep/ .el-tag {
    margin: 15px 0 0 15px;
    border:1px solid #e4e4e4;
    background:#fff;
    color:#000;
    font-size: 15px;
    min-width: 88px;
    &:hover{
      border:1px solid #0091ff;
      background:#ecf4ff;
      color:#0091ff;
    }
  }

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

::-webkit-scrollbar {
  background-color: transparent;
}
::-webkit-scrollbar-button {
  background-color: transparent;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-corner {
  background-color: transparent;
}

/deep/ .el-table--border {
  border-color: #c9dcfe;
}
/deep/ .el-table th {
  border-color: #c9dcfe;
}
/deep/ .el-table td {
  padding: 0;
  border-color: #c9dcfe;
}
/deep/ .el-table .cell {
  padding: 0;
}
</style>
