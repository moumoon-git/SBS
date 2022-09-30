<template>
  <div class="sms-tree dialogForward" >
    <div class="shadow"></div>
    <el-row style="height: 50px;position: relative;background: #F1F4F6">
      <h3 style="text-align: left;line-height: 50px;font-size: 17px;margin:0 0 0 20px">短信发送</h3>
      <div style="position: absolute;right: 10px;top: 10px;font-size: 25px;cursor: pointer;" @click="close"><span class="el-icon-close"></span></div>
    </el-row>
    <el-row class="content" >
      <el-col :span="14" style="border-right: 1px solid #E9EBF0;">
        <el-row>
          <el-col :span="24">
            <nav-bar style="background-color: #F9FBFF;"  ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
                     @changTab="changTab" ></nav-bar>
          </el-col>
        </el-row>
        <el-col :span="10" style="border-right: 1px solid #E9EBF0;padding-right: 0px;">
          <div style="padding: 20px 36px 10px; color: #666666;font-size:14px;border-bottom: 1px solid #E9EBF0">
            <!-- <div class="shortcut_box mgb8">
            <span :class="idx === 1? 'shortcut_active' : ''" @click="shortcutClick(1)">
              <i class="el-icon-star-off mgr8" />常用联系人
            </span>
            </div> -->
            <div class="shortcut_box">
            <span :class="idx === 2? 'shortcut_active' : ''" @click="shortcutClick(2)">
              <i class="el-icon-time mgr8" />最近联系人
            </span>
            </div>
          </div>
          <div style="padding:10px; height: 580px;" class="common_input">
            <el-input placeholder="输入关键字搜索" v-model="filterText" class="mgb8">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-scrollbar style="height: 92%;">
              <myTree v-if="selectedName == '政务联络网'" ></myTree>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="14">
          <div style="text-align: center;padding-top: 10px" class="common_input">
            <el-input style="width: 60%;" placeholder="输入关键字搜索" v-model="filterText" class="mgb8">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="my_table" style="min-height: 585px">
            <myTable :tableColumn="tableColumn" :tableData="tableData" :tableConfig="tableConfig" @rowClick="rowClick"></myTable>
          </div>
          <div class="center_pagination" style="background: #fff;text-align: right; padding: 6px 0;">
            <myPagination :pageConfig="pageConfig" :layout="layout" @sizeChange="sizeChange" @currentChange="currentChange"></myPagination>
          </div>
        </el-col>
      </el-col>

      <el-col :span="10" style="padding:10px">
        <div class="mgb10" style="height: 225px; padding:10px; border-radius:4px;border:1px solid #ddd;position: relative;">
          <el-tag
            style="margin:0 10px 10px 0"
            v-for="tag,i in tags"
            :key="i"
            closable
            :type="tag.type">
            {{tag.name}}
          </el-tag>
          <div class="addressee_box">
            <span>收信人</span>
            <div>6</div>
          </div>
        </div>
        <div class="mgb10" >
          <h2 class="title" style="margin-bottom: 28px;">短信内容</h2>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textContent"
            maxlength="500"
            show-word-limit
            class="textContent"
          >
          </el-input>
        </div>
<!--        图标-->
        <div style="text-align: left;">
          <div style="display: inline-block;margin-left: 20px;">
            <el-tooltip class="item" effect="dark" content="更多" placement="top" style="cursor: pointer">
              <el-button style="height: 35px;width: 35px;" class="icon gengduo">
              </el-button>
            </el-tooltip>
          </div>
          <div style="display: inline-block;">
            <el-tooltip class="item" effect="dark" content="更多" placement="top" style="cursor: pointer">
              <el-button style="height: 35px;width: 35px;" class="icon gengduo">
              </el-button>
            </el-tooltip>
          </div>
          <div style="display: inline-block;background:rgba(249,252,255,1);">
            <el-tooltip class="item" effect="dark" content="更多" placement="top" style="cursor: pointer">
              <el-button style="height: 35px;width: 35px;" class="icon gengduo">
              </el-button>
            </el-tooltip>
          </div>
        </div>
        <!-- 传真信息选择框 -->
