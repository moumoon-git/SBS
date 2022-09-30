// 操作员管理
<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="position:relative;">
      <el-form-item>
        <el-input style="width:300px;" v-model="dataForm.userName" placeholder="请输入用户名/昵称/手机号/平台名称" clearable></el-input>
      </el-form-item>

      <el-button class="save" type="primary" @click="getDataList()">查询</el-button>

      <div style="position: absolute;right: 0%;top:0%;">
        <el-button class="save" v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle(null,'add')">新增</el-button>
        <el-button class="save" v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </div>

    </el-form>

    <el-col :gutter="20">
      <el-col :span="5" class="userTree">
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
            prop="userId"
            header-align="center"
            align="center"
            width="80"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="platformName"
            header-align="center"
            align="center"
            label="终端用户">
          </el-table-column>
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label="用户登录名">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="用户昵称">
          </el-table-column>
          <el-table-column
            prop="email"
            header-align="center"
            align="center"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号">
          </el-table-column>

          <el-table-column
            prop="createName"
            header-align="center"
            align="center"
            label="创建者">
          </el-table-column>
  
          <el-table-column
            prop="department"
            header-align="center"
            align="center"
            label="所属部门">
          </el-table-column>

          <el-table-column
            prop="gmtCreate"
            header-align="center"
            width="180"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId,'update')">修改</el-button>
              <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
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
    <!--新增弹窗-->

  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  import { platformTreeDataTranslate } from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },

        //终端
        platformId: '',
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

    mounted (){
      this.getPlatformDataList();
      this.getDataList()
      this.getInfo();
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

      getInfo(){
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
        }).then(({data}) => {
          // console.log(12345)
          if (data && data.code === 0) {
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
        })
      },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/userList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName,
            'platformId': String(this.platformId),
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
      deleteHandle(row) {
        const userIds = row ? [row.userId] : this.dataListSelections.map(item => {
          return item.userId
        });
        const userNames = row ? [row.username] : this.dataListSelections.map(item => {
          return item.username
        });
        this.$confirm(`确定对"${userNames.join(',')}"进行[${row ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
  .mod-user{
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
       .el-button--danger{
        margin-left: 20px;
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
      .el-button--text{
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(118,214,114,1);
      }
      .el-button:last-child{
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(230,115,128,1);
      }
    }

    .userTree{
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
