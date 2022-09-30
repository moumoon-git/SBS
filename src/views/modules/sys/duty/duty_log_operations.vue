<template>
  <div>
    <div class="wraps">
      <header class="header">
        <div class="selectwarning">
          <i class="el-icon-arrow-left" style="cursor: pointer;" @click="getPreDay(selectDay)"></i>
          <div class="selectMon">
            {{ month }}月{{ selectDay }}日 &nbsp;{{ week }}
            <i class="el-icon-caret-bottom" :style="{'z-index': -1}"></i>
            <el-date-picker
              v-model="date"
              value-format="yyyy-M-d"
              align="left"
              type="date"
              class="datePicker"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <i class="el-icon-arrow-right" style="cursor: pointer;" @click="getNextDay(selectDay)"></i>
          <el-button type="primary" v-if="`${year}-${month}-${selectDay}` != new Date().formatDate('yyyy-M-d')" @click="sameDayHandle(new Date().formatDate('yyyy-M-d'))">
            今天
          </el-button>
        </div>
        <el-button plain class="export" @click="exportFile()">导出</el-button>
      </header>
      <div class="content">
        <!--中间-->
        <!--        时间线-->
        <div class="middle">
          <!--          标题-->
          <!-- <header class="middle_header">
            {{
              atDate.split("-")[0] +
                "年" +
                atDate.split("-")[1] +
                "月" +
                atDate.split("-")[2] +
                "日"
            }}值班日志
          </header> -->
          <div class="middle_cont">
            <div class="treeDate">
              <div class="allDate" style="height:754px;overflow-y: scroll;padding: 0 20px;background-color: #F7F8FA;">
                <div
                  v-for="item in allDate"
                  :key="item"
                  :class="[dateClick && item == selectDay?'selectStyle':'', `${year}-${month}-${item}` === new Date().formatDate('yyyy-M-d')?'currentDayStyle':'']"
                  class="dayHandle"
                  @click="dayClick(item)"
                >
                  {{ item }}
                  <span class="dataPoint" v-if="dutyLogOperations.indexOf(`${year}-${month>9?month:'0'+month}-${item>9?item:'0'+item}`)>-1"></span>
                </div>
              </div>
            </div>
            <!--        时间线-->
            <!-- <div class="timeLine">
              <timeLine ref="timeLines" />
            </div> -->
            <!--          输入文本-->
            <div class="primarys">
              <div class="allimg">
                <!--          标题-->
                <div class="middle_header">
                  {{ `${year}年${month}月${selectDay}日值班日志` }}
                </div>
                <div class="selectHandle" v-if="isAddOrEdit">
                  <div class="operateHandle">
                    <el-button @click="selectHandler('EventTable')">
                      选择事件
                    </el-button>
                    <el-button @click="selectHandler('PhoneTable')">
                      选择电话
                    </el-button>
                    <el-button @click="selectHandler('MsgTable')">
                      选择短信
                    </el-button>
                  </div>
                  <div class="operationCompleted">
                    <el-button @click="cancelHandle">
                      取消
                    </el-button>
                    <el-button type="primary" v-if="updataDataBtn" @click="saveBtns">
                      保存
                    </el-button>
                    <el-button type="primary" v-else @click="updataData">
                      保存
                    </el-button>
                  </div>
                </div>
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  content="新增"
                  placement="top"
                >
                  <i
                    class="el-icon-document"
                    style="cursor: pointer; color: #000"
                    :style="{
                      color:
                        atDate <= dateFormatter(new Date()).split(' ')[0]
                          ? '#000'
                          : '#ccc',
                    }"
                    @click="addEvents"
                  />
                </el-tooltip> -->
                <!-- 只有当天才显示新增、修改、删除按钮 -->
                <el-button
                  v-if="`${year}-${month}-${selectDay}` == new Date().formatDate('yyyy-M-d')"
                  type="primary"
                  @click="addEvents"
                >新增
                </el-button>
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit-outline"
                    style="cursor: pointer"
                    :style="{
                      color:
                        atDate <= dateFormatter(new Date()).split(' ')[0]
                          ? '#000'
                          : '#ccc',
                    }"
                    @click="upEvent()"
                  />
                </el-tooltip> -->
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  content="导出"
                  placement="top"
                >
                  <i
                    class="el-icon-download"
                    style="cursor: pointer"
                    :style="{
                      color:
                        atDate <= dateFormatter(new Date()).split(' ')[0]
                          ? '#000'
                          : '#ccc',
                    }"
                    @click="exportFile()"
                  />
                </el-tooltip> -->
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    :style="{
                      color:
                        atDate <= dateFormatter(new Date()).split(' ')[0]
                          ? '#000'
                          : '#ccc',
                    }"
                    @click="delEvent"
                  />
                </el-tooltip> -->
              </div>
              <div
                ref="placed"
                style="
                  border-radius: 5px;
                  padding-left: 10px;
                  height: 650px;
                  overflow: scroll;
                  display:flex;
                  align-items: baseline;
                "
              >
                <el-timeline class="timeline">
                  <el-timeline-item
                    v-for="(item, index) in dataArr"
                    :key="item.id"
                    :timestamp="item.updateTime
                      && item.updateTime.split(' ')[1].substring(0,5)"
                    :type="currTime === index ? 'primary' : ''"
                    size="large"
                    @click.native="watchTimeLine(index)"
                  />
                </el-timeline>
              <!-- 内容 -->
              <!-- <div v-for="(item, index) in dataArr" :class="['dailyLog', idx === index?'selectDailyLog':'']" @click="watchDailyLog(item, index)"> -->
                <div
                  v-if="dataArr && dataArr.length > 0"
                  class="dailyLog selectDailyLog"
                  @click="watchDailyLog()"
                >
                  <div class="dutyTime">
                    {{ dataArr[currTime].updateTime.split(" ")[1].substring(0,5) }}
                  </div>
                  <primarys ref="primarys" />
                  <div
                    class="dutyHuman"
                  >
                    <span style="display: inline-block;margin: 3px">值班人员</span>

                  <!-- <div v-if="item.readonly" class="dutyHumanText">
                    {{
                      state
                    }}
                  </div> -->

                  <!-- <el-autocomplete
                    v-if="!item.readonly"
                    v-model="state"
                    popper-class="my-autocomplete"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect"
                  >
                    <template slot-scope="{ item }">
                      <div class="name">
                        {{ item.name }}
                      </div>
                      <span class="addr">{{ item.position }}</span>
                    </template>
                  </el-autocomplete> -->
                    <textarea
                      cols="95"
                      v-model="dataArr[currTime].dutyPerson"
                      placeholder="请输入内容"
                      rows="4" maxlength="500"
                      :readonly="dataArr[currTime].readonly"
                      :class="dataArr[currTime].readonly ? 'actives' : ''"
                    />
                  </div>

                  <div
                    style="
                      margin-left: 12px;
                      font-size: 14px;
                      font-weight: bolder;
                      margin-top: 10px;
                    "
                  >
                    <p
                      class="adjunct"
                      style="margin-bottom: 10px"
                    >
                      附件信息
                    </p>
                    <div
                      v-if="!dataArr[currTime].readonly"
                      class="file_wrap"
                    >
                      <el-upload
                        ref="upload"
                        class="upload-demoupload-demo"
                        :action="$http.adornUrl('/duty/dutyLogOperations/uploadImg')"
                        :file-list="dataArr[currTime].dutyLogOperationsAnnexEntityList"
                        :with-credentials="true"
                        :on-preview="handlePictureCardPreview"
                        :http-request="uploadSectionFile"
                        :before-remove="beforeRemove"
                        multiple
                      >
                        <div class="uploadStyle">
                          <span class="uploadIcon" />
                          上传附件
                        </div>
                      <!--                   <div slot="tip" class="el-upload__tip">一次只能上传3张jpg/png文件，且不超过500kb</div>-->
                      </el-upload>
                    </div>
                    <div
                      v-if="dataArr[currTime].readonly"
                      class="file_wrap"
                    >
                      <div
                        v-for="(item, index) in dataArr[currTime].dutyLogOperationsAnnexEntityList"
                        :key="item.id"
                        style="display: flex; align-items: center;margin-right: 10px;"
                        @click="_export(item)"
                      >
                        <span
                          class="fileStyle"
                        >
                          {{ item.name }}
                        </span>
                        <!--                      </a>-->
                      </div>
                    </div>
                  </div>

                  <sv-table-operation
                    v-if="dataArr[currTime].id
                      && `${year}-${month}-${selectDay}` == new Date().formatDate('yyyy-M-d')"
                    :display="['edit', 'delete']"
                    @edit="upEvent(currTime)"
                    @delete="$refs.changeHint.visible = true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--        右边-->
        <div class="lishiRight">
          <div style="padding: 10px 27px 0 18px">
            <header
              class="middle_header"
              style="margin-bottom: 10px; padding-bottom: 5px; font-size: 19px"
            >
              交班事项
            </header>
            <div style="overflow: auto; height: 700px;padding-right: 5px;">
              <rich
                ref="richx"
                style="width: 100%; margin: auto; overflow: hidden"
                @refreshDuty="nextDuty"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-dialog
      ref="commonDialog"
      @sendContent="sendContent"
    />

    <!-- 删除弹窗 -->
    <sv-dialog-hint
      ref="changeHint"
      type="delete"
      @confirm="delEvent"
    />
  </div>
