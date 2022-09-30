<template>
  <el-container>
    <el-main style="padding:0 30px" >
      <el-row  class="elMain" style="min-height:600px">
        <el-col :span="4">
          <div style=" height: calc(100vh - 195px);width: 100%;border-right: 1px solid #ddd">
            <el-scrollbar style="height: 100%">
              <div v-for="(item, index) in listData" style="text-indent: 10px">
                <div @click="getInLowerDept(item,index)"
                     :class="inx==index?'back':''"
                     style="display: flex;flex-wrap: nowrap;text-align: left;cursor: pointer;
                    height: 40px; align-items: center;justify-content: flex-start">
                  <div>{{item.deptName}}</div>
                  <div>{{item.updateTime}}</div>
                </div>
              </div>
            </el-scrollbar>
          </div>

        </el-col>
        <el-col :span="8">
          <div style=" height: calc(100vh - 195px);width: 100%;border-right: 1px solid #ddd">
            <div style="height: 680px">
              <el-table
                @row-click="handleCurrentChange"
                :data="tableData"
                border
                highlight-current-row
                :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                style="width: 100%">
                <el-table-column
                  prop="number"
                  label="期号"
                  min-width="50%">
                </el-table-column>
                <el-table-column
                  prop="publishTime"
                  label="发行时间"
                  min-width="50%">
                </el-table-column>

              </el-table>
            </div>
            <el-pagination v-if="tableData.length>0" :small="pagingSize" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                           :current-page="currentPage"
                           @size-change="handleSizeChange" @current-change="pageMode"
                           layout="total, prev, pager, next, sizes, jumper"></el-pagination>
          </div>
        </el-col>
        <el-col :span="12"  >
          <div style="padding: 0 20px;" v-if="clickRow">
            <h2>{{titleReport}}</h2>
            <div style="margin: 10px 0">{{server.number}}</div>
            <div style="text-align: left;height: calc(100vh - 460px)">
              <el-scrollbar style="height: 100%">
                {{server.content}}
              </el-scrollbar>
            </div>
            <div class="listDivStyle" >
              <div><span style="font-weight: 600;padding-right: 15px">呈送:</span>{{server.report}}</div>
              <div><span style="font-weight: 600;padding-right: 15px">抄送:</span>{{server.cc}}</div>
              <div><span style="font-weight: 600;padding-right: 15px">核稿:</span>{{server.checkman}}</div>
              <div><span style="font-weight: 600;padding-right: 15px">日期:</span>{{server.time}}</div>
            </div>

          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "bottomReport",
        data() {
            return {
                listData:[] ,
                pagingSize:true ,
                tableData:[] ,
                pageSize: 10 , //每页数量
                total: 0 , //数据总数
                currentPage: 1 , //第几页
                inx: -1 ,
                titleReport:'' ,
                server:{
                    number:'' ,
                    content:'' ,
                    report:'' ,
                    cc:'' ,
                    checkman:'' ,
                    time:'' ,
                } ,
                deptId:'' ,
                clickRow:false
            }
        },
        mounted() {
            this.$api.getLowerDeptUpdateTime({}).then((res) => {
                if (res.errorcode == 0) {
                    this.listData=res.data
                }
            })
        },
        watch:{
          currentPage:{
              handler(newV,oldV){
                  if(newV!==oldV) {
                      this.clickRow=false;
                      this.server={
                          number:'' ,
                          content:'' ,
                          report:'' ,
                          cc:'' ,
                          checkman:'' ,
                          time:'' ,
                      }
                  }
              },
              deep:true
          },
          pageSize:{
              handler(newV,oldV){
                  if(newV!==oldV) {
                      this.clickRow=false;
                      this.server={
                          number:'' ,
                          content:'' ,
                          report:'' ,
                          cc:'' ,
                          checkman:'' ,
                          time:'' ,
                      }
                  }
              },
              deep:true
          },
          inx:{
              handler(newV,oldV){
                 if(newV!==oldV) {
                     this.clickRow=false;
                     this.server={
                         number:'' ,
                         content:'' ,
                         report:'' ,
                         cc:'' ,
                         checkman:'' ,
                         time:'' ,
                     }
                 }
              },
              deep:true
            },
        },
        methods:{
            handleCurrentChange(row) {
                console.log(row);
                this.clickRow= true ;
                this.$api.getReportListInDetail({id:row.id}).then((res) => {
                    if (res.errorcode == 0) {
                        this.server={
                            number:res.data.number ,
                            content:res.data.content ,
                            report:res.data.report ,
                            cc:res.data.cc ,
                            checkman:res.data.checkman ,
                            time:res.data.time
                        }
                    }
                })
            },
            getInLowerDept(item,index) {
                this.titleReport=`${item.deptName}突发事件报告`
                this.inx= index;
                this.deptId=item.deptId;
                let data={
                    deptId:this.deptId,
                    page:this.currentPage,
                    size:this.pageSize
                }
                this.$api.getReportListInLowerDept(data).then((res) => {
                    if (res.errorcode == 0) {
                        this.tableData=res.data.data
                        this.total=res.data.totalElements
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize=val;
                let data={
                    deptId:this.deptId,
                    page:this.currentPage,
                    size:this.pageSize
                }
                this.$api.getReportListInLowerDept(data).then((res) => {
                    if (res.errorcode == 0) {
                        this.tableData=res.data.data
                        this.total=res.data.totalElements
                    }
                })
            },
            pageMode(val) {
                this.currentPage=val;
                let data={
                    deptId:this.deptId,
                    page:this.currentPage,
                    size:this.pageSize
                }
                this.$api.getReportListInLowerDept(data).then((res) => {
                    if (res.errorcode == 0) {
                        this.tableData=res.data.data
                        this.total=res.data.totalElements
                    }
                })
            }
        }
    }
</script>

<style scoped>
  .elMain {
    /*padding: 5px 10px;*/
    box-sizing: border-box;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
    background-color: white;
    height: calc(100vh - 195px);
  }
  .back{
    background-color: #ddd;
  }
  .listDivStyle{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    text-align: left;
  }
  .listDivStyle div{
    margin-top: 15px;
  }
</style>
