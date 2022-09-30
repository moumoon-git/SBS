<!--
 * @Author: xuchuangxing
 * @Date: 2021-04-07 14:24:18
 * @LastEditTime: 2021-08-19 17:09:21
 * @LastEditors: Please set LastEditors
 * @Description: 新版值班点名
 * @FilePath: \xuchuangxing\SJSEOS\src\view\dutyManagement\RollCallOnDuty\rollCallOnDuty.vue
-->
<template>
  <div class="rollcallonduty">
    <div class="my-radio-box-main">
      <div style="width:92%;overflow: auto;white-space: nowrap;">
        <el-radio-group v-model="currentTemplateId" @change="changeDepartment">
          <el-radio-button
            v-for="(item, index) in templateList"
            :label="item.id"
            :key="index"
            >{{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <div style="display:inline-block" v-if="displayTemplate">
          <input
            type="text"
            v-model="templateTitle"
            style="background:#f0f0f0;border:1px solid #ccc;border-radius:2px;height:25px;outline: none;"
          />
          <el-button
            type="info"
            style="padding: 7px 10px;"
            @click="displayTemplate = false"
            >取消</el-button
          >
          <el-button
            :disabled="disabledAdd"
            type="primary"
            style="padding: 7px 10px;"
            @click="sureAddTemplate"
            >{{ isAdd ? "添加" : "确定" }}</el-button
          >
        </div>
      </div>
      <div
        style="
          position: absolute;
          right: 3%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          cursor: pointer;
        "
      >
        <!-- <el-tooltip
          class="item"
          effect="dark"
          content="点名通知"
          placement="top"
        >
          <span class="rollCall" @click="rollCallNoticeHandle"></span>
        </el-tooltip> -->
        <el-tooltip
          class="item"
          effect="dark"
          content="点名统计"
          placement="top"
        >
          <span class="statistics" @click="displayMonthData"></span>
        </el-tooltip>

        <el-dropdown trigger="click">
          <el-tooltip
            class="item"
            effect="dark"
            content="点名设置"
            placement="top"
          >
            <span class="template"></span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span class="addSetting" @click="addUnit">添加单位</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="addSetting" @click="isDelUnit = true">删除单位</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="addSetting" @click="addTemplate">添加模板</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="addSetting" @click="editTemplate">修改模板</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="addSetting" @click="delTemplate">删除模板</span>
            </el-dropdown-item>
            <!-- 产品说先隐藏，该段代码注释时间：20211109 -->
            <!-- <el-dropdown-item>
              <span class="addSetting" @click="selectNotifeObject"
                >通知对象设置</span
              >
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="rollCallDayStatistics" v-if="!isLookMonthData">
      <div class="unitDetail">
        <div class="date">
          <el-date-picker
            v-model="date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="changeDate"
          >
          </el-date-picker>
        </div>
        <template v-if="unitData.length > 0">
          <el-checkbox-group
            v-model="checkDepartList"
            style="height:660px;overflow:scroll"
          >
            <div
              v-for="(item, index) in unitData"
              class="oneUint"
              :key="item.id"
            >
              <el-checkbox
                :key="item.id"
                :label="item.id"
                class="unitTitle"
                v-if="isDelUnit"
              >
                {{ item.groupName }}</el-checkbox
              >
              <div class="unitTitle1">
                {{ item.groupName }}
              </div>

              <!-- <div class="statusGroup">
                <el-radio-group v-model="item.type">
                  <el-radio-button
                    class="unitStatus"
                    :style="getStatusStyle(item.type, one.id)"
                    v-for="(one, statusIndex) in unitStatus"
                    :label="one.id"
                    :key="statusIndex"
                    >{{ one.name }}
                  </el-radio-button>
                </el-radio-group>
              </div> -->
              <div
                class="remark"
                @click="
                  item.type = 0;
                  getRemark(item.type, index);
                "
                :style="{
                  'background-color': item.type == 0 ? '#0BD3FF' : ''
                }"
              >
                <div class="reason">正常</div>
              </div>
              <el-dropdown
                trigger="click"
                @command="remarkHandleCommand($event, index)"
              >
                <span class="el-dropdown-link">
                  <div
                    class="remark"
                    @click="
                      item.type = 1;
                      getRemark(item.type, index);
                    "
                    :style="{
                      'background-color': item.type == 1 ? '#FF9F7F' : ''
                    }"
                  >
                    <div class="reason">{{ item.leaveReason }}</div>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </div>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="v"
                    v-for="v in leaveReasonArr"
                    :key="v.id"
                    ><span class="addSetting">{{ v.name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div
                class="remark"
                @click="item.type = 2"
                :style="{
                  'background-color': item.type == 2 ? '#FB7293' : ''
                }"
              >
                <div class="reason">离岗</div>
              </div>

              <div class="remark test">
                <input class="reason" type="text" v-model="item.remark" />
              </div>
            </div>
          </el-checkbox-group>
          <div style="position:relative;">
            <div style="position:absolute;right:0;top:-4px" v-if="!isDelUnit">
              <div v-if="!isEditRollCall">
                <el-button type="primary" @click="editRollCall">修改</el-button>
              </div>
              <div v-else>
                <el-button type="primary" @click="closeEditRollCall"
                  >取消</el-button
                >
                <el-button type="primary" @click="rollCallComplete"
                  >完成点名</el-button
                >
              </div>
            </div>
            <div style="position:absolute;right:0;top:-4px" v-else>
              <el-button type="info" @click="isDelUnit = false">取消</el-button>
              <el-button type="primary" @click="delUnitHandle">确定</el-button>
            </div>
          </div>
        </template>
        <div class="NoUnitDetail" v-else>
          暂无单位队列
        </div>
      </div>

      <div class="rollCallNews">
        <div class="rollCallTitle">
          点名动态
        </div>

        <div
          class="dynamicDetails"
          v-if="statusStatistics || notificationStatistics.length > 0"
        >
          <template v-if="notificationStatistics.length > 0">
            <div
              class="statusStatistics"
              v-for="(item, index) in notificationStatistics"
              :key="index"
            >
              <div>{{ item.date }}</div>
              <div>{{ rollCallNewsTitle }}</div>
              <div>
                已通知：{{ item.notice }}; 已回复：{{ item.replies }};
                未回复：{{ item.unreplies }}
              </div>
              <div style="text-align:center">
                <el-button
                  type="primary"
                  class="viewReply"
                  @click="viewReplyHandle(item.id)"
                  >查看</el-button
                >
              </div>
            </div>
          </template>
          <div class="statusStatistics" v-if="statusStatistics">
            <div>{{ statusStatistics.date }}</div>
            <div>{{ rollCallNewsTitle }}</div>
            <div>
              在岗：{{ statusStatistics.normal }}; 请假：{{
                statusStatistics.leave
              }}; 离岗：{{ statusStatistics.demobilize }};
            </div>
          </div>
        </div>
        <div class="NoRollCallNews" v-else>
          暂无点名动态
        </div>
      </div>
    </div>

    <!-- 月统计单位数据 -->
    <roll-call-month-statistics
      ref="rollCallMonthStatistics"
      :date="date"
      v-else
    />

    <!-- 点名动态-查看通知回复 -->
    <el-dialog title="查看回复" :visible.sync="viewReplyVisible" center>
      <el-table :data="viewReplyData">
        <el-table-column
          :property="item.prop"
          :label="item.label"
          align="center"
          v-for="item in viewReplyColumn"
          :key="item.prop"
        >
        </el-table-column>
        <el-table-column label="确认情况" align="center">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.type ? '#FB7293' : '#333' }">{{
              scope.row.status
                ? scope.row.type
                  ? "异常报备"
                  : "准时参加"
                : "未回复"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="备注" align="center">
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="replySizeChange"
        @current-change="replyCurrentChange"
        :current-page.sync="replyPage"
        :page-size="replySize"
        layout="prev, pager, next, jumper"
        :total="replyTotal"
        style="text-align:center"
      >
      </el-pagination>
    </el-dialog>

    <!-- 添加单位弹窗 -->
    <add-unit-dialog
      v-if="addUnitVisible"
      @closeUnitDialog="closeUnitDialog"
      @confirmUnit="confirmUnit"
      ref="unitDialog"
      :unitDialogTitle="unitDialogTitle"
      :unitData="unitData"
    />

    <!-- 点名通知 -->
    <!-- <roll-call-notice
      v-if="rollCallNoticeVisible"
      @noticeHandleClose="noticeHandleClose"
      @confirmNotice="confirmNotice"
      :unitData.sync="unitData"
      :selectTemplate="selectTemplate"
      :date="date"
      ref="rollCallNoticeDialog"
    /> -->

    <!-- 通知对象设置 -->

    <notife-object
      v-if="notifeObjectVisible"
      ref="notifeObject"
      :unitData.sync="unitData"
      @handleClose="notifeObjectClose"
      @udpateNotifeObject="udpateNotifeObject"
    />
  </div>
