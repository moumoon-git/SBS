<template>
  <div class="check-dialog-all-container">
    <!-- 查看按钮弹窗 -->
    <el-dialog
      title="查看申报进度"
      width="1019px"
      :close-on-click-modal="closeClickModal"
      :visible.sync="checkDialogVisible"
    >
      <!-- 顶部表单说明 -->
      <div
        class="dialog-caption"
        v-if="checkFormDetail.approveManageEntity.approveTikuEntity.remark"
      >
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAB1ElEQVRIS8WWPUtcQRSGn/cGDBYKgoVtCjGmFlkLFSEEIZZ6Bf9HUlnauD9E3KulIiSFRIss9sGvImVSCBYJkgTcE2bv3t27urpzR7hOO2fmmTPnnTOv6DPMEAmzEL1HNoMxjhhpLjOuEZeYvkJjn5hjCXtsSz02aQnLoA2MiX4Ha86Lc7B1xew+FN8TaAmvMG0BFS/Q/aA6sjXFfL87dQ9oCfOY3AlHA2HZsitky4r5kt+nC9iCfQIGngjLlv9D9i4PbQNb13jildnCUbrh4ZzPuVym09n1doA1pzTPmsWNFJREPkAXU9eqzaS6cup2ajTt+K6mOBBkK069ar6zHZ16S9+dKgjIOSs2KasxB+pSUt9MQ4Bpp5iXbUdVZB/6QvIBwUBVZYmOMNe6CoxQoDiW1fQDGCuAC6thCvjpMvyD8bIUoPj7DMBnuNLioinW2jrVSkUTbYJ9LFTD4GD3LEIefjDQPfyQ1vZiEIjg9qbpM7yGcwOutQU178VvMDwJB2/g15kXr928s2gr8j29PYGh1/B5Cn5f+AC7v6dWls7H+H3APohOTO8PuAV1fqYci9G+2jJNVA5ank3Ml6c0I9wFzay+RUtEVulp9Ruqo8aej9X/D+WE04k0haOlAAAAAElFTkSuQmCC"
          alt="alert"
        />
        {{ checkFormDetail.approveManageEntity.approveTikuEntity.remark }}
      </div>

      <!-- 正文内容 -->
      <div class="main-content">
        <!-- 左边内容展示 -->
        <tikuDetail
          class="left-content-container"
          ref="tikuDetail"
          :currentId="currentId"
        ></tikuDetail>

        <!-- 右边流程展示 -->
        <div class="right-content-container" v-if="accountType != 'account'">
          <div class="title">审批流程</div>
          <!-- <el-button type="text" style="float:right;padding:3px;">查看政策文件</el-button>
          <el-button type="text" style="float:right;padding:3px;" @click="lookHistoryRecord">历史申报记录</el-button>-->
          <el-button
            class="histroy-button"
            type="text"
            @click="lookHistoryRecord"
            >历史申报记录</el-button
          >
          <!-- 1. 填报单位 -->
          <div class="progress-container">
            <div
              class="progress-item-container"
              :class="{
                'has-pre-progress next-progress':
                  processType[index] == '报审单位',
                'has-pre-progress inactive-progress':
                  processType[index] == '待审核',
                'has-pre-progress': processType[index] != '填报',
              }"
              v-for="(item, index) in processList"
              :key="`edit_progress_${index}`"
            >
              <div
                class="progress-item-header"
                v-if="processType[index] == '报审单位'"
              >
                <span>报审单位</span>
                <span>
                  <el-select
                    class="progress-select progress-item-select"
                    clearable
                    v-model="nextPlatformId"
                    :placeholder="baoshenData.name"
                    @change="UnitChange"
                  >
                    <el-option
                      v-for="(item, index) in platformOptions"
                      :key="`platform_edit_${index}`"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </span>
              </div>
              <div class="progress-item-header" v-else>
                <span>{{ processType[index] }}</span>
                <span>{{
                  item.approveApproveEntity.platformIdString == ""
                    ? item.depName
                    : item.approveApproveEntity.platformIdString
                }}</span>
              </div>

              <div class="progress-item-content">
                <div
                  class="each-line"
                  v-if="item.approveApproveEntity.gmtCreate"
                >
                  <span class="label">填报时间：</span>
                  <span>{{ item.approveApproveEntity.gmtCreate }}</span>
                </div>
                <div
                  class="each-line"
                  v-if="item.approveApproveEntity.sysUserVo.name"
                >
                  <span class="label">填报人：</span>
                  <span v-if="item.approveApproveEntity.sysUserVo.name">{{
                    item.approveApproveEntity.sysUserVo.name
                  }}</span>
                  <span v-if="item.approveApproveEntity.sysUserVo.role"
                    >（{{ item.approveApproveEntity.sysUserVo.role }}）</span
                  >
                  <!-- <span
                    class="phone"
                    v-if="item.approveApproveEntity.sysUserVo.phone"
                  >{{item.approveApproveEntity.sysUserVo.phone}}</span>-->
                </div>
                <div class="each-line" v-if="item.chargeMan.name">
                  <span class="label">负责人：</span>
                  <span v-if="item.chargeMan.name">{{
                    item.chargeMan.name
                  }}</span>
                  <span v-if="item.chargeMan.position"
                    >（{{ item.chargeMan.position }}）</span
                  >
                  <!-- <span class="phone" v-if="item.chargeMan.mobile1">{{item.chargeMan.mobile1}}</span> -->
                </div>
                <div
                  class="each-line"
                  v-if="item.approveApproveEntity.approveResult"
                >
                  <span class="label">审批结果：</span>
                  <span
                    v-if="item.approveApproveEntity.approveResult == '0'"
                    style="color: #70b603"
                    >审核通过</span
                  >
                  <span
                    v-if="item.approveApproveEntity.approveResult == '1'"
                    style="color: #d9001b"
                    >已驳回</span
                  >
                </div>
                <div
                  class="each-line"
                  v-if="item.approveApproveEntity.approveComments"
                >
                  <span class="label">审批意见：</span>
                  <span>{{ item.approveApproveEntity.approveComments }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- <div
            class="check-process-wrapper"
            v-for="(item,index) in processList"
            :key="`show${index}`"
          >
            <span
              :class="!item.approveApproveEntity.platformId?'check-process-head-grey':'check-process-head-1'"
            >{{processType[index]}}</span>
            
            <span v-if="processType[index] =='报审单位'">
              <el-select
                clearable
                class="check-process-content-1"
                v-model="nextPlatformId"
                :placeholder="baoshenData.name"
                @change="UnitChange"
              >
                <el-option
                  v-for="(item,index) in platformOptions"
                  :key="`platform1${index}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
            <span
              v-if="processType[index] != '报审单位'"
              :class="!item.approveApproveEntity.platformId?'check-process-content-grey':'check-process-content-1'"
            >{{item.approveApproveEntity.platformIdString==''?item.depName:item.approveApproveEntity.platformIdString}}</span>
            
            <div class="check-process-main">
              <el-form ref="form" label-width="100px">
                <el-form-item
                  v-if="item.approveApproveEntity.gmtCreate!=''"
                  label="填报时间："
                >{{item.approveApproveEntity.gmtCreate}}</el-form-item>
                <el-form-item v-if="item.approveApproveEntity.sysUserVo.name!=''" label="填报人：">
                  <span>{{item.approveApproveEntity.sysUserVo.name}}({{item.approveApproveEntity.sysUserVo.role}})</span>
                  <span
                    style="float:right;margin-right:5%"
                  >{{item.approveApproveEntity.sysUserVo.phone}}</span>
                </el-form-item>
                <el-form-item v-if="item.chargeMan.name!=''" label="负责人：">
                  <span>{{item.chargeMan.name}}({{item.chargeMan.position}})</span>
                  <span style="float:right;margin-right:5%">{{item.chargeMan.mobile1}}</span>
                </el-form-item>
                <el-form-item v-if="item.approveApproveEntity.approveResult!=''" label="审批结果：">
                  <span
                    v-if="item.approveApproveEntity.approveResult=='0'"
                    style="color:#70B603"
                  >审核通过</span>
                  <span
                    v-if="item.approveApproveEntity.approveResult=='1'"
                    style="color:#D9001B "
                  >已驳回</span>
                </el-form-item>
                <el-form-item
                  v-if="item.approveApproveEntity.approveComments!=''"
                  label="审批意见："
                >{{item.approveApproveEntity.approveComments}}</el-form-item>
              </el-form>
            </div>
          </div>-->
        </div>
      </div>

      <!-- 底部审核编辑部分 -->
      <approveEdit
        v-if="type == 'shenhe' && showshenhe"
        @cancel="checkDialogVisible = false"
        @refreshTable="getData()"
        ref="approveEdit"
        :nextPlatformId="nextPlatformId"
        :id="dataForm.id"
        :processid="processId"
        :tikutype="TikuType"
      ></approveEdit>

      <!-- 底部取消确定按钮 -->
      <div class="dialog-footer" v-if="type == 'update'">
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <!-- TODO：历史记录弹窗 -->
    <historyRecord ref="historyRecord"></historyRecord>
  </div>
</template>

<script>
import historyRecord from "@/views/modules/approveLevel/resourceManage/historyRecord.vue";
import tikuDetail from "./tikuDetail";
import approveEdit from "../resourceManage/approveEdit";
export default {
  name: "checkDialog",
  created() {},
  props: ["managerId", "TikuType"],
  components: {
    tikuDetail,
    approveEdit,
    historyRecord,
  },
  watch: {
    TikuType(newVal, oldVal) {
      console.log("提莫123", newVal);
    },
  },
  data() {
    return {
      accountType: "",
      tikuVisible: false,
      //填报人
      createUser: {
        id: "",
        name: "",
        phone: "",
        role: "",
      },
      showshenhe: false,
      closeClickModal: false, //禁止点击model关闭dialog
      processId: "",
      //新增
      //填报单位
      tianbaoUnit: "",
      //当前平台
      nowPlatForm: "",
      // 报审平台数据
      platformData: [],
      //报审单位
      baoshenData: {
        id: "",
        name: "",
        contactor: { id: "", name: "", role: "", phone: "" },
      },
      // baoshenUnit: "",
      // baoshenId: "",
      //流程单位
      unitList: [],
      //类型
      processType: [],
      processList: [],
      dataForm: {
        id: "",
        rewardAmount: "",
      },
      nextPlatformId: "",
      dataRules: {
        rewardAmount: [
          {
            required: true,
            message: "申请奖励金额不能为空",
            trigger: "blur",
          },
        ],
      },
      baoshenData: {
        id: "",
        name: "",
        contactor: {
          id: "",
          name: "",
          role: "",
          phone: "",
        },
      },
      platformData: [],
      platformOptions: [],
      nextPlatformId: "",
      // 当前这条数据的id
      currentId: "",
      manageId: "",
      // 该组件是否可见
      checkDialogVisible: false,
      type: "",
      checkFormDetail: {},
      checkForm: [],
      unitList: [],
      processList: [],
      processType: [],
      documentList: [],
      processData1: {
        place: "路边村",
        time: "2020-05-25 15:55",
        name: "张主任",
        result: "同意",
        feedback: "已核实信息，该屋主2020年期间严格落实人屋那关及技防措施。",
      },
      processData2: {
        place: "派出所",
        time: "2020-05-25 15:55",
        name: "李所长",
        result: "同意",
        feedback: "已核实信息，该屋主2020年期间严格落实人屋那关及技防措施。",
      },
    };
  },
  methods: {
    lookHistoryRecord() {
      //点击查看历史记录
      // this.checkDialogVisible = false
      console.log("查看历史记录", this.currentId, this.TikuType);
      this.$refs.historyRecord.init(this.currentId, this.TikuType);
      this.$refs.historyRecord.dialogVisible = true;
      // this.$emit("queryHistoryRecord", this.dataForm.id);
    },
    getData() {
      this.$emit("getDataList");
    },
    dialogSubmit() {
      let sure = true;
      // for (let i in this.checkForm) {
      //   let v = this.checkForm[i];
      //   console.log("12341", v);
      //   if (v.answer.length === 0 && v.isAnswer == "1") {
      //     this.$message.warning(`请选择${v.title}`);
      //     sure = false;
      //     return;
      //   }
      // }
      // if (sure) {
      // this.$refs["dataForm"].validate((valid) => {
      // if (valid) {
      this.checkForm.map((v) => {
        if (v.topicName == "图片" && v.answer) {
          v.answer.map((v) => {
            if (v.url) {
              this.$delete(v, "url");
              this.$delete(v, "uuid");
              this.$delete(v, "status");
            }
            console.log("url: ", v);
          });
        }
      });
      if (sure) {
        let index = this.processType.findIndex((item) => item == "已审核");
        this.checkForm.map((v) => {
          if (v.topicName == "图片" && v.answer) {
            v.answer.map((v) => {
              if (v.url) {
                this.$delete(v, "url");
                this.$delete(v, "uuid");
                this.$delete(v, "status");
              }
              console.log("url: ", v);
            });
          }
        });
        if (this.nextPlatformId == "" && index < this.unitList.length) {
          this.$message.error("请选择下个平台名字");
          return;
        }
        // 保存修改
        console.log("manageId", this.manageId);
        this.$http({
          url: this.$http.adornUrl(`/approve/approveReward/update`),
          method: "post",
          data: {
            id: this.dataForm.id,
            rewardAmount: this.dataForm.rewardAmount,
            nextPlatformId: this.nextPlatformId,
            answerList: this.checkForm.map((v) => {
              return {
                questionId: v.id,
                answer: v.answer
                  ? typeof v.answer == "string"
                    ? v.answer + (v.remark ? "##" + v.remark : "")
                    : typeof v.answer == "object" && v.topicName != "图片"
                    ? v.answer.toString()
                    : JSON.stringify(v.answer)
                  : "",
              };
            }),
          },
        }).then(({ data }) => {
          if (data && data.code == 0) {
            this.checkDialogVisible = false;
            this.$emit("getDataList");
            // this.getDataList();
          } else {
            this.$message.error(data.msg);
          }
        });
        // 下方审核提交
        // this.$refs.approveEdit.approveSubmit();
      }
    },
    init(id, type, accountType) {
      this.accountType = accountType;
      this.tikuVisible = true;
      this.currentId = id;
      this.nextPlatformId = "";
      this.nextPlatformName = "";
      this.nowPlatForm = this.$cookie.get("platformId");
      this.dataForm.id = id;
      this.showshenhe = false;
      this.type = type;
      // this.type = "shenhe";
      console.log("tikuType在不", this.TikuType);
      this.processType = ["填报"];
      var processTime = 0;

      if (this.type == "show") {
        // this.type = "shenhe";
        this.getDataDetail();
      }
      if (this.type == "shenhe") {
        this.getDataDetail();
      }
    },
    getDataDetail() {
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveReward/info/${this.dataForm.id}`
        ),
        method: "get",
        param: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("详情数据", data);
          this.manageId = data.data.managerId;
          this.checkFormDetail = data.data;
          //右边流程图
          this.getUnit();
          this.processList = data.data.approveManageEntity.processList;

          this.processList.forEach((item) => {
            if (item.chargeMan == null) {
              item.chargeMan = {
                id: "",
                name: "",
                position: "",
                mobile1: "",
              };
            }
            if (item.approveApproveEntity == null) {
              item.approveApproveEntity = {
                approveComments: "",
                approveResult: "",
                createUserId: "",
                gmtCreate: "",
                gmtModified: "",
                id: "",
                isDeleted: "",
                modifiedUserId: "",
                nextPlatformId: "",
                nextPlatformIdString: "",
                platformId: "",
                platformIdString: "",
                processId: "",
                qrcodeImg: "",
                rewardId: "",
                sysUserVo: { id: "", name: "", phone: "", role: "" },
                tikuType: "",
              };
            }
          });
          // this.baoshenData.name =
          //   "请选择" + data.data.approveManageEntity.unitList[1].unitIdString;
          this.baoshenData.name = "请选择" + this.processList[1].depName;
          // console.log("报审单位", this.baoshenData.name, this.processList);

          var index = this.processList.findIndex(
            (item) => item.approveApproveEntity.platformIdString == ""
          );
          // console.log("没错", index);
          if (
            index > 0 &&
            this.processList[index - 1].approveApproveEntity.approveResult != 1
          ) {
            this.processList[
              index
            ].approveApproveEntity.platformId = this.processList[
              index - 1
            ].approveApproveEntity.nextPlatformId;
            // this.nextPlatformName = this.processList[
            //   index - 1
            // ].approveApproveEntity.nextPlatformId;
            this.processList[
              index
            ].approveApproveEntity.platformIdString = this.processList[
              index - 1
            ].approveApproveEntity.nextPlatformIdString;
            let choosePlatformid = this.processList[index].approveApproveEntity
              .platformId;
            this.getPlatformById(choosePlatformid);
          }

          for (let i = 1; i < this.processList.length; i++) {
            if (this.processList[i].approveApproveEntity.sysUserVo.name == "") {
              if (
                this.processList[i].approveApproveEntity.nextPlatformIdString ==
                  "" &&
                this.processList[i].approveApproveEntity.platformIdString != ""
              ) {
                if (this.type == "update" && i == 1) {
                  this.processType.push("报审单位");
                  this.nextPlatformName = this.processList[0].approveApproveEntity.nextPlatformId;
                  this.nextPlatformId = this.processList[0].approveApproveEntity.nextPlatformId;
                } else {
                  this.processType.push("审核中");
                  if (
                    i < this.processList.length - 1 &&
                    this.type == "shenhe"
                  ) {
                    let nowIndex = this.processType.findIndex(
                      (item) => item == "审核中"
                    );
                    if (nowIndex > 0) {
                      if (
                        this.processList[nowIndex - 1].approveApproveEntity
                          .nextPlatformId == this.nowPlatForm
                      ) {
                        this.showshenhe = true;
                        this.processType.push("报审单位");
                        i += 1;
                      }
                    }
                  }
                }

                // console.log("type", "审核中");
              } else {
                this.processType.push("待审核");
              }
            } else {
              this.processType.push("已审核");
            }
          }
          let lastIndex = this.processType.findIndex(
            (item) => item == "审核中"
          );
          if (lastIndex == this.processList.length - 1) {
            this.nextPlatformId = "0";
          }
          if (this.type == "shenhe") {
            let a = this.processType.findIndex((item) => item == "审核中");
            if (a > 0) {
              this.processId = this.processList[a].id;
              console.log("流程id", this.processId, this.nextPlatformId);
              if (
                this.processList[a - 1].approveApproveEntity.nextPlatformId ==
                this.nowPlatForm
              ) {
                this.showshenhe = true;
              }
            }
          }
          this.checkDialogVisible = true;
        } else {
          this.checkFormDetail = {};
          this.checkForm = [];
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    UnitChange() {
      let index = this.platformData.findIndex(
        (item) => item.id == this.nextPlatformId
      );
      // console.log("1234", this.dataForm.nextPlatformId, this.platformData);
      if (index >= 0) {
        // console.log("下拉框改变", index, this.platformData[index]);
        if (this.platformData[index].contactor != null) {
          // console.log("新增报审人", this.baoshenData);
          // this.baoshenData.id = this.platformData[index].id;
          this.baoshenData.name = this.platformData[index].name;
          this.baoshenData.contactor.id = this.platformData[index].contactor.id;

          this.baoshenData.contactor.name = this.platformData[
            index
          ].contactor.name;
          ``;
          this.baoshenData.contactor.role = this.platformData[
            index
          ].contactor.position;
          this.baoshenData.contactor.phone = this.platformData[
            index
          ].contactor.mobile1;
          // console.log("新增报审人", this.baoshenData);
          if (this.type == "shenhe" || this.type == "update") {
            let i = this.processType.findIndex((item) => item == "报审单位");
            console.log("1111111", this.processList);
            this.processList[i].chargeMan.id = this.platformData[
              index
            ].contactor.id;

            this.processList[i].chargeMan.name = this.platformData[
              index
            ].contactor.name;
            this.processList[i].chargeMan.position = this.platformData[
              index
            ].contactor.position;
            this.processList[i].chargeMan.mobile1 = this.platformData[
              index
            ].contactor.mobile1;
          }
        } else {
          if (this.type == "shenhe" || this.type == "update") {
            let i = this.processType.findIndex((item) => item == "报审单位");
            // console.log("审核失败1111111111111111", this.processList);
            this.processList[i].chargeMan.name = "-";
            this.processList[i].chargeMan.position = "-";
            this.processList[i].chargeMan.mobile1 = "-";
          }
          this.baoshenData = {
            id: "",
            name: "",
            contactor: { id: "", name: "", position: "", mobile1: "" },
          };
        }
      } else {
        if (this.type == "shenhe") {
          let i = this.processType.findIndex((item) => item == "报审单位");
          this.processList[i].chargeMan.id = "";
          this.processList[i].chargeMan.name = "";
          this.processList[i].chargeMan.position = "";
          this.processList[i].chargeMan.mobile1 = "";
        }
        this.baoshenData = {
          id: "",
          name: "",
          contactor: { id: "", name: "", position: "", mobile1: "" },
        };
      }
      // console.log("下拉框改变", this.platformData[index], this.baoshenData);
    },
    getPlatform() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//info/${this.nowPlatForm}`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.tianbaoUnit = data.platForm.platformName;
          // this.console.log("当前平台名称", data);
          // data.data.forEach(item => {
          //   this.platformOptions.push({ value: item.code, label: item.name });
          // });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
      // console.log("报审单位", this.processType[index], this.baoshenData.id);
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getPlatForm?id=${this.baoshenData.id}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("报审单位平台数据", data, this.baoshenData.id);
          this.platformOptions = [];
          this.platformData = data.data;
          data.data.forEach((item) => {
            this.platformOptions.push({
              value: item.id,
              label: item.platformName,
            });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getUnit() {
      let manageId = this.manageId;
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getUnit?id=${manageId}`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.unitList = data.data;
          console.log("111111", this.type, this.unitList);
          if (this.unitList.length > 1) {
            if (this.type == "add") {
              this.baoshenData.id = this.unitList[0].depId;
              this.baoshenData.name = "请选择" + this.unitList[0].depName;
              this.tianbaoUnit = this.unitList[0].depName;
            }

            if (this.type == "shenhe" || this.type == "update") {
              var Unitindex = this.processType.findIndex(
                (item) => item == "报审单位"
              );
              console.log(
                "22222222",
                this.processType,
                Unitindex,
                this.unitList
              );
              if (Unitindex > 0) {
                this.baoshenData.id = this.unitList[Unitindex - 1].depId;
                this.baoshenData.name =
                  "请选择" + this.unitList[Unitindex - 1].depName;
              }
            }
            // console.log("新增", this.unitList, this.baoshenData.name);
          }
          this.getPlatform();
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getPlatformById(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//infoById/${id}`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("byId", data);
          if (this.type == "add") {
            this.createUser.id = data.platform.contactor.id;
            this.createUser.name = data.platform.contactor.name;
            this.createUser.phone = data.platform.contactor.mobile1;
            this.createUser.role = data.platform.contactor.position;
          } else {
            var index = this.processType.findIndex((item) => item == "审核中");
            if (index > -1) {
              this.processList[index].chargeMan.id = data.platform.contactor.id;
              this.processList[index].chargeMan.name =
                data.platform.contactor.name;
              this.processList[index].chargeMan.position =
                data.platform.contactor.position;
              this.processList[index].chargeMan.mobile1 =
                data.platform.contactor.mobile1;
            }
            let i = this.processType.findIndex((item) => item == "报审单位");
            if (i > -1 && this.type == "update") {
              this.processList[i].chargeMan.id = data.platform.contactor.id;
              this.processList[i].chargeMan.name = data.platform.contactor.name;
              this.processList[i].chargeMan.position =
                data.platform.contactor.position;
              this.processList[i].chargeMan.mobile1 =
                data.platform.contactor.mobile1;
            }
          }
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    // 判断是图片还是文档
    isImg(url) {
      let res = url.slice(-4);
      if (
        res == ".png" ||
        res == ".jpg" ||
        res == "jpeg" ||
        res == ".gif" ||
        res == ".bmp"
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>
  
<style lang="less">
.old_version_abandoned {
  // .checkDialog {
  //   .jlsqDataForm {
  //     .el-input--medium {
  //       margin-left: -10px;
  //     }
  //   }
  //   .report-table {
  //     .el-form-item__label {
  //       margin-left: 60px;
  //     }
  //     .el-form-item__content {
  //       margin-left: 205px !important;
  //     }
  //     .el-input__inner {
  //       width: 250px;
  //     }
  //     .info {
  //       font-size: 14px;
  //       padding: 20px;
  //       background-color: white;
  //       .portrait {
  //         width: 120px;
  //         height: 200px;
  //         border-radius: 10px;
  //       }
  //       .example {
  //         color: #c0c0c0;
  //       }
  //     }
  //   }
  // }
  // .el-select-dropdown .el-popper {
  //   left: 1290px !important;
  // }
  // .check-process-wrapper {
  //   margin-left: 15px;
  //   max-height: 280px;
  //   padding: 0;
  //   font-size: 13px;
  // }
  // .check-process {
  //   margin: 20px;
  //   width: 20vw;
  //   border: 1px solid rgba(215, 215, 215, 1);
  //   border-radius: 3px;
  //   background-color: rgba(249, 251, 255, 1);
  //   padding: 10px;
  // }
  // .check-process-head-1 {
  //   border: 1px solid #0091ff;
  //   border-radius: 3px;
  //   color: white;
  //   background-color: #0091ff;
  //   padding: 5px 15px;
  //   display: inline-block;
  //   width: 4.6vw;
  //   text-align: center;
  // }
  // .check-process-head-grey {
  //   border: 1px solid rgba(215, 215, 215, 1);
  //   border-radius: 3px;
  //   color: white;
  //   background-color: rgba(215, 215, 215, 1);
  //   padding: 5px 15px;
  //   display: inline-block;
  //   width: 4.6vw;
  //   text-align: center;
  // }
  // .check-process-content-1 {
  //   font-size: 11px;
  //   border: 1px solid #0091ff;
  //   border-left: none;
  //   border-top-right-radius: 5px;
  //   border-bottom-right-radius: 5px;
  //   padding: 5px 15px;
  //   display: inline-block;
  //   width: 13vw;
  //   text-align: center;
  //   .el-input__inner {
  //     background-color: #f9fbff;
  //     border: 0;
  //     height: 28px;
  //   }
  // }
  // .check-process-content-grey {
  //   border: 1px solid rgba(215, 215, 215, 1);
  //   border-left: none;
  //   border-top-right-radius: 5px;
  //   border-bottom-right-radius: 5px;
  //   color: rgba(215, 215, 215, 1);
  //   padding: 5px 15px;
  //   display: inline-block;
  //   width: 18vw;
  //   text-align: center;
  // }
  // .check-process-head-2 {
  //   border: 1px solid rgba(215, 215, 215, 1);
  //   border-radius: 3px;
  //   color: white;
  //   background-color: rgba(215, 215, 215, 1);
  //   padding: 5px 15px;
  //   display: inline-block;
  //   width: 4.6vw;
  //   text-align: center;
  // }
  // .check-process-content-2 {
  //   border: 1px solid rgba(215, 215, 215, 1);
  //   border-left: none;
  //   border-top-right-radius: 5px;
  //   border-bottom-right-radius: 5px;
  //   color: rgba(215, 215, 215, 1);
  //   padding: 5px 15px;
  //   display: inline-block;
  //   width: 13vw;
  //   text-align: center;
  // }
  // .check-process .el-form-item {
  //   margin-bottom: 0;
  // }
  // .check-process-main {
  //   width: 342px;
  //   border: 1px solid rgba(170, 170, 170, 1);
  //   border-top: none;
  //   border-radius: 3px;
  // }
}

/**
 * @author tanjinfeng
 * @date 2020.08.18
 */
.check-dialog-all-container {
  /deep/.el-dialog {
    border-radius: 7px;
    /deep/.el-dialog__header {
      background: #f1f4f6;
      border-radius: 7px;
      padding: 15px 28px;
      .el-dialog__title {
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
      }
      .el-dialog__headerbtn {
        height: 21px;
        width: 21px;
        line-height: 21px;
        text-align: center;
        position: absolute;
        top: 14px;
        right: 14px;
        i {
          font-size: 20px;
          font-weight: bolder;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
      .dialog-caption {
        padding: 7px 15px 7px 57px;
        background: #f5f8ff;
        font-size: 14px;
        color: #666666;
        position: relative;
        img {
          width: 17px;
          height: 17px;
          position: absolute;
          left: 29px;
          top: 7px;
        }
      }
      .main-content {
        display: flex;
        .right-content-container {
          border-left: 1px dashed #f0f0f0;
          border-bottom: 1px solid #f2f2f2;
          flex: 1;
          padding: 14px;
          position: relative;
          .title {
            border-left: 2px solid #3f92fe;
            padding-left: 14px;
            font-size: 16px;
            line-height: 16px;
            height: 16px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 14px;
          }
          .histroy-button {
            position: absolute;
            top: 0px;
            right: 14px;
            font-size: 16px;
            color: rgba(0, 145, 255, 1);
          }
          .progress-container {
            .progress-select {
              margin: 14px auto;
              margin-top: 0;
              width: 100%;
              height: 42px;
              /deep/.el-input__inner {
                height: 42px;
                line-height: 42px;
                padding-left: 10px;
                padding-right: 10px;
                font-size: 14px;
              }
              /deep/.el-icon-arrow-up::before {
                margin-top: 9px;
              }
              /deep/.el-input__suffix {
                right: 11px;
                top: 1px;
                background: white;
                height: 40px;
              }
              /deep/.el-icon-arrow-up::before {
                background: no-repeat
                  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
                background-size: 20px 10px;
                background-position: center;
                transform: rotate(180deg);
              }
              /deep/.el-icon-circle-close {
                font-size: 14px;
              }
              &:nth-child(2) {
                width: 132px;
              }
            }
            .progress-item-container {
              border: 1px solid #dae7f8;
              position: relative;
              * {
                font-size: 14px;
              }
              .progress-item-header {
                display: flex;
                span:first-child {
                  font-size: 16px;
                  font-weight: bold;
                  color: rgba(255, 255, 255, 1);
                  background: #0091ff;
                  display: inline-block;
                  width: 80px;
                  height: 50px;
                  text-align: center;
                  line-height: 50px;
                }
                span:last-child {
                  font-size: 14px;
                  font-weight: bold;
                  color: rgba(85, 85, 85, 1);
                  background: #f0f6ff;
                  display: inline-block;
                  flex: 1;
                  text-align: center;
                  line-height: 50px;
                }
              }
              .progress-item-content {
                .each-line {
                  position: relative;
                  margin: 0 14px 9px 84px;
                  .label {
                    display: block;
                    width: 80px;
                    color: #999999;
                    position: absolute;
                    left: -80px;
                    top: 0;
                    text-align: right;
                  }
                  .phone {
                    float: right;
                  }
                }
                div:first-child {
                  margin-top: 9px;
                }
              }
              &.has-pre-progress {
                margin-top: 46px;
                &::before {
                  content: "";
                  display: block;
                  width: 26px;
                  height: 32px;
                  background: no-repeat
                    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADcUlEQVRYR+1YSWgUQRT9v7p6HUcTE424QQRRY4Li0QVcmSgEBC+CCOJRwZMnTx48eBVyFtSL5OBBiDpGSURBwYtiXHFBFPeMmcxMT091V5XUkMRkYqYrgcRLFzQN0+/Xf/3q1/s1jaA5Hr0vtvgBPaQJnwKTIAt72twruvGoC7z/NujMjYQ3dfG1ONMgwwc2pRp142dMjCCAZ1Pd+UEICT7jMOfELEpgTYunTawSCvjww0+IJYrFKjC2K5Mai5VqFJAoNirEjA02qbGkxua6iSc1ltRYUmOaNZAcFBO70CwVSI49E489A6+j/YJHrZPV4zViYlsh4CdnW2MGwbJn4empK2SM/4QI3EQY2L7eeY23nvmXKyE/qruksyWmOz8iCMcmXXj9SYFLAcS1DDDU3+yYQQ2EZQ12HGz8ecgFfB9mWngWCVCXRbEHe5+W3kdctDomgZVNLqjE/2OUAg6fc2WQEsAxyVnsf8M2l3zWx4VsNimB1U0OqPt8jhE/gq+/A5AAYFFyZ0mHd6Aqz713wdpCIcpyIVspQVjV7IJtzg+5XDGEH/lKVQfXNHr2tbuHEVGOr1v/B7mslC/d4kJuIoiwsskBz/67Y+ZCwZ95BkNFBoqITUl3psM7NZZnUkE9ePUzXWBuL4vkDkSAFYsdWODof3LSJa/q6NtwBfJ+CIggXYue2bfRPT8xfkql90tJ2aB/LQhFlwKqHdiQMnVzxuKElPAlV4FiEClSwjbp8Uy7e6k2cNotePtZ6WIQyWNSSmxeaEFz2opNGgfgQsLnoQDKjAMhyDyXHtyzzvnnV8q63pB9XjpXYfKMIteYMmHpIlu95axGxCV8GiqDOp8RAgXXNjJ7N3gPp5ssNk32RelEpSK6pQRMuxSWNypysWGT8inT/PSrDCGXysS/pCwzs6vNHqz3hloZ+gb9Q0Eorgopaco2qpuCaHQJlThgoqqUWkZq4KuGtNG5bY37MU52LWJqkr6X5Z1BwG8IKV3dLjHRzU2CjxuaUp1bV2EujpR6rk1Mge++YFvKjCkjju0StW7upL2uXa0Y6JCaMTHdLjHRzW3T6MmMurkuqVkRU0H1ukQ9N59zYiqB6hJ55vZGo11ieaMDxYDXdfN5IVZVrqZLVJegjpvPG7GxRNnn/gXGxAkkkPcsemT3Bic7ExL/wv4BFQTHETJHjAAAAAAASUVORK5CYII=);
                  background-size: 100% 100%;
                  position: absolute;
                  left: 262px;
                  top: -39px;
                }
              }
              &.next-progress {
                .progress-item-header {
                  span:first-child {
                    background: #9fc8fe;
                  }
                  .progress-item-select {
                    margin: 0;
                    * {
                      background: transparent;
                      border: none;
                      outline: none;
                    }
                    /deep/.el-input__inner {
                      color: #999999;
                      text-align: center;
                    }
                    /deep/.el-input__suffix-inner {
                      background: #f0f6ff;
                      width: 25px;
                      position: relative;
                      bottom: -6px;
                      height: 40px;
                      .el-icon-circle-close {
                        position: relative;
                        bottom: 10px;
                      }
                    }
                  }
                }
              }
              &.inactive-progress {
                border-color: #f0f0f0;
                .progress-item-header {
                  span:first-child {
                    background: #dddddd;
                  }
                  span:last-child {
                    background: #f0f0f0;
                    color: #cccccc;
                  }
                }
              }
            }
          }
        }
      }
    }
    .el-dialog__footer {
      text-align: right;
      height: 82px;
      padding: 21px 26px 0 0;
      .el-button {
        height: 42px !important;
        width: 78px;
        padding: 0;
        span {
          font-size: 16px;
        }
        &:first-child span {
          color: #95a5bb;
        }
      }
    }
  }
}
</style>