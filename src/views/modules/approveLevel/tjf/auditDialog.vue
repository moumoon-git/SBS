<template>
  <!-- 审核按钮弹窗 -->
  <el-dialog
    title="查看大型出租屋屋主（代理人）技防建设奖励申报"
    :visible.sync="auditDialogVisible"
    width="60%"
    :before-close="handleClose"
    :close-on-click-modal="closeClickModal"
  >
    <div class="report-wrapper">
      <!-- 左边内容展示 -->
      <div class="report-table audit-table">
        <el-form ref="form" :model="auditForm" label-width="150px">
          <el-form-item label="拟奖励大型出租屋主（代理人）">
            {{ auditForm.agent }}
            <el-button type="text" style="margin-left:5px;">详情</el-button>
          </el-form-item>
          <el-form-item label="出租屋套数">{{auditForm.count}}</el-form-item>
          <el-form-item label="居住人数">{{auditForm.num}}</el-form-item>
          <el-form-item label="流动人员数">{{auditForm.flow}}</el-form-item>
          <el-form-item label="2019年警情总量（上一年）">{{auditForm.lastyear}}</el-form-item>
          <el-form-item label="2020年警情总量">{{auditForm.total}}</el-form-item>
          <el-form-item label="奖励类别">
            <span v-if="auditForm.type[0]">
              严格落实人屋那关及技防措施
              <br />
            </span>
            <span v-if="auditForm.type[1]">
              积极投入技防建设
              <br />
            </span>
            <span v-if="auditForm.type[2]">其他奖励</span>
          </el-form-item>
          <el-form-item label="基本情况">{{auditForm.basic}}</el-form-item>
          <el-form-item label="申领奖励金额">{{auditForm.amount}}</el-form-item>
          <el-form-item label="附件">{{auditForm.attachment}}</el-form-item>
        </el-form>
      </div>
      <!-- 右边流程展示 -->
      <div>
        <showProcess
          ref="showProcess"
          :typeName="type"
          :processlist="processList"
          :tianbaounit="tianbaoUnit"
          :createuser="createUser"
          :baoshendata="baoshenData"
          :platformoptions="platformOptions"
          :unitlist="unitList"
          :processtype="processType"
          :nextplatformname="nextPlatformName"
          @getNextPlatform="changeNextPlatform"
          @queryHistoryRecord="queryHistoryRecord"
        ></showProcess>
      </div>
    </div>
    <!-- 底部审核操作 -->
    <approveEdit
      v-if="type=='shenhe'&&showshenhe"
      ref="approveEdit"
      @cancel="showResource = false;"
      :nextPlatformId="nextPlatformId"
      :id="dataForm.id"
      :processid="processId"
      :tikutype="tikuType"
    ></approveEdit>
    <!-- <div class="audit-operation">
      <el-form ref="form" :model="auditResult" label-width="150px">
        <el-form-item label="审批" style="font-weight:bold;margin-left:-15px;"></el-form-item>
        <el-form-item label="审批意见：">
          <el-input type="textarea" v-model="auditResult.comment" :rows="5" style="width:600px;"></el-input>
        </el-form-item>
        <el-form-item label="审批结果：">
          <el-radio v-model="auditResult.result" label="1">同意</el-radio>
          <el-radio v-model="auditResult.result" label="0">驳回</el-radio>
        </el-form-item>
      </el-form>
    </div>-->
    <!-- 表单底部取消确定按钮 -->
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="auditDialogVisible = false;">取 消</el-button>
      <el-button type="primary" @click="auditSubmit(); auditDialogVisible = false">确 定</el-button>
    </span>-->
    <!-- 二维码和日期 -->
    <span class="QRcode">
      <el-button type="text" @click="QRVisible = true">获取二维码签名</el-button>
      <br />
      <span class="today">2020年12月12日</span>
    </span>
    <!-- 内层二维码弹窗 -->
    <el-dialog width="30%" title="二维码签名" :visible.sync="QRVisible" append-to-body :close-on-click-modal="false">
      <div class="QRContent" style="text-align:center">
        <el-button v-show="QRShow" @click="signShow=true;QRShow=false;">
          <img src="./QRcode_example.png" alt="二维码签名" />
        </el-button>
        <div v-if="signShow" class="signContent">
          <img src="./sign_example.png" alt="文字签名" />
          <br />
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="signShow=false;QRShow=true;">重置</el-button>
            <el-button type="primary" @click="QRVisible=false">保存</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
    <historyRecord ref="historyRecord"></historyRecord>
  </el-dialog>
</template>