</template>

<script>
import addUnitDialog from "./addUnit"; // 添加单位弹窗
import rollCallMonthStatistics from "./rollCallMonthStatistics"; // 月统计单位数据
// import rollCallNotice from "./rollCallNotice"; // 点名通知
import bus from "@/components/common/js/eventBus";
import notifeObject from "@/components/notifeObject"; // 选择通知对象弹窗
import axios from '@/assets/api/api' // 倒入 api
export default {
  name: "rollcallonduty",
  components: {
    addUnitDialog,
    rollCallMonthStatistics,
    // rollCallNotice,
    notifeObject
  },
  data() {
    return {
      templateList: [], //模板列表
      currentTemplateId: 0, // 当前选中模板Id
      selectTemplate: "", // 当前选中模板信息
      isAdd: false, // 判断显示的按钮是 确定还是新增
      displayTemplate: false, //是否显示添加模板
      templateTitle: "", // 输入的模板标题
      date: "", //日期
      viewReplyData: [],
      dialogTableVisible: false,
      notificationStatistics: [], // 点名动态 通知统计数据
      statusStatistics: null, // 点名动态 状态统计数据
      addUnitVisible: false, // 添加单位弹窗
      unitStatus: [
        { id: 0, name: "正常" },
        { id: 1, name: "请假" },
        { id: 2, name: "离岗" }
      ], // 单位状态
      unitData: [], // 单位数据
      isLookMonthData: false, //是否显示月单位数据
      pickerOptions: {
        disabledDate(time) {
          let _now = Date.now();
          return time.getTime() > _now; //大于当前的禁止
        }
      },
      rollCallNoticeVisible: false, // 是否显示点名通知
      viewReplyVisible: false, // 是否显示点名动态-通知回复
      viewReplyColumn: [
        { prop: "dept", label: "单位" },
        { prop: "contact", label: "姓名" }
      ],
      replyPage: 1,
      replySize: 5,
      rollCallNewsTitle: "", //点名动态标题
      groupIds: "", //所有单位组Id
      replyPage: 1, // 回复页码
      replySize: 10, //回复尺寸
      replyTotal: 0, //回复总条数
      isAddTemplate: false, // 判断当前操作是否是新增新增模板，是的话显示对应的模板
      checkDepartList: [], // 勾选的单位集合
      isDelUnit: false, // 是否显示删除页面 默认不显示
      notifeObjectVisible: false, // 是否显示通知对象弹窗
      isEditRollCall: false, // 是否修改点名单位状态
      leaveReasonArr: [
        { name: "设备故障", id: 1 },
        { name: "会议室占用", id: 2 },
        { name: "其他", id: 3 }
      ], // 是否修改点名单位状态
      disabledAdd: false // 避免重复保存模板
    };
  },
  async mounted() {
    this.date = new Date().formatDate("yyyy-MM-dd"); // 默认选中当天日期
    await this.getTemplate(); //获取所有模板
    this.getMiddleData();

    bus.$on("getNotificationData", data => {
      this.selectTemplate = data;
      this.currentTemplateId = data.id;
      this.unitPage = 1;
      this.getMiddleData(); // 获取单位和点名动态数据
    });
  },
  computed: {
    /**
     * @description: 返回单位选中状态背景色
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    getStatusStyle() {
      return function(type, id) {
        let styleArr = ["0BD3FF", "FF9F7F", "FB7293"];
        if (type === id) {
          return `background-color: #${styleArr[type]};`;
        }

        return `background-color: white`;
      };
    }
  },
  methods: {
    /**
     * @description: 获取单位和点名动态数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    async getMiddleData() {
      await this.getDpartment(); //获取所有单位分页
      await this.getNotificationData(); //获取点名动态通知数据
      this.getStatusStatistics(); //获取点名动态状态数据
    },
    /**
     * @description: 改变月份获取单位和点名动态数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    changeDate() {
      this.getMiddleData();
    },
    /**
     * @description: 模板切换加载对应的部门数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    changeDepartment(val) {
      this.templateTitle = ""; // 清空输入框内容
      this.displayTemplate = false; // 隐藏输入框
      // 如果显示了月的数据 显示回日的
      if (this.isLookMonthData) {
        this.isLookMonthData = false;
      }
      // console.log("val: ", val);
      let selectTemplate = this.templateList.find(
        item => item.id == this.currentTemplateId
      );
      this.selectTemplate = selectTemplate;
      this.rollCallNewsTitle = selectTemplate.name + "点名"; // 获取模板名给点名动态用
      //   console.log("this.rollCallNewsTitle: ", this.rollCallNewsTitle);
      this.getMiddleData(); //获取单位和点名动态数据
    },
    /**
     * @description: 获取所有模板
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    async getTemplate() {
      let templateList = await this.$api.getTemplate();
      if (templateList.errorcode != 0) {
        this.$message({
          message: res.msg,
          type: "error"
        });
        return;
      }
      if (templateList.data && templateList.data.length > 0) {
        this.templateList = templateList.data;

        // 判断是否新增模板 是的话默认选中新增的模板
        if (this.isAddTemplate) {
          this.currentTemplateId =
            templateList.data[templateList.data.length - 1].id;
          this.selectTemplate = templateList.data[templateList.data.length - 1];
          this.rollCallNewsTitle =
            templateList.data[templateList.data.length - 1].name;
        } else {
          //   判断默认选中第一个模板还是保持不变
          this.currentTemplateId = this.currentTemplateId
            ? this.currentTemplateId
            : templateList.data[0].id; // 默认选中
          this.selectTemplate = this.selectTemplate
            ? templateList.data.find(v => v.code == this.selectTemplate.code) // 重新获取选择最新的模板数据
            : templateList.data[0];

          this.rollCallNewsTitle = this.rollCallNewsTitle
            ? this.rollCallNewsTitle
            : templateList.data[0].name + "点名"; // 获取模板名给点名动态用
        }
        this.isAddTemplate = false; // 避免其他操作也显示到最后一个模板

        // console.log("this.rollCallNewsTitle: ", this.rollCallNewsTitle);
      } else {
        this.templateList = [];
      }

      //
    },
    /**
     * @description: 获取模板下的单位分页数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    async getDpartment() {
      let unitList = await this.getDpartmentApi();
      console.log("unitList: ", unitList);
      if (unitList.data) {
        this.unitData = unitList.data;
        this.unitData.map(v => {
          v.remark = v.remark ? v.remark : "备注：";
          v.leaveReason = v.leaveType
            ? "请假：" + this.leaveReasonArr[v.leaveType - 1].name
            : "请假";
        });

        this.groupIds = this.unitData.map(v => {
          return v.groupId;
        }); // 获取所有单位Id
      } else {
        this.unitData = [];
      }
    },
    /**
     * @description: 获取模板下的单位接口
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    async getDpartmentApi() {
      let unitListData = {
        code: this.selectTemplate.code
          ? this.selectTemplate.code
          : this.templateList[0].code,
        date: this.date,
        module: "rollCallOnDuty"
      };
      let unitList = await this.$api.departmentListBy(unitListData);
      console.log("unitList: ", unitList);
      return unitList;
    },
    /**
     * @description: 显示添加模板
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    addTemplate() {
      this.displayTemplate = true; // 显示输入框
      this.isAdd = true; // 将按钮文字改成 新增
    },
    /**
     * @description: 显示编辑模板
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    editTemplate() {
      if (!this.selectTemplate) {
        this.$message.warning("请选择模板");
        return;
      }
      this.templateTitle = this.selectTemplate.name; // 将模板名作为输入框的内容
      this.displayTemplate = true; // 显示输入框
      this.isAdd = false; // 将按钮文字改成 确定
    },
    /**
     * @description: 确定添加模板
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    async sureAddTemplate() {
      this.disabledAdd = true;
      if (!this.templateTitle) {
        this.disabledAdd = false;
        this.$message.warning("请输入模板名");
        return;
      }
      if (this.isAdd) {
        this.isAddTemplate = true;
      }
      this.isLookMonthData = false;
      let name = this.templateList.find(v => v.name == this.templateTitle);
      if (name) {
        this.disabledAdd = false;
        this.$message.warning("请勿输入已存在模板名");
        return;
      }

      let data = {
        id: this.isAdd ? undefined : this.currentTemplateId,
        name: this.templateTitle
      };
      let res = await this.$api.templateSaveOrUpdate(data);
      if (res.errorcode != 0) {
        this.$message({
          message: res.msg,
          type: "error"
        });
        return;
      }
      this.disabledAdd = false;
      this.templateTitle = ""; //清空模板输入框
      this.displayTemplate = false; // 关闭模板输入框
      await this.getTemplate(); // 重新刷新模板列表
      await this.getMiddleData();
    },
    /**
     * @description: 删除模板
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/7
     * @param {*}
     * @return {*}
     */
    async delTemplate() {
      if (!this.selectTemplate) {
        this.$message.warning("请选择模板");
        return;
      }
      this.$confirm(`您是否确定要删除"${this.selectTemplate.name}"这项内容`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .templateDelete({ id: this.currentTemplateId })
            .then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.currentTemplateId = "";
              this.selectTemplate = "";
              this.getTemplate(); // 重新刷新列表
            })
            .then(() => {
              this.getDpartment(); // 重新刷新单位列表
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @description: 打开添加单位弹窗
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/8
     * @param {*}
     * @return {*}
     */
    async addUnit() {
      if (this.date != new Date().formatDate("yyyy-MM-dd")) {
        this.$message.warning("历史数据不能新增");
        return;
      }
      if (!this.selectTemplate) {
        this.$message.warning("请选择模板");
        return;
      }

      this.unitDialogTitle = "选择单位";
      this.addUnitVisible = true;
      this.$nextTick(() => {
        let data = {};
        // this.$api.phoneGroupList(data).then(res => {
        //   if (res.errorcode == "0") {
        //     this.$refs.unitDialog.getUnitTreeData(res.data);
        //   }
        // });
        axios({ //获取最新一条事件的总体情况
          url: window.SITE_CONFIG['baseUrl'] + '/mail/mailgroup/list',
          method: 'get',
          params:data,
        }).then(res => {
          console.log('/mail/mailgroup/list', res);
          if (res.errorcode == "0") {
            this.$refs.unitDialog.getUnitTreeData(res.data);
          }
        });
      });
    },
    /**
     * @description: 删除单位
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/23
     * @param {*}
     * @return {*}
     */
    async delUnitHandle() {
      if (this.checkDepartList.length == 0) {
        this.$message.warning("请选择单位进行删除");
        return;
      }
      let data = {
        ids: this.checkDepartList
      };
      this.$confirm("此操作将永久删除该单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.deleteDepartments(data).then(res => {
            if (res.errorcode != "0") {
              this.$message.error(res.msg);
              return;
            }
            this.$message.success("删除成功");
            this.checkDepartList = [];
            this.getDpartment();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @description: 关闭添加单位弹窗
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/8
     * @param {*}
     * @return {*}
     */
    closeUnitDialog() {
      this.addUnitVisible = false;
    },
    /**
     * @description: 确定添加单位的数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/8
     * @param {*}
     * @return {*}
     */
    confirmUnit(data) {
      let unitSaveData = [];
      //   console.log("selectTemplate: ", selectTemplate);
      //   初始化所有要添加的单位数据
      //   console.log("this.date: ", this.date);

      data.map(v => {
        let departmentData = {
          code: this.selectTemplate.code,
          date: this.date,
          groupId: v,
          type: "",
          remrke: []
        };
        unitSaveData.push(departmentData);
      });
      //   console.log("unitSaveData: ", unitSaveData);
      this.$api
        .saveOrUpdateDepartment({
          data: unitSaveData,
          module: "rollCallOnDuty"
        })
        .then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.getDpartment(); // 重新刷新列表
        });
    },
    /**
     * @description: 编辑点名
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     */
    async editRollCall() {
      this.isEditRollCall = true;
    },
    /**
     * @description: 取消编辑点名
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     */
    async closeEditRollCall() {
      this.isEditRollCall = false;
      this.getDpartment(); // 重新刷新列表
    },
    /**
     * @description: 完成点名执行逻辑
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/8
     * @param {*}
     * @return {*}
     */
    async rollCallComplete() {
      //   console.log("this.statusStatistics: ", this.statusStatistics);

      //   console.log("unitSaveData: ", unitSaveData);
      let updateUnitData = [];
      updateUnitData = this.unitData.map(item => {
        item.remark == "备注";
        if (item.remark == "备注") {
          item.remark = "";
        }
        return {
          id: item.id,
          type: item.type,
          remark: item.remark,
          leaveType: item.leaveType
        };
      });
      let data = {
        data: updateUnitData,
        isAdd: false
      };
      let departmentData = await this.$api.saveOrUpdateDepartment(data);
      if (departmentData.errorcode != 0) {
        this.$message({
          message: res.msg,
          type: "error"
        });
        return;
      }
      this.getDpartment(); // 重新刷新列表
      this.getStatusStatistics();
    },
    /**
     * @description: 根据websocket推消息 获取通知的数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    getNotificationData() {
      //   console.log("ids: ", ids);
      //   console.log("this.date: ", this.date);
      //   console.log("this.selectTemplateCode: ", this.selectTemplateCode);
      let data = {
        code: this.selectTemplate.code,
        ids: this.groupIds,
        date: this.date,
        module: "rollCallOnDuty"
      };
      this.$api.getNotificationData(data).then(res => {
        if (res.errorcode == "0") {
          // console.log("res.data: ", res.data);
          this.notificationStatistics = res.data ? res.data : [];
        }
      });
    },
    /**
     * @description: 查看单位回复情况
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/23
     * @param {*}
     * @return {*}
     */
    viewReplyHandle(id) {
      this.replyPage = 1;
      this.replyId = id;
      this.viewReplyApi();
    },
    /**
     * @description: 查看单位接口
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/10
     * @param {*}
     * @return {*}
     */
    viewReplyApi() {
      this.viewReplyVisible = true;
      let data = {
        date: this.date,
        code: this.selectTemplate.code,
        page: this.replyPage,
        size: this.replySize,
        module: "rollCallOnDuty",
        id: this.replyId
      };
      this.$api.getviewReplyData(data).then(res => {
        if (res.errorcode == "0") {
          if (res.data) {
            this.viewReplyData = res.data.data;
            this.replyTotal = res.data.totalElements;
          } else {
            this.replyTotal = [];
            this.viewReplyData = [];
          }
        }
      });
    },
    /**
     * @description: 最后一个原因状态 选中后的值赋值到输入框
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    remarkHandleCommand(val, idx) {
      //   console.log("val: ", val);
      //   console.log("idx: ", idx);
      if (val) {
        this.unitData[idx].leaveReason = `请假：${val.name}`;
        this.unitData[idx].leaveType = val.id;
        console.log("this.unitData[idx]: ", this.unitData[idx]);
        this.$forceUpdate();
      }
    },
    /**
     * @description: 显示月统计数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    displayMonthData() {
      this.currentTemplateId = "";
      this.selectTemplate = "";
      this.isLookMonthData = true;
    },
    /**
     * @description: 点名通知弹窗
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    rollCallNoticeHandle() {
      if (!this.selectTemplate) {
        this.$message.warning("请选择模板");
        return;
      }
      this.rollCallNoticeVisible = true;
      // this.$nextTick(() => {
      //   // this.$refs.rollCallNoticeDialog.rollCallNoticeTitle = "点名通知";
      //   // console.log("this.groupIds: ", this.groupIds);
      //   // this.$refs.rollCallNoticeDialog.groupIds = this.groupIds;
      // });
    },
    /**
     * @description: 关闭点名通知
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/11
     * @param {*}
     * @return {*}
     */
    noticeHandleClose() {
      this.rollCallNoticeVisible = false;
    },
    /**
     * @description: 确认下发通知
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/11
     * @param {*}
     * @return {*}
     */
    async confirmNotice(data) {
      let addNotice = {
        code: this.selectTemplate.code,
        groupIds: this.groupIds,
        module: "rollCallOnDuty",
        date: this.date
      };
      data = Object.assign(addNotice, data);
      let res = await this.$api.issueNotice({ data });
      // console.log("res: ", res);
      if (res.errorcode != "0") {
        this.$message.error(res.msg);
        return;
      }
      this.rollCallNoticeVisible = false;
      this.$message.success("下发成功");
      this.getNotificationData();
    },
    /**
     * @description: 刷新单位获取最新的部门
     * @author: xuchuangxing
     * @lastUpdateTime : 2021-04-18
     * @lastEditor hexinting
     * @param {*}
     * @return {*}
     */
    udpateNotifeObject(allDepartment) {
      this.$api.saveDepartment({ data: allDepartment }).then(res => {
        // console.log("res: ", res);
        if (res.errorcode == "0") {
          this.$message.success("保存成功");
          this.getNotificationData();
          this.getDpartment();
        }
      });
    },
    /**
     * @description: 通知回复选择跳转页码时候重新加载表格
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/16
     * @param {*}
     * @return {*}
     */
    replySizeChange(val) {
      this.replyPage = val;
      this.viewReplyApi();
    },
    /**
     * @description: 通知回复改变页码时候重新加载表格
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/16
     * @param {*}
     * @return {*}
     */
    replyCurrentChange(val) {
      this.replyPage = val;
      this.viewReplyApi();
    },
    /**
     * @description: 获取点名动态 状态统计数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/17
     * @param {*}
     * @return {*}
     */
    async getStatusStatistics() {
      let data = {
        date: this.date,
        code: this.selectTemplate.code,
        module: "rollCallOnDuty"
      };
      let statusStatisticsData = await this.$api.getStatusStatistics(data);
      if (statusStatisticsData.errorcode != 0) {
        this.$message({
          message: res.msg,
          type: "error"
        });
        return;
      }
      this.statusStatistics = statusStatisticsData.data;
    },
    /**
     * @description: 打开通知对象设置弹窗
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     */
    selectNotifeObject() {
      if (this.unitData.length == 0) {
        this.$message.warning("请先添加单位");
        return;
      }
      this.notifeObjectVisible = true;
    },
    /**
     * @description: 关闭通知对象设置弹窗
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     */
    notifeObjectClose() {
      this.notifeObjectVisible = false;
    },
    getRemark(type, idx) {
      this.unitData[idx].jsonObjectList.map(v => {
        if (v.type == type) {
          this.unitData[idx].remark = `备注：${v.remark}`;
        }
      });
    }
  },
  destroy() {
    bus.$of("getNotificationData");
  }
};
</script>

<style lang="scss" scoped>
@import "//at.alicdn.com/t/font_1629034_2wl6h1m88gm.css";
// 模板tab切换样式
.rollcallonduty {
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
  height: calc(100vh - 100px);
  color: #333;
  .my-radio-box-main {
    position: relative;
    z-index: 30;
    margin-bottom: 10px;
    background: white;
    box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
    border-radius: 3px;
  }

  .my-radio-box-main >>> .el-radio-button__inner {
    padding: 14px 22px;
    font-size: 14px;
    color: #999999;
    border: none;
    border-bottom: 2px white solid;
    background: white !important;
    box-shadow: none !important;
  }

  .my-radio-box-main .is-active >>> .el-radio-button__inner {
    border-bottom: 2px #0091ff solid;
    color: #0091ff;
    border-radius: 0;
  }

  .my-radio-box-main >>> .el-radio-button:first-child .el-radio-button__inner {
    border-left: 0;
  }

  // 头部三个图标功能样式
  .rollCall {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100% !important;
    cursor: pointer;
    margin-left: 10px;
    background: url(../../../assets/rollCallOnDutyIcon/rollCall.png) no-repeat;
  }
  .rollCall:hover {
    background: url(../../../assets/rollCallOnDutyIcon/rollCallSelect.png)
      no-repeat;
  }
  .statistics {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100% !important;
    cursor: pointer;
    margin-left: 10px;
    background: url(../../../assets/rollCallOnDutyIcon/statistics.png) no-repeat;
  }
  .statistics:hover {
    background: url(../../../assets/rollCallOnDutyIcon/statisticsSelect.png)
      no-repeat;
  }
  .template {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100% !important;
    cursor: pointer;
    margin-left: 10px;
    background: url(../../../assets/rollCallOnDutyIcon/template.png) no-repeat;
  }
  .template:hover,
  .template:focus {
    background: url(../../../assets/rollCallOnDutyIcon/templateSelect.png)
      no-repeat;
  }

  // 中间天统计内容部分样式
  .rollCallDayStatistics {
    display: flex;
    height: calc(100vh - 155px);
    background-color: white;

    // 左边单位详情
    .unitDetail {
      width: 80%;
      padding: 10px;
      .date {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
      }
      .oneUint {
        display: flex;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #f0f0f0;
        align-items: center;

        /deep/ .unitTitle {
          width: 150px;
          text-align: center;
          white-space: initial;
          display: flex;
          align-items: center;
        }
        .unitTitle1 {
          width: 150px;
          text-align: center;
          white-space: initial;
          font-size: 16px;
        }
        .statusGroup .is-active >>> .el-radio-button__inner {
          color: white;
          box-shadow: initial;
        }
        .unitStatus {
          margin: 10px 5px;
          border-radius: 3px;
          >>> .el-radio-button__inner {
            font-size: 17px;
            padding: 12px 60px;
            border-radius: 3px;
            background-color: initial;
            border: 1px solid #dcdfe6;
            color: #606266;
          }
        }
        .remark {
          background-color: white;
          margin-left: 5px;
          color: #606266;
          width: 156px;
          height: 40px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .reason {
            min-width: 100px;
            font-size: 15px;
            color: #333;
            outline: none;
            border: none;
            background-color: transparent;
            padding-left: 5px;
          }
        }
        .test {
          background-color: initial;
          width: 37vw;
          .reason {
            width: 100%;
            font-size: 14px;
            color: #888;
          }
        }
      }
      .rollCallComplete {
        display: flex;
        justify-content: flex-end;
      }
      .NoUnitDetail {
        height: calc(100% + 10px);
        background-image: url(/static/img/nullList.png);
        background-repeat: no-repeat;
        background-position: center;
        background-color: white;
        text-align: center;
        line-height: 76;
        font-size: 12px;
        font-weight: bold;
        color: #cad5e8;
      }
    }

    // 右边点名动态样式
    .rollCallNews {
      width: 20%;
      .rollCallTitle {
        height: 25px;
        line-height: 1.7;
        color: white;
        font-size: 14px;
        font-weight: 600;
        background-color: #0091ff;
        text-align: center;
      }
      .dynamicDetails {
        height: calc(100% - 25px);
        overflow: scroll;
        .statusStatistics {
          padding: 10px;
          background-color: #f0f0f0;
          margin-top: 10px;
          .viewReply {
            margin-top: 10px;
            padding: 5px 50px;
          }
        }
      }
      .NoRollCallNews {
        height: calc(100% - 25px);
        background-image: url(/static/img/nullList.png);
        background-repeat: no-repeat;
        background-position: center;
        background-color: white;
        text-align: center;
        line-height: 75;
        font-size: 12px;
        font-weight: bold;
        color: #cad5e8;
      }
    }
  }
}
// 改变添加数据按钮 样式 避免 只有点文字才能触发点击方法
/deep/ .el-dropdown-menu__item {
  padding: 0;
}
/deep/ .el-dropdown-menu__item .addSetting {
  padding: 0 20px;
  display: inline-block;
}
</style>
