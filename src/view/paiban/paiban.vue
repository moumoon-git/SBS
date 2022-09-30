<template>
  <div class="level_scheduling">
    <el-header>
      <div class="selectMode">
        <div class="selectMode-l">
          当月排班模式
          <br />
          <span @click="$refs.changeHint.visible = true">变更</span>
        </div>
        <div class="selectMode-r" v-if="showClassToday1">
          <p>
            角色：
            <span
              style="margin-right: 10px"
              v-for="(item, index4) in nowMonthModeData.roleList"
              :key="index4"
              >{{ item.name }}({{ item.numble }}人)</span
            >
          </p>
          <p>
            班次：
            <span
              style="margin-right: 10px"
              v-for="(item, index5) in nowMonthModeData.classesList"
              :key="index5"
              >{{ item.name }}</span
            >
          </p>
        </div>
        <div class="selectMode-r" v-if="showClassToday2">当月无排班</div>
      </div>
      <div class="selectTime">
        <div class="lastMon" @click="getPreMonth(nowMonth)"></div>
        <div class="selectMon">{{ toYear }}年{{ toMonth }}月</div>
        <div class="nextMon" @click="getNextMonth(nowMonth)"></div>
        <div class="block">
          <el-date-picker
            :clearable="false"
            v-model="value2"
            type="month"
            @change="changemonth"
            placeholder="选择月"
          ></el-date-picker>
        </div>
      </div>
      <el-button class="autoPaiban" size="" @click="autoScheduling()"
        >自动排班</el-button
      >
      <el-button class="autoPaiban" size="" @click="SchedulingAdmin()"
        >值班员管理</el-button
      >
      <el-button class="autoPaiban" size="medium" @click="exportScheduling"
        >导出</el-button
      >
    </el-header>
    <el-main>
      <el-table
        v-loading="loading"
        :span-method="cellMerge"
        :data="classTableDataNew"
        style="width: 100%"
        :header-cell-style="{
          'background-color': 'rgba(240,245,255,1)',
          color: '#333',
        }"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseOut"
        height="700px"
        :cell-style="getCenter"
      >
        <el-table-column header-align="center" label="日期" width="150">
          <template slot-scope="scope">
            <p class="classp" @click="deleteItem(scope.row.date)">
              {{ scope.row.date }}
            </p>
            <div
              class="deleteImg"
              style="display: none"
              @click="deleteData(scope.row.date)"
            ></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="className"
          header-align="center"
          label="班次"
          height="100%"
        >
          <template slot-scope="scope">{{
            scope.row.className == '' ? '未设置' : scope.row.className
          }}</template>
        </el-table-column>
        <el-table-column
          v-for="(item, indexAll) in modeArray"
          :key="indexAll"
          header-align="center"
          :label="item.name"
        >
          <el-table-column label="人员姓名" height="100%">
            <template slot-scope="scope">
              <el-table
                border=""
                :cell-style="getCenter"
                :data="scope.row.roles[indexAll]"
                :show-header="false"
                empty-text="    "
              >
                <el-table-column prop="contacotrName"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="手机电话" height="100%">
            <template slot-scope="scope">
              <el-table
                :cell-style="getCenter"
                :data="scope.row.roles[indexAll]"
                :show-header="false"
                empty-text="    "
              >
                <el-table-column prop="contacotrMobile"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="办公电话" height="100%">
            <template slot-scope="scope">
              <el-table
                :cell-style="getCenter"
                :data="scope.row.roles[indexAll]"
                :show-header="false"
                empty-text="    "
              >
                <el-table-column prop="contacotrTelPhone"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <selectPeopleForm
        v-if="equiTimingRunVisible"
        :visible.sync="equiTimingRunVisible"
        :classMode="modeArray"
        :tempModeId="tempModeId"
        v-on:addPeopleFather="addPeopleFather"
      ></selectPeopleForm>
      <person-search
        ref="personSearch"
        :title="dialogTitle"
        :limitNum="dialoglimitNum"
        :limitmenbers="dialoglimitMenbers"
        @childByValue="child"
        @changeLimit="changeLimit"
      ></person-search>
    </el-main>
    <!-- 选择排班模式弹框 -->
    <!-- 
        @editorName: qinjiaqi
        @editorTime: 2020-10-19 9:52:41
        @description: 弹出框默认可点击区域外关闭，故将:close-on-click-modal设为"false"
    -->
    <el-dialog
      title="设置当月排班模式"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="radioDiv">
        <div
          v-for="(item, index) in modeData"
          class="modeOut"
          @click="addClass(index)"
          :key="index"
        >
          <el-radio v-model="radio" :label="item.id" @change="getValue()">{{
            item.name
          }}</el-radio>
          <div class="modeContent">
            <p>
              角色：
              <span
                style="margin-right: 10px"
                v-for="(item2, index2) in item.roleList"
                :key="index2"
                >{{ item2.name }}({{ item2.numble }}人)</span
              >
            </p>
            <p>
              班次：
              <span
                style="margin-right: 10px"
                v-for="(item3, index3) in item.classesList"
                :key="index3"
                >{{ item3.name }}</span
              >
            </p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChangeMode()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 添加班次管理弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :key="menuKey"
      title="班次管理"
      :visible.sync="classVisible"
      width="40%"
      :before-close="classClose"
    >
      <template>
        <div
          class="classType"
          v-for="(item, index1) in todayClassData"
          :key="index1"
        >
          <p class="classP1">{{ item.name }}</p>
          <template>
            <div
              v-for="(item2, indexr) in item.appDutySubordinateGroupRoles"
              :key="indexr"
            >
              <div class="classTypeLeader">
                <div class="classTitle">{{ item2.name }}</div>
                <el-input
                  disabled
                  class="classInput"
                  v-model="item2.str"
                  placeholder="请选择"
                ></el-input>
                <div class="classPeoleChange" @click="addPeople(item2, indexr)">
                  添加
                </div>
              </div>
              <div style="" class="peopleHistory">
                <div
                  @click="clickFun(item3, item2, index, item.name)"
                  class="peopleItem"
                  v-for="(item3, index) in historyArr[indexr]"
                  :key="index"
                >
                  {{ item3.contacotrName }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="classAdmin()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 排班变更提示 -->
    <sv-dialog-hint
      ref="changeHint"
      type="delete"
      text="更换排班模式会清空数据"
      supplement="是否继续？"
      @confirm="openChangeMode()"
    />
  </div>
</template>

<script>
import selectPeopleForm from './selectPeopleForm';
import PersonSearch from './paibanSearch';
import exportFile from '../tool/exportFile';

export default {
  data() {
    return {
      loading: false,
      count: 0,
      dialogTitle: '联系人添加',
      historyArr: [],
      historyIds: [],
      spanArr2: [],
      spanArr: [],
      classTableDatatest: [],
      menuKey: 0,
      modeArray: [],
      classArray: [],
      selectDate: {},
      selectDataArr: [], //所选择的联系人数组
      showShezhi: false,
      toMonth: '',
      toYear: '',
      //当日班次数据
      showClassToday1: false,
      showClassToday2: false,
      todayClassData: [],
      // 当前月份
      nowMonth: '',
      nowMonthModeData: {},
      wanwoker: '',
      morningleader: '',
      morningwoker: '',
      wanleader: '',

      modeData: [], //模式数组
      leader: '',
      worker: '',
      //添加联系人
      dayTime: '', //1早班、2中班、3晚班
      peopleType: '', //1带班领导、2值班员
      equiTimingRunVisible: false,
      selectedActive: '',
      selectedPeopleActive: '',
      // 班次管理弹框
      classVisible: false,
      classType: 1, // 班次类型
      // 选择模式弹框
      radio: '1',
      dialogVisible: false,
      value2: '',
      tableData: [],
      classTableData: [],
      // allDaysArr:[],
      classTableDataNew: [],
      peopleHistory: [],
      // 点击添加按钮的数据
      clickAddObjData: {},
      baseUrl: window.g.ApiUrl,
      // 排班人数限制
      dialoglimitNum: 0,
      //排班选中的人
      dialoglimitMenbers: {},
      // 当前月的排班模式id
      tempModeId: '',
    };
  },

  methods: {
    autoScheduling() {
      this.$confirm('是否自动排班', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // this.loading = true
          let data = {
            date: this.nowMonth,
            modeId: this.tempModeId,
          };
          this.$http
            .get(window.g.ApiUrl + '/eos/duty/subordinate/automaticDuty', {
              params: data,
            })
            .then((res) => {
              let data = res.data;
              // if(res.errorcode == 500){
              this.loading = false;
              // }
              this.getTableDataByMonth(this.nowMonth);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消自动排班',
          });
        });
    },
    SchedulingAdmin() {
      this.equiTimingRunVisible = true;
    },
    getCenter() {
      return 'text-align:center';
    },
    handleMouseEnter(row, column, cell, event) {
      if (column.label == '日期') {
        cell.children[0].children[1].style.display = 'block';
        cell.style.border = '1px solid rgba(0,145,255,1)';
        cell.style.color = '#0091FF';
      }
    },
    handleMouseOut(row, column, cell, event) {
      if (column.label == '日期') {
        cell.children[0].children[1].style.display = 'none';
        cell.style.border = '1px solid #EBEEF5';
        cell.style.color = '#000';
      }
    },
    selectionChange() {},
    deleteItem(date) {
      this.getClassByDay(date);
    },
    deleteData(date) {
      // 判断是否过期
      let todayDate = new Date().getTime();
      let selectDate = new Date(date).getTime();
      if (todayDate - selectDate > 0) {
        this.classVisible = false;
        this.$message({ type: 'failed', message: '当前日期已过期' });
      } else {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$http({
              method: 'post',
              url: `${window.g.ApiUrl}/eos/duty/subordinate/deleteByDate`,
              data: {
                date: date,
              },
            })
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                });
                this.getTableDataByMonth(this.nowMonth);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    changemonth(data) {
      let newDate = new Date(data);
      let nowMonth = newDate.getMonth() + 1;
      // 添加分隔符“-”
      let seperator = '-';
      // 对月份进行处理，1-9月在前面添加一个“0”
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth;
      }
      this.toYear = newDate.getFullYear();
      this.toMonth = nowMonth;
      // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      let nowDate = newDate.getFullYear() + seperator + nowMonth;
      this.nowMonth = nowDate;
      this.getTableDataByMonth(this.nowMonth);
      this.getNowMode(this.nowMonth);
    },
    //提交班次管理
    classAdmin() {
      let data = this.todayClassData;
      this.classVisible = false;
      this.$http({
        method: 'post',
        url: `${window.g.ApiUrl}/eos/duty/subordinate/saveAll`,
        data: {
          data,
        },
      })
        .then((res) => {
          if (res.data.errorcode == 500) {
            this.$message({
              type: 'info',
              message: res.data.msg,
            });
          }
          this.getTableDataByMonth(this.nowMonth);
          this.getAllDarsEveryDay();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取当月的排班表格数据
    getTableDataByMonth(month) {
      this.loading = true;
      this.$http({
        method: 'get',
        url: `${window.g.ApiUrl}/eos/duty/subordinate/getAllByDate?date=${month}`,
      })
        .then((res) => {
          this.loading = false;
          this.classTableData = res.data.data;
          this.returnTableData();
          this.getAllDarsEveryDay();
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取当天的班次及角色
    getClassByDay(date) {
      let todayDate = new Date().getTime();
      let selectDate = new Date(date).getTime();
      if (todayDate - selectDate > 0) {
        this.classVisible = false;
        this.$message({
          type: 'failed',
          message: '当前日期已过期',
        });
      } else {
        this.classVisible = true;
        this.$http({
          method: 'get',
          url: `${window.g.ApiUrl}/eos/duty/subordinate/getByDate?date=${date}`,
        })
          .then((res) => {
            if (res.data.data.length == 0) {
              this.todayClassData = [];
              this.historyIds = [];
              this.$message({
                type: 'failed',
                message: '未获取到当前班次',
              });
            } else {
              let temp = res.data.data;
              this.todayClassData = res.data.data;
              console.log(this.todayClassData);

              // 处理数据,当前天排班预览start
              let todayClassDataPreview = this.todayClassData;
              for (let i = 0; i < todayClassDataPreview.length; i++) {
                let tempData1 =
                  todayClassDataPreview[i].appDutySubordinateGroupRoles;
                for (let j = 0; j < tempData1.length; j++) {
                  tempData1[j].str = this.returnNameString(
                    tempData1[j].appDutySubordinates,
                  );
                }
              }
              // 处理数据,当前天排班预览end
              for (let i = 0; i < temp.length; i++) {
                let temp2 = temp[i].appDutySubordinateGroupRoles;
                for (let j = 0; j < temp2.length; j++) {
                  this.historyIds.push(temp2[j].modeRoleId);
                }
              }
            }
            this.historyIds = Array.from(new Set(this.historyIds));
            this.getOwnHistory2();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /*
     *@Description: 返回各班次人员的姓名String
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-10-15 14:40:36
     */
    returnNameString(oldArr) {
      let newStr = ``;
      for (let i = 0; i < oldArr.length; i++) {
        newStr += oldArr[i].contacotrName;
        newStr += ``;
      }
      return newStr;
    },
    getValue() {},
    // 切换模式确认
    submitChangeMode() {
      this.$confirm('确认更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.dialogVisible = false;
          this.$http({
            method: 'post',
            url: `${window.g.ApiUrl}/duty/subordinateModeDate/save`,
            data: {
              modeId: this.radio,
              date: this.nowMonth,
            },
          })
            .then((res) => {
              this.getNowMode(this.nowMonth);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更改',
          });
        });
    },
    addPeopleFather(data) {
      let daytime = data.dayTime;
      let peopleType = data.peopleType;
      let name = data.name;
      this.leader = name;
    },
    //显示添加班次弹框
    addClassPop() {
      this.classVisible = true;
      // 测试修改8.24数据
    },
    // 显示添加联系人弹框
    addPeople(item2, nowIndex) {
      /*@lastEditor xry
        @lastDate 2020-9-16
        @goal     修改禅道bug,勾选联系人时候如果达到限制人数不允许继续勾选
        @nowIndex 当前添加的索引
        @dialoglimitNum 当前的限制数
      */
      // console.log(this.nowMonthModeData.roleList[nowIndex].numble)
      console.log(item2);
      this.selectDate = item2;
      this.clickAddObjData = {
        item2,
      };
      this.dialoglimitMenbers = item2; // 传入添加人员组件选中的人
      console.log('父组件传递的数据：');
      console.log(item2, nowIndex);
      console.log(this.dialoglimitMenbers);
      localStorage.setItem(
        'dialoglimitMenbers',
        JSON.stringify(this.dialoglimitMenbers),
      );
      // this.equiTimingRunVisible = true
      this.contactorType = 'contactor';
      this.dialogTitle = '联系人查找';
      this.dialoglimitNum = this.nowMonthModeData.roleList[nowIndex].numble;
      console.log(this.dialoglimitNum);
      console.log(this.clickAddObjData);
      console.log(this.todayClassData);
      this.$refs.personSearch.childFn();
      this.$refs.personSearch.visible = true;
    },
    /*
     *@Description: 改变排班限制人数
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2020-10-15 17:21:25
     */
    changeLimit() {
      this.dialoglimitNum = 0;
    },
    // 切换模式样式
    addClass: function (index) {
      this.selectedActive = index;
      this.classType = index;
    },
    classClose(done) {
      done();
    },
    handleClose(done) {
      done();
    },
    openChangeMode() {
      this.dialogVisible = true;
      this.$http({
        method: 'get',
        url: `${window.g.ApiUrl}/eos/duty/subordinateMode/mode/vo`,
        data: {},
      })
        .then((res) => {
          console.log(res.data.data);
          this.modeData = res.data.data;
          // this.radio = this.modeData[0].id;
          this.radio = this.tempModeId;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取当月排班模式
    getNowMode(date) {
      this.$http({
        method: 'get',
        url: `${window.g.ApiUrl}/duty/subordinateModeDate/getByDate?date=${date}`,
      })
        .then((res) => {
          if (res.data.data == '') {
            this.showClassToday1 = false;
            this.showClassToday2 = true;
            this.showShezhi = true;
          } else {
            this.showClassToday1 = true;
            this.showClassToday2 = false;
            this.showShezhi = false;
            if (res.data.errorcode == -1) {
              this.modeArray = [];
              this.tempModeId = '';
              // this.classArray = []
            } else {
              // res.data.data.roleList[0].numble = 2
              this.nowMonthModeData = (res.data && res.data.data) || [];
              this.modeArray = (res.data && res.data.data && res.data.data.roleList) || [];
              // 更改模式会返回参数为null的数组
              if (this.modeArray.length > 0 && this.modeArray[0].id == null) {
                this.modeArray = [];
              }
              this.tempModeId = (res.data && res.data.data && res.data.data.id) || '';
              // this.classArray = res.data.data.classesList
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取当前年月
    getNowMonth() {
      let date = new Date();
      // 获取当前月份
      let nowMonth = date.getMonth() + 1;
      // 添加分隔符“-”
      let seperator = '-';
      // 对月份进行处理，1-9月在前面添加一个“0”
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth;
      }
      this.toYear = date.getFullYear();
      this.toMonth = nowMonth;
      // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      let nowDate = date.getFullYear() + seperator + nowMonth;
      return nowDate;
    },
    //获取上一个月
    getPreMonth(date) {
      var arr = date.split('-');
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = '0' + month2;
      }
      var t2 = year2 + '-' + month2;
      this.toYear = year2;
      this.toMonth = month2;
      this.nowMonth = t2;
      this.getAllDarsEveryDay();
      this.getTableDataByMonth(this.nowMonth);
      this.getNowMode(this.nowMonth);
      return t2;
    },
    // 获取下一个月
    getNextMonth(date) {
      console.log(date);
      var arr = date.split('-');
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = '0' + month2;
      }

      var t2 = year2 + '-' + month2;
      this.toYear = year2;
      this.toMonth = month2;
      this.nowMonth = t2;
      this.getAllDarsEveryDay();
      this.getTableDataByMonth(this.nowMonth);
      this.getNowMode(this.nowMonth);

      return t2;
    },
    //获取某个月的天数
    getDaysInMonth(year, month) {
      const daysOfMonth = [];
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      for (let i = 1; i <= lastDayOfMonth; i++) {
        if (i < 10) {
          daysOfMonth.push(year + '-' + month + '-' + '0' + i);
        } else {
          daysOfMonth.push(year + '-' + month + '-' + i);
        }
      }
      return daysOfMonth;
    },
    getAllDarsEveryDay() {
      let allDaysArr = this.getDaysInMonth(this.toYear, this.toMonth);
      let tempallDaysArr = allDaysArr;
      let tempallDaysArrs = [];
      for (let i = 0; i < tempallDaysArr.length; i++) {
        var newObj = {};
        newObj.date = tempallDaysArr[i];
        newObj.roles = [];
        newObj.className = '';
        tempallDaysArrs.push(newObj);
      }
      let tempclassTableData = this.classTableDatatest;
      let arr = [];
      let arr2 = []; // 最后需要的数据
      tempclassTableData.forEach((item) => {
        if (!arr.includes(item.date)) {
          arr.push(item.date);
          arr2.push([]);
        }
      });
      tempclassTableData.forEach((item) => {
        let indexs = arr.indexOf(item.date);
        arr2[indexs].push(item);
      });
      let c = [...tempallDaysArrs.concat(tempclassTableData.reverse())];
      c.sort(function (a, b) {
        return a.date > b.date ? 1 : -1;
      });
      for (let k = 0; k < c.length; k++) {
        if (k > 0) {
          if (c[k].date === c[k - 1].date && c[k].className == '') {
            c.splice(k, 1);
          }
        }
      }
      this.classTableDataNew = c;
      this.getSpanArr(this.classTableDataNew);
    },
    // 点击联系人添加数据
    clickFun(info, oldInfo, index, classname) {
      this.selectedActive = index;
      this.deWeight(info, oldInfo);
    },
    deWeight(info, oldInfo) {
      console.log(info, oldInfo);
      if (info == 'null') {
        oldInfo.appDutySubordinates = [];
        let str = ``;
        let space = `  `;
        for (let j = 0; j < oldInfo.appDutySubordinates.length; j++) {
          if (str.indexOf(oldInfo.appDutySubordinates[j].contacotrName)) {
            str += space;
            str += oldInfo.appDutySubordinates[j].contacotrName;
          }
        }
        oldInfo.str = str;
        this.menuKey++;
        this.count++;
      } else {
        let number = 0;
        this.nowMonthModeData.roleList.forEach((ele) => {
          if (ele.name == oldInfo.name) {
            number = ele.numble; // 获取到对应模式的角色人数
          }
        });
        // 对应的角色人数不为0
        if (number != 0 && oldInfo.appDutySubordinates == null) {
          oldInfo.str = '';
          oldInfo.appDutySubordinates = [info];
        } else if (number != 0) {
          let flag = true;
          oldInfo.appDutySubordinates.forEach((ele) => {
            if (ele.contacotrName == info.contacotrName) {
              flag = false;
            }
          });
          // 没有重复的
          if (flag) {
            // 没有大于最大角色数量
            if (oldInfo.appDutySubordinates.length < number) {
              // oldInfo.appDutySubordinates.push(info);
            } else if (oldInfo.appDutySubordinates.length == number) {
              // 长度跟最大角色数量相等时,先删除最后一个,插入到第一个
              oldInfo.appDutySubordinates.pop();
              oldInfo.appDutySubordinates.unshift(info);
            } else {
              let num = oldInfo.appDutySubordinates.length - 1 - number;
              oldInfo.appDutySubordinates.splice(num);
              oldInfo.appDutySubordinates.pop();
              oldInfo.appDutySubordinates.unshift(info);
            }
          } else if (oldInfo.appDutySubordinates.length > number) {
            let num = oldInfo.appDutySubordinates.length - 1 - number;
            oldInfo.appDutySubordinates.splice(num);
            oldInfo.appDutySubordinates.pop();
            oldInfo.appDutySubordinates.unshift(info);
          }
        }
        let str = ``;
        let space = `  `;
        for (let j = 0; j < oldInfo.appDutySubordinates.length; j++) {
          str += space;
          str +=
            oldInfo.appDutySubordinates[j].contacotrName ||
            oldInfo.appDutySubordinates[j].name;
        }
        oldInfo.str = str;
        this.menuKey++;
        this.count++;
      }
    },
    // 判断当前类型选择人数是否超标
    deferOverNum(type) {
      let tempArr = this.modeArray;
      for (let i = 0; i < tempArr.length; i++) {
        if ((tempArr[i].name = type)) {
          return tempArr[i].numble;
        }
      }
    },
    // 第一次处理表格数据
    returnTableData() {
      let tempClassTableData = this.classTableData;
      let classTableData = []; // 创建新数组，保存处理后的表格数据
      for (let i = 0; i < tempClassTableData.length; i++) {
        let tempData = tempClassTableData[i].data;
        for (let j = 0; j < tempData.length; j++) {
          let tempData2 = tempData[j].appDutySubordinateGroupRoles;
          let tempLengtharr = [];
          let leaderArr = [];
          for (let g = 0; g < tempData2.length; g++) {
            //添加每个联系人对应的角色
            for (let k = 0; k < tempData2[g].appDutySubordinates.length; k++) {
              tempData2[g].appDutySubordinates[k].roleType = tempData2[g].name;
            }
            leaderArr.push(tempData2[g].appDutySubordinates);
          }
          let tempObj = {};
          tempObj.date = tempClassTableData[i].date;
          tempObj.className = tempData[j].name;
          tempObj.roles = leaderArr;
          classTableData.push(tempObj);
        }
      }
      for (let b = 0; b < classTableData.length; b++) {
        let tempRoles = classTableData[b].roles;
        let tempRolesArr = new Array(this.modeArray.length);
        for (let k = 0; k < tempRoles.length; k++) {
          if (tempRoles[k].length > 0) {
            tempRolesArr[this.returnNum(tempRoles[k][0].roleType)] =
              tempRoles[k];
          }
        }
        tempRoles = tempRolesArr;
        classTableData[b].roles = tempRoles;
      }
      this.classTableDatatest = classTableData;
    },
    // 表格数据列合并
    getSpanArr(data) {
      this.spanArr = [];
      this.spanArr2 = [];
      this.pos = '';
      this.pos2 = '';
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.spanArr2.push(1);
          this.pos = 0;
          this.pos2 = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].date === data[i - 1].date) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
          if (data[i].className === data[i - 1].className) {
            this.spanArr2[this.pos2] += 1;
            this.spanArr2.push(0);
          } else {
            this.spanArr2.push(1);
            this.pos2 = i;
          }
        }
      }
    },
    // 表格合并方法
    cellMerge({ row, column, rowIndex, columnIndex }) {
      // 合并第一列
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 获取选择联系人历史记录
    getOwnHistory2() {
      this.historyArr = [];
      let history = this.historyIds;
      for (let i = 0; i < history.length; i++) {
        this.$http({
          method: 'get',
          url: `${window.g.ApiUrl}/eos/duty/subordinate/getClickHistory?roleId=${history[i]}`,
        })
          .then((res) => {
            this.historyArr.push(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    child(chooseList) {
      let peopleArr = chooseList;
      console.log('从选择联系人中传过来的值', chooseList);
      this.clickAddObjData.item2.appDutySubordinates = chooseList;
      if (peopleArr.length == 0) {
        this.deWeight('null', this.clickAddObjData.item2);
      } else {
        this.clickAddObjData.appDutySubordinates = [];
        for (let i = 0; i < peopleArr.length; i++) {
          let obj = {
            // contacotrId: peopleArr[i].id,
            contacotrMobile:
              peopleArr[i].mobile1 == null || peopleArr[i].mobile1 == ''
                ? peopleArr[i].mobile2
                  ? peopleArr[i].mobile1
                  : '-'
                : peopleArr[i].mobile1,
            contacotrName: peopleArr[i].name,
            contacotrTelPhone:
              peopleArr[i].officeTel == null || peopleArr[i].officeTel == ''
                ? '-'
                : peopleArr[i].officeTel,
          };
          Object.assign(chooseList[i], obj);
          this.deWeight(obj, this.clickAddObjData.item2);
        }
        console.log(this.clickAddObjData.item2);
      }
    },
    deferIsOld(date) {
      tempArr = [];
      let tempArr = [];
      for (let i = 0; i < this.classTableDataNew.length; i++) {
        if (
          this.classTableDataNew[i].date == date ||
          this.classTableDataNew[i].className != ''
        ) {
          tempArr.push(this.classTableDataNew[i].className);
        }
      }
    },
    returnNum(name) {
      for (let i = 0; i < this.modeArray.length; i++) {
        if (name == this.modeArray[i].name) {
          return i;
        }
      }
    },
    // 导出
    exportScheduling() {
      console.log(this.toYear + '-' + this.toMonth);
      exportFile({
        url: window.g.ApiUrl + '/eos/duty/subordinate/getAllByDateExcel',
        method: 'get',
        params: {
          date: this.toYear + '-' + this.toMonth,
          Authorization: localStorage.getItem('token')
            ? localStorage.getItem('token')
            : '',
        },
        token: this.$cookie.get('token'),
      });
    },
  },
  mounted() {
    this.nowMonth = this.getNowMonth(); //获取真实月份
    console.log(this.nowMonth);
    this.getTableDataByMonth(this.nowMonth);
    this.getNowMode(this.nowMonth); //获取当月已经选择的排班模式
  },
  components: {
    selectPeopleForm: selectPeopleForm,
    'person-search': PersonSearch,
  },
};
</script>
<style scoped>
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: none;
}
/deep/.el-table--enable-row-transition .el-table__body td {
  border-top: 1px solid #ebeef5;
}
.level_scheduling /deep/ .el-table td,
.level_scheduling /deep/ .el-table th {
  border-color: #c9dcfe;
  border-top: 0;
}
/deep/.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  border-top: 0;
}
.peopleItem:hover {
  border: 1px solid rgba(0, 145, 255, 1);
}

.peopleItem {
  height: 20px;
  margin: 0 5px;
  background: rgba(245, 250, 255, 1);
  box-shadow: 0px 6px 7px 3px rgba(213, 227, 240, 0.29);
  border-radius: 4px;
  border: 1px solid rgba(245, 250, 255, 1);
  cursor: pointer;
  padding: 3px;
  line-height: 20px;
}

/deep/.el-table td div {
  display: block;
}

/deep/ .el-table--border {
  border: 0;
}

/deep/.el-table--enable-row-transition .el-table__body td {
  padding: 0;
  height: 60px;
}

/deep/.el-table .cell {
  width: 100%;
  padding: 0;
  white-space: nowrap;
}

.deleteImg {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 8px;
  right: 7px;
  background: url(./img/delete.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.classp {
  margin: 0;
  overflow: hidden;
  height: 20%;
  white-space: nowrap;
  cursor: pointer;
}

.classP :hover {
  color: blue;
}

.selectedActive {
  /* border: 1px solid rgba(63,146,254,1); */
  color: red;
}

.selectedPeopleActive {
  border: 1px solid black;
}

.modeOut {
  display: flex;
  background: rgba(249, 251, 255, 1);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 10px;
}

.selectMode-l span {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 145, 255, 1);
  width: 100%;
  text-align: center;
  display: block;
  cursor: pointer;
  margin-top: 6px;
}

.selectMode-r p {
  margin: 0;
}

.peopleHistory {
  width: 73%;
  height: 28px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 85px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-wrap: wrap;
  overflow: hidden;
}

.classTitle {
  width: 86px;
}

.classInput {
  width: 60%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid rgba(221, 221, 221, 0.82);
}

.classPeoleChange {
  color: #fff;
  text-align: center;
  cursor: pointer;
  margin-left: 8px;
  width: 74px;
  background: rgba(0, 145, 255, 1);
  border-radius: 5px;
}

.classTypeLeader {
  width: 95%;
  height: 30px;
  margin: 0 auto;
  display: flex;
  line-height: 30px;
  margin-bottom: 10px;
}
/deep/ .el-table::before {
  height: 0;
}
/deep/ .el-input__inner {
  height: 30px;
  border: 0;
}
/deep/ .el-table td {
  padding: 0;
}
.classTypeWorker {
}

.classP1 {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #0593ff;
}

.classType {
  width: 90%;
  margin: 0 auto;
}

.classType p {
  margin: 0;
}

/deep/ .el-radio {
  padding: 10px;
}

.radioDiv {
  width: 95%;
  margin: 0 auto;
  margin-top: 11px;
}

.modeContent {
  padding: 10px;
  border-left: 1px solid #e9ecf1;
  line-height: 22px;
}

.modeContent p {
  padding: 0;
  margin: 0;
}

/deep/ .el-dialog__body {
  padding: 0;
}

.selectwarning {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #facd91;
}

.lastMon {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: url(./img/left.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.nextMon {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: url(./img/you.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.selectMon {
  margin: 0 20px;
  font-size: 20px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.el-header {
  background: #fff;
  /* line-height: 88px; */
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  height: 88px !important;
  align-content: center;
}

.selectMode {
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
}

.selectMode .selectMode-l {
  font-size: 16px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  height: 66px;
}

.selectMode .selectMode-r {
  margin-left: 15px;
  color: #666;
  height: 66px;
  background: rgba(247, 248, 250, 1);
  border-radius: 5px;
  padding: 0 16px;
  line-height: 30px;
}

.selectTime {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
}
>>> .el-table__body {
  width: 100%;
}
.classP {
}
.autoPaiban {
  height: 40px;
  margin-top: 22px;
  background: #1e9fff;
  color: #fff;
}
</style>
<style>
</style>