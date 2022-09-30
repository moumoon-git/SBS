<template>
  <div class="treebox">
    <el-header
      style="height: 48px;padding: 5px;border: 1px solid rgb(229, 229, 229);text-align: center;padding: 5px;display:flex"
      class="operation-btn"
    >
      <el-tooltip
        effect="dark"
        content="查看"
        placement="top"
      >
        <el-button
          v-if="isAuth('mail:mailgroup:info')"
          type="success"
          size="small"
          @click="showTree()"
        >
          查看
        </el-button>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="添加"
        placement="top"
      >
        <el-button
          v-if="isAuth('mail:mailgroup:save')&&!$parent.sharedPlatform.noticeBarVisible"
          type="primary"
          size="small"
          @click="addTree()"
        >
          添加
        </el-button>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="修改"
        placement="top"
      >
        <el-button
          v-if="isAuth('mail:mailgroup:update')&&!$parent.sharedPlatform.noticeBarVisible"
          type="warning"
          size="small"
          @click="updateTree()"
        >
          修改
        </el-button>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="删除"
        placement="top"
      >
        <el-button
          v-if="isAuth('mail:mailgroup:delete')&&!$parent.sharedPlatform.noticeBarVisible"
          type="danger"
          size="small"
          @click="deleteTree()"
        >
          删除
        </el-button>
      </el-tooltip>
    </el-header>
    <div class="treeClass">
      <el-scrollbar
        wrap-class="list"
        wrap-style="color: red;max-height:655px;"
        view-class="view-box"
        :native="false"
      >
        <el-tree
          class="treeboxbotten"
          show-checkbox
          :default-expanded-keys="treeexpansion"
          :data="list"
          :props="listProps"
          node-key="id"
          ref="tree"
          style="padding-top: 10px;"
          current-node-key
          highlight-current
          check-strictly
          draggable
          @node-click="handleNodeClick"
          @check="checkGroupNode"
          @node-drop="handleDrop"
        />
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list', 'listProps', 'treeexpansion'],
  data() {
    return {
      groupingcheckbox: [],
      currentTreeId: '',
      checkedIds: [], // 当前选中的id数组
    };
  },
  methods: {
    // 拖拽tree成功
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.$emit('modifythename', draggingNode, dropNode, dropType, ev);
    },

    // 查看Tree
    showTree() {
      if (!this.currentTreeId) {
        this.$message.error('请选择一个分组!');
        return;
      }
      if (this.isPlatform) {
        this.$message.error('很抱歉,平台不能查看,请查看分组');
        return;
      }
      this.$emit('showTree');
    },
    // 添加Tree
    addTree() {
      this.$emit('addTree');
    },
    // 修改Tree
    updateTree() {
      if (!this.currentTreeId) {
        this.$message.error('请选择一个分组!');
        return;
      }
      this.$emit('updateTree');
    },
    // 删除Tree
    deleteTree() {
      if (this.groupingcheckbox.length == 0) {
        this.$message({
          message: '请选择要删除的分组!',
          type: 'error',
          offset: 100,
        });
        return;
      }
      this.$emit('deleteTree');
    },
    /**
     * @author tanjinfeng
     * @date 2020-11-25
     * @description 功能优化：勾选父节点时，子节点全部勾选上，子节点勾选不影响父节点（:check-strictly="true"）
     */
    // *** 原来的代码 ***
    // //监听树形复选框的勾选id
    // checkGroupNode(id, arr) {
    //   this.groupingcheckbox = arr.checkedKeys;
    //   // console.log("监听树形复选框的勾选id",this.groupingcheckbox,arr,id);
    //   this.$emit("setCheckedIds", arr.checkedKeys,arr.checkedNodes);
    // },
    // *** 修改后的代码 ***
    checkGroupNode(nodeObj, statusObj) {
      // 勾选的时候
      if (statusObj.checkedKeys.includes(nodeObj.id)) {
        // 当前选中的节点
        const keys = this.$refs.tree.getCheckedKeys() || [];

        /**
         * @function
         * @description 递归查找树节点子节点
         * @param {Object} obj 树节点对象
         * @return {Array} 所有子孙节点key集合
         */
        const findChildren = (obj) => {
          const result = [];
          if (obj.children) {
            obj.children.forEach((child) => {
              result.push(child.id);
              if (child.children) {
                result.push(...findChildren(child));
              }
            });
          }
          return result;
        };

        // 设置勾选
        if (nodeObj.id === 0) {
          keys.push(this.list[1].id);
          keys.push(...findChildren(this.list[1]));
        } else {
          keys.push(...findChildren(nodeObj));
        }

        this.$refs.tree.setCheckedKeys(keys, true);
      }
      // this.groupingcheckbox = this.$refs.tree.getCheckedKeys();
      // this.checkedIds = this.$refs.tree.getCheckedKeys();
      // // 判断是否勾选全部
      // if (nodeObj.id === 0) {
      //   // 判断勾上还是取消勾选
      //   const check = this.$refs.tree.getCheckedNodes().find((item) => item.id === 0);
      //   if (check) {
      //     this.$refs.tree.setCheckedNodes(this.list);
      //   } else {
      //     this.$refs.tree.setCheckedNodes([]);
      //   }
      // }
      const arr = this.$refs.tree.getCheckedNodes().filter(
        (item) => item.id !== 0 && !item.platformName
      );
      const ids = [];
      arr.forEach((item) => {
        ids.push(item.id);
      });
      this.checkedIds = ids;
      this.groupingcheckbox = ids;
      this.$emit('setCheckedIds', ids, this.$refs.tree.getCheckedNodes());
    },
    // *** 结束 ***
    // 点击树形更新表格
    handleNodeClick(obj) {
      console.log(obj);
      this.$emit('handleNodeClick', obj);
      if (obj.platformName) {
        this.isPlatform = true;
      } else {
        this.isPlatform = false;
      }
      this.currentTreeId = obj.id;
      // console.log(this.currentTreeId)
      /* let groupId = obj.id
        //请求表格数据
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          params: this.$http.adornParams({
            groupId: groupId
          })
        }).then(({data}) => {
          this.platShareMenuList = data.data
        }) */
    },
  },
};
</script>

<style scoped>
.treeClass {
  height: 648px;
  margin-top: 8px;
  border: 1px solid rgba(229, 229, 229, 1);
  background-color: #fff;
}
.treebox > .treeboxtop {
  line-height: 60px;
}
.treebox .el-tree-node__content {
  height: 50px;
  margin-left: 10px;
}
</style>
