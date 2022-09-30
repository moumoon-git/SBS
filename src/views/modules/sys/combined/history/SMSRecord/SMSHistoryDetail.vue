<template>
  <div>
    <el-dialog
      title="短信详情"
      :visible.sync="centerDialogVisible"
      width="800px"
      center
    >
      <div class="info">
        <div class="data">
          <p>发送时间：{{ detailData.sendTime }}</p>
          <p>收信人数量：{{ detailData.smsContactorVoList?detailData.smsContactorVoList.length:0 }}人</p>
          <p>
            状态：<span style="color:#7BD46B;">已发送</span>
          </p>
        </div>
        <p>关联事件：{{ detailData.eventName?detailData.eventName:'无' }}</p>
        <p>短信类型：{{ smsTypeOptions[detailData.type]?smsTypeOptions[detailData.type]:"" }}</p>
        <p v-if="detailData.type === 2">
          催报短信：【催报次数：{{ detailData.doTime }}次】【催报间隔：{{ detailData.doSpace }}分钟】【已发送/总条数 1/1】
        </p>
        <p v-if="detailData.doWay === 1">
          发送方式：定时发送 【{{ detailData.doData }}】
        </p>
        <div style="display:flex;">
          <p style="color: #696969;white-space: nowrap;">
            发送内容：
          </p>
          <div class="content">
            {{ detailData.content }}
          </div>
        </div>
      </div>

      <div class="addressee">
        <span class="people">收信人</span>
        <p class="sendNum">
          发送成功：{{ detailData.smsContactorVoList?detailData.smsContactorVoList.filter(v=>v.success===1).length:0 }}人
          发送失败：{{ detailData.smsContactorVoList?detailData.smsContactorVoList.filter(v=>v.success===0).length:0 }}人
        </p>
      </div>

      <!-- <div class="tab">
        <ul class="list">
          <li
            v-for="(item,index) in tabArr"
            :class="{'active':idx==index}"
            @click="idx=index"
            :key="index"
          >{{item}}</li>
        </ul>
        <botton class="retransmission">失败重发</botton>
      </div> -->

      <el-table
        :data="detailData.smsContactorVoList"
        style="width: 100%"
        height="400px"
      >
        <el-table-column
          prop="contactorName"
          label="姓名"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="phone"
          label="手机号码"
          align="center"
          width="130"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.phone !== ''">
              {{ scope.row.phone }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contactorWorkUnit"
          label="工作单位"
          align="center"
        />
        <el-table-column
          prop="contactorPosition"
          label="职务"
          align="center"
        />
        <el-table-column
          label="接受状态"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.success === 1 ? '成功' : '失败' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.success !== 1"
              style="color:#00A9F2;cursor: pointer"
              @click="retransmission(scope.row.smsId)"
            >重发</span>
            <span v-else>
              --
            </span>
          </template>
        </el-table-column>
      </el-table>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      tabArr: ['全部', '发送失败'],
      idx: 0, // 切换位置

      detailData: [],
      pageSize: 1,
      currentPage: 1,
      // smsTypeOptions:["通知","催报","请示","定时","上报","通报","其他"]
      smsTypeOptions: ['通知', '催报', '请示', '上报', '通报', '转发', '其他'],
    };
  },

  methods: {
    init(id) {
      this.centerDialogVisible = true;
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/smsListByGroupNum`,
        method: 'get',
        params: this.$http.adornParams({
          groupNum: id,
        }),
      }).then(({ data }) => {
        if (data.errorcode === 0) {
          this.detailData = data.data;
          // console.log(this.detailData)
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 重发
    retransmission(id) {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/sendAgain`,
        method: 'post',
        data: this.$http.adornData({
          smsId: id,
        }),
      }).then(({ data }) => {
        if (data.errorcode === 0) {
          this.$message({
            type: 'success',
            message: '重发成功',
            duration: 1000,
            onClose: () => {
              this.centerDialogVisible = false;
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.active {
  border-bottom: 2px solid #01a9f2;
}
.info {
  color: #696969;
  padding: 5px 20px;
  .data {
    display: flex;
    justify-content: space-between;
  }
}
.addressee {
  padding: 15px 10px 5px;
  display: flex;
  justify-content: space-between;
  .people {
    color: #696969;
    &::before{
      content: "";
      display:inline-block;
      width: 2px;
      height: 10px;
      background-color: #00A9F2;
      vertical-align: middle;
      margin-right: 3px;
    }
  }
  .sendNum {
    color: #666;
    margin: 0;
    .num {
      color: red;
    }
  }
}
.tab {
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .list {
    padding: 0;
    list-style: none;
    display: flex;
    li {
      width: 70px;
      padding: 5px 0;
      text-align: center;
    }
  }
  .retransmission {
    padding: 0px 10px;
    background-color: #01a9f2;
    color: white;
    border-radius: 5px;
    height: 32px;
    line-height: 32px;
  }
}
.content{
    text-indent: 0.5em;
    color:rgba(105,105,105,1);
    letter-spacing:1px;
    border: 1px solid rgba(184,184,184,1);
    border-radius: 5px;
    width: 90%;
}

/deep/ .el-dialog__wrapper .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #01a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
}

/deep/ .el-table .cell{
  font-weight: normal;
}
</style>
