<!--
 * @Author: yaoweixin
 * @Date: 2020-08-20 15:44:52
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-09-15 15:45:05
 * @Description: 专题收集
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicCollect\specialTopicCollect.vue
-->
<template>
  <div class="specialTopicCollect">
    <div class="left">
      <div class="listContent">
        <div class="custom-tree-container">
          <div class="block">
            <el-tree
              :data="data"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleClick"
              :props="treeProps"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="el-icon-folder-opened"></i>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="searchArea">搜索区域</div>
      <div class="tableContent">
        <div class="tableHeader">
          <div class="leftContent">
            <div class="selectContainer">
              <select v-model="selectId">
                <option
                  v-for="(item, index) in selectList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="remarkContainer">
              <div class="alreadyData">
                <div class="alreadyDataTitle">已登记数据:</div>
                <div class="number">{{ tableLength }}条</div>
              </div>
              <div class="deadLine">
                <div class="deadLineTitle">截止时间：</div>
                <div class="time">{{ endTime }}</div>
              </div>
              <div class="restTime">
                <div class="timeTitle">剩余时间：</div>
                <div class="day">{{ restTime }}天</div>
              </div>
              <div class="state">
                <div class="stateTitle">状态：</div>
                <div class="going">{{ templateStatus }}</div>
              </div>
            </div>
          </div>
          <div class="rightContent">
            <div class="addButton" @click="openAddRegisterDialog">新增</div>
          </div>
        </div>
        <div class="tableContainer">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              v-for="(value, key) in tableHeaderList[0]"
              :key="key"
              :prop="key"
              :label="key"
              width="120"
            >
            </el-table-column>
            <el-table-column prop="registerTime" label="登记时间" width="120">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template slot-scope="scope">{{
                scope.row.status == "1" ? "已上报" : "被驳回"
              }}</template>
            </el-table-column>
            <el-table-column prop="platform" label="来源" width="120">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handlelook(scope.$index, scope.row)"
                  >查看</el-button
                >
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 新增登记的弹框 -->
    <AddRegisterDialog ref="addRegisterDialog"></AddRegisterDialog>
    <!-- 编辑弹框 -->
    <EditRegisterDialog ref="editRegisterDialog"></EditRegisterDialog>
    <!--  查看弹框 -->
    <LookRegisterMessageDialog
      ref="lookRegisterDialog"
    ></LookRegisterMessageDialog>
  </div>
