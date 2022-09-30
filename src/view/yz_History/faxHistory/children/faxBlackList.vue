<!-- author:hexinting date:10-14 lastEditor:hexinting lastDate:10-14 description:传真黑名单组件-->
<template>
  <!--传真黑名单-->
  <div class="faxBlackList">
    <div class="left_top_box">
      <div class="mgr14 font_style">类型</div>
      <el-select class="mgr14" style="width: 112px" v-model="searchData.direct" clearable placeholder="请选择">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        class="mgr14 datePicker"
        v-model="timeVal"
        type="daterange"
        range-separator=" "
        start-placeholder="请选择日期范围"
        @change="handleTimeChange">
      </el-date-picker>
      <el-input class="mgr14" v-model="searchData.searchText" placeholder="请输入关键字" style="width: 253px;border-bottom-right-radius:0px ;border-top-right-radius:0px;">
        <el-button slot="append" style="font-size:16px; height: 40px;background: #3F92FE;color: white;border-bottom-left-radius:0px ;border-top-left-radius:0px;" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <div class="table_box">
      <myTable :tableColumn="tableColumn" :tableData="tableData" :tableConfig="tableConfig" @rowClick="rowClick" ref="refTable">
        <!--收/发-->
        <template slot="direct" slot-scope="data">
          <div class="direct_box" v-if="data.slotData.direct === '已收'">
            <div class="Box1 commonBox"></div>
            <div style="margin-left: 6px">接收</div>
          </div>
          <div class="direct_box" v-else-if="data.slotData.direct === '已发'">
            <div class="Box2 commonBox"></div>
            <div style="margin-left: 6px">发送</div>
          </div>
        </template>
        <!--单位/号码-->
        <template slot="workUnitCall" slot-scope="data">
          {{data.slotData.workUnit}}<br/>{{data.slotData.call || data.slotData.calling}}
        </template>
        <!--呼叫时间-->
        <template slot="sendtime" slot-scope="data">
          <div v-html="isYangZhouProject?data.slotData.sendtime.substring(0,data.slotData.sendtime.lastIndexOf(':')):data.slotData.sendtime"></div>
        </template>
        <!--传真状态-->
        <template slot="faxType" slot-scope="data">
          <div v-if="data.slotData.direct === '已收'">
            <div class="comonFaxType unread" v-if="data.slotData.read === '未读'">{{data.slotData.read}}</div>
            <div class="comonFaxType read" v-else-if="data.slotData.read === '已读'">{{data.slotData.read}}</div>
          </div>
          <div v-else-if="data.slotData.direct === '已发'">
            <div class="comonFaxType succ" v-if="data.slotData.success === '成功'">发送{{data.slotData.success}}</div>
            <div class="comonFaxType ban" v-else-if="data.slotData.success === '失败'">发送{{data.slotData.success}}</div>
          </div>
        </template>
        <!--处置-->
        <template slot="processingName" slot-scope="data">
          <div style="color: #F46666" v-if="data.slotData.processingName === '默认处置中'">
            {{data.slotData.processingName}}
          </div>
          <div style="color: #0091FF" v-else-if="data.slotData.processingName === '处置中'">
            {{data.slotData.processingName}}
          </div>
          <div style="color: #999999" v-else-if="data.slotData.processingName === '无需处置'">
            {{data.slotData.processingName}}
          </div>
          <div style="color: #0BD295" v-else-if="data.slotData.processingName === '已处置'">
            {{data.slotData.processingName}}
          </div>
          <div v-else style="color: #666666">
            ----
          </div>
        </template>
        <!--事件标题-->
        <template slot="eventTitle" slot-scope="data">
          <span>{{data.slotData.eventTitle !== '' ? data.slotData.eventTitle : '----'}}</span>
        </template>
        <!--标题/类型-->
        <template slot="titleType" slot-scope="data">
          {{data.slotData.title}}<br/>{{data.slotData.type}}
        </template>
        <!--操作-->
        <template slot="operate" slot-scope="data">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete iconHandle mgr8" @click.stop="handleFaxDelete(data.slotData.id)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="恢复" placement="top">
            <img src="/../../../../static/img/icon/recover.png" alt="恢复" class="img_recover" @click.stop="handleFaxRecover(data.slotData)">
          </el-tooltip>
        </template>
      </myTable>
    </div>
    <div class="my_pagination" style="background: #fff; text-align: right; padding:14px 0">
      <myPagination :pageConfig="pageConfig" @sizeChange="sizeChange" @currentChange="currentChange"></myPagination>
    </div>
  </div>
