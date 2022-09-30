<!--
 * @Author: yaoweixin
 * @Date: 2020-11-03 19:02:11
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-08 15:34:34
 * @Description: 会议记录
 * @FilePath: \SBSNEW\src\views\modules\sys\combined\history\MeetingRecord\meetingRecord.vue
-->
<template>
  <div class="meetingRecord">
    <sv-template
      ref="template"
      title=""
      :date-select="true"
      :search-setting="{
        width: '200px',
        placeholder: '请输入会议名称'
      }"
      :table-request="tableRequest"
    >
      <!-- 侧边栏部分 -->
      <template #left__container>
        <span />
      </template>
      <!-- 会议记录表格 -->
      <template #middle__table>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="placeWrapper">
              <div
                v-for="(item,index) in scope.row.memberList"
                :key="index"
                class="place"
              >
                <div v-if="item.memberType == 1">
                  <img
                    src="~@/assets/img/Telephone.png"
                    alt=""
                  >
                  <div class="placeRemark">
                    {{ item.name }}
                  </div>
                </div>
                <div v-if="item.memberType == 6">
                  <img
                    src="~@/assets/img/Seat.png"
                    alt=""
                  >
                  <div class="placeRemark">
                    {{ item.name }}
                  </div>
                </div>
                <div v-if="item.memberType == 8">
                  <img
                    src="~@/assets/img/video.png"
                    alt=""
                  >
                  <div class="placeRemark">
                    {{ item.name }}
                  </div>
                </div>
                <div v-if="item.memberType == 9">
                  <img
                    src="~@/assets/img/Monitor.png"
                    alt=""
                  >
                  <div class="placeRemark">
                    {{ item.name }}
                  </div>
                </div>
                <div v-if="item.memberType != 1 && item.memberType != 6 && item.memberType != 8 && item.memberType != 9">
                  <img
                    src="~@/assets/img/default.jpg"
                    alt=""
                  >
                  <div class="placeRemark">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="meetingRemark">
              会议备注：{{ scope.row.remark }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="会议名称"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="会议成员"
          prop="memberCount"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="发起时间"
          prop="startTime"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="会议时长"
          prop="time"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="发起人"
          prop="userName"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="关联事件"
          prop="emergencyName"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="170px"
        >
          <template slot-scope="scope">
            <div class="buttonWrapper">
              <div
                class="remark"
                @click="openRemarkDialog(scope.row.id)"
              >
                备注
              </div>
              <div
                class="update"
                @click="openUpdateDialog(scope.row.id)"
              >
                修改
              </div>
              <div
                class="relateMainSituaction"
                @click="openRelateMainSituationDialog(scope.row.id)"
              >
                关联事件
              </div>
              <div
                class="restartMeeting"
                @click="openRestartMeetingDialog(scope.row)"
              >
                重启会议
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 备注弹框 -->
    <remarkDialog
      ref="remarkDialog"
      @confirmAddRemark="confirmAddRemark"
    />
    <!-- 修改弹框 -->
    <updateMeetingDialog
      ref="updateMeetingDialog"
      @confirmUpdateMeetingName="confirmUpdateMeetingName"
    />
    <!-- 关联事件弹框 -->
    <relateMainSituaction
      ref="relateMainSituation"
      @confirmRelateMainSituation="confirmRelateMainSituation"
    />
    <!-- 重启会议弹框 -->
    <restartMeetingDialog
      ref="restartMeetingDialog"
      @confrimRestart="confirmRestart"
    />
  </div>
</template>

<script>
import remarkDialog from './remarkDialog';
import updateMeetingDialog from './updateMeetingDialog';
import relateMainSituaction from './relateMainSituation';
import restartMeetingDialog from './restartMeetingDialog';

export default {
  components: {
    remarkDialog,
    updateMeetingDialog,
    relateMainSituaction,
    restartMeetingDialog,
  },
  data() {
    return {
      // 表格数据接口
      tableRequest: {
        api: '/meeting/meetingRecord/list',
        params: {},
      },
      // 小区列表选项
      communityListOptions: [],
      // 选择小区性质选项
      communityPropertyOptions: [{
        label: '物业小区',
        value: '1',
      }, {
        label: '非物业小区',
        value: '2',
      }, {
        label: '商城投放点',
        value: '3',
      }],
      // 准备删除的数据的id数组
      deleteIds: [],
    };
  },
  mounted() {
    this.getCommunityList();
  },
  methods: {
    confirmRestart() {

    },
    /**
         * @description: 打开重启会议的弹框
         * @param {*}
         * @return {*}
         */
    openRestartMeetingDialog(data) {
      this.$refs.restartMeetingDialog.init(data);
    },
    /**
         * @description: 打开关联事件弹框
         * @param {int} id: 会议的id
         * @return {*}
         */
    openRelateMainSituationDialog(id) {
      this.$refs.relateMainSituation.init(id);
    },
    /**
         * @description: 确认关联事件
         * @param {*}
         * @return {*}
         */
    confirmRelateMainSituation() {
      this.getTableList();
    },
    /**
         * @description: 打开修改弹框
         * @param {int} id: 会议的id
         * @return {*}
         */
    openUpdateDialog(id) {
      this.$refs.updateMeetingDialog.init(id);
    },
    /**
         * @description: 修改弹框确认
         * @param {*}
         * @return {*}
         */
    confirmUpdateMeetingName() {
      this.getTableList();
    },
    /**
         * @description: 备注弹框确认
         * @param {*}
         * @return {*}
         */
    confirmAddRemark() {
      this.getTableList();
    },
    /**
         * @description: 打开备注弹框
         * @param {int} id: 会议的id
         * @return {*}
         */
    openRemarkDialog(id) {
      this.$refs.remarkDialog.init(id);
    },
    /**
         * @method
         * @desc 获取小区列表
         */
    getCommunityList() {
      this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/systown/list`)
        .then((response) => {
          if (response.data.code === 0) {
            const options = [];
            response.data.list.forEach((item) => {
              options.push({
                label: item.townName,
                value: item.id,
              });
            });
            this.communityListOptions = options;
          } else {
            console.log('获取小区列表数据失败！错误信息：【\n', response, '\n】');
          }
        })
        .catch((error) => {
          console.log('获取小区列表数据失败！错误信息：【\n', error, '\n】');
        });
    },
    /**
         * @method
         * @desc 获取表格数据
         */
    getTableList() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
         * @method
         * @desc 将后台获取的社区id转换成社区名
         * @param {Number, String} id 社区id
         * @return {String} 社区名
         */
    translateCommunityIdToName(id) {
      const communityName = this.communityListOptions.find((item) => item.value == id);
      if (communityName && communityName.label !== undefined && communityName.label !== null) {
        return communityName.label;
      }
    },

    /**
         * @method
         * @desc 删除数据
         * @param 需要删除的数据的id数组
         */
    handleDelete(ids) {
      const request = {
        method: 'post',
        url: '/garbage/garbageTransferPoint/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code == 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            console.log('删除失败！错误信息：【\n', response, '\n】');
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          console.log('删除失败！错误信息：【\n', error, '\n】');
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
  },
};
</script>
<style lang="less" scoped>
.meetingRecord {
  /deep/ .sv-template__container {
      height: calc(100vh - 170px);
  .placeWrapper {
      display: flex;
  .place {
      margin-left: 8px;
      div {
          display: flex;
          align-items: center;
      img {
          width: 15px;
        //   height: 15px;
      }

      .placeRemark {

      }
      }
  }
}

.meetingRemark {

}
/* 操作按钮样式 */
  .buttonWrapper {
      display: flex;
      align-items: center;
      justify-content: stretch;
  .remark {
      flex: auto;
      color: #0091FF;
      cursor: pointer;
  }

  .update {
      flex: auto;
      color: #0091FF;
      cursor: pointer;
  }

  .relateMainSituaction {
      flex: 5;
      color: #0091FF;
      cursor: pointer;
  }

  .restartMeeting {
      flex: 5;
      color: #0091FF;
      cursor: pointer;
  }
 }
}
}
</style>
