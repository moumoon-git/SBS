<template>
  <!--全部记录-->
  <div class="allFax">
    <div class="left_top_box">
      <!-- <div class="mgr14 font_style">类型</div>
      <el-select class="mgr14" style="width: 112px" v-model="filtrateData.direct" clearable placeholder="请选择" @change="handleTypeSelectChange">
        <el-option
        v-for="item in typeList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select> -->
      <div class="mgr14 font_style">状态</div>
      <el-select class="mgr14" style="width: 112px" v-model="filtrateData.status" placeholder="请选择" @change="handleStateSelectChange">
        <el-option
        v-for="item in stateList"
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
      <el-input v-model="filtrateData.searchText" placeholder="请输入关键字" style="width: 253px;border-bottom-right-radius:0px ;border-top-right-radius:0px;">
        <el-button slot="append" style="font-size:16px; height: 40px;background: #3F92FE;color: white;border-bottom-left-radius:0px ;border-top-left-radius:0px;" icon="el-icon-search" @click="search" :disabled="tableConfig.loading"></el-button>
      </el-input>
    </div>
    <div class="table_box">
      <myTable :tableColumn="tableColumn" :tableData="tableData" :tableConfig="tableConfig" @rowClick="rowClick">
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
          <p v-if="data.slotData.workUnit" class="reset_p">{{ data.slotData.workUnit }}</p>
          <p v-if="data.slotData.call" class="reset_p">{{ data.slotData.call }}</p>
          <!-- {{data.slotData.workUnit}}<br/>{{data.slotData.call}} -->
        </template>
        <!--呼叫时间-->
        <template slot="sendtime" slot-scope="data">
          <div v-html="data.slotData.sendtime"></div>
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
        <!--标题/类型-->
        <template slot="titleType" slot-scope="data">
          <span v-if="data.slotData.direct === '已发'">{{data.slotData.faxName}}</span>
          <span v-if="data.slotData.direct === '已收'">{{data.slotData.title}}</span>
          <br/>{{data.slotData.type}}
        </template>
        <!--操作-->
        <template slot="operate" slot-scope="data">
          <el-tooltip class="item" effect="dark" content="放入回收站" placement="top">
            <i class="el-icon-delete iconDelete" @click.stop="confirmFaxDelete(data.slotData.id)" />
          </el-tooltip>
        </template>
      </myTable>
    </div>
    <div class="my_pagination" style="background: #fff;text-align: right; padding:14px 0">
      <myPagination :pageConfig="pageConfig" @sizeChange="sizeChange" @currentChange="currentChange"></myPagination>
    </div>
  </div>
</template>

