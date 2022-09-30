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
        <el-tabs
          v-model="activePart"
          type="card"
          style="width: 100%;min-width: 100%;"
        >
          <el-tab-pane label="通讯联络网" name="first" style="">
            <div
              style=" height:485px;border:1px solid rgba(229,229,229,1);background-color:#fff;"
            >
              <el-scrollbar
                wrap-class="list"
                wrap-style="max-height:485px;overflow: none;"
                view-class="view-box"
                :native="false"
              >
                <el-tree
                  v-if="visible"
                  :data="treeData"
                  :props="treeProps"
                  @node-click="handelNodeClick"
                  ref="tree"
                  node-key="id"
                  style="padding-top: 10px;"
                  highlight-current
                  accordion
                  :default-expanded-keys="[indexKey]"
                  :filter-node-method="filterNode"
                  show-checkbox
                  @check="handleCheckChange"
                ></el-tree>
              </el-scrollbar>
            </div>
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
          <el-checkbox-group v-model="nameList">
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
        <div class="candidate" style="height: 400px; overflow: auto;">
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
        <div class="batchHandler__roleSelect">
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in wxRoleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>

          <el-button size="small" type="primary" @click="handleCommit"
            >确定</el-button
          >
        </div>
        <!--<div class="submit-btn">
          <el-button size="small" type="primary" @click="handleCommit"
            >确定</el-button
          >
        </div>-->
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
      wxRoleOptions: [], // 角色
      roleId: "", // 角色id
      title: "",
      visible: false, // 窗口是否可视
      activePart: "first",
      search: "", //搜索
      takethedata: "", // 部门所有信息
      topTreeID: "", // 部门ID
      topTreeName: "", // 当前选中的部门
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
      pageSize: 10, // 每页显示的条数
      indexKey: 0,
      name: "", // 当前触发该组件的事件
      // 上一次勾选时的结果
      lastCheckedList: [],
      selectedNode: [], //选中的子节点id值
    };
  },
  mounted() {
    this.getRoleOptions();
  },
  methods: {
    // 获取角色
    getRoleOptions() {
      this.$http({
        url: this.$http.adornUrl(`/sys/role/select`),
        method: "get",
        params: this.$http.adornParams({
          terminal: "1"
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.wxRoleOptions = data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 节点筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getList() {
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/list"),
        method: "post",
        data: this.$http.adornData({
          limit: this.pageSize,
          page: this.currentPage,
          search: this.search,
          groupId: this.selectedNode
        })
      }).then(({ data }) => {
        // console.log(data);

        if (data && data.code === 0) {
          // 详细联系人列表
          this.personList = data.data.list;
          this.total = data.data.totalCount;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.currentPage = val;
      this.getList();
    },
    onSearch() {
      // console.log(this.search);
      this.currentPage = 1;
      this.getList();
      this.$refs.tree.filter(this.search);
    },
    // 点击确认触发的事件
    handleCommit() {
      if (
        this.chooseList === "" ||
        this.chooseList === null ||
        this.roleId === ""
      ) {
        this.$message({
          message: "请选择联系人和角色",
          type: "warning"
        });
      } else {
        console.log("选择的联系人", this.chooseList, this.roleId);
        let submitData = {
          userIds: this.chooseList.map(item => item.id),
          roleIds: [this.roleId]
        };
        // // 返回部门数据
        // this.$emit("OnchildByValue", data);
        // this.visible = false;
        this.$http({
          url: this.$http.adornUrl("/mail/mailcontactor/addContactorRole"),
          method: "post",
          data: this.$http.adornData(submitData)
        }).then(({ data }) => {
          console.log(data);
          if (data && data.code === 0) {
            // console.log('切换责任人',data)
            // this.getPeople();
            // 点击确认之后
            this.$message.success("操作成功！");
            setTimeout(() => {
              this.chooseList = [];
              this.personList = [];
              this.nameList = [];
              this.total = 0;
              this.roleId = "";

              this.visible = false;
            }, 1000);
          } else {
            this.$message.error(data.msg);
          }
        });
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
        // 该名字添加到选中项中
        for (let i in this.personList) {
          if (this.personList[i].id == id) {
            let data = JSON.parse(JSON.stringify(this.personList[i])); // 复制姓名列表中的对象保存在选中人对象数组中
            data.verify = this.topTreeName;
            data.verifyDeptId = this.topTreeID;
            this.chooseList.push(data);
            return;
          }
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
      // console.log(data);
      this.topTreeName = data.name;
      let id = data.id;
      this.takethedata = data;
      this.topTreeID = id;
      this.search = "";
      this.handleHTTPNodeData(data);
    },
    // 勾选树节点触发事件
    handleCheckChange() {
      let self = this
      // 当前选中的所有节点
      let allChecked = this.$refs.tree.getCheckedNodes()
      // 获取当前选中的所有节点的最底层子节点部门的id集合
      let requestIds = []
      for(let item of allChecked) {
        /**
         * @author tanjinfeng
         * @date 2020-12-16
         * @description debug: 勾选树形的时候，父节点的id没有加进去
         */
        /*** 原来的代码 ***/
        // item.children === null ? requestIds.push(item.id) : null
        /*** 修改后的代码 ***/
        requestIds.push(item.id)
        /*** 结束 ***/
      }
      // 根据id集合查询这些部门的所有人员信息
      if(requestIds.length > 0) {
        this.$http({
          url: this.$http.adornUrl("/mail/mailcontactor/list"),
          method: "post",
          data: this.$http.adornData({
            limit: 100000,
            page: 1,
            groupId: requestIds
          })
        })
        .then(
          res => {
            console.log('获取到的所有勾选部门的人的数据：【', res.data.data.list, '】')
            let responseData = res.data.data.list
            // 添加选中的人到chooseList
            let addList = []
            for(let man of responseData) {
              addList.push(man.id)
              // 不存在则加入
              let has = false
              for(let exist of self.chooseList) {
                man.id === exist.id ? has = true : null
              }
              has === false ? self.chooseList.push(man): null
              // 不存在则加入
              let nl_has = false
              for(let exist of self.nameList) {
                man.id == exist ? nl_has = true : null
              }
              nl_has === false ? self.nameList.push(man.id) :null
            }
            // 找出取消勾选的人
            let deleteList = []
            if(self.lastCheckedList.length > 0) {
              for(let man of self.lastCheckedList) {
                addList.indexOf(man) < 0 ? deleteList.push(man) : null
              }
              for(let toDelete of deleteList) {
                for(let i in self.chooseList) {
                  if(toDelete == self.chooseList[i].id) {
                    self.chooseList.splice(i, 1)
                    break
                  }
                }
                self.nameList.splice(self.nameList.indexOf(toDelete), 1)
              }
            }
            self.lastCheckedList = addList
          }
        )
      } else {
        if(self.lastCheckedList.length > 0) {
          for(let toDelete of self.lastCheckedList) {
            for(let i in self.chooseList) {
              if(toDelete == self.chooseList[i].id) {
                self.chooseList.splice(i, 1)
                break
              }
            }
            self.nameList.splice(self.nameList.indexOf(toDelete), 1)
          }
        }
        self.lastCheckedList = []
      }
      
    },
    // 点击子节点 获取数据
    handleHTTPNodeData(obj) {
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        // console.log(list);
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item);
            findChilden(item, list);
          });
        }
      }
      let selectedNode = [];
      findChilden(obj, selectedNode);
      // console.log(selectedNode);
      this.selectedNode = selectedNode;
      // 获取联系人请求
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/list"),
        method: "post",
        data: this.$http.adornData({
          limit: this.pageSize,
          page: 1,
          groupId: selectedNode
        })
      }).then(({ data }) => {
        // console.log(data);

        if (data && data.code === 0) {
          // 详细联系人列表
          this.personList = data.data.list;
          this.total = data.data.totalCount;
        } else {
          this.$message.error(data.msg);
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
    }
  }
};
</script>

<style scoped>
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

.batchHandler__roleSelect {
  width: 100%;
  height: 130px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
}
</style>
