<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="请输入姓名/手机号搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="dataForm.time" value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="exportExcel()">导出</el-button>
        
        
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        >
      </el-table-column>
     
    
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="排班名称">
      </el-table-column>

      <el-table-column
        prop="contactorName"
        header-align="center"
        align="center"
        label="值班人">
      </el-table-column>

      <el-table-column
        prop="mobile1"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>

      <el-table-column
        prop="date"
        header-align="center"
        align="center"
        label="排班时间">
      </el-table-column>
      
      
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    
  </div>
</template>

<script>
 
 import Cookies from "js-cookie";
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          time:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
       
      }
    },
    components: {
    
   
    },
    activated () {
      this.getDataList()
    },
    methods: {
      exportExcel(){
        if(!this.dataForm.time){
          this.dataForm.time=['','']
        }
        // console.log("导出路径",`${window.SITE_CONFIG['baseUrl']}/duty/schedule/xlsOutput?token=${Cookies.get('token')}&key=${this.dataForm.key}&startTime=${this.dataForm.time[0]}&endTime=${this.dataForm.time[1]}`)
        window.location.href = `${window.SITE_CONFIG['baseUrl']}/duty/schedule/xlsOutput?token=${Cookies.get('token')}&key=${this.dataForm.key}&startTime=${this.dataForm.time[0]}&endTime=${this.dataForm.time[1]}`
      },
      // 获取数据列表
      getDataList () {
        
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/duty/schedule/historyList'),
          method: 'get',
          params: this.$http.adornParams(
            {
            'endTime': this.dataForm.time[1],
            'startTime': this.dataForm.time[0],
            'key': this.dataForm.key
          }
          )
        }).then(({data}) => {
          // console.log('/duty/schedule/historyList',data)
          if (data && data.code === 0) {
            // this.dataList = data.page.list
            // this.totalPage = data.page.totalCount
            // this.dataList = data.data.list
            var dataList=[]
            data.data.list.forEach(element => {
                dataList.push({
                    name:element.name,
                    contactorName:element.contactorName,
                    mobile1:element.mobile1,
                    date:element.date+'-'+element.startTime+'-'+element.endTime
                })
                
            });
            setTimeout(()=>{
                this.dataList=dataList
            })
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.$http({
          url: this.$http.adornUrl("/resoure/resourearticletype/tree"),
          method: "POST",
          data: this.$http.adornParams(
            {
              limit:this.pageSize ,
              page:this.pageIndex,
              // groupId: this.selectedNode,
              search: this.dataForm.key
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = treeDataTranslate(data.tree.list, "id");
        }else{
          this.$message.error(data.msg)
        }
        });
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.$http({
          url: this.$http.adornUrl("/resoure/resourearticletype/tree"),
          method: "POST",
          data: this.$http.adornParams(
            {
              limit:this.pageSize ,
              page:this.pageIndex,
              // groupId: this.selectedNode,
              search: this.dataForm.key
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
          this.dataList = treeDataTranslate(data.tree.list, "id");
        }else{
          this.$message.error(data.msg)
        }
        });
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      }
      
   
    }
  }
</script>