<!--        <div class="mgb10">-->
<!--          <el-form class="faxForm" ref="faxForm" v-model="faxForm" label-width="95px" >-->
<!--            <div class="sendFaxBox">-->
<!--              <el-form-item label="传真标题">-->
<!--                <el-input placeholder="标题" v-model="faxForm.faxTitle"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="传真文件" class="fax_upload_box">-->
<!--                <div style="position: relative;">-->
<!--                  &lt;!&ndash;<el-upload&ndash;&gt;-->
<!--                  &lt;!&ndash;class="upload-demo"&ndash;&gt;-->
<!--                  &lt;!&ndash;ref="upload"&ndash;&gt;-->
<!--                  &lt;!&ndash;accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"&ndash;&gt;-->
<!--                  &lt;!&ndash;:limit="1"&ndash;&gt;-->
<!--                  &lt;!&ndash;:action="action"&ndash;&gt;-->
<!--                  &lt;!&ndash;auto-upload&ndash;&gt;-->
<!--                  &lt;!&ndash;with-credentials&ndash;&gt;-->
<!--                  &lt;!&ndash;:file-list="faxFileList"&ndash;&gt;-->
<!--                  &lt;!&ndash;:on-remove="handleRemove"&ndash;&gt;-->
<!--                  &lt;!&ndash;:before-upload="beforeUpload"&ndash;&gt;-->
<!--                  &lt;!&ndash;:on-exceed="onExceed"&ndash;&gt;-->
<!--                  &lt;!&ndash;:on-success="onSuccess"&ndash;&gt;-->
<!--                  &lt;!&ndash;:show-file-list="true">&ndash;&gt;-->
<!--                  &lt;!&ndash;<el-button class="btn-upload"><i class="el-icon-upload2 mgr8" />上传文件</el-button>&ndash;&gt;-->
<!--                  &lt;!&ndash;</el-upload>&ndash;&gt;-->
<!--                  &lt;!&ndash;<el-button class="template_btn mgl8"><i class="el-icon-upload2 mgr8" />选择模板</el-button>&ndash;&gt;-->
<!--                </div>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="传真回执" class="fax_upload_box">-->
<!--                &lt;!&ndash;<el-upload&ndash;&gt;-->
<!--                &lt;!&ndash;class="upload-demo"&ndash;&gt;-->
<!--                &lt;!&ndash;ref="upload"&ndash;&gt;-->
<!--                &lt;!&ndash;accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"&ndash;&gt;-->
<!--                &lt;!&ndash;:limit="1"&ndash;&gt;-->
<!--                &lt;!&ndash;:action="action"&ndash;&gt;-->
<!--                &lt;!&ndash;auto-upload&ndash;&gt;-->
<!--                &lt;!&ndash;with-credentials&ndash;&gt;-->
<!--                &lt;!&ndash;:file-list="receiptFileList"&ndash;&gt;-->
<!--                &lt;!&ndash;:on-remove="receiptFileHandleRemove"&ndash;&gt;-->
<!--                &lt;!&ndash;:before-upload="receiptFilebeforeUpload"&ndash;&gt;-->
<!--                &lt;!&ndash;:on-exceed="onExceed"&ndash;&gt;-->
<!--                &lt;!&ndash;:on-success="receiptFileonSuccess"&ndash;&gt;-->
<!--                &lt;!&ndash;:show-file-list="true">&ndash;&gt;-->
<!--                &lt;!&ndash;<el-button class="btn-upload" slot="trigger" plain><i class="el-icon-upload2 mgr8" />上传文件</el-button>&ndash;&gt;-->
<!--                &lt;!&ndash;<span slot="tip" class="el-upload__tip mgl8">支持扩展名：.doc .pdf .jpg...</span>&ndash;&gt;-->
<!--                &lt;!&ndash;</el-upload>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--              <el-form-item label="关联事件" >-->
<!--                <el-select v-model="faxForm.caseId" placeholder="请选择" class="faxTitle-input" style="width:100%">-->
<!--                  &lt;!&ndash;<el-option&ndash;&gt;-->
<!--                  &lt;!&ndash;v-for="item in eventOptions"&ndash;&gt;-->
<!--                  &lt;!&ndash;:key="item.value"&ndash;&gt;-->
<!--                  &lt;!&ndash;:label="item.label"&ndash;&gt;-->
<!--                  &lt;!&ndash;:value="item.value">&ndash;&gt;-->
<!--                  &lt;!&ndash;</el-option>&ndash;&gt;-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </div>-->

