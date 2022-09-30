<template>
    <div>
      <div>
        <el-header  style="height: 40px">
          <el-col :span="20" style="text-align: left">
            <el-col :span="6">
              <el-date-picker
                style="width: 300px"
                v-model="valueStr"
                size="small"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="16" :offset="2">
              <el-col :span="8">
                <el-input
                  size="small"
                  placeholder="请输入参会人员/设备名称"
                  prefix-icon="el-icon-search"
                  v-model="searchInput"
                >
                </el-input>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-input
                  size="small"
                  placeholder="请输入参会号码"
                  prefix-icon="el-icon-search"
                  v-model="searchNumber"
                >
                </el-input>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-select  size="small"  v-model="conferenceType" placeholder="会议类型" @change="intervalDetection" style="margin: 0 0 0 5px">
                  <el-option
                    v-for="item in conference"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="4" style="text-align: left;text-indent: 10px;margin-top: 2px">
            <el-button type="primary"   size="small" @click="eventFind">查找</el-button>
          </el-col>
        </el-header>
        <el-main>
          <el-table
            v-loading="loading"
            height="530"
            border
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="startTime"
              align="center"
              label="发起时间"
              show-overflow-tooltip
              min-width="25%">
              <template slot-scope="scope">{{ scope.row.startTime }}</template>
            </el-table-column>
            <el-table-column
              prop="duration"
              align="center"
              label="持续时间"
              show-overflow-tooltip
              min-width="20%">
              <template slot-scope="scope">{{ scope.row.duration }}</template>
            </el-table-column>
            <el-table-column
              prop="people"
              :formatter="statusFormatter"
              align="center"
              label="与会人员"
              show-overflow-tooltip
              min-width="35%">
            </el-table-column>
            <el-table-column
              prop="type"
              align="center"
              label="会议类型"
              :formatter="typeFun"
              show-overflow-tooltip
              min-width="20%">
            </el-table-column>
          </el-table>
          <div style="width:100%;text-align: center;padding-top: 20px">
            <!--分页-->
            <el-pagination
              center
              small
              layout="prev, pager, next,  total"
              :page-size="pageSize"
              :total="total"
              :current-page.sync="currentPage"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </el-main>
      </div>
    </div>
</template>

<script>
    export default {
        name: "start",
        data(){
          return{
            valueStr:'',//开始/结束时间
            searchInput:'',//会议人员/设备名称
            searchNumber:'',//参会号码
            conferenceType:0,//会议选中
            conference:[
              {name:'会议类型(全部)',id:0},
              {name:'电话会议',id:1},
              {name:'视频会议',id:2},
            ],//会议选择
            tableData:[],//表格数据
            pageSize:10,
            total:0,
            currentPage:1,
            loading:true
          }
        },
        mounted(){
            this.searchTableData()
        },
        methods:{
          //与会人员字段
          statusFormatter(row, column,cellValue){
              let name=''
              row.people.forEach((item,i)=>{
                  console.log(item.name);
                  name=name+' , '+item.name
               })
              let end=name.slice(2)
              return end
          },
          //会议类型字段
          typeFun(row, column,cellValue){
              if(cellValue==1){
                  return '电话会议'
              }
              if(cellValue==2){
                  return '视频会议'
              }
          },
          //表格搜索
          searchTableData(){
            this.loading=true
            let data={
                page:this.currentPage,
                size:this.pageSize,
                searchText:this.searchInput,
                conferencType:this.conferenceType,
                beginTime:this.valueStr?this.valueStr[0]:null,
                endTime:this.valueStr?this.valueStr[1]:null,
                type:1
            }
            this.$api.conferenceList(data).then((res) => {
                if (res.errorcode == 0) {
                    this.loading=false
                    this.tableData=res.data.data
                    this.total=res.data.totalElements
                }else {
                    //this.$message.error(res.msg)
                }
            })
          },
          //会议类型查找
          intervalDetection(val){
              console.log(val);
          },
          //根据要求查找
          eventFind(){
              this.currentPage=1
              this.searchTableData()
          },
          //表格分页器
          handleCurrentChange(){
              this.searchTableData()
          },
        }
    }
</script>

<style scoped>
  >>>.el-header{
    padding: 0;
  }
  >>>.el-main{
    padding: 20px 0;
  }
</style>
