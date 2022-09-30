<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通信传达" name="first">
        <el-main style="padding: 10px 20px" v-if="rorcedToRefreshAll">
          <el-row>
            <el-scrollbar style="height: 100%">
              <el-col :span="11">
                <el-card shadow="always">
                  <div style="padding: 5px; width: 100%">
                    <el-row>
                      <el-col :span="20" id="setting">
                        <div style="width: 100%" v-if="settingInput">
                          <el-input
                            size="small"
                            style="width: 100%"
                            placeholder="请输入内容"
                            v-model="search"
                            class="input-with-select"
                          >
                            <el-button slot="append" @click="findContact"
                              >查找</el-button
                            >
                          </el-input>
                        </div>
                        <div style="width: 100%" v-if="settingSelect">
                          <el-select
                            style="width: 100%"
                            size="small"
                            v-model="flowSetting"
                            placeholder="请选择"
                            @change="processForm"
                          >
                            <el-option
                              v-for="item in flowSettingArr"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          icon="el-icon-refresh"
                          size="small"
                          id="iconButton"
                          @click="settingButton"
                          title="切换"
                        ></el-button>
                      </el-col>
                    </el-row>
                    <div>
                      <!--表格-->
                      <div>
                        <my-table
                          ref="tableEvent"
                          @handleCurrentChange="handleCurrentChange"
                          @handleDialPhone="handleDialPhone"
                          @handleDialsSpecialPlane="handleDialsSpecialPlane"
                          @handleDialsFax="handleDialsFax"
                          :tableColumn="tableColumn"
                          :tableData="tableData"
                        ></my-table>
                      </div>
                    </div>
                    <!--表格分页-->
                    <div style="overflow-y: auto">
                      <el-pagination
                        :small="pagingSize"
                        :page-size="pageSize"
                        :total="total"
                        :current-page="currentPage"
                        @current-change="pageMode"
                        layout="total, prev, pager, next, jumper"
                      ></el-pagination>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="2">
                <div style="width: 100%; height: 60px; margin-top: 110px">
                  <div class="rightIcon"></div>
                </div>
              </el-col>
              <el-col :span="11">
                <el-tabs type="border-card" v-model="msgTable" @tab-click="msg">
                  <!--                  <el-tab-pane label="H5短信" name="H5短信">-->
                  <el-tab-pane
                    :label="msgTableLabel ? '短信' : 'H5短信'"
                    :name="msgTableLabel ? '短信' : 'H5短信'"
                  >
                    <note-check ref="noteCheck"></note-check>
                  </el-tab-pane>
                  <el-tab-pane label="电话" name="电话">
                    <phone-disposition
                      ref="phoneDisposition"
                    ></phone-disposition>
                  </el-tab-pane>
                  <el-tab-pane label="传真" name="传真">
                    <fax-check
                      ref="faxCheck"
                      @clearFaxList="clearFaxList"
                    ></fax-check>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-scrollbar>
          </el-row>

          <el-row v-if="nameType == '短信'">
            <div style="width: 100%; padding: 10px 0 0 0; text-align: left">
              <el-select
                v-model="conductor"
                style="width: 100%"
                size="small"
                placeholder="选择批示"
                @change="changeConductor"
                @clear="clearConducuor"
                clearable
              >
                <el-option
                  v-for="item in conductorArr"
                  :key="item.id"
                  :label="item.leadername"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </el-row>

          <el-row style="height: 300px; margin-top: 20px">
            <div v-if="nameType == '短信'" style="height: 235px">
              <textarea
                class="msg-textarea"
                :style="backSms"
                v-model="smsContent"
              >
              </textarea>
              <div class="bottomRow">
                <!-- bug12442 短信签名隐藏 -->
                <!-- <div class="leftSelect">
                  <label class="export">签名:</label>
                  <el-select
                    v-model="signature"
                    filterable
                    clearable
                    placeholder="请选择"
                    @blur="selectBlur"
                  >
                    <el-option
                      v-for="item in signatureOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div> -->
                <div class="rightButton">
                  <el-button type="primary" size="mini" @click="clcikSend"
                    >发送</el-button
                  >
                </div>
              </div>
            </div>
            <div v-if="nameType == '电话'" style="height: 235px">
              <div style="border-radius: 5px; width: 100%; height: 100%">
                <div style="height: 100%">
                  <div class="dialpad">
                    <div class="peopleList">
                      <el-scrollbar style="height: 100%">
                        <template v-for="(items, index) in callQueue">
                          <div
                            class="showPhone"
                            @click="clickPhone(items, index)"
                            @dblclick="openCallWindow(items)"
                            :class="{ blue: changeColor === items.mobile }"
                            :key="index"
                          >
                            <div class="showPhoneLeft">
                              <div>{{ items.mobile }}</div>
                              <div style="text-align: center"></div>
                            </div>
                            <div class="showPhoneRight">
                              <div @click="release(items, index)">
                                <i class="el-icon-video-pause"></i>
                              </div>
                            </div>
                          </div>
                        </template>
                      </el-scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="nameType == '传真'"
              style="height: 270px; border: 1px solid #ddd"
            >
              <div id="uploadListDom" style="border-radius: 5px; width: 100%">
                <div
                  style="
                    display: flex;
                    justify-content: flex-end;
                    border-bottom: 1px solid #ddd;
                  "
                >
                  <div
                    style="
                      width: 100%;
                      text-align: right;
                      margin: 10px 0px;
                      padding-right: 10px;
                    "
                  >
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :action="string"
                      accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                      :limit="1"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      :on-success="onSuccess"
                      :on-error="onError"
                      :before-upload="beforeUpload"
                      auto-upload
                      with-credentials
                      :show-file-list="false"
                      :on-exceed="onExceed"
                    >
                      <i
                        style="
                          position: absolute;
                          left: 26px;
                          top: 20px;
                          font-size: 20px;
                        "
                        class="el-icon-full-screen"
                        @click="fullScreen"
                      ></i>
                      <el-button slot="trigger" size="small" type="primary"
                        >选择</el-button
                      >
                      <el-button size="small" type="primary" @click="expEmpty"
                        >清空</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        @click="submitUpload"
                        >发送</el-button
                      >
                    </el-upload>
                  </div>
                </div>
              </div>
              <div :style="backFax" style="width: 100%; height: 215px">
                <iframe
                  :src="previewPath"
                  id="fpxIframe"
                  width="100%"
                  height="100%"
                  frameborder="no"
                  border="0"
                  marginwidth="0"
                  marginheight="0"
                  scrolling="no"
                  allowtransparency="yes"
                ></iframe>
              </div>
            </div>
          </el-row>
        </el-main>

        <!-- 全屏预览传真 -->
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          fullscreen
        >
          <iframe
            :src="previewPath"
            id="iframe"
            width="100%"
            height="900px"
            frameborder="no"
            border="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            allowtransparency="yes"
          ></iframe>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="联动传达" name="second" style="text-align: left">
        <el-main style="padding: 10px 20px">
          <el-row>
            <p style="margin-bottom: 1%">传达单位:</p>
            <el-checkbox-group v-model="deptCheckList">
              <el-checkbox
                :label="item.deptId"
                v-for="(item, index) in deptList"
                :key="item.deptId"
                style="width: 150px; margin-bottom: 1%"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-row>

          <el-row>
            <p style="margin-bottom: 0">批示信息:</p>
            <div style="width: 100%; padding: 10px 0 0 0; text-align: left">
              <el-select
                v-model="conductor"
                style="width: 100%"
                size="small"
                placeholder="选择批示"
                @change="changeConductor"
                @clear="clearConducuor"
                clearable
              >
                <el-option
                  v-for="item in conductorArr"
                  :key="item.id"
                  :label="item.leadername"
                  :value="item.id"
                >
                </el-option>
              </el-select>

              <div style="height: 300px; margin-top: 20px">
                <textarea
                  class="msg-textarea"
                  :style="backSms"
                  v-model="smsContent"
                ></textarea>
              </div>

              <div style="margin-top: 5%; text-align: center">
                <el-button size="small" type="primary" @click="sendInstruction"
                  >发送</el-button
                >
              </div>
            </div>
          </el-row>
        </el-main>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myTable from "@/view/eventManagement/eventReports/dialog/tableCopy";
