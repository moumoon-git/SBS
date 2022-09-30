<template>
  <div id="center">
    <!--<p class="thetitle">监测预警响应流程设计</p>-->
    <el-card class="box-card" shadow="always" :body-style="{ padding: '0px' }">
      <div class="left">
        <div class="top">
          <ul>
            <li @click="addlevel()">+新增级别</li>
            <li @click="deleteLevel()">-删除级别</li>
          </ul>
        </div>
        <!-- 新增级别后显示的盒子 -->
        <div style="clear: both;" class="middle">
          <ul>
            <li
              v-for="(item, index) in levelList"
              :key="index"
              @click="Levelclick(item, index)"
              :class="{ levelsclass: libgc === index }"
            >
              {{ item.responseName }}
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <el-tabs type="border-card" v-if="active" v-model="activeName">
          <!--警情响应-->
          <el-tab-pane label="警情响应" name="first">
            <div class="levelTop" style="float: right;">
              <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
            </div>
            <div style="margin: 0 auto;width: 370px;clear: both;">
              <el-form
                label-width="150px"
                :rules="dataRules"
                :model="dataForm"
                ref="dataForm"
              >
                <el-form-item
                  label="响应等级:"
                  class="member"
                  style="width: 300px;"
                  required
                  prop="responseName"
                >
                  <el-select
                    v-model="dataForm.responseName"
                    placeholder="请选择"
                    size="mini"
                    width="50"
                    @change="change_responseLevel"
                  >
                    <el-option
                      v-for="item in responseLevel"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      style="padding-left:14px ;"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="响应时限:"
                  class="member"
                  required
                  prop="responseDuration"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataForm.responseDuration"
                    placeholder="响应时限(分钟)"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="一般事件处置时限:"
                  class="member overlong"
                  required
                  prop="generalEventDuration"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataForm.generalEventDuration"
                    placeholder="处置时限(分钟)"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="复杂事件处置时限:"
                  class="member"
                  required
                  prop="complexEventDuration"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    placeholder="复杂事件处置时限(分钟)"
                    v-model="dataForm.complexEventDuration"
                  ></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button
                    size="small"
                    type="primary"
                    style="padding: 6px 14px;margin-top: 20px;"
                    @click="grade('dataForm')"
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
              </el-form>
            </div>
          </el-tab-pane>

          <!--人员关联-->
          <el-tab-pane label="人员关联" name="second" :disabled="!dataForm.id">
            <div class="levelTop" style="float: right;">
              <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
            </div>
            <el-form
              label-width="150px"
              :rules="dataRules"
              :model="dataStaff"
              ref="ruleFormSecond"
            >
              <div style="display:inline-block">
                <el-form-item
                  label="服务对象:"
                  class="member"
                  prop="serviceName"
                  required
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataStaff.serviceName"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="联系电话:"
                  class="member"
                  prop="serviceContact"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataStaff.serviceContact"
                  ></el-input>
                </el-form-item>

                <el-form-item label="服务地址:" class="member">
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataStaff.serviceObjectAddress"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="牵头部门:"
                  class="member block"
                  required
                  prop="leadgroupName"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    @focus="handelVerify('lead')"
                    v-model="dataStaff.leadgroupName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="牵头部门联系人:" class="member">
                  <el-input
                    size="mini"
                    :disabled="true"
                    class="right-input"
                    v-model="dataStaff.leadContactor"
                  ></el-input>
                </el-form-item>

                <!-- <el-form-item
                  label="应哨部门:"
                  class="member"
                  prop="sentinelgroupName"
                  required
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataStaff.sentinelgroupName"
                    @focus="handelVerify('sentinelgroupName')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="应哨部门联系人:"
                  class="member"
                  required
                  prop="sentinelContactorName"
                >
                  <el-input
                    size="mini"
                    :disabled="true"
                    class="right-input"
                    v-model="dataStaff.sentinelContactorName"
                  ></el-input>
                </el-form-item> -->

                <el-form-item
                  label="应哨部门:"
                  class="member"
                  required
                  prop="sentinelgroupName"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    @focus="handelVerify('sentinelgroupName')"
                    v-model="dataStaff.sentinelgroupName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="应哨部门联系人:"
                  class="member"
                  required
                  prop="sentinelContactor"
                >
                  <el-input
                    size="mini"
                    :disabled="true"
                    class="right-input"
                    v-model="dataStaff.sentinelContactor"
                  ></el-input>
                </el-form-item>
              </div>

              <div style="display:inline-block">
                <el-form-item label="服务内容:" class="member">
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataStaff.serviceContent"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="核实部门:"
                  class="member"
                  required
                  prop="verify"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    @focus="handelVerify('verify')"
                    v-model="dataStaff.verify"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="核实联系人:"
                  class="member"
                  required
                  prop="verifyContactsShow"
                >
                  <el-input
                    size="mini"
                    :disabled="true"
                    class="right-input"
                    v-model="dataStaff.verifyContactsShow"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="处置部门:"
                  class="member block"
                  required
                  prop="disposegroupName"
                >
                  <el-input
                    size="mini"
                    @focus="handelOpenTaketh('disposegroupName')"
                    class="right-input"
                    v-model="dataStaff.disposegroupName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="处置部门联系人:"
                  class="member"
                  required
                  prop="disposeContactorName"
                >
                  <el-select
                    v-model="dataStaff.disposeContactorName"
                    size="mini"
                    width="50"
                    placeholder="请选择联系人"
                    @change="handelTaketheLinkman"
                  >
                    <el-option
                      v-for="item in disposegroupName"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                      style="padding-left:14px ;"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="审批部门:"
                  class="member"
                  required
                  prop="examineGroupName"
                >
                  <el-input
                    size="mini"
                    class="right-input"
                    v-model="dataStaff.examineGroupName"
                    @focus="handelOpenTaketh('examineGroupName')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="审批部门联系人:"
                  class="member"
                  required
                  prop="examineContactorName"
                >
                  <el-select
                    v-model="dataStaff.examineContactorName"
                    size="mini"
                    width="50"
                    placeholder="请选择联系人"
                    @change="handelTaketheLinkman"
                  >
                    <el-option
                      v-for="item in examineGroupName"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                      style="padding-left:14px ;"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
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
          </el-tab-pane>

          <!--处置参考-->
          <el-tab-pane label="处置参考" name="third" :disabled="!dataForm.id">
            <div class="levelTop" style="float: right;">
              <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
            </div>
            <div style="margin: 0 auto;width: 420px;clear: both;">
              <el-form label-width="150px">
                <el-form-item
                  label="处置参考:"
                  class="member"
                  style="resize:none"
                >
                  <el-input
                    type="textarea"
                    class="right-input"
                    :rows="6"
                    v-model="disposalReference"
                    maxlength="1000"
                  ></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button
                    size="small"
                    type="primary"
                    style="padding: 6px 14px;margin-top: 20px;"
                    @click="grade"
                    >保存</el-button
                  >
                  <el-button
                    size="small"
                    type="info"
                    style="padding: 6px 14px;margin-top: 20px;"
                    @click="cancel"
                    >取消</el-button
                  >
                </div>
                <div class="submit-btn"></div>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!--添加参数-->
    <el-dialog
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
    </el-dialog>
    <!--弹窗组件-->
    <GroupSelect
      v-if="showCommonSet"
      ref="commonSet"
      @onSubmit="handleOnSubmit"
    ></GroupSelect>
    <!-- @ -->
    <Linkman
      ref="commonLink"
      v-show="showcommonLink"
      @OnchildByValue="handelLinkdata"
    ></Linkman>
  </div>
