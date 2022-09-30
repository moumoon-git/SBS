<!--
 * @Author: yanghaohao
 * @Date: 2020-09-22 10:12:07
 * @LastEditTime: 2021-01-05 15:35:47
 * @LastEditors: Liukanglin
 * @Description: 垃圾分类的统计报告中的考勤统计页面
 * @FilePath: /SBS/src/views/modules/GarbageClassification/StatisticsReport/AttendanceStatistics/AttendanceStatistics.vue
-->
<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :search-setting="{
        width: '280px',
        placeholder: '请输入打卡地点、打卡人员名字关键字'
      }"
      :export-select-config="{
        api:
          changeBoolen === 0
            ? '/garbage/garbageMember/xlsPunchclockOutputSelect'
            : '/garbage/garbagePunchClock/xlsOutputSelect',
        params: {
          limit: 1000000,
          groupIds: [],
          ids: []
        }
      }"
      :export-query-config="{
        api:
          changeBoolen === 0
            ? '/garbage/garbageMember/xlsPunchclockOutputCondition'
            : '/garbage/garbagePunchClock/xlsOutputCondition',
        params: {
          townId: townId,
          isParty: isParty,
          request: '1'
        }
      }"
      :import-data-config="{
        api: ''
      }"
      :download-template-config="{
        api: ''
      }"
      :delete-selected-config="{ api: '' }"
      title="考勤统计"
      :table-request="tableRequest"
      @refresh="getStatisticData"
      @tree-click="handleTreeClick"
    >
      <template #middle__operation__select>
        <el-button-group>
          <el-button
            type="plain"
            size="small"
            @click="changePage"
          >
            考勤统计
          </el-button>
          <el-button
            type="plain"
            size="small"
            @click="changePage2"
          >
            打卡记录
          </el-button>
        </el-button-group>
        <sv-select
          v-model="townId"
          :options="communityOptions"
          placeholder="请选择社区"
          @change="typeChange"
        />
        <sv-select
          v-model="isParty"
          :options="option"
          width="160px"
          placeholder="请选择是否为党员"
          @change="typeChange"
        />
      </template>
      <template #middle__statistics>
        <table class="statistic_table">
          <span class="statistic1">
            <td class="span_td">{{ statisticList.totalCount }}</td>
            <tr class="span_tr">
              总考勤人次
            </tr></span>
          <span class="span_line" />
          <span class="statistic">
            <td class="span_td">{{ statisticList.partyCount }}</td>
            <tr class="span_tr">
              党员考勤人数
            </tr></span>

          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.notPartyCount }}</td>
            <tr class="span_tr">
              非党员考勤数
            </tr></span>

          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.partyPunchClockCount }}</td>
            <tr class="span_tr">
              党员考勤时长（小时）
            </tr></span>

          <span class="span_line" />
          <span class="statistic">
            <td class="span_td">
              {{ statisticList.notPartyPunchClockCount }}
            </td>
            <tr class="span_tr">
              非党员考勤时长（小时）
            </tr></span>
        </table>
      </template>
      <template #middle__table>
        <template v-if="changeBoolen === 0">
          <el-table-column
            key="notPartyPunchClockCount_1"
            prop="name"
            header-align="center"
            align="center"
            label="考勤人员姓名"
          />
          <el-table-column
            key="notPartyPunchClockCount_2"
            prop="unit"
            header-align="center"
            align="center"
            label="单位"
          />
          <el-table-column
            key="notPartyPunchClockCount_3"
            prop="position"
            header-align="center"
            align="center"
            label="职务"
          />
          <el-table-column
            key="notPartyPunchClockCount_4"
            header-align="center"
            align="center"
            label="是否为党员"
          >
            <template slot-scope="scope">
              <span v-if="scope.row && scope.row.isParty === 2">否</span>
              <span v-if="scope.row && scope.row.isParty === 1">是</span>
            </template>
          </el-table-column>
          <el-table-column
            key="notPartyPunchClockCount_5"
            prop="punchClockCount"
            header-align="center"
            align="center"
            label="考勤次数"
          />
          <el-table-column
            key="notPartyPunchClockCount_6"
            header-align="center"
            align="center"
            label="守桶总时长（小时）"
          >
            <template slot-scope="scope">
              <span v-if="scope.row && scope.row.punchClockTotalTime != 0">
                {{ parseFloat(scope.row.punchClockTotalTime).toFixed(2) }}</span>
              <span v-if="scope.row && scope.row.punchClockTotalTime === 0">
                0</span>
            </template>
          </el-table-column>
          <el-table-column
            key="notPartyPunchClockCount_7"
            prop="punchClockLastTime"
            header-align="center"
            align="center"
            label="最后打卡时间"
          />
          <el-table-column
            key="notPartyPunchClockCount_8"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <sv-table-operation
                :display="['view']"
                @view="viewContent2(scope.row.id)"
              />
            </template>
          </el-table-column>
        </template>

        <template v-if="changeBoolen === 1">
          <el-table-column
            key="notPartyPunchClockCount_9"
            prop="sortName"
            header-align="center"
            align="center"
            label="打卡地点"
          />
          <el-table-column
            key="notPartyPunchClockCount_10"
            prop="townName"
            header-align="center"
            align="center"
            label="社区"
          />
          <el-table-column
            key="notPartyPunchClockCount_11"
            prop="memberEntity.name"
            header-align="center"
            align="center"
            label="打卡人员"
          />
          <el-table-column
            key="notPartyPunchClockCount_12"
            header-align="center"
            align="center"
            label="是否为党员"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.memberEntity &&
                    scope.row.memberEntity.isParty === 2
                "
              >否</span>
              <span
                v-if="
                  scope.row.memberEntity &&
                    scope.row.memberEntity.isParty === 1
                "
              >是</span>
            </template>
          </el-table-column>
          <el-table-column
            key="notPartyPunchClockCount_13"
            header-align="center"
            align="center"
            label="考勤班次"
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.shiftEntity && scope.row.shiftEntity.startTime
                }}~{{ scope.row.shiftEntity && scope.row.shiftEntity.endTime }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            key="notPartyPunchClockCount_14"
            prop="punchclockCount"
            header-align="center"
            align="center"
            label="打卡次数"
          />
          <el-table-column
            key="notPartyPunchClockCount_15"
            prop="memberEntity.punchClockLastTime"
            header-align="center"
            align="center"
            label="最后打卡时间"
          />
          <el-table-column
            key="notPartyPunchClockCount_16"
            header-align="center"
            align="center"
            label="守桶时长（小时）"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.memberEntity &&
                    scope.row.memberEntity.punchClockTotalTime === 0
                "
              >0</span>
              <span
                v-if="
                  scope.row.memberEntity &&
                    scope.row.memberEntity.punchClockTotalTime !== 0
                "
              >{{
                parseFloat(
                  scope.row.memberEntity.punchClockTotalTime
                ).toFixed(2)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            key="notPartyPunchClockCount_17"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <sv-table-operation
                :display="['view']"
                @view="viewContent(scope.row.id, scope)"
              />
            </template>
          </el-table-column>
        </template>
      </template>
    </sv-template>
    <!-- 考勤统计弹窗 -->
    <el-dialog
      width="1200px"
      title="考勤统计"
      :visible.sync="dialogVisible"
      class="dialog_css"
      @closed="clearDialog"
    >
      <div class="title">
        <span class="title_span">人员姓名：<span class="title_span_after">
          {{ dataCheckForm.name }}（{{ dataCheckForm.phone }}）</span></span>
        <span class="title_span">单位：<span class="title_span_after">{{
          dataCheckForm.unit
        }}</span></span>
        <span class="title_span">职务：<span class="title_span_after">{{
          dataCheckForm.position
        }}</span></span>
        <span class="title_span">人员类型：<span
          v-if="dataCheckForm.isParty === 1"
          class="title_span_after"
        >党员</span>
          <span
            v-if="dataCheckForm.isParty !== 1"
            class="title_span_after"
          >非党员</span>
        </span>
      </div>
      <div class="second_row">
        <span
          v-if="dateRange"
          class="header_dateRange"
        >
          <span
            class="button el-icon-arrow-left"
            @click="prev"
          />
          <span style="margin: 0 10px">
            {{ currentYear }}
            {{ dateRange === "1" ? `${currentMonth}月` : null }}
            {{
              dateRange === "2"? quarter : ""
            }}
          </span>
          <span
            class="button el-icon-arrow-right"
            @click="next"
          />
        </span>
        <span
          v-else
          class="header_dateRange"
        >
          <span class="button el-icon-arrow-left" />
          <span style="margin: 0 10px">全部</span>
          <span class="button el-icon-arrow-right" />
        </span>
        <sv-select
          v-model="dateRange"
          placeholder="全部"
          :options="dateRangeOptions"
          class="header_select"
          @change="handleDateRangeChange"
        />
        <sv-button @click="xlsPunchclockByMemberOutputCondition">
          <span class="export-button" />导出
        </sv-button>
      </div>
      <div class="third_row">
        <table>
          <span class="span_css">
            <td class="span_td">{{ dataCheckForm.punchclockCount }}</td>
            <tr class="span_tr">
              守桶次数
            </tr>
          </span>

          <i class="third_row_line" />
          <span class="span_css">
            <td class="span_td">
              {{
                dataCheckForm.punchclockTotalTime === 0
                  ? 0
                  : parseFloat(dataCheckForm.punchclockTotalTime).toFixed(1)
              }}
            </td>
            <tr class="span_tr">
              守桶总时长（小时）
            </tr>
          </span>
        </table>
      </div>
      <div class="table_overflow">
        <div
          v-for="(item, index) in tableList"
          :key="index"
          v-loading="loading"
          class="table_css"
          element-loading-spinner="sv-loading"
        >
          <div
            class="table_title"
            @click="translateHandle(item.punchclockTime, item.pointId, index)"
          >
            <span class="title_item">{{ item.punchclockTime }}</span>
            <span class="title_item">守桶点:
              <el-popover
                placement="bottom"
                width="160"
                trigger="hover"
              >
                <span>{{ item.sortName }}</span>
                <span slot="reference">{{ item.sortName }}</span>
              </el-popover>
            </span>
            <span class="title_item">考勤班次:
              <el-popover
                placement="bottom"
                width="190"
                trigger="hover"
              >
                <span
                  v-for="(range, rangeIndex) in item.garbageShiftList"
                  :key="rangeIndex"
                >
                  {{ range.startTime }}-{{ range.endTime }}
                </span>
                <span
                  v-if="item.garbageShiftList.length === 1"
                  slot="reference"
                >
                  {{ item.garbageShiftList[0].startTime }}-{{
                    item.garbageShiftList[0].endTime
                  }}
                </span>
                <span
                  v-if="item.garbageShiftList.length > 1"
                  slot="reference"
                >
                  {{ item.garbageShiftList[0].startTime }}-{{
                    item.garbageShiftList[0].endTime
                  }}...
                </span>
              </el-popover>
            </span>
            <span class="title_item">打卡次数:{{ item.punchclockCount }}</span>
            <span class="title_item">守桶时长（小时）:{{
              item.punchclockTotalTime === 0
                ? 0
                : parseFloat(item.punchclockTotalTime).toFixed(1)
            }}</span>
            <img
              :class="{
                title_image: !item.expand,
                title_image2: item.expand
              }"
              src="../../../../../assets/img/arrow.png"
            >
          </div>
          <div
            v-for="(card, cardIndex) in item.detail"
            :key="cardIndex"
            :class="{ hide_card: !item.expand, display_card: item.expand }"
          >
            <div class="period_title">
              <img
                class="period_title_img"
                src="../../../../../assets/img/lineTwo.svg"
              >
              <span class="period_title_span">考勤班次：{{ card.shift }}</span>
              <i class="period_title_line" />
              <span class="period_title_span2">
                打卡次数:{{ card.punchclockList[0].punchclockCount }}</span>
              <i class="period_title_line2" />
              <span class="period_title_span">守桶时长（小时）:{{
                card.punchclockTotalTime === 0
                  ? 0
                  : parseFloat(card.punchclockTotalTime).toFixed(1)
              }}</span>
              <img
                class="period_title_img2"
                src="../../../../../assets/img/lineTwo2.svg"
              >
              <img>
            </div>
            <div
              v-for="(cardItem, itemIndex) in card.punchclockList[0]
                .punchClockList"
              :key="`cardPunchclockList${itemIndex}`"
              class="period_card"
            >
              <div
                style="cursor:pointer"
                @click="imgRemarkChange(index, cardIndex, itemIndex)"
              >
                <img
                  v-if="cardItem.shiftType === '1'"
                  class="period_card_img"
                  src="../../../../../assets/img/qiandao.svg"
                >
                <img
                  v-if="cardItem.shiftType === '2'"
                  class="period_card_img"
                  src="../../../../../assets/img/ligang.svg"
                >
                <img
                  v-if="cardItem.shiftType === '3' || cardItem.shiftType === '4'"
                  class="period_card_img"
                  src="../../../../../assets/img/gengxin.svg"
                >
                <span class="period_card_time">打卡时间:<span class="period_card_time_css">{{
                  cardItem.shiftTime
                }}</span></span>
                <img
                  class="period_card_img2"
                  src="../../../../../assets/img/background7.svg"
                >
              </div>
              <div
                :class="{
                  period_card_imgRemark: !cardItem.imgRemarkVisible,
                  period_card_noImgRemark: cardItem.imgRemarkVisible
                }"
              >
                <viewer :images="recordImgList">
                  <img
                    v-for="(imgItem, imgIndex) in card.punchclockList[0].imgList"
                    :key="`imgListItem${imgIndex}`"
                    :src="imgItem.allUrl"
                    style="height:70px;padding:10px;cursor:pointer"
                  >
                </viewer>
                <div class="period_card_remark">
                  打卡说明：<span class="period_card_remark_css">{{
                    cardItem.remark
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <ViewAttendanceRecord ref="ViewAttendanceRecord" />
  </div>
</template>
<script>
import axios from 'axios'
import ViewAttendanceRecord from './ViewAttendanceRecord.vue';

export default {
  components: {
    ViewAttendanceRecord,
  },
  data() {
    return {
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      // 班次时间统计
      timeList: '',
      // 社区列表
      communityOptions: [],
      // 决定是考勤还是打卡
      changeBoolen: 0,
      isParty: '',
      townId: '',
      // 统计数据
      statisticList: [],
      // 考勤统计弹窗查看布尔值
      dialogVisible: false,
      // 组Id
      groupIds: '',
      // 当前选择的树节点
      currentNode: '',
      pageIndex: 1,
      // 判断是新增还是编辑，为1是编辑,为0是新增
      type: 0,
      currentId: '',
      // 考勤打卡数据
      dateRange: '',
      dateRangeOptions: [
        {
          label: '每月',
          value: '1',
        },
        {
          label: '每季度',
          value: '2',
        },
        {
          label: '每年',
          value: '3',
        },
      ],
      loading: false,
      currentYear: '',
      currentMonth: '',
      currentQuarterly: '',
      tableList: [],
      dataCheckForm: {
        dateValue: '',
        startTime: '',
        endTime: '',
        periodValue: '',
        // 弹窗的第一行和第三行数据
        punchclockCount: '',
        punchclockTotalTime: '',
        name: '',
        unit: '',
        position: '',
        phone: '',
        isParty: '',
      },
      dataForm: {
        // 选择的分组名称，这个是保存在选择分组时在弹窗里选择的值
        selectTreeNodeName: '',
        // 已选择的分组名
        name: '',
        // 树的搜索值
        searchName: '',
        // 树Id
        treeId: '',
        // 分组描述
        groupDesc: '',
        // 父Id
        parentId: 0,
      },
      // 打卡记录的图片地址数组
      recordImgList: [],
      // 使用自定义模板参数
      treeSetting: {
        tab: [],
        api: ['/garbage/garbageMemberGroup/list'],
        edit: false,
      },
      tableRequest: {
        api: '/garbage/garbageMember/list',
        params: {
          groupIds: this.groupIds,
          townId: this.townId,
          isParty: this.isParty,
          request: '1',
        },
      },
      option: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 2,
        },
      ],
    };
  },
  computed: {
    quarter() {
      if (this.currentQuarterly === 1) return '第一季度';
      if (this.currentQuarterly === 2) return '第二季度';
      if (this.currentQuarterly === 3) return '第三季度';
      if (this.currentQuarterly === 4) return '第四季度';
      return '';
    },
  },
  mounted() {
    this.getCommunityType();
  },
  methods: {
    /**
     * @description: 导出
     * @param {*}
     * @return {*}
     */
    xlsPunchclockByMemberOutputCondition() {
      const request = {
        method: 'post',
        url: '/garbage/garbageMember/xlsPunchclockByMemberOutputCondition',
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
        data: {
          id: this.currentId,
          startTime: '',
          endTime: '',
        },
        responseType: 'arraybuffer',
      };
      axios(request).then((response) =>{
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(
            new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            '考勤统计导出.xls',
          );
        } else {
          // 后端导出响应头返回的content-disposition，文件名是filename字段，或许有的接口是返回fileName，所以加了判断
          const str = decodeURI(
            response.headers['content-disposition'],
          ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
          // 获取文件名
          // const fileName = decodeURI(
          //   response.headers['content-disposition'],
          // ).split(str)[1];
          const fileName = decodeURI(
            escape(response.headers['content-disposition']),
          ).split('fileName%3D')[1];
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(
            new Blob([response.data], { type: 'application/vnd.ms-excel' })
          );
          a.download = fileName || '考勤统计导出.xls';
          document.body.appendChild(a); // 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      });
    },
    /**
     * @description: 是否展开弹窗里守桶记录下的打卡卡片的照片和备注信息
     * @param {index:表格的第几行；itemIndex：打卡记录的第几行；punchIndex：具体的第几张卡片}
     * @return {type}
     */
    imgRemarkChange(index, itemIndex, punchIndex) {
      this.tableList[index].detail[itemIndex].punchclockList[0].punchClockList[
        punchIndex
      ].imgRemarkVisible = !this.tableList[index].detail[itemIndex]
        .punchclockList[0].punchClockList[punchIndex].imgRemarkVisible;
    },
    /**
     * @description: 提前从接口获取数据，防止刷新数据时间过长
     * @param {type}
     * @return {type}
     */

    init() {
      this.getTimeData();
    },
    /**
     * @description: 选择不同的时间周期进行切换
     * @param {type}
     * @return {type}
     */
    handleDateRangeChange() {
      const date = new Date();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      this.monthToQuarterly();
      this.getTimeData();
    },
    /**
     * @description: 根据当前月份，计算当前季度
     * @param {type}
     * @return {type}
     */
    monthToQuarterly() {
      const month = this.currentMonth;
      switch (true) {
        case (month > 0 && month <= 3): {
          this.currentQuarterly = 1;
          break;
        }
        case (month > 3 && month <= 6): {
          this.currentQuarterly = 2;
          break;
        }
        case (month > 6 && month <= 9): {
          this.currentQuarterly = 3;
          break;
        }
        case (month > 9 && month <= 12): {
          this.currentQuarterly = 4;
          break;
        }
        default:
          this.currentQuarterly = '';
      }
    },
    /**
     * @description: 根据季度，计算当前季度的第一个月
     * @param {type}
     * @return {type}
     */
    quarterlyToMonth() {
      switch (this.currentQuarterly) {
        case 1: {
          this.currentMonth = 1;
          break;
        }
        case 2: {
          this.currentMonth = 4;
          break;
        }
        case 3: {
          this.currentMonth = 7;
          break;
        }
        case 4: {
          this.currentMonth = 10;
          break;
        }
        default:
          this.currentMonth = '';
      }
    },
    /**
     * @description: 前一段时间
     * @param {type}
     * @return {type}
     */
    prev() {
      switch (this.dateRange) {
        case '1': {
          this.currentMonth -= 1;
          if (this.currentMonth === 0) {
            this.currentYear -= 1;
            this.currentMonth = 12;
          }
          this.monthToQuarterly();
          break;
        }
        case '2': {
          this.currentQuarterly -= 1;
          if (this.currentQuarterly === 0) {
            this.currentYear -= 1;
            this.currentQuarterly = 4;
          }
          this.quarterlyToMonth();
          break;
        }
        case '3': {
          this.currentYear -= 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
          break;
        }
        default: {
          this.currentYear -= 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
        }
      }
      this.getTimeData();
    },
    /**
     * @description: 后一段时间
     * @param {type}
     * @return {type}
     */
    next() {
      switch (this.dateRange) {
        case '1': {
          this.currentMonth += 1;
          if (this.currentMonth === 13) {
            this.currentYear += 1;
            this.currentMonth = 1;
          }
          this.monthToQuarterly();
          break;
        }
        case '2': {
          this.currentQuarterly += 1;
          if (this.currentQuarterly === 5) {
            this.currentYear += 1;
            this.currentQuarterly = 1;
          }
          this.quarterlyToMonth();
          break;
        }
        case '3': {
          this.currentYear += 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
          break;
        }
        default: {
          this.currentYear += 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
        }
      }
      this.getTimeData();
    },
    /**
     * @description: 获取相应时间段的数据
     * @param {type}
     * @return {type}
     */
    getTimeData() {
      this.loading = true;
      let startTime = '';
      let endTime = '';
      switch (this.dateRange) {
        case '1': {
          startTime = `${this.currentYear}-${this.currentMonth}-1`;
          endTime = `${this.currentYear}-${this.currentMonth}-31`;
          break;
        }
        case '2': {
          this.quarterlyToMonth();
          startTime = `${this.currentYear}-${this.currentMonth}-1`;
          endTime = `${this.currentYear}-${this.currentMonth + 2}-31`;
          break;
        }
        case '3': {
          startTime = `${this.currentYear}-1-1`;
          endTime = `${this.currentYear}-12-31`;
          break;
        }
        default: {
          startTime = '';
          endTime = '';
        }
      }
      const request = {
        method: 'post',
        url: 'garbage/garbageMember/punchclockList',
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        data: {
          startTime,
          endTime,
          id: this.currentId,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.tableList = response.data.data;
            this.tableList.forEach((element) => {
              this.$set(element, 'detail', []);
              this.$set(element, 'expand', false);
            });
          } else {
            window.console.log('获取信息失败！错误信息：【\n', response, '\n】');
          }
          this.loading = false;
        })
        .catch((error) => {
          window.console.log('获取信息失败！错误信息：【\n', error, '\n】');
          this.loading = false;
        });

      this.$http({
        url: this.$http.adornUrl(
          `/garbage/garbageMember/getMemberAndCount?id=${this.currentId}`,
        ),
        method: 'get',
        params: this.$http.adornParams({
          startTime,
          endTime,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataCheckForm.punchclockCount = data.data.punchclockCount;
          this.dataCheckForm.punchclockTotalTime = data.data.punchclockTotalTime;
          this.dataCheckForm.name = data.data.member.name;
          this.dataCheckForm.unit = data.data.member.unit;
          this.dataCheckForm.position = data.data.member.position;
          this.dataCheckForm.phone = data.data.member.phone;
          this.dataCheckForm.isParty = data.data.member.isParty;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 考勤统计弹窗的时间选择器，用来获取前一段时间
     * @param {type}
     * @return {type}
     */
    prevTime() {
      switch (this.dateRange) {
        case '1': {
          this.currentMonth -= 1;
          if (this.currentMonth === 0) {
            this.currentYear -= 1;
            this.currentMonth = 12;
          }
          this.monthToQuarterly();
          break;
        }
        case '2': {
          this.currentQuarterly -= 1;
          if (this.currentQuarterly === 0) {
            this.currentYear -= 1;
            this.currentQuarterly = 4;
          }
          this.quarterlyToMonth();
          break;
        }
        case '3': {
          this.currentYear -= 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
          break;
        }
        default: {
          this.currentYear -= 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
        }
      }
      this.getTimeData();
    },
    /**
     * @description: 考勤统计弹窗的时间选择器，用来获取后一段时间
     * @param {type}
     * @return {type}
     */
    nextTime() {
      switch (this.dateRange) {
        case '1': {
          this.currentMonth += 1;
          if (this.currentMonth === 13) {
            this.currentYear += 1;
            this.currentMonth = 1;
          }
          this.monthToQuarterly();
          break;
        }
        case '2': {
          this.currentQuarterly += 1;
          if (this.currentQuarterly === 5) {
            this.currentYear += 1;
            this.currentQuarterly = 1;
          }
          this.quarterlyToMonth();
          break;
        }
        case '3': {
          this.currentYear += 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
          break;
        }
        default: {
          this.currentYear += 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
        }
      }
      this.getTimeData();
    },
    /**
     * @description: 获取社区下拉框列表数据
     * @param {type}
     * @return {type}
     */
    getCommunityType() {
      this.$http({
        url: this.$http.adornUrl('/sys/systown/treeList'),
        method: 'post',
        params: this.$http.adornParams({
          module: '1',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.forEach((item) => {
            item.children.forEach((v) => {
              this.communityOptions.push({
                value: v.id,
                label: v.townName,
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取统计的相关数据，
     * @param {request包含你所有的请求数据,response则是接口响应返回的数据}
     * @return {type}
     */
    getStatisticData(request) {
      this.$http({
        url: this.$http.adornUrl('/garbage/garbageMember/getCount'),
        method: 'post',
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          townId: request.data.townId,
          isParty: request.data.isParty,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statisticList = data.data;
        } else {
          this.statisticList = [];
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description:切换打卡和考勤的表格数据
     * @param {type}
     * @return {type}
     */
    changePage() {
      this.changeBoolen = 0;

      this.tableRequest.api = '/garbage/garbageMember/list';

      this.$refs.template.getTableList(this.tableRequest);
    },
    changePage2() {
      this.changeBoolen = 1;
      this.tableRequest.api = '/garbage/garbagePunchClock/list';

      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 查看打卡记录的表格行数据
     * @param {传入当前行的id}
     * @return {type}
     */
    viewContent(id) {
      this.$refs.ViewAttendanceRecord.init(id);
    },
    /**
     * @description:查看考勤记录的弹窗页面
     * @param {type}表格的行id
     * @return {type}
     */
    viewContent2(id) {
      this.currentId = id;
      this.dialogVisible = true;
      if (this.dataCheckForm.dateValue) {
        [this.dataCheckForm.startTime, this.dataCheckForm.endTime] = this.dataCheckForm.dateValue;
      }
      this.init();
    },

    /**
     * @description: 点击树触发的事件
     * @param {type}树节点
     * @return {type}
     */
    handleTreeClick(obj) {
      if (obj === null) {
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
      } else {
        this.currentNode = obj;
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
        this.pageIndex = 1;
        if (this.currentNode) {
          // 新增或者编辑分组时回显分组名称
          if (this.type === 1) this.dataForm.name = this.currentNode.name;
          else this.dataForm.name = '';
          this.dataForm.selectTreeNodeName = this.currentNode.name;
          this.dataForm.parentId = this.currentNode.parentId;
        } else {
          // 此处为搜索框右边的新增按钮触发，默认为顶级分组
          this.dataForm.selectTreeNodeName = '顶级分组节点';
          this.dataForm.parentId = 0;
        }

        if (obj.id === 0) {
          this.groupIds = [];
          this.tableRequest.params.groupIds = this.groupIds;
        } else {
          this.groupIds = [obj.id];
          this.tableRequest.params.groupIds = this.groupIds;
        }

        if (obj.children != null) this.getChildren(obj.children);

        this.dataForm.treeId = obj.id;
      }

      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 点击树结点获取相应的子节点
     * @param {}点击的行数据
     * @return {}
     */
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.groupIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    /**
     * @description:关闭弹窗
     * @param {type}
     * @return {type}
     */
    clearDialog() {
      this.dialogVisible = false;
    },
    /**
     * @description:变更类型触发搜索
     * @param {type}
     * @return {type}
     */
    typeChange() {
      this.tableRequest.params.townId = this.townId;
      this.tableRequest.params.isParty = this.isParty;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description:翻转箭头
     * @param {time是获取接口需要的时间day，index是用来判断展开哪一个卡片}
     * @return {type}
     */
    translateHandle(time, pointId, index) {
      const day = time.split(' ')[0];
      this.$http
        .get(
          `${window.SITE_CONFIG.baseUrl}/garbage/garbageMember/punchclockListByDay?id=${this.currentId}&day=${day}&pointId=${pointId}`,
        )
        .then((response) => {
          this.tableList[index].detail = response.data.data;
          this.tableList[index].expand = !this.tableList[index].expand;
          this.recordImgList = [];
          this.tableList.forEach((ele) => {
            ele.detail.forEach((detail) => {
              detail.punchclockList[0].punchClockList.forEach((item) => {
                const tempImgList = JSON.parse(item.imgList);
                this.recordImgList.push(tempImgList[0].allUrl);
              });
            });
          });
          this.tableList.forEach((element) => {
            element.detail.forEach((item) => {
              item.punchclockList[0].punchClockList.forEach((listItem) => {
                this.$set(listItem, 'imgRemarkVisible', false);
              });
            });
          });
        });
    },
  },
};
</script>
<style src="./AttendanceStatistics.less" lang="less" >
</style>
