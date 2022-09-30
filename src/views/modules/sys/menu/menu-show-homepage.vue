<template>

  <el-dialog
    title="菜单排序"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="800px">

    <div style="margin: 0 auto;height: 600px;overflow-y: auto;overflow-x: hidden;margin-bottom: 30px">

      <vxe-table
        border
        resizable
        show-overflow
        ref="xTable"
        row-id="id"
        :loading="loading"
        :tree-config="treeConfig"
        :data="tableData"
        :edit-config="{trigger: 'manual', mode: 'row'}">

        <vxe-table-column field="name" title="系统名称" tree-node></vxe-table-column>
        <vxe-table-column field="orderNum" title="系统排序"></vxe-table-column>
        <vxe-table-column field="customMenuName" title="自定义名称" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="customOrderNum"  title="自定义排序" :edit-render="{name: 'input', attrs: {type: 'number'}}"></vxe-table-column>

        <!-- <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <template v-if="$refs.xTable.isActiveByRow(row)">
              <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
              <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
            </template>
            <template v-else>
              <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
            </template>
          </template>
        </vxe-table-column> -->
        <vxe-table-column title="操作" align="center">
          <template slot-scope="scope">
            <template v-if="$refs.xTable.isActiveByRow(scope.row)">
              <el-button type="plain" size="small" @click="saveRowEvent(scope.row)">保存</el-button>
              <el-button type="plain" size="small" @click="cancelRowEvent(scope.row)">取消</el-button>
            </template>
            <template v-else>
              <el-button type="plain" size="small" @click="editRowEvent(scope.row)">编辑</el-button>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>

    </div>

  </el-dialog>



</template>
<script>

  import { treeDataTranslate } from '@/utils'

  export default {
    props: {},

    data () {
      return {
        visible: false,
        loading: false,
        tableData: [],
        sexList: [],
        removeList: [],
        treeConfig: {
          children: 'children'
        }
      }
    },
    created () {
      this.findList();
    },
    methods: {

      init(){
        this.visible = true;
      },

      findList () {
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
                // console.log("获取数据列表1",data)
                this.tableData = treeDataTranslate(data, 'menuId')
                this.sexList = this.tableData;
                // console.log("获取数据列表2",this.tableData)
          } else {
            this.$message.error(data.msg)
          }
          
        })
      },

      removeEvent () {
        let xTree = this.$refs.xTree
        let removeRecords = xTree.getSelectRecords()
        removeRecords.forEach(row => {
          let matchObj = this.$utils.findTree(this.tableData, item => item === row, this.treeConfig)
          if (matchObj) {
            let { items, index } = matchObj
            // 从树节点中移除
            let restRow = items.splice(index, 1)[0]
            this.removeList.push(restRow)
          }
        })
        xTree.refreshData()
      },

      reload () {
        // 清除所有状态
        this.$refs.xTree.clearAll()
        return this.findList()
      },


      //编辑框关闭触发
      editClosedEvent ({ row, column }, event) {
        // console.log("编辑框关闭",row)
      },

      // 编辑框打开时触发
      handleEditActivedEvent ({ row, column }, event) {
        // console.log("编辑框打开时触发", row)
      },

      editRowEvent (row) {
        this.$nextTick(() => {
          this.$refs.xTable.setActiveRow(row)
        })
      },
      saveRowEvent (row) {
        this.$refs.xTable.clearActived().then(() => {
            console.log("保存编辑",row)
            setTimeout(()=>{
                //保存成功，更新权限
                this.updatePlatformMenu(row.menuId,row.customMenuName,row.customOrderNum);
            },500)

        })
      },
      cancelRowEvent (row) {
        const xTable = this.$refs.xTable
        xTable.clearActived().then(() => {
          // 还原行数据
          xTable.revertData(row)
        })
      },

      updatePlatformMenu(platformMenuId,customMenuName,customOrderNum){
        this.$http({
          url: this.$http.adornUrl('/sys/platformmenu/updatePlatformMenu'),
          method: 'post',
          params: this.$http.adornParams({
            customMenuName: customMenuName,
            customOrderNum: customOrderNum,
            platformMenuId: platformMenuId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
              //刷新菜单
            this.findList();
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          } else {
            this.$message.error(data.msg)
          }
        })

      }

    }
  }
</script>

<style scoped lang="scss">

</style>
