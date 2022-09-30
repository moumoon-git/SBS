<template>
  <div class="phoneHistoryIndex_wrap">
    <!-- 头部选择状态和日期及关键字-->
    <div class="header">
      <span>状态</span>
      <!--状态选择-->
      <div class="select_wrap">
        <el-select
          v-model="stateValue"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in stateListData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <!-- 日期-->
      <div class="header_date">
        <el-date-picker
          v-model="datevalue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </div>
      <!-- 搜索-->
      <div class="search_wrap">
        <el-input
          v-model="input"
          placeholder="请输入单位、号码"
          clearable
        />
        <el-button
          type="primary"
          @click="getSeachDateBtn"
        >
          <img
            src="../../../../../../static/img/Communihistory/Shape.png"
            alt
            width="14"
          />
        </el-button>
      </div>
    </div>
    <!--    主体内容-->
    <div
      class="content"
    >
      <el-table
        ref="refTable"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :data="footerPageObj.allData"
        :default-sort="{ prop: 'payment_date', order: 'descending' }"
        type="index"
        style="width: 100%; height: 100%"
        height="620"
        @row-click="expandChange"
        @expand-change="expandSelect"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <div class="from_content_wrap">
                <div class="from_content_left">
                  <span v-if="phoneHistoryFlag">备注</span>
                  <span v-else>内容</span>
                  <textarea
                    ref="mackeValueVessel"
                    v-model="mackeValue"
                    placeholder="请输入备注信息"
                    cols="5"
                    rows="10"
                  />
                  <div
                    v-if="!phoneHistoryFlag"
                    class="copyContentText"
                    @click="copyVesselValue"
                  />
                </div>

                <div class="from_content_right">
                  <ul>
                    <li
                      v-if="phoneHistoryFlag"
                      class="from_content_right_one"
                    >
                      <span>电话录音</span>
                      <div id="content_audio">
                        <audio
                          style="display: none"
                          controls
                          :src="apiUrl + props.row.url"
                        />
                      </div>
                      <div
                        v-if="isDisable"
                        class="coverAudio"
                      />
                    </li>

                    <li class="from_content_right_tow">
                      <span>关联事件</span>
                      <div>
                        <el-select
                          v-model="eventValue"
                          clearable
                          placeholder="请选择"
                          @change="clickEventValue"
                        >
                          <el-option
                            v-for="item in eventOptions"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                          />
                        </el-select>
                      </div>
                    </li>
                    <li class="from_content_right_three">
                      <span>处置状态</span>
                      <div>
                        <el-select
                          v-model="processValue"
                          clearable
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in stateListData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                        <el-button
                          type="primary"
                          @click="saveEvent(props.row)"
                        >
                          保存
                        </el-button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-if="phoneHistoryFlag"
          label="类型"
          prop="id"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.type == '已接'"
              class="accepted_del"
            >
              <span />
              已接
            </div>
            <!--          <div class="dialer_del" >-->
            <!--            <span></span>-->
            <!--            已拨-->
            <!--          </div>-->
            <div
              v-if="scope.row.type == '未接'"
              class="missed_del"
            >
              <span />
              未接
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名/电话"
          prop="name"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
            <div>{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="单位/职位"
          prop="desc"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.unit }}</div>
            <div>{{ scope.row.position }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="phoneHistoryFlag ? '时间/时长' : '时间'"
          prop="name"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.time
                  ? scope.row.time
                    .split(' ')[0]
                    .substr(scope.row.time.indexOf('-') + 1) +
                    ' ' +
                    scope.row.time
                      .split(' ')[1]
                      .substr(0, scope.row.time.split(' ')[1].lastIndexOf(':'))
                  : ''
              }}
            </div>
            <div
              v-if="
                (scope.row.second != '' && phoneHistoryFlag)
                  || (scope.row.second != null && phoneHistoryFlag)
              "
            >
              {{ calculate(scope.row.second) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="desc"
          label="状态"
        >
          <template slot-scope="scope">
            <!--            <div class="pending_del" v-if="scope.row.statusId==651" >-->
            <!--              待处理-->
            <!--            </div>-->
            <div style="display: flex; justify-content: center">
              <div
                v-if="scope.row.status === '处置中'"
                class="being_del"
              >
                {{ scope.row.status }}
              </div>
              <div
                v-else-if="scope.row.status === '已处置'"
                class="processed_del"
              >
                {{ scope.row.status }}
              </div>
              <div
                v-else-if="scope.row.status === '无需处置'"
                class="untreated_del"
              >
                {{ scope.row.status }}
              </div>
              <div
                v-else-if="scope.row.status === '默认处置中'"
                class="pending_del"
              >
                {{ scope.row.status }}
              </div>
              <div v-else>待处置</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="name"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="SeeTheHistory(scope.row)"
            >
              通信历史
            </el-button>
            <el-button
              v-if="!phoneHistoryFlag"
              type="text"
              size="small"
              @click.stop="transmit(scope.row)"
            >
              转发
            </el-button>
            <!-- <el-button type="text" size="small" v-if="phoneHistoryFlag"  @click.stop="callback(scope.row)" >回拨</el-button> -->
            <el-button
              v-if="IsShenzhenProject || phoneHistoryFlag"
              type="text"
              size="small"
              @click.stop="callback(scope.row)"
            >
              回拨
            </el-button>
            <el-button
              v-if="!phoneHistoryFlag"
              type="text"
              size="small"
              @click.stop="reply(scope.row)"
            >
              回复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    页脚的页数-->
    <div class="footer">
      <el-pagination
        v-if="phoneHistoryFlag"
        background
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="footerPageObj.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-pagination
        v-else
        background
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="footerPageObj.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import AudioControls from '../../../../../../static/audioControls/audioPlugin';
// 设置图片路径 用require()转换成base64
const play = require('../../../../../../static/audioControls/play.png');
const stop = require('../../../../../../static/audioControls/stop.png');
const TurnTheText = require('../../../../../../static/audioControls/TurnTheText.png');
const tailor = require('../../../../../../static/audioControls/tailor.png');
const dow = require('../../../../../../static/audioControls/dow.png');

export default {
  name: 'BigTemplate',
  components: {},
  data() {
    return {
      templateIndex: '',
      state: '',
      IsShenzhenProject: window.g.IsShenzhenProject, // 是否是深圳项目
      phoneHistoryFlag: true,
      apiUrl: window.SITE_CONFIG.cloudUrl,
      expands: [],
      getRowKeys(row) {
        return row.id;
      },
      mackeValue: '', // 备注信息
      stateValue: '', // 筛选的状态列表
      // 信息处置-电话，是拿数据库字典表的数据，以下是信息处置-短信(和后端自定义的值)
      stateListData: [
        {
          name: '已处置',
          id: 0,
        },
        {
          name: '无需处置',
          id: 1,
        },
        {
          name: '处置中',
          id: 2,
        },
        {
          name: '待处置',
          id: 3,
        },
      ], // 状态列表
      eventOptions: [], // 关联事件列表
      eventValue: '', // 关联事件的值
      processValue: '', // 处置状态
      audioControls: '', // 音频的构造函数
      input: '', // 输入关键字
      value: '', // 选择状态的值
      datevalue: '', // 选择日期的值
      // 表格的数据
      currentPage: 1,
      startTime: '',
      endTime: '',
      // 页数的选择
      footerPageObj: {
        pageSize: 10,
        total: 0,
        allData: [],
      },
      audioEventList: {},
      SpeechTextFlag: false,
      isDisable: true,
      sendCodeMap: new Map().set('已处置', 0).set('无需处置', 1).set('处置中', 2).set('待处置', 3),
    };
  },
  computed: {},
  watch: {
    eventValue(newVal, oldVal) {
      this.$emit('relevanceEvent', newVal);
    },
  },
  mounted() {
    this.updateRecord();
  },
  // 销毁前清除实例
  beforeDestroy() {
    this.audioEventList = null;
    this.audioEventList = {};
  },
  methods: {
    /**
     * @description: 传递当前选的关联事件的所有信息，使得不用保存，点一下就能加载出它
     * @param {*} item
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-06 16:45:02
     */
    clickEventValue(item) {
      const currentItem = this.eventOptions.find(
        (el) => el.id === item,
      );
      this.$emit('clickEventValue', currentItem);
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-18
     * @description 根据phoneId获取对应事件id
     */
    async getEventByPhoneId(phoneId) {
      const data = {
        phoneId,
      };
      return new Promise((resolve) => {
        this.$api.getEventByPhoneId(data).then((res) => {
          if (res.errorcode === 0) {
            // if (res.data) {
            // 电话id对应的事件id
            resolve(res.data.eventId);
            // }
          }
        });
      });
    },

    /**
     * 根据短信ID获取事件ID
     * smsId: 短信id
     * author: hexinting
     */
    async getEventBySmsId(smsId) {
      const data = {
        smsId,
      };
      return new Promise((resolve) => {
        this.$api.getEventBySmsId(data).then((res) => {
          if (res.errorcode === 0) {
            // if (res.data) {
            // 短信id对应的事件id
            resolve(res.data.eventId);
            // }
          }
        });
      });
    },
    // 复制textarea内容
    copyVesselValue() {
      this.$refs.mackeValueVessel.select();
      document.execCommand('Copy'); // 执行浏览器复制命令
      this.$message({
        message: '已复制到剪切板',
        type: 'success',
      });
    },
    // 转发
    transmit(row) {
      this.$emit('transmit', row);
    },
    // 回复
    reply(row) {
      this.$emit('reply', row);
    },
    // 处理时间
    calculate(count) {
      let shi = '',
        fen = '',
        miao = '';
      let str = '';
      // 达到一个小时或者大于一个小时
      fen =
        parseInt(count / 60) % 60 >= 10
          ? parseInt(count / 60) % 60
          : '0' + (parseInt(count / 60) % 60);
      miao = count % 60 >= 10 ? count % 60 : '0' + (count % 60);
      if (count >= 3600) {
        shi =
          parseInt(count / 3600) >= 10
            ? parseInt(count / 3600)
            : '0' + parseInt(count / 3600);
        str = shi + ':' + fen + ':' + miao;
      } else {
        // 不到一个小时
        str = fen + ':' + miao;
      }
      return str;
    },
    // 改变每页几条数据
    handleSizeChange(val) {
      this.footerPageObj.pageSize = val;
      this.getSeachDate();
    },
    // 页数改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSeachDate();
    },
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row);
    },
    /**
     * @description 通过事件id查事件
     */
    getEventById(id) {
      const data = {
        id,
      };
      this.$api.findById(data).then((res) => {
        if (res.errorcode === 0) {
          this.eventOptions.push(res.data.event);
        }
      });
    },
    /**
     * @description 展开行，数据赋值
     */
    expandRow(eventId, row, expandedRows) {
      console.log(row)
      // 列表中没有该事件，就去查接口，解决事件不在事件列表里时，不显示的问题。
      if (eventId && this.eventOptions.findIndex((el) => eventId === el.id) === -1
      ) {
        this.getEventById(eventId);
      }
      this.eventValue = eventId || ''; // 事件id不存在就会清空
      this.processValue = this.state === 'phone' ? row.statusId : row.status;
      this.mackeValue = row.remark;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id); // 每次push进去的是每行的ID
        }
      } else {
        this.expands = []; // 默认不展开
      }
    },
    // 折叠面板每次只能展开一行
    async expandSelect(row, expandedRows) {
      // 初始化数据
      const rowData = { ...row };
      this.eventValue = ''; // 清空事件id
      this.processValue = '';
      this.mackeValue = '';
      this.$emit('expandSelectRow', rowData);
      if (this.state === 'phone') {
        const eventId = await this.getEventByPhoneId(rowData.id); // 根据id获取事件id
        this.expandRow(eventId, rowData, expandedRows);
        rowData.eventId = eventId;
        if (expandedRows.length > 0) {
          const index = this.footerPageObj.allData.findIndex((el) => el.id === row.id);
          this.createAudio(row, index); // 生成录音组件
        }
      }
      if (this.state === 'sms') {
        const eventId = await this.getEventBySmsId(row.id); // 根据id获取事件id
        this.expandRow(eventId, rowData, expandedRows);
        rowData.eventId = eventId;
      }

      this.$emit('clickRow', row, this.templateIndex);
    },
    expandChange(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row);
      // this.$emit('clickRow', row, index);
      this.templateIndex = index;
      if (row.second === 0) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    },
    /**
     * @description  生成录音组件
     */
    createAudio(row, index) {
      const _that = this;
      const getAllAudio = document.querySelectorAll('#content_audio audio');
      const obj = {
        play,
        stop,
        TurnTheText,
        tailor,
        dow,
      };
      Array.from(getAllAudio).forEach((ele) => {
        const audio = new AudioControls(
          ele.parentNode,
          ele.src,
          obj,
          false,
          _that.TurnTheText,
          _that.tailor,
          row,
        );
        _that.audioEventList[index] = audio;
        audio.addIncident();
      });
    },
    // 获取搜索数据的按钮
    getSeachDate() {
      const obj = {
        startTime: this.startTime,
        endTime: this.endTime,
        input: this.input,
        page: this.currentPage,
        size: this.footerPageObj.pageSize,
        stateValue: this.stateValue,
      };
      // 把所以的搜索数据传给父元素让，在父元素页面进行请求
      this.$emit('getChildrenSeachData', obj);
    },
    getSeachDateBtn() {
      if (this.datevalue) {
        if (this.datevalue.length != 0) {
          let startTime =
            this.datevalue[0].getFullYear() +
            '-' +
            (this.datevalue[0].getMonth() + 1 >= 10
              ? this.datevalue[0].getMonth() + 1
              : '0' + (this.datevalue[0].getMonth() + 1)) +
            '-' +
            (this.datevalue[0].getDate() >= 10
              ? this.datevalue[0].getDate()
              : '0' + this.datevalue[0].getDate());
          let endTime =
            this.datevalue[1].getFullYear() +
            '-' +
            (this.datevalue[1].getMonth() + 1 >= 10
              ? this.datevalue[1].getMonth() + 1
              : '0' + (this.datevalue[1].getMonth() + 1)) +
            '-' +
            (this.datevalue[1].getDate() >= 10
              ? this.datevalue[1].getDate()
              : '0' + this.datevalue[1].getDate());
          this.startTime = startTime;
          this.endTime = endTime;
        }
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      this.getSeachDate();
    },
    // 裁剪
    tailor(src) {
      this.$emit('tailor_del', { src });
    },
    // 转文字
    TurnTheText(src, obj) {
      console.log(src, obj)
      this.$store.commit('setTurnToTextLoading', { loading: true });
      if (obj.url) {
        this.$emit('TurnTheText', { src: src, obj: obj });
      } else {
        this.$message.error('不存在录音文件');
      }
    },
    // 查看历史
    SeeTheHistory(item) {
      this.$emit('SeeTheHistory', item);
    },
    // 回拨
    callback(item) {
      this.$emit('callback', item);
    },
    saveEvent(item) {
      this.$emit('saveEvent', {
        id: item.id,
        statusId: this.processValue,
        eventId: this.eventValue,
        remark: this.mackeValue,
      });
    },
    returnCode(name) {
      if (name === '处置中') {
        return 2;
      }
      if (name === '待处置') {
        return 3;
      }
      if (name === '已处置') {
        return 0;
      }
      if (name === '无需处置') {
        return 1;
      }
    },
    async updateRecord() {
      let params = new FormData();
      params.append('id', 2175); // 当前录音数据id
      params.append('voiceTxt', '应急局收到，立马执行'); // 转写结果
      params.append('eventId', 892); // 事件Id
      this.$http({
        method: 'post',
        service: 'eoc',
        url: `${window.SITE_CONFIG.event}/eos/history/phone/updateCdr`,
        contentType: 'application/x-www-from-urlencoded',
        data: params,
      }).then((res) => {
        if (res.data.errorcode === 0) {
          console.log('更新录音成功', res);
        }
      });
    }
  },
};
</script>

