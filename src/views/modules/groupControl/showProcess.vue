<template>
  <!-- 右边流程展示 -->
  <div class="progress-all-container" v-if="typeName!=''">
    <div class="title">审批流程</div>
    <el-button class="histroy-button" type="text" @click="queryHistoryRecord">历史申报记录</el-button>
    <!-- A. 新增时的流程 -->
    <div class="progress-container" v-if="typeName == 'add'">
      <!-- A.0. 顶部审批流程选择 -->
      <el-select
        class="progress-select"
        v-model="manageid"
        @change="changeManage"
        clearable
        placeholder="请选择审批流程"
      >
        <el-option
          v-for="item in manageList"
          :key="`managelist${item.value}`"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- A.1. 填报单位 -->
      <div class="progress-item-container">
        <div class="progress-item-header">
          <span>填报</span>
          <span>{{tianbaounit}}</span>
        </div>

        <div class="progress-item-content">
          <div class="each-line" v-if="createuser.name">
            <span class="label">负责人：</span>
            <span v-if="createuser.name">{{createuser.name}}</span>
            <span v-if="createuser.role">（{{createuser.role}}）</span>
            <!-- <span class="phone" v-if="createuser.phone">{{createuser.phone}}</span> -->
          </div>
        </div>
      </div>
      <!-- A.2. 报审单位 -->
      <div class="progress-item-container has-pre-progress next-progress">
        <div class="progress-item-header">
          <span>报审单位</span>
          <span>
            <el-select
              class="progress-select progress-item-select"
              clearable
              v-model="nextPlatformId"
              :placeholder="baoshendata.name"
              @change="UnitChange"
            >
              <el-option
                v-for="(item,index) in platformoptions"
                :key="`platform1${index}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
        </div>
        <div class="progress-item-content">
          <div class="each-line" v-if="baoshendata.contactor.name">
            <span class="label">负责人：</span>
            <span v-if="baoshendata.contactor.name">{{baoshendata.contactor.name}}</span>
            <span v-if="baoshendata.contactor.role">（{{baoshendata.contactor.role}}）</span>
            <!-- <span class="phone" v-if="baoshendata.contactor.phone">{{baoshendata.contactor.phone}}</span> -->
          </div>
        </div>
      </div>
      <!-- A.3. 后续待审批单位 -->
      <div v-for="(item, index) in unitlist" :key="`unit_${index}`">
        <div class="progress-item-container has-pre-progress inactive-progress" v-if="index > 0">
          <div class="progress-item-header">
            <span>待审批</span>
            <span>{{item.depName}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- B. 编辑/查看时的流程 -->
    <div class="progress-container" v-else>
      <!-- B.1. 填报单位 -->
      <div
        class="progress-item-container"
        :class="{'has-pre-progress next-progress':processtype[index]=='报审单位', 'has-pre-progress inactive-progress':processtype[index]=='待审核', 'has-pre-progress':processtype[index]!='填报'}"
        v-for="(item,index) in processlist"
        :key="`edit_progress_${index}`"
      >
        <div class="progress-item-header" v-if="processtype[index] == '报审单位'">
          <span>报审单位</span>
          <span>
            <el-select
              class="progress-select progress-item-select"
              clearable
              v-model="nextPlatformId"
              :placeholder="baoshendata.name"
              @change="UnitChange"
            >
              <el-option
                v-for="(item,index) in platformoptions"
                :key="`platform_edit_${index}`"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
        </div>
        <div class="progress-item-header" v-else>
          <span>{{processtype[index]}}</span>
          <span>{{item.approveApproveEntity.platformIdString==''?item.depName:item.approveApproveEntity.platformIdString}}</span>
        </div>

        <div class="progress-item-content">
          <div class="each-line" v-if="item.approveApproveEntity.gmtCreate">
            <span class="label">填报时间：</span>
            <span>{{item.approveApproveEntity.gmtCreate}}</span>
          </div>
          <div class="each-line" v-if="item.approveApproveEntity.sysUserVo.name">
            <span class="label">填报人：</span>
            <span
              v-if="item.approveApproveEntity.sysUserVo.name"
            >{{item.approveApproveEntity.sysUserVo.name}}</span>
            <span
              v-if="item.approveApproveEntity.sysUserVo.role"
            >（{{item.approveApproveEntity.sysUserVo.role}}）</span>
            <!-- <span
              class="phone"
              v-if="item.approveApproveEntity.sysUserVo.phone"
            >{{item.approveApproveEntity.sysUserVo.phone}}</span> -->
          </div>
          <div class="each-line" v-if="item.chargeMan.name">
            <span class="label">负责人：</span>
            <span v-if="item.chargeMan.name">{{item.chargeMan.name}}</span>
            <span v-if="item.chargeMan.position">（{{item.chargeMan.position}}）</span>
            <!-- <span class="phone" v-if="item.chargeMan.mobile1">{{item.chargeMan.mobile1}}</span> -->
          </div>
          <div class="each-line" v-if="item.approveApproveEntity.approveResult">
            <span class="label">审批结果：</span>
            <span v-if="item.approveApproveEntity.approveResult=='0'" style="color:#70B603">审核通过</span>
            <span v-if="item.approveApproveEntity.approveResult=='1'" style="color:#D9001B ">已驳回</span>
          </div>
          <div class="each-line" v-if="item.approveApproveEntity.approveComments">
            <span class="label">审批意见：</span>
            <span>{{item.approveApproveEntity.approveComments}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: [
    "tianbaounit",
    "createuser",
    "baoshendata",
    "platformoptions",
    "unitlist",
    "processlist",
    "processtype",
    "tabTypeName",
    "typeName",
    "nextplatformname",
    "manageList",
    "manageId",
  ],
  data() {
    let self = this;
    return {
      manageid: "",
      //车辆详情
      dataForm: {
        id: "",
        name: "",
        carNum: "",
        carType: "",
        carSource: "",
        carProduceTime: "",
        carStatus: "",
        responsible: "",
        phone: "",
        imgList: [],
        documentList: [],
        place: "",
        //上传的照片路径
        backgroundImage: "",
        //上传附件路径
        documentImage: "",
      },
      nextPlatformId: "",
      //平台选项
      platformOptions: [
        {
          label: "",
          value: "",
        },
      ],
      image: {
        name: "",
        url: "",
      },
      imageList: [],
      document: {
        name: "",
        url: "",
      },
      tip: "",
      documentUrl: "",
      //岗亭详情
      dataForm2: {
        id: "",
        name: "",
        boxImg: [],
        boxNum: "",
        responsible: "",
        phone: "",
        place: "",
        longitude: "",
        latitude: "",
        policeMan: [
          {
            name: "",
            phone: "",
          },
        ],
        status: "",
        backgroundImage: "",
      },
      processData1: {
        place: "",
        time: "",
        name: "",
        result: "",
        feedback: "",
      },
      processData2: {
        place: "",
        time: "",
        name: "",
        result: "",
        feedback: "",
      },
      //新增或修改
      type: "",
      //弹出框显示
      showResource: false,
      //能源类型
      nengyuanleixing: [],
      //使用状态
      shiyongzhuangtai: [],
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
      // baoshenUnit: "",
      // baoshenId: "",
      //流程单位
      unitList: [],
      //类型
      processType: [],
      processList: [],
    };
  },
  watch: {
    nextplatformname() {
      // console.log("ssssssssssssssssss111", this.nextplatformname);
      this.nextPlatformId = this.nextplatformname;
    },
    manageId() {
      console.log("ssssssssssssssssss111", this.manageid);
      // this.manageid = this.manageId;
    },
    typeName: function (newVal, oldVal) {
      // console.log("子组件", this.baoshendata, this.nextplatformname);
      this.nextPlatformId = this.nextplatformname;
      //
      console.log(
        "ssssssssssssssssss111",
        newVal,
        oldVal,
        this.nextplatformname,
        this.nextPlatformId,
        this.processlist
      );
      // this.nextPlatformId = newVal;
    },
  },
  mounted() {
    // this.manageid = this.manageId;
    console.log("mounted", this.manageid, this.manageId);
  },
  created() {
    this.type = this.typeName;
    this.nextPlatformId = this.nextplatformname;
    console.log("created", this.nextplatformname, this.manageid);
  },
  computed: {},

  methods: {
    changeManage() {
      this.$emit("changeManage", this.manageid);
    },
    queryHistoryRecord() {
      this.$emit("queryHistoryRecord");
    },
    UnitChange() {
      console.log("1111111组件", this.typeName, this.nextPlatformId);
      this.$emit("getNextPlatform", this.nextPlatformId);
      // console.log("下拉框改变", this.platformData[index], this.baoshenData);
    },
    clear() {
      this.nextPlatformId = "";
      this.manageid = "";
    },
    // getPlatform() {
    //   this.$http({
    //     url: this.$http.adornUrl(`/sys/platform//info/${this.nowPlatForm}`),
    //     method: "get",
    //     param: this.$http.adornParams(),
    //   }).then(({ data }) => {
    //     // data 是获取到的所有数据
    //     if (data && data.code === 0) {
    //       this.tianbaoUnit = data.platForm.platformName;
    //       // this.console.log("当前平台名称", data);
    //       // data.data.forEach(item => {
    //       //   this.platformOptions.push({ value: item.code, label: item.name });
    //       // });
    //     } else {
    //       this.$message({
    //         message: `${data.msg}`,
    //         type: "error",
    //       });
    //     }
    //   });
    //   // console.log("报审单位", this.processType[index], this.baoshenData.id);
    //   this.$http({
    //     url: this.$http.adornUrl(
    //       `/approve/approveProcess/getPlatForm?id=${this.baoshenData.id}`
    //     ),
    //     method: "get",
    //     param: this.$http.adornParams(),
    //   }).then(({ data }) => {
    //     // data 是获取到的所有数据
    //     if (data && data.code === 0) {
    //       console.log("报审单位平台数据", data, this.baoshenData.id);
    //       this.platformData = data.data;
    //       data.data.forEach((item) => {
    //         this.platformOptions.push({
    //           value: item.id,
    //           label: item.platformName,
    //         });
    //       });
    //     } else {
    //       this.$message({
    //         message: `${data.msg}`,
    //         type: "error",
    //       });
    //     }
    //   });
    // },
    // getUnit() {
    //   this.$http({
    //     url: this.$http.adornUrl(`/approve/approveProcess/getUnit?id=-100`),
    //     method: "get",
    //     param: this.$http.adornParams(),
    //   }).then(({ data }) => {
    //     // data 是获取到的所有数据
    //     if (data && data.code === 0) {
    //       this.unitList = data.data;
    //       if (this.unitList.length > 1) {
    //         if (this.type == "add") {
    //           this.baoshenData.id = this.unitList[1].depId;
    //           this.baoshenData.name = "请选择" + this.unitList[1].depName;
    //           this.tianbaoUnit = this.unitList[0].depName;
    //         }
    //         if (this.type == "shenhe") {
    //           //   console.log("22222222", this.processType);
    //           var Unitindex = this.processType.findIndex(
    //             (item) => item == "报审单位"
    //           );
    //           if (Unitindex > 0) {
    //             this.baoshenData.id = this.unitList[Unitindex].depId;
    //             this.baoshenData.name =
    //               "请选择" + this.unitList[Unitindex].depName;
    //           }
    //         }
    //         // console.log("新增", this.unitList, this.baoshenData.name);
    //       }
    //       this.getPlatform();
    //     } else {
    //       this.$message({
    //         message: `${data.msg}`,
    //         type: "error",
    //       });
    //     }
    //   });
    // },
    // getPlatformById(id) {
    //   this.$http({
    //     url: this.$http.adornUrl(`/sys/platform//infoById/${id}`),
    //     method: "get",
    //     param: this.$http.adornParams(),
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       console.log("byId", data);
    //       if (this.type == "add") {
    //         this.createUser.id = data.platform.contactor.id;
    //         this.createUser.name = data.platform.contactor.name;
    //         this.createUser.phone = data.platform.contactor.mobile1;
    //         this.createUser.role = data.platform.contactor.position;
    //       } else {
    //         // var index = this.processType.findIndex(
    //         //   (item) => item == "报审单位"
    //         // );
    //         // this.processList[index].chargeMan.id = data.platform.contactor.id;
    //         // this.processList[index].chargeMan.name =
    //         //   data.platform.contactor.name;
    //         // this.processList[index].chargeMan.position =
    //         //   data.platform.contactor.position;
    //         // this.processList[index].chargeMan.mobile1 =
    //         //   data.platform.contactor.mobile1;
    //       }
    //     } else {
    //       this.$message({
    //         message: `${data.msg}`,
    //         type: "error",
    //       });
    //     }
    //   });
    // },
    // init(type) {
    //   this.processList = this.processListData;
    //   this.tabType = this.tabTypeName;
    //   this.type = type;
    //   console.log("类型名称", this.type, this.processList);
    //   this.clearDataForm();
    //   const user = this.$cookie.get("userId");
    //   this.nowPlatForm = this.$cookie.get("platformId");
    //   //   this.dataForm.id = id;

    //   //判断流程图
    //   this.processType = ["填报"];
    //   var processTime = 0;
    //   console.log("标签类型", this.tabType, this.type);
    //   switch (type) {
    //     case "add":
    //       if (this.tabType == "first") {
    //         this.getUnit();
    //         this.getPlatformById(this.nowPlatForm);
    //       }
    //       if (this.tabType == "second") {
    //         this.getUnit();
    //         this.getPlatformById(this.nowPlatForm);
    //       }

    //       break;

    //     case "show":
    //       if (this.tabType == "first") {
    //         this.dialogTitle = "查看巡查任务";
    //         //todo
    //         this.type = "shenhe";
    //         this.getDataDetail();
    //       }

    //       if (this.tabType == "second") {
    //         this.type = "shenhe";
    //         this.dialogTitle = "查看群防岗亭";
    //         this.getDataDetail();
    //       }
    //       break;

    //     case "shenhe":
    //       this.getDataDetail();
    //       break;
    //     case "update":
    //       if (this.tabType == "first") {
    //         this.dialogTitle = "修改巡查车辆";
    //         this.$http({
    //           url: this.$http.adornUrl(
    //             `/approve/approveCarEntity/info/${this.dataForm.id}`
    //           ),
    //           method: "get",
    //           params: this.$http.adornParams(),
    //         }).then(({ data }) => {
    //           if (data && data.code === 0) {
    //             this.dataForm.name = data.data.name;
    //             this.dataForm.carNum = data.data.carNum;
    //             this.dataForm.carType = data.data.carType;
    //             this.dataForm.carSource = data.data.carSource;
    //             this.dataForm.carProduceTime = data.data.carProduceTime;
    //             this.dataForm.carStatus = data.data.carStatus;
    //             this.dataForm.responsible = data.data.responsible;
    //             this.dataForm.phone = data.data.phone;
    //             this.dataForm.imgList = data.data.imgList;
    //             this.dataForm.documentList = data.data.documentList;
    //             this.dataForm.place = data.data.place;
    //             this.dataForm.longitude = data.data.longitude;
    //             this.dataForm.latitude = data.data.latitude;
    //             this.imageList = this.dataForm.imgList;
    //             this.showResource = true;
    //           } else {
    //             this.$message.error(data.msg);
    //           }
    //         });
    //       }

    //       if (this.tabType == "second") {
    //         this.dialogTitle = "修改群防岗亭";
    //         this.$http({
    //           url: this.$http.adornUrl(
    //             `/approve/approveBoxEntity/info/${this.dataForm.id}`
    //           ),
    //           method: "get",
    //           params: this.$http.adornParams(),
    //         }).then(({ data }) => {
    //           if (data && data.code === 0) {
    //             this.dataForm2.name = data.data.name;
    //             this.dataForm2.boxNum = data.data.boxNum;
    //             this.dataForm2.responsible = data.data.responsible;
    //             this.dataForm2.phone = data.data.phone;
    //             this.dataForm2.place = data.data.place;
    //             this.dataForm2.longitude = data.data.longitude;
    //             this.dataForm2.latitude = data.data.latitude;
    //             this.dataForm2.policeMan = data.data.policeManList;
    //             this.dataForm2.status = data.data.status;
    //             this.dataForm2.boxImg = data.data.imgList;

    //             this.showResource = true;
    //           } else {
    //             this.$message.error(data.msg);
    //           }
    //         });
    //       }
    //       break;
    //     default:
    //   }
    // },
    // //获取数据详情
    // getDataDetail() {
    //   //   this.processList = data.data.approveManageEntity.processList;
    //   this.processList.forEach((item) => {
    //     if (item.chargeMan == null) {
    //       item.chargeMan = {
    //         id: "",
    //         name: "",
    //         position: "",
    //         mobile1: "",
    //       };
    //     }
    //     if (item.approveApproveEntity == null) {
    //       item.approveApproveEntity = {
    //         approveComments: "",
    //         approveResult: "",
    //         createUserId: "",
    //         gmtCreate: "",
    //         gmtModified: "",
    //         id: "",
    //         isDeleted: "",
    //         modifiedUserId: "",
    //         nextPlatformId: "",
    //         nextPlatformIdString: "",
    //         platformId: "",
    //         platformIdString: "",
    //         processId: "",
    //         qrcodeImg: "",
    //         rewardId: "",
    //         sysUserVo: { id: "", name: "", phone: "", role: "" },
    //         tikuType: "",
    //       };
    //     }
    //   });
    //   //   this.baoshenData.name =
    //   //     "请选择" + data.data.approveManageEntity.unitList[1].unitIdString;
    //   this.baoshenData.name = "请选择" + this.processList[1].depName;
    //   //   console.log("报审单位", this.baoshenData.name, this.processList);

    //   var index = this.processList.findIndex(
    //     (item) => item.approveApproveEntity.platformIdString == ""
    //   );
    //   console.log("没错", index);
    //   if (
    //     index > 0 &&
    //     this.processList[index - 1].approveApproveEntity.approveResult != 1
    //   ) {
    //     this.processList[
    //       index
    //     ].approveApproveEntity.platformId = this.processList[
    //       index - 1
    //     ].approveApproveEntity.nextPlatformId;
    //     this.processList[
    //       index
    //     ].approveApproveEntity.platformIdString = this.processList[
    //       index - 1
    //     ].approveApproveEntity.nextPlatformIdString;
    //     console.log(
    //       "审核中",
    //       this.processList[index].approveApproveEntity.platformIdString,
    //       this.processList[index - 1].approveApproveEntity.nextPlatformIdString
    //     );
    //     // let choosePlatformid = this.processList[index].approveApproveEntity
    //     //   .platformId;
    //     // this.getPlatformById(choosePlatformid);
    //   }

    //   for (let i = 1; i < this.processList.length; i++) {
    //     console.log("组件", this.processList);
    //     if (this.processList[i].approveApproveEntity.sysUserVo.name == "") {
    //       if (
    //         this.processList[i].approveApproveEntity.nextPlatformIdString ==
    //           "" &&
    //         this.processList[i].approveApproveEntity.platformIdString != ""
    //       ) {
    //         this.processType.push("审核中");
    //         if (i < this.processList.length - 1 && this.type == "shenhe") {
    //           this.processType.push("报审单位");
    //           i += 1;
    //         }

    //         console.log("type", "审核中");
    //       } else {
    //         this.processType.push("待审核");
    //       }
    //     } else {
    //       this.processType.push("已审核");
    //     }
    //   }
    //   this.getUnit();
    //   console.log("最终结果", this.processList);
    // },

    // //清除数据
    // clearDataForm() {
    //   this.dataForm.name = "";
    //   this.nextPlatformId = "";
    //   this.platformOptions = [];
    //   this.dataForm.carNum = "";
    //   this.dataForm.carType = "";
    //   this.dataForm.carSource = "";
    //   this.dataForm.carProduceTime = "";
    //   this.dataForm.carStatus = "";
    //   this.dataForm.responsible = "";
    //   this.dataForm.phone = "";
    //   this.dataForm.imgList = [];
    //   this.imageList = [];
    //   this.dataForm.documentList = [];
    //   this.dataForm.place = "";
    //   this.dataForm.longitude = "";
    //   this.dataForm.latitude = "";

    //   this.dataForm2.name = "";
    //   this.dataForm2.boxNum = "";
    //   this.dataForm2.responsible = "";
    //   this.dataForm2.phone = "";
    //   this.dataForm2.place = "";
    //   this.dataForm2.longitude = "";
    //   this.dataForm2.latitude = "";

    //   this.baoshenData = {
    //     id: "",
    //     name: "",
    //     contactor: { id: "", name: "", role: "", phone: "" },
    //   };
    //   this.dataForm2.policeMan = [
    //     {
    //       name: "",
    //       phone: "",
    //     },
    //   ];
    //   this.dataForm2.status = "";
    //   this.dataForm2.boxImg = [];
    // },
  },
};
</script>

<style lang="less">
.progress-all-container {
  // border-left: 1px dashed #f0f0f0;
  // border-bottom: 1px solid #f2f2f2;
  flex: 1;
  // padding: 14px;
  position: relative;
  margin-top: 14px;
  // margin-left: 14px;
  .title {
    border-left: 3px solid #3f92fe;
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
    top: -12px;
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
      // /deep/.el-icon-arrow-up::before {
      //   background: no-repeat
      //     url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
      //   background-size: 20px 10px;
      //   background-position: center;
      //   transform: rotate(180deg);
      // }
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
          // left: 262px;
          left: calc((100% - 80px) / 2 + 80px - 13px);
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
</style>
