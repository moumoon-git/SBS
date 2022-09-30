<template>
  <!--联系人记录-->
    <div class="relationFax">
      <div class="left_top_box">
        <el-date-picker
          class="mgr14 datePicker"
          v-model="timeVal"
          type="daterange"
          range-separator=" "
          start-placeholder="请选择日期范围"
          @change="handleTimeChange">
        </el-date-picker>
        <el-input v-model="searchData.searchText" placeholder="请输入关键字" style="width: 253px;border-bottom-right-radius:0px ;border-top-right-radius:0px;">
          <el-button @click="search" :disabled="tableConfig.loading" slot="append" style="font-size:16px; height: 40px;background: #3F92FE;color: white;border-bottom-left-radius:0px ;border-top-left-radius:0px;" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-row>
        <el-col :span="15" style="padding-right: 14px;border-right: 1px solid #E3E6E7">
          <div class="table_box mgb14">
            <myTable :tableColumn="tableColumn" :tableData="tableData" :tableConfig="tableConfig" @rowClick="rowClick">
              <!--单位-->
              <template slot="workUnit" slot-scope="data">
                <div>{{data.slotData.workUnit || '暂无'}}</div>
              </template>
              <!--号码-->
              <template slot="fax" slot-scope="data">
                <div>{{data.slotData.fax || '暂无'}}</div>
              </template>
            </myTable>
          </div>
          <div class="my_pagination mgb14">
            <myPagination :pageConfig="pageConfig" @sizeChange="sizeChange" @currentChange="currentChange"></myPagination>
          </div>
        </el-col>
        <el-col :span="9" style="padding: 0 16px;">
          <div class="card_out_box" style="min-height: 630px">
            <div v-if="relationDetailsList.length === 0" style="font-size: 18px;color: #666">
              暂无数据
            </div>
            <div
              v-else
              v-loading="relationDetailsLoading"
              element-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.8)">
              <template v-for="(item,i) in relationDetailsList">
                <div :class="{'card_box':true, 'under_line':underlineIdx === i}" v-if="item.direct === '已收'" :key="item.id" @click="handleRelationItem(item,i)">
                  <div class="common_box over_box"></div>
                  <span class="status">接收</span>
                  <div class="over_msg common_msg" v-show="item.read === 1">已读</div>
                  <div class="over_not_msg common_msg" v-show="item.read === 0">未读</div>
                  <time>{{item.sendtime || '暂无'}}</time>
                  <div v-if="item.title">
                    <el-tooltip class="item" effect="dark" :content="item.title" placement="top-start">
                      <h5 class="title">{{item.title}}</h5>
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <h5 class="title">暂无</h5>
                  </div>
                  <div class="type">{{item.type || '暂无'}}</div>
                  <div class="iconBox">
                    <template v-for="t in iconArr">
                      <template v-if="t.i !== 1">
                        <el-tooltip class="item" effect="dark" :content="t.msg" placement="top-start">
                          <img style="cursor: pointer;" :src="t.i === idx && index === i? t.url_a:t.url" @click.stop="handleIcon(item, t.msg)" @mouseenter="iconEnter(i,t.i)" @mouseleave="iconLeave()" />
                        </el-tooltip>
                      </template>
                    </template>
                  </div>
                </div>

                <div :class="{'card_box':true, 'under_line':underlineIdx === i}"  v-if="item.direct === '已发'" :key="item.id" @click="handleRelationItem(item,i)">
                  <div class="common_box send_box"></div>
                  <span class="status">发送</span>
                  <div class="send_ok_msg common_msg" v-show="item.success === '成功'">发送成功</div>
                  <div class="send_msg common_msg" v-show="item.success === '失败'">发送失败</div>
                  <time>{{item.sendtime || '暂无'}}</time>
                  <div v-if="item.title">
                    <el-tooltip class="item" effect="dark" :content="item.title" placement="top-start">
                      <h5 class="title">{{item.title}}</h5>
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <h5 class="title">暂无</h5>
                  </div>
                  <div class="type">{{item.type || '暂无'}}</div>
                  <div class="iconBox">
                    <template v-for="t in iconArr">
                      <template v-if="t.i !== 2">
                        <el-tooltip class="item" effect="dark" :content="t.msg" placement="top-start">
                          <img style="cursor: pointer;" :src="t.i === idx && index === i? t.url_a:t.url" @click.stop="handleIcon(item, t.msg)" @mouseenter="iconEnter(i,t.i)" @mouseleave="iconLeave()" />
                        </el-tooltip>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="my_pagination mgb14" style="text-align: center">
            <mySamllPagination :samllPageConfig="samllPageConfig" @samllCurrentChange="samllCurrentChange"></mySamllPagination>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import myTable from "../../components/myTable"
  import myPagination from '../../components/myPagination'
  import mySamllPagination from '../../components/mySamllPagination'

  import relay from '@/assets/phoneHistoryIcon/relay.png'   //转发
  import retry from '@/assets/phoneHistoryIcon/retry.png'   //重发
  import reply from '@/assets/phoneHistoryIcon/reply.png'   //回复
  import relay_a from '@/assets/phoneHistoryIcon/relay_a.png'
  import retry_a from '@/assets/phoneHistoryIcon/retry_a.png'
  import reply_a from '@/assets/phoneHistoryIcon/reply_a.png'

  export default {
    name: "relationFax",
    components:{
      myTable,
      myPagination,
      mySamllPagination,
    },
    props:{

    },
    data(){
      return{
        // 发送请求筛选数据
        timeVal: '',
        searchData: {
          startTime: '',
          endTime: '',
          searchText: '',
          page: 1,
          size: 10
        },

        // 获取当行收发记录
        relationDetailsLoading: false,
        rowRequerData: {
          id: '',
          page: 1,
          size: 5
        },
        relationDetailsList:[],

        underlineIdx: 0,  //控制下划线显示
        index: -1,  //改变当行图标高亮效果
        idx: -1,  //改变图标高亮效果
        iconArr: [//图标  转发  重发  回复
          {i:0,url:relay,msg:'转发',url_a:relay_a},
          {i:1,url:retry,msg:'重发',url_a:retry_a},
          {i:2,url:reply,msg:'回复',url_a:reply_a},
        ],

        rowTableData: null, //点击联系人表格存放单行数据,防止多次点击同一行而重复请求
        rowData: null,    //点击联系人收发详情存放单行数据,防止多次点击同一行而重复请求
        // 表格配置数据
        tableColumn: [
          {label:'单位',prop:'workUnit', slot:true},
          {label:'号码',prop:'fax',width:220, slot:true},
        ],
        tableData:[],
        tableConfig: {
          height: '610px',
          loading: false,
          selection: false,
        },

        // 分页器配置
        pageConfig:{
          total: 0,
          currentPage: 1,
          totalPages: 0,
          small: false,
          background: true
        },

        samllPageConfig: {
          total: 0,
          currentPage: 1,
          totalPages: 0,
          pageSize: 5,
        }
      }
    },
    created(){
      this.getFaxContactorList()
    },
    methods: {
      // 筛选时间
      handleTimeChange(val){
        if (val){
          this.searchData.startTime = this.timeFormat(val[0]) + ' 00:00:00'// 后端统计需要加上时间 author:hexinting date:2020-10-27
          this.searchData.endTime = this.timeFormat(val[1]) + ' 23:59:59' // 后端统计需要加上时间 author:hexinting date:2020-10-27
        } else {
          this.searchData.startTime = ''
          this.searchData.endTime = ''
        }
      },
      // 搜索筛选数据
      search(){
        this.searchData.page = 1
        this.pageConfig.currentPage = 1
        this.getFaxContactorList()
      },
      // 获取联系人记录
      getFaxContactorList(){
        this.tableConfig.loading = true;
        this.$api.faxContactorList(this.searchData).then(res => {
          if (!res.data.data){
            this.tableData = []
            return
          }
          // 返回的数据赋值给table
          this.tableData = res.data.data
          this.pageConfig.total = res.data.totalElements
          this.pageConfig.totalPages = res.data.totalPages
          // 存在联系人记录再获取联系人收发记录
          if (res.data.totalElements > 0){
            this.rowRequerData.id = this.rowTableData?this.rowTableData.id:res.data.data[0].id
            this.getfindFaxContactorListRecord()
          }else {
            this.samllPageConfig.totalPages = 0
            this.relationDetailsList = []
          }
          // 表格结束loading
          this.tableConfig.loading = false
        }).catch(() =>{
          this.tableConfig.loading = false
        })
      },
      // 获取联系人收发记录
      getfindFaxContactorListRecord(){
        // 下划线默认第一个
        this.underlineIdx = 0
        // 加载中
        this.relationDetailsLoading = true
        this.$api.findFaxListByContactId(this.rowRequerData).then(res =>{
          if (!res.data.data){
            this.relationDetailsList = []
            return
          }
          // 表单更新默认显示第一条
          // this.rowData = {...res.data.data[0]}
          if (res.data.data.length === 0){
            return
          } else {
            // 表单更新默认显示第一条
            console.log('this.rowTableData: ', this.rowTableData);
            this.$emit('clickRowData',this.rowData?this.rowData:{...res.data.data[0]})
          }
          // 获取当行联系人收发详情
          this.relationDetailsList = res.data.data
          this.samllPageConfig.total = res.data.totalElements
          this.samllPageConfig.totalPages = res.data.totalPages
          this.samllPageConfig.pageSize = this.rowRequerData.size
          // 结束加载中
          this.relationDetailsLoading = false
        }).catch(() =>{
          // 结束加载中
          this.relationDetailsLoading = false
        })
      },
      // 点击表格当行
      rowClick(row){
        // 防止点击同一条发送重复请求 顺序旋转需要重新刷新列表先注释了
        // if (this.rowTableData.id != row.id){
          this.rowTableData = {...row}
          // 获取联系人收发记录
          this.rowRequerData.id = row.id
          this.samllPageConfig.currentPage = 1
          this.rowRequerData.page = 1
          this.getfindFaxContactorListRecord()
        // }
      },
      handleIcon(item,msg){
        this.$emit('handleIcon',item,msg)
      },
      // 点击单个联系人详情
      handleRelationItem(item,i){
        // 防止点击同一条发送重复请求
        if (this.underlineIdx != i) {
          this.underlineIdx = i
          this.rowData = {...item}
          this.$emit('clickRowData',this.rowData)
        }
      },
      // 10条/页改变
      sizeChange(val){
        this.searchData.size = val
        this.getFaxContactorList()
      },
      // 页码改变
      currentChange(val){
        this.searchData.page = val
        this.getFaxContactorList()
      },
      // 页码改变
      samllCurrentChange(val){
        this.rowRequerData.page = val
        this.getfindFaxContactorListRecord()
      },
      // 时间格式化
      timeFormat(val){
        let date = new Date(val)
        let y = date.getFullYear()
        let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let d = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
        return y + '-' + m + '-' + d
      },
      // 移入图标
      iconEnter(index,idx){
        this.idx = idx
        this.index = index
      },
      // 移出图标
      iconLeave(){
        this.idx = -1
        this.index = -1
      },
    }
  }
