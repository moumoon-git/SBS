<!--通讯录模块树组件-->
<template>
  <div>
    <el-input placeholder="请输入联系人名称进行搜索" v-model="filterText">
      <el-button slot="append" type="primary" size="mini" @click="secahrBook"
        >搜索</el-button
      >
    </el-input>

    <el-tree
      style="overflow: hidden"
      :show-checkbox="showCheckbox"
      class="filter-tree"
      :data="data"
      :default-expanded-keys="[1]"
      node-key="id"
      check-strictly
      @node-click="handleNodeClick"
      @check-change="handleCheckChange"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="span-ellipsis">
          <span>{{ data.label || data.mobile }}</span>
        </span>
        <span v-if="showPhoneIcon && node.disabled === false">
          <i
            class="el-icon-phone-outline"
            style="color: #00a854"
            @click="dailPhone(data)"
          ></i>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "smsPhoneTree",
  props: ["showCheckbox", "showPhoneIcon"],
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      data: [],
      saveData: [],
      ungroupedContact: {
        // 未分组联系人
        children: [], // type为"group"时的子分组
        disabled: true, // type为"group"时disabled为true
        fax: "",
        id: -1,
        label: "未分组联系人",
        mobile: "",
        officeTel: "",
        otherTel: "",
        position: "",
        temobile: "",
        type: "group",
        workUnit: "",
      },
    };
  },
  watch: {
    filterText: {
      handler(newV, oldV) {
        console.log(newV, oldV);
        if (newV == "" || newV == null) {
          this.data = this.saveData;
        }
      },
      deep: true,
    },
  },
  mounted() {
    let data = {
      pid: 0,
      code: "governmentAffairs", // 添加参数（根据融合通讯的来）author：hexinting date:2020-9-29
    };
    let that = this;
    this.$szApi.phoneGruopList(data).then((res) => {
      console.log(res);
      if (res.errorcode == 0) {
        that.saveData = JSON.parse(JSON.stringify(res.data));
        that.data = JSON.parse(JSON.stringify(res.data));
        // that.saveData.push(that.ungroupedContact); // 将未分组联系人分组添加到最后一个 author：hexinting date:2020-9-29 lastEditor:xuchuanxging lastUpdateTime:2021/1/14 16:43 BUG 9797
        // that.data.push(that.ungroupedContact); // 将未分组联系人分组添加到最后一个 author：hexinting date:2020-9-29 lastEditor:xuchuanxging lastUpdateTime:2021/1/14 16:43 BUG 9797
        // author:xuchuanxging lastUpdateTime:2021/1/14 16:43 BUG 9797
        // for (let i = 0; i < that.data.length; i++) {
        //   //bug 9794 author：qcx date:2021-1-6
        //   if (that.data[i].type == "group") {
        //     that.data[i].children = [
        //       {
        //         label: "",
        //         children: [],
        //       },
        //     ];
        //   }
        // }
        console.log("yangqd", that.data);
      } else {
        // //this.$message.error(res.msg)
      }
    });
  },
  methods: {
    secahrBook() {
      //关键字搜索,后端接口失踪，先不掉
      let data = {
        searchText: this.filterText,
      };
      this.$api.searchPhoneGruopList(data).then((res) => {
        if (res.errorcode == 0) {
          this.data = [];
          this.data = JSON.parse(JSON.stringify(res.data));
          console.log(res);
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    handleNodeClick(row, node) {
      console.log(row, node);
      //bug 9794 author：qcx date:2021-1-6 lastEditor:xuchuanxging lastUpdateTime:2021/1/14 16:43 BUG 9797
      // if (row.children[0] && row.children[0].label == "") {
      //   row.children = [];
      // }
      this.$emit("handleNodeClick", row, node);
    },
    dailPhone(data) {
      console.log(data);
    },
    handleCheckChange() {
      //获取tree选中的节点
      let res = this.$refs.tree.getCheckedNodes();
      console.log(res);
      let arr = [];
      res.forEach((item) => {
        arr.push({
          id: item.id,
          label: item.label,
          fax: item.fax,
          mobile: item.mobile,
        });
      });
      this.$emit("handleCheckChange", arr);
    },
    delectAllData() {
      this.$refs.tree.setCheckedKeys([]);
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.span-ellipsis {
  width: 100%;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
