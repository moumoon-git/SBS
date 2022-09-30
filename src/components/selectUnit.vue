<!--
 * @Author: your name
 * @Date: 2021-04-13 10:59:55
 * @LastEditTime: 2021-04-26 17:20:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xuchuangxing\SJSEOS\src\view\dutyManagement\RollCallOnDuty\selectUnit.vue
-->
<template>
  <div>
    <el-dialog
      :title="selectUnitTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
      width="400px"
    >
      <el-table :data="allUnitData" border height='500px' style="width: 100%;">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="item in unitColumn"
          :key="item.prop"
        >
        </el-table-column>
        <el-table-column label="值班部门" align="center">
          <template slot-scope="scope">
            <el-cascader
              v-model="scope.row.deptId"
              :options="reportingUnitData"
              :ref="'reportingUnit' + scope.$index"
              :props="props"
              clearable
              :show-all-levels="false"
              filterable
              @change="reportingUnitChange($event, scope.$index)"
            ></el-cascader>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveDepartment">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Selectunit",
  props: ["unitData"],
  data() {
    return {
      selectUnitTitle: "选择单位",
      unitColumn: [{ prop: "groupName", label: "单位" }],
      props: {
        value: "deptId",
        label: "name",
        children: "childrens",
        checkStrictly: true
      },
      dialogVisible: true,
      reportingUnitData: [],
      allUnitData: []
    };
  },
  mounted() {
    this.allUnitData = JSON.parse(JSON.stringify(this.unitData)); // 避免影响之前的数据
    this.allUnitData.map(v => {
      v.deptId = parseInt(v.deptId);
    });
    // console.log("this.allUnitData: ", this.allUnitData);
    this.addressBook(); // 获取通讯录/报送单位
  },
  methods: {
    //通讯录
    addressBook() {
      let data = {};
      this.$api.departmentGroupList(data).then(res => {
        // console.log("res: ", res);
        if (res.errorcode == "0") {
          this.reportingUnitData = res.data; // console.log("this.treeData: ", this.treeData);
          var gettree = function(data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].childrens.length == 0) {
                data[i].childrens = undefined;
              } else {
                gettree(data[i].childrens);
              }
            }
          };
          gettree(this.reportingUnitData);
        }
      });
    },
    /**
     * @param {array} val 报送单位id
     * @lastEditor hexinting
     * @lastDate 2020-9-18
     * @description 报送单位发生改变触发
     */
    reportingUnitChange(val, idx) {
      if (this.$refs["reportingUnit" + idx]) {
        var children = this.$refs["reportingUnit" + idx].getCheckedNodes();
        if (!children || children.length == 0 || !children[0]) return;
        if (children[0].children.length < 1) {
          //判断有没有下级
          this.$refs["reportingUnit" + idx].dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
      let currentUnit = this.allUnitData[idx];
      currentUnit.deptId = currentUnit.deptId[currentUnit.deptId.length - 1];
      this.allUnitData;
      //   console.log("this.allUnitData: ", this.allUnitData);
      //   console.log("报送单位：", val);
      //   console.log("idx: ", idx);
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * @lastEditor hexinting
     * @lastEditedDate 2021-04-18
     * @description 保存政务联络网分组和部门的关联
     */
    saveDepartment() {
      let allDepartment = [];
      console.log("this.allUnitData: ", this.allUnitData);
      this.allUnitData.map(v => {
        allDepartment.push({
          groupId: v.id,
          deptId: v.deptId instanceof Array ? null : v.deptId
        });
      });
      this.$emit("udpateUnitData", allDepartment);
      this.handleClose();

      // 注释原因：工作安排也需要用到该此方法，但不需要调用接口保存。saveDepartment接口只在值班点名使用，所以先注释掉。以下方法搬到了rollCallOnDuty.vue
      // this.$api.saveDepartment({ data: allDepartment }).then(res => {
      //   // console.log("res: ", res);
      //   if (res.errorcode == "0") {
      //     this.$message.success("保存成功");
      //     this.$emit("udpateUnitData");
      //   }
      // });
    }
  }
};
</script>

<style lang="scss" scoped></style>