</template>

<script>
import bus from "@/utils/bus";
import GroupSelect from "@/views/common/groupselect";
import Linkman from "@/views/common/Linkman";
import { getRules } from "@/utils/rules";
export default {
  name: "from4",
  components: {
    GroupSelect,
    Linkman
  },
  data() {
    return {
      props: {
        expandTrigger: "hover",
        value: "id",
        label: "name"
      },
      dataRules: [], // 表单验证代码
      libgc: "", // 被点击 的 li 的样式
      taket: [], // 牵头部门/联系人选择器数据
      sentinelgroupName: [], // 应哨部门/联系人
      examineGroupName: [], // 审批部门/联系人
      disposegroupName: [], // 处置部门/联系人
      levelList: [], //等级列表
      showcommonLink: false, // 获取多人联系人弹窗
      showCommonSet: false, // 选择控制弹窗组件
      responseLevel: [
        //响应等级
      ],
      serviceObject: [
        //服务对象
        { id: 1, name: "老人" },
        { id: 2, name: "年青人" },
        { id: 3, name: "儿童" },
        { id: 4, name: "妇女" },
        { id: 5, name: "区域" }
      ],
      // 警情响应
      dataForm: {
        planId: "", //预案id
        id: "",
        responseLevel: "", // 响应等级
        responseName: "", // 响应等级名称
        responseDuration: "", //响应时长
        generalEventDuration: "", //一般事件响应时长
        complexEventDuration: "" //复杂事件响应时长
      },
      // 人员关联
      dataStaff: {
        policeResponseId: "", // 警情响应id
        serviceName: "", // 联系人
        serviceContact: "", // 联系电话
        serviceObjectAddress: "", // 地址
        serviceContent: "", // 服务内容

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
        disposeGroupId: "", // 处置部门id
        disposeContactorName: "", // 处置部门联系人
        disposeContactorId: "", // 处置部门联系人id

        verify: "", // 核实部门名称页面显示
        verifyDeptId: [], // 核实部门名称id
        rpVerifyContactorList: [], // 核实部门联系人
        verifyContactsShow: "" // 核实部门联系人页面显示
      },
      addParameter: false, //添加响应参数设置
      bgclass: false, //步骤背景切换
      activeName: "first", //选项卡切换
      active: false, // 添加等级窗口的显示与隐藏
      //preplanId: null,
      // versionId: null,
      name: "", //等级信息名称
      disposalReference: "", // 处置参考数据
      emtlevelData: [], //事件等级数组
      levels: [], //新增级别数组
      emtlevelID: "", // 事件等级ID
      type: 0, //响应类型
      deleteLevelID: "", //删除ID
      levelId: "", // 全局警情响应id
      levelIds: "",
      items: [], //流程步骤新增数组
      processname: "", //流程名称
      content: "", //流程内容
      addtasks: [], //新增任务内容数组
      taskname: "", //任务名称
      taskcontent: "", //任务内容
      taskId: "", //任务ID
      taskIds: "",
      task: false, //任务内容显示与隐藏
      show: false,
      processId: "", //新增流程内容ID
      processIds: "",
      dynamicTags: [],
      dynamicTag: [],
      parameterData: [], //参数数据
      parameterSettingdata: [],
      tableData: [], //参数表格数据
      relation: "", //判断表达式
      userCreate: 1,
      responsetype: 0,
      urlname: "",
      taketandshould: "", //   分辨应哨与牵头事件
      cancelEvent: "", // 取消事件全局事件
      levelIdDelet: "" // 删除警情响应等级的 id
    };
  },
  created() {
    this.getLevels();
    this.getParams();
    this.pcode();
    this.eventLevel();
    this.dataRules = getRules();
  },
  mounted() {
    this.libgc = "";
    // 获取响应等级数据
    this.handelHTTPresponseLevelList();
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
    }
  },
  watch: {
    activeForm(curVal, oldVal) {
      // console.log("watch,监听了");
      // 默认显示第一项
      this.Levelclick("item", 0);
    },
    f1(curVal, oldVal) {
      this.levelList = curVal;
    },
    // staffList(curVal, oldVal) {
    //   // this.dataStaff = curVal;
    // },
    // referenceList(curVal, oldVal) {
    //   console.log(oldVal);
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
    }
  },
  methods: {
    // handelHTTPServiceObject() {
    //   this.$http({
    //     url: this.$http.adornUrl(
    //       `/rp/rpServiceObject/selectServiceObjectList/${this.dataForm.id}`
    //     ),
    //     method: "get"
    //   }).then(({ data }) => {
    //   });
    // },
    handelHTTPresponseLevelList() {
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictionary/responseLevelList`),
        method: "get"
      }).then(({ data }) => {
         if (data && data.code === 0) {
           this.responseLevel = data.data.filter((item, index) => {
             return {
               id: item.id,
               name: item.name
             };
           });
          }else{
            this.$message.error(data.msg)
          }
      });
    },
    // 取消按钮逻辑
    cancel() {
      switch (this.cancelEvent) {
        // 新增取消
        case "addCancel":
          // 点击取消按钮 清除之前输入的所有数据
          for (let prop in this.dataForm) {
            this.dataForm[prop] = "";
          }
          for (let prop in this.dataStaff) {
            this.dataStaff[prop] = "";
          }
          this.disposalReference = "";
          this.active = false;
          this.$emit("savePolicResponse", {
            dataForm: this.dataForm,
            dataStaff: this.dataStaff,
            disposalReference: this.disposalReference
          });
          break;
        // 编辑取消
        case "compileCancel":
          this.active = false;
          break;
      }

      // 2种情况
      // 1  ----  新增等级时点击取消 : 直接情况 dataform dataStaff 处置人 关联的数据  cancel = addCancel
      // 2  ----  点击列表 编辑修改等级信息时 : 点击取消保留原来数据 不修改            cancel = compileCancel
      // 初步实现逻辑 点击新增等级按钮 改变data中某个属性,通过这个值来判断是哪个事件触发的
    },
    // 核实部门
    handelVerify(name) {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择",
        name
      );
    },
    // 核实部门返回数据
    handelLinkdata({ linkman, name }) {
      let str = name;

      switch (str) {
        case "verify":
          this.handelmulti(
            linkman,
            "verify",
            "verifyDeptId",
            "verifyContactsShow",
            "rpVerifyContactorList",
            1
          );
          break;
        case "lead":
          this.handelmulti(
            linkman,
            "leadgroupName",
            "leadGroupId",
            "leadContactor",
            "rpLeadContactorList",
            2
          );
          break;
        case "sentinelgroupName":
          this.handelmulti(
            linkman,
            "sentinelgroupName",
            "sentinelGroupId",
            "sentinelContactor",
            "rpSentinelContactorList",
            3
          );
          break;
      }
    },
    // 多个部门选择 参数获取
    // depName 部门名称显示页面   depId 多个部门id
    // contactsName 联系人名称显示页面   contactsId 多个联系人id
    handelmulti(linkman, depName, depId, contactsName, contactsId,id) {
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
          responseId: this.dataStaff.policeResponseId || this.dataForm.id
        };
        // 部门id
        obj[depId] = item.verifyDeptId;
        // 联系人id  等后端对应
        obj.verifyContactorId = item.id;
        obj.personnelFlag = id
        return {
          ...obj
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
    },
    // 部门选择
    handelOpenTaketh(name) {
      switch (name) {
        case "disposegroupName":
          this.handelSelect(name);
          break;
        case "examineGroupName":
          this.handelSelect(name);
          break;
      }
    },
    // 选择部门触发
    handelSelect(sec) {
      this.taketandshould = sec;
      this.showCommonSet = true;
      this.urlname = `/mail/mailgroup/list`;
      this.$nextTick(() => {
        this.$refs.commonSet.init(`/mail/mailgroup/list`, "请选择牵头部门");
      });
    },
    // 选择部门后
    handleOnSubmit(obj) {
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/list"),
        method: "post",
        params: this.$http.adornParams({ groupId: obj.id })
      }).then(({ data }) => {
        switch (this.taketandshould) {
          case "disposegroupName":
            this.handlelater(
              "disposeGroupId",
              "disposegroupName",
              "disposegroupName",
              obj,
              data
            );
            break;
          case "examineGroupName":
            this.handlelater(
              "examineGroupId",
              "examineGroupName",
              "examineGroupName",
              obj,
              data
            );
            break;
        }
      });
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
          name: item.name
        };
      });
    },
    handelOpenshould() {
      this.showCommonSet = true;
      this.urlname = `/mail/mailgroup/list`;
      this.$nextTick(() => {
        this.$refs.commonSet.init(`/mail/mailgroup/list`, "请选择应哨部门");
      });
    },
    // 选择牵头部门联系人后返回响应  应哨联系人
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
        item => item.value == this.dataStaff[ContactNameID]
      )[0];
      if (rp.name) {
        this.dataStaff[ContactName] = rp.name;
      }
    },
    responseclears() {
      this.addParameter = true;
      //				if(this.responsetype==1){
      setTimeout(() => {
        this.$refs.responsechild.responseclear();
      }, 1000);
      //				}
    },
    parameterSetting(data) {
      this.parameterSettingdata = data;
      this.addParameter = false;
    },
    /* 等级信息*/

    //新增新级别数组
    addlevel() {
      // 清空 dataForm 与 dataStaff 数据
      for (let prop in this.dataForm) {
        this.dataForm[prop] = "";
      }
      for (let prop in this.dataStaff) {
        this.dataStaff[prop] = "";
      }
      this.disposalReference = "";
      const planId = sessionStorage.getItem("planId");
      if (planId === "" || planId == null) {
        this.$message({
          message: "请先保存预案信息！",
          type: "warning"
        });
        return;
      }
      this.cancelEvent = "addCancel";
      this.dataForm.planId = planId;
      this.activeName = "first";
      this.active = true;
      this.libgc = "";
    },
    //删除预案响应等级级别
    deleteLevel() {
      if (this.levelIdDelet == "") {
        this.$message({
          message: "请选中级别再删除！",
          type: "warning"
        });
        return;
      }
      this.$confirm("是否删除预案?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          let data = {
            id: this.levelIdDelet
          };
          this.$http({
            url: this.$http.adornUrl(
              `/rp/policeResponse/delete/${this.levelIdDelet}`
            ),
            method: "get"
          }).then(result => {
             if (result && result.code === 0) {
               this.$store.commit("user/updataDelete", data);
               this.active = false;
               this.levelIdDelet = "";
            }else{
              this.$message.error(result.msg)
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除."
          });
          this.libgc = "";
          this.active = false;
          this.levelIdDelet = "";
        });
    },
    Leveldefault() {
      //默认加载第一条数据
      if (this.levelId == "") {
        this.levelId = this.levelIds;
      }
      let data = {
        id: this.levelId
      };
    },
    // 点击级别获取预案响应等级信息
    Levelclick(item, index) {
      this.active = true;
      this.cancelEvent = "compileCancel"; // 判断取消事件是谁触发的
      this.libgc = index; // 把当前index 赋值到data中
      this.activeName = "first";
      // 获取vuex中的数据 赋值到data中
      this.dataForm = { ...this.$store.state.user.levelList[index] };
      // 把响应 id 设置给全局属性
      this.levelIdDelet = this.$store.state.user.levelList[index].id;
      this.dataStaff = { ...this.$store.state.user.staffList[index] };
      if (this.$store.state.user.referenceList[index]) {
        this.disposalReference = this.$store.state.user.referenceList[index][
          "disposalReference"
        ];
      } else {
        this.disposalReference = "";
      }
    },
    //选择响应等级返回值
    change_responseLevel(responseLevelId) {
      this.dataForm.responseLevel = responseLevelId;
      const rp = this.responseLevel.filter(
        item => item.id == responseLevelId
      )[0];
      this.dataForm.responseName = rp.name;
    },
    //选择服务对象返回值
    change_emtlevel(serviceObjectID) {
      this.dataForm.serviceObjectId = serviceObjectID;
      const serve = this.serviceObject.filter(
        item => item.id === this.dataForm.serviceObjectId
      )[0];
      this.dataForm.serviceObjectName = serve.name;
    },
    //获取预案响应等级
    getLevels() {
      let condition = localStorage.getItem("AddpreplanId"); //从本地存储获取预案ID和预案版本ID
      // this.versionId = JSON.parse(condition).versionId //获取预案版本ID
      //this.preplanId = JSON.parse(condition).preplanId //获取预案ID
      let data = {
        //  versionId: this.versionId,
        type: this.type
      };
    },
    //响应信号获取
    pcode() {
      let data = {
        pcode: "level_signal"
      };
    },
    eventLevel() {
      //获取事件等级
      let data = {
        pcode: "emtlevel"
      };
    },
    //响应参数获取
    getParams() {
      let condition = localStorage.getItem("AddpreplanId"); //从本地存储获取预案ID和预案版本ID

      let data = {};
    },
    // 事件添加流程
    grade(formName) {
      switch (this.activeName) {
        case "first":
          this.$refs[formName].validate(valid => {
            if (valid) {
              let responseLevelID = this.$store.state.user.levelList.map(
                item => item.responseLevel
              );
              // 立 flag 判断响应等级是否唯一
              let flag = true;
              for (var i = 0; i <= responseLevelID.length; i++) {
                if (responseLevelID[i] == this.dataForm.responseLevel) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                this.handelHTTPalert();
                this.activeName = "second";
              } else {
                this.$message({
                  message: "警告，响应等级不能重复",
                  type: "warning"
                });
              }
            } else {
              return false;
            }
          });
          break;
        case "second":
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.handelHTTPstaff();
              this.activeName = "third";
            } else {
              return false;
            }
          });
          break;
        case "third":
          this.handelHTTPdisposal();
          this.$confirm("是否保存预案?", "提示", {
            confirmButtonText: "保存",
            cancelButtonText: "继续修改",
            type: "warning"
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              // 保存成功则跳转到预案管理页面
              this.$router.push({
                path: "/sys-reserveplan/reserveplan",
                name: "sys-reserveplan/reserveplan"
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "继续修改."
                // 取消保存则关闭弹窗
              });
              this.active = false;
            });
          break;
      }
    },
    // 警情响应数据保存
    handelHTTPalert() {
      // 响应警情有两中事件,修改和添加 通过判断vuex中是否有当前项目执行添加或者修改功能
      // 修改警情响应应该是根据

      switch (this.cancelEvent) {
        case "compileCancel":
          let obj = {
            ...this.dataForm
          };
          let id = {
            id: this.levelId
          };
          Object.assign(obj, id);
          this.$http({
            url: this.$http.adornUrl(`/rp/policeResponse/update`),
            method: "post",
            data: this.$http.adornData(obj)
          }).then(({ data }) => {
             if (data && data.code === 0) {
              
            }else{
              this.$message.error(data.msg)
            }
          });
          this.$emit("savePolicResponse", { obj, name: "dataForm" });
          break;
        case "addCancel":
          // 添加逻辑  返回一个 响应等级id
          this.$http({
            // /rp/policeResponse/save 添加响应请求数据,并返回响应等级id
            url: this.$http.adornUrl("/rp/policeResponse/save"),
            method: "post",
            data: this.$http.adornData({
              ...this.dataForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
               this.dataForm.id = data.responseId;
              this.dataStaff.policeResponseId = data.responseId; // 在dataStaff中保存 响应id
              this.levelId = data.responseId;
              let obj = {
                ...this.dataForm
              };
              Object.assign(obj);
              this.$emit("savePolicResponse", { obj, name: "dataForm" });
            }else{
              this.$message.error(data.msg)
            }
          });
          break;
      }
    },
    // 人员关联数据保存
    handelHTTPstaff() {
      let dataStaff = {
        planId: this.dataForm.planId, // 预案id
        policeResponseId: this.dataStaff.policeResponseId || this.dataForm.id, // 警情响应id
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
        rpVerifyContactorList: this.dataStaff.rpVerifyContactorList // 核实部门联系人
      };
      switch (this.cancelEvent) {
        case "compileCancel":
          let obj = {
            ...this.dataStaff
          };
          this.$http({
            url: this.$http.adornUrl(`/rp/personnelAssociated/update`),
            method: "post",
            data: this.$http.adornData(dataStaff)
          }).then(({ data }) => {
            this.$emit("savePolicResponse", { obj, name: "dataStaff" });
          });
          break;
        case "addCancel":
          this.$http({
            url: this.$http.adornUrl("/rp/personnelAssociated/saveBatch"),
            method: "post",
            data: this.$http.adornData(dataStaff)
          }).then(result => {
            let obj = {
              ...this.dataStaff
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
        policeResponseId: this.dataForm.id,
        disposalReference: this.disposalReference
      };
      switch (this.cancelEvent) {
        case "compileCancel":
          this.$http({
            url: this.$http.adornUrl("/rp/disposalReference/update"),
            method: "post",
            data: this.$http.adornData(obj)
          }).then(({ data }) => {
            this.$emit("savePolicResponse", { obj, name: "Reference" });
            return;
          });
          break;
        case "addCancel":
          this.$http({
            url: this.$http.adornUrl("/rp/disposalReference/save"),
            method: "post",
            data: this.$http.adornData(obj)
          }).then(({ data }) => {
            this.$emit("savePolicResponse", { obj, name: "Reference" });
            return;
          });
          break;
      }
    },

    defaultprocess() {
      if (!this.processId) {
        this.processId = this.processIds;
      }
      let data = {
        processId: this.processId
      };
    },
    //点击流程步骤
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
    //获取预案响应等级流程列表
    // getLevelProcessList() {
    //   if (this.levelId) {
    //     let data = {
    //       levelId: this.levelId
    //     };
    //   }
    // },
    //删除流程
    deleteLevelProcess() {
      if (this.processId == "") {
        this.$message({
          message: "请选中流程再删除！",
          type: "warning"
        });
        return;
      }

      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: this.processId
          };
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //新增任务内容
    addtask() {
      if (this.processId == "") {
        this.$message({
          message: "请保存流程再新增任务！",
          type: "warning"
        });
        return;
      }
      this.task = true;
      this.taskname = "";
      this.taskcontent = "";
      this.taskId = "";
      this.dynamicTags = [];
    },

    //保存任务
    taskbtn() {
      if (!this.taskname || !this.taskcontent || this.dynamicTags.length == 0) {
        this.$message({
          message: "名称、内容、人员必填！",
          type: "warning"
        });
        return;
      }

      let arrays = [];
      this.dynamicTags.forEach(function(data) {
        arrays.push(data.id);
      });
      if (this.taskId) {
        let test = {
          taskId: this.taskId,
          name: this.taskname,
          content: this.taskcontent,
          positions: arrays
        };
        let data = {
          data: test
        };
      } else {
        let test = {
          processId: this.processId,
          name: this.taskname,
          content: this.taskcontent,
          positions: arrays
        };
        let data = {
          data: test
        };
      }
    },
    //获取流程任务列表
    getLevelProcessTaskList() {
      if (this.processId) {
        let data = {
          processId: this.processId
        };
      }
    },
    getLevelProcessTask(id) {
      //点击获取流程任务详细信息
      this.taskId = id;
      this.getLevelProcessTaskDetails();
    },

    getLevelProcessTaskDetails() {
      if (!this.taskId) {
        this.taskId = this.taskIds;
      }
      let data = {
        taskId: this.taskId
      };
    },
    //删除任务流程
    deleteLevelProcessTask() {
      if (this.taskId == "") {
        this.$message({
          message: "请选中任务再删除！",
          type: "warning"
        });
        return;
      }

      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: this.taskId
          };
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

#center h1 {
  text-align: center;
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

.middle li {
  text-align: center;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
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
  margin-top: 16px;
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

.member-input {
  width: 700px;
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
