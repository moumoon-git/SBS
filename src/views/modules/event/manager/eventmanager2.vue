<template>
  <div class="mod-menu">
    <el-header style="height: 52px;padding: 0 20px 0 0; clear: both; margin-top: 6px" class="left">
      <el-row :gutter="25">
        <el-col :span="6">
          <el-input
            style="width:300px;"
            placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search  style='width:300px;'"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <!--表单-->
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
              <el-button type="primary" @click="addOrUpdateHandle()" size="small">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-aside width="302px">
          <el-header style="height: 48px;margin-top: 20px;" class="operation-btn">
            <el-tooltip effect="dark" content="查看" placement="top">
              <el-button type="success" size="small" icon="el-icon-view" circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="添加" placement="top">
              <el-button type="primary" size="small" icon="el-icon-plus" circle ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改类别" placement="top">
              <el-button type="warning" size="small" icon="el-icon-edit" circle ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除类别" placement="top">
              <el-button type="danger" size="small" icon="el-icon-delete" circle ></el-button>
            </el-tooltip>
          </el-header>
          <el-tree
            @node-click="handleNodeClick"
            :data="platFormList"
            :props="defaultProps"
            node-key="id"
            :default-expand-all="true"
            show-checkbox>
          </el-tree>
        </el-aside>
      </el-col>
      <el-col :span="18">
        <!--表格-->
        <el-table
          :data="platShareMenuList"
          border
          style="width: 100%;">
          <el-table-column
            prop="shareId"
            header-align="center"
            align="center"
            width="80"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="myPlatformName"
            header-align="center"
            align="center"
            width="300"
            label="本级平台">
          </el-table-column>
          <el-table-column
            prop="linkagePlatformName"
            header-align="center"
            align="center"
            width="300"
            label="联动平台">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="300"
            :show-overflow-tooltip="true"
            label="共享权限">
          </el-table-column>

          <!--隐藏宽-->
          <el-table-column
            prop="myPlatformId"
            v-if="false"
            label="本级平台id">
          </el-table-column>

          <el-table-column
            prop="linkagePlatformId"
            v-if="false"
            label="其他平台id">
          </el-table-column>


          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:share:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.shareId,scope.row.myPlatformId,scope.row.linkagePlatformId)">修改</el-button>
              <el-button v-if="isAuth('sys:share:delete')" type="text" size="small" @click="deleteHandle(scope.row.shareId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      ref="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>


    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        //修改窗口
        addOrUpdateVisible: false,
        //添加授权窗口
        addingauthorization:false,
        platDataForm: {
          id: 0,
          typeName:'',
          typeNameList: [],
          platformName: '',
          parentId: 0,
          parentName: '',
          orderNum: 0,
        },
        //终端
        platFormList: [],
        defaultProps: {
          children: 'children',
          label: 'platformName'
        },
        platShareMenuForm:{
          shareId:0,
          linkagePlatformId: 0,
          linkagePlatformName: [],
          menuId:'',
          myPlatformName: [],
          name: '',
          myPlatformId:'',
          linkagePlatformId:''
        },
        //点击使用
        platformId:0,
        //表格
        platShareMenuList: [],
      }
    },
    components: {
      TableTreeColumn
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/platform/treeList'),
          method: 'get'
        }).then(({data}) => {
          // console.log(data);
          this.platFormList = treeDataTranslate(data.tree, 'id')
          // console.log(this.platFormList)
          //请求表格数据
          this.$http({
            url: this.$http.adornUrl('/sys/platformShare/listByPage'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'key': this.dataForm.key
            })
          }).then(({data}) => {
            // console.log(data)
            //this.platShareMenuList = treeDataTranslate(data.platShareMenuList, 'id')
            if (data && data.code === 0) {
              this.platShareMenuList = data.page.list
              this.totalPage = data.page.totalCount
            } else {
              this.platShareMenuList = []
              this.totalPage = 0
              this.$message.error(data.msg);
            }
          })
        })
      },

      // 获取id
      handleNodeClick(obj){

        if(obj.id == null || obj.id == undefined){
          //点击上下一页
          //alert("点其他的再点")
          this.platformId = obj;
        }else{
          //解决分页失效问题
          this.pageIndex = 1;
          this.$refs.pagination.lastEmittedPage = 1
          //直接点击平台执行
          this.platformId = obj.id;
        }
        //alert(this.pageIndex+"======"+this.platformId)
        //请求表格数据，根据平台id
        this.$http({
          url: this.$http.adornUrl(`/sys/platformShare/listByMyIdAndPage`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'platformId':this.platformId
          })
        }).then(({data}) => {
          // console.log(data);
          if (data && data.code === 0) {
            this.platShareMenuList = data.menuList.list
            this.totalPage = data.menuList.totalCount

          } else {
            this.platShareMenuList = []
            this.totalPage = 0
            this.$message.error(data.msg);
          }
        })
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
        if(this.platformId == 0 || this.platformId == null){
          this.getDataList()
        }else{

          this.handleNodeClick(this.platformId)
        }
      },

      // 新增 / 修改
      addOrUpdateHandle (id,myId,linkageId) {

        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,myId,linkageId)
        })
      },

      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/platformShare/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
<style lang="scss">
  /*.el-aside {
    color: #333;
    text-align: center;
    height: calc(100vh - 350px);
    border: 1px solid #ebeef5;
    margin-top: 18px;
    padding-top: 10px;
  }
  .el-col-6{
    width: 20%;
  }
  .site-wrapper .el-pagination{
    text-align: center;
  }
  .input-button{
    padding: 10px 0 20px 0;
  }
  .input-with-select{
    width: 300px;
    float: left;
    margin-right: 20px;
  }*/
</style>
