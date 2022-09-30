<!--@author：wzm-->
<template>
  <div class="phoneHistory" style="margin: 0 10px">
    <el-row>
      <!--左边-->
      <el-col :span="17" class="left_box">
        <el-tabs v-model="searchData.vcDirect" type="card" @tab-click="handleTabsClick">
          <el-tab-pane label="全部" name=" "></el-tab-pane>
          <el-tab-pane label="已接" name="已接"></el-tab-pane>
          <el-tab-pane label="未接" name="未接"></el-tab-pane>
          <el-tab-pane label="呼出" name="已拨"></el-tab-pane>
        </el-tabs>
        <div style="background: white; height: 79vh">
          <el-row :gutter="10" style="padding: 14px 0 11px;margin: 0px">
            <el-col :span="6">
              <el-date-picker
                class="datePicker"
                style="width:100%;"
                v-model="timeVal"
                type="daterange"
                range-separator=" "
                start-placeholder="请输入日期范围"
                @change="handleTimeChange"
              ></el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="searchData.searchText"
                placeholder="请输入关键字"
                style="border-bottom-right-radius:0px ;border-top-right-radius:0px;"
              >
                <el-button
                  @click="search"
                  :disabled="tableConfig.loading"
                  slot="append"
                  style="font-size:16px; height: 40px;background: #3F92FE;color: white;border-bottom-left-radius:0px ;border-top-left-radius:0px;"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button
                @click="exportTable"
                style="width:100%;background: #0091FF;font-size:14px;color: white;border: none"
              >导出</el-button>
            </el-col>
            <el-col :span="3">
              <el-button
                style="width:100%;background: #0091FF;font-size:14px;color: white;border: none"
                @click="onbatchEvents"
              >{{tableConfig.selection?'完成关联':'批量关联事件'}}</el-button>
            </el-col>
            <el-col :span="5" v-if="tableConfig.selection">
              <el-popover
                placement="bottom"
                v-model="tablePopoverVisible"
                popper-class="eventOptions"
              >
                <div class="eventSearch">
                  <el-input v-model="searchText" placeholder="请输入关键字" size="small">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="searchEvent"></i>
                  </el-input>
                </div>
                <template v-if="event_list.length > 0">
                  <ul class="eventList">
                    <li
                      v-for="item in event_list"
                      :key="item.id"
                      class="evenyEvent"
                      @click="selectLeftTableEvent(item)"
                      :style="selectEventStyle(item.id)"
                    >{{ item.title }}</li>
                    <div class="loadMore">
                      <el-button
                        round
                        icon="iconfont icon-loadMore"
                        size="mini"
                        @click="loadMoreHandle"
                        v-if="loadMore"
                      >加载更多</el-button>
                      <div v-else>暂无更多数据</div>
                    </div>
                  </ul>
                </template>
                <template v-else>
                  <div style="text-align: center; margin-top: 10px">暂无数据</div>
                </template>

                <el-input
                  slot="reference"
                  v-model="left_form.eventTitle"
                  readonly
                  placeholder="请选择关联事件"
                ></el-input>
              </el-popover>
            </el-col>
          </el-row>
          <div class="table_box">
            <myTable
              ref="refTable"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :tableConfig="tableConfig"
              @rowClick="rowClick"
              @selectrow="selectrow(arguments)"
              @selectallrow="selectallrow"
            >
              <!--姓名/号码-->
              <template slot="directs" slot-scope="data">
                <div style="display: flex;align-items: center">
                  <div class="Box1 commonBox" v-show="data.slotData.direct === '已接'"></div>
                  <div class="Box2 commonBox" v-show="data.slotData.direct === '已拨'"></div>
                  <div class="Box3 commonBox" v-show="data.slotData.direct === '未接'"></div>
                  <div style="margin-left: 6px">{{data.slotData.direct}}</div>
                </div>
              </template>
              <!--姓名/号码-->
              <template slot="namePhone" slot-scope="data">
                {{data.slotData.contactor}}
                <br />
                {{data.slotData.call === 'unknown' ? '未知': data.slotData.call}}
              </template>
              <!--呼叫时间-->
              <template slot="startTime" slot-scope="data">
                <div v-html="data.slotData.startTime"></div>
              </template>
              <!--接通时间-->
              <template slot="connectedTime" slot-scope="data">
                <div v-html="data.slotData.connectedTime"></div>
              </template>
              <!--单位/职位-->
              <template slot="unitPost" slot-scope="data">
                {{data.slotData.workUnit}}
                <br />
                {{data.slotData.position}}
              </template>
            </myTable>
          </div>
          <div class="my_pagination" style="background: #fff;text-align: right; padding:14px 0">
            <myPagination
              :pageConfig="pageConfig"
              @sizeChange="sizeChange"
              @currentChange="currentChange"
            ></myPagination>
          </div>
        </div>
      </el-col>
      <!--右边-->
      <el-col :span="7" class="right_box">
        <h3 style="margin-left: 12px">通话详情</h3>
        <el-form class="rigth_form" ref="rigth_form" :model="rigth_form" label-width="90px">
          <!-- openlab项目需求： 1. 通话结束，如果通话有录音，就保留翻译按钮。 2.通话结束，如果通话没有录音，就屏蔽翻译按钮。 -->
          <template v-if="IsOpenLabProject">
            <el-form-item v-if="audioSrc && audioSrc !== ''" label="电话录音" class="form_item_lh">
              <div id="content_del" style="position: relative;top: 7px;">
                <!--              <audio style="display: none;" controls src="https://win-web-rc01-sycdn.kuwo.cn/8fee38b099efc8949f4ecd0e8c136d36/5eb39ae7/resource/n1/25/99/3304858275.mp3"></audio>-->
                <audio style="display: none;" controls :src="audioSrc"></audio>
              </div>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="电话录音" class="form_item_lh">
              <div id="content_del" style="position: relative;top: 7px;">
                <!--              <audio style="display: none;" controls src="https://win-web-rc01-sycdn.kuwo.cn/8fee38b099efc8949f4ecd0e8c136d36/5eb39ae7/resource/n1/25/99/3304858275.mp3"></audio>-->
                <audio style="display: none;" controls :src="audioSrc"></audio>
              </div>
            </el-form-item>
          </template>
          <el-form-item label="事件关联">
            <el-popover placement="bottom" v-model="visible" popper-class="eventOptions">
              <div class="eventSearch">
                <el-input v-model="searchText" placeholder="请输入关键字" size="small">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="searchEvent"></i>
                </el-input>
              </div>
              <template v-if="event_list.length > 0">
                <ul class="eventList">
                  <li
                    v-for="item in event_list"
                    :key="item.id"
                    class="evenyEvent"
                    @click="selectEvent(item)"
                    :style="selectEventStyle(item.id)"
                  >{{ item.title }}</li>
                  <div class="loadMore">
                    <el-button
                      round
                      icon="iconfont icon-loadMore"
                      size="mini"
                      @click="loadMoreHandle"
                      v-if="loadMore"
                    >加载更多</el-button>
                    <div v-else>暂无更多数据</div>
                  </div>
                </ul>
              </template>
              <template v-else>
                <div style="text-align: center; margin-top: 10px">暂无数据</div>
              </template>

              <el-input
                slot="reference"
                v-model="rigth_form.eventTitle"
                readonly
                placeholder="请选择关联事件"
              ></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="通话单位">
            <el-input v-model="rigth_form.company" placeholder="如:应急局"></el-input>
          </el-form-item>
          <el-form-item label="电话备注">
            <el-input
              type="textarea"
              resize="none"
              :rows="15"
              maxlength="500"
              placeholder="请输入内容"
              v-model="rigth_form.emarks"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item class="last_form_item">
            <el-row type="flex" justify="space-between">
              <el-col :span="9">
                <!-- bug7746 author:hexinting date:2020-10-26 -->
                <!--   v-if="this.tableData.direct=='已接'||this.tableData.direct='未接'" && data.slotData.direct=='已拨'  -->
                <el-tooltip
                  :disabled="!!rigth_form.eventId"
                  content="请先关联事件"
                  placement="top"
                  effect="dark"
                  popper-class="popper_style"
                >
                  <el-checkbox
                    :disabled="!rigth_form.eventId || currentRow.direct=='已拨' "
                    v-model="rigth_form.checked"
                  >存为事件续报</el-checkbox>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-button
                  @click="save"
                  :disabled="tableConfig.loading"
                  style="font-size:14px;color: white;padding: 8px 18px;background: #0091FF;border: none;"
                >保存</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-row style="background: #f9fcff; padding: 12px 0">
          <el-col :span="24">
            <template v-for="(item,i) in iconList">
              <el-tooltip class="item" effect="dark" :content="item.msg" placement="top">
                <img
                  :key="item.i"
                  class="right_icon"
                  :src="idx === item.i ?item.url_a:item.url"
                  @mouseenter="enterIcon(i)"
                  @mouseleave="leaveIcon()"
                  @click="handleIcon(item.i)"
                />
              </el-tooltip>
            </template>
            <el-tooltip
              class="item"
              effect="dark"
              :content="inBlacklist?'移出黑名单':'加入黑名单'"
              placement="top"
            >
              <img
                class="right_icon"
                :src="banUserIcon"
                @mouseenter="enterBanIcon()"
                @mouseleave="leaveBanIcon()"
                @click="handleBanIcon()"
                ref="banIcon"
              />
            </el-tooltip>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--裁剪音频-->
    <tailorAudio ref="tailorAudio" v-if="tailorAudioFlag" @tailorAudioClose="tailorAudioClose"></tailorAudio>
    <!-- 语音转文字   -->
    <SpeechText
      ref="SpeechText"
      v-show="SpeechTextFlag"
      @cellRemark="cellRemark"
      @closeSpeechTextEle="closeSpeechTextEle"
    ></SpeechText>
    <!--新增联系人弹窗-->
    <ContactDetailsPopup ref="ContactDetailsPopup"></ContactDetailsPopup>
  </div>
