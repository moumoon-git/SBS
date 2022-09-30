<template>
  <div id="center" style="width: 80%;margin: 0px auto;">
    <!--<p class="thetitle">监测预警响应流程设计</p>-->
    <!-- <div class="left">
        <div class="top">
          <ul>
            <li @click="addlevel()">+新增级别</li>
            <li @click="deleteLevel()">-删除级别</li>
          </ul>
        </div>
    </div>-->
    <div style="margin: 40px auto;">
      <el-form label-width="100px" :rules="dataRules" :model="dataForm" ref="dataForm">
        <el-form-item
          label="预案名称:"
          style="width: 65%;margin: 0 auto;margin-bottom: 20px;"
          prop="planName"
        >
          <el-input v-model="dataForm.planName" class="input" size="small"></el-input>
        </el-form-item>

        <el-form-item
          label="事件类型:"
          style="width: 65%;margin: 0 auto; margin-bottom: 20px;"
          prop="eventTypeName"
        >
          <el-input
            v-model="dataForm.eventTypeName"
            @focus="handleOpenEvent"
            :readonly="true"
            size="small"
          ></el-input>
        </el-form-item>

        <!-- <div style="width: 65%;margin: 0 auto;margin-bottom: 20px;"> -->
        <el-form-item
          label="有效时间:"
          style="width: 65%;margin: 0 auto; margin-bottom: 20px;"
          prop="validTime"
        >
          <el-time-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            is-range
            v-model="dataForm.validTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            size="small"
          ></el-time-picker>
        </el-form-item>

        <el-form-item
          label="间隔时间(分钟):"
          id="intervalTime"
          style="width: 65%;margin: 0 auto; margin-bottom: 20px;"
          prop="intervalTime"
        >
          <el-input-number v-model="dataForm.intervalTime" :min="0" :max="300" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="预警等级:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;">
          <el-checkbox-group v-model="checkedList" :max="2" @change="warningLevelChecked">
            <div style="display:flex">
              <div style="margin-right:245px">
                <el-checkbox
                  :label="(dataForm.eventTypeFlag == 3?2:(dataForm.eventTypeFlag == 6?1:0))+'黄色'"
                >
                  <span
                    style="background-color:yellow;width:38px;text-align:center;display:inline-block"
                  >黄色</span>
                </el-checkbox>
              </div>
              <div>
                <el-checkbox
                  :label="(dataForm.eventTypeFlag == 3?2:(dataForm.eventTypeFlag == 6?1:0))+'红色'"
                >
                  <span
                    style="background-color:red;width:38px;text-align:center;display:inline-block"
                  >红色</span>
                </el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
          <div style="display:flex">
            <div style="margin-right:105px">
              <span v-if="dataForm.eventTypeFlag == 3">抓拍卡口数：</span>
              <span v-if="dataForm.eventTypeFlag == 6">抓拍人数：</span>
              <span v-else></span>
              <el-input-number v-model="dataForm.levelOneValue" :min="0" :disabled="yellowFlag"></el-input-number>
            </div>
            <div>
              <span style="margin-left:-85px" v-if="dataForm.eventTypeFlag == 3">抓拍卡口数：</span>
              <span style="margin-left:-75px" v-if="dataForm.eventTypeFlag == 6">抓拍人数：</span>
              <span v-else></span>
              <el-input-number v-model="dataForm.levelTwoValue" :min="0" :disabled="redFlag"></el-input-number>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="有效时间(小时):"
          id="effectiveTime"
          style="width: 65%;margin: 0 auto; margin-bottom: 20px;"
          prop="effectiveTime"
        >
          <el-input-number v-model="dataForm.effectiveTime" :min="0" :max="24" label="描述文字"></el-input-number>
        </el-form-item>
        <!-- </div> -->
      </el-form>

      <!-- <div style="width: 135px;text-align: right;color:rgba(71,157,255,1);font-size:14px;margin-bottom:15px;">警情响应</div>
      <el-form label-width="150px" :rules="dataRules" :model="dataForm" ref="dataForm" style="margin:0 auto;">
        <el-form-item label="响应等级:" class="member" style="width: 45%;margin: 0 auto;margin-bottom: 20px;display: inline-block;" required prop="responseName">
          <el-select v-model="dataForm.responseName" placeholder="请选择" size="mini" style="width:100%;" @change="change_responseLevel">
            <el-option v-for="item in responseLevel" :key="item.id" :label="item.name" :value="item.id" style="padding-left:14px ;"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="width: 45%;display: inline-block;float: right;" label="响应时限:" class="member" required prop="responseDuration">
          <el-input size="mini" class="right-input" style="width:100%;" v-model="dataForm.responseDuration" placeholder="响应时限(分钟)"></el-input>
        </el-form-item>

        <el-form-item style="display: inline-block; width: 45%;margin: 0 auto;margin-bottom: 20px;" label="一般事件处置时限:" class="member overlong" required prop="generalEventDuration">
          <el-input size="mini" style="width:100%;" class="right-input" v-model="dataForm.generalEventDuration" placeholder="处置时限(分钟)"></el-input>
        </el-form-item>

        <el-form-item style="width: 45%;display: inline-block;float: right;" label="复杂事件处置时限:" class="member" required prop="complexEventDuration">
          <el-input size="mini" style="width:100%;" class="right-input" placeholder="复杂事件处置时限(分钟)" v-model="dataForm.complexEventDuration"></el-input>
        </el-form-item>
      </el-form>-->
      <!-- <div style="width: 135px;text-align: right;color:rgba(71,157,255,1);font-size:14px;margin-bottom:15px;">人员关联</div> -->
      <!-- <el-form label-width="150px" :rules="dataRules" :model="dataStaff" ref="ruleFormSecond">
        <div class="staff">
          <el-form-item label="服务对象:" class="member" prop="serviceName" required>
            <el-input size="mini" class="right-input" v-model="dataStaff.serviceName"></el-input>
          </el-form-item>

          <el-form-item label="服务内容:" class="member">
            <el-input size="mini" class="right-input" v-model="dataStaff.serviceContent"></el-input>
          </el-form-item>

          <el-form-item label="联系电话:" class="member" prop="serviceContact">
            <el-input size="mini" class="right-input" v-model="dataStaff.serviceContact"></el-input>
          </el-form-item>

          <el-form-item label="牵头部门:" class="member block" required prop="leadgroupName">
            <el-input size="mini" class="right-input" @focus="handelVerify('lead')" v-model="dataStaff.leadgroupName"></el-input>
          </el-form-item>

          <el-form-item label="服务地址:" class="member">
            <el-input size="mini" class="right-input" v-model="dataStaff.serviceObjectAddress"></el-input>
          </el-form-item>

          <el-form-item label="审批部门:" class="member" required prop="examineGroupName">
            <el-input size="mini" class="right-input" v-model="dataStaff.examineGroupName" @focus="handelOpenTaketh('examineGroupName')"></el-input>
          </el-form-item>

          <el-form-item label="牵头部门联系人:" class="member">
            <el-input size="mini" :disabled="true" class="right-input" v-model="dataStaff.leadContactor"></el-input>
          </el-form-item>

          <el-form-item label="核实部门:" class="member" required prop="verify">
            <el-input size="mini" class="right-input" @focus="handelVerify('verify')" v-model="dataStaff.verify"></el-input>
          </el-form-item>

          <el-form-item label="审批部门联系人:" class="member" required prop="examineContactorName">
            <el-select v-model="dataStaff.examineContactorName" size="mini" width="50" style="width: 250px;" placeholder="请选择联系人" @change="handelTaketheLinkman">
              <el-option v-for="item in examineGroupName" :key="item.value" :label="item.name" :value="item.value" style="padding-left:14px ;"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="应哨部门:" class="member" required prop="sentinelgroupName">
            <el-input size="mini" class="right-input" @focus="handelVerify('sentinelgroupName')" v-model="dataStaff.sentinelgroupName"></el-input>
          </el-form-item>

          <el-form-item label="核实联系人:" class="member" required prop="verifyContactsShow">
            <el-input size="mini" :disabled="true" class="right-input" v-model="dataStaff.verifyContactsShow"></el-input>
          </el-form-item>

          <el-form-item label="处置部门:" class="member block" required prop="disposegroupName">
            <el-input size="mini" @focus="handelOpenTaketh('disposegroupName')" class="right-input" v-model="dataStaff.disposegroupName"></el-input>
          </el-form-item>

          <el-form-item label="应哨部门联系人:" class="member" required prop="sentinelContactor">
            <el-input size="mini" :disabled="true" class="right-input" v-model="dataStaff.sentinelContactor"></el-input>
          </el-form-item>

          <el-form-item label="处置部门联系人:" class="member" required prop="disposeContactorName">
            <el-select v-model="dataStaff.disposeContactorName" size="mini" width="50" style="width: 250px;" placeholder="请选择联系人" @change="handelTaketheLinkman">
              <el-option v-for="item in disposegroupName" :key="item.value" :label="item.name" :value="item.value" style="padding-left:14px ;"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>-->

      <!-- 操作 -->
      <vxe-toolbar style="margin-left:150px;margin-bottom: 15px;margin-top: 50px;">
        <template v-slot:buttons>
          <vxe-button @click="handleInsertEvent">新增</vxe-button>
          <vxe-button @click="handleDeleteEvent">删除选中</vxe-button>
          <!-- <vxe-button @click="handleDataSave">保存</vxe-button> -->
          <!-- <vxe-button @click="handleCondition">保存</vxe-button> -->
        </template>
      </vxe-toolbar>
      <!-- 表格 -->
      <vxe-table
        @edit-actived="handleEditActivedEvent"
        @edit-closed="editClosedEvent"
        border
        style="margin-left:150px;"
        class="vxe-table-element"
        ref="xTable"
        height="400"
        highlight-hover-row
        :data.sync="tableData"
        :edit-config="{trigger: 'click', mode: 'cell'}"
      >
        <vxe-table-column type="selection" width="60" fixed="left"></vxe-table-column>
        <vxe-table-column type="index" width="55"></vxe-table-column>
        <vxe-table-column
          field="dataSourceId"
          title="服务对象"
          id="serviceObj"
          :edit-render="{name: 'input'}"
          :formatter="formatter"
        ></vxe-table-column>
        <vxe-table-column
          v-if="dataForm.eventTypeFlag === 6"
          field="serviceTypeId"
          title="关联类型"
          :edit-render="{name: 'ElSelect',options: cameraList,optionProps:optionList,props: {clearable: true,filterable:true} }"
        ></vxe-table-column>
        <vxe-table-column field="VerifyContactorName" title="核实人员" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="DisposeContactorName" title="处置人员" :edit-render="{name: 'input'}"></vxe-table-column>
      </vxe-table>

      <div
        class="submit-btn"
        style="width:50%;margin:0 auto; margin-top:35px;justify-content: space-evenly;display: flex;"
      >
        <el-button
          size="small"
          plain
          style="width:120px; height:32px; padding: 6px 14px;margin-top: 20px;"
          @click="cancel"
        >重置</el-button>
        <el-button
          size="small"
          type="primary"
          style="padding: 6px 14px;margin-top: 20px;width:120px; height:32px;"
          @click="handelgrade"
        >保存</el-button>
      </div>
      <!-- <div style="width: 135px;text-align: right;color:rgba(71,157,255,1);font-size:14px;margin-bottom:15px;margin-top:55px;">预案等级</div> -->
      <!-- 新增级别后显示的盒子 -->
      <!-- <div style="clear: both;" class="middle">
        <ul>
          <li
            v-for="(item, index) in levelList"
            :key="index"
            @click="Levelclick(item, index)"
            :class="{ levelsclass: libgc === index }"
          >
            方案等级:<i>{{ item.responseName }}</i>
          </li>
        </ul>
      </div>-->
      <!-- <div style="width:90%; clear: both;margin-left:150px;height:100px" class="middle">
        <ul class="grade">
          <li style="height:32px;" v-for="(item, index) in levelList" :key="index" @click="Levelclick(index)">
            <img src="/static/img/shezhi@2x.png" alt />
            方案等级:
            <span>{{ item.responseName }}</span>
            <i @click.stop="deleteLevel(item, index)" class="el-icon-close" style="color:#D3D7DB;float: right;margin-right: 10px;margin-top: 10px;cursor: pointer;"></i>
          </li>
        </ul>
      </div>-->
    </div>

    <!-- <div class="right">
    <el-tabs type="border-card" v-if="active" v-model="activeName">-->
    <!--警情响应-->
    <!-- <el-tab-pane label="警情响应" name="first">
          <div style="margin: 0 auto;width: 370px;clear: both;"></div>
    </el-tab-pane>-->

    <!--人员关联-->
    <!-- <el-tab-pane label="人员关联" name="second" :disabled="!dataForm.id">
    <div class="levelTop" style="float: right;">-->
    <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
    <!-- </div>

          <div class="submit-btn" style="margin:0 auto;">
            <el-button
              size="small"
              type="primary"
              style="padding: 6px 14px;margin-top: 20px;"
              @click="grade('ruleFormSecond')"
              >下一步</el-button
            >
            <el-button
              size="small"
              type="info"
              style="padding: 6px 14px;margin-top: 20px;"
              @click="cancel"
              >取消</el-button
            >
          </div>
    </el-tab-pane>-->

    <!--处置参考-->
    <!-- <el-tab-pane label="处置参考" name="third" :disabled="!dataForm.id">
    <div class="levelTop" style="float: right;">-->
    <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
    <!-- </div>
          <div style="margin: 0 auto;width: 420px;clear: both;"></div>
        </el-tab-pane>
    </el-tabs>-->
    <!-- </div> -->

    <!--添加参数-->
    <!-- <el-dialog
      title="响应参数"
      :visible.sync="addParameter"
      width="780px"
      center
    >
      <response
        ref="responsechild"
        :parameterData="parameterData"
        @parameterSetting="parameterSetting"
        :tableData="tableData"
        :relation="relation"
        :userCreate="userCreate"
      ></response>
    </el-dialog>-->
    <!--弹窗组件-->
    <GroupSelect v-if="showCommonSet" ref="commonSet" @onSubmit="handleOnSubmit"></GroupSelect>
    <!-- @ -->
    <!-- <Linkman
      ref="commonLink"
      v-show="showcommonLink"
      @OnchildByValue="handelLinkdata"
    ></Linkman>-->
    <LinkmanDraggable ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></LinkmanDraggable>
    <serviceObjectDialog
      ref="serviceObjectDialog"
      v-if="showServiceObjectDialog"
      @confirm="confirmSelectServiceObject"
      :eventTypeFlag="dataForm.eventTypeFlag"
      :eventTypeId="dataForm.eventTypeId"
      :eventTypeName="dataForm.eventTypeName"
    ></serviceObjectDialog>
  </div>
