<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="1100px"
    center
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="custom-tree-node"></div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tabs v-model="activePart" type="card" style="width: 100%;min-width: 100%;">
          <el-tab-pane label="通讯联络网" name="first">
            <el-tree
              v-if="visible"
              :data="treeData"
              :props="treeProps"
              @node-click="handelNodeClick"
              ref="tree"
              node-key="id"
              highlight-current
              accordion
              :default-expanded-keys="[indexKey]"
            ></el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="9">
        <el-input
          v-model="search"
          placeholder="输入姓名搜索"
          @keyup.enter.native="onSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="onSearch"
            style="padding: 12px 12px;"
          ></el-button>
        </el-input>
        <div class="candidate">
          <el-checkbox-group v-model="nameList" :max=1>
            <el-checkbox
              v-for="person in personList"
              :label="person.id"
              :key="person.id"
              @change="nameChanged(person.id)"
              style="text-align: left;"
              >{{ person.name }}</el-checkbox
            >
          </el-checkbox-group>
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="candidate" style="height: 540px;">
          <div class="header">
            <span>选择结果</span>
          </div>
          <div style="padding-left: 10px;margin-top: 10px;text-align: left;">
            <el-tag
              v-for="choose in chooseList"
              :key="choose.id"
              closable
              @close="chooseChanged(choose)"
              style="text-align: left;"
              >{{ choose.name }}</el-tag
            >
          </div>
        </div>
        <div class="submit-btn">
          <el-button size="small" type="primary" @click="handleCommit"
            >确定</el-button
          >
        </div>
        <!--<el-button size="small" type="text" class="create-btn">新增联系人</el-button>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { log } from "util";
export default {
  props: ["dynamicTag"],
  data() {
    const data = [
      {
        id: 0,
        name: "联系人分组",
        children: null
      }
    ];
    return {
      title: "",
      visible: false, // 窗口是否可视
      activePart: "first",
      search: "", //搜索
      takethedata: "", // 部门所有信息
      topTreeID: 0, // 部门ID
      // 联系人分组树 数据
      treeData: JSON.parse(JSON.stringify(data)),
      // 子级显示的数据
      treeProps: {
        children: "children", // 子树的名字
        label: "name" // 树的名字
      },
      chooseList: [],
      personList: [], // 所有联系人对象数组
      nameList: [], // 选中联系人id数组
      total: 0, //总条数
      currentPage: 1, // 当前页
      pageSize: 5, // 每页显示的条数
      indexKey: 0
    };
  },
  //监听
   watch:{
      chooseList:function(val, oldVal){
        // console.log(val)
      }
   },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    onSearch() {
      this.getList();
    },
    // 点击确认触发的事件
    handleCommit() {
      // console.log(this.chooseList);
      if (this.chooseList === "" || this.chooseList === null) {
        this.$message({
          message: "请选择",
          type: "warning"
        });
      } else {
        let data = {
          department: this.takethedata,
          linkman: this.chooseList
        };
        this.$emit("OnchildByValue", data);
        this.visible = false;
      }
    },

    nameChanged(id) {
      let index = this.nameList.indexOf(id); // 判断是复选框取消选项还是选中选项
      if (index == -1) {
        // 该名字从选中项中删除
        for (let i in this.chooseList) {
          if (this.chooseList[i].id == id) {
            this.chooseList.splice(i, 1);
            break;
          }
        }
      } else {

        //alert(this.chooseList.length)
        if(this.chooseList.length <= 0){
          // 该名字添加到选中项中
          for (let i in this.personList) {
            if (this.personList[i].id == id) {
              let data = JSON.parse(JSON.stringify(this.personList[i])); // 复制姓名列表中的对象保存在选中人对象数组中
              this.chooseList.push(data);
              return;
            }
          }
        }else{
          // alert("已有选择人员")
          return;
        }


      }
    },
    // 点击标签删除按钮时删除标签
    chooseChanged(tag) {
      this.chooseList.splice(this.chooseList.indexOf(tag), 1);
      let index = this.nameList.indexOf(tag.id);
      if (index !== -1) {
        this.nameList.splice(index, 1);
      }
    },
    // 点击树节点触发事件
    handelNodeClick(data) {
      let id = data.id;
      this.takethedata = data;
      this.topTreeID = id;
      this.search = "";
      this.handleHTTPNodeData();
    },
    // 点击子节点 获取数据
    handleHTTPNodeData() {
      // console.log(this.topTreeID);
      let id = this.topTreeID;
      // 获取联系人请求
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/listOld"),
        method: "post",
        params: this.$http.adornParams({"groupId":id})
      }).then(({ data }) => {
        // console.log(data);

        if (data && data.code === 0) {
          // 详细联系人列表
          this.personList = data.data.list;
          this.total = data.data.list.length;
        }else {
          this.$message.error(data.msg)
        }
      });
      // getList("/emergency/preparation/contactor/getList", datas).then(res => {
      //   if (res) {
      //     this.personList = res.data;
      //     this.total = res.totalElements;
      //   }
      // });
    },
    // 点击添加联系人事件
    handleAddContacts(url, title) {
      this.title = title || "请选择";
      // 获取联系人部门请求
      this.visible = true;
      this.$http({
        url: this.$http.adornUrl(url),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.treeData[0].children = data.data;
          // this.handleHTTPNodeData();
          if (this.dynamicTag) {
            this.chooseList = JSON.parse(JSON.stringify(this.dynamicTag));
            let arrays = [];
            this.dynamicTag.forEach(function(data) {
              arrays.push(data.id);
            });
            this.nameList = arrays;
          }
        }else {
          this.$message.error(data.msg)
        }
      });
    },

    dynamicTags() {
      this.chooseList = [];
      this.personList = [];
      this.nameList = [];
    }
  }
};
</script>

<style scoped>

  .el-input{
    padding: 0 4px;
  }
  .custom-tree-node {
    margin: 0 auto;
    margin-top: -20px;
  }
  .candidate {
    height: 500px;
    border-radius: 5px;
    padding-top: 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #303133;
    margin-top: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .selected {
    min-height: 380px;
  }

  .submit-btn {
    margin-top: 20px;
    text-align: center;
  }

  .create-btn {
    float: right;
    margin: 10px;
  }

  .el-checkbox-group  .el-checkbox {
    display: block;
    margin-top: 5px;
    margin-left: 10px;
  }

  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .el-scrollbar{
    overflow-x: hidden;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .el-tree--highlight-current
  .el-tree-node .is-current{
    background-color: #c0c0c0;
  }

  .header {
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    padding: 12px 18px;
    color: #303133;
    font-size: 14px;
  }
</style>