<style scoped>
.phoneHistoryIndex_wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
/*头部*/
.header {
  display: flex;
  align-items: center;
  padding: 13px;
  box-sizing: border-box;
  border-bottom: 1px solid #f3f3f3;
  background: white;
}
.header > span {
  margin-right: 20px;
  font-size: 17px;
  font-weight: 400;
  color: rgba(85, 85, 85, 1);
  min-width: 35px;
}
.header_date {
  position: relative;
  margin: 0 10px;
}
/*.header_date /deep/ .el-range-separator{*/
/*  display: none;*/
/*}*/
/*.header_date /deep/ .el-date-editor .el-range__icon{*/
/*  position: absolute;*/
/*  right: 0px;*/
/*  bottom: 0;*/
/*  top: 0;*/
/*  margin: auto;*/
/*}*/
.search_wrap {
  width: 300px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.header_date /deep/ .el-range-editor.el-input__inner {
  width: 300px;
  flex-grow: 0;
  flex-shrink: 0;
}
.header_date /deep/ .el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  /*text-align: left;*/
}
/* .header /deep/ .el-input__inner,
.header /deep/ .el-input__icon {
    height: 42px;
    line-height: 42px;
}
.select_wrap /deep/ .el-select .el-input__inner {
    width: 177px;
}
.header_date /deep/ .el-range-editor.el-input__inner {
    width: 399px;
    height: 42px;
}
.search_wrap /deep/ .el-input__inner {
    border-radius: 5px 0 0 5px;
}
.search_wrap /deep/ .el-button--primary {
    width: 42px;
    height: 42px;
    background: rgba(63, 146, 254, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 7px;
    border-radius: 0 5px 5px 0;
}
.search_wrap /deep/ .el-button--primary img {
    width: 14px;
    height: 14px;
} */

