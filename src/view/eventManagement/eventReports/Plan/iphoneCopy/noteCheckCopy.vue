<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item prop="inputImport">
          <el-input
            @blur="blur('ruleForm')"
            v-model="ruleForm.inputImport"
            placeholder="添加号码,回车确认添加!"
            :validate-event="false"
            @keyup.enter.native="filterTexts('ruleForm')"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="phoneList">
      <tag ref="tag" :dataName="dataName" @handleClose="handleClose"></tag>
    </div>
    <div
      style="
        width: 100%;
        text-align: right;
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
      "
    >
      <el-link :underline="false" @click="empty">清空</el-link>&nbsp;&nbsp;
      <span>共{{ number }}人</span>
    </div>
    <!--    <div>-->
    <!--      <el-input-->
    <!--        :maxlength=1000-->
    <!--        clearable-->
    <!--        type="textarea"-->
    <!--        :rows="2"-->
    <!--        placeholder="请输入内容"-->
    <!--        v-model="submitData.reviewerData"-->
    <!--        :autosize="{ minRows:5, maxRows: 5}"-->
    <!--        resize="none"-->
    <!--        show-word-limit-->
    <!--      >-->
    <!--      </el-input>-->
    <!--    </div>-->
    <!--    <div class="bottomRow">-->
    <!--      <div class="leftSelect">-->
    <!--        <label class="export">签名:</label>-->
    <!--        <el-select v-model="submitData.signature" filterable clearable placeholder="请选择" @blur="selectBlur">-->
    <!--          <el-option-->
    <!--            v-for="item in options"-->
    <!--            :key="item.value"-->
    <!--            :label="item.label"-->
    <!--            :value="item.value">-->
    <!--          </el-option>-->
    <!--        </el-select>-->
    <!--      </div>-->
    <!--      <div class="rightButton">-->
    <!--        <el-button type="primary" size="mini" @click="sendData">发送</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import tag from "@/components/tag/tag";