<script>
import historyRecord from "@/views/modules/approveLevel/resourceManage/historyRecord.vue";
import showProcess from "../resourceManage/showProcess";
import approveEdit from "../resourceManage/approveEdit";
export default {
  components: { showProcess, approveEdit, historyRecord },
  name: "auditDialog",
  props: ["tiku"],
  watch: {
    tiku(newVal, oldVal) {
      console.log("提莫2", newVal);
    },
  },
  methods: {
    queryHistoryRecord() {
      this.$refs.historyRecord.init(this.dataForm.id, this.tiku);
      this.$refs.historyRecord.dialogVisible = true;
    },
    // 弹窗关闭提示
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    init(id, type) {
      this.clearDataForm();
      this.showshenhe = false;
      this.nextPlatformName = "";
      const user = this.$cookie.get("userId");
      // this.createUser = user.substring(2, user.length);
      this.nowPlatForm = this.$cookie.get("platformId");
      this.dataForm.id = id;
      this.type = type;
      //判断流程图
      this.processType = ["填报"];
      var processTime = 0;
      this.getDataDetail();
    },
    //获取数据详情
    getDataDetail() {
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveReward/info/${this.dataForm.id}`
        ),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getUnit();
          this.processList = data.data.approveManageEntity.processList;
          this.manageId = data.data.managerId;
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
          this.baoshenData.name = "请选择" + this.processList[1].depName;

          //未填报
          var index = this.processList.findIndex(
            (item) => item.approveApproveEntity.platformIdString == ""
          );
          if (
            //有未填报且没被驳回
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
          console.log("已审核1111", lastIndex);
          if (this.type == "shenhe") {
            let a = this.processType.findIndex((item) => item == "审核中");
            if (a > 0) {
              this.processId = this.processList[a].id;
              console.log("流程id", this.processId);
              if (
                this.processList[a - 1].approveApproveEntity.nextPlatformId ==
                this.nowPlatForm
              ) {
                this.showshenhe = true;
              }
            }
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    changeNextPlatform(val) {
      this.nextPlatformId = val;
      this.UnitChange();
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
          this.baoshenData.id = this.platformData[index].id;
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
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
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
          if (this.unitList.length > 0) {
            if (this.type == "add") {
              this.baoshenData.id = this.unitList[0].depId;
              this.baoshenData.name = "请选择" + this.unitList[0].depName;
              this.tianbaoUnit = this.unitList[0].depName;
            }

            if (this.type == "shenhe" || this.type == "update") {
              // console.log("22222222", this.processType);
              var Unitindex = this.processType.findIndex(
                (item) => item == "报审单位"
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
            let index = this.processType.findIndex((item) => item == "审核中");
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
    // 审核弹窗提交
    auditSubmit() {
      console.log("审核弹窗提交");
    },
    //清除数据
    clearDataForm() {
      this.nextPlatformId = "";
      this.nextPlatformName = "";
      this.platformOptions = [];
      this.baoshenData = {
        id: "",
        name: "",
        contactor: { id: "", name: "", role: "", phone: "" },
      };
    },
  },
  data() {
    return {
      closeClickModal: false, //禁止点击model关闭dialog
      auditDialogVisible: false,
      auditForm: {
        agent: "张三",
        count: "400",
        num: "200",
        flow: "140",
        lastyear: "15",
        total: "3",
        type: [true, false, false],
        basic: "已核实信息，该屋主2020年期间严格落实人屋那关及技防措施。",
        amount: "￥10000",
        attachment: "无",
      },
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
      auditResult: {
        comment: "",
        result: "",
      },
      QRVisible: false, // 二维码弹窗
      QRShow: true, // 显示二维码
      signShow: false, // 显示签名

      nextPlatformId: "",
      nextPlatformName: "",
      //平台选项
      platformOptions: [
        {
          label: "",
          value: "",
        },
      ],
      //新增或修改
      type: "",
      dataForm: {
        id: "",
      },
      //填报人
      createUser: {
        id: "",
        name: "",
        phone: "",
        role: "",
      },
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
      //流程Id
      processId: "",
      // baoshenUnit: "",
      // baoshenId: "",
      //流程单位
      unitList: [],
      //类型
      processType: [],
      processList: [],
      manageId: "",
      showshenhe: false,
      tikuType: "",
    };
  },
};
</script>
  
<style>
  .check-process-wrapper {
    margin-left: 15px;
    max-height: 275px;
    padding: 0;
  }
  .check-process {
    margin: 20px;
    width: 480px;
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    background-color: rgba(249, 251, 255, 1);
    padding: 10px;
  }
  .check-process-head-1 {
    border: 1px solid #0091ff;
    border-radius: 3px;
    color: white;
    background-color: #0091ff;
    padding: 5px 15px;
    display: inline-block;
    width: 80px;
    text-align: center;
  }
  .check-process-content-1 {
    border: 1px solid #0091ff;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 15px;
    display: inline-block;
    width: 350px;
    text-align: center;
  }
  .check-process-head-2 {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    color: white;
    background-color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 80px;
    text-align: center;
  }
  .check-process-content-2 {
    border: 1px solid rgba(215, 215, 215, 1);
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 350px;
    text-align: center;
  }
  .check-process .el-form-item {
    margin-bottom: 0;
  }
  .check-process-main {
    width: 430px;
    border: 1px solid rgba(170, 170, 170, 1);
    border-top: none;
    border-radius: 3px;
  }
  .audit-table {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
  }
  .audit-operation {
    padding: 0;
    margin: 0;
  }
  .QRcode {
    position: absolute;
    right: 20px;
    bottom: 20px;
    text-align: right;
  }
  .today {
    font-weight: bold;
    font-size: 20px;
  }
  .QRContent {
    margin: 0 auto;
  }
</style>