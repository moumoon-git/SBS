<template>
  <div class="cm">
    gyjgiugjugfgjgfjgf
    <el-form  :model="dataForm" @keyup.enter.native="getDataList()" style="position: relative;">
      <el-form-item>
      <el-button class="save" v-if="isAuth()" type="primary" @click="addorUpdateItem" >新增</el-button>
      </el-form-item>
      <el-form-item>
     <el-input  style="width:300px;"  v-model="dataForm.roleName" placeholder="请输入项目分组关键字" clearable></el-input>
      </el-form-item>
     </el-form>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="position: relative;">
      <el-form-item>
        <el-input  style="width:300px;"  v-model="dataForm.roleName" placeholder="请输入需要检查的项目名称、内容关键字" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="save" type="primary" @click="searchResult()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="save" type="primary" @click="leadIn()">导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="save" type="primary" @click="leadOut()">导出</el-button>
      </el-form-item>
      <div style="position: absolute;right: 0%;top:0%;">
        <el-button class="save" v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle(null,'add')">新增</el-button>
        <el-button class="save" v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </div>
    </el-form>

     <el-col :gutter="20">
      <el-col :span="5" class="itemTree">
        <el-aside width="302px">
          <el-tree
            @node-click="handleNodeClick"
            :data="platFormList"
            :props="defaultProps"
            node-key="id">
          </el-tree>
        </el-aside>
      </el-col>

      <el-col :span="19">
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
            width="50">
          </el-table-column>
          <el-table-column
            prop="roleId"
            header-align="center"
            align="center"
            width="80"
            label="检查内容">
          </el-table-column>
          <!--<el-table-column
            prop="roleName"
            header-align="center"
            align="center"
            label="角色名称">
          </el-table-column>

          <el-table-column
            prop="platformName"
            header-align="center"
            align="center"
            label="平台名称">
          </el-table-column>

          <el-table-column
            prop="gmtCreate"
            header-align="center"
            align="center"
            width="180"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="remark"
            header-align="center"
            align="center"
            label="备注">
          </el-table-column>-->
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId,'update')">编辑</el-button>
              <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
            </template>
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
      </el-col>
    </el-col>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>


  </div>
</template>

<script>
  import AddOrUpdate from './cm-add-or-update'
  import { platformTreeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: { 
          roleName: '',
          key
        },

        platformId: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,

        //终端
        platFormList: [],
        defaultProps: {
          children: 'children',
          label: 'platformName'
        },

      }
    },
    components: {
      AddOrUpdate
    },
    mounted(){
      this.getPlatformDataList();
      this.getDataList();
    },
    methods: {
      getPlatformDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/platform/allList'),
          method: 'get'
        }).then(({data}) => {
          this.platFormList = platformTreeDataTranslate(data.data,"id");
          //this.platFormList = data.data;
        })
      },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/roleList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'platformId': String(this.platformId),
            'roleName': this.dataForm.roleName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
      },
      handleNodeClick(obj){
        console.log("点击节点",obj)
        this.pageIndex = 1;
        this.platformId = obj.id;
        this.getDataList();
      },

      // 查询
      searchResult(){
        this.pageIndex = 1
        this.getDataList()
      },
      leadIn(){

      },
      leadOut(){

      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id,type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,type)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="less" scoped>
  .cm{
    //表格奇偶行换颜色
    .has-gutter tr>th{
      background:rgba(230,230,230,1);

    }
    .el-table th{
        background-color: rgba(230,230,230,1);
    }
    .el-table__body tbody > :nth-child(2n){
      background:rgba(230,230,230,1);
    }
    //弹窗样式
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
      border: 1px solid #DCDFE6;
    }
  .save{
      color: white !important;
      background-color: #0091FF !important;
      border-color: #0091FF !important;
    }
    //按钮样式
    .el-button.el-button--medium:hover{
      color: #a3a3a3 !important;
      border-color:rgba(71,157,255,1) !important;
      background: transparent !important;
    }
    .el-form{
      .el-button--danger{
        background: white;
        border: 1px solid #d3d7db;
        border-radius: 5px;
        font-size: 12px ;
        font-family: MicrosoftYaHei;
        font-weight: 400 ;
        color: #a3a3a3;
        margin-left: 20px;
      }
      .el-button--primary{
        width:88px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(211,215,219,1);
        border-radius:5px;
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(162,162,162,1);
      }
      .el-button--default{
        background:linear-gradient(180deg,rgba(71,175,255,1),rgba(71,157,255,1));
        border-radius:3px;
        color: white;
        width:88px;
      }
    }

    //修改，删除按钮样式
    .cell{
      .el-button--text:first-child{
        background-color: transparent;
        border: none;
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(118,214,114,1);
      }
      .el-button--text:last-child{
        background-color: transparent;
        border: none;
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(230,115,128,1);
      }
    }

    .itemTree{
      .el-aside {
        color: #333;
        text-align: center;
        height: calc(100vh - 300px);
        border: 1px solid #ebeef5;
        margin-top: 18px;
        padding-top: 10px;
      }
    }


  }
</style>
