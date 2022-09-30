<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="1100px"
    center
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="custom-tree-node" />
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tabs
          v-model="activePart"
          type="card"
          style="width: 100%;min-width: 100%;"
        >
          <el-tab-pane
            label="通讯联络网"
            name="first"
            style
          >
            <div style=" height:485px;border:1px solid rgba(229,229,229,1);background-color:#fff;">
              <el-scrollbar
                wrap-class="list"
                wrap-style="max-height:485px;overflow: none;"
                view-class="view-box"
                :native="false"
              >
                <el-tree
                  v-if="visible"
                  ref="tree"
                  :data="treeData"
                  :props="treeProps"
                  node-key="id"
                  style="padding-top: 10px;"
                  highlight-current
                  accordion
                  :default-expanded-keys="[indexKey]"
                  :filter-node-method="filterNode"
                  @node-click="handelNodeClick"
                />
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
            style="padding: 12px 12px;"
            @click="onSearch"
          />
        </el-input>
        <div class="candidate">
          <el-radio-group v-model="nameList">
            <el-radio
              v-for="person in personList"
              ref="personList"
              :key="person.id"
              :disabled="person.disabled"
              :label="person.id"
              style="text-align: left;"
              @change="nameChanged(person.id)"
            >
              {{ person.name }}
            </el-radio>
          </el-radio-group>
          <el-pagination
            small
            :page-size="pageSize"
            :current-page="currentPage"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
      <el-col :span="7">
        <div
          class="candidate"
          style="height: 540px;"
        >
          <div class="header">
            <span>选择结果</span>
          </div>
          <div style="padding-left: 10px;margin-top: 10px;text-align: left;">
            <el-tag
              v-for="choose in chooseList"
              :key="choose.id"
              closable
              style="text-align: left;"
              @close="chooseChanged(choose)"
            >
              {{ choose.name }}
            </el-tag>
          </div>
        </div>
        <div class="submit-btn">
          <el-button
            size="small"
            type="primary"
            @click="handleCommit"
          >
            确定
          </el-button>
        </div>
        <!--<el-button size="small" type="text" class="create-btn">新增联系人</el-button>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { log } from 'util';

export default {
  props: ['dynamicTag'],
  data() {
    const data = [
      {
        id: 0,
        name: '联系人分组',
        children: null,
      },
    ];
    return {
      title: '',
      visible: false, // 窗口是否可视
      activePart: 'first',
      search: '', // 搜索
      takethedata: '', // 部门所有信息
      topTreeID: '', // 部门ID
      topTreeName: '', // 当前选中的部门
      // 联系人分组树 数据
      treeData: JSON.parse(JSON.stringify(data)),
      // 子级显示的数据
      treeProps: {
        children: 'children', // 子树的名字
        label: 'name', // 树的名字
      },
      chooseList: '',
      personList: [], // 所有联系人对象数组
      nameList: [], // 选中联系人id数组
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      indexKey: 0,
      name: '', // 当前触发该组件的事件
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getList() {
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'post',
        data: this.$http.adornData({
          limit: this.pageSize,
          page: this.currentPage,
          search: this.search,
          groupId: this.selectedNode,
        }),
      }).then(({ data }) => {
        // console.log(data)

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
      this.currentPage = val;
      this.getList();
    },
    onSearch() {
      this.currentPage = 1;
      this.getList();
      this.$refs.personList.filter(this.search);
    },
    // 点击确认触发的事件
    handleCommit() {
      if (this.chooseList === '' || this.chooseList === null) {
        this.$message({
          message: '请选择',
          type: 'warning',
        });
      } else {
        const data = {
          linkman: this.chooseList,
          name: this.name,
        };
        // 返回部门数据
        this.$emit('OnchildByValue', data);
        this.visible = false;
        // 点击确认之后
        this.chooseList = [];
        this.personList = [];
        this.nameList = [];
        this.total = 0;
      }
    },

    nameChanged(id) {
      // 单选 只需要一个 选择其他直接替换
      this.chooseList = [this.personList.find((item) => item.id === id)];
    },
    // 点击标签删除按钮时删除标签
    chooseChanged(tag) {
      // console.log('删除标签')

      this.chooseList.splice(this.chooseList.indexOf(tag), 1);
      // console.log(this.nameList.indexOf(tag.id))
      const index = this.nameList.indexOf(tag.id);
      if (index !== -1) {
        this.nameList.splice(index, 1);
      }
    },
    // 点击树节点触发事件
    handelNodeClick(data) {
      // console.log(data)
      this.topTreeName = data.name;
      const { id } = data;
      this.takethedata = data;
      this.topTreeID = id;
      this.search = '';
      this.handleHTTPNodeData(data);
    },
    // 点击子节点 获取数据
    handleHTTPNodeData(obj) {
      function findChilden(obj, list) {
        list.push(obj.id);
        const { children } = obj;
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }
      // 每次点击节点时将页码设置为1
      this.currentPage = 1;
      const selectedNode = [];
      findChilden(obj, selectedNode);
      // 接收被点击节点的id
      this.selectedNode = selectedNode;
      // 获取联系人请求
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'post',
        data: this.$http.adornData({
          limit: this.pageSize,
          page: 1,
          groupId: selectedNode,
        }),
      }).then(({ data }) => {
        // console.log(data)
        if (this.id === 1) {
          data.data.list.forEach((item, index, arr) => {
            item.disabled = item.openId === null;
          });
        }
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
    handleAddContacts(url, title, id) {
      this.title = title || '请选择';
      this.id = id;
      // 获取联系人部门请求
      this.visible = true;
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.treeData[0].children = data.data;
          // this.handleHTTPNodeData();
          if (this.dynamicTag) {
            this.chooseList = JSON.parse(JSON.stringify(this.dynamicTag));
            const arrays = [];
            this.dynamicTag.forEach((data) => {
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
  },
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

.el-radio-group >>> .el-radio {
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
