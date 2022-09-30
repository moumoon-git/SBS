<template>
  <el-dialog title="新增相机到卡口" :close-on-click-modal="false" :visible.sync="visible" width="1000px">
    <el-row :gutter="20">
      <el-col :span="8">
        <tree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          :handleTree="clickType"
          @bayonetType="getDatatree"
          @handleNodeClickCamera="handelNodeClick"
        ></tree>
      </el-col>
      <el-col :span="8">
        <el-input v-model="search" placeholder="输入相机名称" @keyup.enter.native="onSearch">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="onSearch"
            style="padding: 12px 12px;"
          ></el-button>
        </el-input>
        <div class="candidate">
          <el-checkbox-group v-model="nameList">
            <el-checkbox
              v-for="person in personList"
              :disabled="person.openId=== null"
              openId
              :label="person.id"
              :key="person.id"
              @change="nameChanged(person.id)"
              style="text-align: left;"
            >{{ person.name }}</el-checkbox>
          </el-checkbox-group>
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="candidate" style="height: 540px;">
          <div class="header">
            <span>发送通知顺序</span>
          </div>

          <div style="padding-left: 10px;margin-top: 10px;text-align: left;">
            <!-- <el-tag
              v-for="choose in chooseList"
              :key="choose.id"
              closable
              @close="chooseChanged(choose)"
              style="text-align: left;"
              >{{ choose.name }}</el-tag
            >-->
            <!-- 执行顺序 -->
            <el-table
              :data="chooseList"
              :show-header="false"
              highlight-current-row
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <!-- <el-table-column type="selection" width="30px"></el-table-column> -->
              <!-- 当前项的索引值 -->
              <!-- <el-table-column :type="chooseList" width="55px"></el-table-column> -->
              <el-table-column prop="name" label="联系人名称" width="80px"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    :disabled="scope.$index===0"
                    @click="moveUp(scope.$index,scope.row)"
                  >
                    <i class="el-icon-arrow-up"></i>
                  </el-button>
                  <el-button
                    size="mini"
                    :disabled="scope.$index===(chooseList.length-1)"
                    @click="moveDown(scope.$index,scope.row)"
                  >
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                  <el-button
                    class="el-icon-delete"
                    style="color:#ff4949"
                    size="mini"
                    round
                    @click="deleteEle(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="submit-btn">
          <el-button size="small" type="primary" @click="handleCommit">确定</el-button>
        </div>
        <!--<el-button size="small" type="text" class="create-btn">新增联系人</el-button>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import Tree from "./tree";
