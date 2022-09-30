<!--
    * @description
    * @author yangqingdong
    * @lastEditors yangqingdong
    * @lastEditTime 2020/9/7 16:11
    -->
<template>
  <el-dialog id="patternDefinition" title="模式定义" :visible.sync="dialogVisible" width="1147px" :close-on-click-modal="false">
    <el-container style="height: 460px">
      <el-aside>
        <el-table
          :data="patternList"
          :show-header="false"
          :row-class-name="rowClassName"
          @row-click="handleRowClick"
          :row-style="handleStyle"
          style="width: 100%"
          height="410px"
        >
          <el-table-column prop="name">
            <template slot-scope="scope">
              <p v-if="!scope.row.editable">{{scope.row.name}}</p>
              <el-input
                v-if="scope.row.editable"
                v-model="patternList[scope.row.index].name"
                :placeholder="scope.row.name?scope.row.name:'请输入模式名称'"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="buttonGroup">
          <el-button class="patternDefinitionButton" type="primary" @click="addPattern">新增模式</el-button>
          <el-button class="patternDefinitionButton" type="primary" @click="editPattern">修改模式</el-button>
          <el-button class="patternDefinitionButton" type="primary" @click="deletePattern">删除模式</el-button>
        </div>
      </el-aside>
      <el-main style="padding-top: 0">
        <div class="dutyRoleBlock" v-if="patternList.length">
          <p class="title">
            <el-button
              icon="el-icon-circle-plus"
              circle
              @click="addDutyRole"
              :disabled="!patternList[currentRowIndex].editable"
            ></el-button>值班角色
          </p>
          <el-form :model="patternList[currentRowIndex].dutyRoleData">
            <el-form-item
              v-for="(item, index) in patternList[currentRowIndex].dutyRoleData.dutyRoles"
              :key="index"
            >
              <el-row>
                <el-col :span="10">
                  角色名称：
                  <el-input
                    style="width: 70%"
                    v-model="item.name"
                    :disabled="!patternList[currentRowIndex].editable"
                  ></el-input>
                </el-col>
                <el-col :span="10">
                  值班人数：
                  <el-input
                    style="width: 70%"
                    v-model="item.numble"
                    :disabled="!patternList[currentRowIndex].editable"
                  ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                    @click="deleteDutyRole(index)"
                    :disabled="!patternList[currentRowIndex].editable"
                  >删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <div class="dutyOrderBlock" v-if="patternList.length">
          <p class="title">
            <el-button
              icon="el-icon-circle-plus"
              circle
              @click="addDutyOrder"
              :disabled="!patternList[currentRowIndex].editable"
            ></el-button>班次
          </p>
          <el-form :model="patternList[currentRowIndex].dutyOrderData">
            <el-form-item
              v-for="(item, index) in patternList[currentRowIndex].dutyOrderData.dutyOrders"
              :key="index"
            >
              <el-row>
                <el-col :span="12">
                  班次名称：
                  <el-input
                    style="width: 70%"
                    v-model="item.name"
                    :disabled="!patternList[currentRowIndex].editable"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <div class="typeBlock">
                    班次类型：
                    <el-radio-group
                      v-model="item.type"
                      :disabled="!patternList[currentRowIndex].editable"
                    >
                      <el-radio :label="0">节假日</el-radio>
                      <el-radio :label="1">工作日</el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button
                    @click="deleteDutyOrder(index)"
                    style="float: left"
                    :disabled="!patternList[currentRowIndex].editable"
                  >删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>

        <el-button
          class="savePatternButton"
          type="primary"
          @click="savePattern"
          v-if="patternList[currentRowIndex] && patternList[currentRowIndex].editable"
        >保存模式</el-button>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "PatternDefinition",
  props: ["dialogPatternDefinition", "patternListProp"],
  data() {
    return {
      dialogVisible: true,
      currentRowIndex: 0,
      patternList: "",
      roleDeleteList: [],
      orderDeleteList: [],
    };
  },
  created() {
    this.patternList = JSON.parse(JSON.stringify(this.patternListProp));
  },
  methods: {
    closeDialog() {
      // for (let i = 0; i < this.patternList.length; i++) {
      //   this.patternList[i].editable = false;
      // }
      // window.localStorage.setItem(
      //   "patternList",
      //   JSON.stringify(this.patternList)
      // );
      this.$emit("setSelectedPattern", this.patternList[this.currentRowIndex]);
      this.dialogVisible = false;
      //this.$emit("closePatternDefinition");
    },
    addDutyRole() {
      this.patternList[this.currentRowIndex].dutyRoleData.dutyRoles.push({
        name: "",
        numble: "",
        modeId: this.patternList[this.currentRowIndex].id,
      });
    },
    deleteDutyRole(index) {
      if (
        this.patternList[this.currentRowIndex].dutyRoleData.dutyRoles[index].id
      ) {
        this.roleDeleteList.push(
          this.patternList[this.currentRowIndex].dutyRoleData.dutyRoles[index]
            .id
        );
      }
      this.patternList[this.currentRowIndex].dutyRoleData.dutyRoles.splice(
        index,
        1
      );
    },
    addDutyOrder() {
      this.patternList[this.currentRowIndex].dutyOrderData.dutyOrders.push({
        name: "",
        modeId: this.patternList[this.currentRowIndex].id,
      });
    },
    deleteDutyOrder(index) {
      if (
        this.patternList[this.currentRowIndex].dutyOrderData.dutyOrders[index]
          .id
      ) {
        this.orderDeleteList.push(
          this.patternList[this.currentRowIndex].dutyOrderData.dutyOrders[index]
            .id
        );
      }
      this.patternList[this.currentRowIndex].dutyOrderData.dutyOrders.splice(
        index,
        1
      );
    },
    rowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    handleRowClick(row, column, event) {
      this.currentRowIndex = row.index;
    },
    handleStyle({ row, rowIndex }) {
      if (this.currentRowIndex == rowIndex) {
        return { color: "rgba(0, 153, 255, 1)" };
      }
    },
    deletePattern() {
      if (this.patternList[this.currentRowIndex]) {
        this.$api.subordinateModeDeleteMode({
          id: this.patternList[this.currentRowIndex].id,
        });
        this.patternList.splice(this.currentRowIndex, 1);
        if (this.currentRowIndex >= this.patternList.length) {
          this.currentRowIndex = this.patternList.length - 1;
        }
      }
    },
    addPattern() {
      this.$api
        .subordinateModeSaveMode({ data: { name: "自定义模式" } })
        .then((res) => {
          res.data.editable = true;
          res.data.dutyRoleData = {
            dutyRoles: [],
          };
          res.data.dutyOrderData = {
            dutyOrders: [],
          };
          this.patternList.push(res.data);
          this.currentRowIndex = this.patternList.length - 1;
        });
    },
    editPattern() {
      if (this.patternList[this.currentRowIndex]) {
        this.patternList[this.currentRowIndex].editable = true;
      }
    },
    savePattern() {
      if (this.roleDeleteList.length) {
        for (let i = 0; i < this.roleDeleteList.length; i++) {
          this.$api.subordinateModeDeleteRoleList({
            id: this.roleDeleteList[i],
          });
        }
      }
      if (this.orderDeleteList.length) {
        for (let i = 0; i < this.orderDeleteList.length; i++) {
          this.$api.subordinateModeDeleteClassesList({
            id: this.orderDeleteList[i],
          });
        }
      }
      this.$api.subordinateModeSaveMode({
        data: {
          id: this.patternList[this.currentRowIndex].id,
          name: this.patternList[this.currentRowIndex].name,
        },
      });
      this.$api.subordinateModeSaveRoleList({
        data: this.patternList[this.currentRowIndex].dutyRoleData.dutyRoles,
      });
      this.$api.subordinateModeSaveClassesList({
        data: this.patternList[this.currentRowIndex].dutyOrderData.dutyOrders,
      });
      this.patternList[this.currentRowIndex].editable = false;
    },
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.$emit("update:dialogPatternDefinition", newValue);
      },
    },
  },
};
</script>
<style scoped>
#patternDefinition .patternDefinitionButton {
  width: 30%;
}
#patternDefinition .buttonGroup {
  margin-top: 10px;
}
#patternDefinition .el-table {
  border: 1px solid rgba(188, 188, 188, 1);
}
#patternDefinition .dutyRoleBlock {
  width: 100%;
  height: 204px;
  border: 1px solid rgba(188, 188, 188, 1);
  overflow-y: auto;
}
#patternDefinition .dutyOrderBlock {
  width: 100%;
  height: 204px;
  border: 1px solid rgba(188, 188, 188, 1);
  overflow-y: auto;
}
#patternDefinition .title {
  font-family: "Arial Negreta", "Arial Normal", "Arial";
  font-weight: 700;
  font-style: normal;
  color: #0099ff;
  font-size: 18px;
  text-align: left;
}
#patternDefinition .savePatternButton {
  position: absolute;
  left: 670px;
}
</style>
