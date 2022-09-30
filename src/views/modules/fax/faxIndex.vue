<template>
  <div class="faxRoot">
    <div class="faxRoot__rightTree">
      <fax-tree
        :list="modifiedUserList"
        :listProps="modifiedUserProps"
        @handleNodeClick="handleNodeClick"
        @addTree="addEventType"
        @setCheckedIds="setCheckedIds"
      ></fax-tree>
    </div>
    <div>test</div>
  </div>
</template>

<script>
import faxTree from "./components/fax-tree";

export default {
  comments: {
    faxTree: "fax-tree"
  },
  data() {
    return {
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    // 点击树形节点事件
    // 点击树形节点事件
    handleNodeClick(obj) {
      console.log(obj);
      //   function findChilden(obj, list) {
      //     list.push(obj.id);
      //     let children = obj.children;
      //     // console.log(list)
      //     if (children != null) {
      //       children.forEach((item, index) => {
      //         // console.log(item)
      //         findChilden(item, list);
      //       });
      //     }
      //   }

      //   // console.log('树形结点点击事件', obj)
      //   this.selectedNode = [];
      //   this.currentTreeObject = obj.id;
      //   this.treeForm.currentTreename = obj.name;
      //   this.search = "";
      //   // 分组描述
      //   this.treeForm.groupingdescription = obj.remark;
      //   this.treeForm.type = obj.type;
      //   this.currentTreeplatformId = obj.platformId;
      //   this.currentTreeparentId = obj.parentId;
      //   this.currentTreeancestors = obj.ancestors;

      //   findChilden(obj, (this.selectedNode = []));

      //   // console.log('selectedNode:' + this.selectedNode)
      //   // console.log(this.currentTreeObject)
      //   // console.log(this.treeForm.currentTreename)
      //   // 查询树形关联的联系人
      //   this.$http({
      //     url: this.$http.adornUrl(`/mail/mailcontactor/list`),
      //     method: "POST",
      //     data: this.$http.adornData({
      //       limit: this.pageSize,
      //       page: 1,
      //       groupId: this.selectedNode,
      //       platformId: String(this.sharedPlatform.platformId)
      //     })
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       // console.log(data)
      //       this.totalCount = data.data.totalCount;
      //       this.currPage = data.data.currPage;
      //       this.pageSize = data.data.pageSize;
      //       this.platShareMenuList = data.data.list;
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
    },

    // 添加分组
    addEventType() {
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2); // 代表新增
      });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    }
  }
};
</script>