/*中间*/
.content {
  flex: 1;
  height: 830px;
}
.coverAudio {
  width: 40px !important;
  height: 40px;
  position: relative;
  right: 0px;
}
.content >>> .el-table::before {
  width: 0;
}
.content >>> .el-table {
  overflow: auto;
}
.content /deep/ .demo-table-expand {
  font-size: 0;
}
.content /deep/ .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.content /deep/ .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.content /deep/ .has-gutter th {
  height: 56px;
  padding: 8px 0;
}
.content /deep/ .has-gutter tr,
.content /deep/ .has-gutter th {
  background: #f9fcff;
}
/* .content /deep/ .has-gutter th .cell {
    font-size: 17px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
} */
.content /deep/ .el-table__body .el-table__row {
  height: 70px;
  background: rgba(255, 255, 255, 1);
}
.content /deep/ .el-table__body .el-table__row td {
  padding: 0;
}
.content /deep/ .cell {
  text-align: center;
  /* font-size: 17px; */
}
/*.content /deep/ .el-table__row td:nth-child(5)>div,*/
.content /deep/ .el-table__row td:nth-child(6) > div {
  display: flex;
  justify-content: center;
}
.content /deep/ .el-table__expanded-cell {
  padding: 20px 0 15px;
}
.content /deep/ .expanded > td:nth-child(1) {
  position: relative;
}
.content /deep/ .expanded > td:nth-child(1):before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: rgba(0, 145, 255, 1);
}
.content /deep/ .el-button--mini,
.el-button--small {
  font-size: 17px;
  font-weight: 400;
}
.pending_del {
  width: 67px;
  height: 31px;
  line-height: 31px;
  border-radius: 4px;
  background: rgba(255, 151, 122, 1);
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.being_del {
  width: 67px;
  height: 31px;
  line-height: 31px;
  border-radius: 4px;
  background: rgba(84, 160, 255, 1);
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.processed_del {
  width: 67px;
  height: 31px;
  line-height: 31px;
  border-radius: 4px;
  background: rgba(11, 210, 149, 1);
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.untreated_del {
  width: 80px;
  line-height: 31px;
  height: 31px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.accepted_del,
.dialer_del,
.missed_del {
  font-size: 17px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}
.accepted_del > span {
  display: block;
  width: 11px;
  height: 11px;
  background: rgba(0, 145, 255, 1);
  border-radius: 50%;
  margin-right: 8px;
}
.dialer_del > span {
  display: block;
  width: 11px;
  height: 11px;
  background: rgba(11, 210, 149, 1);
  border-radius: 50%;
  margin-right: 8px;
}
.missed_del > span {
  display: block;
  width: 11px;
  height: 11px;
  background: rgba(244, 102, 102, 1);
  border-radius: 50%;
  margin-right: 8px;
}
.from_content_wrap {
  display: flex;
}
.from_content_left {
  display: flex;
  align-items: flex-start;
  margin-right: 40px;
  width: 50%;
  position: relative;
}
.copyContentText {
  position: absolute;
  width: 23px;
  height: 22px;
  background: url('../../../../../../static/img/Communihistory/copyImg.png')
    no-repeat;
  background-size: 100% 100%;
  bottom: 7px;
  right: 7px;
  cursor: pointer;
}
.copyContentText:hover {
  background: url('../../../../../../static/img/Communihistory/copyImg1.png')
    no-repeat;
  background-size: 100% 100%;
}
.from_content_left > span {
  font-size: 17px;
  padding-top: 6px;
  font-weight: 400;
  color: rgba(85, 85, 85, 1);
  margin: 0 28px 0 47px;
  width: 11%;
}
.from_content_left > textarea {
  width: 444px;
  height: 177px;
  border-radius: 5px;
  border: 1px solid #ddd;
  resize: none;
  outline: none;
  padding: 7px 9px;
  box-sizing: border-box;
  font-size: 17px;
  font-weight: 400;
  color: #000000;
}
.from_content_right {
}
.from_content_right > ul {
  padding: 0;
  margin: 0;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
}
.from_content_right > ul > li {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  height: 30px;
}
.from_content_right > ul > li > div {
  /* width: 278px; */
}
.from_content_right_one {
}
.from_content_right_tow > div /deep/ .el-input__inner {
  width: 278px;
  height: 42px;
}
.from_content_right_tow > div /deep/ .el-input__icon {
  height: 42px;
  line-height: 42px;
}
.from_content_right_three > div {
  display: flex;
  align-items: center;
}
.from_content_right_three > div /deep/ .el-input__inner {
  width: 201px;
  height: 42px;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: 1px solid rgba(221, 221, 221, 1);
}
.from_content_right_three > div /deep/ .el-button {
  width: 70px;
  height: 42px;
  font-size: 17px;
  background: rgba(0, 145, 255, 1);
  border-radius: 3px;
  margin-left: 8px;
  line-height: 42px;
  text-align: center;
  padding: 0;
}
.from_content_right_three > div /deep/ .el-input__icon {
  line-height: 30px;
}
.from_content_right > ul > li > span {
  font-size: 17px;
  font-weight: 400;
  color: rgba(85, 85, 85, 1);
  margin-right: 28px;
}
.from_content_right > ul > li > div {
}
/*页脚*/
.footer {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: white;
}
/*.footer /deep/ .el-pagination span{*/
/*  float: right;*/
/*}*/
.footer /deep/ .el-pagination.is-background .btn-next,
.footer /deep/ .el-pagination.is-background .btn-prev,
.footer /deep/ .el-pagination.is-background .el-pager li {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}
.footer /deep/ .el-pagination .btn-next .el-icon,
.footer /deep/ .el-pagination .btn-prev .el-icon {
  font-weight: 400;
}
.footer /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background: rgba(0, 145, 255, 1);
}
.footer /deep/ .el-pager li {
  font-size: 12px;
  font-weight: 400;
}
</style>
