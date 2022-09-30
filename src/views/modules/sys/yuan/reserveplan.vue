<template>
  <div class="mod-menu">
    <el-header style="height: 52px;padding: 0 20px 0 0; clear: both; margin-top: 6px" class="left">
      <reserveplan-header :value3="value3" :dataForm="dataForm" @addOrUpdateHandle="addOrUpdateHandle"/>
    </el-header>

    <el-row :gutter="20">
      <el-col :span="5">
        <tree :list="modifiedUserList" :listProps="modifiedUserProps" @showTree="showEventType"
              @addTree="addEventType" @updateTree="updateEventType" @deleteTree="deleteEventType" @commonSet="commonSet"
              @handleNodeClick="handleNodeClick" ></tree>
      </el-col>
      <el-col :span="19">
        <!--表格-->
        <reserveplan-table :dataList="dataList"/>
        <pagination :pageIndex="pageIndex" :pageSize="pageSize"
                    :totalPage="totalPage"/>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <!--<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->

    <!--事件弹窗,查看 /新增 / 修改-->
    <eventtype-add-or-update v-if="eventtypeAddOrUpdateVisible" ref="eventtypeAddOrUpdate"
                             @refreshEventTypeDataList="getDataList"></eventtype-add-or-update>

    <!--公共事件配置-->
    <common-set v-if="showCommonSet" ref="commonSetTree"/>


  </div>
</template>

<script>
  import Tree from '@/views/common/tree'
  import AddOrUpdate from './reserveplan-add-or-updata'
  import ReserveplanTable from './reserveplan-table'
  import ReserveplanHeader from '@/views/common/header'
  import Pagination from '@/views/common/pagination'
  import {treeDataTranslate} from '@/utils'
  import EventtypeAddOrUpdate from './eventtype-add-or-update'
  import CommonSet from './commonSet'

  export default {

    data () {
      return {
        value3: [],
        dataForm: {},
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        //修改窗口
        addOrUpdateVisible: false,
        //添加授权窗口
        addingauthorization: false,
        //事件类型窗口
        eventtypeAddOrUpdateVisible: false,
        //当前树形结点的id
        currentTreeId: '',
        //当前选中的树结点对象
        currentTreeObject: {},
        //公共事件配置
        showCommonSet: false,

        platDataForm: {
          id: 0,
          name: '',
          gmtCreate: '',
          platformId: '',
        },
        //终端
        modifiedUserList: [],
        modifiedUserProps: {
          children: 'children',
          label: 'name'
        },

      }
    },
    components: {
      ReserveplanTable,
      ReserveplanHeader,
      AddOrUpdate,
      Pagination,
      Tree,
      EventtypeAddOrUpdate,
      CommonSet,
    },
    activated () {
      this.getDataList()
    },
    computed: {
      isAdmin: {
        get () {
          return this.$store.state.user.isAdmin
        }
      }
    },
    methods: {
      //跳转新增页面
      goNewlyadded() {
        this.$router.push(
          { path: '/reserveplan-add-or-updata2', name: 'reserveplan-add-or-updata2' }
        );
      },
      commonSet(){
        this.showCommonSet=true
        this.$nextTick(() => {
          this.$refs.commonSetTree.init()//1代表查看
        })
      },

      // 获取数据列表
      getDataList () {
        // console.log('请求：getDataList')
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/event/eventType/${this.isAdmin===1 ? 'commonEventTypeTree' : 'list'}`),
          method: 'get'
        }).then(({data}) => {
          // console.log('/event/eventType/list', data)
          this.modifiedUserList = data.data
          // console.log(this.modifiedUserList)
          //请求表格数据
          this.$http({
            url: this.$http.adornUrl('/rp/plan/list'),
            method: 'get'
          }).then(({data}) => {
             if (data && data.code === 0) {
            // console.log(data)
            // console.log('请求：getDataList', data)
            this.platShareMenuList = treeDataTranslate(data.data, 'id')
            // console.log(this.platShareMenuList)
          } else {
            this.$message.error(data.msg)
          }
          })

          //进来时请求全部预案
          this.$http({
            url: this.$http.adornUrl('/rp/plan/listAndPage'),
            method: 'POST',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
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
        })
      },

      /*树形结点点击事件*/
      handleNodeClick (obj) {
        // console.log('树形结点点击事件', obj)
        this.currentTreeObject = obj
        //查询对就的预案
        this.getPlanById(this.currentTreeObject.id);
      },

      //根据事件类型id查询对应的预案
      getPlanById(id){
        //根据id查询预案
        this.$http({
          url: this.$http.adornUrl('/rp/plan/listAndPage'),
          method: 'POST',
          params: this.$http.adornParams({
            'event_type_id':id,
            'page': this.pageIndex,
            'limit': this.pageSize,
          })
        }).then(({data}) => {
          // console.log("根据事件类型id查询对应的预案",data)

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



      //查看事件类型
      showEventType (id) {
        this.eventtypeAddOrUpdateVisible = true
        // console.log('查看事件类型', this.eventtypeAddOrUpdateVisible)
        this.$nextTick(() => {
          this.$refs.eventtypeAddOrUpdate.init(id, this.currentTreeObject, 1)//1代表查看
        })
      },
      //添加事件类型
      addEventType () {
        this.eventtypeAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.eventtypeAddOrUpdate.init(null, null, 2)//代表新增
        })
      },
      //修改事件类型
      updateEventType (id) {
        this.eventtypeAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.eventtypeAddOrUpdate.init(id, this.currentTreeObject, 3)//代表修改
        })
      },
      //删除事件类型
      deleteEventType (ids) {
        // console.log('删除事件类型', ids)
        this.deleteEventTypeHandle(ids)
      },

      // 新增 / 修改
      addOrUpdateHandle (id) {
       // this.addOrUpdateVisible = true
        /*this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })*/

        this.goNewlyadded()
      }
      ,
      //删除事件类型
      deleteEventTypeHandle (ids) {
        this.$confirm(`确定对[id=${ids}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/rp/plan/listByIds'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            // console.log('/rp/plan/listByIds', data)

            if (data.rePlan.length > 0) {
              this.$message.error('删除的事件类型中存在预案，请先删除预案!')
            } else {
              this.$http({
                url: this.$http.adornUrl('/event/eventType/delete'),
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
            }
          })

        }).catch(() => {
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
            url: this.$http.adornUrl(`/sys/platform/delete/${id}`),
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
        }).catch(() => {
        })
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

  .el-col-6 {
    width: 20%;
  }

  .site-wrapper .el-pagination {
    text-align: center;
  }

  .input-button {
    padding: 10px 0 20px 0;
  }

  .input-with-select {
    width: 300px;
    float: left;
    margin-right: 20px;
  }
</style>