</template>
<script>
import EditRegisterDialog from "./components/EditRegisterDialog.vue";
import AddRegisterDialog from "./components/addRegisterDialog.vue";
import LookRegisterMessageDialog from "./components/lookRegisterMessageDialog.vue";
export default {
  name: "specialTopicCollect",
  data() {
    const data = [];
    return {
      treeIdArr: [], //节点及其子节点
      selectList: [], //选择列表
      selectId: 0, //被选中的id
      treeProps: {
        label: (data, node) => {
          console.log(data, node);
          return data.name;
        },
      }, //树节点的默认配置
      data: JSON.parse(JSON.stringify(data)),
      tableData: [],
      tableLength: 0, //已登记数据
      endTime: 0, //截止时间
      restTime: 0, //剩余时间
      templateStatus: "进行中", //模板状态
      multipleSelection: [],
      tableHeaderList: [], //表头动态数据
    };
  },
  watch: {
    selectId: {
      handler(newVal, oldVal) {
        var includeArr = ["registerId", "registerTime", "platform", "status"];
        var taskId = parseInt(newVal);
        this.selectList.forEach((item, index) => {
          if (item.id === taskId) {
            this.endTime = item.endTime;
            //计算剩余天数
            var oldDate = new Date(this.endTime);
            var nowDate = new Date();
            var restMSeconds = nowDate.getTime() - oldDate.getTime(); //剩余毫秒数
            var restDay = Math.floor(restMSeconds / (24 * 60 * 60 * 1000)); //剩余天数
            this.restTime = restDay;
            if (item.status == "1") {
              this.templateStatus = "进行中";
            } else if (item.status == "2") {
              this.templateStatus = "已完成";
            } else {
              this.templateStatus = "已过期";
            }
          }
        });
        this.$http({
          url: this.$http.adornUrl("/fk/fkTemplateInstance/list"),
          method: "post",
          data: this.$http.adornData({
            page: "1",
            limit: "10",
            search: "",
            taskId: 16,
          }),
        }).then(({ data }) => {
          console.log("获得的表格数据为", data);
          if (data && data.code === 0) {
            this.tableData = data.page.list;
            this.tableLength = data.page.list.length;
            data.page.list.forEach((item, index) => {
              var obj = {};
              for (let key in item) {
                if (!includeArr.includes(key)) {
                  obj[key] = item[key];
                }
              }
              console.log(obj, "obj");
              this.tableHeaderList.push(obj);
            });
          }
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.$http({
      url: this.$http.adornUrl("/fk/fkTemplateGroup/list"),
      method: "get",
      params: this.$http.adornParams({}),
    }).then(({ data }) => {
      console.log("树形列表为，", data);
      this.data = data.data;
      this.$nextTick(() => {
        var is = document.querySelectorAll(
          ".el-tree-node__children .el-tree-node .el-tree-node__content .is-leaf+.custom-tree-node .el-icon-folder-opened"
        );
        for (var i = 0; i < is.length; i++) {
          is[i].parentNode.removeChild(is[i]);
        }
      });
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * @description: 打开新增专题的弹框
     * @param {type} 无
     * @return {type} 无
     */
    openAddRegisterDialog() {
      this.$refs.addRegisterDialog.init(this.selectId);
      this.$refs.addRegisterDialog.dialogVisible = true;
    },
    /**
     * @description: 点击分组保存该节点的id以及子节点的id
     * @param {object} node:父节点对象
     * @return {type}
     */
    addGroupIds(node) {
      this.treeIdArr.push(node.id);
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.addGroupIds(node.children[i]);
        }
      }
      return;
    },
    /**
     * @description: 点击树节点
     * @param {object} Node:节点对象
     * @return {type}
     */
    handleClick(Node) {
      this.treeIdArr = [];
      console.log("dianji", Node);
      this.addGroupIds(Node);
      console.log("点击获得得节点及子节点为", this.treeIdArr);
      this.$http({
        url: this.$http.adornUrl("/fk/fkTask/receiveTask"),
        method: "post",
        data: this.$http.adornData({
          groupIds: this.treeIdArr,
          page: "1",
          limit: "10",
          search: "",
        }),
      }).then(({ data }) => {
        console.log("下拉框数据为", data);
        if (data && data.code === 0) {
          this.selectList = data.page.list;
        }
      });
    },
    handleEdit(index, row) {
      console.log("row", row);
      this.$refs.editRegisterDialog.init(row.registerId, row.status);
      this.$refs.editRegisterDialog.dialogVisible = true;
    },
    handlelook(index, row) {
      this.$refs.lookRegisterDialog.init(row.registerId, row.status);
      this.$refs.lookRegisterDialog.dialogVisible = true;
    },
  },
  components: {
    AddRegisterDialog,
    EditRegisterDialog,
    LookRegisterMessageDialog,
  },
};
</script>
<style lang="less" scoped>
.specialTopicCollect {
  display: flex;
  .left {
    width: 320px;
    .listContent {
      .custom-tree-container {
        .block {
          .el-tree {
            span.custom-tree-node {
              i.el-icon-folder-opened {
              }

              span {
              }
            }
          }
        }
      }
    }
  }

  .right {
    .searchArea {
      width: 1000px;
      height: 50px;
      text-align: center;
      background-color: #fff;
    }

    .tableContent {
      margin-top: 10px;
      background-color: #fff;
      .tableHeader {
        display: flex;
        .leftContent {
          .selectContainer {
            select {
              option {
              }
            }
          }

          .remarkContainer {
            display: flex;
            .alreadyData {
              display: flex;
              .alreadyDataTitle {
              }

              .number {
              }
            }

            .deadLine {
              display: flex;
              .deadLineTitle {
              }

              .time {
              }
            }

            .restTime {
              display: flex;
              .timeTitle {
              }

              .day {
              }
            }

            .state {
              display: flex;
              .stateTitle {
              }

              .going {
              }
            }
          }
        }

        .rightContent {
          .addButton {
          }
        }
      }

      .tableContainer {
        .el-table {
          .el-table-column {
          }
        }
      }
    }
  }
}
</style>