</script>

<style scoped>
  .mgr14{
    margin-right: 14px;
  }
  .mgb14{
    margin-bottom: 14px !important;
  }

  .relationFax{
    border-radius:4px;
    box-shadow:0px 4px 14px 3px rgba(54,121,225,0.09);
  }

  .relationFax .left_top_box{
    padding: 20px 30px 15px;
    display: flex;
    align-items: center;
  }
  .card_box{
    width: 100%;
    box-shadow:0px 11px 56px -11px rgba(54,121,225,0.16);
    border-radius:7px;
    height: 118px;
    background: #fff;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 8px;
    cursor: pointer;
  }

  .under_line{
    border-bottom: 2px solid #0091FF;
  }

  .card_box:after{
    content: '';
    width:92%;
    height:1px;
    background: #F3F3F3;
    position: absolute;
    top: 58px;
    left: 14px;
  }
  .card_box .over_box{
    background: #3E91FE;
  }

  .card_box .send_box{
    background: #0BD295;
  }

  .card_box .common_box{
    position: absolute;
    top: 15px;
    left: 15px;
    width:11px;
    height:11px;
    border-radius: 50%;
  }


  .card_box .status{
    position: absolute;
    top: 10px;
    left: 35px;
    font-size:16px;
    font-weight:600;
    color:#555;
  }

  .card_box .common_msg{
    position: absolute;
    top: 14px;
    right: 14px;
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius:13px;
    font-size:14px;
  }
  .card_box .over_msg{
    background: #E9F3FF;
    color:#0091FF;
  }
  .card_box .over_not_msg{
    background: #fff4f1;
    color: #FF977A;
  }

  .card_box .send_ok_msg{
    background: #e6faf4;
    color:#0BD295;
  }
  .card_box .send_msg{
    background: #fdefef;
    color:#F46666;
  }
  .card_box time{
    position: absolute;
    top: 36px;
    left: 15px;
    font-size:14px;
    color: #999;
  }
  .card_box .title{
    margin: 0;
    font-size:17px;
    font-weight:400;
    color:#666;
    position: absolute;
    left: 15px;
    top: 62px;
    white-space: nowrap;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .card_box .type{
    position: absolute;
    font-size:15px;
    font-weight:400;
    color:#999;
    left: 15px;
    top: 88px;
  }

  .iconBox{
    position: absolute;
    right: 10px;
    top: 82px;
  }

  .iconBox img{
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  .iconBox img:last-child{
    margin-right: 0px;
  }
  .table_box{
    min-height: 610px;
  }

  >>>.el-dialog__header{
    padding: 10px 20px;
    background: #F1F4F6;
    font-size:16px;
    font-weight:400;
    color: #333;
  }
  >>>.el-dialog__body{
    padding: 0;
  }
  .datePicker{
    position: relative;
  }
  .datePicker>>>.el-icon-date{
    position: absolute;
    right: 6px;
  }
</style>
