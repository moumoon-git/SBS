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
              <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
              <el-button type="danger" size="medium" icon="el-icon-delete" @click="batchDelete(tableChecked,treeChecked)">批量删除</el-button>
              <el-upload
                action="/mail/mailgroup/xlsInput/"
                style="display: inline-flex; margin: 0 10px;">
                <el-button type="success">导入<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
              <el-button type="success" @click="downloadtemplate(treeChecked)">导出模板<i class="el-icon-download el-icon--right"></i></el-button>
              <el-button type="success" @click="exportExcel(treeChecked)">导出数据<i class="el-icon-printer el-icon--right"></i></el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-aside width="302px" style="background: #cccccc47;margin-top: 18px;padding-top: 10px;">
          <el-header style="height: 48px;margin-top: 20px;" class="operation-btn">
            <el-tooltip effect="dark" content="查看" placement="top">
              <el-button type="success" size="small" icon="el-icon-view" circle @click="open"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="添加" placement="top">
              <el-button type="primary" size="small" icon="el-icon-plus" circle @click="newgrouping(superiormenu)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改分组" placement="top">
              <el-button type="warning" size="small" icon="el-icon-edit" circle @click="modify"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除分组" placement="top">
              <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deletegrouping(treeChecked)"></el-button>
            </el-tooltip>
          </el-header>
          <el-tree
            default-expand-all
            @node-click="handleNodeClick"
            :data="modifiedUserList"
            :props="modifiedUserProps"
            node-key="id"
            style="background: #cccccc47;
            margin-top: 18px;
            height: calc(100vh - 300px);
            padding-top: 10px;"
            >
          </el-tree>
        </el-aside>
      </el-col>
      <el-col :span="18">
        <!--表格-->
        <el-table
          @selection-change="handleSelectionChange"
          :data="platShareMenuList"
          border
          style="width: 100%;
          margin-top: 20px">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            width="60"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="130"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="workUnit"
            header-align="center"
            align="center"
            width="170"
            label="工作单位">
          </el-table-column>
          <el-table-column
            prop="officeTel"
            header-align="center"
            align="center"
            width="140"
            label="办公室电话">
          </el-table-column>
          <el-table-column
          prop="mobile1"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="手机号码">
        </el-table-column>
          <el-table-column
            prop="position"
            header-align="center"
            align="center"
            :show-overflow-tooltip="true"
            label="职务">
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
          <!--隐藏宽-->

          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="250"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:platform:update')" type="info" size="mini" @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
              <el-button v-if="isAuth('sys:platform:update')" type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
              <el-button v-if="isAuth('sys:platform:delete')" type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './echarts-add-or-update'
  import { treeDataTranslate } from '@/utils'

  // import FileSaver from "file-saver";
  // import XLSX from "xlsx";
  export default {
    data () {
      return {
        selectOrg:[],
        //批量删除
        tableData:[],
        //树形的上一级
        superiormenu:[],
        tableChecked:[],
        treeChecked:[],
        ids:[],
        ///////////////
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        //修改窗口
        addOrUpdateVisible: false,
        //添加授权窗口
        addingauthorization:false,
        platDataForm: {
          id: 0,
          name:'',
          gmtCreate:'',
          platformId:'',
        },
        //树形
        modifiedUserList: [],
        modifiedUserProps: {
          children: 'children',
          label: 'name'
        },
        //表格内容
        platShareMenuForm:{
          age:0,
          gmtCreate: 0,
          firstName: '',
          id:'',
          homeTel:'',
          mobile1: '',
          mobile2: '',
          name: '',
          officeTel:'',
          position:'',
          workUnit:''
        },
        //表格
        platShareMenuList: [],
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //表格选中
      handleSelectionChange (val) {
        var tal = [];
        // console.log("handleSelectionChange--", val)
        for (var i = 0; i < val.length; i++) {
          tal.push(val[i].id)
          this.tableChecked = tal
        }

      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/list'),
          method: 'get'
        }).then(({data}) => {
          if(data.code ===0){
            // console.log(data);
            this.modifiedUserList = treeDataTranslate(data.tree, 'id')
            // console.log(this.modifiedUserList)
            //请求表格数据
            this.$http({
              url: this.$http.adornUrl('/mail/mailcontactor/list'),
              method: 'POST'
            }).then(({data}) => {
              if(data.code ===0){
                // console.log(data)
                this.platShareMenuList = treeDataTranslate(data.data, 'id')
                // console.log(this.platShareMenuList)
              }else {
                // this.$message.error(data.msg)
              }
            })
          }else {
            this.$message.error(data.msg)
          }
        })
      },
      //点击树形更新表格
      handleNodeClick (obj, data) {
        this.superiormenu = data.data.parentId
        //所点击的树节点id
        this.treeChecked = data.data.id
        //所点击的平台id
        this.treeplatformId = data.data.platformId
        //所点击的树形名称
        this.treename=data.data.name
        let groupId = obj.id;
        //请求表格数据
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          params: this.$http.adornParams({
            groupId: groupId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.platShareMenuList = data.data;
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //查看分组
      open () {
        if (this.treeChecked == "") {
          this.$message.error("请选择一个分组!")
          return
        }
          this.$prompt('查看分组', {
            center: true,
            inputValue:this.treename
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '关闭查看'
            });
          });
      },
          //新增分组
            newgrouping () {
            this.$prompt('新增分组', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true,
            }).then(( value ) => {
          this.$http({
            url: this.$http.adornUrl(`/mail/mailgroup/save`),
            method: 'post',
            data: this.$http.adornData({
              'name':value.value,
              'parentId':  this.superiormenu || 0
            })
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
        }).catch(() => {
        })
      },
      //修改分组
      modify () {
        if (this.treeChecked == "") {
          this.$message.error("请选择一个分组!")
          return
        }
        this.$prompt('修改分组', {
          center: true,
          inputValue:this.treename
        }).then(( value ) => {
          this.$http({
            url: this.$http.adornUrl(`/mail/mailgroup/update`),
            method: 'post',
            data: this.$http.adornData({
            "id": this.treeChecked,
            "name": value.value,
            "platformId": this.treeplatformId
            })
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
        }).catch(() => {
        })
      },
      //删除分组
      deletegrouping (rows) {
        this.$confirm(`确定对进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/mail/mailgroup/delete/${this.treeChecked}`),
            method: 'post',
            // data: this.$http.adornData(id)
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
        }).catch(() => {
        })
      },

      //导出数据
      exportExcel(){
        let token=document.cookie
        let exportEx = this.treeChecked
        window.open("http://192.168.6.88:8888//mail/mailgroup/xlsOutput?gId="+exportEx+"&"+token);
      },
      //导出模板
      downloadtemplate(){
        let token=document.cookie
        let exportEx = this.treeChecked
        // console.log(exportEx)
        window.open("http://192.168.6.88:8888//mail/mailgroup/gettemplate?gId="+exportEx+"&"+token);
      },
      //批量删除
      batchDelete (rows) {
        // console.log(this.treeChecked)
        // console.log(this.tableChecked)
        var id={
          "contactorIds":this.tableChecked ,
          "groupId":this.treeChecked
        }
        // console.log(id)
        this.$confirm(`确定进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/mail/mailcontactor/deleteByMap'),
            method: 'post',
            data: this.$http.adornData(id,false)
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
          },
      // 删除
      deleteHandle (id) {
        var id={
          "contactorIds":this.tableChecked ,
          "groupId":this.treeChecked
        }
        this.$confirm(`确定进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/mail/mailcontactor/deleteByMap`),
            method: 'post',
            data: this.$http.adornData(id,false)
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
  .el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
    /*line-height: 500px;*/
    border: 1px solid #ebeef5;
  }
  .el-col-6{
    width: 23%;
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
  }
</style>
