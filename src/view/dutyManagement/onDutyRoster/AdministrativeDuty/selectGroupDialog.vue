<template>
  <!-- 选择人员弹窗 -->
  <el-dialog
    :title="selectTitle"
    width="800px"
    class="popoxwrap"
    :visible.sync="selectData"
    append-to-body
    center
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-tabs v-model="activeName" @tab-click="displayCheck">
      <el-tab-pane
        :label="item.name"
        :name="String(item.classesId)"
        v-for="item in setShiftData"
        :key="item.classesId"
      ></el-tab-pane>
    </el-tabs>
    <!-- <div class="top">
         <el-input type="input"  placeholder="输入部门名称" v-model="searchText" class='selectInput'></el-input>
    <el-button type="primary" @click="query()">查询</el-button>-->
    <!-- <el-button type="primary" @click="addMans">确定</el-button> -->
    <!-- </div> -->
    <div v-for="(oneDuty, dutyIdx) in dutyData" :key="dutyIdx">
      <div class="main" v-if="activeName == oneDuty.classesId">
        <div class="left">
          <el-scrollbar style="height: 100%">
            <el-tree
              :data="data2"
              ref="tree"
              node-key="id"
              highlight-current
              @node-click="handleNodeClick"
              :props="defaultProps"
              :filter-node-method="filterNode"
            ></el-tree>
          </el-scrollbar>
          <div class="submit">
            <el-button type="primary" @click="addMans">确定</el-button>
          </div>
        </div>

        <div class="right">
          <div class="groupHistory">
            <div class="checkHistory">已采集单位：</div>
            <div class="allGroup">
              <template v-if="groupData.length > 0">
                <div
                  v-for="item in groupData"
                  :key="item.id"
                  class="oneGroup"
                  @click="handleNodeClick(item)"
                >
                  {{ item.name }}
                </div>
              </template>
              <div class="p_" v-else>
                <span>暂无数据</span>
              </div>
            </div>
          </div>
          <div class="dateDetail">
            <div class="checkTitle">
              当前选中：{{ oneDuty.contactorGroupName }}
              <i
                class="el-icon-close closeDepart"
                v-if="oneDuty.contactorGroupName"
                @click="dutytDelete(dutyIdx)"
              ></i>
            </div>
            <div class="allDate">
              <div class="dateTitle">已排班日期（仅显示未执行日期）：</div>
              <template v-if="dateData.length > 0">
                <div v-for="item in dateData" :key="item.id" class="oneDate">
                  {{ item.date }}
                </div>
              </template>
              <div class="p_" v-else>
                <span>暂无数据</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "selectGroupDialog",
  props: ["selectTitle", "selectData", "maxSelect", "currentDate"], //maxSelect 可限制选中联系人的个数，无限制可不传这个参数
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "platformName",
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
      groupData: [], // 已采集单位数据
      dateData: [], // 已排班日期数据
      submitData: {
        date: this.currentDate,
        contactorGroupId: "",
        contactorGroupName: "",
      }, // 保存分组数据
      activeName: "",
      dutyData: [],
      delete: [], //删除的已经排过的单位
      setShiftData: [], // 班次列表
    };
  },
  mounted() {
    this.getPhoneTree();
    this.getDeduplicationPage();

    // if (this.formData.length > 0) {
    //   this.formData.map((v) => {
    //     this.dutyData.push({
    //       date: this.currentDate,
    //       classesId: v.id,
    //       contactorGroupId: "",
    //       contactorGroupName: "",
    //     });
    //   });
    //   console.log("this.formData: ", this.formData);
    // }
  },
  methods: {
    /**
     * @description: 初始化数据
     * @author: xuchuangxing
     * @lastUpdateTime :2021/1/21
     * @param {*} setShiftData // 所有班次信息
     * @return {*}
     */
    initData(setShiftData) {
      this.setShiftData = JSON.parse(JSON.stringify(setShiftData)); // 转化格式再赋值 所有班次选项 避免修改影响父组件数据
      console.log("this.setShiftData: ", this.setShiftData);
      this.dutyData = JSON.parse(JSON.stringify(setShiftData));
      console.log("this.dutyData: ", this.dutyData);
      this.activeName = String(this.setShiftData[0].classesId); // 默认
    },
    query() {
      this.$refs.tree.filter(this.searchText);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    getPhoneTree() {
      // 渲染弹窗左侧列表
      let data = { data: {} };
      this.$api.deptTree(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg || res.message,
            type: "error",
          });
          return;
        }
        this.data2 = res.data;
      });
    },
    getDeduplicationPage() {
      // 渲染弹窗右侧分组列表
      let data = {
        date: new Date().formatDate("yyyy-MM"),
        page: 1,
        size: 8,
      };
      this.$api.collectionUnitList(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg || res.message,
            type: "error",
          });
          return;
        }
        if (res.data) {
          this.groupData = res.data;
        }
      });
    },
    /**
     * @description: 点击tree节点
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201018 11:07
     * @param {}
     * @return {}
     */
    handleNodeClick(num) {
      // console.log('num: ',  num.contactorGroupId || num.id);
      let dutyIdx = this.dutyData.findIndex(
        (v) => v.classesId == this.activeName
      );
      this.dutyData[dutyIdx].contactorGroupName =
        num.platformName || '';
      this.dutyData[dutyIdx].contactorGroupId =
        num.id;
      // console.log(this.$refs.tree)
      this.groupHandle(num.id);
    },
    /**
     * @description: 点击确定添加部门
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201018 11:07
     * @param {}
     * @return {}
     */
    addMans() {
      console.log("this.dutyData: ", this.dutyData);
      // if (this.dutyData.filter((v) => !!v.contactorGroupId).length == 0) {
      //   this.$message({
      //     message: "您还未选择部门",
      //     type: "warning",
      //   });
      // } else {
      // console.log('this.dutyData.filter((v) => !!v.contactorGroupId): ', this.dutyData.filter((v) => !!v.contactorGroupId));
      let dutyData = {
        data: this.dutyData.filter((v) => !!v.contactorGroupId),
        delete: this.delete,
      };

      this.$emit("addMans", dutyData);
    },
    checkChange(val) {
      this.checkboxData = val;
      console.log("--我是分界线--------------", val, this.mans);
      // val.forEach(item => {
      //   if (this.mans.filter(el => el.id === item).length > 0 && this.mansList.filter(el => el.id === item).length === 0) {
      //     this.mansList.push(this.mans.filter(el => el.id === item)[0])
      //     // console.log('天选之人：', this.mans.filter(el => el.id === item)[0])
      //   }
      // })
    },
    // 查询已排班日期
    groupHandle(groupId) {
      let params = {
        groupId,
      };
      this.$api.getListByGroup(params).then((res) => {
        console.log('getListByGroup', res);
        if (res.errorcode === 0 && res.data) {
          this.dateData = res.data;
        }
      });
    },
    dutytDelete(idx) {
      this.dutyData[idx].contactorGroupName = "";
      this.dutyData[idx].contactorGroupId = "";
      if (this.dutyData[idx].id) {
        this.delete.push(this.dutyData[idx].id);
      }
    },
    displayCheck(value) {
      console.log("value: ", value);
    },
  },
  watch: {
    checkboxData(newV, oldV) {
      if (newV.length > oldV.length) {
        let addData = [...newV].filter((x) => [...oldV].every((y) => y !== x));
        if (this.mans.filter((el) => el.id === addData[0]).length > 0) {
          this.mansList.push(this.mans.filter((el) => el.id === addData[0])[0]);
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

/* >>> .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
  } */
.selectInput {
  width: 57%;
  margin-right: 15px;
}
.top {
  width: 54%;
}
.main {
  width: 100%;
  height: 480px;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  font-size: 14px;
  color: #333;
}
.left {
  width: 54%;
  height: 440px;
  border: 1px solid rgba(211, 215, 219, 1);
  /* box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.1); */
}
.right {
  width: 45%;
}

.groupHistory {
  width: 100%;
  border: 1px solid rgba(211, 215, 219, 1);
}
.groupHistory .checkHistory {
  font-size: 15px;
  padding: 10px;
}
.groupHistory .allGroup {
  height: 150px;
  overflow: scroll;
  padding: 0 10px 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.groupHistory .allGroup .oneGroup {
  border: 1px dashed #0091ff;
  padding: 3px 5px;
  margin: 0 10px 10px 0;
  color: #0091ff;
}

.dateDetail {
  width: 100%;
  border: 1px solid rgba(211, 215, 219, 1);
  margin-top: 20px;
}
.dateDetail .checkTitle {
  padding: 10px;
  border-bottom: 1px solid rgba(211, 215, 219, 1);
}
.dateDetail .allDate .dateTitle {
}
.dateDetail .allDate {
  line-height: 30px;
  padding: 10px;
  height: 150px;
  overflow: scroll;
}
.dateDetail .allDate .oneDate {
}
.submit {
  text-align: center;
  margin-top: 20px;
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
