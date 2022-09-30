<template>
  <div class="emergencyhandleCommunicationLog" style="width: 100%">
    <div
      style="width: 80%; margin: auto; position: relative; text-align: center"
    >
      <el-radio-group
        v-model="elRadio"
        @change="changeRadioGroup"
        size="small"
        style="
          width: max-content;
          margin: auto;
          border-radius: 5px;
          display: inline-block;
        "
        fill="#409EFF"
        text-color="#ffffff"
      >
        <el-radio-button label="电话记录"></el-radio-button>
        <el-radio-button label="短信记录"></el-radio-button>
        <el-radio-button label="会议记录"></el-radio-button>
      </el-radio-group>
    </div>

    <div
      v-if="radioGroupVisible == '电话记录'"
      style="
        width: 80%;
        max-height: 600px;
        overflow: auto;
        margin: auto;
        margin-top: 25px;
        position: relative;
        text-align: center;
      "
    >
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="坐席">
          <template slot-scope="scope">
            <i
              :class="[
                'iconfont',
                { 'icon-huru': scope.row['callType'] == 0 },
                { 'icon-huchudianhua': scope.row['callType'] == 1 },
              ]"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名">
          <template slot-scope="{ row }">
            {{ row.name || "未知" }}
          </template>
        </el-table-column>
        <el-table-column prop="workUnit" label="工作单位">
          <template slot-scope="{ row }">
            {{ row.workUnit || "未知" }}
          </template>
        </el-table-column>
        <el-table-column prop="position" label="职务">
          <template slot-scope="{ row }">
            {{ row.position || "未知" }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="通话号码">
          <template slot-scope="scope">
            <div>{{ scope.row["phoneNumber"].split("/")[0] }}/</div>
            <div>{{ scope.row["phoneNumber"].split("/")[1] }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="connectedTime" label="通话时间">
        </el-table-column>
        <el-table-column prop="duration" label="通话时长"> </el-table-column>
        <el-table-column prop="recordFile" width="350px" label="录音">
          <template slot-scope="scope">
            <audio :src="scope.row['recordFile']" controls="controls"></audio>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin: auto; margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

    <div
      v-if="radioGroupVisible == '短信记录'"
      style="
        width: 60%;
        max-height: 600px;
        margin: 25px 400px auto auto;
        position: relative;
        text-align: center;
      "
    >
      <el-timeline v-if="smsLog.length != 0">
        <el-timeline-item
          v-for="(activity, index) in smsLog"
          :key="index"
          :icon="activity.icon"
          size="large"
          :timestamp="activity.createTime"
          placement="top"
        >
          <div
            :style="{
              width: '100%',
              height: '35px',
              'line-height': '35px',
              background: activity.type == 0 ? 'rgb(64, 158, 255)' : '#bcbcbc',
              position: 'relative',
              color: 'white',
            }"
          >
            <span style="position: absolute; left: 2%">{{
              activity.type == 0 ? "发送" : "回复"
            }}</span>
            <span style="position: absolute; right: 2%"
              >值班员:{{ activity.operatorName }}</span
            >
          </div>
          <div
            style="
              width: 100%;
              margin: initial;
              padding: 20px;
              background: white;
            "
          >
            {{ activity.msgcontent }}
          </div>
          <i
            class="iconfont icon-biezhen"
            style="
              font-size: 28px;
              color: #bcbcbc;
              position: absolute;
              right: -25px;
              top: 50%;
              transform: translateY(-50%);
              z-index: 999;
            "
          ></i>
          <div
            style="
              width: 250px;
              height: 100%;
              margin: initial;
              position: absolute;
              right: -270px;
              top: 0%;
              border: 1px solid #bcbcbc;
              border-radius: 5px;
            "
          >
            <div style="margin-top: 5px">
              已发送{{
                activity.mhmIds ? activity.mhmIds.length : "0"
              }}个通讯录分组，共{{
                activity.messageInforContacotrVo
                  ? activity.messageInforContacotrVo.length
                  : "0"
              }}人
            </div>
            <el-tooltip placement="top">
              <div slot="content">
                <div
                v-for="(
                  contactor, contactorIndex
                ) in activity.messageInforContacotrVo"
                :key="contactorIndex"
              >
                {{ contactor.contactorName }}({{ contactor.phone }})
              </div>
              </div>
            <div v-if="activity.messageInforContacotrVo" style="overflow: hidden;
              display:-webkit-box;
              -webkit-box-orient:vertical;
              -webkit-line-clamp:3;">
              <span
                v-for="(
                  contactor, contactorIndex
                ) in activity.messageInforContacotrVo"
                :key="contactorIndex"
              >
                {{ contactor.contactorName }}({{ contactor.phone }})
              </span>
            </div>
            </el-tooltip>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div
        v-if="smsLog.length == 0"
        style="
          width: 100%;
          height: 200px;
          line-height: 200px;
          position: relative;
        "
      >
        <span style="position: absolute; right: 39%">暂无数据</span>
      </div>
    </div>
    <div
      v-if="radioGroupVisible == '会议记录'"
      style="
        width: 60%;
        max-height: 600px;
        margin: 25px 400px auto auto;
        position: relative;
        text-align: center;
      "
      class="meetingRecord"
    >
      <el-timeline style="width: 80%; margin: auto; margin-right: 100px">
        <el-timeline-item
          v-for="(item, index) in meetingList"
          :key="index"
          :hide-timestamp="false"
          :timestamp="item.startTime"
          placement="top"
        >
          <el-card>
            <div
              style="
                width: 100%;
                height: 35px;
                line-height: 35px;
                background: #bcbcbc;
                position: relative;
                color: white;
              "
              class="cardHeader"
            >
              <div class="headerContent">
                <div class="meetingName">{{ item.title }}</div>
                <div class="meetingTimeWrapper">
                  <div class="meetingTimeText">会议时长：</div>
                  <div class="meetingTime">{{ item.time }}</div>
                </div>
                <div class="meetingMemberWrapper">
                  <div class="meetingMemberText">会议成员：</div>
                  <div class="meetingMember">{{ item.memberCount }}</div>
                </div>
                <div class="launcherWrapper">
                  <div class="launcherText">发起人：</div>
                  <div class="launcher">{{ item.userName }}</div>
                </div>
              </div>
            </div>
            <!-- 内容区域 -->
            <div
              style="width: 100%; margin: initial; padding: 20px"
              class="content"
            >
              <div class="placeWrapper">
                <div
                  class="place"
                  v-for="(item2, index2) in item.memberList"
                  :key="index2"
                >
                  <div v-if="item2.memberType == 1">
                    <img src="~@/assets/img/Telephone.png" alt="" />
                    <div class="placeRemark">{{ item2.name }}</div>
                  </div>
                  <div v-if="item2.memberType == 6">
                    <img src="~@/assets/img/Seat.png" alt="" />
                    <div class="placeRemark">{{ item.name }}</div>
                  </div>
                  <div v-if="item2.memberType == 8">
                    <img src="~@/assets/img/video.png" alt="" />
                    <div class="placeRemark">{{ item.name }}</div>
                  </div>
                  <div v-if="item2.memberType == 9">
                    <img src="~@/assets/img/Monitor.png" alt="" />
                    <div class="placeRemark">{{ item.name }}</div>
                  </div>
                </div>
              </div>
              <div class="meetingRemark">会议备注：{{ item.remark }}</div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import imageWithHttp from "@/utils/imageWithHttp";
