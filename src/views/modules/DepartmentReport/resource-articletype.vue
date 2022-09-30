<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('resoure:resourearticletype:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('resoure:resourearticletype:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
      <!-- <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="">
      </el-table-column> -->
      <!-- <el-table-column
        prop="parentId"
        header-align="center"
        align="center"
        label="父子id">
      </el-table-column> -->
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        
        label="物资类别">
      </table-tree-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="类型名称">
      </el-table-column>
      <!-- <el-table-column
        prop="platformId"
        header-align="center"
        align="center"
        label="终端用户id">
      </el-table-column>
      <el-table-column
        prop="createUserId"
        header-align="center"
        align="center"
        label="创建者id">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="modifiedUserId"
        header-align="center"
        align="center"
        label="修改者Id">
      </el-table-column>
      <el-table-column
        prop="gmtModified"
        header-align="center"
        align="center"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="isDeleted"
        header-align="center"
        align="center"
        label="删除 0：未删除  1：已删除">
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @close="addOrUpdateVisible=false"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './resourearticletype-add-or-update'
  import TableTreeColumn from '@/components/table-tree-column'
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
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
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
          url: this.$http.adornUrl('/resoure/resourearticletype/tree'),
          method: 'get',
          params: this.$http.adornParams(
            {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          }
          )
        }).then(({data}) => {
          // console.log('/resoure/resourearticletype/tree',data)
          if (data && data.code === 0) {
            // this.dataList = data.page.list
            // this.totalPage = data.page.totalCount
            this.dataList = data.tree
          } else {
            this.dataList = []
            this.totalPage = 0
            that.$message.error(data.msg);
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
            } else {
              that.$message.error(data.msg);
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
            } else {
              that.$message.error(data.msg);
            }
        });
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/resoure/resourearticletype/delete'),
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
        })
      }
    }
  }
</script>
