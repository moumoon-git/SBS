<!------值班人员 sjsOperatorOnDuty----->
<template>
  <div class="operator-on-duty-container">
    <!-- 检索操作 -->
    <operation
      :current-shift-idx="currentShiftIdx"
      @changeMonth="changeMonth"
      @search="search"
      @showSetting="showSetting"
      @exportShift="exportShift"
      @showScheduling="showScheduling"
      @showStatistics="showStatistics"
    />
    <!-- 表格 -->
    <div v-if="classList && classList.length > 0">
      <tab-page
        v-if="!searchText"
        :class-list="classList"
        :active-class="activeClassId"
        :mans-list="mansList"
        :total="total"
        @changeClass="changeClass"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
      <search-table
        v-if="searchText"
        :mans-list="mansList"
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <div
      v-else
      class="noList"
    >
      暂无值班人员
    </div>
    <!-- 人员设置弹窗 -->
    <personnel-settings
      v-if="isSettingShow"
      :class-list="classList"
      :active-class="activeClassId"
      @close="isSettingShow = false"
      @update="updateContactors"
    />
    <!-- 排班挂起弹窗 -->
    <scheduling-suspended
      v-if="isSchedulingShow"
      :class-list="classList"
      :active-class="activeClassId"
      @close="isSchedulingShow = false"
      @updateRules="updateRules"
    />

    <!-- 排班统计弹窗 -->
    <scheduling-statistics
      v-if="isStatisticsShow"
      :class-list="classList"
      :active-class="activeClassId"
      @close="isStatisticsShow = false"
    />
  </div>
</template>
<script>
import exportFile from '@/view/tool/exportFile'; // 下载文件
import Operation from './components/operation.vue';
import TabPage from './components/tabPage.vue';
import searchTable from './components/searchTable.vue';
import PersonnelSettings from './components/personnelSettings.vue';
import SchedulingSuspended from './components/schedulingSuspended.vue';
import schedulingStatistics from './components/schedulingStatistics';