</template>

<script>
import bus from "@/utils/bus";
import GroupSelect from "@/views/common/groupselect";
import Linkman from "@/views/common/Linkman";
import LinkmanDraggable from "@/views/common/LinkmanDraggable ";
import serviceObjectDialog from "./service-object-dialog";
import { getRules } from "@/utils/rules";
export default {
  name: "from4",
  components: {
    GroupSelect,
    Linkman,
    LinkmanDraggable,
    serviceObjectDialog,
  },
  data() {
    return {
      servePort: {
        1: "/event/eventType/selectChildTypeList",
        2: "/risk/riskdanger/list-by-type",
        3: "/risk/riskhumanblacklist/list-by-type",
        4: "/risk/riskvehicleblacklist/listNoPage",
        5: "/event/eventType/selectChildTypeList",
        6: "/risk/riskcamera/getList",
        7: "/event/eventType/selectChildTypeList",
      },
      // yellowWarning: 0, // 黄色预警计数器
      // redwWarning: 0, // 红色预警计数器
      checkedList: [], // 预警等级多选框绑定的值
      yellowFlag: true, //黄色预警计数器是否禁用
      redFlag: true, // 红色预警计数器是否禁用
      keyWords: "",
      rpServiceObjectList: {
        serviceName: "",
      },
      pageNumber: 0,
      selectInterval: "",
      dataAll: [],
      optionList: {
        value: "id",
        label: "name",
      },
      row: {},
      cameraList: [],
      sexList: [],
      tableData: [],
      props: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
      },
      dataRules: [], // 表单验证代码
      libgc: "", // 被点击 的 li 的样式
      taket: [], // 牵头部门/联系人选择器数据
      sentinelgroupName: [], // 应哨部门/联系人
      examineGroupName: [], // 审批部门/联系人
      disposegroupName: [], // 处置部门/联系人
      levelList: [], // 等级列表
      showcommonLink: false, // 获取多人联系人弹窗
      showCommonSet: false, // 选择控制弹窗组件
      status: "", // 2 为新增  3 为修改
      showServiceObjectDialog: false,
      responseLevel: [
        // 响应等级
      ],
      serviceObject: [
        // 服务对象
        { id: 1, name: "老人" },
        { id: 2, name: "年青人" },
        { id: 3, name: "儿童" },
        { id: 4, name: "妇女" },
        { id: 5, name: "区域" },
      ],
      // 警情响应
      dataForm: {
        // planId: '', // 预案id
        // responseName: '', // 响应等级名称
        // responseLevel: '', // 响应等级id
        // id: '',
        // responseDuration: '', // 响应时长
        // generalEventDuration: '', // 一般事件响应时长
        // complexEventDuration: '' // 复杂事件响应时长
        id: "",
        planName: "",
        platformId: "",
        eventTypeName: "",
        eventTypeId: "",
        eventTypeFlag: "",
        validTime: [
          this.dateFormatter(new Date()) + " 00:00:00",
          this.dateFormatter(new Date()) + " 23:59:59",
        ],
        intervalTime: 1,
        effectiveTime: 1, // 有效时间（小时）
        warningLevelOne: -1,
        warningLevelTwo: -1,
        levelOneValue: 0, // 黄色预警计数器
        levelTwoValue: 0, // 红色预警计数器
      },
      // 人员关联
      dataStaff: {
        policeResponseId: "", // 警情响应id
        serviceName: "", // 联系人
        serviceContact: "", // 联系电话
        serviceObjectAddress: "", // 地址
        serviceContent: "", // 服务内容
        serviceTypeId: "", //关联类型id
        serviceTypeName: "", //关联类型名称

        leadgroupName: "", // 牵头部门页面显示
        leadGroupId: [], // 多个牵头部门id
        rpLeadContactorList: [], // 多个牵头部门联系人ID
        leadContactor: "", // 牵头部分联系人页面显示

        sentinelgroupName: "", // 应哨部门页面显示
        sentinelGroupId: [], // 多个应哨部门id
        rpSentinelContactorList: [], // 多个应哨部门联系人ID
        sentinelContactor: "", // 应哨部门联系人页面显示

        examineGroupName: "", // 审批部门
        examineGroupId: "", // 审批部门id
        examineContactorName: "", // 审批部门联系人
        examineContactorId: "", // 审批部门联系人id
        disposegroupName: "", // 处置部门
        rpDisposeContactorList: [], // 处置人员 部门与联系人 id
        disposeGroupId: "", // 处置部门id
        disposeContactorName: "", // 处置部门联系人
        disposeContactorId: "", // 处置部门联系人id

        verify: "", // 核实部门名称页面显示
        verifyDeptId: [], // 核实部门名称id
        rpVerifyContactorList: [], // 核实部门联系人
        verifyContactsShow: "", // 核实部门联系人页面显示
      },
      addParameter: false, // 添加响应参数设置
      bgclass: false, // 步骤背景切换
      activeName: "first", // 选项卡切换
      active: false, // 添加等级窗口的显示与隐藏
      // preplanId: null,
      // versionId: null,
      name: "", // 等级信息名称
      disposalReference: "", // 处置参考数据
      emtlevelData: [], // 事件等级数组
      levels: [], // 新增级别数组
      emtlevelID: "", // 事件等级ID
      type: 0, // 响应类型
      deleteLevelID: "", // 删除ID
      levelId: "", // 全局警情响应id
      levelIds: "",
      items: [], // 流程步骤新增数组
      processname: "", // 流程名称
      content: "", // 流程内容
      addtasks: [], // 新增任务内容数组
      taskname: "", // 任务名称
      taskId: "", // 任务ID
      taskIds: "",
      task: false, // 任务内容显示与隐藏
      show: false,
      processId: "", // 新增流程内容ID
      processIds: "",
      dynamicTags: [],
      dynamicTag: [],
      parameterData: [], // 参数数据
      parameterSettingdata: [],
      relation: "", // 判断表达式
      userCreate: 1,
      responsetype: 0,
      urlname: "",
      taketandshould: "", //   分辨应哨与牵头事件
      // cancelEvent: "", // 取消事件全局事件
      levelIdDelet: "", // 删除警情响应等级的 id
      serveFlag: true,
      addListName: "", //添加的列表名
    };
  },

  created() {
    console.log(this.dateFormatter(new Date()) + " 00:00:00");
    this.dataRules = getRules();
    // 获取响应等级数据
    this.handelHTTPresponseLevelList();
    // 获取路由参数
    this.status = this.$route.query.status;
    // 获取 预案id rpPlanId
    this.addlevel();
    // 获取预案的所有数据
    if (this.status === 3) {
      this.handlePlanlist();

      setTimeout(() => {
        // this.handleAll();
        this.handleHTTPAll();
      }, 1000);
    } else {
      // let planForm2_dataForm =this.$cookie.get("planForm2-dataForm");
      // let planForm2_dataStaff =this.$cookie.get("planForm2-dataStaff");
      //
      // if(planForm2_dataForm!=null){
      //   this.dataForm=JSON.parse(planForm2_dataForm);
      // }
      // this.dataForm.responseDuration = 1440
      // this.dataForm.generalEventDuration = 10080 // 一般事件响应时长
      // this.dataForm.complexEventDuration = 10080 // 复杂事件响应时长
    }

    setTimeout(() => {
      // console.log('this.tableData',this.tableData)
    }, 1000);
  },
  mounted() {
    document
      .querySelector("#intervalTime>label")
      .setAttribute("style", "width: initial!important;");
    document
      .querySelector("#effectiveTime>label")
      .setAttribute("style", "width: initial!important;");
    // console.log("document.querySelector('.vxe-body--row td:nth-child(3) div')",document.querySelector('.vxe-body--row td:nth-child(3) div'))
    //当相机服务对象显示不出来时，用jsdom强制显示出来
    // setTimeout(()=>{
    //   document.querySelector('.vxe-body--row td:nth-child(3) div').innerHTML=this.rpServiceObjectList.serviceName
    // },1000)
  },
  activated() {
    this.libgc = "";

    this.status = this.$route.query.status;
    if (this.status == 1) {
    } else if (this.status == 2) {
    } else if (this.status == 3) {
      this.handleHTTPuit();
    }
  },
  computed: {
    // 监听vuex中数据的变化
    f1() {
      return this.$store.state.user.levelList;
    },
    staffList() {
      return this.$store.state.user.staffList;
    },
    referenceList() {
      return this.$store.state.user.referenceList;
    },
    activeForm() {
      return this.$store.state.user.active;
    },
  },
  watch: {
    "dataForm.eventTypeName"(newValue, oldValue) {
      //根据事件类型选择获取服务对象
      if (this.dataForm.eventTypeName) {
        this.handleServeObject();
      }
    },
    keyWords() {
      this.$http({
        url: this.$http.adornUrl(
          this.servePort[`${this.dataForm.eventTypeFlag}`]
        ),
        method: "get",
        params: this.$http.adornParams({
          page: 0,
          limit: 200,
          key: document.querySelector("#searchInput").value,
          platformId: this.$store.state.user.platformId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (
            this.servePort[`${this.dataForm.eventTypeFlag}`] ===
            "/risk/riskcamera/getList"
          ) {
            this.sexList = data.data.records;
          }
          if (
            this.servePort[`${this.dataForm.eventTypeFlag}`] ===
            "/risk/riskhumanblacklist/list-by-type"
          ) {
            // console.log('data.data',data.data)
            this.sexList = data.data.list;
          }
          if (
            this.servePort[`${this.dataForm.eventTypeFlag}`] ===
            "/risk/riskvehicleblacklist/listNoPage"
          ) {
            this.sexList = data.list;
          }

          // console.log('this.sexList',this.sexList)
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    pageNumber(curVal, oldVal) {
      this.$http({
        url: this.$http.adornUrl(
          this.servePort[`${this.dataForm.eventTypeFlag}`]
        ),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageNumber,
          limit: 200,
          key: "",
          platformId: this.$store.state.user.platformId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (
            this.servePort[`${this.dataForm.eventTypeFlag}`] ===
            "/risk/riskcamera/getList"
          ) {
            this.sexList = data.data.records;
          }
          if (
            this.servePort[`${this.dataForm.eventTypeFlag}`] ===
            "/risk/riskhumanblacklist/list-by-type"
          ) {
            // console.log('data.data',data)
            this.sexList = data.data.list;
          }
          if (
            this.servePort[`${this.dataForm.eventTypeFlag}`] ===
            "/risk/riskvehicleblacklist/listNoPage"
          ) {
            this.sexList = data.list;
          }
          // console.log('this.sexList',this.sexList)
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    activeForm(curVal, oldVal) {
      // 默认显示第一项
      this.Levelclick(0);
    },
    f1(curVal, oldVal) {
      this.levelList = curVal;
    },
    // staffList(curVal, oldVal) {
    //   // this.dataStaff = curVal;
    // },
    // referenceList(curVal, oldVal) {
    //   // this.disposalReference = curVal;
    // },
    $route(to, from) {
      this.status = this.$route.query.status;
      this.active = false;
      if (this.status == 3) {
        // 从路由数据中获取 预案id
        this.planId = this.$route.query.data.id;
        // gain()
      }
      if (this.status == 2) {
      }
    },
    addListName() {
      this.handleDataSave();
    },
  },
  methods: {
    /**
     * @description: 监听预警等级多选框的值变化
     * @param {array} newVal 多选框更新后的值
     * @return {type}
     */
    warningLevelChecked(newVal) {
      console.log(newVal);
      // 多选框只选中一个值且为黄色预警
      if (newVal.length == 1 && newVal[0].indexOf("黄色") > -1) {
        this.yellowFlag = false;
        this.redFlag = true;
      }
      // 多选框只选中一个值且为红色预警
      if (newVal.length == 1 && newVal[0].indexOf("红色") > -1) {
        this.yellowFlag = true;
        this.redFlag = false;
      }
      // 多选框两个预警等级都被选中
      if (newVal.length == 2) {
        this.yellowFlag = false;
        this.redFlag = false;
      }
      // 未选中预警等级
      if (newVal.length == 0) {
        this.yellowFlag = true;
        this.redFlag = true;
      }
    },
    //格式化起始时间结束时间
    dateFormatter(str) {
      //默认返回yyyy-MM-dd HH-mm-ss
      var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
      var d = new Date(str);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      if (hasTime) {
        return [year, month, day].join("-");
      } else {
        return [year, month, day].join("-");
      }
    },
    // 事件类型
    handleOpenEvent() {
      this.showCommonSet = true;
      this.tableData = []; // 打开事件类型时清空表格数据
      this.$nextTick(() => {
        this.$refs.commonSet.init(`/event/eventType/list`, "请选择事件类型");
      });
    },
    formatter({ cellValue, row, rowIndex, column, columnIndex }) {
      // console.log('formatterformatterformatterformatterformatterformatterformatterformatterformatterformatterformatter',cellValue)
      if (cellValue) {
        return cellValue.label;
      }
    },
    confirmSelectServiceObject(serviceObject, row, column) {
      // console.log('confirmSelectServiceObject,confirmSelectServiceObject',serviceObject)
      this.row["serviceName"] = serviceObject[0].label;
      this.row["dataSourceId"] = serviceObject[0];
      this.editClosedEvent({ row, column });
    },
    searchKeyWords() {
      this.keyWords = document.querySelector("#searchInput").value;
    },
    previousPage() {
      if (this.pageNumber !== 0) {
        this.pageNumber = this.pageNumber - 1;
        // console.log('上一页')
      }
    },
    nextPage() {
      this.pageNumber = this.pageNumber + 1;
      // console.log('下一页')
    },
    // 获取关联类型
    handleServiceData() {
      this.$http({
        url: this.$http.adornUrl(``),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取服务对象
    // /event/eventType/selectTypeList  typeFlag 1 5 同一个接口
    //this.sexList是服务对象
    handleServeObject() {
      let servePort = {
        1: "/event/eventType/selectChildTypeList",
        2: "/risk/riskdanger/list-by-type",
        3: "/risk/riskhumanblacklist/list-by-type",
        4: "/risk/riskvehicleblacklist/listNoPage",
        5: "/event/eventType/selectChildTypeList",
        6: "/risk/riskcamera/getList",
        7: "/event/eventType/selectChildTypeList",
      };
      if (this.dataForm.eventTypeFlag === 6) {
        // this.$http({
        //   url: this.$http.adornUrl(
        //     servePort[`${this.$route.query.rpTypeFlag}`]
        //   ),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     page: this.pageNumber,
        //     limit: 10000,
        //     key: '',
        //     platformId: this.$store.state.user.platformId
        //   })
        // }).then(({ data }) => {
        //   this.sexList = data.data.records
        //   console.log('this.sexList',this.sexList)
        // })

        //获取关联类型
        this.$http({
          url: this.$http.adornUrl("/event/eventType/selectCarAndHumanType"),
          method: "get",
          params: this.$http.adornParams({}),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log("获取关联类型获取关联类型获取关联类型获取关联类型获取关联类型获取关联类型",data)
            this.cameraList = data.list || data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
      } else if (this.dataForm.eventTypeFlag === 4) {
        // this.$http({
        //   url: this.$http.adornUrl(
        //     servePort[`${this.$route.query.rpTypeFlag}`]
        //   ),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     // page: '',
        //     limit: 10000,
        //     // key: '',
        //     platformId: this.$store.state.user.platformId
        //   })
        // }).then(({ data }) => {
        //   console.log('车辆服务对象',data)
        //   data.list.list.forEach(item => {
        //     item.name = item.carNum
        //   })
        //   this.sexList = data.list.list || data.data
        //   console.log('this.sexList',this.sexList)
        // })
      } else {
        // this.$http({
        //   url: this.$http.adornUrl(
        //     servePort[`${this.$route.query.rpTypeFlag}`]
        //   ),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     typeFlag: this.$route.query.rpTypeFlag,
        //     eventTypeId: this.$route.query.eventTypeId,
        //     isTree: '0',
        //     limit: 10000
        //   })
        // }).then(({ data }) => {
        //   console.log('data.list || data.data',data.list || data.data)
        //   this.sexList = data.list || data.data
        //   if(this.$route.query.rpTypeFlag===3){
        //     console.log('人服务对象',data)
        //     this.sexList=data.data.list
        //   }
        //   console.log('this.sexList',this.sexList)
        // })
      }
    },
    // 保存表格数据
    handleDataSave() {
      // this.$refs.xTable.commitProxy('save')
      if (this.serveFlag) {
        let body = this.$refs.xTable.getRecordset();
        console.log(this.$refs.xTable.getTableData());
        // console.log('this.$refs.xTable.getRecordset(),this.$refs.xTable.getTableData()',this.$refs.xTable.getRecordset(),this.$refs.xTable.getTableData())
        this.$refs.xTable
          .getRecordset()
          .insertRecords.forEach((item, index, arr) => {
            // console.log('(item, index, arr),this.cameraList.find(items => item.dataSourceId === items.id)',item, index, arr,this.cameraList.find(items => item.dataSourceId === items.id))
          });
        // insertRecords  新增的数据
        // removeRecords 删除的数据
        // updateRecords 修改的数据
        let { insertRecords, removeRecords, updateRecords } = body;
        if (insertRecords.length) {
          this.$XMsg.message({
            message: "保存成功！",
            status: "success",
          });
          this.$refs.xTable
            .getRecordset()
            .insertRecords.forEach((item, index, arr) => {
              // item.dataSourceId
              // arr[index]['serviceName'] =
              //   this.sexList.find(items => item.dataSourceId === items.id)
              //     .name || ''
              // arr[index]['serviceTypeName'] =
              //   this.sexList.find(items => item.serviceTypeId === items.id)
              //     .name || ''
              arr[index]["flagType"] = this.dataForm.eventTypeFlag;
            });

          this.tableData.unshift(
            ...this.$refs.xTable.getRecordset().insertRecords
          );
        } else if (removeRecords.length) {
          this.$XMsg.message({
            message: "保存成功！",
            status: "success",
          });
          this.$refs.xTable
            .getRecordset()
            .insertRecords.forEach((item, index, arr) => {
              // item.dataSourceId
              // arr[index]['serviceName'] =
              //   this.sexList.find(items => item.dataSourceId === items.id)
              //     .name || ''
              // arr[index]['serviceTypeName'] =
              //   this.sexList.find(items => item.serviceTypeId === items.id).name || ''
              //arr[index]['eventTypeName'] =
              // this.cameraList.find(items => item.dataSourceId === items.id)
              //   .name || ''
              arr[index]["flagType"] = this.dataForm.eventTypeFlag;
            });
          this.$refs.xTable.getRecordset().removeRecords.forEach((item) => {
            let removeIndex = this.tableData.indexOf(item);
            this.tableData.splice(removeIndex, 1);
          });
          // console.log('表格数据删除了')
        } else if (updateRecords.length) {
          // console.log('表格数据修改了')
          this.$XMsg.message({
            message: "保存成功！",
            status: "success",
          });
          this.$refs.xTable.getRecordset().updateRecords.forEach((item) => {
            // item.serviceName =
            //   this.sexList.find(items => item.dataSourceId === items.id).name ||
            //   ''
            let removeIndex = this.tableData.indexOf(item);
            this.tableData.splice(removeIndex, 1, item);
          });
        }
        // console.log(this.tableData)
      } else {
        this.$message.error("当前服务对象已经存在预案,请更换");
      }
    },
    editClosedEvent({ row, column }, event) {
      let dataSourceId = row.dataSourceId;
      // console.log("dataSourceIddataSourceIddataSourceIddataSourceIddataSourceIddataSourceIddataSourceIddataSourceIddataSourceId",column.title,this.$route.query.rpTypeFlag)
      if (
        this.$refs.xTable.getRecordset().updateRecords.length ||
        this.$refs.xTable.getRecordset().insertRecords.length
      ) {
        if (column.title === "服务对象" && this.dataForm.eventTypeFlag != 6) {
          this.$http({
            url: this.$http.adornUrl(
              `/rp/rpServiceObject/selectBySourceIdAndType`
            ),
            method: "post",
            params: this.$http.adornParams({
              dataSourceId: dataSourceId ? dataSourceId.key : "",
              flagType: this.dataForm.eventTypeFlag,
              //eventTypeId:this.$route.query.rpTypeFlag===6?this.$route.query.serviceTypeId:''
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.serveFlag = true;
              if (data.planId) {
                this.$message.error("当前服务对象已经存在预案,请更换");
                row["serviceName"] = "";
                row["dataSourceId"] = null;
                this.serveFlag = false;
              }
            } else {
              this.$message.error(data.msg);
            }
          });
        }
        if (
          (column.title === "关联类型" && this.dataForm.eventTypeFlag === 6) ||
          (column.title === "服务对象" && row.serviceTypeId != null)
        ) {
          // console.log("进入关联类型关联类型关联类型",row)
          this.$http({
            url: this.$http.adornUrl(
              `/rp/rpServiceObject/selectBySourceIdAndType`
            ),
            method: "post",
            params: this.$http.adornParams({
              dataSourceId: dataSourceId ? dataSourceId.key : "",
              flagType: this.dataForm.eventTypeFlag,
              eventTypeId: row.serviceTypeId,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.serveFlag = true;
              if (data.planId) {
                this.$message.error("该相机关联类型已存在预案,请更换");
                row["serviceTypeId"] = "";
                this.serveFlag = false;
              }
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      }

      // if (this.$refs.xTable.getRecordset().insertRecords.length) {
      //   if (column.title === '服务对象') {
      //     this.$http({
      //       url: this.$http.adornUrl(
      //         `/rp/rpServiceObject/selectBySourceIdAndType`
      //       ),
      //       method: 'post',
      //       params: this.$http.adornParams({
      //         dataSourceId: dataSourceId,
      //         flagType: this.$route.query.rpTypeFlag
      //       })
      //     }).then(({ data }) => {
      //       this.serveFlag = true
      //       if (data.planId) {
      //         this.$message.error('当前服务对象已经存在预案,请更换')
      //         this.serveFlag = false
      //       }
      //     })
      //   }
      // }
    },

    // 编辑框打开时触发
    handleEditActivedEvent({ row, column }, event) {
      // event.target.childNodes[0].value = '1231jhg3jhg'
      // row.address;

      // var selectElement=document.querySelectorAll("body > div.el-select-dropdown.el-popper>.el-scrollbar")
      // var papingElement=document.createElement('div');
      // papingElement.innerHTML='国庆节快乐!'
      // document.querySelectorAll("body > div.el-select-dropdown.el-popper").insertBefore(selectElement,papingElement);
      if (this.selectInterval) {
        clearInterval(this.selectInterval);
      }
      // if(column.title === '服务对象'){
      //   //当相机服务对象显示不出来时，用jsdom强制显示出来
      //   // if(document.querySelector('.vxe-body--row td:nth-child(3) div')){
      //   //   document.querySelector('.vxe-body--row td:nth-child(3) div').innerHTML=''
      //   // }
      //   console.log("this.$route.query.rpTypeFlag",this.$route.query.rpTypeFlag,typeof this.$route.query.rpTypeFlag)
      //   if((this.$route.query.rpTypeFlag!=6)){

      //     return ;
      //   }
      //   this.selectInterval=setInterval(()=>{
      //     if(document.querySelectorAll("body > div.el-select-dropdown.el-popper").length>=1){

      //       if(document.querySelectorAll("body > div.el-select-dropdown.el-popper")[0].innerText.replace(/[\r\n]/g,"").match("一般较大严重重大特大")){
      //         // document.querySelectorAll("body > div.el-select-dropdown.el-popper")[0].remove();
      //         if(document.querySelectorAll("body > div.el-select-dropdown.el-popper").length===1){
      //           return;
      //         }
      //       }

      //       var searchElement=document.createElement('div');
      //       var papingElement=document.createElement('div');
      //       searchElement.setAttribute('style','width:100%;height:30px;margin-top:10px;')
      //       papingElement.setAttribute('style','position:relative;width:100%;height:30px;line-height:30px;')
      //       searchElement.innerHTML=`<input type="text" placeholder="请输入内容" style="margin-left:10%;height:100%;width:50%;" id="searchInput"><div id="searchButton" style="margin-left: 10px;border:1px solid ;border-radius:5px;display:inline-block;padding: 5px 5px;">搜索</div>`
      //       papingElement.innerHTML=`<span style="position:absolute;left:7%;" id="previousPage">上一页</span><span style="position:absolute;right:7%;" id="nextPage" >下一页</span>`

      //       if(document.querySelectorAll("body > div.el-select-dropdown.el-popper .el-scrollbar")[document.querySelectorAll("body > div.el-select-dropdown.el-popper").length-1]){

      //            document.querySelectorAll("body > div.el-select-dropdown.el-popper")[document.querySelectorAll("body > div.el-select-dropdown.el-popper").length-1].insertBefore(searchElement,document.querySelectorAll("body > div.el-select-dropdown.el-popper .el-scrollbar")[document.querySelectorAll("body > div.el-select-dropdown.el-popper").length-1])

      //       }

      //       document.querySelectorAll("body > div.el-select-dropdown.el-popper")[document.querySelectorAll("body > div.el-select-dropdown.el-popper").length-1].appendChild(papingElement)

      //       clearInterval(this.selectInterval)
      //       document.querySelector('#previousPage').onclick=this.previousPage;
      //       document.querySelector('#nextPage').onclick=this.nextPage;
      //       document.querySelector("#searchButton").onclick=this.searchKeyWords;
      //     }
      //   })
      // }

      // console.log(`打开 ${column.title} 列编辑`, row)
      if (column.title !== "服务对象") {
        switch (column.title) {
          case "核实人员":
            this.handelVerify("verify");
            break;
          case "处置人员":
            this.handelVerify("DisposeContactor");
            break;
          case "吹哨人员":
            this.handelVerify("LeadContactor");
            break;
          case "应哨人员":
            this.handelVerify("SentinelContactor");
            break;
          default:
            break;
        }
        this.row = row;
      } else {
        this.row = row;
        //事件类型还没选择，不能选择服务对象
        if (!this.dataForm.eventTypeName) {
          this.$message({
            type: "info",
            message: "请先选择事件类型!",
          });
          return;
        }
        this.showServiceObjectDialog = true;
        setTimeout(() => {
          this.$refs.serviceObjectDialog.dialogVisible = true;
          this.$refs.serviceObjectDialog.row = row;
          this.$refs.serviceObjectDialog.column = column;
        });
        // console.log('this.showServiceObjectDialog',this.showServiceObjectDialog)
      }
    },

    // 表格删除事件
    handleDeleteEvent() {
      let selectRecords = this.$refs.xTable.getSelectRecords();
      // console.log(selectRecords)
      if (selectRecords.length) {
        this.$confirm("此操作将永久删除该行数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$refs.xTable.removeSelecteds();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleDataSave();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message({
          type: "info",
          message: "请至少选择一条数据！",
        });
      }
    },
    // 表格新增一行
    handleInsertEvent(row) {
      // console.log(row)
      // this.tableData.push({
      //   address: '123123',
      //   date: '123',
      //   name: '123',
      //   sex: '13'
      // })
      this.$refs.xTable.insert();
      // .then(({ row }) => this.$refs.xTable.setActiveCell(row, 'name'))
    },

    // 获取事件类型数据
    handleHTTPuit() {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/list`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let event = [];
          this.handlefor(data.data, this.dataForm.eventTypeId, event);
          this.dataForm.eventName = event[0].name;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 遍历树形 获取相应的数据
    // jsonData 数据
    // destID 目标id
    // json 目标数据
    handlefor(jsonData, destID, json) {
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id == destID) {
          json.push(jsonData[i]);
        } else {
          if (
            jsonData[i].hasOwnProperty("children") &&
            jsonData[i].children !== null
          ) {
            this.handlefor(jsonData[i].children, destID, json);
          }
        }
      }
    },
    //  修改时获取预案数据
    handlePlanlist() {
      this.dataForm.planId = this.$route.query.data.id;
      this.$http({
        url: this.$http.adornUrl(
          `/rp/plan/listById/${this.$route.query.data.id}`
        ),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = { ...data.rpPlan };
          // console.log("修改时获取预案数据",data,this.dataForm)
          // console.log('修改时获取预案数据',this.dataForm.validTime,data.rpPlan.startTime,data.rpPlan.endTime)
          // this.dataForm.validTime=[data.rpPlan.startTime,data.rpPlan.endTime]

          // 如果warningLevelOne不为0，则黄色等级预警为可用状态
          if (data.rpPlan.warningLevelOne != -1) {
            this.yellowFlag = false;
          } else {
            this.yellowFlag = true;
          }
          // 如果warningLevelTwo不为0，则红色等级预警为可用状态
          if (data.rpPlan.warningLevelTwo != -1) {
            this.redFlag = false;
          } else {
            this.redFlag = true;
          }
          this.checkedList = [];
          switch (data.rpPlan.warningLevelOne) {
            case 0:
              this.checkedList.push("0黄色");
              break;
            case 1:
              this.checkedList.push("1黄色");
              break;
            case 2:
              this.checkedList.push("2黄色");
          }
          switch (data.rpPlan.warningLevelTwo) {
            case 0:
              this.checkedList.push("0红色");
              break;
            case 1:
              this.checkedList.push("1红色");
              break;
            case 2:
              this.checkedList.push("2红色");
          }
          this.$set(this.dataForm, "validTime", [
            data.rpPlan.startTime,
            data.rpPlan.endTime,
          ]);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取全部数据
    handleAll() {
      const id = this.dataForm.id ? this.dataForm.id : 0;
      // // 获取警情响应数据
      this.$http({
        url: this.$http.adornUrl(`/rp/policeResponse/listByPlanId/${id}`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(' // // 获取警情响应数据', data.rpPoliceResponseList)
          // 获取全部数据
          // console.log('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',data)

          data.list.forEach((item, index) => {
            this.handleHTTPAll(item.id, item);
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //获取vxe-table的数据
    // 获取全部等级数据
    // id 响应id  data 响应等级数据
    // dataAll 全部数据 是一个数组
    handleHTTPAll(id, datas) {
      // const Id = this.dataForm.id ? this.dataForm.id : 0;
      const Id = this.$route.query.data ? this.$route.query.data.id : 0;
      // 获取人员关联数据
      this.$http({
        url: this.$http.adornUrl(
          `/rp/associatedPersonnel/selectListByPlanId/${Id}`
        ),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var disposalReference;
          if (data.RpCommonPojo.disposalReferenceList.length > 0) {
            disposalReference =
              data.RpCommonPojo.disposalReferenceList[0]["disposalReference"];
          } else {
            disposalReference = "";
          }
          data.RpCommonPojo.rpServiceObjectList.forEach((item, index, arr) => {
            let serviceObjectList = {
              key: item.serviceObjectEntity.dataSourceId,
              label: item.serviceObjectEntity.serviceName,
            };

            let rpVerifyContactorList = item.verifyContactorList.map(
              (items) => {
                return {
                  contactorId: items.contactorId,
                  groupId: items.groupId,
                  name: items.name,
                };
              }
            );
            let rpDisposeContactorList = item.disposeContactorList.map(
              (items) => {
                return {
                  contactorId: items.contactorId,
                  groupId: items.groupId,
                  name: items.name,
                };
              }
            );
            let rpLeadContactorList = item.leadContactorList.map((items) => {
              return {
                contactorId: items.contactorId,
                groupId: items.groupId,
                name: items.name,
              };
            });
            let rpSentinelContactorList = item.sentinelContactorList.map(
              (items) => {
                return {
                  contactorId: items.contactorId,
                  groupId: items.groupId,
                  name: items.name,
                };
              }
            );

            let VerifyContactorName = rpVerifyContactorList
              .map((items) => items.name)
              .join("、");
            let DisposeContactorName = rpDisposeContactorList
              .map((items) => items.name)
              .join("、");
            let LeadContactorName = rpLeadContactorList
              .map((items) => items.name)
              .join("、");
            let SentinelContactorName = rpSentinelContactorList
              .map((items) => items.name)
              .join("、");
            arr[index] = {
              // dataSourceId: serviceObjectList['dataSourceId'],
              dataSourceId: serviceObjectList,
              flagType: this.dataForm.eventTypeFlag,
              serviceName: serviceObjectList["label"],
              serviceTypeId: item.serviceObjectEntity.serviceTypeId,
              serviceTypeName: item.serviceObjectEntity.serviceTypeName,
              VerifyContactorName: VerifyContactorName,
              rpVerifyContactorList: rpVerifyContactorList,
              DisposeContactorName: DisposeContactorName,
              rpDisposeContactorList: rpDisposeContactorList,
              LeadContactorName: LeadContactorName,
              rpLeadContactorList: rpLeadContactorList,
              SentinelContactorName: SentinelContactorName,
              rpSentinelContactorList: rpSentinelContactorList,
            };

            // 设置临时服务对象名称，用于表格显示不出时显示
            this.rpServiceObjectList.serviceName =
              item.serviceObjectEntity.serviceName;
          });
          // 处置参考数据
          this.dataAll.push({
            dataForm: datas,
            disposalReference: disposalReference,
            tableData: data.RpCommonPojo.rpServiceObjectList,
          });
          // console.log('tableDatatableDatatableDatatableDatatableDatatableDatatableDatatableDatatableDatatableDatatableDatatableDatatableData',this.tableData)
          this.levelList.push(datas);
          // 默认显示第一项
          this.libgc = 0;

          this.tableData = this.dataAll[0]["tableData"];
          // this.dataForm = { ...this.dataAll[0]['dataForm'] }
          this.disposalReference = this.dataAll[0]["disposalReference"];
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handelHTTPresponseLevelList() {
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictionary/responseLevelList`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.responseLevel = data.data.filter((item, index) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 重置表单按钮
    cancel() {
      this.libgc = "";
      this.$refs.dataForm.resetFields();
      // 清空警情响应
      for (let prop in this.dataForm) {
        this.dataForm[prop] = "";
      }
      this.tableData = [];
      // 表单重置
      // 清空人员关联
      // for (let prop in this.dataStaff) {
      //   this.dataStaff[prop] = prop instanceof Array ? [] : ''
      // }
      // 处置参考重置
      this.disposalReference = "";
      // 表单重置
      // this.$refs.ruleFormSecond.resetFields()
      this.addlevel();
    },
    // 触发多选组件
    handelVerify(name) {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择",
        name
      );
    },
    // 核实人员，处置人员弹窗多选组件 返回数据
    handelLinkdata({ linkman, name }) {
      // console.log(linkman, name)
      this.addListName = name;
      let str = name;
      switch (str) {
        case "verify":
          this.row["rpVerifyContactorList"] = linkman.map((item) => {
            return {
              contactorId: item.id, // 联系人id  数字类型
              groupId: item.groupId, //  部门id  数字类型
              name: item.name,
              // 联系电话
              phone: item.phone || item.mobile1,
            };
          });
          this.row["VerifyContactorName"] = this.row["rpVerifyContactorList"]
            .map((item) => `${item.name}(${item.phone || item.mobile1 || '暂无联系方式'})`)
            .join("、");
          // console.log(this.row)
          break;
        case "DisposeContactor":
          this.row["rpDisposeContactorList"] = linkman.map((item) => {
            return {
              contactorId: item.id, // 联系人id  数字类型
              groupId: item.groupId, //  部门id  数字类型
              name: item.name,
              // 联系电话
              phone: item.phone || item.mobile1,
            };
          });
          this.row["DisposeContactorName"] = this.row["rpDisposeContactorList"]
            .map((item) => `${item.name}(${item.phone || item.mobile1 || '暂无联系方式'})`)
            .join("、");
          break;
        case "LeadContactor":
          this.row["rpLeadContactorList"] = linkman.map((item) => {
            return {
              contactorId: item.id, // 联系人id  数字类型
              groupId: item.groupId, //  部门id  数字类型
              name: item.name,
              // 联系电话
              phone: item.phone || item.mobile1,
            };
          });
          this.row["LeadContactorName"] = this.row["rpLeadContactorList"]
            .map((item) => `${item.name}(${item.phone || item.mobile1 || '暂无联系方式'})`)
            .join("、");
          break;
        case "SentinelContactor":
          this.row["rpSentinelContactorList"] = linkman.map((item) => {
            return {
              contactorId: item.id, // 联系人id  数字类型
              groupId: item.groupId, //  部门id  数字类型
              name: item.name,
              // 联系电话
              phone: item.phone || item.mobile1,
            };
          });
          this.row["SentinelContactorName"] = this.row[
            "rpSentinelContactorList"
          ]
            .map((item) => `${item.name}(${item.phone || item.mobile1 || '暂无联系方式'})`)
            .join("、");
      }
    },
    // 多个部门选择 参数获取
    // depName 部门名称显示页面   depId 多个部门id
    // contactsName 联系人名称显示页面   contactsId 多个联系人id
    handelmulti(linkman, depName, depId, contactsName, contactsId, id) {
      // 核实部门名称
      this.dataStaff[depName] = Array.from(
        new Set(
          linkman.map((item, index) => {
            // 这参数不改
            return item.verify;
          })
        )
      ).join("、");
      // 核实部门id 获取并 去重
      // 联系人数据
      this.dataStaff[contactsId] = linkman.map((item, index) => {
        let obj = {
          // 预案id
          planId: this.dataForm.planId,
          // 警情响应id
          responseId: this.dataStaff.policeResponseId || this.dataForm.id,
        };
        // 部门id
        obj.verifyDeptId = item.verifyDeptId;
        // 联系人id  等后端对应
        obj.verifyContactorId = item.id;
        obj.personnelFlag = id;
        return {
          ...obj,
        };
      });
      let arr = linkman.map((item, indx) => {
        return { id: item.id, name: item.name };
      });
      // 联系人页面展示效果
      this.dataStaff[contactsName] = arr
        .map((item, index) => {
          return item.name;
        })
        .join("、");
      this.row[contactsName] = this.dataStaff[contactsName];
    },
    // // 部门选择
    // handelOpenTaketh (name) {
    //   switch (name) {
    //     case 'disposegroupName':
    //       this.handelSelect(name)
    //       break
    //     case 'examineGroupName':
    //       this.handelSelect(name)
    //       break
    //   }
    // },
    // // 选择部门触发
    // handelSelect (sec) {
    //   this.taketandshould = sec
    //   this.showCommonSet = true
    //   this.urlname = `/mail/mailgroup/list`
    //   this.$nextTick(() => {
    //     this.$refs.commonSet.init(`/mail/mailgroup/list`, '请选择牵头部门')
    //   })
    // },
    // 选择部门后
    handleOnSubmit(obj) {
      // 选择事件类型后
      this.dataForm.eventTypeName = obj.name; // 事件名称
      this.dataForm.eventTypeId = obj.id; // 事件id
      this.dataForm.eventTypeFlag = obj.typeFlag; // 类型标志id
      this.checkedList = []; // 清空预警等级选中值
      this.yellowFlag = true; // 黄色预警取消选中
      this.redFlag = true; // 红色预警取消选中
      this.dataForm.levelOneValue = 0; // 恢复黄色预警的值为初始值
      this.dataForm.levelTwoValue = 0; // 恢复红色预警的值为初始值
    },
    // 选择部门后触发
    // id 部门id
    // name 部门name
    // setName 选择框数据
    // data 选择部门后返回数据
    // datas 发送请求获取的数据
    handlelater(id, names, setName, data, datas) {
      this.dataStaff[id] = data.id;
      this.dataStaff[names] = data.name;
      this[setName] = datas.data.list.map((item, index, arr) => {
        return {
          value: item.id,
          name: item.name,
        };
      });
    },
    // handelOpenshould () {
    //   this.showCommonSet = true
    //   this.urlname = `/mail/mailgroup/list`
    //   this.$nextTick(() => {
    //     this.$refs.commonSet.init(`/mail/mailgroup/list`, '请选择应哨部门')
    //   })
    // },
    // 单选窗口组件
    handelTaketheLinkman(id) {
      switch (this.taketandshould) {
        case "examineGroupName":
          this.handelReturning(
            "examineContactorName",
            "examineContactorId",
            id,
            "examineGroupName"
          );
          break;
        case "disposegroupName":
          this.handelReturning(
            "disposeContactorName",
            "disposeContactorId",
            id,
            "disposegroupName"
          );
          break;
      }
    },
    // 响应数据
    // ids 返回回来的id
    // ContactName 联系人名字
    // ContactNameID 联系人id
    handelReturning(ContactName, ContactNameID, ids, linkman) {
      this.dataStaff[ContactNameID] = ids;
      const rp = this[linkman].filter(
        (item) => item.value == this.dataStaff[ContactNameID]
      )[0];
      if (rp.name) {
        this.dataStaff[ContactName] = rp.name;
      }
    },

    // 新增新级别数组
    addlevel() {
      const planId = this.dataForm.platformId;
      this.dataForm.planId = planId;
    },
    // 删除预案响应等级级别
    deleteLevel(data, index) {
      this.$confirm("是否删除预案?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.$http({
            url: this.$http.adornUrl(`/rp/policeResponse/delete/${data.id}`),
            method: "get",
          }).then((result) => {
            if (data && data.code === 0) {
              // this.$store.commit("user/updataDelete", data);
              this.levelList = [];
              this.dataAll = [];
              this.handleAll();
              this.cancel();
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除.",
          });
          this.libgc = "";
          this.active = false;
          this.levelIdDelet = "";
        });
      // if (this.levelIdDelet == "") {
      //   this.$message({
      //     message: "请选中级别再删除！",
      //     type: "warning"
      //   });
      //   return;
      // }
    },
    Leveldefault() {
      // 默认加载第一条数据
      if (this.levelId == "") {
        this.levelId = this.levelIds;
      }
      let data = {
        id: this.levelId,
      };
    },
    // 点击级别获取预案响应等级信息
    Levelclick(index) {
      this.libgc = index; // 把当前index 赋值到data中
      // 获取vuex中的数据 赋值到data中
      this.tableData = this.dataAll[index]["tableData"];
      this.dataForm = { ...this.dataAll[index]["dataForm"] };
      this.disposalReference = this.dataAll[index]["disposalReference"];
      // this.dataForm = { ...this.$store.state.user.levelList[index] }
      // console.log(this.dataForm.id)
      // // 把响应 id 设置给全局属性
      // this.levelIdDelet = this.$store.state.user.levelList[index].id
      // this.dataStaff = { ...this.$store.state.user.staffList[index] }
      // if (this.$store.state.user.referenceList[index]) {
      //   this.disposalReference = this.$store.state.user.referenceList[index][
      //     'disposalReference'
      //   ]
      // } else {
      //   this.disposalReference = ''
      // }
    },
    // 选择响应等级返回值
    change_responseLevel(responseLevelId) {
      this.dataForm.responseLevel = responseLevelId;
      const rp = this.responseLevel.filter(
        (item) => item.id == responseLevelId
      )[0];
      this.dataForm.responseName = rp.name;
      // console.log(this.dataAll, this.dataForm.responseLevel)
    },

    // 等级制定数据添加
    handelgrade() {
      // 表单验证逻辑
      this.$refs.dataForm.validate((valid) => {
        // console.log(
        //   '',
        //   // this.dataForm.responseLevel,
        //   this.dataAll,
        //   this.libgc === ''
        // )
        if (valid) {
          if (!(this.libgc === "")) {
            if (
              // this.dataForm.responseLevel ===
              // this.dataAll[this.libgc]['dataForm']['responseLevel']
              false
            ) {
              this.handelData();
            } else {
              // console.log('修改了响应等级,需要判断是否有当前响应等级')
              // 如果存在当前响应等级,则不然他修改,不存在就能修改
              var falg = true;
              this.dataAll.forEach((item) => {
                // if (
                //   item.dataForm.responseLevel === this.dataForm.responseLevel
                // ) {
                //   falg = false
                // }
              });
              if (falg) {
                // 没相同 直接修改当前
                this.handelData();
              } else {
                // 有相同的 不让用户替换
                this.$message.error("警告,已经存在响应等级,请更换!");
              }
            }
          } else {
            // console.log('重置了预案')
            var falg2 = true;
            this.dataAll.forEach((item) => {
              // if (item.dataForm.responseLevel === this.dataForm.responseLevel) {
              //   falg2 = false
              // }
            });
            if (falg2) {
              // 没相同 直接修改当前
              this.handelData();
            } else {
              // 有相同的 不让用户替换
              this.$message.error("警告,已经存在响应等级,请更换!");
            }
          }
        }
      });
    },
    // 数据添加代码
    handelData() {
      console.log(this.tableData, this.checkedList);
      let id = this.dataForm.id || 0;
      this.dataForm.warningLevelOne = -1;
      this.dataForm.warningLevelTwo = -1;
      // 遍历选中的多选框，判断预警等级的类型：0：其它 1：相机 2：人
      this.checkedList.forEach((item) => {
        if (item.indexOf("0黄色") > -1) {
          this.dataForm.warningLevelOne = 0;
        }
        if (item.indexOf("1黄色") > -1) {
          this.dataForm.warningLevelOne = 1;
        }
        if (item.indexOf("2黄色") > -1) {
          this.dataForm.warningLevelOne = 2;
        }
        if (item.indexOf("0红色") > -1) {
          this.dataForm.warningLevelTwo = 0;
        }
        if (item.indexOf("1红色") > -1) {
          this.dataForm.warningLevelTwo = 1;
        }
        if (item.indexOf("2红色") > -1) {
          this.dataForm.warningLevelTwo = 2;
        }
      });
      this.tableData.forEach((element) => {
        element.dataSourceId = element.dataSourceId
          ? element.dataSourceId.key
          : "";
      });
      // this.tableData[0].dataSourceId=this.tableData[0].dataSourceId.key
      this.$http({
        url: this.$http.adornUrl(
          id
            ? `/rp/associatedPersonnel/updateBatch`
            : `/rp/associatedPersonnel/saveBatch`
        ),
        method: "post",
        data: this.$http.adornData({
          // rpPoliceResponseEntity: { ...this.dataForm }, // 警情响应
          rpPlanEntity: {
            planName: this.dataForm.planName,
            id: this.dataForm.id ? this.dataForm.id : 1,
            platformId: this.$store.state.user.platformId,
            eventTypeName: this.dataForm.eventTypeName,
            eventTypeFlag: this.dataForm.eventTypeFlag,
            eventTypeId: this.dataForm.eventTypeId,
            startTime: this.dataForm.validTime[0],
            endTime: this.dataForm.validTime[1],
            intervalTime: this.dataForm.intervalTime,
            warningLevelOne: this.dataForm.warningLevelOne,
            levelOneValue: this.dataForm.levelOneValue,
            warningLevelTwo: this.dataForm.warningLevelTwo,
            levelTwoValue: this.dataForm.levelTwoValue,
            effectiveTime: this.dataForm.effectiveTime
          },
          rpDisposalReferenceEntity: {
            disposalReference: this.disposalReference,
          },
          rpServiceObjectList: [...this.tableData],
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 新增&&修改成功 把当前的数据保存到 dataAll中
          // 新增
          this.dataAll = [];
          this.levelList = [];
          // this.handleAll()
          this.handleHTTPAll();
          this.$confirm("预案已保存,是否跳转页面?", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "继续添加",
            type: "warning",
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.$router.push({
                path: "/sys/reserveplan/reserveplan",
                name: "sys/reserveplan/reserveplan",
              });
            })
            .catch(() => {
              this.$message({
                type: "success",
                message: "继续添加.",
              });
            });
        } else {
          this.$message.error(`${data.msg}`);
        }
      });
      // this.$refs.ruleFormSecond.validate(validation => {
      //   if (validation) {

      //   } else {
      //     return false
      //   }
      // })
    },
    // 警情响应数据保存
    handelHTTPalert() {
      // 响应警情有两中事件,修改和添加 通过判断vuex中是否有当前项目执行添加或者修改功能
      // 修改警情响应应该是根据
      switch (this.status) {
        case 2:
          let obj = {
            ...this.dataForm,
          };
          let id = {
            id: this.levelId,
          };
          Object.assign(obj, id);
          this.$http({
            url: this.$http.adornUrl(`/rp/policeResponse/update`),
            method: "post",
            data: this.$http.adornData(obj),
          }).then(({ data }) => {});
          this.$emit("savePolicResponse", { obj, name: "dataForm" });
          break;
        case 3:
          // 添加逻辑  返回一个 响应等级id
          this.$http({
            // /rp/policeResponse/save 添加响应请求数据,并返回响应等级id
            url: this.$http.adornUrl("/rp/policeResponse/save"),
            method: "post",
            data: this.$http.adornData({
              ...this.dataForm,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.id = data.responseId;
              this.levelId = data.responseId;
              let obj = {
                ...this.dataForm,
              };
              Object.assign(obj);
              this.$emit("savePolicResponse", { obj, name: "dataForm" });
              this.dataStaff.policeResponseId = data.responseId; // 在dataStaff中保存 响应id
            } else {
              this.$message.error(data.msg);
            }
          });
          break;
      }
    },
    // 人员关联数据保存
    handelHTTPstaff() {
      let dataStaff = {
        planId: this.dataForm.planId, // 预案id
        // policeResponseId: this.dataStaff.policeResponseId || this.dataForm.id, // 警情响应id
        serviceName: this.dataStaff.serviceName, // 联系人
        serviceContact: this.dataStaff.serviceContact, // 联系人电话
        serviceObjectAddress: this.dataStaff.serviceObjectAddress, // 地址
        serviceContent: this.dataStaff.serviceContent, // 服务内容
        // leadGroupId: this.dataStaff.leadGroupId, // 牵头部门id
        rpLeadContactorList: this.dataStaff.rpLeadContactorList, // 牵头部门联系人id
        // sentinelGroupId: this.dataStaff.sentinelGroupId, // 应哨部门id
        rpSentinelContactorList: this.dataStaff.rpSentinelContactorList, // 应哨部门联系人id
        disposeGroupId: this.dataStaff.disposeGroupId, // 处置部门id
        disposeContactorId: this.dataStaff.disposeContactorId, // 处置部门联系人id
        examineGroupId: this.dataStaff.examineGroupId, // 审批部门id
        examineContactorId: this.dataStaff.examineContactorId, // 审批部门联系人id
        rpVerifyContactorList: this.dataStaff.rpVerifyContactorList, // 核实部门联系人
      };
      switch (this.status) {
        case 2:
          let obj = {
            ...this.dataStaff,
          };
          this.$http({
            url: this.$http.adornUrl(`/rp/personnelAssociated/update`),
            method: "post",
            data: this.$http.adornData(dataStaff),
          }).then(({ data }) => {
            this.$emit("savePolicResponse", { obj, name: "dataStaff" });
          });
          break;
        case 3:
          this.$http({
            url: this.$http.adornUrl("/rp/personnelAssociated/saveBatch"),
            method: "post",
            data: this.$http.adornData(dataStaff),
          }).then((result) => {
            let obj = {
              ...this.dataStaff,
            };
            this.$emit("savePolicResponse", { obj, name: "dataStaff" });
          });
          break;
      }
    },
    // 处置参考数据保存
    handelHTTPdisposal() {
      let obj = {
        planId: this.dataForm.planId,
        // policeResponseId: this.dataForm.id,
        disposalReference: this.disposalReference,
      };
      switch (this.status) {
        case 2:
          this.$http({
            url: this.$http.adornUrl("/rp/disposalReference/update"),
            method: "post",
            data: this.$http.adornData(obj),
          }).then(({ data }) => {
            this.$emit("savePolicResponse", { obj, name: "Reference" });
          });
          break;
        case 3:
          this.$http({
            url: this.$http.adornUrl("/rp/disposalReference/save"),
            method: "post",
            data: this.$http.adornData(obj),
          }).then(({ data }) => {
            this.$emit("savePolicResponse", { obj, name: "Reference" });
          });
          break;
      }
    },

    defaultprocess() {
      if (!this.processId) {
        this.processId = this.processIds;
      }
      let data = {
        processId: this.processId,
      };
    },
    // 点击流程步骤
    getIndex(id, index) {
      if (!id) {
        this.processname = "";
        this.content = "";
        this.addtasks = [];
        this.processId = "";
        this.taskId = "";
        this.task = false;
        return;
      }
      this.processId = id;
      this.taskId = "";
      this.defaultprocess();
    },
    // 删除流程
    deleteLevelProcess() {
      if (this.processId == "") {
        this.$message({
          message: "请选中流程再删除！",
          type: "warning",
        });
        return;
      }

      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            id: this.processId,
          };
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 获取流程任务列表
    getLevelProcessTaskList() {
      if (this.processId) {
        let data = {
          processId: this.processId,
        };
      }
    },
    getLevelProcessTask(id) {
      // 点击获取流程任务详细信息
      this.taskId = id;
      this.getLevelProcessTaskDetails();
    },

    getLevelProcessTaskDetails() {
      if (!this.taskId) {
        this.taskId = this.taskIds;
      }
      let data = {
        taskId: this.taskId,
      };
    },
  },
};
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .el-form-item__label {
    text-align: left !important;
  }
  #center h1 {
    text-align: center;
  }
  .grade {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
  }
  .grade li {
    /* text-align: none; */
    width: 240px;
    margin-right: 15%;
    height: 32px;
    line-height: 32px;
    margin-top: 10px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(211, 215, 219, 1);
    border-radius: 3px;
    font-size: 14px;
    cursor: pointer;
  }
  .grade li img {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-left: 17px;
    margin-right: 5px;
    margin-bottom: 3px;
  }
  .grade li span {
    font-size: 19px;
  }
  .grade li:nth-last-of-type(1) span {
    color: #479dff;
  }
  .grade li:nth-last-of-type(2) span {
    color: #7559ff;
  }
  .grade li:nth-last-of-type(3) span {
    color: #f5d762;
  }
  .grade li:nth-last-of-type(4) span {
    color: #f58d25;
  }
  .grade li:nth-last-of-type(5) span {
    color: #e67380;
  }
  .staff {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  li {
    list-style: none;
    /*text-align: center;*/
  }

  #center .box-card {
    width: 1120px;
    /*margin: 20px auto;*/
  }

  .top li {
    float: left;
    width: 110px;
    text-align: center;
    font-size: 16px;
    border-right: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }

  .left {
    width: 222px;
    float: left;
  }

  .middle {
    width: 221px;
    /*border-right: 1px solid #E4E7ED;*/
    height: 500px;
  }

  .right {
    float: left;
    margin-top: 16px;
    margin-left: 10px;
    width: 882px;
    min-height: 400px;
  }

  .right-input {
    width: 250px;
  }
  .member {
    margin-top: 15px;
  }
  .member i {
    display: inline-block;
    width: 10px;
    height: 1px;
    background: #c0c0c0;
  }

  .setup {
    width: 358px;
    padding-bottom: 10px;
    border: 1px solid #c0c0c0;
    min-height: 100px;
  }

  .setupinput {
    width: 50px;
    height: 24px;
    padding: 0 2px;
    color: #606266;
  }

  .bottom {
    margin: 0 auto;
    margin-top: 30px;
  }

  .bottom li {
    float: left;
    width: 80px;
    background: #66b1ff;
    color: #ffffff;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    border-radius: 8px;
  }

  .bottom li:first-child {
    margin-left: 104px;
    margin-right: 20px;
  }

  .submit-btn {
    clear: both;
    text-align: center;
  }

  .right_top li {
    list-style: none;
    width: 72px;
    cursor: pointer;
    float: left;
  }

  .right_top li span {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #409eff;
    color: #409eff;
    display: inline-block;
    text-align: center;
    line-height: 30px;
  }

  .right_top li i {
    display: inline-block;
    width: 40px;
    height: 1px;
    background: #409eff;
  }

  .right_top p {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #409eff;
    color: #3b85fe;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    /*float: left;*/
  }

  .right_center {
    clear: both;
  }

  .right_process {
    width: 824px;
    height: 300px;
    border: 1px solid #dcdfe6;
    clear: both;
    position: relative;
    margin-bottom: 60px;
  }

  .right_process h3 {
    font-weight: normal;
    font-size: 16px;
    width: 50px;
    height: 30px;
    line-height: 30px;
    background: #ffffff;
    position: absolute;
    color: #606266;
    left: 12px;
    top: -15px;
    text-align: center;
  }

  .right_process span {
    float: right;
    font-size: 14px;
    margin-top: 4px;
    margin-right: 24px;
  }

  .right_process .delete {
    position: absolute;
    color: #607d8b;
    right: -4px;
    top: -10px;
    cursor: pointer;
  }

  .task_left {
    width: 300px;
    min-height: 200px;
    border: 1px solid #dcdfe6;
    position: relative;
    padding-bottom: 2px;
    display: inline-block;
  }

  .task_nav {
    float: right;
  }

  .task_left h3 {
    font-weight: normal;
    font-size: 16px;
    width: 50px;
    height: 30px;
    line-height: 30px;
    background: #ffffff;
    position: absolute;
    color: #606266;
    left: 12px;
    top: -15px;
    text-align: center;
  }

  .task_nav li {
    float: left;
    width: 60px;
    height: 26px;
    text-align: center;
    line-height: 27px;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    margin-top: 6px;
    margin-bottom: 6px;
    background: #ccc;
  }

  .task_nav li:last-child {
    border-left: 0;
    margin-right: 4px;
  }

  .content {
    clear: both;
    text-align: center;
  }

  .content h2 {
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
    border-bottom: 1px solid #1111118f;
  }

  .content li {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }

  .task_right {
    width: 500px;
    float: right;
  }

  .task_content {
    border: 1px solid #dcdfe6;
    width: 398px;
    min-height: 100px;
    position: relative;
  }

  .add {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    padding: 0 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .create-btn {
    float: right;
    margin: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 0px;
    margin-bottom: 10px;
  }

  .el-tree >>> .el-tree-node {
    /*background: #ccc;*/
  }

  .el-tree--highlight-current
    >>> .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #c0c0c0;
  }

  .el-tag + .el-tag {
    margin-left: 0px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .dynamicTags {
    padding: 0 10px;
    margin-right: 10px;
  }

  .right_top li span.bgclass {
    background-color: #409eff;
    color: #ffffff;
  }

  .levelsclass {
    background-color: #bbb;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .thetitle {
    text-align: center;
    font-size: 24px;
    margin: 15px auto;
    color: #000;
  }

  .el-form >>> .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    min-width: 136px;
  }
</style>