import { treeDataTranslate } from "@/utils";
import { log } from "util";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      type: 2,
      modifiedUserList: [], // 管控类型树形结构
      modifiedUserProps: {
        children: "children",
        label: "name"
      },

      clickType: 1, //判断点击哪棵树

      visible: false,

      // 点击的卡口数据
      bayonetData: null,

      title: "",
      activePart: "first",
      search: "", // 搜索
      takethedata: "", // 部门所有信息
      topTreeID: "", // 部门ID
      topTreeName: "", // 当前选中的部门

      chooseList: [],
      personList: [], // 所有联系人对象数组
      nameList: [], // 选中联系人id数组
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      indexKey: 0,
      name: "", // 当前触发该组件的事件

      checkData: [] //选中树数据
    };
  },

  components: {
    Tree,
    draggable
  },
  methods: {
    // 点击新增打开弹窗
    init() {
      this.visible = true;
      this.getDatatree();
    },
    // 获取树形分类
    getDatatree(type) {
      this.bayonetTabView = true;
     if (type === 0) {
        this.type = 2;
      }else if(type === 1){
        this.type = 1;
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmBayonetInfo/list`),
        method: "get",
        params: this.$http.adornParams({ type: this.type })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("/risk/riskcameragroup/tree", data);

          this.modifiedUserList = treeDataTranslate(data.data, "id");
        } else {
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    // 获取所有相机列表
    getList() {
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmBayonetInfo/selectCamera"),
        method: "get",
        params: this.$http.adornParams({
          name: this.search,
          limit: this.pageSize,
          page: this.currentPage
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 详细联系人列表
          this.personList = data.data.list;
          this.total = data.data.totalCount;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleCurrentChange(val) {
      // console.log(val);
      this.currentPage = val;
      this.getList();
    },
    onSearch() {
      this.currentPage = 1;
      this.getList();
    },
    // 点击确认触发的事件
    handleCommit() {
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmBayonetInfo/saveBayonetCamera"),
        method: "POST",
        data: this.$http.adornData({
          id: this.checkData.id,
          cameras: this.chooseList.map(v => v.id),
          remark: this.checkData.remark
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功',
            duration: 1500,
            onClose:()=>{
              this.visible = false
              this.$emit('getDataList')
            }
          })
          // 详细联系人列表
          this.personList = data.data.list;
          this.total = data.data.totalCount;
        } else {
          this.$message.error(data.msg);
        }
        this.visible = false
      });
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
        // 该名字添加到选中项中
        for (let i in this.personList) {
          if (this.personList[i].id == id) {
            let data = JSON.parse(JSON.stringify(this.personList[i])); // 复制姓名列表中的对象保存在选中人对象数组中
            data.verify = this.topTreeName;
            data.groupId = this.topTreeID; // 当前所属部门id
            this.chooseList.push(data);
            return;
          }
        }
      }
    },
    // 点击树节点触发事件
    handelNodeClick(data) {
      this.checkData = data;
      this.topTreeName = data.name;
      let id = data.id;
      this.takethedata = data;
      this.topTreeID = id;
      this.search = "";
      this.handleHTTPNodeData(data);
    },
    // 点击子节点 获取数据
    handleHTTPNodeData(obj) {
      this.nameList = []; //点击其他树时，先清除上一次选中
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }
      let selectedNode = [];
      findChilden(obj, selectedNode);

      // 获取组已存在的相机
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmBayonetInfo/selectCameraByBayonet"),
        method: "get",
        params: this.$http.adornParams({
          id: obj.id,
          limit: this.pageSize,
          page: this.currentPage
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 将组已有1相机默认选中
          data.data.list.map(v => {
            this.nameList.push(v.id);
          });
        } else {
          this.$message.error(data.msg);
        }
        this.chooseList = data.data.list;
      });

      // 获取所有相机请求
      this.getList();
      // getList("/emergency/preparation/contactor/getList", datas).then(res => {
      //   if (res) {
      //     this.personList = res.data;
      //     this.total = res.totalElements;
      //   }
      // });
    },
    // 点击添加联系人事件
    handleAddContacts(url, title, name) {
      this.title = title || "请选择";
      this.name = name;
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
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    dynamicTags() {
      this.chooseList = [];
      this.personList = [];
      this.nameList = [];
    },
    deleteEle(ele) {
      this.chooseList.splice(this.chooseList.indexOf(ele), 1);
      let index = this.nameList.indexOf(ele.id);
      if (index !== -1) {
        this.nameList.splice(index, 1);
      }
    },
    // 选择复选框数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 上移
    moveUp(index, row) {
      var that = this;
      if (index > 0) {
        let upDate = that.chooseList[index - 1];
        that.chooseList.splice(index - 1, 1);
        that.chooseList.splice(index, 0, upDate);
      } else {
        // alert("已经是第一条，不可上移");
      }
    },
    // 下移
    moveDown(index, row) {
      var that = this;
      if (index + 1 === that.chooseList.length) {
        // alert("已经是最后一条，不可下移");
      } else {
        let downDate = that.chooseList[index + 1];
        that.chooseList.splice(index + 1, 1);
        that.chooseList.splice(index, 0, downDate);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input >>> .el-input__inner {
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

.el-checkbox-group >>> .el-checkbox {
  display: block;
  margin-top: 5px;
  margin-left: 10px;
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
}

.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #c0c0c0;
}

.header {
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  padding: 12px 18px;
  color: #303133;
  font-size: 14px;
}
.el-scrollbar {
  height: 480px;
}
</style>
