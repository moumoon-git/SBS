<template>
  <el-dialog
    title="添加分管人员"
    center
    class="sbs-dialog"
    width="48%"
    :visible.sync="visible"
    :close-on-click-modal="false"
  >
    <div class="flex">
      <div class="frame">
        <div class="headLine">
          {{ currNode.name }}
        </div>
        <div class="overFlow">
          <el-tree
            class="leftTree"
            default-expand-all
            :data="treeData"
            :show-checkbox="false"
            :props="{
              label: 'name',
              children: 'children',
            }"
            @node-click="handleUnitClick"
          />
        </div>
      </div>
      <div class="frame">
        <div class="headLine">
          {{ currNode.name }}
        </div>
        <div class="overFlow">
          <el-checkbox-group v-model="middleCheckList">
            <div
              v-for="item in middleList"
              :key="item.id"
              class="listItem"
            >
              <el-checkbox
                :label="item.id"
                @change="middleCheckbox(item)"
              >
                {{ item.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="frame">
        <div class="headLine">
          已选人员
        </div>
        <div
          class="overFlow"
          style="height: 40.7vh;"
        >
          <div
            v-for="item in rightCheckList"
            :key="item.id"
            class="listItem"
          >
            {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
            <img
              src="/static/img/reversePlan/close.svg"
              class="deleteImg"
              @click="rightDelete(item)"
            >
          </div>
        </div>
        <div class="bottomLine">
          已选{{ rightCheckList.length }}
          <el-button
            type="text"
            class="sbs-button"
            @click="rightCheckList = [], middleCheckList = []"
          >
            全部清空
          </el-button>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button
        type="plain"
        class="sbs-button"
        @click="visible = false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="submit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  emit: ['submit'],
  data() {
    return {
      visible: false, // 弹窗是否可见
      treeData: [], // 左树
      middleList: [], // 中间勾选框列表
      middleCheckList: [], // 中间选了什么
      rightCheckList: [], // 右边选了什么
      currNode: '', // 当前点击树节点
    };
  },
  methods: {
    init(id) {
      this.visible = true;
      this.middleList = [];
      this.middleCheckList = [];
      this.rightCheckList = [];
      this.$http({
        method: 'get',
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupChildrenTree?groupId=${id}`,
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.treeData = [res.data.data];
        }
      });
    },
    // 点击左边得中间列表
    handleUnitClick(data) {
      this.currNode = data; // 当前树节点
      // 该节点所有子组id
      const selectedNode = [];
      function findChilden(obj, list) {
        list.push(obj.id);
        const { children } = obj;
        if (children !== null) {
          children.forEach((e) => {
            findChilden(e, list);
          });
        }
      }
      findChilden(data, selectedNode);
      // 接口调用
      this.$http({
        method: 'post',
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailcontactor/list`,
        data: {
          groupId: selectedNode,
          limit: 100,
          page: 1,
          platformId: this.$store.state.user.platformId,
        },
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.middleList = res.data.data.list; // 中间列表
        }
      });
    },
    // 勾选中间,同时影响右边
    middleCheckbox(item) {
      // 当前el不在arr里，放入
      if (this.rightCheckList.filter((e) => e.id === item.id).length === 0) {
        this.rightCheckList.push(item);
      } else { // 移除
        this.rightCheckList = this.rightCheckList.filter((e) => e.id !== item.id);
      }
    },
    // 删右边，同时影响中间
    rightDelete(item) {
      // 右边同步取消
      this.rightCheckList = this.rightCheckList.filter((e) => e.id !== item.id);
      // 中间同步取消
      this.middleCheckList = [];
      this.rightCheckList.forEach((e) => {
        this.middleCheckList.push(e.id);
      });
    },
    // 保存
    submit() {
      this.visible = false;
      this.$emit('submit', this.rightCheckList);
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-evenly;
}
.frame {
  border: 1px solid #DDDDDD;
  width: 31%;
  margin: 20px 0;
}
.headLine {
  width: 100%;
  padding: 10px;
  background: #FBFCFF;
  border-bottom: 1px solid #DDDDDD;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.overFlow {
  height: 44vh;
  overflow: auto;
}
.listItem {
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.listItem:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.deleteImg {
  width: 17px;
  height: 17px;
  cursor: pointer;
}
.bottom {
  border-top: 1px solid #E9ECF1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 15px 10px;
}
.bottomLine {
  width: 100%;
  padding: 0 10px;
  background: #FBFCFF;
  border-top: 1px solid #DDDDDD;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.leftTree >>>.el-tree-node:focus>.el-tree-node__content{
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
</style>
