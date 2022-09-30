<template>
  <div class="sms-tree relationFaxDialog">
    <el-row>
      <el-col style="border-right: 1px solid #E9EBF0;">
        <el-row>
          <el-col :span="24">
            <nav-bar style="background-color: #F9FBFF;" :barDisabled="treeLoading" ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
                     @changTab="changTab" ></nav-bar>
          </el-col>
        </el-row>
        <el-col :span="6" style="padding-right: 0px;">
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
        <el-col :span="18" style="border-left: 1px solid #E9EBF0;">
          <el-row>
            <el-form ref="contactForm" :model="contactForm">

            </el-form>
          </el-row>

        </el-col>
      </el-col>

    </el-row>
    <div class="footer_box" style="border-top:1px solid #E9ECF1;text-align: right">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="Send">保存</el-button>
    </div>

    <!--传真模板弹窗-->
    <el-dialog
      append-to-body
      title="选择模板"
      class="faxTemplateDialog"
      :close-on-click-modal="false"
      :visible.sync="faxTemplateVisible"
      width="1200px"
      top="5vh">
      <el-row>
        <el-col :span="4" style="height:648px">
          <el-scrollbar style="height:100%">
            <div v-if="faxTemplateTreeList.length === 0" style="text-align: center;color: #666">
              暂无模板数据
            </div>
            <!--<myTree></myTree>-->
          </el-scrollbar>
        </el-col>
        <!--<el-col :span="20">-->
        <!--<div>-->
        <!--<editor-bar-->
        <!--:heightEditor="heightEditor"-->
        <!--:noneDisplay="noneDisplay"-->
        <!--ref="editorBar"-->
        <!--v-model="editor.info"-->
        <!--:isClear="isClear"></editor-bar>-->
        <!--<div style="padding: 10px">-->
        <!--<div style="font-size:14px;color: #333;margin-bottom: 10px;text-align: left"><i class="el-icon-s-order" />剪切板信息</div>-->
        <!--<el-input-->
        <!--style="font-size: 14px"-->
        <!--type="textarea"-->
        <!--:rows="4"-->
        <!--placeholder="请输入内容"-->
        <!--v-model="shearVal">-->
        <!--</el-input>-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-col>-->
      </el-row>
      <div style="text-align: right; margin-top: 8px">
        <el-button style="padding: 10px 25px" @click="faxTemplateVisible = false">取 消</el-button>
        <el-button style="padding: 10px 25px" type="primary" @click="">确 认</el-button>
      </div>
    </el-dialog>
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
  import navBar from "../../components/navBar"
  import myTree from "../../components/myTree"
  import myTable from "../../components/myTable"
  import myPagination from '../../components/myPagination'
  import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox";
  import {replaceContactorGroupsConfig, filterGroupName} from '@/assets/js/yz_common.js'

  export default {
    name: "contactAddDetails",
    components:{
      navBar,
      myTree,
      myTable,
      myPagination,
      promptDialogBox
    },
    props: {

    },
    data(){
      return{
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        // selectedName: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网",//默认选中导航条
        selectedName: "政务联络网",//默认选中导航条
        selectedCode: "phone",//默认选中导航条
        navBarList: [
          {
            name: "政务联络网",
            code: "phone",
            enabled: true
          },{
            name: "应急联动网",
            code: "linkage",
            enabled: true
          },{
            name: "基层联络网",
            code: "gliaison",
            enabled: true
          },{
            name: "备勤联络网",
            code: "dutyGroup",
            enabled: true
          },{
            name: "资源联络网",
            code: "resource",
            enabled: true
          },{
            name: "传真分组",
            code: "faxgroup",
            enabled: true
          }
        ],
        // navBarList: window.g.IsYangZhouProject ? [
        //   {
        //     name: "政务通信录"
        //   },{
        //     name: "应急通信录"
        //   },
        //   // {
        //   //   name: "基层联络网"
        //   // },{
        //   //   name: "备勤联络网"
        //   // },{
        //   //   name: "资源联络网"
        //   // },
        //   {
        //     name: "传真分组"
        //   },
        // ] : [
        //   {
        //     name: "政务联络网"
        //   },{
        //     name: "应急联动网"
        //   },{
        //     name: "基层联络网"
        //   },{
        //     name: "备勤联络网"
        //   },{
        //     name: "资源联络网"
        //   },{
        //     name: "传真分组"
        //   },
        // ],

        // 表单数据
        contactForm: {
          id: "",//联系人id
          name: "",//姓名
          sex: 0,//性别 默认为0（未知）
          position: "",//职务
          workUnit: "",//工作单位
          mobile: "",//手机号码
          otherTel: "",//备用手机
          temobile: "",//手持终端
          officeTel: "",//办公电话
          homeTel: "",//应急电话
          otherTel2: "",//其它电话
          fax: "",//传真电话
          email: "",//邮箱
          importance: 0,//紧急程度 默认为0（未知）
          commonlyUsed: 0,//常用联系人(大于0即为常用联系人，小于等于0取消常用联系人)
          remark: "",//备注
        },
        contactName: '',
        contactCode: '', // commonlyused(常用联系人) / recentcontact(最近联系人)



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
          checkbox: true,
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

        successText:'',

        // 传真模板弹窗
        faxTemplateVisible: false,  // 传真模板弹窗
        faxTemplateTreeList: [],  //传真模板数据
        promptConfig: { // 提示弹窗的配置
          visible: false, // 是否显示弹窗
          promptType: 'warn', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
          promptTitle: '敏感信息发送提醒', // 弹窗标题
          promptText: '即将通过非密网络发送信息，请勿发送泄密信息', // 弹窗文本
          cancelButtonText: '取消发送', // 取消操作按钮文本
          confirmButtonText: '立即发送', // 确认操作按钮文本
          isNeedIcon: true  // 是否需要显示左边的图标
        }
      }
    },
    created(){
      // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
      // if (this.IsYangZhouProject) {
      //   this.getPhoneGroupingTree('政务通信录')
      // } else {
      //   this.getPhoneGroupingTree('政务联络网')
      // }
      this.getPhoneGroupingTree('phone') // 获取树数据
      // 3.0不要这个方法了
      // this.initContactorGroupsConfig() // 初始化分组配置
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-11-05
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 初始化分组配置
       */
      initContactorGroupsConfig() {
        let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups")); // 后端返回的分组配置列表
        this.navBarList = replaceContactorGroupsConfig(this.navBarList); // 根据后端返回分组，替换联系人大分组名字配置
        // 导航栏
        let filterGroup = this.navBarList.filter(item => item && item.code === "phone");
        if (filterGroup.length === 0) { // 如果没有配置政务联络网
          this.selectedName = this.navBarList[0].name; // 默认选中第一个
          this.selectedCode = this.navBarList[0].code; // 默认选中第一个
        } else {
          this.selectedName = filterGroup[0].name;
          this.selectedCode = filterGroup[0].code;
        }
      },
      /**
       * @author hexinting
       * @date 2020-10-25
       * @lastEditor hexinting
       * @lastDate 2020-10-25
       * @description 弹窗确认按钮
       */
      promptConfirm() {
        this.sendSms() // 发送短信
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
      /**
       * @param {String} msg 分组code
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @descrition 获取树数据
       */
      getPhoneGroupingTree(msg) {
        // 发送请求前显示loading加载中...
        this.treeLoading = true
        // if (msg === '政务联络网' || msg === '政务通信录'){
        if (msg === 'phone'){
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
        // } else if (msg === '应急联动网' || msg === '应急通信录') {
        } else if (msg === 'linkage') {
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
        // } else if (msg === '基层联络网') {
        } else if (msg === 'gliaison') {
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
        // } else if (msg === '备勤联络网') {
        } else if (msg === 'dutyGroup') {
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
        // } else if (msg === '资源联络网') {
        } else if (msg === 'resource') {
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
        // } else if (msg === '传真分组') {
        } else if (msg === 'faxgroup') {
          this.$api.faxGroupList({displayDefault: true}).then(res => {
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
      /**
       * @param {String} tabName tab名字
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description tabs切换
       */
      changTab(tabName) {
        // 判断防止多次点击同一tabs发送同一请求
        if (this.selectedName != tabName){
          let groupCode = filterGroupName(tabName); // 过滤分组名字,查找code
          this.getPhoneGroupingTree(groupCode)  //发送请求更新树节点
          // this.getPhoneGroupingTree(tabName)  //发送请求更新树节点
          this.selectedName = tabName;
          this.selectedCode = groupCode;

          // 需要初始化的数据
          this.initRightData()
          this.searchData.searchText = '' //树筛选数据
        }
      },
      /**
       * @param {Object} item 激活tab
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 常用联系人/最近联系人切换
       */
      shortcutClick(item){
        // 判断防止多次点击发送同一请求
        if(this.contactName != item.name){
          this.contactName = item.name // 分组名字
          this.contactCode = item.code // 分组code
          // this.getContactList(name)
          this.getContactList(item.code) // 根据code获取常用联系人/最近联系人

          // 需要初始化的数据
          this.tableData = []   //清空表格数据
          this.searchData.groupId = ''
          this.searchData.id = ''
          this.searchData.searchText = '' //树筛选数据
          this.searchData.page = 1
          this.treeConfig.filterText =  '' //筛选内容
        }
      },
      /**
       * @param {String} code 分组code
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 获取常用联系人/最近联系人
       */
      getContactList(code){
        this.tableConfig.loading = true
        // if (name === '常用联系人'){ // 注释原因： 动态配置联系人大分组
        if (code === 'commonlyused'){
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
        // } else if(name === '最近联系人'){ // 注释原因： 动态配置联系人大分组
        } else if(code === 'recentcontact'){
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
      /**
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 获取表格数据
       */
      getTableOfTreeData(){
        this.tableConfig.loading = true
        this.tableColumn[0].prop = 'name'
        // if(this.selectedName === '应急联动网' || this.selectedName === '应急通信录'){
        if(this.selectedCode === 'linkage'){
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
        let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        this.existFaxNumber(inNumberArr)
      },
      // fax表格点击单选
      selectionFaxRow(rows){
        if (rows.length === 0){
          return
        }
        let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        this.existFaxNumber(inNumberArr)
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
          this.$refs.faxTable.toggleRowSelection(notNumberArr)
        }
        return [notNumberArr,inNumberArr]
      },
      // 处理存在传真号码
      existFaxNumber(inNumberArr){
        inNumberArr.forEach((rowE,rowI) =>{
          let exist = this.tags.some(e => e.id === rowE.id)
          if(!exist){
            this.tags = [...this.tags,rowE]
          }
        })
      },
      // 选择项发生变化时会触发该事件
      selectionChange(rows){

      },
      //清空联系人
      handleEmpty(){
        this.tags = []
        this.$refs.faxTable.toggleRowSelection()
      },
      // 删除单个联系人
      handleTagClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.$refs.faxTable.toggleRowSelection([tag])
      },
      // 点击表格当行数据
      rowClick(row){

      },
      /**
       * @param {Number} val 页条
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 10条/页改变
       */
      sizeChange(val){
        this.searchData.size = val
        // if (this.contactName === '常用联系人' || this.contactName === '最近联系人') {
        if (this.contactCode === 'commonlyused' || this.contactCode === 'recentcontact') {
          this.getContactList(this.contactName)
        }else {
          this.getTableOfTreeData()
        }
      },
      /**
       * @param {Number} val 页码
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 页码改变
       */
      currentChange(val){
        this.searchData.page = val
        // if (this.contactName === '常用联系人' || this.contactName === '最近联系人') {{
        if (this.contactCode === 'commonlyused' || this.contactCode === 'recentcontact') {
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


      // 传真弹窗
      // 点击传真模板按钮
      handleFaxTemplate(){
        this.faxTemplateVisible = true;   // 弹窗
        //获取传真模板数据
        this.$api.getFaxTemplateTree().then(res => {
          if (!res.data){
            this.faxTemplateTreeList = []
            return
          }
          this.faxTemplateTreeList = res.data
        })
      },

      // 点击取消
      close(){
        // this.$emit('closeDialog',false)
        console.log(this.tags)
      },
      /**
       * @lastDate 2020-10-25
       * @lastEditor hexinting
       * @description 点击确认或者发送
       */
      Send(){
        // 任务133 author:hexinting date:2020-10-25
        this.smsData = json; // 存放短信数据
        if (this.IsYangZhouProject) {
          this.promptConfig.visible = true; // 显示提示弹窗
        } else {
          this.sendSms() // 发送短信
        }
      },
      /**
       * @lastDate 2020-10-25
       * @lastEditor hexinting
       * @description 发送短信
       */
      sendSms() {
        let spliceData = this.spliceData()
        let data = {
          data:{
            content:this.textContent,
            caseId:this.eventId,
            phoneNum:spliceData[0],
            contactorIds:spliceData[1],
          }
        }
        this.$api.addSmsQueue(data).then(res=>{
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.$message({
            message: this.successText,
            type: "success"
          });
        })
        if (this.IsYangZhouProject) { // 扬州项目需求：发送之前添加提醒 任务133
          this.promptConfig.visible = false; // 显示弹窗提醒
        }
      },
      // 凭借电话和联系人id的参数
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
      }
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
    background-image: url('/static/img/msgIcon/gengduo.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon.second{
    background-image: url('/static/img/msgIcon/second.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon.second:hover{
    background-image: url('/static/img/msgIcon/second_active.png');
  }
  .icon.third{
    background-image: url('/static/img/msgIcon/third.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon.third:hover{
    background-image: url('/static/img/msgIcon/third_active.png');

  }
</style>