<!--            <div class="fax-action">-->
<!--              <el-row type="flex" align="middle">-->
<!--                <el-col :span="2">-->
<!--                  <el-tooltip content="预览" placement="top">-->
<!--                    &lt;!&ndash;@click="previewSubmit"&ndash;&gt;-->
<!--                    <div class="icon-preview" ></div>-->
<!--                  </el-tooltip>-->
<!--                </el-col>-->
<!--                <el-col :span="2">-->
<!--                  <el-tooltip content="扫描" placement="top">-->
<!--                    &lt;!&ndash;@click="ScanUpload"&ndash;&gt;-->
<!--                    <div class="icon-scan"></div>-->
<!--                  </el-tooltip>-->
<!--                </el-col>-->
<!--                <el-col :span="2">-->
<!--                  <el-tooltip content="图片上传" placement="top">-->
<!--                    &lt;!&ndash;@click="PictureUpload"&ndash;&gt;-->
<!--                    <div class="icon-PictureUpload"></div>-->
<!--                  </el-tooltip>-->
<!--                </el-col>-->

<!--                <el-col :span="9" :offset="6">-->
<!--                  <el-date-picker class="faxTitle-input"-->
<!--                                  v-model="faxForm.sendingTime"-->
<!--                                  value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                                  format="yyyy-MM-dd HH:mm"-->
<!--                                  type="datetime"-->
<!--                                  placeholder="选择发送时间"-->
<!--                                  style="width:195px">-->
<!--                  </el-date-picker>-->
<!--                </el-col>-->
<!--                <el-col :span="2">-->
<!--                  <el-button type="primary" size="mini">发送</el-button>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </div>-->
<!--          </el-form>-->
<!--        </div>-->
        <!-- 传真队列 -->
<!--        <div class="my_table">-->
<!--          <myTable :tableColumn="tableFaxQueueColumn" :tableData="tableFaxQueueData" :tableConfig="tableFaxQueueConfig">-->
<!--            <template slot="operate" slot-scope="data">-->
<!--              <el-link class="mgr4" type="primary" :underline="false">查看</el-link>-->
<!--              <el-link type="primary" :underline="false">撤销</el-link>-->
<!--            </template>-->
<!--          </myTable>-->
<!--        </div>-->
        <div class="footer_box" style="text-align: right;border-top:1px solid #E9ECF1;">
          <el-button @click="close">取消</el-button>
          <el-button type="primary">发送</el-button>
        </div>
      </el-col>

    </el-row>
<!--    <div class="footer_box" style="border-top:1px solid #E9ECF1;text-align: right">-->
<!--      <el-button @click="zhuanfaFlag = !zhuanfaFlag">取消</el-button>-->
<!--      <el-button type="primary">发送</el-button>-->
<!--    </div>-->
  </div>
</template>

