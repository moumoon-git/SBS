<template>
  <div class="block">
    <div class="contentStyle">
      <el-main>
        <div class="tableContainer" style="height:350px">
          <el-table ref="singleTable" :data="messageTableData" highlight-current-row
                    :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                    height="300px"
                    @row-click="handleMessageClick"
          >
            <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
            <el-table-column min-width="100" v-for="(item,key) in messageTableColumn" :key="key" :label="item.label"
                             :prop="item.prop"
                             :width="item.width" :resizable="false"
                             :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <el-pagination class="pagination" :page-size="messagePageSize"  :total="messageTotal"
                         :current-page="messageCurrentPage"
                         @current-change="handleMessageCurrentChange"
                         @size-change="handleMessageSizeChange"
                         :small="true"
                         layout="total, prev, pager, next, sizes, jumper" width="100"></el-pagination>
        </div>
      </el-main>
    </div>
    <div>
      <nav-bar ref="navBar" :selectedName="selectedName" :navBarList="navBarList"
               @changTab="changTab" style="margin:0 20px;"></nav-bar>
      <div style="padding:0 20px;">
        <div style="border:1px solid #ccc;height:216px;">
          <div v-show="selectedName == '详细内容'" style="text-align: left;text-indent: 2em;padding:0 5px;">
            {{currentMessage.content}}
          </div>
          <div v-show="selectedName == '回复内容'">
            <div style="height:214px;padding:6px;">
              <el-table ref="singleTable" :data="responseTableData" highlight-current-row
                        :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                        height="164px"
                        @row-click="handleResponseClick"
              >
                <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
                <el-table-column v-for="(item,key) in responseTableColumn" :key="key" :label="item.label"
                                 :prop="item.prop"
                                 :width="item.width" :resizable="false"
                ></el-table-column>
                <el-table-column  label="附件"  min-width="50" >
                  <template slot-scope="scope" >
                    <el-button type="primary" @click="downloadFile(scope.row)" size="mini">下载</el-button>
                  </template>

                </el-table-column>
              </el-table>
              <el-pagination class="pagination" :page-size="responsePageSize"  :total="responseTotal"
                             :current-page="responseCurrentPage"
                             @current-change="handleResponseCurrentChange"
                             @size-change="handleResponseSizeChange"
                             :small="true"
                             layout="total, prev, pager, next, sizes, jumper" width="100"></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--附件下载弹窗-->
    <attat-pop ref="AttachmentPopup"></attat-pop >
  </div>
</template>

<script>
  import navBar from "@/yz_components/menu/navBar"
  import attatPop from '@/view/yz_informationDynamics/attachmentPopup'
  export default {
    name: "response",
    components: {navBar,attatPop},
    props:['type','personInfo'],
    data() {
      return {

        messageTableColumn: [{
          label: "姓名",
          prop: "name",
        }, {
          label: "单位",
          prop: "workunit",
        }, {
          label: "职务",
          prop: "position",
        }, {
          label: "内容",
          prop: "content",
        }, {
          label: "发送时间",
          prop: "time",
        }, {
          label: "状态",
          prop: "status",
        }, {
          label: "回复数量",
          prop: "num",
        }],//表头
        messagePageSize: 10,//应急人员每页大小
        messageCurrentPage: 1,//应急人员当前页
        messageTotal: 0, //应急人员总页数
        messageTableData: [], //应急人员表格数据
        currentMessage:{content:''},
        responseTableColumn: [{
          label: "时间",
          prop: "time",
        }, {
          label: "内容",
          prop: "content",
        }, {
          label: "地址",
          prop: "address",
        }],//表头
        responsePageSize: 10,//回复内容每页大小
        responseCurrentPage: 1,//回复内容当前页
        responseTotal: 0, //回复内容总页数
        responseTableData: [], //回复内容表格数据
        selectedName: "详细内容",//默认选中导航条
        navBarList: [
          {
            name: "详细内容"
          }, {
            name: "回复内容"
          }
        ],//导航条模块
        filedownload:[],//当前点击的附件的表格数据

      }
    },
    methods:{
      changTab(tabName){
        this.selectedName = tabName
      },
      downloadFile(row){//回复内容附件下载
        this.filedownload=row
        if(row.picList==''||row.picList==[]||row.picList==null){
          this.$message({
            message: '暂无附件!',
            type: 'warning'
          });
          return
        }
        this.$nextTick(() => {
          this.$refs.AttachmentPopup.isDialogVisible = true;
          this.$refs.AttachmentPopup.showAtt(row.picList);
        });
      },
      getMessageTableData() {
        console.log(this.personInfo)
        let eventId=sessionStorage.getItem('newID');
        if(eventId==''||eventId==null||eventId==undefined||eventId=='newID') return
        let data = {
          eventId,
          size:this.messagePageSize,
          page:this.messageCurrentPage
        }
        if (this.personInfo.id === 0 && this.personInfo.name === '组织架构') {
          data.structId = 0
        }else{
          data.structId = this.personInfo.id
        }
        console.log(data)
        this.$api.responseGetDispatch(data).then(res => {
          console.log(res)
          if (!res.data) {
            this.messageTableData = [];
            this.messageTotal = 0;
            return this.$message({
              message: '该分组未有下发信息',
              type: 'warning'
            })
          }
          this.messageTableData = res.data.data;
          this.messageTotal = res.data.totalElements; //应急人员总页
        })
        this.responseTableData = [];
      },//获取组织架构对应的短信下发情况
      handleMessageClick(item) {
        this.currentMessage = item
        this.getResponseTableData()//获取回复情况
      },//点击组织架构对应的短信下发情况
      handleMessageCurrentChange(val) {
        this.messageCurrentPage = val;
        this.getMessageTableData();
      }, //下发情况换页
      handleMessageSizeChange(val) {
        this.messagePageSize = val;
        this.getMessageTableData();
        this.selectedName = "详细内容";
      },//下发情况换size
      getResponseTableData() {
        let data = {
          distributionId:this.currentMessage.id,
          size:this.responsePageSize,
          page:this.responseCurrentPage
        }
        console.log(data)
        this.$api.responseGetReply(data).then(res => {
          if (!res.data) {
            this.responseTableData = [];
            this.responseTotal = 0;
            return this.$message({
              message: '该下发信息未得到回复',
              type: 'warning'
            })
          }
          this.responseTableData = res.data.data;
          this.responseTotal = res.data.totalElements; //应急人员总页
        })
        this.responseTableData = [];
      },//获取组织架构对应的短信下发情况
      handleResponseClick(row) {

      },
      handleResponseCurrentChange(val) {
        console.log(val);
      },
      //每页条数改变
      handleResponseSizeChange(val) {
        console.log(val);
      },
    },
    watch:{
      personInfo:{
        handler(){
          if (this.type !== '回复情况') return;
          this.messageCurrentPage = 1;
          this.currentMessage = {content:''}
          this.responseTableData = []
          this.getMessageTableData()
        },
        deep:true
      }
    }
  }
</script>

<style scoped>
  .block{
    height: 100%;
  }
  .tableContainer {
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
  }
</style>