export default {
  data() {
    return {
      meetingList: [], //会议列表
      $window: {},
      $Cookies: {},
      elRadio: "电话记录",
      radioGroupVisible: "电话记录",
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      smsLog: [],
    };
  },
  components: {},
  // activated () {
  //   this.getDataList()
  // },
  created() {
    this.$Cookies = Cookies;
    this.$window = window;
    this.getDataList();
  },
  mounted() {},
  watch: {},
  methods: {
    // 获取数据列表
    getDataList() {
      this.$http({
        url: this.$http.adornUrl(
          `/emergency/emergencyhandleprocess/phoneRecordList?emergencyInfoId=${this.$route.query.id}&page=${this.currentPage}&limit=${this.pageSize}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("/emergency/emergencyhandleprocess/phoneRecordList",data)
          let tempdata = data.data.list;
          this.tableData = tempdata.map((item) => {
            // return {
            //   agentId: item.agentId,
            //   callType: item.callType,
            //   commonlyUsed: item.commonlyUsed,
            //   connectedTime: item.connectedTime,
            //   contactId: item.contactId,
            //   contactName: item.contactName,
            //   createTime: item.createTime,
            //   duration: item.duration,
            //   emergencyHandleId: item.emergency,
            //   emergencyInfoId: item.emergencyInfoId,
            //   emergencyTitle: item.emergencyTitle,
            //   endTime: item.endTime,
            //   id: item.id,
            //   indexCode: item.indexCode,
            //   isDeleted: item.isDeleted,
            //   leftOrRight: item.leftOrRight,
            //   name: item.name,
            //   operatorId: item.operatorId,
            //   operatorName: item.operatorName,
            //   phoneCalled: item.phoneCalled,
            //   phoneCalling: item.phoneCalling,
            //   platformId: item.platformId,
            //   position: item.position,
            //   recordFile: item.recordFile,
            //   remark: item.remark,
            //   startTime: item.startTime,
            //   status: item.status,
            //   updateTime: item.updateTime,
            //   workUnit: item.workUnit
            // };
            return {
              name: item.name,
              workUnit: item.workUnit,
              position: item.position,
              phoneNumber: `${item.phoneCalled} /\n ${item.phoneCalling}`,
              connectedTime: item.startTime,
              duration: item.duration,
              recordFile: item.recordFile,
              callType: item.callType,
            };
          });
          // this.tableData = data.data.list;
          this.totalCount = data.data.totalCount;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });

      this.$http({
        url: this.$http.adornUrl(
          `/emergency/emergencyhandleprocess/messageRecordList?emergencyInfoId=${this.$route.query.id}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("/emergency/emergencyhandleprocess/messageRecordList",data)
          this.smsLog = data.data;
          this.smsLog.forEach((item) => {
            if (item.type == 0) {
              item.icon = "iconfont icon-send";
            } else {
              item.icon = "iconfont icon-duanxinfasongrizhi";
            }
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
      //获取会议记录
      this.$http({
        url: this.$http.adornUrl(
          `/emergency/emergencyinfo/getMeetingRecord?id=${this.$route.query.id}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        console.log("获得的会议记录为", data);
        if (data && data.code === 0) {
          this.meetingList = data.data;
        }
      });
    },
    changeRadioGroup(val) {
      this.radioGroupVisible = val;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getDataList();
    },
  },
};
</script>
<style lang="less">
.emergencyhandleCommunicationLog {
  tr {
    th {
      text-align: center;
    }
  }
  .el-range-separator {
    width: auto !important;
  }
  .el-row {
    border: initial;
  }

  .el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none;
    .el-timeline-item {
      position: relative;
      padding-bottom: 20px;
    }
    .el-card__body {
      padding: 0px !important;
    }
    .el-timeline-item__tail {
      position: absolute;
      left: -30px;
      height: 100%;
      border-left: 2px solid #e4e7ed;
    }
    .el-timeline-item__node {
      left: -35px;
      width: 12px;
      height: 12px;
    }
    .el-timeline-item__node {
      position: absolute;
      background-color: #e4e7ed;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-timeline-item__wrapper {
      .el-timeline-item__timestamp.is-top {
        display: inline-block;
        position: absolute;
        left: -20%;
        top: -5px;
        background: #bcbcbc;
        color: white;
        border-radius: 5px;
        padding: 0px 4px;
      }
    }
    .el-timeline-item__content {
      position: relative;
      border: 1px solid #bcbcbc;
    }
    .el-timeline-item__node.el-timeline-item__node--large.el-timeline-item__node-- {
      background: initial;
    }
  }

  tr {
    th {
      background: #bbbbbb;
      color: white;
    }
  }
  /* 会议记录样式 */
  .meetingRecord {
    .el-timeline {
      .el-timeline-item {
        .el-card {
          .cardHeader {
            .headerContent {
              display: flex;
              justify-content: space-around;
              .meetingName {
              }

              .meetingTimeWrapper {
                display: flex;
                .meetingTimeText {
                }

                .meetingTime {
                }
              }

              .meetingMemberWrapper {
                display: flex;
                .meetingMemberText {
                }

                .meetingMember {
                }
              }

              .launcherWrapper {
                display: flex;
                .launcherText {
                }

                .launcher {
                }
              }
            }
          }

          .content {
            .placeWrapper {
              display: flex;
              .place {
                div {
                  display: flex;
                  align-items: center;
                  img {
                    width: 15px;
                    // height: 15px;
                  }

                  .placeRemark {
                  }
                }
              }
            }

            .meetingRemark {
              text-align: left;
            }
          }
        }
      }
    }
  }
}
</style>
