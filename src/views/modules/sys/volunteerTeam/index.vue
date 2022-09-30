<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
          <el-select v-model="selectValue" clearable placeholder="请选择镇街">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="请输入学校，姓名，电话搜索！" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"

      style="width: 100%;">



      <el-table-column
        prop="platformName"
        header-align="center"
        align="center"
        label="学校">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="job"
        header-align="center"
        align="center"
        label="职业">
      </el-table-column>
      <el-table-column
        prop="specialty"
        header-align="center"
        align="center"
        label="特长">
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

  export default {
    data () {
      return {
        options: [
        //   {
        //   value: '选项1',
        //   label: '黄金糕'
        // }, {
        //   value: '选项2',
        //   label: '双皮奶'
        // }, {
        //   value: '选项3',
        //   label: '蚵仔煎'
        // }, {
        //   value: '选项4',
        //   label: '龙须面'
        // }, {
        //   value: '选项5',
        //   label: '北京烤鸭'
        // }
        ],
        selectValue: '',
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    components: {
    },
    activated () {
      this.getDataList()
    },
    mounted(){
      this.$http({
          url: this.$http.adornUrl('/wechatMobile/townList'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            // console.log("/weChatHandleTaskPC/townList",data)
            if(data.list.length>0){
              data.list.forEach(element => {
                this.options.push({
                  value:element.id,
                  label:element.townName
                })
              });
            }
          } else {
            this.$message.error(data.msg)
          }

        })
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/woker/volunteer/page'),
          method: 'get',
          params: this.$http.adornParams(
            {
            'townId':this.selectValue,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          }
          )
        }).then(({data}) => {
          // console.log('/woker/volunteer/page',data)
          if (data && data.code === 0) {
            this.dataList=data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.$http({
          url: this.$http.adornUrl("/woker/volunteer/page"),
          method: "get",
          params: this.$http.adornParams(
            {
              limit:this.pageSize ,
              page:this.pageIndex,
              // groupId: this.selectedNode,
              key: this.dataForm.key
            },
            false
          )
        }).then(({ data }) => {
           if (data && data.code === 0) {
             this.dataList=data.page.list
          } else {
            this.$message.error(data.msg)
          }
        });
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.$http({
          url: this.$http.adornUrl("/woker/volunteer/page"),
          method: "get",
          params: this.$http.adornParams(
            {
              limit:this.pageSize ,
              page:this.pageIndex,
              // groupId: this.selectedNode,
              key: this.dataForm.key
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList=data.page.list
          } else {
            this.$message.error(data.msg)
          }
        });
      }
    }
  }
</script>