</template>
<script>
import Bus from '@/utils/bus';
import dutylogs from '@/mock/modules/dutylog';
import moment from 'moment';
import dutylogoperationsTable from './dutylogoperations-table';
import calendar from './dateplug-in/datePlug';
import timeLine from './dateplug-in/timeLine';
import primarys from './dateplug-in/primarys';
import rich from './dateplug-in/rich';
import evenInfo from './dateplug-in/evenInfo/evenInfo';
import callInfo from './dateplug-in/evenInfo/callInfo';
import CommonDialog from './dialogComponent/CommonDialog.vue';

export default {
  name: 'Dutylog',
  components: {
    dutylogoperationsTable,
    calendar,
    timeLine,
    primarys,
    rich,
    evenInfo,
    callInfo,
    CommonDialog,
  },
  data() {
    return {
      // 登录用户名
      userName: '',
      timeType: '',
      value: new Date(),
      input: '',
      fileList: [
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
      ],
      updataFileList: [],
      dialogImageUrl: '',
      atDate: this.dateFormatter(new Date()).split(' ')[0],
      chooseDate: '',
      restaurants: [],
      state: '',
      dataArr: '',
      Btn: {
        dtuy: true,
        callInfo: false,
      },
      BtnArr: [
        {
          name: '交班记录',
          me: 'dtuy',
        },
        {
          name: '值班要情',
          me: 'eventInfo',
        },
        {
          name: '电话记录',
          me: 'callInfo',
        },
        {
          name: '短信记录',
          me: 'msgInfo',
        },
      ],
      NextList: '',
      EventList: '',
      PhoneList: '',
      MsgList: '',
      readonly: false,
      sleteDatas: {
        record: '',
        handleOpnion: '',
        instruction: '',
      },
      updataDataBtn: true,
      operatorIds: '',
      top: '',
      bottom: '',
      right: '',
      left: '',
      year: '',
      month: '',
      dateClick: true,
      selectDay: '',
      week: '',
      yearClick: false,
      monthClick: false,
      allMonth: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      allDate: [],
      toDay: '',
      toMonth: '',
      // 所选天
      nowDay: '',
      // 所选年
      // 控制日期控件按钮开关
      date: '',
      isAddOrEdit: false,
      idx: 0, // 当前编辑的索引值
      dutyLogOperations: [], // 当月所有数据
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      currTime: 0, // 当前点击时间轴
    };
  },
  computed: {
    allYear() {
      const year = [];
      for (let index = new Date().getFullYear() - 10; index < new Date().getFullYear() + 10; index++) {
        year.push(`${index}年`);
      }
      return year;
    },
    existData() {
      this.$nextTick(()=>{
        console.log('this.dutyLogOperations.indexOf(`${this.year}-${this.month>9?this.month:0+this.month}-${this.selectDay>9?this.selectDay:0+this.selectDay}`) == 1: ', this.dutyLogOperations.indexOf(`${this.year}-${this.month>9?this.month:'0'+this.month}-${this.selectDay>9?this.selectDay:'0'+this.selectDay}`) == 1);
        return this.dutyLogOperations.indexOf(`${this.year}-${this.month>9?this.month:'0'+this.month}-${this.selectDay>9?this.selectDay:'0'+this.selectDay}`) == 1
      })
    }
  },
  watch: {
    value(newvalue, oldvalue) {
      this.datefun(newvalue);
      const newDate = this.datefun(newvalue);
      // console.log(newDate)
      Bus.$emit('history', newDate);
    },
    month(newvalue) {
      this.getDutyLogOperations();
    },
    date(newvalue) {
      this.sameDayHandle(newvalue);
    },
  },
  async mounted() {
    // ahthor:xuchuangxing lastUpdateTime:2021/6/4  默认显示树形日期
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.year = year;
    this.month = month;
    // 判断月份哪些有数据
    await this.getDutyLogOperations();
    this.mGetDate(year, month);
    this.selectDay = day;
    this.chooseDate = `${year}-${month > 10 ? month : '0' + month}-${day > 10 ? day : '0' + day}`;
    this.$refs.richx.chooseDate = this.chooseDate;
    this.getWeek();
    // 获取登录用户信息
    this.getUserInfo();
    this.styleS();
    const that = this;
    that.loadAll();
    that.richFlush(this.atDate);
    that.dutyloghttp(this.atDate);
    Bus.$emit('history', this.datefun(this.value));
    Bus.$off('selMomentDate');
    Bus.$on('selMomentDate', (data) => {
      console.log('data: ', data);
      that.richFlush(data);
      that.dutyloghttp(data);
      that.atDate = this.dateFormatter(data);
      this.$refs.richx.init(that.atDate);
      // this.$refs.timeLines.update(data);
    });
    this.$refs.richx.init(that.atDate);
    // Bus.$off('timeLine');
    // Bus.$on('timeLine', (data, idx) => {
    //   // console.log(data)
    //   if (data.addEvent) {
    //     const that = this;
    //     // 时间线的渲染传值
    //     // const datas = {
    //     //   duty: data.record,
    //     //   handling: data.handleOpnion,
    //     //   instructions: data.instruction,
    //     //   readonly: false,
    //     // };
    //     that.state = this.userName;
    //     that.fileList = [...data.dutyLogOperationsAnnexEntityList];
    //     that.readonly = false;
    //     // that.$refs.primarys[idx].upVal(datas);
    //     that.sleteDatas = data;
    //     that.updataDataBtn = true;
    //   } else {
    //     // 时间线的渲染传值
    //     // const datas = {
    //     //   duty: data.record,
    //     //   handling: data.handleOpnion,
    //     //   instructions: data.instruction,
    //     //   readonly: true,
    //     // };
    //     this.state = data.dutyPerson;
    //     this.readonly = true;
    //     // this.$refs.primarys[idx].upVal(datas);
    //     this.sleteDatas = data;
    //     this.fileList = [...data.dutyLogOperationsAnnexEntityList];
    //   }
    // });
    this.https(
      this.$http.adornUrl(dutylogs.dutylogs_EventList.url),
      dutylogs.dutylogs_EventList.method,
      'EventList',
    );
    this.https(
      this.$http.adornUrl(dutylogs.dutylogs_PhoneList.url),
      dutylogs.dutylogs_PhoneList.method,
      'PhoneList',
    );
    this.https(
      this.$http.adornUrl(dutylogs.dutylogs_MsgList.url),
      dutylogs.dutylogs_MsgList.method,
      'MsgList',
    );
    // this.https (dutylogs.dutylogs_EventList.url, dutylogs.dutylogs_EventList.method, this.NextList)
    const oldDate = new Date(new Date().getTime() - 86400000);
    that.nextDuty(oldDate.toLocaleDateString().replace(/\//g, '-'));

    // setInterval(() => {
    //   console.log('that.$refs: ', that.$refs);
    //   if (that.$refs.placed) {
    //     that.top = parseInt(that.$refs.placed.getBoundingClientRect().top);
    //     that.bottom = parseInt(
    //       that.$refs.placed.getBoundingClientRect().bottom,
    //     );
    //     that.right = parseInt(that.$refs.placed.getBoundingClientRect().right);
    //     that.left = parseInt(that.$refs.placed.getBoundingClientRect().left);
    //     const obj = {
    //       top: that.top,
    //       bottom: that.bottom,
    //       right: that.right,
    //       left: that.left,
    //     };
    //     Bus.$emit('juli', obj);
    //     //   console.log(that.top, that.bottom, that.right, that.left)
    //   }
    // }, 10);
    Bus.$off('IFjuli');
    Bus.$on('IFjuli', (data) => {
      for (const x in data) {
        // eslint-disable-next-line eqeqeq
        if (x == 'dutyLogId') {
          // 交班记录的数据
          console.log('交班记录的数据', data, x);
          data.record = data.content;
          data.handleOpnion = '';
          data.instruction = '';
          that.primarysLoad(data);
          that.selEvent();
          return;
        }
        // eslint-disable-next-line eqeqeq
        if (x == 'reportName') {
          // 事件信息的数据
          // console.log('事件信息的数据', data, x)
          const datas = {
            record: data.title,
            handleOpnion: '',
            instruction: '',
          };
          that.primarysLoad(datas);
          that.selEvent();
          return;
          // eslint-disable-next-line eqeqeq
        } if (x == 'phoneCalled') {
          // 电话记录数据
          // console.log('距离可以', data, x)

          let str = `在${data.connectedTime ? data.connectedTime : ''}时`;
          // eslint-disable-next-line eqeqeq
          if (data.callType == 0) {
            //  0为呼入 1为呼出
            str
              += `${data.contactName ? data.contactName : ''
              }电话号码为${
                data.phoneCalling ? data.phoneCalling : ''
              }给${
                data.name ? data.name : ''
              }拨打了一个电话`;
            // eslint-disable-next-line eqeqeq
          } else if (data.callType == 1) {
            //  0为呼入 1为呼出
            str
              += `${data.name ? data.name : ''
              }给${
                data.contactName ? data.contactName : ''
              }电话号码为${
                data.phoneCalled ? data.phoneCalled : ''
              }拨打了一个电话`;
          }
          const datas = {
            record: str,
            handleOpnion: '',
            instruction: '',
          };
          that.primarysLoad(datas);
          that.selEvent();
          return;
          // eslint-disable-next-line eqeqeq
        } if (x == 'receiverUser') {
          // 短信记录数据
          // console.log('距离可以', data, x)
          const str = `在${
            data.createTime ? data.createTime : ''
          }时${
            data.name ? data.name : ''
          }给${
            data.receiverName ? data.receiverName : ''
          }【${
            data.phone ? data.phone : ''
          }】`
            + `发送了一条短信内容为:${
              data.content ? data.content : ''}`;
          const datas = {
            record: str,
            handleOpnion: '',
            instruction: '',
          };
          that.primarysLoad(datas);
          that.selEvent();
          return;
        }
      }
    });
    setTimeout(() => {
      that.BtnSC();
    }, 10);
    setTimeout(() => {
      const data = {};
      that.fileList = [...data.dutyLogOperationsAnnexEntityList];
      that.fileList = [];
      that.updataFileList = [];
    }, 500);

    // 置顶当天日期
    this.$nextTick(() => {  
      document.getElementsByClassName('allDate')[0].scrollTop = document.getElementsByClassName('selectStyle')[0].offsetTop - 70;
    });
  },
  methods: {
    /**
     * 描述
     * @date 2021-08-20
     * @param {any} activeTable 渲染的弹窗表格
     * @returns {any}
     */
    selectHandler(activeTable) {
      this.$refs.commonDialog.getTableData(activeTable);
    },
    sendContent(content) {
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', content);
      this.$refs.primarys.insertContent(content);
    },

    /**
     * 获取登录用户信息
     */
    getUserInfo() {
      this.$http.get(`${window.SITE_CONFIG.event}/app/sjs/duty/dutyLogAutofill/list?date=${new Date().formatDate('yyyy-MM-dd')}`)
        .then(({ data }) => {
          if (data.errorcode === 0) {
            let text = '';
            data.data.forEach((v) => {
              const name = v.contactorName.join('、');
              text += `${v.groupName}：${name}\n`;
            });
            this.userName = text;
            this.state = text;
          }
        });
    },
    /**
     * 判断月份哪些有数据
     */
    async getDutyLogOperations() {
      const { data } = await this.$http.get(`${window.SITE_CONFIG.baseUrl}/duty/dutyLogOperations/date?date=${this.year}-${this.month > 9 ? this.month: '0'+this.month}`)
      if (data.code === 0) {
        this.dutyLogOperations = data.list;
      }
    },
    /**
     * @description: 监听点击事件来判断点击的是年还是月
     * @param {String} timeType 值为year或者month，用来判断是按天导出还是按月导出
     * @return {*}
     */
    changeTimeType(timeType) {
      this.timeType = timeType;
    },
    /**
     * @description: 根据时间导出值班日志
     */
    exportFile() {
      let yearDate = '';
      if (this.timeType === 'year') {
        yearDate = moment(this.atDate).format('YYYY-MM');
      } else {
        yearDate = this.atDate;
      }
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogOperations/export?strDate=${yearDate}`),
        method: 'post',
        data: this.$http.adornData({
        }),
        responseType: 'arraybuffer',
      }).then(({ data }) => {
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), '导出数据.xls');
        } else {
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }));
          a.download = '导出数据.xls';
          document.body.appendChild(a);// 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      }).catch((error) => {
        this.$message.error(error);
      });
    },
    // 格式化起始时间结束时间
    dateFormatter(str, hasTime) {
      // 默认返回yyyy-MM-dd HH-mm-ss, 可传第二个参数false，返回yyyy-MM-dd
      const d = new Date(str);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hour = String(d.getHours()).padStart(2, '0');
      const minute = String(d.getMinutes()).padStart(2, '0');
      const second = String(d.getSeconds()).padStart(2, '0');
      if (hasTime) {
        return (
          `${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`
        );
      }
      return [year, month, day].join('-');
    },
    nextDuty(data) {
      const date = {
        date: this.dateFormatter(data),
      };
      const datas = {
        url: this.$http.adornUrl(dutylogs.dutylogs_listByDate.url),
        method: dutylogs.dutylogs_listByDate.method,
        params: this.$http.adornParams(date),
      };
      this.$http(datas)
        .then((res) => {
          if (res && res.data.code === 0) {
            // console.log(res)
            // eslint-disable-next-line standard/object-curly-even-spacing
            this.$refs.duty.init({
              msg: true,
              eventRecord: false,
              type: '1',
              data: res.data.list,
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          // console.log(err)
        });
    },
    BtnSkip(item) {
      // 切换按钮
      const that = this;
      for (const x in this.Btn) {
        this.Btn[x] = false;
      }
      // 电话记录引用的模块和其他模块不一致单独做处理
      console.log('按钮切换逻辑判断', item.me);
      if (item.me != 'callInfo') {
        this.Btn.dtuy = true;
      } else {
        this.Btn.callInfo = true;
      }
      // console.log(this.Btn, this.$refs.duty)
      // eslint-disable-next-line eqeqeq
      if (item.me == 'dtuy') {
        setTimeout(() => {
          const oldDate = new Date(new Date().getTime() - 86400000);
          // console.log(oldDate.getFullYear())
          const datetime = `${oldDate.getFullYear()
          }-${
            oldDate.getMonth() + 1 < 10
              ? `0${oldDate.getMonth() + 1}`
              : oldDate.getMonth() + 1
          }-${
            oldDate.getDate() + 1 < 10
              ? `0${oldDate.getDate() + 1}`
              : oldDate.getDate() + 1}`;

          that.nextDuty(datetime);
        });
      } else if (item.me == 'eventInfo') {
        // 值班要情
        setTimeout(() => {
          that.$refs.duty.init({
            msg: true,
            eventRecord: true,
            type: '2',
            data: that.EventList,
          });
        });
      } else if (item.me == 'callInfo') {
        // 电话记录
        setTimeout(() => {
          that.$refs.callInfo.init(that.PhoneList);
        });
        // eslint-disable-next-line eqeqeq
      } else if (item.me == 'msgInfo') {
        setTimeout(() => {
          that.$refs.duty.init({
            msg: false,
            eventRecord: false,
            type: '3',
            data: that.MsgList,
          });
        });
      }
    },
    https(url, type, ele) {
      console.log('要情列表、电话列表、信息列表请求');
      console.log(url);
      // NextList EventList PhoneList MsgList this.$http.adornUrl(dutylogs.dutylogs_List.url) dutylogs.dutylogs_List.method
      const that = this;
      // 值班员列表
      const datas = {
        url,
        method: type,
        params: this.$http.adornParams(),
      };
      this.$http(datas)
        .then((res) => {
          if (res && res.data.code === 0) {
            that[ele] = res.data.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          // console.log(err)
        });
    },
    dateFormate(){
      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
      var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      var dateStr = year + "-" + month + "-" + day;
      return dateStr
    },
    dutyloghttp(data) {
          console.log('11111111111111')
    console.log(this.atDate,data)
      // 查询值班记录
      const date = {
        date: this.dateFormatter(data),
        orderBy: 'update',
      };
      const datas = {
        url: this.$http.adornUrl(dutylogs.dutylogs_ByDay.url),
        method: dutylogs.dutylogs_ByDay.method,
        params: this.$http.adornParams(date),
      };
      this.$http(datas)
        .then((res) => {
          if (res && res.data.code === 0) {
            // eslint-disable-next-line eqeqeq
            if (res.data.data.length != 0) {
              // console.log(res.data.data)
              // 时间线的渲染传值
              this.dataArr = res.data.data;
              this.currTime = 0;
              this.dataArr.forEach(item => {
                item.readonly = true;
              });
              this.state = res.data.data[0].dutyPerson;
              this.fileList = [...res.data.data[0].dutyLogOperationsAnnexEntityList];
              this.sleteDatas = res.data.data[0];
            } else {
              // 新增时 值班员名字为当前登录人员
              if (!this.readonly) {
                // this.state = this.username;
                console.log(this.readonly, this.state);
              } else {
                this.state = '';
              }
              this.dataArr = [];
              this.fileList = [];
              this.sleteDatas = {
                record: '',
                handleOpnion: '',
                instruction: '',
              };
            }
            this.readonly = true;
            // this.updateDutyLogs();
            // 时间轴初始化
            this.$nextTick(() => {
              this.watchTimeLine(0);
            });
            // this.$refs.timeLines.init(res.data.data);
            // console.log(res.data)
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          // console.log(err)
        });
    },
    updateDutyLogs() {
      this.$nextTick(() => {
        this.dataArr.forEach((element, index) => {
          let datasx = null;
          datasx = {
            duty: element.record || '',
            handling: element.handleOpnion || '',
            instructions: element.instruction || '',
            readonly: true,
          };
          this.$refs.primarys.upVal(datasx);
        });
      });
    },
    dutylogsave(dutyLogOperations) {
      const that = this;
      this.$http({
        url: this.$http.adornUrl('/duty/dutyLogOperations/saveDutyLogOperation'),
        method: 'POST',
        data: this.$http.adornParams(dutyLogOperations),
      }).then((data) => {
        if (data && data.data.code === 0) {
          that.richFlush(that.atDate);
          that.dutyloghttp(that.atDate);
          this.$message({
            type: 'success',
            message: '保存成功!',
          });
          const data = {};
          that.fileList = [];
          that.updataFileList = [];
          that.state = this.userName;
          that.isAddOrEdit = false;
        } else {
          this.$message.error(data.data.msg);
        }
      })
        .catch((err) => {
          // console.log(err)
        });
      // that.updataFileList = []
      // that.fileList = []
      // let ul = document.querySelector('.el-upload-list')
      // ul.innerHTML = ''
      // that.state = ''
    },
    // 交班刷新
    richFlush(data) {
      this.$refs.richx.requests(data);
    },
    datefun(data) {
      // eslint-disable-next-line one-var
      const DateArr = data.toLocaleDateString().split('/'),
        newDateArr = [];
      DateArr.forEach((ele, ind) => {
        if (ele < 10) {
          ele = `0${ele}`;
        }
        newDateArr.push(ele);
      });
      return newDateArr.join('-');
    },
    handleChange(file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList.slice(-3);
    },
    handlePictureCardPreview(file, fileList) {
      this.dialogImageUrl = file.url;
    },
    uploadSectionFile(param) {
      const that = this;
      const form = new FormData();
      form.append('file', param.file);
      form.append('type', 10);
      const ele = param.file;
      this.$http({
        url: dutylogs.dutylogs_uploadImg.url,
        baseURL: window.SITE_CONFIG.fileupload,
        method: dutylogs.dutylogs_uploadImg.method,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(({ data }) => {
          if (!data) {
            this.$message.error('上传失败');
            return;
          }
          data.url = `${data.data.url}`;
          let typeName1 = '';
          if (/(image)/g.test(param.file.type)) {
            typeName1 = 'image';
          } else if (/(excel)/g.test(param.file.type)) {
            typeName1 = 'excel';
          } else if (/(word)/g.test(param.file.type)) {
            typeName1 = 'word';
          }
          const obj = {
            url: data.data.url,
            name: data.data.title,
            typeName: typeName1,
            attachmentId: data.data.id,
          };
          that.updataFileList.push(obj);
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {});
    },
    beforeRemove(file, fileList) {
      for (let i = 0; i < this.updataFileList.length; i++) {
        if (file.name == this.updataFileList[i].name) {
          // 后端说删除文件直接清空url就行
          // this.updataFileList.splice(i, 1);
          this.updataFileList[i].url = '';
          // console.log(file.name, this.updataFileList)
          // 每次只能删除一个
          return;
        }
      }
    },
    saveBtns() {
      const result = this.$refs.primarys.init();
      if (!result.duty && result.duty != ' ') {
        this.$message({
          type: 'error',
          message: '值班内容不能为空!',
        });
        return;
      }
      if (!this.dataArr[this.idx].dutyPerson && this.dataArr[this.idx].dutyPerson !== ' ') {
        this.$message({
          type: 'error',
          message: '值班员不能为空!',
        });
        return;
      }
      this.isAddOrEdit = false;
      // {
      //   id
      //   dutyLogId        当班日志
      //   date             日志事项日期
      //   record           值班内容
      //   recordType       值班记录来源渠道
      //   instruction      领导批示
      //   dutyPerson       值班员名称
      //   handleOpnion     处理情况
      //   contactId        联系人ID
      //   operatorId       办理人ID
      //   createTime       创建时间
      //   updateTime       更新时间
      //   isDeleted        删除状态
      //   platformId       平台ID
      // }
      const newArray = []; // 用于存储图片的数组
      // eslint-disable-next-line eqeqeq
      if (this.updataFileList.length != 0) {
        this.updataFileList.forEach((ele, index) => {
          const obj = {
            url: ele.url,
            name: ele.name,
            typeName: ele.typeName,
            attachmentId: ele.attachmentId,
          };
          newArray.push(obj);
        });
      }
      const contactId = this.operatorIds;

      this.$refs.upload.submit();
      Bus.$emit('selMomentDate', this.chooseDate); // 更新当前值班日志
      //   this.$refs.updateDatePlug.selectCalendar({ _d: new Date() }); //更新当前值班日志
      const data = {
        id: '',
        dutyLogId: '',
        date: this.chooseDate,
        record: result.duty,
        // record: this.$refs.primarys.init().duty,
        recordType: '',
        instruction: result.instructions,
        // instruction: this.$refs.primarys.init().instructions,
        dutyPerson: this.dataArr[this.idx].dutyPerson,
        handleOpnion: result.handling,
        // handleOpnion: this.$refs.primarys.init().handling,
        contactId,
        dutyLogOperationsAnnexEntityList: newArray,
        operatorId: '',
        createTime: '',
        updateTime: '',
        isDeleted: '',
        platformId: '',
      };
      console.log('data', data);
      this.dutylogsave(data);
    },
    querySearch(queryString, cb) {
      // 值班员选择
      const { restaurants } = this;
      const results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase())
          === 0
      );
    },
    loadAll() {
      const that = this;
      // 值班员列表
      const datas = {
        url: this.$http.adornUrl(dutylogs.dutylogs_List.url),
        method: dutylogs.dutylogs_List.method,
        params: this.$http.adornParams(),
      };
      this.$http(datas)
        .then((res) => {
          console.log('值班员列表', res.data.data);
          res.data.data.forEach((ele, index) => {
            ele.value = ele.name;
          });
          that.restaurants = res.data.data;
        })
        .catch((err) => {
          // console.log(err)
        });
    },
    handleSelect(item) {
      // console.log(item)
      this.operatorIds = item.id;
    },
    handleIconClick(ev) {
      // console.log(ev)
    },
    // 新增
    addEvents() {
      if (this.dataArr.length && !this.dataArr[0].id) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.currTime = 0;
      this.idx = 0;
      // eslint-disable-next-line eqeqeq
      this.state = this.userName;
      if (this.atDate <= this.dateFormatter(new Date()).split(' ')[0]) {
        this.isAddOrEdit = true;
        this.readonly = false;
        this.dataArr.unshift({ dutyPerson: this.state, readonly: false, updateTime: new Date().formatDate('yyyy-MM-dd hh:mm'), dutyLogOperationsAnnexEntityList: [] });
        // 时间轴初始化
        // this.watchTimeLine(this.currTime);
        // this.updateDutyLogs();
        this.$nextTick(() => {
          let datasx = null;
          //  添加新的值班日志 状态切换和值得清空
          datasx = {
            duty: '',
            handling: '',
            instructions: '',
            readonly: false,
          };
          this.$refs.primarys.upVal(datasx);
        });
        console.log('this.dataArr: ', this.dataArr);
        // this.$refs.timeLines.adds();
        this.updataDataBtn = true;
        this.sleteDatas = {
          record: '',
          handleOpnion: '',
          instruction: '',
        };
      }
      this.fileList = [];
      this.updataFileList = [];
    },
    upEvent(idx) {
      // 选择事件等操作要用
      //  更改值班日志
      // eslint-disable-next-line eqeqeq
      if (this.atDate <= this.dateFormatter(new Date()).split(' ')[0]) {
        this.isAddOrEdit = true;
        // console.log(this.sleteDatas)
        const currentData = this.dataArr[idx];
        const datas = {
          duty: currentData.record || '',
          handling: currentData.handleOpnion || '',
          instructions: currentData.instruction || '',
          readonly: false,
        };
        this.$refs.primarys.upVal(datas);
        this.dataArr[idx].readonly = false;
        if (currentData) {
          this.updataDataBtn = false;
        }
        this.readonly = false;
        this.updataFileList = this.dataArr[idx].dutyLogOperationsAnnexEntityList;
        this.sleteDatas = currentData;
      }
    },
    updataData() {
      //  修改按钮
      //   console.log(this.$refs.primarys.init(), this.fileList)
      // this.$refs.upload.submit()
      const data = this.sleteDatas;
      // 值班内容
      data.record = this.$refs.primarys.init().duty;
      data.instruction = this.$refs.primarys.init().instructions;
      data.dutyPerson = this.dataArr[this.currTime].dutyPerson;
      data.handleOpnion = this.$refs.primarys.init().handling;
      const newArray = []; // 用于存储图片的数组
      if (this.updataFileList.length != 0) {
        this.updataFileList.forEach((ele, index) => {
          const obj = ele;
          if (!ele.url && ele.data) {
            obj.url = ele.data.url;
          }
          newArray.push(obj);
        });
      }
      data.dutyLogOperationsAnnexEntityList = newArray;
      this.dutylogsave(data);
      // this.$refs.timeLines.oneActive();
    },
    delEvent() {
      if (!this.sleteDatas.id) {
        this.$message({
          type: 'error',
          message: '没有日志可删除',
        });
        return;
      }
      //  删除值班日志{id}
      const that = this;
      // eslint-disable-next-line eqeqeq
      if (this.atDate <= this.dateFormatter(new Date()).split(' ')[0]) {
        const datas = {
          url: this.$http.adornUrl(
            dutylogs.dutylogs_Del.url + this.sleteDatas.id,
          ),
          method: dutylogs.dutylogs_Del.method,
          data: '',
        };
        this.$http(datas)
          .then((res) => {
            console.log('res', res);
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              that.richFlush(that.atDate);
              that.dutyloghttp(that.atDate);
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg,
              });
            }
          })
          .catch((err) => {
            // console.log(err)
          });
      }
    },
    primarysLoad(data) {
      const datas = {
        duty: data.record,
        handling: data.handleOpnion,
        instructions: data.instruction,
        readonly: false,
      };
      this.$refs.primarys.upVal(datas);
      // this.$refs.timeLines.adds();
      this.updataDataBtn = true;
      this.readonly = false;
    },
    selEvent() {
      this.fileList = [];
      this.atDate = this.dateFormatter(new Date()).split(' ')[0];
      this.richFlush(this.atDate);
      this.$refs.richx.init(this.atDate);
    },
    BtnSC() {
      const BtnS = document.querySelectorAll('.BtnS');
      if (BtnS.length != 0) {
        BtnS[0].style.color = '#fff';
        BtnS[0].style.background = '#409EFF';
        for (let i = 0; i < BtnS.length; i++) {
          BtnS[i].onclick = function (e) {
            for (let j = 0; j < BtnS.length; j++) {
              BtnS[j].style.background = '#fff';
              BtnS[j].style.color = '#000';
            }
            this.style.background = '#409EFF';
            this.style.color = '#fff';
          };
        }
      }
    },
    _export(item) {
      const a = document.createElement('a');
      const url = window.SITE_CONFIG.cloudUrl + item.url;
      fetch(url).then((res) => res.blob().then((blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        const filename = item.name || item.url.substring(item.url.lastIndexOf('/') + 1);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }));
    },
    styleS() {
      const div = document.getElementById('pane-sys/duty/duty_log_operations')
        .children;
      // console.log(div[0].children[0])
      div[0].children[0].className = 'dutyLog';
    },
    mGetDate(year, month) {
      this.allDate = [];
      const date = new Date(year, month, 0).getDate();
      for (let index = date; index > 0; index--) {
        this.allDate.push(index);
      }
    },
    handleYear(command) {
      this.year = command;
      this.yearClick = false;
      this.mGetDate(this.year.substring(0, 4), this.month.substring(0, 1));
    },
    handleMonth(command) {
      this.month = command;
      this.monthClick = false;
      this.mGetDate(this.year.substring(0, this.year.indexOf('年')), this.month.substring(0, this.month.indexOf('月')));
    },
    dayClick(item){
      this.isAddOrEdit = false;
        let date;
        this.selectDay = item;
        this.dateClick = true;
        this.monthClick = false;
        this.yearClick = false;
        let year = this.year
        let month = this.month
        let day = item
        date =  year + '-'+ (Number(month)>9?Number(month):'0'+Number(month)) + '-' +(Number(day)>9?Number(day):'0'+Number(day))
        this.chooseDate = date
        this.$refs.richx.chooseDate = date
        Bus.$emit("selMomentDate",date)
        let eqDate = year + '-'+ Number(month) + '-' +(Number(day)>9?Number(day):'0'+Number(day));
        let eqToday = new Date().toLocaleDateString().replace(/\//g, '-');
        if (eqDate == eqToday) {
          this.getUserInfo();
        }

        this.getWeek();
    },
    // 获取上一天
    getPreDay(day) {
      this.isAddOrEdit = false;
      this.selectDay = day - 1;
      if (this.selectDay === 0) {
        this.month = this.month - 1;
        const days = new Date(this.year, this.month, 0);
        this.selectDay = days.getDate(); // 获取当前日期中月的最后一天
      }
      if (this.month === 0) {
        this.month = 12;
        this.year = this.year - 1;
      }

      this.mGetDate(this.year, this.month);

      this.getWeek();
      this.dayClick(this.selectDay);
    },
    // 获取下一天
    getNextDay(day) {
      this.isAddOrEdit = false;
      this.selectDay = day + 1;
      const days = new Date(this.year, this.month, 0);
      const date = days.getDate(); // 获取当前日期中月的最后一天
      if (this.selectDay > date) {
        this.month = this.month + 1;
        this.selectDay = 1;
      }
      if (this.month > 12) {
        this.month = 1;
        this.year = this.year + 1;
      }

      this.mGetDate(this.year, this.month);

      this.getWeek();
      this.dayClick(this.selectDay);
    },
    /**
     * 获取当天数据
     */
    sameDayHandle(data) {
      this.isAddOrEdit = false;
      const date = data.split('-');
      this.year = date[0];
      this.month = date[1];
      this.selectDay = date[2];

      this.mGetDate(this.year, this.month);
      this.getWeek();
      this.dayClick(this.selectDay);
    },
    /**
     * 获取所选星期
     */
    getWeek() {
      const weekDay = `${this.year}-${this.month}-${this.selectDay}`;
      this.week = '星期' + '日一二三四五六'.charAt(new Date(weekDay).getDay());
    },
    /**
     * 取消按钮  回复原状
     */
    cancelHandle() {
      this.isAddOrEdit = false;
      this.dataArr[this.idx].readonly = true;
      if (!this.dataArr[0].id) {
        this.dataArr.shift();
        // this.updateDutyLogs();
        // 时间轴初始化
        this.watchTimeLine(this.currTime);
        return;
      }
      const dutyData = this.dataArr[this.idx];
      const datas = {
        duty: dutyData.record,
        handling: dutyData.handleOpnion,
        instructions: dutyData.instruction,
        readonly: true,
      };
      this.$refs.primarys.upVal(datas);
    },
    watchDailyLog() {
      this.idx = this.currTime;
      // if (this.dataArr[index].id && !this.dataArr[0].id) {
      //   this.isAddOrEdit = false;
      //   this.dataArr.shift();
      //   this.updateDutyLogs();
      // }
      // Bus.$emit('timeLine', data);
    },
    watchTimeLine(index) {
      if (this.dataArr.length === 0) {
        return;
      }
      this.isAddOrEdit = false;
      this.$nextTick(() => {
        console.log(index);
        this.currTime = index;
        // 修改值班内容
        const datas = {
          duty: this.dataArr[index].record || '',
          handling: this.dataArr[index].handleOpnion || '',
          instructions: this.dataArr[index].instruction || '',
          readonly: this.dataArr[index].readonly,
        };
        this.$refs.primarys.upVal(datas);
        this.watchDailyLog(this.dataArr[index], index);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.wraps {
  background: rgb(235, 238, 245);
  width: 100%;
  position: relative;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.content {
  display: flex;
  height: 100%;
  margin: 0 10px;
}
.el-button:active {
  color: #409eff;
  border-color: #409eff;
}
.file_wrap .el-button:focus,
.file_wrap .el-button:hover {
  color: #fff;
  border-color: #409eff;
  background: #409eff
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAwCAYAAABe6Vn9AAAEeklEQVRoQ+1a/1UUMRCeqUCsQKlAqICbbUCsQKlArECoQKhArEBo4AYq8KjAowKxgvi+NVmzuWST7O5x7/nIf1yyk/mS+fHNBKaZh6ruGWOOmPmYiF4T0R4RHdhtVkT0SERrY8w1M9+JCP6ebfBcklR1QUQfiQhAasY1EV2KyG3NR6m1kwGpKm7hMxF9mKgQgH0SkfUUOZMAqSpAfLFmFdXDGHPnTzDz0YDCMD+AuhoLajQgVcWtnIUbG2MemPmCiG5FBD6zMVQVPrUwxpwy86vIkjMROR8DahQgVYXC8JduWCBQpOp0ccvGmLMIMPjVaS2oakDWzL4GG93Ah8ZGLERGIsJBvA3kntQeUBUgayo/gk2/icjUgNCKVFWAeh/IP0yZbuz2agEpbN8TNBsYJzMCCr4opaZXDMjmGQBqhzHmnpkXY80spaBNzLfM/MZb805EENazowbQT5v5ndAqU8hq4i2ImPZaRPZLZBQBimwwu6mFykZMr+gASwEhfCKBbv12PF9CrvIDEBIu0sXgKAUEwS3BRL5pmgZ0Z+tjuVyuvfy0EpHD3KalgIwnaFTCyykSmw/NTkSy+mYXYCNV9QGdi8gG5RmjcO4bVcU+oFjtmAVQJCBUZ++c4qn5CCvJBobsDYX55+9BzVO75ICO2TsJyNY5oCGIcOBabuzyhlBeINIhbUTrpg1AligiRKf42c58KLhR8D6E8l4J3wNkwYDeuB5AzCq2nlS9XBQjq75OqLfgAh2oDlAKDCpOZka9D5I4S92f851w3voSCsJFpOLtgfIBdcnTJtDf6NzsCsRA5AMwdIxeeGu6pNsCCsPjtph07c0MgEKrLGTkbbBygEImvT+1+zKX8gOgQL+gtxstI+dI8po1ilnfdP0H0KbZGoshkyCiEwCqphelpx8JNBtRqVTWwE31aBkvl0vYYtsrm5tJ+7I9hapK6hxgn5G3EVlV/dLgrmkav2eQk5ecTzQ83PorETkZLdz7MDi0FW5o5ep3IJwDkKqGBWFM91l8NbCwe9wQmg+uH/YoIi+nnFyib5cSOZkXquovj2veAFB4mqNDdqJvlzufbEkwEBA2ynQACuP5qIrUggEP9Jl5DgzmEcbBx6J98CEBkZb0fptYfT+yAor7YG7DiAxMXYY98MRvRf0CH5yq4h3qu/sN7KZpmoMo9ak9tcgtY5+WlQfle1tGJyJgsaknrOEf9cHusRcFPJeUPmsE+aDrqiYA9bhYTf5LPON0btKrhxKJEJUh7HsFQuiumJkffL5nT80VhTiIluLEANnf4Wuu2YK81PkQbtwY070boeVsazQEgV4LLUw1GwWepeZDr2wOU1EeSQHKOHuPjqXW2loNJc5mgRc6nDHmIvG6tnNA9nHtNNbAH2qSwCTwutY+z0fAPekNWRAwS5g9TDTK2rNtrODmfJ6H+iP7Yj3S5OAnna/UVM1VgEqyZLhmDKAx+3TBasrHJd8+Ayo5pYE1zyZXe4D/ncmFlAgEsvZQatY/hckd4z9FoBQzIxlutfv6B3MHjrBanpwbAAAAAElFTkSuQmCC");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.middle {
  width: calc(100% - 444px);
  background: #fff;
  padding: 0 20px 0 0;
  border-right: 1px solid #DCDEE0;
}
.middle_header {
  position: relative;
  color: #333;
  font-weight: 600;
  font-size: 17px;
  padding-left: 10px;
}
.middle_header:before {
  content: "";
  display: block;
  width: 2px;
  height: 16px;
  background: #409eff;
  position: absolute;
  left: 0;
  top: 6px;
}
.middle_cont {
  display: flex;
  // 树形年下拉日期样式
  .treeDate{
    display:flex;
    flex-direction: column;
    // 树形天下拉日期样式
    .dayHandle{
      text-align: center;
      width: 37px;
      height: 37px;
      border: 1px solid #DCDEE0;
      line-height: 37px;
      border-radius: 50%;
      box-sizing: border-box;
      background: #F7F8FA;
      color: #C8C9CC;
      margin: 25px 0;
      position: relative;
      .dataPoint{
        position: absolute;
        right: 0;
        top: 0;
        background-color: #0091ff;
        width: 5px;
        height: 5px;
        border-radius: 50%;
      }
    }
    .allDate{
      // 树形日期父节点 选中样式
      .selectStyle{
        color:white;
        background-color: #0091FF;
        position: relative;
        &::after{
          content: '';
          width: 9px;
          height: 14px;
          background: no-repeat url('../../../../assets/img/point2.png') center/100% 100%;
          position: absolute;
          right: -14px;
          top: 12px;
        }
      }
      // 当天日期样式
      .currentDayStyle{
        color: #0091ff;
        border: 1px solid #0091ff;
        background-color: white;
      }
      // 树形下拉日期样式
      .dropdown{
          margin-right:5px;
      }
    }
  }
}
.primarys {
  flex: 1;
  box-sizing: border-box;
  margin-top: 15px;
  width: 85%;
  .dailyLog {
    border-radius: 5px;
    border: 1px solid #EBEDF0;
    margin: 10px 10px 0;
    padding-bottom: 12px;
    position: relative;
    .dutyTime{
      padding: 7px 0 7px 12px;
      margin-bottom: 12px;
      color: #0091ff;
      background: #F7F8FA;
      border-radius: 5px 5px 0 0;
    }
    &:hover{
      :global(.sv-table-operation){
        display: inline-block;
      }
    }
  }
  // 选中日志
  .selectDailyLog{
    border-radius: 5px;
    border: 1px solid #0091FF;
    height: calc(100% - 10px);
    width: 100%;
  }
}
.allimg {
  text-align: right;
  // padding-right: 15px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  height: 50px;
  .selectHandle{
    display: flex;
    justify-content: space-between;
    width: 435px;
    border-radius: 23px;
    border: 1px solid #0091FF;
    padding: 9px 15px;
    .el-button--medium{
      border-radius: 20px;
      color: #969799;
      border: 1px solid #C8C9CC;
      padding: 7px 9px;
    }
    .operationCompleted{
      .el-button--medium{
        padding: 7px 15px;
      }
    }
  }
}
.allimg > i {
  font-size: 24px;
  color: #ccc;
}
.lishiRight {
  width: 444px;
  background: #fff;
}
.lishiRight /deep/ .w-e-text-container {
  height: 260px !important;
}
.file_wrap {
  position: relative;
  /*height: 200px;*/
  padding-right: 10px;
  width: 100%;
  // margin-bottom: 50px;
  /*overflow: auto;*/
  // display: flex;
  // flex-direction: column;
  // overflow: auto;
  .fileStyle{
    display: block;
    overflow: hidden;
    white-space: inherit;
    text-overflow: ellipsis;
    color: #0091ff;
    cursor: pointer;
    &:hover {
      opacity: .5;
    }
  }
}
.file_wrap /deep/ .el-upload-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-top: -30px;
  border: none;
  align-items: baseline;
}
.file_wrap /deep/ .el-upload-list > li {
  /*display: none;*/
  flex: 1;
  border: none;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.upload-demo {
  position: relative;
}

.dutyHuman {
  position: relative;
  margin-top: 20px;
  font-size: 14px;
  font-weight: bolder;
  margin: 0 12px;
  .dutyHumanText{
    height: 85px;
  }
}
.adjunct {
  position: relative;
  // padding-left: 8px;
}
.dutyHuman /deep/ .el-input--medium {
  width: 131px;
  height: 29px;
  border-radius: 8px;
}
.dutyHuman /deep/ .el-input--medium > input {
  height: 27px;
}
.dutyLog {
  min-height: 825px !important;
}

// 值班日志新样式 需求978
// 头部样式
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  background-color: white;
  padding: 6px 20px 6px 10px;
  .selectwarning {
    display: flex;
    align-items: center;
    color: #646566;
    .el-button--medium{
      border-radius: 20px;
      color: #969799;
      border: 1px solid #C8C9CC;
      padding: 5px 15px;
      margin-left: 20px;
    }
  }
  .selectMon {
    margin: 0 10px;
    position: relative;
    // 修改时间控件样式为下三角
    .datePicker {
      width: 10px;
      height: 7px;
      position: absolute;
      top: 8px;
      right: 2px;
      overflow: hidden;
      :global(.el-input__inner) {
        width: 7px;
        height: 7px;
        line-height: initial;
        border-radius: initial;
        border: initial;
        padding: 0;
        transform: rotate(45deg);
        background-color: #7D7E80;
        position: absolute;top: -3px;
        left: 1px;
        cursor: pointer;
      }
      :global(.el-input__prefix) {
        display: none;
      }
      :global(.el-input__suffix) {
        display: none;
      }
    }
  }
  // 导出按钮样式
  .export{
    border: 1px solid #DEE4EC;
    color: #95A5BB;
  }
}

// 设置页面所有按钮间距
.el-button--medium{
  padding: 9px 15px;
}

.el-button--primary{
  height: initial !important;
}
.el-button+.el-button{
  margin-left: 3px;
}

// 当前页全局滚动条样式
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background-color: white;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
::-webkit-scrollbar-thumb {
  background-color: #EBEDF0;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

// 编辑删除样式
:global(.sv-table-operation){
  position: absolute;
  right: 12px;
  top: 9px;
  display: inline-block;
  width: initial;
  display: none;
  :global(.sv-table-operation__button) {
    width: 17px;
    height: 17px;
    margin: 0;
    &:first-child{
      margin-right: 17px;
    }
  }
}

// 值班人员样式
textarea{
  border: none;
  font-size: 14px;
  outline: none;
  line-height: 24px;
  resize:none;
  border: 1px solid #DCDEE0;
  border-radius: 5px;
  padding-left: 10px;
  width: 100%;
}

// 附件样式
.upload-demoupload-demo {
  &:global(.el-upload-list__item-name){
    color: #323233;
    font-weight:initial;
  }
  :global(.el-upload-list__item .el-icon-close){
    border-radius: 10px;
    background-color: #ccc;
    color: white;
  }
  :global(.el-upload-list__item-name [class^=el-icon]){
    display: none;
  }
  .uploadStyle{
    position: absolute;
    right: 14px;
    top: -32px;
    display: inline-block;
    color: #50b4ff;
    font-weight: initial;
    display: flex;
    align-items: center;
    .uploadIcon{
      width: 14px;
      height: 14px;
      display: inline-block;
      background: no-repeat url('../../../../assets/img/shape.png') center/100% 100%;
      margin-right: 3px;
    }
  }
}

.actives{
  border: none;
}
.timeline {
  height: calc(100% - 10px);
  display: grid;
  padding: 10px;
}
</style>