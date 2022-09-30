<template>
  <div style="background-color: #f6f6f6;">
    <el-row style="padding:5px;"> 
      <el-row style="position:relative;">
        <el-tabs type="border-card" @tab-click="tabsTitle" class="tab">
          <el-tab-pane label="全部" name="全部"></el-tab-pane>
          <el-tab-pane label="群发" name="群发"></el-tab-pane>
          <el-tab-pane label="定时" name="定时"></el-tab-pane>
          <el-tab-pane label="催报" name="催报"></el-tab-pane>
          <!-- <el-tab-pane label="已发短信" name="已发短信"></el-tab-pane> -->
        </el-tabs>

        <div class="search">
          <!-- 时间选择 -->
          <div class="block" v-if="tab !== '全部'">
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>

          <!--        查找-->
          <aside class="serchWrap">
            <el-input type="text" class="input" clearable v-model="keyWord" placeholder="输入姓名/号码" ></el-input>
            <button @click="search">查找</button>
          </aside>
        </div>
      </el-row>

      <!-- 联系人 -->
      <el-col v-if="tab=='全部'" :span="14">
        <sms-history-contact :name="tab" ref="initContactView"></sms-history-contact>
      </el-col>

      <!-- 短信记录 -->
      <el-col v-if="tab=='群发'" :span="10">
        <sms-history-group-record ref="searchGroup"></sms-history-group-record>
      </el-col>

      <!-- 催报收信人 -->
      <el-col v-if="tab=='群发'" :span="7">
        <sms-history-group-addressee></sms-history-group-addressee>
      </el-col>

      <!-- 定时发送记录 -->
      <el-col v-if="tab=='定时'" :span="10">
        <sms-history-timing-record ref="searchTime"></sms-history-timing-record>
      </el-col>

      <!-- 定时收信人 -->
      <el-col v-if="tab=='定时'" :span="7">
        <sms-history-timing-addressee></sms-history-timing-addressee>
      </el-col>

      <!-- 催报发送记录 -->
      <el-col v-if="tab=='催报'" :span="10">
        <sms-history-report-record ref="searchReport"></sms-history-report-record>
      </el-col>

      <!-- 催报收信人 -->
      <el-col v-if="tab=='催报'" :span="7">
        <sms-history-report-addressee></sms-history-report-addressee>
      </el-col>

      <!-- 关联事件 -->
      <el-col v-if="tab !== '已发短信'" :span="tab=='全部'?10:7">
        <sms-history-content :name="tab"></sms-history-content>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
import smsHistoryContact from "./sms_history_all/sms_history_contact";
import smsHistoryContent from "./sms_history_all/sms_history_content";
import smsHistoryGroupAddressee from "./sms_history_group/sms_history_addressee";
import smsHistoryGroupRecord from "./sms_history_group/sms_history_record";
import smsHistoryTimingRecord from "./sms_history_timing/sms_history_record";
import smsHistoryTimingAddressee from "./sms_history_timing/sms_history_addressee";
import smsHistoryReportRecord from "./sms_history_report/sms_history_record";
import smsHistoryReportAddressee from "./sms_history_report/sms_history_addressee";
import bus from "@/views/common/js/eventBus";
export default {
  name: "sms_history",
  components: {
    "sms-history-contact": smsHistoryContact,
    "sms-history-content": smsHistoryContent,
    "sms-history-group-addressee": smsHistoryGroupAddressee,
    "sms-history-group-record": smsHistoryGroupRecord,
    "sms-history-timing-addressee": smsHistoryTimingAddressee,
    "sms-history-timing-record": smsHistoryTimingRecord,
    "sms-history-report-addressee": smsHistoryReportAddressee,
    "sms-history-report-record": smsHistoryReportRecord,
  },
  data() {
    return {
      tab: "全部", //  默认标签页第一页
      value1: "", //存放筛选日期
      keyWord: "", // 存放筛选内容
      addresseeData: "" //搜索收信人数据
    };
  },
  created() {
    this.searchDebounce = this._.debounce(() => {
      // console.log(this.value1[0])
      if (this.tab === "群发") {
        if (this.value1[0]) {
          this.$refs.searchGroup.initGroup(this.value1[0], this.value1[1]);
        }
        if (this.keyWord) {
          bus.$emit("upDateGroupList", this.addresseeData, this.keyWord);
        }
      } else if (this.tab === "催报") {
        if (this.value1[0]) {
          this.$refs.searchReport.getConactsList(
            this.value1[0],
            this.value1[1]
          );
        }
        if (this.keyWord) {
          // console.log(this.addresseeData);
          bus.$emit("upDateReportList", this.addresseeData, this.keyWord);
        }
      } else if (this.tab === "定时") {
        if (this.value1[0]) {
          this.$refs.searchTime.getConactsList(this.value1[0], this.value1[1]);
        }
        if (this.keyWord) {
          bus.$emit("upDateTimeList", this.addresseeData, this.keyWord);
        }
      }
      if (this.tab === "全部") {
        this.$refs.initContactView.initAll(this.keyWord);
      }
    }, 1000);
  },
  mounted() {
    bus.$on("getRow", row => {
      // console.log(row);
      this.addresseeData = row;
    });
  },
  methods: {
    tabsTitle(value) {
      this.value1 = ''
      // console.log(this.addresseeData)
      this.tab = value.label;
    },
    // 搜索
    search() {
      this.searchDebounce();
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  // padding: 15px 5px 0;
  min-width: 0;
}
.tab /deep/ .el-tabs__content {
  padding: 0;
}
.tab /deep/ .el-tabs--border-card > .el-tabs__header {
  border: none;
  background: none;
}
.tab {
  background: rgb(14, 142, 191);
  position: relative;
}
.tab /deep/ .el-tabs__item {
  color: #444 !important;
  border-radius: 5px 5px 0 0;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}
.tab /deep/ .is-active {
  color: white !important;
  background-color: #479dff !important;
}
.tab /deep/ .el-tabs__nav-scroll {
  background: white !important;
}

/deep/ .el-date-editor .el-range-separator {
  padding: 0;
}
.search {
  display: flex;
  position: absolute;
  right: 3%;
  top: 16%;
  .serchWrap {
    width: 300px;
    padding: 0px 5px;
    //   background: #00a2d4;
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-around;
    .input {
      height: 35px;
      width: 80%;
      border-radius: 20px;
      padding-left: 15px;
      color: #fff;
      vertical-align: top;
      box-sizing: border-box;
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
    button {
      height: 35px;
      width: 18%;
      border-radius: 18px;
      background: rgb(5, 147, 199);
      border: 1px solid #32b7ec !important;
      color: #fff;
      border: none;
      font-size: 15px;
      /*font-family: "KatTi";*/
      /*letter-spacing: 5px;*/
    }
  }
}
</style>
