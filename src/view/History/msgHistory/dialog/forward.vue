<template>
  <div class="sms-tree relationFaxDialog">
    <el-row>
      <el-col :span="14" style="border-right: 1px solid #E9EBF0;">
        <el-row>
          <el-col :span="24">
            <nav-bar style="background-color: #F9FBFF;" :barDisabled="treeLoading" ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
                     @changTab="changTab" ></nav-bar>
          </el-col>
        </el-row>
        <el-col :span="10" style="padding-right: 0px;">
          <div style="padding: 20px 36px 10px; color: #666666;font-size:14px;border-bottom: 1px solid #E9EBF0">
            <template v-for="(item,i) in contactList">
              <div :class="{'shortcut_box':true,'mgb8':i===0}">
                <span :class="contactName === item.name? 'shortcut_active' : ''" @click="shortcutClick(item.name)">
                  <i :class="item.icon" class="mgr8" />{{item.name}}
                </span>
              </div>
            </template>
          </div>
          <div style="padding:10px; height: 580px;" class="common_input">
            <el-input placeholder="输入关键字搜索" v-model="treeConfig.filterText" class="mgb8">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-scrollbar style="height: 92%;" v-loading="treeLoading"
                          element-loading-text="加载中..."
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(255, 255, 255, 0.8)">
              <myTree ref="myFaxTree" :treeData="treeData" :defaultProps="defaultProps" :treeConfig="treeConfig" @nodeClick="nodeClick"></myTree>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="14" style="border-left: 1px solid #E9EBF0;">
          <div style="text-align: center;padding-top: 10px" class="common_input">
            <el-input style="width: 60%;" :disabled="contactName === '最近联系人'" @input="handleSearch" @keyup.enter.native="handleSearch" placeholder="输入关键字搜索" v-model="searchData.searchText" class="mgb8">
              <i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" @click="handleSearch"></i>
            </el-input>
          </div>
          <div class="my_table" style="min-height: 623px;">
            <myTable ref="smsTable" :tableColumn="tableColumn" :tableData="tableData" :tableConfig="tableConfig" @rowClick="rowClick" @selectAll="selectFaxAll" @selectionRow="selectionFaxRow"></myTable>
          </div>
          <div class="center_pagination" style="background: #fff;text-align: right; padding: 6px 0;" v-show="contactName !== '最近联系人'">
            <myPagination :pageConfig="pageConfig" :layout="layout" @sizeChange="sizeChange" @currentChange="currentChange"></myPagination>
          </div>
        </el-col>
      </el-col>

      <el-col :span="10" style="padding:10px">
        <div class="mgb10" style="height: 320px; padding: 10px 10px 35px; box-sizing: border-box; border-radius:4px;border:1px solid #ddd;position: relative;">
          <div style="height: 100%">
            <el-scrollbar style="height: 100%;">
              <el-tag
                style="margin:0 10px 10px 0"
                v-for="tag in tags"
                :key="tag.id"
                effect="plain"
                @close="handleTagClose(tag)"
                closable>
                {{tag.name || tag.contactor || tag.mobile}}
              </el-tag>
            </el-scrollbar>
          </div>
          <div class="addressee_box">
            <span>收信人</span>
            <div>{{tags.length}}</div>
          </div>
          <div class="operate_box">
            <span @click="handleEmpty">清空</span>
            <span @click="isAddPhonesShow = true">添加号码</span>
            <span @click="getSmsGroupData">保存分组</span>
          </div>
        </div>
        <!-- 信息选择框 -->
        <div class="mgb10" v-show="!moreShow">
          <h2 class="title" style="margin-bottom: 10px;">短信内容</h2>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
            class="textContent"
            v-model="textContent"
          >
          </el-input>
        </div>
        <div class="mgb10" v-show="moreShow" style="height: 328px;">
          <el-form
            v-model="msgForm1"
            label-width="80px"
            @submit.native.prevent
            label-position="right"
          >
            <el-row :gutter="gutter" style="margin:0 10px">
              <el-form-item label="短信类型:">
                <el-col :span="24">
                  <el-radio-group
                    ref="msgTypeRadio"
                    v-model="msgForm1.msgTypeId"
                    v-for="(item,key) in msgType"
                    :key="key"
                  >
                    <el-radio :label="item.id" style="margin-right: 10px">{{item.name}}</el-radio>
                  </el-radio-group>
                </el-col>
              </el-form-item>
            </el-row>
            <!-- bug12442 短信签名隐藏 -->
            <!-- <el-row :gutter="gutter" style="margin:0 10px">
              <el-form-item label="短信签名:">
                <el-col :span="13" style="padding:0">
                  <el-select
                    clearable
                    filterable
                    v-model="msgForm1.signature"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in signatureOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :offset="1" :span="4" style="padding:0">
                  <el-button plain size="small" @click="addSmsM">添加</el-button>
                </el-col>
                <el-col :offset="1" :span="4" style="padding:0">
                  <el-button plain size="small" @click="removerSmsSignature">删除</el-button>
                </el-col>
              </el-form-item>
            </el-row> -->
            <el-row :gutter="gutter" style="margin:0 10px" v-show="isSms">
              <el-form-item label="签名名称:">
                <el-col :span="16">
                  <el-input
                    v-model="msgForm1.signatureNew"
                    placeholder="请输入签名名称"
                    clearable
                    size="small"
                  ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" size="small" @click="addSmsSignature">保存</el-button>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="gutter" style="margin:0 10px">
              <el-form-item label="定时短信:">
                <el-date-picker
                  v-model="msgForm1.timedSMS"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptionsStart"
                  :disabled="!msgForm1.isTimingSMS"
                  value-format="timestamp"
                  placeholder="选择日期时间"
                  size="small"
                  style="width:240px;margin-right:5px;"
                ></el-date-picker>
                <!-- <el-checkbox v-model="msgForm1.isTimingSMS " :border="false"></el-checkbox> -->
                <el-switch v-model="msgForm1.isTimingSMS"></el-switch>
              </el-form-item>
            </el-row>
            <el-row :gutter="gutter" style="margin:0 10px">
              <el-form-item label="催报短信:">
                <el-row :gutter="gutter" style="margin: 0">
                  <!-- <el-col :span="2" style="padding:0 0"> -->
                  <!-- <el-checkbox v-model="msgForm1.isUrgeSMS" :border="false"></el-checkbox> -->
                  <!-- </el-col> -->
                  <el-input-number
                    v-model="msgForm1.times"
                    :disabled="!msgForm1.isUrgeSMS"
                    :min="1"
                    :max="99999"
                    size="small"
                    style="width:100px;margin-right:10px;"
                  ></el-input-number>间隔:
                  <el-select
                    v-model="msgForm1.interval"
                    :disabled="!msgForm1.isUrgeSMS"
                    size="small"
                    style="width:95px;"
                  >
                    <el-option
                      v-for="item in intervalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-switch v-model="msgForm1.isUrgeSMS" style="margin-left:5px;"></el-switch>
                </el-row>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        <!-- 图标 -->
        <div style="text-align: left;" class="icons">
          <div style="display: inline-block;" @click="showMore">
            <el-tooltip class="item" effect="dark" content="更多" placement="top" style="cursor: pointer">
              <el-button style="height: 35px;width: 35px;" class="icon more">
              </el-button>
            </el-tooltip>
          </div>
          <div style="display: inline-block;" @click="showTemplate">
            <el-tooltip class="item" effect="dark" content="模板" placement="top" style="cursor: pointer">
              <el-button style="height: 35px;width: 35px;" class="icon second">
              </el-button>
            </el-tooltip>
          </div>
          <div style="display: inline-block;background:rgba(249,252,255,1);" @click="getMsgOperatorSign">
            <el-tooltip class="item" effect="dark" content="预览" placement="top" style="cursor: pointer" >
              <el-button style="height: 35px;width: 35px;" class="icon third">
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="footer_box" style="border-top:1px solid #E9ECF1;text-align: right">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sendMsg">{{type=='转发'?'发送':'确认'}}</el-button>
    </div>



    <!--添加号码对话框-->
    <el-dialog :visible.sync="isAddPhonesShow" title="添加号码" width="30%" :close-on-click-modal="false" append-to-body>
      <el-input type="textarea" resize="none" :autosize="{minRows:4,maxRows:4}" v-model="phonesText"
                placeholder="请输入号码，多个号码使用英文“,”隔开"></el-input>
      <div slot="footer"  class="dialog-footer">
        <el-button @click="submitClose">取 消</el-button>
        <el-button type="primary" @click="submitPhones">确 定</el-button>
      </div>
    </el-dialog>

    <!--存为分组-->
    <el-dialog
      class="storGroupDialog"
      :visible.sync="storGroupVisible"
      :close-on-click-modal="false"
      append-to-body
      title="存为短信分组"
      width="30%">
      <div style="height: 230px" v-if="storGroupVisible">
        <el-scrollbar style="height: 100%">
          <myTree
            ref="myFaxTree"
            :treeData="treeStorGroupData"
            :defaultProps="defaultProps"
            :treeConfig="treeConfig"
            @nodeClick="nodeStorGroupClick"></myTree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<template>-->
        <!--<el-radio v-model="storRadio" label="append">追加联系人</el-radio>-->
        <!--<el-radio v-model="storRadio" label="overwrite">覆盖原有联系人</el-radio>-->
        <!--</template>-->
        <el-button @click="storGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveContactsToGroup">保 存</el-button>
      </span>
      <el-dialog
        append-to-body
        :visible.sync="typeVisible"
        :close-on-click-modal="false"
        title="提示"
        width="30%">
        <span>请选择存为分组的保存模式</span>
        <div style="height: 50px;text-align: right;padding-top: 30px">
          <el-button style="" type="primary" @click="contactsToGroup('append')">追加</el-button>
          <el-button style="" type="primary" @click="contactsToGroup('overwrite')">覆盖</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog
      :visible.sync="msgDialogVisible"
      width="13.2%"
      :before-close="handleClose"
      :show-close="false"
      custom-class="preview"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="msg-dialog">
        <div style="height: 410px;overflow: auto;transform: translateY(40px)" class="scrollbar">
          <span>{{msgOperatorSign + textContent }}{{msgForm1.signature?'【'+msgForm1.signature+'】':''}}</span>
        </div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="msgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="msgDialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>

    <!-- 模板 -->
    <msg-template ref="MsgTemplate" @selectTemplate="selectTemplate" v-if="MsgTemplateVisble" @closeDialog="MsgTemplateVisble=false"></msg-template>


  </div>