export default {
  name: "noteCheckCopy",
  components: {
    tag,
  },
  props: {
    submitData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    let number = (rule, value, callback) => {
      let num = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
      let n = value.match(num);
      if (n == null) {
        callback(new Error("请输入正确的电话号码!"));
      }
      callback();
    };
    return {
      tabsTitle: "",
      number: 0, //共多少人
      dataName: [], //选中人员
      options: [
        { value: "办公室", label: "办公室" },
        { value: "财务室", label: "财务室" },
        { value: "总裁办", label: "总裁办" },
      ], //签名数据
      ruleForm: {
        inputImport: "", //添加号码
      },
      rules: {
        inputImport: [
          { validator: number, trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位数的电话号码!" },
        ],
      },
      optFor: [], //选中存储
      datas: [],
      ok: [],
      reduction: 0, //选中的-1
      eventId: "",
      report: "",
      signature: "",
    };
  },
  methods: {
    toValue(val) {
      //指令传达跳转过来传值
      console.log(val);
      this.submitData.reviewerData = val;
    },
    blur(ruleForm) {
      this.$refs[ruleForm].clearValidate();
    },
    filtr() {
      for (let i = 0; i < this.optFor.length; i++) {
        for (let j = i + 1; j < this.optFor.length; j++) {
          if (this.optFor[i].value == this.optFor[j].value) {
            this.optFor.splice(j, 1);
            j--;
          }
        }
      }
      this.datas = Array.from(new Set(this.optFor));
      this.dataName = this.datas;
      this.number = this.dataName.length;
    },
    filterTexts(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //如果输入的号码存在通讯录中，则直接加载通讯录名片
          this.reduction -= 1;
          let data = {
            phoneNum: Number(this.ruleForm.inputImport),
          };
          this.$api.findContactorByMobile(data).then((res) => {
            if (res.errorcode == 0) {
              if (res.data.mobile == "") {
                this.optFor.push({
                  name: this.ruleForm.inputImport,
                  value: this.ruleForm.inputImport,
                  id: this.reduction,
                });
                this.filtr();
              } else {
                this.optFor.push({
                  name: res.data.name,
                  value: res.data.mobile,
                  id: res.data.id,
                });
                this.filtr();
              }
            } else {
              this.optFor.push({
                name: this.ruleForm.inputImport,
                value: this.ruleForm.inputImport,
                id: this.reduction,
              });
              this.filtr();
            }
          });
        } //确认...上面每一次都过滤是因为异步导致的,ButIDontWantToChangeIt
      });
    },
    selectBlur(e) {
      this.submitData.signature = e.target.value;
    },
    handleClose(tag) {
      this.dataName.splice(this.dataName.indexOf(tag), 1);
      this.optFor.splice(this.optFor.indexOf(tag), 1);
      this.number = this.dataName.length;
    },
    empty() {
      //清空列表
      this.dataName = [];
      this.datas = [];
      this.optFor = [];
      this.number = this.dataName.length;
    },
    /**
     * @description: 选择子流程下的人员时添加H5短信成员
     * @lastEditor :xuchuangxuing
     * @update : 2020-11-18 11:43
     * @param {*} row 选择需要添加的成员信息
     * @return {*}
     */
    get(row) {
      this.dataName = [];
      this.datas = [];
      this.optFor.push({
        name: row.name,
        value: row.mobile || row.otherTel,
        id: row.contactorId || row.id,
      });
      for (let i = 0; i < this.optFor.length; i++) {
        if (this.optFor[i].mobile) {
          for (let j = i + 1; j < this.optFor.length; j++) {
            if (this.optFor[i].value == this.optFor[j].value) {
              this.optFor.splice(j, 1);
              j--;
            }
          }
        }
      }
      this.datas = Array.from(new Set(this.optFor));
      this.dataName = this.datas;
      this.number = this.dataName.length;
    },
    sendData(flowId) {
      this.eventId = sessionStorage.getItem("newID");
      let areaId = sessionStorage.getItem("areaId");
      if (this.eventId == "" || this.eventId == null) {
        this.$message({
          message: "暂无事件可进行操作",
          type: "warning",
        });
        return;
      }
      let datanamevalue = [];
      let nameSignature;
      let ids = [];
      for (let i = 0; i < this.dataName.length; i++) {
        if (!this.dataName[i].value) {
          this.$message({
            message: this.dataName[i].name + "电话号码为空",
            type: "warning",
          });
          return;
        }
        datanamevalue.push(this.dataName[i].value);
        ids.push(this.dataName[i].id);
      }
      if (!this.signature) {
        nameSignature = this.report;
      } else {
        nameSignature = this.report + "【" + this.signature + "】";
      }

      let json = {
        content: nameSignature,
        phoneNum: datanamevalue.join(),
        contactorIds: ids.join(),
        caseId: this.eventId,
        eventId: this.eventId,
        flowId,
      };
      // let data = json;
      let data =JSON.stringify(json);
      let infoData = {
        type: "submission",
        urlType: "eventInformation",
      };
      console.log("this.tabsTitle: ", this.tabsTitle);
      if (this.tabsTitle === "信息报送") {
        Object.assign(data, infoData);
        console.log("json: ", json);
      }
      if (json.phoneNum == "" || json.contactorIds == "") {
        this.$message({
          message: "请选择人员或输入电话号码",
          type: "warning",
        });
        return;
      }
      if (json.content == "") {
        this.$message({
          message: "请输入短信内容",
          type: "warning",
        });
        return;
      }

      if (window.g.IsNanShanProject) {
        // 南山项目发送普通短信
        this.$api.addSmsQueue(data).then((res) => {
          if (res.errorcode == "0") {
            this.$message({
              message: "短信下发中...",
              type: "success",
            });
            
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        if (this.tabsTitle === "指令传达") {
          this.$api.reportH5Sms(data).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "短信下发中...",
                type: "success",
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          // 修改h5发送接口
          // this.$api.addSmsQueue(data).then((res) => {
          this.$api.dutyH5Sms(data).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "短信下发中...",
                type: "success",
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      }
    },
    sendAudit() {
      // console.log('this.submitData.reviewerData: ', this.submitData.reviewerData);
      this.eventId = sessionStorage.getItem("newID");
      if (this.eventId == "" || this.eventId == null) {
        this.$message({
          message: "暂无事件可进行操作",
          type: "warning",
        });
        return;
      }
      let datanamevalue = [];
      let nameSignature;
      let ids = [];
      let nameArr = [];
      for (let i = 0; i < this.dataName.length; i++) {
        if (!this.dataName[i].value) {
          this.$message({
            message: this.dataName[i].name + "电话号码为空",
            type: "warning",
          });
          return;
        }
        datanamevalue.push(this.dataName[i].value);
        ids.push(this.dataName[i].id);
        nameArr.push(this.dataName[i].name);
      }

      if (!this.submitData.signature) {
        nameSignature = this.submitData.smsContent;
      } else {
        nameSignature =
          this.submitData.smsContent + "【" + this.submitData.signature + "】";
      }

      console.log("this.submitData.reviewerData: ", this.submitData);
      let json = {
        id: this.submitData.approvalId || undefined,
        contactorId:
          this.submitData.reviewerData.length > 0
            ? this.submitData.reviewerData[0].id
            : [],
        contactorName:
          this.submitData.reviewerData.length > 0
            ? this.submitData.reviewerData[0].name
            : [],
        contactorPhone:
          this.submitData.reviewerData.length > 0
            ? this.submitData.reviewerData[0].mobile
            : [],
        content: nameSignature,
        sendPhone: datanamevalue.join(),
        sendName: nameArr.join(),
        sendContactorId: ids.join(),
        eventId: this.eventId,
      };
      let data = {
        data: JSON.stringify(json),
        ids:
          this.submitData.checkImgArr.length > 0
            ? this.submitData.checkImgArr.map((v) => {
                return v.iId || v.id;
              })
            : [],
      };

      console.log("data: ", data);

      if (json.sendPhone == "" || json.sendContactorId == "") {
        this.$message({
          message: "请选择人员或输入电话号码",
          type: "warning",
        });
        return;
      }
      if (json.content == "") {
        this.$message({
          message: "请输入短信内容",
          type: "warning",
        });
        return;
      }
      if (this.submitData.reviewerData.length == 0) {
        this.$message({
          message: "请选择审核人",
          type: "warning",
        });
        return;
      }

      this.$api.saveOrUpdateAudit(data).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message:
              (this.submitData.approvalId ? "修改" : "保存") + "审核成功",
            type: "success",
          });
          this.ruleForm.inputImport = "";
          this.dataName = [];
          this.$emit("initData");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.phoneList {
  border: 1px dashed transparent;
  background: linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg, #ccc 0, #ccc 3px, white 0, white 5px);
  width: 100%;
  height: 120px;
  overflow-y: auto;
}

.bottomRow {
  width: 100%;
  display: flex;
  height: 50px;
  line-height: 50px;
}

.leftSelect {
  flex: 2;
  text-align: left;
}

.rightButton {
  flex: 1;
  text-align: right;
}

.export {
  color: #909399;
  vertical-align: middle;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  white-space: nowrap;
  font-size: 14px;
}

.leftSelect >>> .el-input {
  width: 100px;
}

.leftSelect >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