<script>
  import navBar from "../components/navBar"
  import myTree from "../components/myTree"
  import myTable from "../components/myTable"
  import myPagination from '../components/myPagination'

  export default {
    name: "dialogForward",
    components:{
      navBar,
      myTree,
      myTable,
      myPagination,
    },
    props:{
      // zhuanfaFlag:{
      //   type: Boolean,
      //   default: false
      // }
    },
    data(){
      return{
        idx: 0,
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
            name: "传真分组"
          },
        ],

        // 标签
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],

        faxForm:{
          caseId: '',//事件关联
          faxTitle: '',//传真标题
          sendingTime: '',//发送时间(默认显示当前时间)
          faxFileName: '',//传真文件地址
          receiptFileName: '',//回执文件
          pictureFileName:[],//图片
        },//传真文件表单

        // 中间表格配置数据
        tableColumn: [
          {label:'姓名',prop:'direct',width:90,slot:true},
          {label:'职位',prop:'workUnitCall',width:130,slot:true},
          {label:'单位',prop:'sendtime',slot:true},
        ],
        tableData:[],
        tableConfig: {
          height: '620px',
          loading: false,
          selection: true,
        },

        // 传真队列表格配置数据
        tableFaxQueueColumn: [
          {label:'发送方式',prop:'direct'},
          {label:'总数',prop:'workUnitCall',width:60},
          {label:'成功',prop:'a',width:60},
          {label:'失败',prop:'b',width:60},
          {label:'待发',prop:'c',width:60},
          {label:'状态',prop:'d',width:60},
          {label:'操作',prop:'operate',slot:true,center:'center',width:120},
        ],
        tableFaxQueueData:[
          {direct:1132}
        ],
        tableFaxQueueConfig: {
          height: '620px',
          loading: false,
          selection: true,
        },

        filterText: '', //树节点关键字筛选
        textContent:'',
        // 分页器配置
        pageConfig:{
          total: 0,
          currentPage: 1,
          totalPages: 1,
          small: true,
          background: false
        },
        layout: 'prev, pager, next, sizes, jumper',

        formData1: {//政务联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData2: {//常用联系人
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData3: {//最近联系人
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 20,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData4: {//应急联动网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {},
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData5: {//基层联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {},
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData6: {//备勤联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {},
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData7: {//资源联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData8: {//短信分组
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
      }
    },
    methods: {
      changTab(tabName) {
        console.log(tabName)
        this.selectedName=tabName;
      },
      shortcutClick(i){
        this.idx = i
      },
      // 点击表格当行数据
      rowClick(){

      },
      // 10条/页改变
      sizeChange(val){
        // this.filtrateData.size = val
        // this.getFaxList()
      },
      // 页码改变
      currentChange(val){
        // this.filtrateData.page = val - 1
        // this.getFaxList()
      },
      // 关闭弹窗
      close(){
        this.$emit('closeDialog',false)
      },
      // 获取政务联络网
      getData1(){

      }

    },
    mounted() {
      this.getData1()
    }
  }
</script>

<style scoped>
  .shadow{
    width: 1920px;
    height: 1127px;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.4);
    z-index: -1;
  }
  .dialogForward{
    background: white;
    position: fixed;
    top: 7%;
    left: 13%;
    z-index: 999;
    box-shadow:0px 0px 21px 3px rgba(0,0,0,0.27);
    border-radius:7px;
  }
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
    /*margin-bottom: 10px;*/
    margin: 15px;
    text-align: left;
  }
  .narBar{
    margin: 0px;
  }
  .content{
    position: relative;
    width:1518px;
    height:800px;
    background:rgba(255,255,255,1);
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

  .faxForm{
    border: 1px solid #DDDDDD;
    border-radius: 4px;
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
  .icon.gengduo{
    background-image: url('/static/img/msgIcon/gengduo.png');
    background-size: 35px 35px;
    border: 0;
  }
  .icon-preview{
    /*background-image: url(../../../../assets/icpImg/preview2.png);*/
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-preview:hover{
    /*background-image: url(../../../../assets/icpImg/preview1.png);*/
    cursor: pointer;
  }
  .icon-scan{
    /*background-image: url(../../../../assets/icpImg/scan2.png);*/
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-scan:hover{
    /*background-image: url(../../../../assets/icpImg/scan1.png);*/
    cursor: pointer;
  }
  .icon-PictureUpload{
    /*background-image: url(../../../../assets/icpImg/PictureUpload2.png);*/
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-PictureUpload:hover{
    /*background-image: url(../../../../assets/icpImg/PictureUpload1.png);*/
    cursor: pointer;
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
    min-height: 320px!important;
    max-height: 320px!important;
  }
  .footer_box{
    /*position: absolute;*/
    /*bottom: 0;*/
    /*right: 0;*/
    /*background: white;*/
    margin-top: 10px;
    padding: 18px 30px 22px 0;
  }
  .footer_box >>> .el-button{
    padding: 8px 15px;
    font-size: 16px;
  }
</style>

