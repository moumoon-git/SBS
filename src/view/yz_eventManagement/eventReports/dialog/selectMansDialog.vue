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
        type="input"
        placeholder="输入姓名/单位/职位/号码"
        v-model="searchText"
        class="selectInput"
      ></el-input>
      <el-button type="primary" @click="query(1)">查询</el-button>
      <el-button type="primary" @click="addMans">确定</el-button>
    </div>
    <div class="main">
      <div class="left">
        <el-scrollbar style="height: 100%">
          <el-tree
            :data="data2"
            ref="tree"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"
            :props="defaultProps"
          ></el-tree>
        </el-scrollbar>
      </div>

      <div class="right">
        <el-scrollbar style="height: 100%">
          <div v-if="mans && mans.length > 0">
            <el-checkbox v-model="checkedAll" @change="checkAll">全选</el-checkbox>
            <el-checkbox-group
              v-model="checkboxGroup"
              v-if="maxSelect >= 1"
              :max="maxSelect"
              @change="checkChange"
            >
              <el-checkbox
                class="checkbox"
                v-for="item in mans"
                :label="item.id"
                :key="item.id"
              >
                <div>{{ item.name }}</div>
                <div>{{ item.position }}</div>
                <div>{{ item.mobile !== '' ? item.mobile : item.otherTel }}</div>
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group
              v-model="checkboxGroup"
              v-else
              @change="checkChange"
            >
              <el-checkbox
                class="checkbox"
                v-for="item in mans"
                :label="item.id"
                :key="item.id"
              >
                <div>{{ item.name }}</div>
                <div>{{ item.position }}</div>
                <div>{{ item.mobile !== '' ? item.mobile : item.otherTel }}</div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="p_" v-else>
            <span>暂无数据</span>
          </div>
        </el-scrollbar>
      </div>
      <div class="page">
        <el-pagination
          :small="pagingSize1"
          :page-size="pageSize1"
          :total="total1"
          @current-change="pageChange"
          :current-page.sync="currentPage1"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
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
      checkedAll: false,//全选状态为false
    };
  },
  mounted() {
    this.getPhoneTree();
  },
  methods: {
    // 获取所有的checkbox
    getChechbox() {
      let allEle = document.querySelectorAll(".right .is-checked");
      console.log(allEle);
      if (Array.from(allEle).length != 0) {
        allEle.forEach((ele) => {
          ele.classList.remove("is-checked");
          if (ele.localName == "label") {
            ele.removeAttribute("aria-checked");
          }
        });
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    getPhoneTree() {
      // 渲染弹窗左侧列表
      let data = { data: {} };
      this.$api.telephoneGroupingTree(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.data2 = res.data;
        if (this.data2.length > 0) {
          this.handleNodeClick(this.data2[0]);
          if (this.$refs.tree) {
            this.$refs.tree.setCurrentKey(this.data2[0].id); //调用setCurrentKey方法设置当前节点高亮
          }
        }
      });
    },
    //换页
    pageChange() {
      if (!this.treeId) {
        this.query(this.currentPage1);
      } else {
        let data = {
          groupId: this.treeId.id,
          serchText: "",
          page: this.currentPage1,
          size: 10,
        };

        this.$api.contactorList(data).then((res) => {
          this.total1 = res.data.totalCount;
          this.mans = res.data.list;
         
         //翻页时.前一页勾选的数据也不会被清除
          for(let i = 0;i < this.mans.length;i++){
          if(this.checkboxGroup.indexOf(this.mans[i].id) === -1){
            this.checkedAll = false;
            return;
          }
        }
        this.checkedAll = true;

        });
      }
    },
    // 点击tree节点
    handleNodeClick(num) {
      console.log(this.$refs.tree);
      this.treeId = num;
      this.currentPage1 = 1;
      let data = {
        groupId: num.id,
        serchText: "",
        page: 1,
        size: 10,
      };

      this.$api.contactorList(data).then((res) => {
        console.log(res.data.list);
        this.total1 = res.data.totalCount;
        console.log("res.data: ", res.data,4545);
        this.mans = res.data.list;
        for(let i = 0;i < this.mans.length;i++){
        if(this.checkboxGroup.indexOf(this.mans[i].id) === -1){
          this.checkedAll = false;
          return;
        }
      }
      this.checkedAll = true;

      });
    },
    //input框查找
    query(page) {
      //  if(page === 0){
      //    this.currentPage1 = 1;
      //  }
      this.treeId = "";
      let data = {
        dictType: "governmentAffairs",
        searchText: this.searchText,
        page: page,
        size: this.pageSize1,
      };
      console.log(data);
      this.$api.contactorList(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
        this.mans = res.data.list;
        this.total1 = res.data.totalCount;
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
      console.log("调用：", checkboxGroup, this.mansList);
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
    // 通讯调度-短信调度-短信名片清空方式
    cardEmpty() {
      this.checkboxGroup = [];
      this.mansList = [];
      this.checkboxData = [];
      this.searchText = "";
      this.$nextTick(() => {
        this.handleNodeClick(this.data2[0]);
        this.$refs.tree.setCurrentKey(this.data2[0].id); //调用setCurrentKey方法设置当前节点高亮
      });
    },
    checkChange(val) {
      this.checkboxData = val;
      console.log("--我是分界线--------------", val, this.mans);
      // this.checkboxData.length===this.checkVal.length;
      
      //this.isIndeterminate =  this.checkboxData > 0 &&  this.checkboxData < this.checkVal.length;
      // val.forEach(item => {
      //   if (this.mans.filter(el => el.id === item).length > 0 && this.mansList.filter(el => el.id === item).length === 0) {
      //     this.mansList.push(this.mans.filter(el => el.id === item)[0])
      //     // console.log('天选之人：', this.mans.filter(el => el.id === item)[0])
      //   }
      // })
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
          console.log(data,999);
          this.$api
            .contactorList(data)
            .then((res) => {
              console.log(res);
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              this.mans = res.data.data;
              this.total1 = res.data.totalElements;
            })
            .then(() => {
              console.log("this.mans: ", this.mans);
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

   /*
  * @lastEditor QCX
  * @lastDate 2020-11-6
  * @description 新增全选
  */
    checkAll(val){
    if(val){
      this.checkboxGroup = Array.from(new Set([...this.mans.map(item => {return item.id}), ...this.checkboxGroup]))
    }else{
      let idsTmp = new Set(this.mans.map(item => {return item.id}))
      this.checkboxGroup = this.checkboxGroup.filter(item => !idsTmp.has(item))
    }
  }
  },
  watch: {
    checkboxData(newV, oldV) {
      let flag = true;
      for(let i = 0;i < this.mans.length;i++){
        if(this.checkboxGroup.indexOf(this.mans[i].id) === -1){
          flag = false;
          break;
        }
      }
      this.checkedAll = flag;
      
      console.log("oldV: ", oldV);
      console.log("newV: ", newV);
      if (newV.length > oldV.length) {
        let addData = [...newV].filter((x) => [...oldV].every((y) => y !== x));
        if (
          this.mans.filter((el) => el.id === addData[addData.length - 1])
            .length > 0
        ) {
          this.mansList.push(
            ...this.mans.filter((el) => [...addData].some((y) => el.id == y))
          );
        }
      } else {
        let delData = [...oldV].filter((x) => [...newV].every((y) => y !== x));
        this.mansList.splice(
          this.mans.filter((el, index) => {
            el.id === delData[0];
            return index;
          }),
          1
        );
      }
      console.log("this.mansList: ", this.mansList);
    },
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
.el-checkbox__inner {
  width: 18px;
  height: 18px;
}
.p_ {
  padding: 10px 30px 10px 30px;
  text-align: left;
}
</style>
