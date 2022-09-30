<template>
  <div class="sendPair">
    <el-dialog
      title="发送队列"
      class="send_dialog"
      :visible.sync="dialogVisible"
      width="576px"
      append-to-body
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeAllModel" @tab-click="initData(0)">
        <el-tab-pane
          label="发送队列"
          name="发送队列"
        />
        <el-tab-pane
          label="近期历史"
          name="近期历史"
          style="height: calc(96% - 3px)"
        />
      </el-tabs>
      <div style="height: 45px; display: flex; align-items: center">
        <el-radio-group
          v-if="activeAllModel == '发送队列'"
          v-model="sendType"
          style="margin-bottom: 10px"
          @change="initData(0)"
        >
          <el-radio :label="1">即时</el-radio>
          <el-radio :label="2">定时</el-radio>
          <el-radio :label="3">催报</el-radio>
        </el-radio-group>

        <div
          v-if="activeAllModel == '近期历史'"
          style="margin: 0 11px 20px 0; width: 229px"
        >
          （最近24小时）
        </div>

        <div class="allTime">
          <div
            v-for="(item, index) in sendData"
            :key="index"
            style="text-align: center; margin-right: 10px"
          >
            <div
              class="oneTime"
              :class="{ active: idx == index }"
              @click="smsDetail(item.groupNum, index, item)"
            >
              <!-- {{ item.sendTime.split(" ")[1]?item.sendTime.split(" ")[1].substr(0,5):item.sendTime }} -->
              {{ item.sendTime }}
            </div>
            <!-- <div v-if="activeAllModel == '近期历史'">
              {{
                item.type == "即时发送"
                  ? "即时"
                  : item.type == "定时发送"
                  ? "定时"
                  : item.type == "催报发送"
                  ? "催报"
                  : "未知"
              }}
            </div> -->
            <div v-if="activeAllModel == '近期历史'">
              {{
                item.type == "1"
                  ? "即时"
                  : item.type == "2"
                  ? "定时"
                  : item.type == "3"
                  ? "催报"
                  : "未知"
              }}
            </div>
          </div>
        </div>
      </div>

      <el-input
        type="textarea"
        v-model="listData.content"
        resize="none"
        show-word-limit
        maxlength="500"
        :autosize="{ minRows: 7, maxRows: 7 }"
        readonly
      ></el-input>

      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div
          v-if="activeAllModel == '发送队列'"
          style="padding: 8px; display: flex; justify-content: space-between"
        >
          <div class="column">
            <div>
              <span>收信人</span>
              <span class="num">{{ listData.total ? listData.total : 0 }}</span>
            </div>
          </div>
          <div class="column" v-if="sendType == 2">
            <div>
              <span>发送时间</span>
              <span class="num">
                {{
                  listData.sendTime
                    ? listData.sendTime.split(" ")[1]
                      ? listData.sendTime.split(" ")[1].substr(0, 5)
                      : listData.sendTime
                    : 0
                }}
              </span>
            </div>
          </div>
          <div class="column">
            <div v-if="activeAllModel == '近期历史'">
              <span>发送成功</span>
              <span class="num">
                {{ listData.success ? listData.success : 0 }}
              </span>
            </div>
            <div v-if="sendType == 3">
              <span>发送间隔</span>
              <span class="num">
                {{ listData.interval ? listData.interval : 0 }}
              </span>
            </div>
          </div>
          <div class="column">
            <div v-if="activeAllModel == '近期历史'">
              <span>发送失败</span>
              <span class="num">
                {{ listData.failed ? listData.failed : 0 }}
              </span>
            </div>
            <div v-if="sendType == 3">
              <span>已发送次数</span>
              <span class="num">
                {{ listData.currCount ? listData.currCount : 0 }}
              </span>
            </div>
          </div>
          <div class="column">
            <div v-if="sendType == 3">
              <span>发送次数</span>
              <span class="num">{{ listData.count ? listData.count : 0 }}</span>
            </div>
          </div>
        </div>
        <el-button
          size="small"
          type="primary"
          v-if="activeAllModel == '发送队列' && sendType != 1"
          @click="delSMS"
          >取消发送</el-button
        >
      </div>

      <div
        style="padding: 8px; display: flex; justify-content: space-between"
        v-if="activeAllModel == '近期历史'"
      >
        <div class="column">
          <div>
            <span>收信人</span>
            <span class="num">{{ listData.total ? listData.total : 0 }}</span>
          </div>
          <!-- <div v-if="type == '催报发送'">
            <span>发送间隔</span>
            <span class="num">{{listData.interval}}</span>
          </div>-->
        </div>
        <div class="column" v-if="listData.type == '定时发送'">
          <div>
            <span>发送时间</span>
            <span class="num">{{
              listData.sendTime.split(" ")[1]
                ? listData.sendTime.split(" ")[1].substr(0, 5)
                : listData.sendTime
            }}</span>
          </div>
        </div>
        <div class="column">
          <div>
            <span>发送成功</span>
            <span class="num">
              {{ listData.success ? listData.success : 0 }}
            </span>
          </div>
          <!-- <div v-if="type == '催报发送'">
            <span>已发送次数</span>
            <span class="num">{{listData.totalSented}}</span>
          </div>-->
        </div>
        <div class="column">
          <div>
            <span>发送失败</span>
            <span class="num">{{ listData.failed ? listData.failed : 0 }}</span>
          </div>
          <!-- <div v-if="type == '催报发送'">
            <span>发送次数</span>
            <span class="num">{{listData.totalSent}}</span>
          </div>-->
        </div>
      </div>

      <el-table
        :data="tableData ? tableData : []"
        style="width: 100%"
        :header-cell-style="getRowClass"
        :cell-style="getCellStyle"
        height="188px"
      >
        <el-table-column label="姓名" show-overflow-tooltip>
          <!-- <template
            slot-scope="scope"
          >{{scope.row.name?scope.row.name:(scope.row.operator?scope.row.operator:'')}}</template>-->
          <template slot-scope="scope">
            {{
              scope.row.name || scope.row.contactor || scope.row.contactorName || ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row.unit || scope.row.workUnit || scope.row.contactorWorkUnit || ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="position"
          label="职位"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{
              scope.row.position || scope.row.contactorPosition || ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="号码" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row.number || scope.row.smsTo ||scope.row.phone || ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip
          v-if="activeAllModel == '发送队列' && sendType != 1"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-delete"
              style="cursor: pointer"
              @click="delIt(scope.row.id)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          label="发送状态"
          show-overflow-tooltip
          v-if="activeAllModel == '近期历史'"
        >
          <template slot-scope="scope">
            <span
              :style="{
                color: scope.row.status == '发送失败' || scope.row.success == 0
                  ? '#F66E6E'
                  : '#0BD295',
              }"
            >
              {{
                scope.row.status === '发送成功' || scope.row.success === 1
                  ? '成功'
                  : '失败'
              }}
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="reason"
          label="失败原因"
          v-if="activeAllModel == '近期历史'"
        /> -->
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[7, 15, 50, 100]"
        :page-size="pageSize"
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        style="margin-top: 12px; text-align: right"
      ></el-pagination>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="medium">取 消</el-button>
        <el-button
          type="primary"
          @click="closeDialog"
          size="medium"
          style="margin-right: 20px"
          v-if="
            activeAllModel == '发送队列' ||
            listData.type == '催报发送' ||
            !listData.reissued
          "
          >确定</el-button
        >
        <el-button
          type="primary"
          @click="send"
          size="medium"
          style="margin-right: 20px"
          v-if="
            activeAllModel == '近期历史' &&
            listData.type != '催报发送' &&
            listData.reissued
          "
          >失败重发</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: true,
      sendData: [], // 所有发送数据
      listData: {
        content: "",
        sendTime: "",
        success: 0,
        failed: 0,
        total: 0,
        type: "",
        interval: 0,
        count: 0,
        currCount: 0,
        reissued: true,
      }, // 每条发送记录
      idx: 0, // 当前选择索引
      content: "", // 短信内容
      tableData: [
        {
          date: "2016-05-02",
          name: "周杰伦",
          address: "上海市普陀区金沙江路 1518 弄",
          workUnit: "深圳市应急局",
          position: "副局长",
          statu: "发送失败",
          reason: "未知",
          phone: "13945789123",
        },
        // {
        //   date: "2016-05-02",
        //   name: "周杰伦",
        //   address: "上海市普陀区金沙江路 1518 弄",
        //   workUnit: "深圳市应急局",
        //   position: "副局长",
        //   statu: "发送成功",
        //   reason: "未知",
        //   phone: "13945789123",
        // },
      ], // 表格数据
      // 分页 0
      page: 1,
      pageSize: 7,
      total: 0,

      sendType: 1, //发送类型切换
      groupNum: "", // 当前是哪条短信
      snedTime: "",
      activeAllModel: "发送队列", //队列历史切换
      type: "", // 当前短信发送方式
    };
  },
  created() {
    this.initData(0);
  },
  methods: {
    // 初始化所有发送数据
    initData(idx) {
      this.idx = idx;
      this.groupNum = "";
      if (this.activeAllModel == "发送队列") {
        if (this.sendType == 1) {
          let data = {
            type: "1",
          };
          this.$api
            .immediateData(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              this.sendData = res.data;
              // this.sendData.map(v => {
              //     if (v.type != '定时发送') {
              //         v.sendTime = v.sendTime.substring(
              //             v.sendTime.indexOf(' '),
              //             v.sendTime.lastIndexOf(':')
              //         );
              //     }
              // });
              this.smsDetail(this.sendData[0].groupNum, 0, this.sendData[0]);
            })
            .catch(() => {
              this.tableData = [];
              this.total = 0;
              this.listData = {};
              this.content = "";
            });
        } else if (this.sendType == 2) {
          let data = {
            type: "2",
          };
          this.$api
            .timingData(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              this.sendData = res.data;
              // console.log('sendData: ',this.sendData)
              // this.sendData.map(v => {
              //     if (v.type != '定时发送') {
              //         v.sendTime = v.sendTime.substring(
              //             v.sendTime.indexOf(' '),
              //             v.sendTime.lastIndexOf(':')
              //         );
              //     }
              // });
              this.smsDetail(this.sendData[0].groupNum, idx, this.sendData[0]);
            })
            .catch(() => {
              this.tableData = [];
              this.total = 0;
              this.listData = {};
              this.content = "";
            });
        } else if (this.sendType == 3) {
           let data = {
                        type: '3',
                    };
          this.$api
            .remindData(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              this.sendData = res.data;
              // this.sendData.map(v => {
              //     if (v.type != '定时发送') {
              //         v.sendTime = v.sendTime.substring(
              //             v.sendTime.indexOf(' '),
              //             v.sendTime.lastIndexOf(':')
              //         );
              //     }
              // });

              this.smsDetail(this.sendData[0].groupNum, idx, this.sendData[0]);

              // console.log('sendData: ',this.sendData)
            })
            .catch(() => {
              this.tableData = [];
              this.total = 0;
              this.listData = {};
              this.content = "";
            });
        }
      } else {
        let data = {
          page: 1,
          size: 2000,
          startTime: "",
          endTime: "",
          type: 0,
          searchText: "",
          today: 1,
        };
        this.$api
          .sendHistory(data)
          .then((res) => {
            if (res.errorcode != 0) {
              this.$message.error(res.msg);
              return;
            }

            this.sendData = res.data.data;
            // console.log("sendData: ", this.sendData);
            // this.sendData.map(v => {
            //     if (v.type != '定时发送') {
            //         v.sendTime = v.sendTime.substring(
            //             v.sendTime.indexOf(' '),
            //             v.sendTime.lastIndexOf(':')
            //         );
            //     }
            // });

            this.smsDetail(this.sendData[0].groupNum, 0, this.sendData[0]);
          })
          .catch(() => {
            this.tableData = [];
            this.total = 0;
            this.listData = {};
            this.content = "";
          });
      }
    },
    // 查询每条短信详情
    smsDetail(groupNum, index, obj) {
      this.idx = index;
      this.groupNum = groupNum;
      // console.log('this.sendData[index]: ', this.sendData[index]);
      this.listData.content = this.sendData[index].content
        ? this.sendData[index].content
        : 0;
      this.listData.sendTime = this.sendData[index].sendTime
        ? this.sendData[index].sendTime
        : 0;
      this.listData.total = this.sendData[index].total
        ? this.sendData[index].total
        : 0;
      this.listData.success = this.sendData[index].success
        ? this.sendData[index].success
        : 0;
      this.listData.failed = this.sendData[index].failed
        ? this.sendData[index].failed
        : 0;
      this.listData.interval = this.sendData[index].interval
        ? this.sendData[index].interval
        : 0;
      this.listData.count = this.sendData[index].count
        ? this.sendData[index].count
        : 0;
      this.listData.currCount = this.sendData[index].currCount
        ? this.sendData[index].currCount
        : 0;
      this.listData.type = this.sendData[index].type
        ? this.sendData[index].type
        : "";
      this.listData.reissued = this.sendData[index].reissued
        ? this.sendData[index].reissued
        : true;

      if (obj && !obj.groupNum) {
        console.log("this.sendData[index]", this.sendData[index]);
        var that = this;
        axios
          .post(window.SITE_CONFIG['event'] + "/eos/history/findSmsGroupsSendTime", {
            sendTime: that.sendData[index].sendTime
              ? this.sendData[index].sendTime
              : 0,
            size: that.pageSize,
            page: that.page,
          })
          .then(function (data) {
            console.log("/eos/history/findSmsGroupsSendTime", data);
          });
      }

      // console.log("this.content: ", this.content);
      if (this.activeAllModel == "发送队列") {
        let data = {
          groupNum,
          page: this.page,
          size: this.pageSize,
        };
        if (this.sendType == 1) {
          this.$api
            .immediateDetail(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              console.log("res: ", res);
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
              // this.$set(this.listData, "total", this.total);
            })
            .catch(() => {
              this.tableData = [];
              this.listData = {};
              this.total = 0;
            });
        } else if (this.sendType == 2) {
          // this.$set(this.listData, "sendTime", this.sendData[index].sendTime);
          this.$api
            .timingDetail(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              console.log("res: ", res);
              this.tableData = res.data.data;
              // 正常会有成员，若无成员说明已被删除，初始化数据
              if (this.tableData.length == 0) {
                this.initData(0);
              }

              this.total = res.data.totalElements;
              // this.$set(this.listData, "total", this.total);
              // console.log('res: ',res)
            })
            .catch(() => {
              this.tableData = [];
              this.listData = {};
              this.total = 0;
            });
        } else if (this.sendType == 3) {
          // this.listData = Object.assign({}, this.listData, {
          //   interval: this.sendData[index].interval,
          //   count: this.sendData[index].count,
          //   currCount: this.sendData[index].currCount,
          //   type: this.sendData[index].type
          // });
          this.$api
            .remindDetail(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              console.log("res: ", res);
              this.tableData = res.data.data;
              // 正常会有成员，若无成员说明已被删除，初始化数据
              if (this.tableData.length == 0) {
                this.initData(0);
              }
              this.total = res.data.totalElements;
              // this.$set(this.listData, "total", this.total);
            })
            .catch(() => {
              this.tableData = [];
              this.total = 0;
              this.listData = {};
            });
        }
      } else {
        // this.type = this.sendData[index].type;
        let data = {
          groupNum: this.groupNum,
          page: this.page,
          size: this.pageSize,
        };

        if (this.sendData[index].type == "定时发送") {
          // this.listData = Object.assign({}, this.listData, {
          //   sendTime: this.sendData[index].sendTime
          // });
        }

        if (this.sendData[index].type == "催报发送") {
          // this.listData = Object.assign({}, this.listData, {
          //   interval: this.sendData[index].interval,
          //   count: this.sendData[index].count,
          //   currCount: this.sendData[index].currCount
          // });
        }
        if (obj.groupNum) {
          this.$api
            .sendHistoryDetail(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              console.log("sendHistoryDetail data", data);
              console.log("res: ", res);
              this.tableData = res.data.smsContactorVoList;
              this.total = res.data.totalElements;
              this.tableData.map((v) => v.status);
              // this.$set(this.listData, "addressee", this.total);
              // this.listData = Object.assign({}, this.listData, {
              //   addressee: this.tableData.length,
              //   sendSucc: this.tableData.filter(v => v.status == "发送成功").length,
              //   sendFail: this.tableData.filter(v => v.status == "发送失败").length
              // });
            })
            .catch(() => {
              this.tableData = [];
              this.total = 0;
              this.listData = {};
            });
        }
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit("close");
    },
    // 表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#F9FCFF;color:#333333;text-align:center;font-size:12px;padding:2px 0;";
      } else {
        return "";
      }
    },
    // 表格样式
    getCellStyle({ row, column, rowIndex, columnIndex }) {
      return "text-align:center;padding:4px 0;font-size:12px;";
    },
    /**
     * @lastDate 2020-12-25
     * @lastEditor hexinting
     * @description 页数改变获取数据
     */
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.smsDetail(this.groupNum, this.idx, this.sendData[this.idx]);
    },
    /**
     * @lastDate 2020-12-25
     * @lastEditor hexinting
     * @description 页码改变获取数据
     */
    handleCurrentChange(val) {
      this.page = val;
      this.smsDetail(this.groupNum, this.idx, this.sendData[this.idx]);
    },
    // 重发
    send() {
      let data = {
        groupNum: this.groupNum,
        // content: this.content
      };
      this.$api.failSend(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.$message.success("重发成功");
        this.$emit("close");
      });
    },
    /**
     * @description: 中断短信发送
     * @author: xuchuangxing
     * @lastEditor xuchuangxing
     * @updateTime :2020-10-09 15:40
     * @param {type}
     * @return {type}
     */
    delSMS() {
      if (!this.groupNum) {
        this.$message.warning("请先发送短信");
        return;
      }
      // 定时取消发送
      if (this.sendType == 2) {
        let data = {
          groupNum: this.groupNum,
        };
        this.$api.smsDelTask(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("取消成功");
          this.initData(0);
        });
        // 催报取消发送
      } else if (this.sendType == 3) {
        let data = {
          groupNum: this.groupNum,
        };
        this.$api.smsDelPrompt(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("取消成功");
          this.initData(0);
        });
      }
    },
    /**
     * @description: 删除接收短信成员
     * @author: xuchuangxing
     * @lastEditor xuchuangxing
     * @updateTime :2020-10-09 15:40
     * @param {id} 要删除的的成员Id
     * @return {type}
     */
    delIt(id) {
      // 定时删除成员
      if (this.sendType == 2) {
        const data = {
          id,
        };
        this.$api.smsDelTask(data).then((res) => {
          if (res.errorcode !== 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("删除成功");
          this.smsDetail(this.groupNum, this.idx);
        });
        // 催报删除成员
      } else if (this.sendType == 3) {
        const data = {
          id,
        };
        this.$api.smsDelPrompt(data).then((res) => {
          if (res.errorcode !== 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("删除成功");
          this.smsDetail(this.groupNum, this.idx);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
 .send_dialog {
   .allTime {
    display: flex;
    overflow-x: auto;
    .active {
      background: rgba(236, 244, 255, 1) !important;
      border: 1px solid rgba(63, 146, 254, 1) !important;
    }
    .oneTime {
      flex: 0 0 60px;
      height: 30px;
      line-height: 30px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(221, 222, 225, 1);
      text-align: center;
      white-space: nowrap;
      padding: 0 16px;
    }
  }

  /deep/ .el-textarea {
    margin-top: 13px;
    .el-textarea__inner {
      background-color: #f9f9f9;
    }
    .el-input__count {
      color: #999;
    }
  }

  .column {
    display: inline-block;
    vertical-align: top;
    line-height: 32px;
    margin-right: 10px;
  }
  .num {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    text-align: center;
    background: rgba(243, 243, 247, 1);
    border-radius: 4px;
    font-weight: bold;
    color: #333;
    padding: 0 8px;
    margin-left: 5px;
  }

  /deep/ .el-dialog {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
      background: rgba(241, 244, 246, 1);
      border-radius: 5px 5px 0px 0px;
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      .el-dialog__title {
        font-size: 13px;
        color: #333;
      }
      .el-dialog__headerbtn {
        top: 14px;
        .el-dialog__close {
          font-size: 16px;
        }
      }
    }
    .el-dialog__body {
      padding: 10px 20px 15px;
      color: #666;
      // tab切换字体尺寸
      .el-tabs__item {
        font-size: 15px;
      }
      // 单选框组右间距
      .el-radio-group {
        margin-right: 9px;
        display: flex;
        // 每个单选框的右间距
        .el-radio {
          margin-right: 7px;
          //字体距离按钮距离
          .el-radio__label {
            padding-left: 3px;
          }
        }
      }
      // 表格滚动条高度
      .el-table--scrollable-y .el-table__body-wrapper {
        height: 160px !important;
      }
    }
    .el-dialog__footer {
      padding: 15px 0px 20px;
      border-top: 1px solid #e9ecf1;
      text-align: right;
    }
  }
}
</style>
