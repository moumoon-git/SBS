<template>
  <div class="SMSRecord">
    <div class="BtnHistory">
      <ul class="tabs">
        <li
          v-for="(item, index) in records"
          :key="index"
          class="oneTab"
          :class="{ bgc: idx == index }"
          @click="idx = index"
        >
          {{ item }}
        </li>
      </ul>
      <div class="opration">
        <el-select
          v-if="idx == 0"
          v-model="sendType"
          placeholder="请选择发送方式"
          style="width:12vw;"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-if="idx == 0"
          v-model="startTime"
          type="datetime"

          value-format="yyyy-MM-dd HH:mm:ss"
          style="width:185px;margin-left:10px;"
        />
        <span
          v-if="idx == 0"
          style="margin:0 10px;color:#696969"
        >至</span>
        <el-date-picker
          v-if="idx == 0"
          v-model="endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width:185px"
        />

        <!--
          @author tanjinfeng
          @date 2020-11-28
          @description 修改搜索框
        -->
        <!-- *** 原来的代码 *** -->
        <!-- <div
          style="position:relative;margin:0 10px 0 10px;width: 10vw;min-width:100px;border:1px solid #ccc !important;border-radius:5px;"
        >
          <img
            src="../../../../../../assets/img/search.png"
            style="width:16px;position:absolute;top: 6px;left:5px;z-index:999"
            alt
          />
          <input
            placeholder="请输入姓名、手机号"
            v-model="key"
            class="search"
            clearable
          />
        </div> -->
        <!-- *** 修改后的代码 *** -->
        <el-input
          v-model="searchKey"
          style="width: 200px; text-align: center; margin: 0 10px;"
          placeholder="请输入姓名、手机号"
          :clearable="true"
          prefix-icon="el-icon-search"
        />
        <!-- *** 结束 *** -->

        <el-button
          type="default"
          @click="search"
        >
          查询
        </el-button>
        <!-- bug 15317 用短信转接此模块替代这个功能 -->
        <!-- <el-button
          v-if="idx == 1"
          type="default"
          @click="forwardSetting"
        >
          转发设置
        </el-button> -->
        <el-button
          v-if="idx == 0"
          type="default"
          @click="outHandle"
        >
          导出
        </el-button>
        <el-button
          v-if="idx == 0"
          type="default"
          @click="exportAll"
        >
          导出全部
        </el-button>
      </div>
      <!-- <el-button type="default">批量登记</el-button> -->
    </div>

    <!-- 发送记录 -->
    <send-record
      v-if="idx == 0"
      ref="sendSearch"
      @getMultipleSelection="getAllCheck"
    />

    <!-- 回复记录 -->
    <reply-record
      v-if="idx == 1"
      ref="replySearch"
    />

    <!-- 联系人记录 -->
    <contact-record v-if="idx == 2" />
    <sv-dialog
      ref="dialog"
      title="转发设置"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
      @confirm="handleSubmit"
    >
      <el-input
        v-model="forwardPhone"
        class="forwardNum"
        placeholder="请填入转发的手机号码，号码之间请用“，”隔开"
      />
    </sv-dialog>
  </div>
</template>

<script>
import bus from '@/views/common/js/eventBus';
import $ from 'jquery';
import SendRecord from './SendRecord';
import ReplyRecord from './ReplyRecord';
import ContactRecord from './ContactRecord/ContactRecord';