</template>

<script>
  import navBar from "../../components/navBar"
  import myTree from "../../components/myTree"
  import myTable from "../../components/myTable"
  import myPagination from '../../components/myPagination'
  import MsgTemplate from "@/view/integratedCommunication/icpSms/informationTransmission/msgTemplate";

  export default {
    name: "forward",
    components:{
      navBar,
      myTree,
      myTable,
      myPagination,
      MsgTemplate,
    },
    computed:{
    },
    data(){
      return{
        selectedName: "政务联络网",//默认选中导航条
        navBarList: [
          {
            name: "政务联络网"
          },{
            name: "应急联动网"
          },{
            name: "基层联络网"
          },{
            name: "备勤联络网"
          },{
            name: "资源联络网"
          },{
            name: "短信分组"
          },
        ],

        contactName: '',
        contactList: [
          // {i:0, name:'常用联系人', icon: 'el-icon-star-off'},
          {i:1, name:'最近联系人', icon: 'el-icon-time'}
        ],

        // 标签
        tags: [],

        // 短信内容
        textContent:'',
        // 关联事件
        relationEvent:undefined,

        // 表格筛选数据
        searchData:{
          id:'',
          isTop: '',
          groupId: '',  //树节点ID
          searchText: '',   //搜索内容
          type: "sms",
          page: 1,
          size: 10
        },
        // 树数据配置
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeLoading: false,
        treeConfig: {
          filterText: '', //筛选内容
          checkbox: false,
          loading: false,
        },

        // 中间表格配置数据
        tableColumn: [
          {label:'姓名',prop:'contactor',width:90},
          {label:'职位',prop:'position',width:130},
          {label:'单位',prop:'workUnit'},
        ],
        tableData:[],
        tableConfig: {
          height: '620px',
          loading: false,
          selection: true,
        },


        // 分页器配置
        pageConfig:{
          total: 0,
          currentPage: 1,
          totalPages: 1,
          small: true,
          background: false
        },
        layout: 'prev, pager, next, sizes, jumper',

        // 添加号码
        isAddPhonesShow: false,
        phonesText: '',//电话号码输入框

        // 存为分组
        // storRadio: 'append',
        storGroupVisible: false,
        treeStorGroupData: [],

        // 预览
        msgOperatorSign:'',
        msgDialogVisible:false,

        // 模板
        MsgTemplateVisble: false,
        contentid:'', // 主键id

        // 更多
        moreShow:false,
        msgForm1: {
          msgTypeId: "",
          signature: "",
          signatureNew: "",
          isTimingSMS: false, //是否为定时短信
          timedSMS: Number(new Date()), //定时短信
          interval: "",
          isUrgeSMS: false,
          times: ""
        },
        msgType: {
          id: "",
          name: ""
        },
        gutter: 20,
        signatureOptions: [], //短信签名选择框
        isSms:false,
        signatureId:'', //短信签名id
        pickerOptionsStart: {
          disabledDate(time) {
            return (
              time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },
        // 催报间隔时间
        intervalOptions: [
          {
            label: "1分钟",
            value: 1
          },
          {
            label: "3分钟",
            value: 3
          },
          {
            label: "5分钟",
            value: 5
          },
          {
            label: "10分钟",
            value: 10
          },
          {
            label: "15分钟",
            value: 15
          }
        ],

        // 按钮名称
        type:'',
        successText:'',

        // 存为分组
        keys:'',//选中树节点的id
        typeVisible:false,
        Savetype:'',
      }
    },
    created(){
      this.getPhoneGroupingTree('政务联络网')
      this.getSmsType();
      this.getFindSmsSign();
    },
    methods: {
      // 获取树数据
      getPhoneGroupingTree(msg) {
        // 发送请求前显示loading加载中...
        this.treeLoading = true
        if (msg === '政务联络网'){
          this.$api.phoneGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeData = res.data
            this.treeLoading = false
          })
        } else if (msg === '应急联动网') {
          this.$api.getBriefsByClassId({id:0}).then(res =>{
            if (!res.data){
              this.treeData = []
              return
            }
            let arrayId = res.data
            let resData = []
            let statusIdx = 0
            arrayId.forEach(e => {
              statusIdx++
              this.$api.getStructTree({id:e.id}).then(res => {
                if (!res.data){
                  return
                }
                statusIdx--
                if (res.data.length > 0){
                  resData = [...resData,...res.data]
                }
                if (statusIdx === 0){
                  this.treeData = [...resData]
                  this.treeLoading = false
                }
              })
            })
          })
        } else if (msg === '基层联络网') {
          this.$api.gliaisonGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeData = res.data
            this.treeLoading = false
          })
        } else if (msg === '备勤联络网') {
          this.$api.dutyGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeData = res.data
            this.treeLoading = false
          })
        } else if (msg === '资源联络网') {
          this.$api.resourceGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeData = res.data
            this.treeLoading = false
          })
        } else if (msg === '短信分组') {
          this.$api.smsGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeData = res.data
            this.treeLoading = false
          })
        }
      },
      // tabs切换
      changTab(tabName) {
        // 判断防止多次点击同一tabs发送同一请求
        if (this.selectedName != tabName){
          this.getPhoneGroupingTree(tabName)  //发送请求更新树节点
          this.selectedName = tabName

          // 需要初始化的数据
          this.initRightData()
          this.searchData.searchText = '' //树筛选数据
        }
      },
      // 常用联系人/最近联系人切换
      shortcutClick(name){
        // 判断防止多次点击发送同一请求
        if(this.contactName != name){
          this.contactName = name
          this.getContactList(name)

          // 需要初始化的数据
          this.tableData = []   //清空表格数据
          this.searchData.groupId = ''
          this.searchData.id = ''
          this.searchData.searchText = '' //树筛选数据
          this.searchData.page = 1
          this.treeConfig.filterText =  '' //筛选内容
        }
      },
      // 获取常用联系人/最近联系人
      getContactList(name){
        this.tableConfig.loading = true
        if (name === '常用联系人'){
          this.tableColumn[0].prop = 'name'
          this.$api.commonContactorList(this.searchData).then(res => {
            if (!res.data.data){
              this.treeData = []
              return
            }
            this.tableData = res.data.data
            this.pageConfig.total = res.data.totalElements
            this.pageConfig.totalPages = res.data.totalPages
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        } else if(name === '最近联系人'){
          this.tableColumn[0].prop = 'name'
          this.$api.getRecentContactorList().then(res => {
            if (!res.data.data){
              this.treeData = []
              return
            }
            this.tableData = res.data.data
            this.pageConfig.total = res.data.totalElements
            this.pageConfig.totalPages = res.data.totalPages
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        }
      },
      // 树节点点击时
      nodeClick(nodeData,node){
        // 判断防止多次点击发送同一请求
        if (this.searchData.groupId !== nodeData.id){
          if (node.parent.parent === null){
            this.searchData.isTop = true
          }else {
            this.searchData.isTop = false
          }
          this.searchData.groupId = nodeData.id
          this.searchData.id = nodeData.id
          this.getTableOfTreeData()
          // 需要初始化的数据
          this.initRightData()
        }
      },
      // 筛选表格数据
      handleSearch(){
        this.searchData.page = 1
        this.pageConfig.currentPage = 1
        this.getTableOfTreeData()
      },
      // 获取表格数据
      getTableOfTreeData(){
        this.tableConfig.loading = true
        this.tableColumn[0].prop = 'name'
        if(this.selectedName === '应急联动网'){
          this.$api.emergencyAddressBook(this.searchData).then(res => {
            if (!res.data.data){
              this.treeData = []
              return
            }
            this.tableData = res.data.data
            this.pageConfig.total = res.data.totalElements
            this.pageConfig.totalPages = res.data.totalPages
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        }else {
          this.$api.contactorList(this.searchData).then(res =>{
            if (!res.data.data){
              this.treeData = []
              return
            }
            this.tableData = res.data.list
            this.pageConfig.total = res.data.totalCount
            this.pageConfig.totalPages = res.data.totalPage
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        }
      },
      // fax表格点击全选
      selectFaxAll(rows){
        if (rows.length === 0){
          return
        }
        if (this.contactName === '最近联系人') {
          this.filtrateContacts(rows)
        }else {
          console.log(rows)
          let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
          this.existFaxNumber(inNumberArr)
        }
        // if (rows.length === 0){
        //   return
        // }
        // let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        // this.existFaxNumber(inNumberArr)
      },
      // fax表格点击单选
      selectionFaxRow(rows){
        if (rows.length === 0){
          return
        }
        if (this.contactName === '最近联系人') {
          this.filtrateContacts(rows)
        }else {
          let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
          this.existFaxNumber(inNumberArr)
        }
        // if (rows.length === 0){
        //   return
        // }
        // let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        // this.existFaxNumber(inNumberArr)
      },
      // 处理不存在传真号码情况并返回不存在的传真号码[0]和存在的传真号码[1]的数组
      disposeFaxNumber(rows){
        // 拿到存在的传真号码
        let inNumberArr = []
        // 处理不存在传真号码
        let notNumberArr = []
        let notNumberNameArr = []
        rows.forEach((rowE,rowI) =>{
          if (rowE.number || rowE.call){
            inNumberArr.push(rowE)
          }else {
            notNumberArr.push(rowE)
            if (rowE.name || rowE.name === ''){
              notNumberNameArr.push(rowE.name)
            } else {
              notNumberNameArr.push(rowE.contactor)
            }
          }
        })
        if (notNumberNameArr.length > 0){
          let notNumberString = notNumberNameArr.join()
          this.$message({
            type:'info',
            message:`(${notNumberString})不存在号码`
          })
          this.$refs.smsTable.toggleRowSelection(notNumberArr)
        }
        return [notNumberArr,inNumberArr]
      },
      // 处理存在号码
      existFaxNumber(inNumberArr){
        inNumberArr.forEach((rowE,rowI) =>{
          let exist = this.tags.some(e => e.id === rowE.id)
          if(!exist){
            this.tags = [...this.tags,rowE]
          }
        })
      },
      // 最近联系人筛选
      filtrateContacts(rows){
        let contactIds = []
        let notContactIds = []
        let inContacts = []   //存在联系人
        let notContacts = []  //不存在联系人
        rows.forEach(e => {
          if (e.contactorId>0){
            contactIds.push(e.contactorId)
          }else {
            console.log(e)
            if(/^[1][3,4,5,6,7,8][0-9]{9}$/.test(e.call)){
              let obj = {
                name:e.call,
                number:e.call,
                id:0,
              }
              let exist = this.tags.some(e => e.number == obj.number)
              if(!exist){
                this.tags = [...this.tags,obj]
              }
              // inContacts.push(obj)
            }else{
              notContactIds.push(e.contactorId)
            }
          }
        })
        if (contactIds.length > 0){
          let parmas = {
            ids:contactIds,
            type:'sms',
          }
          console.log(parmas)
          this.$api.findAllContactors(parmas).then(res =>{
            if (res.data){
              console.log(res.data)
              notContacts = res.data.notExistIds  //不存在联系人的id
              // 存在联系人的id
              res.data.contactors.forEach(e =>{
                if (e.number !=='' ){
                  inContacts.push(e)  //存在number
                } else {
                  notContacts.push(e.id)  //不存在number
                }
              })
              // this.$refs.smsTable.toggleRowSelection(notContacts,'最近联系人')
              if (notContacts.length > 0){
                this.$refs.smsTable.toggleRowSelection(notContacts,'短信最近联系人')
                this.$message({
                  type:'info',
                  message:`联系人号码不能为空!`
                })
              }
              this.existFaxNumber(inContacts)
            }
          })
        }
        if(notContactIds.length > 0){
          this.$refs.smsTable.toggleRowSelection(notContactIds,'短信最近联系人')
          this.$message({
            type:'info',
            message:`联系人不存在或号码不存在!`
          })
        }
      },
      // 选择项发生变化时会触发该事件
      selectionChange(rows){

      },
      //清空联系人
      handleEmpty(){
        this.tags = []
        this.$refs.smsTable.toggleRowSelection()
      },
      // 添加号码取消
      submitClose(){
        this.phonesText ='';
        this.isAddPhonesShow = false;
      },
      // 添加号码确认
      submitPhones(){
        if(this.phonesText.length==0){
          this.$message.warning('输入不能为空');
        }else {
          let data = this.phonesText.split(/[,，]/)||[];
          console.log(data)
          data = [...new Set(data)];
          let numberCorrect = [];
          let numberError = [];
          let numberRepetition = []
          data.forEach(e =>{
            if(/^[1][3,4,5,6,7,8][0-9]{9}$/.test(e)){
              numberCorrect.push(e)
            }else{
              numberError.push(e)
            }
          })
          // 号码不符合
          if (numberError.length > 0) {
            let numberErrorS = numberError.join()
            this.$message.warning(`您输入的(${numberErrorS})手机号码不符合!`);
          }

          numberCorrect.forEach(numE =>{
            let someNumber = this.tags.some(tagE =>{ return numE === tagE.number || numE === tagE.call})
            if (someNumber){
              numberRepetition.push(numE)
            }else {
              // this.tags.push({
              //   name:numE,
              //   number:numE,
              // })
              let arg = { phoneNum: numE };
              this.$api.findContactorByMobile(arg).then(res=>{
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error"
                  });
                }
                if(res.data.id == 0){
                  this.tags.push({
                    id: 0,
                    name: numE,
                    number: numE,
                  });
                }else{
                  this.tags.push(res.data)
                }

              })
            }
          })
          // 号码已重复
          if (numberRepetition.length > 0){
            let numberRepetitionS = numberRepetition.join()
            setTimeout(() =>{
              this.$message.warning(`您输入的(${numberRepetitionS})号码已重复!`);
            },500)
          }

          this.isAddPhonesShow = false;
          this.phonesText = ''
        }
      },
      // 获取短信分组
      getSmsGroupData() {
        if(this.tags.length == 0){
          this.$message({message:'请选择联系人',type:'error'})
          return
        }
        let data = {
          displayDefault: true
        }
        this.$api.smsGroupList(data).then(res => {
          this.storGroupVisible = true
          this.keys = '' // 重置选中分组
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.treeStorGroupData = res.data || [];
        })

      },
      // 点击存为分组树节点
      nodeStorGroupClick(nodeData,node){
        this.keys = nodeData.id
      },
      // 点击保存
      saveContactsToGroup(){
        if(this.keys == ''){
          this.$message({
            type:'warning',
            message:'请点击分组'
          })
          return
        }
        this.typeVisible = true
      },
      contactsToGroup(type){
        console.log(this.tags)
        let contactorData = []
          this.tags.forEach(item=>{
            let obj = {}
            obj['id'] = item.contactorId || item.id
            obj['number'] = item.number || item.call
            contactorData.push(obj)
        })
        let data = {
          groupId: this.keys,
          type,
          contactorData,
        };
        this.$api.addContactsToGroup(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          console.log(res);
          this.$message({
            message: "存为短信分组成功",
            type: "success"
          });
          this.storGroupVisible = false

        });
        this.typeVisible = false
      },
      // 删除单个联系人
      handleTagClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.$refs.smsTable.toggleRowSelection([tag])
      },
      // 点击表格当行数据
      rowClick(row){

      },
      // 10条/页改变
      sizeChange(val){
        this.searchData.size = val
        if (this.contactName === '常用联系人' || this.contactName === '最近联系人') {
          this.getContactList(this.contactName)
        }else {
          this.getTableOfTreeData()
        }
      },
      // 页码改变
      currentChange(val){
        this.searchData.page = val
        if (this.contactName === '常用联系人' || this.contactName === '最近联系人') {
          this.getContactList(this.contactName)
        }else {
          this.getTableOfTreeData()
        }
      },
      initRightData(){
        this.tableData = []   //清空表格数据
        this.searchData.page = 1
        this.pageConfig.currentPage = 1
        this.treeConfig.filterText =  '' //筛选内容
        this.contactName = ''       //不选中常用联系人/最近联系人
        this.pageConfig.total = 0
        this.pageConfig.totalPages = 1
      },




      // 点击取消
      close(){
        this.$emit('closeDialog',false)
        // console.log(this.tags)
      },
      // 点击确认或者发送
      Send(){
        // let spliceData = this.spliceData()
        // let data = {
        //   data:{
        //     content:this.textContent,
        //     caseId:this.eventId,
        //     phoneNum:spliceData[0],
        //     contactorIds:spliceData[1],
        //   }
        // }
        // this.$api.addSmsQueue(data).then(res=>{
        //   if (res.errorcode != 0) {
        //     this.$message({
        //       message: res.msg,
        //       type: "error"
        //     });
        //     return
        //   }
        //   this.$message({
        //     message: this.successText,
        //     type: "success"
        //   });
        //
        // })
        console.log(this.tags)
      },
      sendMsg() {
        if (this.textContent == "" || this.textContent == null) {
          this.$message.warning("短信内容不能为空!");
          return;
        }
        if (this.tags.length == 0) {
          this.$message.warning("请添加收信人!");
          return;
        } else {
          this.$confirm("确认发送短信?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              if (!this.msgForm1.isUrgeSMS) {
                this.addSmsQueue(); //不是催报短信发送方法
              } else {
                this.addPromptSmsQueue();
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消发送"
              });
            });
        }
      },
      addPromptSmsQueue() {
        //发现这里还没有调接口，这里是更多选项里的
        let phones = [];
        let contactorIds = [];
        for (let i = 0; i < this.tags.length; i++) {
          phones.push(Number(this.tags[i].call || this.tags[i].number || this.tags[i].mobile));
          contactorIds.push(this.tags[i].contactorId || 0);
        }
        let phoneArry = [...new Set(phones)];
        let msgcontent;
        let caseId;

        if (this.eventId == "") {
          caseId = 0;
        } else {
          caseId = this.eventId;
        }
        if (
          this.msgForm1.signature == "" ||
          this.msgForm1.signature == null ||
          this.msgForm1.signature == undefined
        ) {
          msgcontent = this.textContent;
        } else {
          msgcontent =
            this.textContent + "【" + this.msgForm1.signature + "】";
        }

        //相同号码去重
        let json = {
          smstypeId: this.msgForm1.msgTypeId,
          caseId: caseId,
          content: msgcontent,
          phoneNum: phoneArry.toString(),
          interval: this.msgForm1.interval,
          count: this.msgForm1.times,
          contactorIds: contactorIds.join(",")
        };
        let data = {
          data: json
        };
        this.$api.addPromptSmsQueue(data).then(res => {
          if (res.errorcode == "0") {
            this.$message({
              message: "短信下发中...",
              type: "success"
            });
            return;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      addSmsQueue() {
        let phones = [];
        let contactorIds = [];
        console.log('联系人id：', this.tags)
        for (let i = 0; i < this.tags.length; i++) {
          phones.push(Number(this.tags[i].call || this.tags[i].number || this.tags[i].mobile));
          contactorIds.push(this.tags[i].contactorId || this.tags[i].id);
        }
        let phoneArry = [...new Set(phones)];
        let msgcontent;
        let caseId;

        if (this.eventId == "") {
          caseId = 0;
        } else {
          caseId = this.eventId;
        }
        if (
          this.msgForm1.signature == "" ||
          this.msgForm1.signature == null ||
          this.msgForm1.signature == undefined
        ) {
          msgcontent = this.textContent;
        } else {
          msgcontent =
            this.textContent + "【" + this.msgForm1.signature + "】";
        }
        let json;
        //相同号码去重
        // if (this.reEdit) {
        //   json = {
        //     id: this.msgId,
        //     reEdit: this.reEdit,
        //     smstypeId: this.msgForm1.msgTypeId,
        //     caseId: caseId,
        //     content: msgcontent,
        //     phoneNum: phoneArry.toString(),
        //     contactorIds: contactorIds.join(",")
        //   };
        // } else {
        //   json = {
        //     smstypeId: this.msgForm1.msgTypeId,
        //     caseId: caseId,
        //     content: msgcontent,
        //     phoneNum: phoneArry.toString(),
        //     contactorIds: contactorIds.join(",")
        //   };
        // }
        // console.log(json);
        // if (this.msgHeadleState == "yes") {
        //   Object.assign(json, {
        //     historyType: this.$store.state.msgHeadleData.sendType,
        //     historyId: this.$store.state.msgHeadleData.sendTypeId
        //   });
        // }
        json = {
              smstypeId: this.msgForm1.msgTypeId,
              caseId: caseId,
              content: msgcontent,
              phoneNum: phoneArry.toString(),
              contactorIds: contactorIds.join(",")
            };
        if (this.msgForm1.isTimingSMS) {
          json["sendTime"] = this.msgForm1.timedSMS;
        }
        let data = {
          data: JSON.stringify(json)
        };
        this.$api.addSmsQueue(data).then(res => {
          if (res.errorcode == "0") {
            this.$message({
              message: "短信已加入发送队列，等待发送",
              type: "success"
            });
            return;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // 拼接电话和联系人id的参数
      spliceData(){
        let phoneNum = ''
        let ids = ''
        this.tags.forEach(item=>{
          if(item.number || item.call){
            phoneNum = phoneNum + (item.number || item.call) + ','
            ids = ids + item.contactorId + ','
          }
        })
        if(phoneNum.charAt(phoneNum.length-1) == ','){
          phoneNum = phoneNum.substring(0, phoneNum.length - 1);
        }
        if(ids.charAt(ids.length-1) == ','){
          ids = ids.substring(0, ids.length - 1);
        }
        return [phoneNum,ids]
      },
      getMsgOperatorSign(){
        this.$api.getMsgOperatorSign().then(res => {
          if (res.errorcode !== 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.msgOperatorSign = res.data
          this.msgDialogVisible = true;
        });

      },
      // 关闭
      handleClose(){
        this.msgDialogVisible = false
      },
      // 显示模板
      showTemplate() {
        // this.$emit("showTemple", true);
        this.MsgTemplateVisble = true;
        this.$nextTick(() => {
          this.$refs.MsgTemplate.getSmsMould();
        });
      },
      //选取模板
      selectTemplate(item) {
        // console.log('item: ', item);
        if (item.id != "") {
          this.contentid = item.id;
        }
        this.textContent = item.text;
        console.log("item.text: ", item);
        // this.$emit("showTemple", false);
        this.MsgTemplateVisble = false;
      },
      // 更多
      showMore(){
        this.moreShow = !this.moreShow
        console.log(this.textContent,this.msgForm1)
      },
      //获取短信类型
      getSmsType() {
        let data;
        this.$api.smsType(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.msgType = res.data;
          console.log(res.data[0].id,'获取短信类型')
          this.msgForm1.msgTypeId = res.data[0].id;
        });
      },
      //获取短信签名
      getFindSmsSign() {
        let data;
        this.$api.findSmsSign(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.signatureOptions = res.data;
        });
      },
      // 点击添加签名
      addSmsM() {
        this.isSms = !this.isSms;
      },
      //根据短信签名校验id
      validateSmsSignature(name) {
        for (let key in this.signatureOptions) {
          if (this.signatureOptions[key].value == name)
            this.signatureId = this.signatureOptions[key].id;
        }
      },
      //删除短信签名
      removerSmsSignature() {
        if (this.msgForm1.signature == "" || this.msgForm1.signature == null) {
          this.$message.error("请选择需要删除的签名!");
          return false;
        }
        this.validateSmsSignature(this.msgForm1.signature);
        let data = {
          id: this.signatureId
        };
        this.$api.deleteSmsSign(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("删除成功!");
          this.signatureId = null;
          this.msgForm1.signature = "";
          this.getFindSmsSign();
        });
      },
      //添加短信签名
      addSmsSignature() {
        if (
          this.msgForm1.signatureNew == null
        ) {
          this.$message.error("短信签名不能为空!");
          return;
        }

        let data = {
          data: {
            value: this.msgForm1.signatureNew
          }
        };
        this.$api.addSmsSign(data).then(res => {
          if (res.errorcod != 0) {
            this.$message.success("保存成功!");
            this.msgForm1.signature = "";
            this.msgForm1.signatureNew = "";
            this.isSms = false;
            this.getFindSmsSign();
          } else {
            this.$message.error(res.msg);
          }
        });
      },
    },

  }
</script>

<style scoped>
  .mgr4{
    margin-right: 4px;
  }
  .mgr8{
    margin-right: 8px;
  }
  .mgl8{
    margin-left: 8px;
  }
  .mgb8{
    margin-bottom: 8px;
  }
  .mgb10{
    margin-bottom: 10px;
  }
  .narBar{
    margin: 0px;
  }
  >>>.el-tabs__item{
    font-size: 16px;
    color: #666666;
    height: 48px;
    line-height: 48px;
  }

  >>>.is-active{
    color: #333 !important;
  }

  .shortcut_box span{
    cursor: pointer;
  }
  .shortcut_active{
    color: #0091ff;
  }
  .common_input >>>.el-input__inner{
    height: 36px;
    border-radius: 7px;
  }

  .center_pagination >>>.el-pagination__sizes{
    margin: 0;
  }

  .center_pagination >>>.el-input--mini .el-input__inner{
    line-height: 22px;
    height: 22px;
  }
  .center_pagination >>>.el-pagination__jump{
    margin: 0;
  }

  .addressee_box{
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  .addressee_box span{
    font-size: 14px;
    color: #666;
  }
  .addressee_box div{
    display: inline-block;
    padding: 5px 10px;
    background: #F3F3F7;
    border-radius:6px;
  }

  .operate_box{
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .operate_box span{
    font-size: 14px;
    color: #0091FF;
    padding: 0 8px;
    cursor: pointer;
    border-right: 1px solid #D8D8D8;
  }
  .operate_box span:last-child{
    border: none;
  }



  .sendFaxBox{
    padding: 10px 20px 0 0;
  }

  .sendFaxBox >>> .el-form-item{
    margin-bottom: 10px;
  }
  .fax_upload_box >>>.el-button{
    padding: 8px 10px;
  }
  .sendFaxBox>>>.el-input__inner{
    height: 36px;
  }
  .template_btn{
    position: absolute;
    top: 5px;
    left: 90px;
  }
  .fax-action{
    padding: 10px 10px 10px 10px;
    background-color: #F9FCFF;
  }
  .faxTitle-input >>> .el-input__inner {
    height: 36px;
  }
  .faxTitle-input >>> .el-input__icon {
    line-height: 30px;
  }
  .btn-upload{
    height: 32px;
    padding: 5px;
    font-size: 12px;
  }

  .icon-preview{
    background-image: url(../../../../assets/icpImg/preview2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-preview:hover{
    background-image: url(../../../../assets/icpImg/preview1.png);
    cursor: pointer;
  }
  .icon-scan{
    background-image: url(../../../../assets/icpImg/scan2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-scan:hover{
    background-image: url(../../../../assets/icpImg/scan1.png);
    cursor: pointer;
  }
  .icon-PictureUpload{
    background-image: url(../../../../assets/icpImg/PictureUpload2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-PictureUpload:hover{
    background-image: url(../../../../assets/icpImg/PictureUpload1.png);
    cursor: pointer;
  }

  .footer_box{
    padding: 18px 30px 22px 0;
  }
  .footer_box >>> .el-button{
    padding: 8px 15px;
    font-size: 16px;
  }

  .faxTemplateDialog >>> .el-dialog__body{
    padding: 8px 20px;
  }
  faxTemplateDialog >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 100%;
  }

  .title{
    position: relative;
    padding-left: 11px;
    font-size: 20px;
    line-height: 28px;
    margin: 0;
  }
  .title::before{
    content: '';
    position: absolute;
    top:4px;
    left: 0;
    background: rgba(0,145,255,1) ;
    width: 3px;
    height: 20px;
  }
  .textContent >>>.el-textarea__inner{
    min-height: 290px!important;
    max-height: 290px!important;
  }

  .icons{
    padding: 15px;
  }
  .icon.more{
    background-image: url('/static/img/ConvergedCommunication/more.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon.more:hover{
    background-image: url('/static/img/ConvergedCommunication/moreHover.png');
  }
  .icon.second{
    background-image: url('/static/img/ConvergedCommunication/template.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon.second:hover{
    background-image: url('/static/img/ConvergedCommunication/templateHover.png');
  }
  .icon.third{
    background-image: url('/static/img/ConvergedCommunication/SMSPreview.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon.third:hover{
    background-image: url('/static/img/ConvergedCommunication/SMSPreviewHover.png');
  }

  .msg-dialog {
    /*border:1px solid green;*/
    height: 482px;
    /* overflow: scroll; */
    background: url("/static/img/msgPreview.png") no-repeat;
    background-size: 100% 100%;
  }
  .msg-dialog span {
    display: inline-block;
    margin: 0% 18% 10% 18%;
  }
  .el-tag--plain{
    background-color: rgba(250,250,250,1);
    border:1px solid rgba(224,224,224,1);
    color: black;
  }
  .el-tag--plain >>>.el-tag__close{
    color: black;
    background: white;
  }
  .scrollbar::-webkit-scrollbar{
    display: none;
  }
</style>
<style lang="scss" scoped>
  /deep/ .preview {
    border-radius: 34px;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
</style>