</template>

<script>
import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin";
import audioControls from "@/../static/audioControls/audioPlugin";
import tailorAudio from "@/view/yz_eventManagement/informationDisposal/communicationHistory/comonnTemplat/tailorAudio";
import SpeechText from "@/view/yz_eventManagement/informationDisposal/communicationHistory/comonnTemplat/SpeechText";

import myTable from "../components/myTable";
import myPagination from "../components/myPagination";

import phone_a from "../../../assets/phoneHistoryIcon/phone_a.png";
import banUser_a from "../../../assets/phoneHistoryIcon/banUser_a.png";
import friend_a from "../../../assets/phoneHistoryIcon/friend_a.png";
import phone from "../../../assets/phoneHistoryIcon/phone.png";
import banUser from "../../../assets/phoneHistoryIcon/banUser.png";
import friend from "../../../assets/phoneHistoryIcon/friend.png";

import ContactDetailsPopup from "@/view/yz_integratedCommunication/contactDetailsPopup";
// import audio from "../../eventManagement/eventRegistration/newModel/audio";
import axios from "axios";
import {mapGetters} from 'vuex'
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

const allApiRequest = require('@/assets/js/weblfasr/weblfasr.js').default;

export default {
  name: "phoneHistory",
  mixins: [mixin, mixin2],
  components: {
    myTable,
    myPagination,
    tailorAudio,
    ContactDetailsPopup,
    SpeechText
  },
  data() {
    return {
      IsOpenLabProject: window.g.IsOpenLabProject, // openlab项目
      selectionrows:[],
      tablePopoverVisible:false,
      tailorAudioFlag: false,
      expandSelectRowData: {}, //点击展开列的时候获取的列数据
      audioControls: "", // 音频的构造函数
      SpeechTextFlag: false, //语音转文字的显示控制

      idx: -1,
      iconList: [
        { i: 0, url: phone, url_a: phone_a, msg: "拨号" },
        { i: 1, url: friend, url_a: friend_a, msg: "加入通讯录" }
      ],
      audioEventList: {},
      // 表格筛选数据
      timeVal: "",
      searchData: {
        vcDirect: " ", //类型
        dtStart: "", //开始时间
        dtEnd: "", //结束时间
        searchText: "", //搜索内容
        page: 1,
        size: 10
      },
      // 左边表单
      left_form: {
          eventTitle:'',
        eventId: "", //事件
        company: "", //单位
        emarks: "", //备注
        startTime: "", //呼叫时间
        checked: false, //事件续报
        recordFile: "",// 录音文件
        call:""//电话
      },
      // 右边表单
      rigth_form: {
          eventTitle:'',
        eventId: "", //事件
        company: "", //单位
        emarks: "", //备注
        startTime: "", //呼叫时间
        checked: false, //事件续报
        recordFile: "",// 录音文件
        call:""//电话
      },
      event_list: [],
      rowId: "",
      ApiUrl: window.g.ApiUrl,
      audioSrc: null, // 录音地址

      // 表格配置数据
      tableColumn: [
        { label: "类型", prop: "directs", width: 90, slot: true },
        { label: "姓名/号码", prop: "namePhone", width: 145, slot: true },
        { label: "单位/职位", prop: "unitPost", slot: true },
        { label: "事件标题", prop: "eventTitle"},
        { label: "呼叫时间", prop: "startTime", slot: true },
        { label: "接通时间", prop: "connectedTime", slot: true },
        { label: "通话时长", prop: "diffTime", width: 131 },
        { label: "通话用户", prop: "oprName", width: 103 },
        { label: "通话坐席", prop: "agentName", width: 102 }
      ],
      tableData: [],
      tableConfig: {
        height: "620px",
        loading: false,
        selection: false,
        rowIndex: undefined,
        currentRowKey: '1',
        rowKey: row => String(row.id)
      },

      // 分页器配置
      pageConfig: {
        total: 0,
        currentPage: 1,
        totalPages: 0,
        small: false,
        background: true
      },

      // 呼叫
      inBlacklist: false,
      callInfo: {},
      banUserIcon: banUser,
      // 加载
      loading: false,
      rowIndex: 0, // 当前tableData点中的index
      currentRow: {}, // 表格当前选中行
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
    };
  },
  computed: {
    ...mapGetters({
      getAudioText: 'getAudioText',
      getTurnToTextLoading: 'getTurnToTextLoading'
    }),
    selectEventStyle() {
      return function (eventId) {
        if (this.rigth_form.eventId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  created() {
    if (this.$route.query.type) {
      this.searchData.vcDirect = "未接";
    }
    this.getTableData();
    this.getAllEventlist();
    // console.log(this.$router, this.$route);
  },
  watch: {
    "$route.query.type"(newVal) {
      if (newVal) {
        this.searchData.vcDirect = "未接";
        this.getTableData();
      }
    }
  },
  methods: {
      /**
       * @param {Array} data [rows, row] rows:表格勾选行 row:当前选中行当前选中或取消选中的一行
       * @lastAuthor hexinting
       * @lastDate 2021-01-28
       * @description 表格点击单选
       */
      selectrow(data){
        console.log("selectrow接收到了",data[0])
        this.selectionrows=data[0] 
      },
      selectallrow(data){
          console.log("selectallrow接收到了",data)
         this.selectionrows=data 
      },
      onbatchEvents(){
        
        if(this.tableConfig.selection){
            if(!this.left_form.eventId){
                this.$message({
                    type: "warning",
                    message: "请选择关联事件"
                });
                this.tableConfig.selection=!this.tableConfig.selection
                return false
            }
            if(this.selectionrows.length==0){
                this.$message({
                    type: "warning",
                    message: "请勾选列表"
                });
                this.tableConfig.selection=!this.tableConfig.selection
                return false
            }
            var selectionrows=[]
            this.selectionrows.forEach(item=>{
                selectionrows.push({
                    eventId: this.left_form.eventId,
                    id:item.id,
                    remark:'',
                    isDeal: false,
                    unit:item.workUnit,
                    dealPhone:item.call,
                    dealName:item.contactor
                })
            })
            this.$http({
                method: 'post',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'  
                },
                url: window.g.ApiUrl + '/eos/history/updatePhoneAll',
                data: {
                    data:selectionrows
                }
                
            }).then(({data}) => {
                console.log("/eos/history/updatePhoneAll",data)
                if(data.errorcode==0){
                    this.$message({
                        type: "success",
                        message: '批量关联成功'
                    });
                    this.getTableData()
                    this.selectionrows=[]
                }else{
                    this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
                console.log(this.$refs.refTable.multipleSelection)
                this.$refs.refTable.multipleSelection = []
                this.left_form.eventTitle = ''
            })
        }
        this.tableConfig.selection=!this.tableConfig.selection
      },
    handleIcon(index) {
      if (index == 0) {
        // 呼叫
        this.talkCall(this.callInfo);
      }
      if (index == 1) {
        this.addMailList();
      }
    },
    // 点击黑名单图标
    handleBanIcon() {
      let banMsg = this.inBlacklist
        ? "是否将该号码从黑名单移出"
        : "是否将该号码加入黑名单，加入后将无法接收该号码来电！";
      let banTitle = this.inBlacklist ? "移出黑名单" : "加入黑名单";
      this.$refs.banIcon.blur();
      this.$confirm(banMsg, banTitle, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        // type: 'warning'
      })
        .then(() => {
          if (this.inBlacklist) {
            this.doRemoveBlackList();
          } else {
            this.doAddBlackList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    },
    // 加入黑名单操作
    doAddBlackList() {
      let data = {
        type: 0, //添加进黑名单
        phoneNumber: this.callInfo.number
      };
      this.$api.doBlacklist(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          type: "success",
          message: "加入黑名单成功"
        });
        // 更新当前图标
        this.inBlacklist = true;
        this.banUserIcon = banUser_a;
      });
    },

    // 移出黑名单操作
    doRemoveBlackList() {
      let data = {
        type: 2, // 移出进黑名单
        phoneNumber: this.callInfo.number
      };
      this.$api.doBlacklist(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          type: "success",
          message: "移出黑名单成功"
        });
        // 更新当前图标
        this.inBlacklist = false;
        this.banUserIcon = banUser;
      });
    },
    // 添加联系人
    addMailList() {
      if (this.callInfo.number) {
        //新增联系人方法
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "新增联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.setNewNumber(this.callInfo.number);
        });
      } else {
        this.$message({
          message: "未识别到有效号码，请确认已点击选中表格行",
          type: "warning"
        });
      }
    },