export default {
  name: 'SjsOperatorOnDuty',
  components: {
    Operation,
    TabPage,
    PersonnelSettings,
    SchedulingSuspended,
    schedulingStatistics,
    searchTable,
  },
  data() {
    return {
      isSettingShow: false, // 人员设置弹窗是否可见
      isSchedulingShow: false, // 排班挂起是否可见
      isStatisticsShow: false, // 排班统计是否可见
      month: '', // 年月
      classList: [], // 班次列表
      activeClassId: '', // 当前激活的tab页面
      classId: 0, // 班次id
      mansList: [], // 班次下的所有人员
      total: 0, // 总条数
      page: 1,
      size: 10,
      searchText: '', // 搜索框内容
      currentShiftIdx: 0, // 当前班次索引值
    };
  },
  mounted() {
    this.getCurrentMonth();
    this.getRuleList();
  },
  methods: {
    // tab切换班次
    changeClass(classId) {
      // 根据当前选中班次索引值判断是否显示导出
      this.currentShiftIdx = this.classList.findIndex((v) => v.id === classId);
      this.activeClassId = classId;
      this.classId = Number(classId);
      // if (this.classList.length > 0) {
      //   this.classId = this.classList.filter(item => item.name === className)[0].id
      // }
      this.page = 1;
      this.size = 10;
      // this.getAllContactorByClassId(this.classId)
      this.getContactorByClassId(this.classId);
    },
    // 获取当年当月
    getCurrentMonth() {
      const time = new Date();
      const year = time.getFullYear(); // 得到年份
      let m = time.getMonth() + 1; // 得到月份
      m = m < 10 ? `0${m}` : m;
      this.month = `${year}-${m}`;
    },
    // 根据月份查询所有班次(值班人员处使用)
    getRuleList() {
      const data = {
        date: this.month,
      };
      this.$api.getRuleList(data).then((res) => {
        if (res.errorcode === 0) {
          this.classList = res.data;
          this.classList.forEach((item) => {
            item.id = item.id.toString();
          });
          if (res.data.length > 0) {
            // this.activeClass = res.data[0].name
            this.activeClassId = res.data[0].id.toString();
            this.classId = res.data[0].id;
            this.getContactorByClassId(res.data[0].id);
            // this.getAllContactorByClassId(res.data[0].id)
          }
        }
      });
    },
    // // 根据班次id查询值班人员
    // getAllContactorByClassId(classId) {
    //   let data = {
    //     classId: classId
    //   }
    //   this.$api.getAllContactorByClassId(data).then(res => {
    //     if (res.errorcode === 0) {
    //       this.mansList = res.data
    //       if (this.mansList.length > 0) {
    //         this.mansList.forEach(item => {
    //           if (item.day.length > 0) {
    //             item.daysList = item.day.split(',')
    //             this.changeWeek(item.daysList)
    //             // console.log('周工作日：', item.daysList)
    //           }
    //         })
    //       }
    //       console.log('值班人员列表：', this.mansList)
    //     }
    //   })
    // },
    // 根据班次id分页查询值班人员
    getContactorByClassId(classId) {
      const data = {
        classId,
        page: this.page,
        size: this.size,
      };
      this.$api.getContactorByClassId(data).then((res) => {
        this.mansList = res.data.content;
        this.total = res.data.totalElements;
        if (this.mansList.length > 0) {
          this.mansList.forEach((item) => {
            if (item.day && item.day.length > 0) {
              item.daysList = item.day.split(',');
              this.changeWeek(item.daysList);
            }
          });
        }
      });
    },
    changeWeek(week) {
      const dayList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      week.forEach((item, index) => {
        week[index] = dayList[Number(item) - 1];
      });
    },
    // 更改年月
    changeMonth(month) {
      this.month = month;
      if (this.searchText) {
        this.searchDutyPeople();
      } else {
        this.getRuleList();
      }
    },
    // 值班人员---搜索
    searchDutyPeople() {
      const data = {
        searchText: this.searchText,
        page: this.page,
        size: this.size,
        date: this.month,
        classesId: this.classId,
      };
      this.$api.searchDutyPeople(data).then((res) => {
        if (res.errorcode === 0) {
          this.mansList = res.data.content;
          this.total = res.data.totalElements;
        }
      });
    },
    // 搜索框搜索
    search(txt) {
      this.searchText = txt;
      if (txt) {
        this.searchDutyPeople();
      } else {
        this.getContactorByClassId(this.classId);
      }
    },
    // 导出默认第一个班次
    exportShift(month) {
      if (!!this.classList && this.classList.length > 0) {
        const firstId = this.classList[0].id;
        const url = '/eos/duty/sjsDutyContactor/exportWord';
        exportFile({
          url: window.g.ApiUrl + url,
          method: 'get',
          params: {
            classId: firstId,
            date: month,
          },
          token: this.$cookie.get('token'),
        });
      }
    },
    // 显示人员设置弹窗
    showSetting() {
      this.isSettingShow = true;
      // this.activeClassId = this.classList[0].sname
      // console.log('!!!!', this.classList)
    },
    // 显示排班挂起弹窗
    showScheduling() {
      // this.activeClassId = this.classList[0].name
      this.isSchedulingShow = true;
    },
    // 显示排班统计弹窗
    showStatistics() {
      this.isStatisticsShow = true;
    },
    handleSizeChange(val) {
      this.size = val;
      if (this.searchText) {
        this.searchDutyPeople();
      } else {
        this.getContactorByClassId(this.classId);
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.searchText) {
        this.searchDutyPeople();
      } else {
        this.getContactorByClassId(this.classId);
      }
    },
    updateRules() {
      this.getContactorByClassId(this.classId);
    },
    updateContactors() {
      this.getContactorByClassId(this.classId);
    },
  },
};
</script>
<style scoped>
.operator-on-duty-container {
  height: calc(100vh - 190px);
  /* margin: 20px 30px 20px 30px; */
  background: #ffffff;
  overflow: scroll;
}
.noList {
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 640px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 500px;
}
/deep/ .el-tabs__nav.is-top {
  display: flex;
}
</style>
