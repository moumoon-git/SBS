<template>
  <div style="background-color: #f4f4f4;">
    <!--      短信-->
    <el-row style="padding:5px;">
      <el-col :span="5">
        <!-- <communication-sms-tree :cs="cs"  ></communication-sms-tree> -->
        <communication-sms-send-tree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @getCommonlyUsed="getCommonlyUsed"
          :Treeexpansion="Treeexpansion"
          @changeData="getDataList"
          @getDataList="getDataList"
        ></communication-sms-send-tree>
      </el-col>

      <el-col :span="5">
        <!-- <communication-sms-table :cs="cs"  ></communication-sms-table> -->
        <communication-sms-send-table
          @search="searchResult"
          :dataList="platShareMenuList"
        ></communication-sms-send-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          class="pagination"
          style="background-color: white;margin: 5px 4px 0 0"
        >
        </el-pagination>
      </el-col>
      <el-col :span="14">
        <!--<communication-sms-send :cs="cs"></communication-sms-send>-->
        <communication-sms-send-form
          @initData="initData"
        ></communication-sms-send-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import communicationSmsSendTree from "./sms_send_tree/sms_send_tree";
import communicationSmsSendTable from "./sms_send_table/sms_send_table";
import communicationSmsSendForm from "./sms_send_form/sms_send_form";
import { treeDataTranslate } from "@/utils";

export default {
  name: "sms_send",
  components: {
    "communication-sms-send-tree": communicationSmsSendTree,
    "communication-sms-send-table": communicationSmsSendTable,
    "communication-sms-send-form": communicationSmsSendForm
  },
  data() {
    return {
      // cs:{
      //   url:"xxxx.com",
      //   cs:"sdsdsds"
      // }
      selectedNode: [],
      // 表格
      platShareMenuList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },
      Treeexpansion: false,
      modifiedUserList: [],
      index: 0,
      search: "",

      page: 1,
      pageSize: 9,
      total: 0
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList(index) {
      this.page = 1;
      this.pageSize = 9;
      if (!index) {
        index = 0;
      }
      this.index = index;
      this.$http({
        url: this.$http.adornUrl(
          `${
            index == 0
              ? "/mail/mailgroup/list"
              : index == 1
              ? "/message/messageGroup/listTree"
              : ""
          }`
        ),
        method: index == 0 ? "get" : index == 1 ? "post" : ""
      }).then(({ data }) => {
        if (data && data.code == 0) {
          // console.log('data.data++++++++++++++++++++++++++++++++++++++',data.data)
          this.modifiedUserList = treeDataTranslate(data.data, "id");
          // console.log(data)

          index === 0 ? this.getCommonlyUsed(1) : this.initData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 点击树形节点事件
    handleNodeClick(obj) {
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }

      // console.log('树形结点点击事件', obj.id)

      this.selectedNode = [];

      findChilden(obj, (this.selectedNode = []));
      console.log(obj,this.selectedNode)
      // 查询树形关联的联系人
      this.initData();
    },
    initData(page, pageSize) {
      if (pageSize) {
        this.pageSize = pageSize;
      } else if (page) {
        this.page = page;
      }
      if (this.index == 0) {
        this.initContact(page, pageSize);
      } else if (this.index == 1) {
        this.initGroup(page, pageSize);
      }
    },
    // 初始化通讯录人员
    initContact(page, pageSize) {
      this.$http({
        url: this.$http.adornUrl(`/mail/mailcontactor/list`),
        method: "POST",
        data: this.$http.adornData({
          limit: this.pageSize,
          page: this.page,
          groupId: this.selectedNode,
          search: this.search
        })
      }).then(({ data }) => {
        // console.log(data)
        if (data.code === 0) {
          // this.page = data.data.currPage
          // this.pageSize = data.data.pageSize
          // console.log(this.pageSize)
          this.total = data.data.totalCount;
          this.platShareMenuList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 初始化分组人员
    initGroup(page, pageSize) {
      this.$http({
        url: this.$http.adornUrl(`/message/messageGroup/selectById`),
        method: "get",
        params: this.$http.adornParams({
          limit: this.pageSize,
          page: this.page,
          id: this.selectedNode.toString() ? this.selectedNode.toString() : -1,
          search: this.search
        })
      }).then(({ data }) => {
        // console.log(data)
        if (data.code === 0) {
          this.page = data.page.currPage;
          this.pageSize = data.page.pageSize;
          this.total = data.page.totalCount;
          this.platShareMenuList = data.page.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    searchResult(result) {
      if (this.index === 0) {
        this.search = result;
        this.initContact();
      } else if (this.index === 1) {
        this.search = result;
        this.initGroup();
      }
    },
    // 当前页
    handleCurrentChange(val) {
      this.initData(val, null);
    },
    // 常用联系人
    getCommonlyUsed(type) {
      this.$http({
        url: this.$http.adornUrl(
          `/message/messageinfor/${
            type === 1 ? "getCommonContract" : "getCurrentContract"
          }`
        ),
        method: "GET",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data.code === 0) {
          this.platShareMenuList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>

<style scoped></style>