/** 
 * @editor: qinjiaqi
 * @param {type} 无
 * @return {type} undefined
 * @description：保存。没有id时不许保存
 */
    save() {
      if(this.rowId == "" || this.rowId == null || this.rowId == undefined ){
          this.$message({
              message: "未识别到有效号码，请确认已点击选中表格行",
              type: "warning"
          });   
          return ;
      }
      let okData = {
        eventId: this.rigth_form.eventId,
        id: this.rowId,
        remark: this.rigth_form.emarks,
        isDeal: this.rigth_form.checked,
        unit: this.rigth_form.company,
        dealPhone: this.rigth_form.dealPhone,//报送号码
        dealName:this.rigth_form.dealName==""?'-':this.rigth_form.dealName//报送人
      };
      // 更新电话历史
      this.$api.ok(okData).then(res => {
        console.log(okData,111)
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
        } else {
          this.$message({
            message: "信息保存成功！",
            type: "success"
          });
          if (this.rigth_form.checked) {
            setTimeout(() => {
              this.$message({
                message: "已存为续报！",
                type: "success"
              });
              this.rigth_form.checked = false;
            }, 500);
          }
          this.rigth_form.eventId = "";
          this.rigth_form.company = "";
          this.rigth_form.emarks = "";
          this.rigth_form.startTime = "";
          this.rigth_form.dealPhone="";
          this.rigth_form.dealName=""
          this.getTableData();
        }
      });
      return;
      // 保存事件续报
      // if (this.rigth_form.checked){
      //   let parmas = {
      //     data:{
      //       eventProcessId: this.rigth_form.eventId,
      //       description: this.rigth_form.emarks,
      //       department: this.rigth_form.company,
      //       dealTime: this.rigth_form.startTime.replace('<br />',' ')
      //     }
      //   };
      //   this.$api.saveEventDeal(parmas).then(() => {
      //     this.$message({
      //       message: '已存为续报！',
      //       type: 'success'
      //     });
      //     this.rigth_form.checked = false
      //   }).catch(err => {
      //     this.$message({
      //       message: err.msg,
      //       type: 'error'
      //     });
      //     this.rigth_form.checked = false
      //   })
      // }
    },
    // 筛选时间
    handleTimeChange(val) {
      if (val) {
        this.searchData.dtStart = this.timeFormat(val[0]);
        this.searchData.dtEnd = this.timeFormat(val[1]);
      } else {
        this.searchData.dtStart = "";
        this.searchData.dtEnd = "";
      }
    },
    // 全部/已接/未接/呼出改变时执行初始化数据
    handleTabsClick() {
      this.timeVal = "";
      this.searchData.dtStart = "";
      this.searchData.dtEnd = "";
      this.searchData.searchText = "";
      this.search(); //搜索表格数据

      this.searchText = ""
      this.currentPage = 1
      this.event_list = []
      this.getAllEventlist();

      // this.$router.push({ path: "/messageHistory" }); // 注释原因：在本页面跳转本页面会报错（hexinting）
    },
    // 搜索筛选数据
    search() {
      this.searchData.page = 1;
      this.pageConfig.currentPage = 1;
      this.getTableData();
    },
    // 获取右表单所有关联数据
    getAllEventlist() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          console.log(res)
          this.event_list.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    // 获取表格数据
    getTableData() {
      // 表格加载loading
      this.tableConfig.loading = true;
      //  请求
      this.$api
        .all(this.searchData)
        .then(res => {
          if (!res.data.data) {
            this.tableData = [];
            return;
          }
          // 处理未读电话参数arr
          let allId = [];
          // 呼叫时间/接通时间数据格式化
          res.data.data.forEach((e, i) => {
            if (e.direct === "未接" && e.handle === 0) {
              allId.push(e.id);
            }
            if (e.startTime) {
              // 扬州需求 时间精确到分钟
              if(window.g.IsYangZhouProject){
                  res.data.data[i].startTime = res.data.data[i].startTime.substring(0,res.data.data[i].startTime.lastIndexOf(':'))
              }
              res.data.data[i].startTime = e.startTime
                .trim()
                .replace(" ", "<br />");
            }
            if (e.connectedTime) {
              if(window.g.IsYangZhouProject){
                  res.data.data[i].connectedTime = res.data.data[i].connectedTime.substring(0,res.data.data[i].connectedTime.lastIndexOf(':'))
              }
              res.data.data[i].connectedTime = e.connectedTime
                .trim()
                .replace(" ", "<br />");
            }
            // 未接来电手动删除录音文件
            if (e.direct === "未接") {
              e.recordFile = "";
            }
          });
          // 返回的数据赋值给table
          this.tableData = res.data.data;
          // this.tableData[0].recordFile = 'hw202007171943486_6001.wav'
          this.pageConfig.total = res.data.totalElements;
          this.pageConfig.totalPages = res.data.totalPages;
          const _index = this.tableData.findIndex(el => el.id === this.currentRow.id);
          this.rowClick(res.data.data[_index !== -1 ? _index : 0]); // 默认运行一次行点击！！
          // openLab项目针对没有录音文件的电话录音模块要隐藏，切换已接、未接tab页时候，第一条数据会渲染不出来录音条，所以隔0.1秒后再运行一次
          if (this.IsOpenLabProject && res.data.data[_index !== -1 ? _index : 0].recordFile !== '') {
            setTimeout(() => {
              this.rowClick(res.data.data[_index !== -1 ? _index : 0]); // 默认运行一次行点击！！
            }, 100);
          }
          //处理未接电话
          if (allId.length !== 0) {
            this.$api.handleMissCalls({ id: allId }).then(res => {
              this.$store.commit("SET_ANSWERNUM"); //改变未读状态
            });
          }
          // 表格结束loading
          this.tableConfig.loading = false;
        })
        .catch(err => {
          // 表格结束loading
          this.tableConfig.loading = false;
        });
    },
    // 每页显示条数改变
    sizeChange(val) {
      this.searchData.size = val;
      this.getTableData();
    },
    // 页码改变
    currentChange(val) {
      this.searchData.page = val;
      this.getTableData();
      this.$refs.refTable.changePage() // qinjiaqi 翻页滚动条自动回到顶部
    },
    //语音转文字
    // TurnTheText(row) {
    //   alert(1)
      
    //   // this.$emit('TurnTheText',{id})
    //   console.log('turn the text func worked', row)
    //   let data = {
    //     phoneId:row.id
    //   }
    //   this.$api.phoneToText(data).then(res => {
    //     console.log(res)
    //     if (res.errorcode == 0) {
    //       if (res.msg == "暂无数据") {
    //         this.$message("暂无数据");
    //       }else{
    //         this.$refs.SpeechText.textarea = res.data
    //         this.SpeechTextFlag = true
    //       }
    //     }else{
    //       this.$message({
    //         message: res.msg,
    //         type: "error"
    //       });
    //     }
    //   })
    // },
    /**
     * @author hexinting
     * @param 无
     * @date 2020-10-14
     * @lastEditor hexinting
     * @lastDate 2020-10-14
     * @description 语音转文字
     */
    async TurnTheText(src, res) {
      this.$refs.SpeechText.textarea = '';
      this.SpeechTextFlag = true;
      this.$store.commit('setTurnToTextLoading', { loading: true });

      console.log(res)
      if (res.recordText) {
          this.$refs.SpeechText.textarea = res.recordText;
          this.$store.commit('setTurnToTextLoading', { loading: false });
      } else {
          if (!src || src === '') {
              this.$message.error('不存在录音文件');
              this.$store.commit('setTurnToTextLoading', { loading: false });
          } else {
              let response = await allApiRequest(src, { id: res.id });
              this.$refs.SpeechText.textarea = response;
              this.$store.commit('setTurnToTextLoading', { loading: false });
              
          }
      }
      // this.$emit('TurnTheText',{id})
      // let data = {
      //   // phoneId: id
      //   phoneId: 1269 // !!!! 暂时保留  测试使用
      // }
      // this.$api.phoneToText(data).then(res => {
      //   if (res.errorcode == 0) {
      //     if (res.msg == "暂无数据") {
      //       this.$message("暂无数据");
      //     } else {
      //       this.$refs.SpeechText.textarea = res.data
      //       this.SpeechTextFlag = true
      //     }
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: "error"
      //     });
      //   }
      // })
      // 换用讯飞的语音转写，先注释
      // if (res.recordFile) {
        // if (!JSON.parse(sessionStorage.getItem("phoneticTranscription"))) {
        //   sessionStorage.setItem(
        //     "phoneticTranscription",
        //     JSON.stringify({
        //       voiceAccessToken: "",
        //       voiceAccessTokenOverdue: true
        //     })
        //   );
        // }
        // let textRecognition = JSON.parse(
        //   sessionStorage.getItem("phoneticTranscription")
        // ); // 存储的语音转写对象

        // if (textRecognition.voiceAccessTokenOverdue) {
        //   // 获取百度AI access_token
        //   axios
        //     .get(
        //       "/api/oauth/2.0/token?grant_type=client_credentials&client_id=X3Z1OAofmdi17h6BjKpSadj2&client_secret=GiMhHr2cG9uSLCaGgEDpK9uHMq4S9Glf"
        //     )
        //     .then(res => {
        //       sessionStorage.setItem(
        //         "phoneticTranscription",
        //         JSON.stringify({
        //           voiceAccessToken: res.data.access_token,
        //           voiceAccessTokenOverdue: false
        //         })
        //       );
               
        //         console.log('textRecognition: ', JSON.parse(
        //         sessionStorage.getItem("phoneticTranscription")
        // ));
        //       setTimeout(() => {
        //         sessionStorage.setItem(
        //           "phoneticTranscription",
        //           JSON.stringify({
        //             voiceAccessToken: res.data.access_token,
        //             voiceAccessTokenOverdue: true
        //           })
        //         );
        //       }, (res.data.expires_in * 1000));
        //     });
        // }

        // // 百度AI 语音转写
        // let data = {
        //   speech_url: window.g.ApiUrl + res.url,
        //   format: "wav",
        //   pid: 80001,
        //   rate: 16000
        // };
        // axios
        //   .post(
        //     `/api/rpc/2.0/aasr/v1/create?access_token=${textRecognition.voiceAccessToken}`,
        //     data
        //   )
        //   .then(res => {
        //     let data2 = {
        //       task_ids: [res.data.task_id]
        //     };
        //     axios
        //       .post(
        //         `/api/rpc/2.0/aasr/v1/query?access_token=${textRecognition.voiceAccessToken}`,
        //         data2
        //       )
        //       .then(res => {
        //         this.$refs.SpeechText.textarea =
        //           res.data.tasks_info[0].task_status == "Success"
        //             ? res.data.tasks_info[0].task_result.result
        //             : "";
        //         this.SpeechTextFlag = true;
        //       });
        //   });
      // } else {
      //   this.$message.error("不存在录音文件");
      // }
      // 换用讯飞的语音转写，先注释
    },

    // 存为电话备注
    cellRemark(obj) {
      // !!! bigTemplate
      console.log(obj);
      this.rigth_form.emarks = obj.remark;
      this.tableData[this.rowIndex].remark = obj.remark;
      console.log('remark:', this.tableData[this.rowIndex].remark)
    },
    //关闭语音转文字
    closeSpeechTextEle() {
      this.SpeechTextFlag = false;
    },

    // 单击表格当行 row为单行数据
    rowClick(row) {
      this.rowIndex = this.tableData.findIndex(el => el.id === row.id); // 获取点击行在tableData中的索引
      this.tableConfig.rowIndex = this.rowIndex; // 索引存在表格配置中
      this.currentRow = row // 当前行
      this.tableConfig.currentRowKey = String(row.id) // 当前行的id存放在表格配置中
      
      console.log('tableConfig', this.tableConfig);
      console.log('rowIndex', this.rowIndex);
      console.log('点击：', row);//点击表格
      // console.log('类型',row.direct,555)
      //右侧表格内容
      this.rowId = row.id;
      this.rigth_form.emarks = row.remark;//电话备注
      this.rigth_form.company = row.unit !== '' ? row.unit : row.workUnit;//通话单位
      this.rigth_form.dealPhone=row.call;//报送号码
      this.rigth_form.startTime = row.startTime;//呼叫时间
      this.rigth_form.checked = false;
      this.rigth_form.dealName=row.contactor;//报送人
    

      // 获取当前行的关联事件
      if (row.eventId) {
        this.$api.findById({ id: row.eventId }).then(res => {
          if (row.eventId == 0) {
            this.rigth_form.eventId = "";
            this.rigth_form.eventTitle = "";
          } else {
            this.rigth_form.eventId = row.eventId;
            this.rigth_form.eventTitle = res.data.event.title;
          }
        });
      } else {
        this.rigth_form.eventId = "";
        this.rigth_form.eventTitle = "";
      }

      let getAllAudio = document.querySelectorAll("#content_del audio");
      // console.log(getAllAudio);
      let audioArray = Array.from(getAllAudio);

      if (!!row.recordFile) {
        this.rigth_form.recordFile = row.recordFile; // 录音文件地址
        this.audioSrc = this.ApiUrl + "/rec/" + this.rigth_form.recordFile;
        console.log(this.audioSrc); // http://192.168.3.27:8089/rec/20200511134140_13427521779_6001_CALLIN.wav
        audioArray.forEach((ele, index) => {
          ele.setAttribute("src", this.audioSrc);
          // console.log(ele.src)
        });
      } else {
        if (row.direct !== "未接") {
          this.$message("暂无录音文件");
        }
        this.audioSrc = "";
        audioArray.forEach((ele, index) => {
          ele.setAttribute("src", "");
          // console.log(ele.src)
        });
        // console.log(audioArray);
        // console.log(this.audioSrc);
      }

      // 二级功能
      row["number"] = row["call"];
      this.callInfo = row;
      // 判断号码是否加入黑名单
      let data = { phoneNumber: row.number };
      this.$api.checkBlacklist(data).then(res => {
        this.inBlacklist = res != (null || undefined || "");
        if (this.inBlacklist) {
          this.banUserIcon = banUser_a;
        } else {
          this.banUserIcon = banUser;
        }
      });

      const _that = this;

      setTimeout(() => {
        // 设置图片路径 用require()转换成base64
        let play = require("../../../../static/audioControls/play.png"),
          stop = require("../../../../static/audioControls/stop.png"),
          TurnTheText = require("../../../../static/audioControls/TurnTheText.png"),
          tailor = require("../../../../static/audioControls/tailor.png"),
          dow = require("../../../../static/audioControls/dow.png");

        let obj = {
          play,
          stop,
          TurnTheText,
          tailor,
          dow
        };
        let type = 'phoneHistory'
        // console.log(getAllAudio,Array.from(getAllAudio))
        console.log(audioArray);
        Array.from(audioArray).forEach((ele, index) => {
          let audio = new audioControls(
            ele.parentNode,
            ele.src,
            obj,
            false,
            _that.TurnTheText,
            _that.tailor,
            row,
            // _that,
            type
          );
          _that.audioEventList[index] = audio;
          audio.addIncident();
        });
      }, 100);

      this.expandSelectRowData = row;
    },
    //裁剪
    tailor(src) {
      console.log(src); // http://192.168.3.36:8088/rec/123456789.wav
      const _that = this;
      _that.tailorAudioFlag = true;
      // this.$refs.tailorAudio.audioUrlData = 'https://webfs.yun.kugou.com/202004171340/d2afae3feabfb9c2dddf35123194fade/G204/M04/14/15/rJQEAF54mXyARH7pADhZBi3y7ww709.mp3'
      setTimeout(() => {
        _that.$refs.tailorAudio.audioUrlData = src;
        _that.$refs.tailorAudio.expandSelectRowData = _that.expandSelectRowData;
        _that.$refs.tailorAudio.loadingAudio();
      }, 100);
    },
    //关闭裁剪
    tailorAudioClose() {
      this.tailorAudioFlag = false;
    },
    // 鼠标移出
    leaveIcon() {
      this.idx = -1;
    },
    leaveBanIcon() {
      if (this.inBlacklist) {
        this.banUserIcon = banUser_a;
      } else {
        this.banUserIcon = banUser;
      }
    },
    // 鼠标移入
    enterIcon(i) {
      this.idx = i;
    },
    enterBanIcon() {
      this.banUserIcon = banUser_a;
    },
    // 时间格式化
    timeFormat(val) {
      let date = new Date(val);
      let y = date.getFullYear();
      let m =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return y + "-" + m + "-" + d;
    },
    // 导出表格
    exportTable() {
      window.location.href = `${window.g.ApiUrl}/eos/history/exportPhoneList?callType=&dtStart=${this.searchData.dtStart}&dtEnd=+${this.searchData.dtEnd}&searchText=${this.searchData.searchText}&vcDirect=${this.searchData.vcDirect}`;
    },
    selectLeftTableEvent(obj) {
      this.tablePopoverVisible=false;
      this.left_form.eventTitle = obj.title;
      this.left_form.eventId = obj.id;
    },
    /**
     * @description: 选中的事件
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 20201119 14:56
     * @param {obj} 选中的事件信息
     * @return {*}
     */
    selectEvent(obj) {
      this.visible = false;
      this.rigth_form.eventTitle = obj.title;
      this.rigth_form.eventId = obj.id;
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.event_list = [];
      this.getAllEventlist();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.getAllEventlist();
    },
  }
}
</script>