export default {
  name: 'SMSRecord',
  components: {
    SendRecord,
    ReplyRecord,
    ContactRecord,
  },
  provide() {
    return {
      grandfather: this,
    };
  },
  data() {
    return {
      records: ['发送记录', '回复记录', '通讯录记录'], // 记录tab
      idx: 0, // 当前选中的tab
      startTime: '',
      endTime: '',
      options: [
        {
          value: '1',
          label: '即时',
        },
        {
          value: '2',
          label: '定时',
        },
        {
          value: '3',
          label: '催报',
        },
      ],
      sendType: '',
      searchKey: '',

      baseUrl: window.SITE_CONFIG.baseUrl,
      multipleSelection: [], // 选中列表
      forwardPhone: '',
    };
  },

  methods: {
    getAllCheck(val) {
      this.multipleSelection = val;
    },
    // 导出
    outHandle() {
      console.log(this.multipleSelection);
      const ids = this.multipleSelection.map((v) => v.contactorId);
      const arr = [];
      this.multipleSelection.forEach(element => {
        arr.push(element.id)
      });
      if (ids.length == 0) {
        this.$message({
          message: '请勾选导出选项',
          type: 'warning',
        });
        return;
      }
      const request = {
        method: 'post',
        baseURL: window.g.ApiUrl,
        url: '/eos/communication/sms/excel/output',
        // url: '/message/messageinfor/output-excel',
        headers: {
          token: this.$cookie.get('token'),
        },
        data: arr,
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '导出短信记录.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    exportAll() {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/eos/communication/sms/smsGroupByEvent/output-excel',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          key: this.searchKey,
          sendType: this.sendType,
          startTime: this.startTime,
          endTime: this.endTime,
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '导出全部短信记录.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    search() {
      if (this.idx === 0) {
        this.$refs.sendSearch.initData(
          this.searchKey,
          this.startTime,
          this.endTime,
          this.sendType,
        );
      } else if (this.idx === 1) {
        this.$refs.replySearch.initData(this.searchKey);
      } else if (this.idx === 2) {
        bus.$emit('contactKey', this.searchKey);
      }
      // this.key = "";
    },
    // 获取转发号码
    forwardSetting() {
      this.$http({
        method: 'get',
        baseURL: window.SITE_CONFIG.event,
        url: '/eos/sms/proxy/get',
        headers: {
          token: this.$cookie.get('token'),
        },
      }).then((response) => {
        if (response.data.code === 0) {
          this.forwardPhone = response.data.data.numbers;
        } else {
          this.$message.error(response.data.msg);
        }
      });
      this.$refs.dialog.visible = true;
    },
    // 保存短信自动转发号码
    handleSubmit() {
      // 号码格式校验
      let isRegular = true;
      // 以,分割号码校验
      const phones = this.forwardPhone ? this.forwardPhone.replace(/，/g, ',').split(',') : [];
      const mobileRegExp = /^1(\d){10}$/;
      const landlineRegExp = /^((\d)+-)?(\d){8}$/;
      phones.forEach((item) => {
        if (!mobileRegExp.test(item) && !landlineRegExp.test(item)) {
          isRegular = false;
        }
      });

      if (isRegular) {
        this.$http({
          method: 'post',
          baseURL: window.SITE_CONFIG.event,
          url: '/eos/sms/proxy/save',
          headers: {
            token: this.$cookie.get('token'),
          },
          data: { numbers: this.forwardPhone },
        }).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('保存成功');
            this.$refs.dialog.visible = false;
          } else {
            this.$message.error(response.data.msg);
          }
        });
      } else {
        this.$message.error('请输入正确的号码');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.SMSRecord {
  .bgc {
    background-color: #00a9f2;
    color: white;
  }
  .BtnHistory {
    z-index: 9;
    display: flex;
    padding: 10px 0px;
    align-items: center;
    height: 55px;
    border-bottom: 1px solid #ccc;
    padding-left: 360px;
    margin: 0 15px;
    .tabs {
      list-style: none;
      padding: 0;
      border-radius: 5px;
      border: 1px solid #ccc;
      // width: 231px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      display: flex;
      margin: 0 10px;
      flex: 0 0 276px;
      display: inline-flex;
      .oneTab {
        width: 33.3%;
        height: 100%;
        border-right: 1px solid #ccc;
        padding: 0 5px;
        cursor: pointer;
        &:last-child {
          border: none;
        }
      }
    }
    .opration {
      display: flex;
    }
    .limit {
      display: inline-block;
      width: 1px;
      height: 100%;
      background-color: #cccc;
      margin: 0 5px 0 20px;
    }
    .search {
      width: 100%;
      margin-right: 30px;
      padding-left: 20px;
      border: none;
      outline: none;
      &::-webkit-input-placeholder {
        color: #ccc;
      }
    }
  }
  .forwardNum {
    width: 460px;
    margin: 35px 20px;
    text-align: left;
    color: #555555;
  }
  /deep/ .el-input--medium .el-input__icon {
    line-height: 28px;
  }

  /deep/ .el-input--medium .el-input__inner {
    height: 30px;
    padding-left: 25px;
    text-align: center;
    &::-webkit-input-placeholder {
      color: #c6c6c6;
    }
  }
  /deep/ .el-button:hover {
    background-color: #00a9f2;
    color: white !important;
  }
  .el-button--medium {
    width: 55px;
    padding: 6px 0px;
    font-size: 12px;
    color: #00a9f2 !important;
    border: 1px solid #00a9f2;
  }

  /deep/ .el-input--medium .el-input__inner {
    height: 27px;
  }
}
</style>
