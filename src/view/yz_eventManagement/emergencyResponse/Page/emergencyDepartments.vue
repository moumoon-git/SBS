<template>
  <div class="custom-tree-container">

      <div class="block" style="border: 1px solid rgba(211, 215, 219, 1);box-sizing: border-box;margin-top: 2px;">
        <el-scrollbar style="height: 650px;overflow: hidden">
        <el-tree
          :data="departmentsUpToType"
          node-key="id"
          :show-checkbox="this.type=='职责分发'"
          :expand-on-click-node="false"
          :default-expand-all="true"
          :filter-node-method="filterNode"
          ref="tree"
          @node-click="handlerNodeClick"
          @check-change="handlerCheckChange"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }" :title="data.mobile?'联系电话'+data.mobile:''">
          <span>{{ data.name }}</span>
          <span v-if="false">
        <el-dropdown :hide-on-click="false" trigger="click">
          <span class="el-dropdown-link">
            ...
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!data.mobile" @click="handleAddContact(data.id)">新增</el-dropdown-item>
            <el-dropdown-item v-if="data.mobile" @click.native="handleDeleteContact(data.id)">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          </span>
        </span>
        </el-tree>
    </el-scrollbar>
      </div>

  </div>
</template>

<script>
  export default {
    name: "emergencyDepartments",
    props: ['type'],
    data() {
      return {
        checkedList: [],
        departments: []
      }
    },
    methods: {
      filterNode(value, data) {
        console.log(data)
        return data.show !== false;
      },
      handlerNodeClick(obj) {
        console.log(obj)
        this.$emit('getPersonInfo', obj)
      },
      handlerCheckChange() {
        this.checkedList = this.$refs.tree.getCheckedNodes(true)
        this.$emit('checkChange', this.checkedList)
      },
      //根据eventId获取事件响应组织架构
      getStruct() {
        let eventId = sessionStorage.getItem('newID');
        if (eventId == '' || eventId == null || eventId == undefined) return
        let data = {
          eventId
        }
        this.$api.responseGetStruct(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.departments = res.data
        })
      },
      handleAddContact() {

      },
      handleDeleteContact(id) {
        this.$api.responseDeleteContact({id}).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
          } else {
            this.$message({
              message: '删除成功',
              type: "success"
            });
            this.getStruct()
          }
        })
      },
      treeFind(menus) {
        menus.forEach(data => {
          data.children && data.children.length > 0 && data.children[0].mobile && (data.children = [])
          data.children && data.children.length && this.treeFind(data.children)
        })
        return menus
      },
    },
    computed: {
      departmentsUpToType:{
        get(){
          if (this.type === '通讯调度') {
            let tree = [{
              id: 0,
              name: '组织架构',
            }]
            tree[0].children = JSON.parse(JSON.stringify(this.departments))
            // arr.forEach(item1 => {
            //   item1.children.forEach(item2 => {
            //     //判断是否还有子节点
            //     if (item2.children.length > 0 && item2.children[0].children && item2.children[0].children.length > 0) {
            //       item2.forEach(item3 => {
            //         if (item3.children.length > 0 && item3.children[0].mobile.length > 0) {
            //           item3.childs = JSON.parse(JSON.stringify(item3.children))
            //           item3.children = []
            //         }
            //       })
            //     } else if (item2.children.length > 0 && item2.children[0].mobile.length > 0) {
            //       item2.childs = JSON.parse(JSON.stringify(item2.children))
            //       item2.children = []
            //     }
            //   })
            // })
            tree = this.treeFind(tree)
            return tree
          }
          if (this.type === '职责分发' || this.type === '回复情况') {
            let tree = [{
              id: 0,
              name: '组织架构',
            }]
            tree[0].children = this.departments
            return tree
          }
        }
      }
    },
    created() {
      this.getStruct()
    }
  };
</script>

<style scoped>
  .custom-tree-container {
    width: 100%;
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .block {
    height: 100%;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 15px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