</template>

<script>
  import myTable from "../../components/myTable"
  import myPagination from '../../components/myPagination'

  import {confirmDelete} from '@/assets/js/yz_common.js'

  export default {
    name: "faxBlackList",
    components:{
      myTable,
      myPagination
    },
    data(){
      return{
        typeList: [
          {label: '已发',value: '1'},
          {label: '已收',value: '0'},
        ],
        timeVal: '',
        // 表格筛选数据
        searchData:{
          direct: '',  //类型
          dtStart: '',       //开始时间
          dtEnd: '',         //结束时间
          searchText: '',   //搜索内容
          page: 1,
          size: 10,
          blacklist: 1   // 黑名单传真
        },

        rowData: {},    //点击回收站表格存放单行数据,防止多次点击同一行而重复请求

        // 表格配置数据
        tableColumn: [
          {label:'收/发',prop:'direct',width:120,slot:true},
          {label:'单位/号码',prop:'workUnitCall',width:155,slot:true},
          {label:'收/发时间',prop:'sendtime',width:155,slot:true},
          {label:'传真状态',prop:'faxType',width:125,slot:true},
          {label:'处置状态',prop:'processingName',width:135,slot:true},
          {label:'事件标题',prop:'eventTitle',width:135,slot:true},
          {label:'标题/类型',prop:'titleType',slot:true},
          {label:'操作',prop:'operate',width:80,slot:true,center:'center'},
        ],
        tableData:[],
        tableConfig: {
          height: '610px',
          loading: false,
          // selection: false,
        },

        // 分页器配置
        pageConfig:{
          total: 0,
          currentPage: 1,
          totalPages: 0,
          small: false,
          background: true
        }
      }
    },
    mounted(){
      this.getBlackFaxList()
    },
    methods:{
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 筛选时间
       */
      handleTimeChange(val){
        if (val){
          this.searchData.dtStart = this.timeFormat(val[0])
          this.searchData.dtEnd = this.timeFormat(val[1])
        } else {
          this.searchData.dtStart = ''
          this.searchData.dtEnd = ''
        }
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 获取传真数据
       */
      getBlackFaxList(){
        this.$api.fax(this.searchData).then((res) => {
          if (!res.data.data || res.data.data.length === 0){
            this.tableData = []
            return
          }
          // 收/发时间数据格式化
          res.data.data.forEach((e,i) =>{
            if (e.sendtime) {
              res.data.data[i].sendtime = e.sendtime.trim().replace(' ','<br />')
            }
          })
          // 返回的数据赋值给table
          this.tableData = res.data.data
          this.pageConfig.total = res.data.totalElements
          this.pageConfig.totalPages = res.data.totalPages
          // 表单更新默认显示第一条
          // this.rowData = {...res.data.data[0]}
          // this.$emit('clickRowData',this.rowData)
          this.rowClick(res.data.data[0])
          // 表格结束loading
          this.tableConfig.loading = false
        }).catch(err => {
          this.tableConfig.loading = false
        })
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 搜索筛选数据
       */
      search(){
        this.searchData.page = 1
        this.pageConfig.currentPage = 1
        this.getBlackFaxList()
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 点击表格当行
       */
      rowClick(row){
        // 防止点击同一条发送重复请求
        if (this.rowData.id != row.id){
          if(row.read == '未读'){
            let data = {id:row.id}
            this.$api.faxRead(data).then(res=>{
              if(res.msg =='SUCCESS'){
                row.read = '已读'
              }
            })
          }
          this.rowData = {...row}
          this.$emit('clickRowData',this.rowData)
        }
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 传真恢复
       */
      handleFaxRecover(fax){
        confirmDelete('恢复传真','是否恢复该条传真?').then(() =>{
          let parmas = {
            faxId: fax.id,
            phone: fax.call ? fax.call : fax.calling
          }
          this.$api.deleteFaxBlacklist(parmas).then((res) => {     //faxRecover
            this.search()
            this.$message({
              type: 'success',
              message: '已恢复传真'
            })
          }).catch(err =>{
            this.$message({
              type: 'error',
              message: err.msg
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 传真删除
       */
      handleFaxDelete(id){
        confirmDelete('删除传真','删除传真后将无法恢复，是否删除该条传真？').then(() =>{
          let parmas = {
            ids: [id]
          }
          this.$api.deleteFaxInRecycleBin(parmas).then((res) => {     //faxRecover
            if(res.errorcode == 10006) {
                this.$message({
                    type:'error',
                    message: '你没有删除权限！'
                })      
                return ;  
            }
            this.search()
            this.$message({
              type: 'success',
              message: '删除传真成功'
            })
          }).catch(err =>{
            this.$message({
              type: 'error',
              message: err.msg
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 清空回收站
       */
      handleAllFaxDelete(){
        confirmDelete('清空回收站','清空回收站将删除回收站全部传真且无法恢复，是否清空回收站？').then(() =>{
          this.$api.deleteAllInRecycleBin().then((res) => {     //faxRecover
            this.search()
            this.$message({
              type: 'success',
              message: '已清空回收站'
            })
          }).catch(err =>{
            this.$message({
              type: 'error',
              message: err.msg
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 10页/条改变
       */
      sizeChange(val){
        this.searchData.size = val
        this.getBlackFaxList()
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 页码改变
       */
      currentChange(val){
        this.searchData.page = val
        this.getBlackFaxList()
        this.$refs.refTable.changePage() 
      },
      /**
       * @author hexinting
       * @lastDate 2020-10-14
       * @lastAuthor hexinting
       * @description 时间格式化
       */
      timeFormat(val){
        let date = new Date(val)
        let y = date.getFullYear()
        let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let d = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
        return y + '-' + m + '-' + d
      },
    }
  }
</script>

<style scoped>
  .mgr14{
    margin-right: 14px;
  }

  .mgr8{
    margin-right: 8px;
  }
  .faxBlackList{
    border-radius:4px;
    box-shadow:0px 4px 14px 3px rgba(54,121,225,0.09);
  }

  .faxBlackList .left_top_box{
    padding: 20px 30px 15px;
    display: flex;
    align-items: center;
  }
  .font_style{
    min-width: 40px;
    font-size:16px;
    color:#555555;
    line-height: 40px;
  }

  .table_box{
    min-height: 610px;
  }
  .table_box .commonBox{
    width:11px;
    height:11px;
    border-radius:6px;
  }
  .table_box .Box1{
    background:#0091FF;
  }
  .table_box .Box2{
    background:#0BD295;
  }

  .table_box .direct_box{
    display: flex;
    align-items: center
  }

  .table_box .comonFaxType{
    width:76px;
    height:28px;
    line-height:28px;
    font-size:14px;
    color: #fff;
    text-align: center;
    border-radius: 4px
  }
  .table_box .unread{
    background: #FF977A;
  }
  .table_box .read{
    background: #0091FF;
  }
  .table_box .succ{
    background: #0BD295;
  }
  .table_box .ban{
    background: #F46666;
  }
  .table_box .iconHandle{
    font-size: 20px;
    color: #9FC8FE;
    cursor: pointer;
  }
  .table_box .iconHandle:hover{
    color: #4382eb;
  }
  .datePicker{
    position: relative;
  }
  .datePicker>>>.el-icon-date{
    position: absolute;
    right: 6px;
  }
  .img_recover {
    width: 20px;
    height:20px;
    cursor: pointer;
  }
</style>