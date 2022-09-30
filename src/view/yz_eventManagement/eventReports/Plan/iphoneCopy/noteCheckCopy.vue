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
    <!-- 提示弹窗 -->
    <prompt-dialog-box
      v-if="promptConfig.visible"
      :prompt-dialog-config="promptConfig"
      @confirm="promptConfirm"
      @cancel="promptCanCel"
    ></prompt-dialog-box>
  </div>
</template>

<script>
import tag from "@/yz_components/tag/tag";
import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox";
export default {
  name: "noteCheckCopy",
  components: {
    tag,
    promptDialogBox,
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
        {
          value: "办公室",
          label: "办公室",
        },
        {
          value: "财务室",
          label: "财务室",
        },
        {
          value: "总裁办",
          label: "总裁办",
        },
      ], //签名数据
      ruleForm: {
        inputImport: "", //添加号码
      },
      rules: {
        inputImport: [
          {
            validator: number,
            trigger: "blur",
          },
          {
            min: 11,
            max: 11,
            message: "请输入11位数的电话号码!",
          },
        ],
      },
      optFor: [], //选中存储
      datas: [],
      ok: [],
      reduction: 0, //选中的-1
      eventId: "",
      report: "",
      signature: "",
      promptConfig: {
        // 提示弹窗的配置
        visible: false, // 是否显示弹窗
        promptType: "warn", // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
        promptTitle: "敏感信息发送提醒", // 弹窗标题
        promptText: "即将通过非密网络发送信息，请勿发送泄密信息", // 弹窗文本
        cancelButtonText: "取消发送", // 取消操作按钮文本
        confirmButtonText: "立即发送", // 确认操作按钮文本
        isNeedIcon: true, // 是否需要显示左边的图标
      },
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      flowId: null, // 子流程id
      auditData: null, //信息报送数据
      type: 0, // 类型0： 信息核实、信息报送、指令传达，1：信息报送 区别点击了弹窗确认按钮后，要执行的方法
    };
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-10-25
     * @lastEditor hexinting
     * @lastDate 2020-12-09
     * @description 弹窗确认按钮
     */
    promptConfirm() {
      if (this.type === 0) {
        this.sendSms(this.flowId); // 发送短信
      }
      if (this.type === 1) {
        // 信息报送
        if (this.auditData) {
          this.saveOrUpdateAudit(this.auditData); // 信息报送
        }
      }
    },
    /**
     * @author hexinting
     * @date 2020-10-25
     * @lastEditor hexinting
     * @lastDate 2020-10-25
     * @description 弹窗取消按钮
     */
    promptCanCel() {
      this.promptConfig.visible = false; // 隐藏弹窗
    },
    toValue(val) {
      //指令传达跳转过来传值
      console.log(val);
      this.submitData.reviewerData = val;
    },
    blur(ruleForm) {
      this.$refs[ruleForm].clearValidate();
    },
    /**
     * @description: 过滤重复添加的成员
     * @lastEditor :xuchuangxuing
     * @update : 2020-11-02 14:30
     * @param {*}
     * @return {*}
     */
    filtr() {
      for (let i = 0; i < this.optFor.length; i++) {
        for (let j = i + 1; j < this.optFor.length; j++) {
          if (this.optFor[i].mobile == this.optFor[j].mobile) {
            this.optFor.splice(j, 1);
            j--;
          }
        }
      }
      this.datas = Array.from(new Set(this.optFor));
      this.dataName = this.datas;
      this.number = this.dataName.length;
    },
    /**
     * @description: 添加报送对象
     * @updateTime : 2020-11-02 12:02
     * @lastEditor xuchuangxing
     * @param {*}
     * @return {*}
     */
    filterTexts(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //如果输入的号码存在通讯录中，则直接加载通讯录名片
          // this.reduction -= 1;
          const data = {
            phoneNum: Number(this.ruleForm.inputImport),
          };
          this.$api.findContactorByMobile(data).then((res) => {
            if (res.errorcode === 0) {
              // bug9538 未登记的号码没有正确显示,加了判断手机号是否为空 data: 2020.12.16 author:husiyue
              if (!res.mailContactor) {
                this.optFor.push({
                  name: this.ruleForm.inputImport,
                  mobile: this.ruleForm.inputImport,
                  workUnit: "",
                  position: "",
                  id: this.reduction,
                });
                this.filtr();
              } else {
                const mobile = res.mailContactor.mobile1
                  || res.mailContactor.mobile2
                  || res.mailContactor.orderNum
                  || res.mailContactor.otherTel
                  || res.mailContactor.phone
                  || '';
                this.optFor.push({
                  name: res.mailContactor.name,
                  mobile,
                  workUnit: res.mailContactor.workUnit,
                  position: res.mailContactor.position,
                  id: res.mailContactor.id,
                });
                this.filtr();
              }
            } else {
              this.optFor.push({
                name: this.ruleForm.inputImport,
                mobile: this.ruleForm.inputImport,
                workUnit: "",
                position: "",
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
      console.log('行的联系人:', row);
      this.dataName = [];
      this.datas = [];
      this.optFor.push({
        name: row.name,
        mobile: row.mobile || row.mobile1 || row.mobile2 || row.orderNum || row.otherTel || row.phone || '',
        workUnit: row.workUnit,
        position: row.position,
        id: row.contactorId || row.id,
      });
      for (let i = 0; i < this.optFor.length; i++) {
        if (this.optFor[i].mobile) {
          for (let j = i + 1; j < this.optFor.length; j++) {
            if (this.optFor[i].mobile == this.optFor[j].mobile) {
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
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-07
     * @description 发送短信
     */
    sendSms(flowId) {
      console.log("dataName", this.dataName);
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
        if (!this.dataName[i].mobile) {
          // bug8102  author：hexinting date:20201107
          this.$message({
            message: this.dataName[i].name + "电话号码为空",
            type: "warning",
          });
          return;
        }
        datanamevalue.push(this.dataName[i].mobile);
        ids.push(this.dataName[i].id); // bug8102 author：hexinting date:20201107
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
      let data = json;
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
          this.$api.dutyH5Sms({data}).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "短信下发中...",
                type: "success",
              });
              this.ruleForm.inputImport = ""
              this.dataName = []
              this.optFor = []
              this.$emit("verificationRecords"); // 信息核实，成功后执行操作
            } else {
              this.$message.error(res.msg);
            }
          });
        }
        if (this.IsYangZhouProject) {
          // 扬州项目需求：发送之前添加提醒 任务133
          this.promptConfig.visible = false; // 显示弹窗提醒
        }
      }
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-09
     * @description 发送短信
     */
    sendData(flowId) {
      this.type = 0; // 类型0： 信息核实、信息报送、指令传达，1：信息报送 区别点击了弹窗确认按钮后，要执行的方法
      // 任务133 author:hexinting date:2020-10-25
      this.flowId = flowId;
      if (this.IsYangZhouProject) {
        this.promptConfig.visible = true;
      } else {
        this.sendSms(flowId);
      }
    },
    /**
     * @description: 报送审核
     * @updateTime : 2020-12-09
     * @lastEditor hexinting
     * @param {*}
     * @return {*}
     */
    sendAudit() {
      // console.log('this.submitData.reviewerData: ', this.submitData.reviewerData);
      console.log("this.dataName: ", this.dataName);
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
      let workUnitArr = [];
      let positionArr = [];
      for (let i = 0; i < this.dataName.length; i++) {
        if (!this.dataName[i].mobile) {
          this.$message({
            message: this.dataName[i].name + "电话号码为空",
            type: "warning",
          });
          return;
        }
        datanamevalue.push(this.dataName[i].mobile);
        ids.push(this.dataName[i].id);
        nameArr.push(this.dataName[i].name);
        workUnitArr.push(this.dataName[i].workUnit);
        positionArr.push(this.dataName[i].position);
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
        sendWorkUnit: workUnitArr.join(),
        sendPosition: positionArr.join(),
        eventId: this.eventId,
        approvalContacts: this.dataName,
      };
      let data = {
        data: JSON.stringify(json),
        files: this.submitData.checkImgArr.concat(
          this.submitData.checkVideoArr
        ),
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

      this.auditData = data;
      this.type = 1; // 类型0： 信息核实、信息报送、指令传达，1：信息报送 区别点击了弹窗确认按钮后，要执行的方法
      // 任务133 发送短信前添加发送敏感提示弹窗 author：hexinting date:20201107
      if (this.IsYangZhouProject) {
        this.promptConfig.visible = true;
      } else {
        this.saveOrUpdateAudit(data);
      }
      // 注释原因：将以下请求接口的方法封装到一个函数中 author：hexinting date:20201107
      // this.$api.saveOrUpdateAudit(data).then((res) => {
      //     if (res.errorcode == "0") {
      //         this.$message({
      //             message: (this.submitData.approvalId ? '修改' : '保存') + '审核成功',
      //             type: "success",
      //         });
      //         this.ruleForm.inputImport = ""
      //         this.dataName = []
      //         this.optFor = []
      //         this.$emit("initData")
      //     } else {
      //         this.$message.error(res.msg);
      //     }
      // });
    },
    /**
     * @lastEditor hexinting
     * @date 2020-11-07
     * @description
     */
    saveOrUpdateAudit(data) {
      this.$api.saveOrUpdateAudit(data).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message:
              (this.submitData.approvalId ? "修改" : "保存") + "审核成功",
            type: "success",
          });
          this.ruleForm.inputImport = "";
          this.dataName = [];
          this.optFor = [];
          this.$emit("initData");
        } else {
          this.$message.error(res.msg);
        }
        this.promptConfig.visible = false;
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