<script>
  import myTable from "../../components/myTable"
  import myPagination from '../../components/myPagination'
  import { confirmDelete } from '@/assets/js/common.js'
  import {faxRead} from "../../../../assets/interface/interface";

  export default {
    name: "receiveFax",
    components:{
      myTable,
      myPagination,
    },
    data(){
        return{
          typeList: [
            {label: '已发',value: '1'},
            {label: '已收',value: '0'},
          ],
          stateList: [
            {label: '已读',value: 'read'},
            {label: '未读',value: 'unread'},
          ],
          timeVal: '',
          // 筛选数据
          filtrateData:{
            direct: '',     //类型
            status: 'read',     //状态
            dtStart: '',    //开始时间
            dtEnd: '',      //结束时间
            searchText: '', //搜索内容
            page: 1,
            size: 10,
          },

          rowData: null,    //点击全部表格存放单行数据,防止多次点击同一行而重复请求

          // 表格配置数据
          tableColumn: [
            {label:'收/发',prop:'direct',width:120,slot:true},
            {label:'单位/号码',prop:'workUnitCall',width:155,slot:true},
            {label:'收/发时间',prop:'sendtime',width:155,slot:true},
            {label:'传真状态',prop:'faxType',width:125,slot:true},
            {label:'处置状态',prop:'processingName',width:135,slot:true},
            {label:'标题/类型',prop:'titleType',slot:true},
            {label:'操作',prop:'operate',width:80,slot:true,center:'center'},
          ],
          tableData:[],
          tableConfig: {
            height: '620px',
            loading: false,
            selection: false,
          },

          // 分页器配置
          pageConfig:{
            total: 0,
            currentPage: 1,
            totalPages: 0,
            small: false,
            background: true,
          }
        }
    },
    created(){
      if (this.$route.query.type) { //查询未读传真
        this.filtrateData.status = 'unread'     //状态
        this.getFaxList()
        this.handleTypeSelectChange('0')
        this.handleStateSelectChange('unread')
      } else{
        this.getFaxList()
      }
    },
    watch: {
      '$route.query.type'(newVal){
        if (newVal){
          this.filtrateData.status = '未读'     //状态
          this.getFaxList()
          this.handleTypeSelectChange('0')
          this.handleStateSelectChange('unread')
        }
      }
    },
    methods:{
      // 类型下拉改变时
      handleTypeSelectChange(val){
        if (val === '1'){
          this.stateList = [
            {label: '发送成功',value: 'success'},
            {label: '发送失败',value: 'fail'},
          ]
        } else if(val === '0'){
          this.stateList = [
            {label: '已读',value: 'read'},
            {label: '未读',value: 'unread'},
          ]
        }else {
          this.stateList = [
            {label: '已读',value: 'read'},
            {label: '未读',value: 'unread'},
            {label: '发送成功',value: 'success'},
            {label: '发送失败',value: 'fail'},
          ]
        }
      },
      // 状态下拉改变时
      handleStateSelectChange(val){
        if (val === 'success' || val === 'fail'){
          this.typeList = [
            {label: '已发',value: '1'},
          ]
        } else if(val === 'read' || val === 'unread'){
          this.typeList = [
            {label: '已收',value: '0'},
          ]
        }else {
          this.typeList = [
            {label: '已发',value: '1'},
            {label: '已收',value: '0'},
          ]
        }
      },
      // 筛选时间
      handleTimeChange(val){
        if (val){
          this.filtrateData.dtStart = this.timeFormat(val[0])
          this.filtrateData.dtEnd = this.timeFormat(val[1])
        } else {
          this.filtrateData.dtStart = ''
          this.filtrateData.dtEnd = ''
        }
      },
      // 搜索筛选数据
      search(){
        this.filtrateData.page = 1
        this.pageConfig.currentPage = 1
        this.getFaxList()
      },
      // 获取传真数据
      getFaxList(){
        this.tableConfig.loading = true;
        this.$api.fax(this.filtrateData).then((res) => {
          if (!res.data.data){
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
          // this.rowData = {...res.data.data[0],sendtime: res.data.data[0].sendtime.replace('<br />',' ')}
          // this.$emit('clickRowData',this.rowData)
          this.rowClick(this.rowData?this.rowData:res.data.data[0])
          // 表格结束loading
          this.tableConfig.loading = false
        }).catch(err => {
          // 表格结束loading
          this.tableConfig.loading = false
        })
      },
      //提示删除
      confirmFaxDelete(id){
        let parmas = {
          id:[id]
        }
        confirmDelete('放入回收站','是否将该传真放入回收站?').then(() => {
          this.$api.faxDelete(parmas).then(() =>{
            this.$message({
              type:'success',
              message: '放入回收站成功'
            })
            // 重置并更新表格数据
            this.search()
          }).catch(err => {
            this.$message({
              type:'error',
              message: '删除失败'
            })
          })
        }).catch(() =>{
          this.$message({
            type:'info',
            message: '已取消'
          })
        })
      },
      /**
       * @description: 点击表格当行
       * @lastEditor : xuchuangxing
       * @updateTime : 2020-11-12 15:48
       * @param {*} row // 当前行信息
       * @return {*}
       */
      rowClick(row){
        console.log('row: ', row);
        // 防止点击同一条发送重复请求 顺序旋转需要重新刷新列表先注释了
        // if (this.rowData.id != row.id){
          if(row.read == '未读'){
            let data = {id:row.id}
            this.$api.faxRead(data).then(res=>{
              if(res.msg =='SUCCESS'){
                row.read = '已读'
                this.$store.commit('SET_ANSWERNUM') //改变未读状态
              }
            })
          }
          this.rowData = {...row,sendtime: row.sendtime.replace('<br />',' ')}
          this.$emit('clickRowData',this.rowData, "left")
        // }
      },
      // 10条/页改变
      sizeChange(val){
        this.filtrateData.size = val
        this.getFaxList()
      },
      // 页码改变
      currentChange(val){
        this.filtrateData.page = val
        this.getFaxList()
      },
      // 时间格式化
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
  .allFax{
    border-radius:4px;
    box-shadow:0px 4px 14px 3px rgba(54,121,225,0.09);
  }

  .allFax .left_top_box{
    padding: 15px 30px 10px;
    display: flex;
    align-items: center;
  }
  .font_style{
    min-width: 40px;
    font-size:16px;
    color:#555555;
    line-height: 40px;
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
  .table_box .iconDelete{
    font-size: 20px;
    color: #9FC8FE;
    cursor: pointer;
  }
   .table_box .iconDelete:hover{
    color: #4382eb;
  }
  .table_box{
    min-height: 620px;
  }
  .datePicker{
    position: relative;
  }
  .datePicker>>>.el-icon-date{
    position: absolute;
    right: 6px;
  }
  .reset_p {
    padding:0;
    margin:0;
  }
</style>
