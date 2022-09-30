<template>
  <!-- 选择人员弹窗 -->
  <el-dialog
    :title="selectTitle"
    width="800px"
    class="popoxwrap"
    :visible.sync="selectData"
    append-to-body
    :close-on-click-modal="false"
    :before-close="closeDialog"
    @open="open"
  >
    <div class="top">
      <el-input
        v-model="searchText"
        type="input"
        placeholder="输入姓名/单位/职位/号码"
        class="selectInput"
      />
      <el-button
        type="primary"
        @click="query(1)"
      >
        查询
      </el-button>
      <el-button
        type="primary"
        @click="addMans"
      >
        确定
      </el-button>
    </div>
    <div class="main">
      <div class="left">
        <el-scrollbar style="height: 100%">
          <el-tree
            ref="tree"
            :data="data2"
            node-key="id"
            highlight-current
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>

      <div class="right">
        <el-scrollbar style="height: 100%">
          <div v-if="mans && mans.length > 0">
            <el-checkbox
              v-model="isAll"
              class="checkbox"
              @change="selectAll"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-if="maxSelect >= 1"
              v-model="checkboxGroup"
              :max="maxSelect"
              @change="checkChange"
            >
              <el-checkbox
                v-for="item in mans"
                :key="item.id"
                :label="item.id"
                class="checkbox"
              >
                <div>{{ item.name }}</div>
                <div>{{ item.position }}</div>
                <div>
                  {{ item.mobile !== "" ? item.mobile : item.otherTel }}
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group
              v-else
              v-model="checkboxGroup"
              @change="checkChange"
            >
              <el-checkbox
                v-for="item in mans"
                :key="item.id"
                :label="item.id"
                class="checkbox"
              >
                <div>{{ item.name }}</div>
                <div>{{ item.position }}</div>
                <div>
                  {{ item.mobile !== "" ? item.mobile : item.otherTel }}
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div
            v-else
            class="p_"
          >
            <span>暂无数据</span>
          </div>
        </el-scrollbar>
      </div>
      <div class="page">
        <el-pagination
          :small="pagingSize1"
          :page-size="pageSize1"
          :total="total1"
          :current-page.sync="currentPage1"
          layout="total, prev, pager, next, jumper"
          @current-change="pageChange"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "selectMansDialog",
  props: ["selectTitle", "selectData", "maxSelect"], //maxSelect 可限制选中联系人的个数，无限制可不传这个参数
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      searchText: "",
      data2: [],
      treeId: "",
      checkboxGroup: [],
      mans: [],
      total1: 0, //数据总数
      pageSize1: 10, //每页条数
      currentPage1: 1, //当前页数
      pagingSize1: true, //分页大小
      first: true, //判断弹框是否是第一次进来
      mansList: [], // 选中的人员
      checkboxData: [],
      judgingConditions: "", // 勾选人时判断条件 1.ptt:一键通用户
      isAll: false,
    };
  },
  watch: {
    // 全选
    isAll: {
      handler(newVal) {
        this.selectAll(newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getPhoneTree();
  },
  methods: {
    /**
     * @description 全选
     */
    selectAll(val) {
      this.checkboxGroup = val ? this.mans.map((el) => el.id) : [];
      this.mansList = val ? [...this.mans] : [];
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    getPhoneTree() {
      // 渲染弹窗左侧列表
      let data = { data: {} };
      // this.$api.telephoneGroupingTree(data).then((res) => {
      //   console.log(res);
      //   if (res.errorcode != 0) {
      //     this.$message({
      //       message: res.msg,
      //       type: "error",
      //     });
      //     return;
      //   }
      //   this.data2 = res.data;
      //   if (this.data2.length > 0) {
      //     this.handleNodeClick(this.data2[0]);
      //     if (this.$refs.tree) {
      //       this.$refs.tree.setCurrentKey(this.data2[0].id); //调用setCurrentKey方法设置当前节点高亮
      //     }
      //   }
      // });
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: 'mail/mailgroup/list',
      };
      this.$http(request)
        .then((response) => {
          console.log('搜索结果：', response);
          if (response.data.code === 0) {
            this.data2 = response.data.data || [];
            if (this.data2.length) {
              this.handleNodeClick(this.data2[0]);
              this.$refs.tree.setCurrentKey(this.data2[0].id);
            }
          } else {
            this.$message.error(response.data.msg);
          }
        });
    },
    //换页
    pageChange() {
      if (!this.treeId) {
        this.query(this.currentPage1);
      } else {
        // let data = {
        //   groupId: this.treeId.id,
        //   serchText: "",
        //   page: this.currentPage1,
        //   size: 10,
        // };

        // this.$api.contactorList(data).then((res) => {
        //   this.total1 = res.data.totalCount;
        //   this.mans = res.data.list;
        // });
        const groupId = new Set();
        const findAllChildren = (node) => {
          groupId.add(node.id);
          if (node.children && node.children.length) {
            node.children.forEach((child) => {
              findAllChildren(child);
            });
          }
        };
        findAllChildren(this.treeId);
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: 'mail/mailcontactor/list',
          data: {
            groupId: this.searchText ? null : Array.from(groupId), // 搜索时不根据组id查找
            limit: 10,
            page: this.currentPage1,
            search: this.searchText,
          },
        };
        groupId.clear();
        this.$http(request)
          .then((response) => {
            if (response.data.code === 0) {
              this.mans = response.data.data.list;
              this.total1 = response.data.data.totalCount;
            }
          });
      }
    },
    // 点击tree节点
    handleNodeClick(num) {
      this.treeId = num;
      this.currentPage1 = 1;
      this.searchText = '';
      // let data = {
      //   groupId: num.id,
      //   serchText: "",
      //   page: 1,
      //   size: 10,
      // };

      // this.$api.contactorList(data).then((res) => {
      //   console.log(res.data.data);
      //   this.total1 = res.data.totalCount;
      //   console.log("res.data: ", res.data);
      //   this.mans = res.data.list;
      // });
      const groupId = new Set();
      const findAllChildren = (node) => {
        groupId.add(node.id);
        if (node.children && node.children.length) {
          node.children.forEach((child) => {
            findAllChildren(child);
          });
        }
      };
      findAllChildren(this.treeId);
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: 'mail/mailcontactor/list',
        data: {
          groupId: Array.from(groupId),
          limit: 10,
          page: this.currentPage1,
          search: '',
        },
      };
      groupId.clear();
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.mans = response.data.data.list;
            this.total1 = response.data.data.totalCount;
            this.isInclude();
          }
        });
    },
    //input框查找
    query(page) {
      //  if(page === 0){
      //    this.currentPage1 = 1;
      //  }
      // this.treeId = "";
      // let data = {
      //   searchText: this.searchText,
      //   page: page,
      //   size: this.pageSize1,
      // };
      // console.log(data);
      // this.$api.contactorList(data).then((res) => {
      //   console.log(res);
      //   if (res.errorcode != 0) {
      //     this.$message({
      //       message: res.msg,
      //       type: "error",
      //     });
      //   }
      //   this.mans = res.data.list;
      //   this.total1 = res.data.totalCount;
      // });
      const groupId = new Set();
      this.currentPage1 = page;
      const findAllChildren = (node) => {
        groupId.add(node.id);
        if (node.children && node.children.length) {
          node.children.forEach((child) => {
            findAllChildren(child);
          });
        }
      };
      findAllChildren(this.treeId);
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: 'mail/mailcontactor/list',
        data: {
          groupId: this.searchText ? null : Array.from(groupId), // 搜索时不根据组id查找
          limit: 10,
          page: this.currentPage1,
          search: this.searchText,
        },
      };
      groupId.clear();
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.mans = response.data.data.list;
            this.total1 = response.data.data.totalCount;
            this.isInclude();
          }
        });
    },
    //点击确定添加联系人
    addMans() {
      if (this.checkboxGroup.length == 0) {
        this.$message({
          message: "您还未选择联系人",
          type: "warning",
        });
      } else {
        console.log(this.checkboxGroup, this.mansList)
        this.$emit("addMans", this.checkboxGroup, this.mansList);
      }
    },
    //父组件调用该方法初始this.checkboxGroup的选中状态
    defaultSelection(checkboxGroup, type) {
      if (type === "onduty") {
        // 值班人员处调用
        this.mansList = [];
        setTimeout(() => {
          this.checkChange(checkboxGroup);
        }, 100);
      }
      this.checkboxGroup = checkboxGroup;
    },
    open() {
      //初始点开弹框，默认选中第一条tree
      if (this.first) {
        this.first = false;
        this.$nextTick(() => {
          this.handleNodeClick(this.data2[0]);
          this.$refs.tree.setCurrentKey(this.data2[0].id); //调用setCurrentKey方法设置当前节点高亮
        });
      }
    },
    empty() {
      this.checkboxGroup = [];
      this.searchText = "";
      this.$nextTick(() => {
        this.handleNodeClick(this.data2[0]);
        this.$refs.tree.setCurrentKey(this.data2[0].id); //调用setCurrentKey方法设置当前节点高亮
      });
    },
    /**
     * @desciption 判断并集，全选或取消全选
     */
    isInclude() {
      const mansId = this.mans.map((el) => el.id);
      // 数组交集，或得两个数组重复的元素
      const samePart = this.checkboxGroup.filter((item) => mansId.includes(item));
      this.isAll = samePart.length === mansId.length ? true : false;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-02-07
     * @description 勾选联系人
     */
    checkChange(val) {
      this.isAll = !!this.checkboxGroup.length === this.mans.length;
      this.isInclude();
      // 符合判断条件  开启一键通校验 // author:xuchuangxing lastUpdateTime:2021/1/22 通知公共需求判断一键通用户才可下发
      if (this.judgingConditions == "ptt") {
        // 判断每次最后一次勾选的数据是一键通用户
        if (val.length > 0) {
          let checkPeople = this.mans.find((v) => v.id == val[val.length - 1]);
          if (!checkPeople.isYiJianTongUser) {
            this.checkboxGroup.pop(); // 删除最后勾选的数据-去除勾选
            this.$message.warning("该成员不是一键通用户，请重新选择");
            return;
          }
        }
      }
      if (val.length > 0 && val.length > this.mansList.length) {
        // let checkPeople = this.mans.find((v) => v.id == val[val.length - 1]);
        // 注释原因：这里不需要判断 author:hexinting date 2021-02-07
        // if (!checkPeople.isYiJianTongUser) {
        //   this.checkboxGroup.pop(); // 删除最后勾选的数据-去除勾选
        //   this.$message.warning("该成员不是一键通用户，请重新选择");
        //   return;
        // }
        const addData = [...this.mans].find((x) => x.id == val[val.length - 1]);
        if (addData) {
          this.mansList.push(addData);
        }
      } else {
        let delIndex = [...this.mansList].findIndex((x) =>
          [...val].every((y) => (x.contactorId || x.id) != y)
        );
        this.mansList.splice(delIndex, 1);
      }
      this.checkboxData = val;
    },
    // 默认选中值
    checkData(arr, name) {
      if (arr.length > 0) {
        setTimeout(() => {
          this.treeId = "";
          let data = {
            searchText: name,
            page: 1,
            size: this.pageSize1,
          };
          this.$api
            .contactorList(data)
            .then((res) => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              this.mans = res.data.data;
              this.total1 = res.data.totalElements;
              this.isInclude();
            })
            .then(() => {
              if (this.mans.find((v) => v.id == arr[0])) {
                this.checkboxGroup = arr;
              } else {
                this.checkboxGroup = [];
                this.$emit("contactorIds");
                this.$message({
                  message: "联系人已不存在通讯录中",
                  type: "error",
                });
              }
            });
        }, 600);
      } else {
        this.checkboxGroup = [];
      }
    },
  },
  watch: {
    // checkboxData(newV, oldV) {
    //   if (newV.length > oldV.length) {
    //     let addData = [...newV].filter((x) => [...oldV].every((y) => y !== x));
    //     if (
    //       this.mans.filter((el) => el.id === addData[addData.length - 1])
    //         .length > 0
    //     ) {
    //       this.mansList.push(
    //         ...this.mans.filter((el) => [...addData].some((y) => el.id == y))
    //       );
    //     }
    //   } else {
    //     let delData = [...oldV].filter((x) => [...newV].every((y) => y !== x));
    //     this.mansList.splice(
    //       this.mans.filter((el, index) => {
    //         el.id === delData[0];
    //         return index;
    //       }),
    //       1
    //     );
    //   }
    //   console.log("this.mansList: ", this.mansList);
    // },
  },
};
</script>

<style scoped>
.tree {
  height: 676px;
  background-color: white;
  border: 1px solid rgba(211, 215, 219, 1);
}

>>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

>>> .el-tree-node__content {
  margin-top: 14px;
}

>>> .treeDiv {
  width: 100%;
}

>>> .leftTree {
  display: inline-block;
  width: 70%;
  text-align: left;
}

>>> .rightTree {
  display: inline-block;
  width: 30%;
}
.selectInput {
  width: 77%;
  margin-right: 15px;
}
.main {
  width: 100%;
  height: 570px;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.left {
  width: 33%;
  height: 540px;
  border: 1px solid rgba(211, 215, 219, 1);
}
.right {
  width: 65%;
  height: 540px;
  border: 1px solid rgba(211, 215, 219, 1);
}
.page {
  position: absolute;
  right: 15px;
  bottom: 20px;
}
.el-checkbox {
  width: 80%;
  margin: 15px;
}
.el-checkbox div {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
}
.el-checkbox div:first-child,
.el-checkbox div:nth-child(2) {
  width: 150px;
}
.p_ {
  padding: 10px 30px 10px 30px;
  text-align: left;
}
</style>
