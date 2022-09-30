<template>
  <div style="min-width:320px;">
    <el-header style="height: 48px;padding: 5px;border: 1px solid rgb(229, 229, 229);text-align: center;" class="operation-btn" v-if="bayonetTab">
      <el-tooltip effect="dark" content="查看" placement="top">
        <!-- <el-button type="success" size="small" @click="showTree()" >查看</el-button> -->
      </el-tooltip>
      <el-tooltip effect="dark" content="查看" placement="top">
        <el-button type="success" size="small" @click="showTree()">查看</el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="添加" placement="top">
        <el-button type="primary" size="small" @click="addTree()">添加</el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="修改" placement="top">
        <el-button type="warning" size="small" @click="updateTree()">修改</el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除" placement="top">
        <el-button type="danger" size="small" @click="deleteTree()">删除</el-button>
      </el-tooltip>
    </el-header>
    <div style=" height:539px;border:1px solid rgba(229,229,229,1);background-color:#fff;padding:5px;">
      <el-scrollbar wrap-class="list" wrap-style="color: red;max-height:596px;" view-class="view-box" :native="false">
        <ul class="bayonetType">
          <li v-for="(item,index) in bayonetArr" :key="index" @click="handleTabClick(index)" :class="idx == index?'active':''">
            {{item}}
          </li>
        </ul>
        <el-tree
          @node-click="handleNodeClick"
          @check="checkGroupNode"
          :data="list"
          :props="listProps"
          :default-checked-keys="checkedIds"
          node-key="id"
          style="
            padding-top: 10px;"
          current-node-key
          show-checkbox
          highlight-current
          :expand-on-click-node="true"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <!-- <el-button type="text" size="mini" @click="() => updateTree(data)">修改</el-button>
              <el-button type="danger " size="mini" @click="() => deleteTree(node, data)">删除</el-button> -->
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list', 'listProps','bayonetTab','handleTree'],
  data () {
    return {
      currentTreeId: '',
      checkedIds: [], // 当前选中的id数组
      bayonetArr: ['人脸卡口','车辆卡口'], //卡口类型
      idx: 0, //判断选中
    }
  },
  computed: {
    isAdmin: {
      get () {
        return this.$store.state.user.isAdmin
      }
    }
  },
  
  methods: {
    // 复选框 选中触发事件
    checkGroupNode (id, arr) {
      this.checkedIds = arr.checkedKeys
      this.$emit('checkGroupNode', arr.checkedKeys)
    },
    // 查看Tree
    showTree () {
      this.$emit('showTree', this.currentTreeId)
    },
    // 添加Tree
    addTree () {
      this.$emit('addTree')
    },
    // 修改Tree
    updateTree (data) {
      this.$emit('updateTree', data)
    },
    // 删除Tree
    deleteTree (node, data) {
      if (this.checkedIds.length < 1) {
        this.$message.error('请勾选一个分组!')
        return
      }
      this.checkedIds = this.$refs.tree.getCheckedKeys()
      this.$emit('deleteTree', data)
    },
    // 公共设置
    commonSet () {
      this.$emit('commonSet')
    },

    // 点击树形更新表格
    handleNodeClick (obj) {
      // console.log(obj)
      if (this.handleTree === 1) {
        this.$emit('handleNodeClickCamera', obj)
      }else if (this.handleTree === 2) {
        this.$emit('handleNodeClickbayonet', obj)
      }
        this.currentTreeId = obj.id
    },
    // 点击tab卡口类型
    handleTabClick(index){
      this.idx = index
      this.$emit('bayonetType',this.idx)
    }
  }
}
</script>

<style scoped lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-button--danger {
  /* background-color: transparent;
  border: none;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: rgba(230, 115, 128, 1); */
}

.bayonetType{
  list-style: none;
  padding: 0;
  color: #606266;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 3px;
  li{
    flex: 1;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-right:1px solid #ccc;
    &:last-child{
      border:none;
    }
  }
  .active{
    color:cornflowerblue;
  }
}
</style>