import noteCheck from "@/view/eventManagement/eventReports/Plan/iphoneCopy/noteCheckCopy"; //短信
import faxCheck from "@/view/eventManagement/eventReports/Plan/faxCheck"; //传真
import phoneDisposition from "@/view/eventManagement/eventReports/Page/share/phoneDisposition";
import { sendInstructionToLowerDept } from "../../../../../assets/interface/interface";
//电话
export default {
  name: "informationToVerify",
  components: {
    myTable,
    noteCheck,
    faxCheck,
    phoneDisposition,
  },
  data() {
    return {
      tabsTitle: "",
      activeName: "first",
      deptList: [], // 传达单位列表
      deptCheckList: [], // 传达单位选中
      search: "", //搜索
      tableColumn: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "position",
          label: "职务",
        },
      ], //表头
      tableData: [], //表格数据
      total: 0, //总数据
      pageSize: 10, //每页多少条数据
      currentPage: 1, //第几页
      pagingSize: true, //分页大小
      caseId: "", //事件caseID
      flowSetting: "", //流程设置下拉选中
      flowSettingArr: [{ name: "流程预设人员", id: 0 }], //流程设置数组
      settingInput: true,
      settingSelect: false,
      folwId: "", //流程设置ID
      eventId: "", //事件ID
      areaId: "", //区域ID
      area: "", //区域名字
      sorter: "", //判断是表格还是查找
      // msgTable:'H5短信',
      msgTable: window.g.IsNanShanProject ? "短信" : "H5短信", // tab name
      msgTableLabel: window.g.IsNanShanProject, // tab name
      rorcedToRefreshAll: true,
      backSms: {
        background: "",
        backgroundSize: "",
      },
      backFax: {
        background: "",
        backgroundSize: "",
      },
      nameType: "短信", //现在使用的类型
      smsContent: "", //短信内容
      signatureOptions: [], //签名
      // options: [
      //   {value: '办公室', label: '办公室'},
      //   {value: '财务室', label: '财务室'},
      //   {value: '总裁办', label: '总裁办'},
      // ],//所有签名都是一样的数据
      // heightSms:{
      //   height:'300px'
      // }
      signature: "", //短信签名内容
      uploadForm: [], //上传成功的存储
      string: window.g.ApiUrl + "/eos/communication/fax/convertPDF", //传真默认上传路径
      fileList: [], //上传的文件的列表
      previewPath: "", //文件预览路径
      pdfPath: "", //PDF路径
      dialogVisible: false, //全屏预览传真弹窗
      linkman: "", //每次点击赋值的流程数据
      conductor: "", //领导批示选中
      conductorArr: "", //领导批示获取到的数组
    };
  },
  created() {
    this.getConductor();
    this.getDeptChildren();
  },
  mounted() {
    this.getID();
    this.backSms.background =
      "url(" + "/static/img/none.png" + ")center no-repeat";
    this.backSms.backgroundSize = "220px";

    this.backFax.background =
      "url(" + "/static/img/faxBack.png" + ")center no-repeat";
    this.backFax.backgroundSize = "220px";
    this.getFindSmsSign(); // 获取签名
  },
  computed: {
    //计算属性监听全局变量进行数组操作
    callQueue() {
      return this.$store.getters.getCallQueue;
    },
  },
  watch: {
    smsContent: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backSms.background =
            "url(" + "/static/img/none.png" + ")center no-repeat";
          this.backSms.backgroundSize = "220px";
        } else {
          this.backSms.background = "none";
          this.backSms.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    previewPath: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backFax.background =
            "url(" + "/static/img/faxBack.png" + ")center no-repeat";
          this.backFax.backgroundSize = "220px";
        } else {
          this.backFax.background = "none";
          this.backFax.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    msgTable: {
      handler(newV) {
        let type = newV;
        console.log(newV);
        switch (type) {
          case "电话":
            this.$refs.tableEvent.eventshowPhone();
            break;
          // case 'H5短信':
          case "短信" || "H5短信":
            this.$refs.tableEvent.eventshowline();
            break;
          case "传真":
            break;
          default:
            break;
        }
      },
      deep: true,
    },
    changeRed: {
      handler(newV, oldV) {
        console.log(newV, oldV);
        if (newV != oldV) {
          this.rorcedToRefreshAll = false;
          this.tableData = [];
          this.flowSetting = "";
          this.total = 0;
          this.pageSize = 10;
          (this.currentPage = 1), //第几页
            setTimeout(() => {
              this.rorcedToRefreshAll = true;
            }, 10);
        }
      },
      deep: true,
    },
    // deptCheckList(newVal, oldVal) {
    // console.log(...arguments)
    // }
  },
  methods: {
    // 传真加入发送队列后，清空传真内容
    clearFaxList() {
      this.expEmpty();
    },
    //获取短信签名
    getFindSmsSign() {
      let data;
      this.$api.findSmsSign(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.signatureOptions = res.data;
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      this.getDeptChildren();
      // this.clearConducuor()
      this.deptCheckList = []; // 重置部门选中
    },

    //下拉列表清空时触发
    clearConducuor() {
      this.conductor = "";
      this.smsContent = "";
    },
    //领导批示内容下拉列表变化
    changeConductor(val) {
      this.smsContent = "";
      let obj = {};
      obj = this.conductorArr.find((item) => {
        return item.id === val; //筛选出匹配数据
      });
      console.log(obj);
      let smsContentData = `${obj.deptName}${obj.leadername}同志于${obj.createTime}批示${obj.approval}。`;
      this.smsContent = smsContentData;
    },
    //获取领导批示内容赋值下拉列表
    getConductor() {
      this.eventId = sessionStorage.getItem("newID");
      if (
        this.eventId == "" ||
        this.eventId == null ||
        this.eventId == "newID"
      ) {
        return;
      }
      let data = {
        eventId: this.eventId,
      };
      this.$api.leadList1(data).then((res) => {
        if (res.errorcode == "0") {
          this.conductorArr = res.data;
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    getID() {
      this.caseId = sessionStorage.getItem("caseID");
    },
    selectBlur(e) {
      this.signature = e.target.value;
    },
    msg(tab) {
      console.log(tab.label);
      this.msgTable = tab.label;
      // if(tab.label=='H5短信'){
      if (tab.label == "短信" || tab.label == "H5短信") {
        this.nameType = "短信";
        // this.heightSms.height=300+'px'
      }
      if (tab.label == "电话") {
        this.nameType = "电话";
      }
      if (tab.label == "传真") {
        this.nameType = "传真";
      }
    },
    setClick(index) {
      //设置点击按钮
      console.log(index);
      let name = [{ name: "事件联系人" }];
      if (this.buttons[index].dynamicContactor.code === 'yes') {
        console.log(index, name, this.buttons);
        let caseName = sessionStorage.getItem("caseName");
        let caseId = sessionStorage.getItem("caseID");
        this.$emit("setClick", index, name, this.buttons, caseName, caseId);
      }
    },
    processForm(value) {
      this.tableData = [];
      this.total = 0;
      if (this.msgTable == "电话") {
        this.$refs.tableEvent.eventshowPhone();
        // }else if(this.msgTable=='H5短信'){
      } else if (this.msgTable == "短信" || this.msgTable == "H5短信") {
        this.$refs.tableEvent.eventshowline();
      } else if (this.msgTable == "传真") {
      }
      this.sorter = "表格";
      this.currentPage = 1;
      if (this.flowSetting === 0) {
        if (this.caseId) {
          let data = {
            caseId: this.caseId,
            page: this.currentPage,
            size: this.pageSize,
          };
          this.$api.listRelayInstruction(data).then((res) => {
            if (res.errorcode == "0") {
              if (res.data == []) {
                this.tableData = [];
                this.total = 0;
              } else {
                this.tableData = res.data.data;
                this.total = res.data.totalElements;
              }
            } else {
              //this.$message.error(res.msg);
            }
          });
        } else {
          this.$message({
            message: "暂无事件类型",
            type: "warning",
          });
        }
      } else if (this.flowSetting === 1) {
        let data = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.structList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 2) {
        let update = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
          eventId: this.eventId,
        };
        this.$api.getFlowList(update).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    settingButton() {
      //点击图标切换
      this.area = sessionStorage.getItem("area");
      this.areaId = sessionStorage.getItem("areaId");
      // this.flowSettingArr=[]
      // this.flowSetting=''
      this.flowSetting = "";
      if (this.settingInput) {
        this.settingInput = false;
      } else {
        this.settingInput = true;
      }
      if (this.settingSelect) {
        this.settingSelect = false;
      } else {
        this.settingSelect = true;
        // if(this.area){
        //   this.flowSettingArr.push(
        //     {name:this.area+'(属地负责人)',id:0},
        //   )
        // }
      }
    },
    findContact() {
      //查找联系人
      this.tableData = [];
      this.total = 0;
      if (this.search.trim() == "" || this.search == null) {
        this.$message({
          message: "请先输入查找内容",
          type: "warning",
        });
        return;
      }
      if (this.msgTable == "电话") {
        this.$refs.tableEvent.eventshowPhone();
        // }else if(this.msgTable=='H5短信'){
      } else if (this.msgTable == "短信" || this.msgTable == "H5短信") {
        this.$refs.tableEvent.eventshowline();
      } else if (this.msgTable == "传真") {
      }
      this.sorter = "查找";
      this.currentPage = 1;
      let grouping = {
        groupId: "",
        page: this.currentPage,
        size: this.pageSize,
        searchText: this.search,
        dictType: "governmentAffairs",
      };

      this.$api.contactorList(grouping).then((res) => {
        if (res.errorcode == "0") {
          if (res.data == []) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
          }
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(row) {
      //表格点击事件
      console.log(row);
      // this.$refs.noteCheck.get(row);
    },
    pageMode(val) {
      //监听第几页
      console.log(val);
      this.currentPage = val;
      let type = this.sorter;
      switch (type) {
        case "表格":
          this.processFormTwo();
          break;
        case "查找":
          this.findContactTwo();
          break;
        default:
          break;
      }
    },
    processFormTwo() {
      if (this.flowSetting === 0) {
        if (this.caseId) {
          let data = {
            caseId: this.caseId,
            page: this.currentPage,
            size: this.pageSize,
          };
          this.$api.listRelayInstruction(data).then((res) => {
            if (res.errorcode == "0") {
              if (res.data == []) {
                this.tableData = [];
                this.total = 0;
              } else {
                this.tableData = res.data.data;
                this.total = res.data.totalElements;
              }
            } else {
              //this.$message.error(res.msg);
            }
          });
        } else {
          this.$message({
            message: "暂无事件类型",
            type: "warning",
          });
        }
      } else if (this.flowSetting === 1) {
        let data = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.structList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 2) {
        let update = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
          eventId: this.eventId,
        };
        this.$api.getFlowList(update).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    findContactTwo() {
      let grouping = {
        groupId: "",
        page: this.currentPage,
        size: this.pageSize,
        searchText: this.search,
        dictType: "governmentAffairs",
      };

      this.$api.contactorList(grouping).then((res) => {
        if (res.errorcode == "0") {
          if (res.data) {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleDialPhone(row) {
      if (
        !row.mobile &&
        !row.otherTel &&
        !row.officeTel &&
        !row.homeTel &&
        !row.otherTel2 &&
        !row.temobile
      ) {
        this.$message({
          message: "该位联系人暂无联系号码",
          type: "warning",
        });
        return;
      }
      this.msgTable = "电话";
      this.nameType = "电话";
      console.log(row);
      this.$refs.phoneDisposition.ruleForm.inputMobile =
        row.mobile ||
        row.otherTel ||
        row.officeTel ||
        row.homeTel ||
        row.otherTel2 ||
        row.temobile;
      this.$refs.phoneDisposition.assignment(row);
    },
    handleDialsSpecialPlane(row) {
      // this.msgTable='H5短信'
      this.msgTable = this.msgTableLabel ? "短信" : "H5短信";
      this.nameType = "短信";
      this.$refs.noteCheck.get(row);
    },
    handleDialsFax(row) {
      if (row.fax == "" || row.fax == null) {
        this.$message({
          message: "该位联系人暂无传真号码!",
          type: "warning",
        });
        return;
      }
      this.msgTable = "传真";
      this.nameType = "传真";
      this.$refs.faxCheck.getFax(row);
    },
    clcikSend() {
      //短信发送
      this.$refs.noteCheck.report = this.smsContent;
      this.$refs.noteCheck.signature = this.signature;
      this.$refs.noteCheck.tabsTitle = this.tabsTitle;
      this.$refs.noteCheck.sendData();
    },
    giveDataClass() {
      this.nameType = "短信";
      this.smsContent = `${this.smsContent}${this.$store.getters.getOverallEvent}`;
    },
    clickPhone(data) {
      this.clickPhoneData = data;
      this.changeColor = data.mobile;
      this.$store.commit("setCallee", data.mobile);
      this.$store.commit("setCallClass", data.callClass);
      this.$store.commit("setCallConn", data.conn);
    },
    //重新打开callwindows方法
    openCallWindow(items) {
      this.$refs.CallWindow.callIsVisible = true;
      this.$refs.CallWindow.cid = items.cid;
      this.$store.commit("setCallee", items.mobile);
      this.$store.commit("setCallClass", items.callClass);
      this.$store.commit("setCallConn", items.conn);
    },
    release(items, key) {
      this.$confirm("是否结束当前通话?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        let self = this;
        if (self.HWICP_Version == "HWICP-19.0") {
          this.$icp19.DropCall(Number(self.agent_id), Number(items.conn), key);
        }
      });
    },

    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },

    //传真文件移除时触发
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.pdfPath = "";
      this.previewPath = "";
      this.$refs.upload.clearFiles();
    },

    /**
     * @param {obj} response 后端返回的参数
     * @lastEditor: hexinting
     * @lastDate: 2020-9-16
     * @description 上传成功
     */
    onSuccess(response) {
      this.pdfPath = response.data;
      this.previewPath = `${window.g.ApiUrl}/fax/${response.data}`;
      console.log("传真显示路径：", this.previewPath);
      console.log("上传传真成功-传真名字：", response.data);
    },

    //文件提前上传失败
    onError(err) {
      console.log(err);
      this.$message({
        message: "请重新选择文件",
        type: "warning",
      });
    },

    //利用假上传获取文件判断格式
    beforeUpload(file) {
      this.uploadForm.push(file);
      console.log(file);
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "jpeg";
      const extension3 = testmsg === "png";
      const extension4 = testmsg === "pdf";
      const extension5 = testmsg === "ppt";
      const extension6 = testmsg === "pptx";
      const extension7 = testmsg === "doc";
      const extension8 = testmsg === "docx";
      const extension9 = testmsg === "txt";
      const extension10 = testmsg === "xlsx";
      const extension11 = testmsg === "xls";
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8 &&
        !extension9 &&
        !extension10 &&
        !extension11
      ) {
        this.$message({
          message: "请上传正确的文件格式",
          type: "warning",
        });
      }

      // if(!isLt2M) {
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      //         type: 'warning'
      //     });
      // }
      // return extension || extension2 && isLt2M
      return (
        extension ||
        extension2 ||
        extension3 ||
        extension4 ||
        extension5 ||
        extension6 ||
        extension7 ||
        extension8 ||
        extension9 ||
        extension10 ||
        extension11
      );
    },

    //文件超出个数限制时的钩子
    onExceed() {
      this.$message({
        message: "请先删除已选择的文件再进行上传!",
        type: "warning",
      });
    },

    //清空文件
    expEmpty() {
      this.pdfPath = "";
      this.previewPath = "";
      this.$refs.upload.clearFiles();
    },

    //全屏预览
    fullScreen() {
      if (this.previewPath == "" || this.previewPath == null) {
        this.$message({
          message: "请先选择传真文件在进行预览",
          type: "warning",
        });
        return;
      }
      this.dialogVisible = true;
    },

    /**
     * @lastEditor: hexinting
     * @lastDate: 2020-9-16
     * @description 发送传真
     */
    submitUpload() {
      this.$refs.faxCheck.submitUpload(this.uploadForm, this.pdfPath);
    },

    // 获取传达单位
    getDeptChildren() {
      let data = {};
      this.$api.getDeptChildren(data).then((res) => {
        console.log(res);
        if (res.errorcode !== 0) {
          this.$message({
            message: "请求下级单位失败",
            type: "warning",
          });
        } else {
          this.deptList = res.data;
        }
      });
    },

    // 发送联动传达
    sendInstruction() {
      let data = {
        deptIds: this.deptCheckList,
        approvalId: this.conductor,
        content: this.smsContent,
      };
      // console.log(data)
      this.$api.sendInstructionToLowerDept(data).then((res) => {
        // console.log(res)
        if (res.errorcode !== 0) {
          this.$message({
            message: "联动传达发送失败",
            type: "warning",
          });
        } else {
          this.$message({
            message: "联动传达发送成功",
            type: "success",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.aLink {
  cursor: pointer;
  padding: 0 10px;
  margin: 10px 0;
}
.red {
  color: white !important;
  border: 1px solid #2d8cf0;
}
#divButton {
  color: #7e7f83;
  border-radius: 5px;
  height: 40px;
  font-size: 14px;

  cursor: pointer;
}
.setting >>> .el-select {
  width: 100%;
}
.aLink >>> .el-button {
  border: 1px solid #ddd;
}
>>> .el-card__body {
  display: flex;
  padding: 0;
  width: 100%;
}
.backCoror {
  background-color: #f9fbff;
}
.bottomRow {
  width: 100%;
  display: flex;
  height: 50px;
  line-height: 50px;
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
.leftSelect {
  flex: 2;
  text-align: left;
}

.rightButton {
  flex: 1;
  text-align: right;
}
.leftSelect >>> .el-input {
  width: 100px;
}

.leftSelect >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.rightIcon {
  width: 100%;
  height: 100%;
  background: url("/static/img/svg/row.svg") center no-repeat;
  background-size: 44px 35px;
}
#iconButton {
  padding: 4px 6px;
}
#iconButton >>> .el-icon-refresh {
  font-size: 20px;
}
.peopleList {
  height: 235px;
  border: 1px solid #ddd;
}
.showPhone {
  font-size: 0px;
  color: #fff;
  height: 30px;
  display: flex;
}

.showPhoneLeft {
  height: 30px;
  flex: 8;
  background: rgb(69, 69, 69);
}

.showPhoneRight {
  flex: 2;
  height: 30px;
  background: rgb(37, 37, 37);
}

.showPhoneLeft div {
  font-size: 14px;
  line-height: 30px;
  width: 45%;
  padding-left: 5%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.showPhoneRight i {
  font-size: 20px;
  cursor: pointer;
}
.showPhoneRight div {
  font-size: 20px;
  padding: 0 10px;
  display: inline-block;
}

>>> .el-tabs__header {
  margin-bottom: 0;
}

.msg-textarea {
  border-radius: 5px;
  width: 100%;
  height: 100%;
  resize: none;
  border: 1px solid rgb(221, 221, 221);
  background: url(/static/img/none.png) center center / 220px no-repeat;
}
</style>