<style scoped>
>>> .el-tabs__item {
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #999;
    padding: 0px 44px !important;
    background: #fbfcff;
    border: 1px solid #dddee1 !important;
}

>>> .el-tabs__header {
    background: white;
    margin-bottom: 0px;
}

>>> .el-tabs__nav .is-active {
    color: #333;
    background: white;
    border-bottom: 1px solid white !important;
}

>>> .el-tabs__nav .el-tabs__item:first-child {
    border-radius: 4px 0 0 0;
}

>>> .el-tabs__nav .el-tabs__item:last-child {
    border-radius: 0 4px 0 0;
}

.mgb14 {
    margin-bottom: 14px;
}

.phoneHistory .right_box {
    background: white;
    padding-top: 20px;
    border-left: 10px solid #ebeef5;
    border-radius: 3px;
    position: relative;
    height: 83vh; /* 修改高度 authorName qinjiaqi */
}

.right_box .rigth_form {
    padding: 0 35px 0px 16px;
    height: 70vh; /* 修改高度 authorName qinjiaqi */
}

.phoneHistory .right_box h3 {
    text-align: left;
    padding: 0px;
    padding-left: 12px;
    margin: 0px 0px 15px;
    font-size: 18px;
    font-weight: 600;
    position: relative;
}

.form_item_lh >>> .el-form-item__content {
    line-height: 0;
}

.phoneHistory .right_box h3:after {
    content: '';
    position: absolute;
    background: #0091ff;
    width: 3px;
    height: 18px;
    left: 0;
    top: 5px;
}

>>> .el-textarea__inner {
    padding: 6px 6px 36px 10px;
}

.last_form_item >>> .el-form-item__content {
    margin-left: 0 !important;
}

.table_box .commonBox {
    width: 11px;
    height: 11px;
    border-radius: 6px;
}

.table_box .Box1 {
    background: #0091ff;
}

.table_box .Box2 {
    background: #0bd295;
}

.table_box .Box3 {
    background: #f46666;
}

.right_icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
    margin-right: 20px;
}

.table_box {
    min-height: 620px;
}

.datePicker {
    position: relative;
}

.datePicker >>> .el-icon-date {
    position: absolute;
    right: 6px;
}

#content_del .control_wrap .img_del {
    position: relative !important;
    top: 5px !important;
}
</style>

<style>
/* 为 Tooltip 的 popper 添加类名 */
.popper_style {
    /* bug7746 author:hexinting date:2020-10-26 */
    width: 90px;
}
</style>