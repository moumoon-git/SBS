<template>
  <div>
    <el-dialog
      title="值班人员配置"
      width="680px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      class="dialog-style"
      :close-on-click-modal="false"
    >
      <personnel-pool
        :class-list="classList"
        :active-class="activeClassId"
        :personnel-pool="mansList"
        :type="type"
        @delete="deletePersonnel"
        @add="addPersonnel"
        @allCheck="allCheck"
        @cancelAllCheck="cancelAllCheck"
        @changeClass="changeClass"
        @checkChange="checkChange"
        @sort="sortMans"
      >
      </personnel-pool>
      <div class="operation-group">
        <el-button type="info" size="small" @click="handleClose"
          >取消</el-button
        >
        <el-button type="primary" size="small" @click="saveResult"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!-- 选择人员弹窗 -->
    <selectMansDialog
      ref="selectDialog"
      selectTitle="选择联系人"
      :selectData="outerVisible"
      @close="outerVisible = false"
      @closeDialog="outerVisible = false"
      @addMans="change"
    >
    </selectMansDialog>
  </div>
</template>
<script>
import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog";
import personnelPool from "./personnelPool.vue";
export default {
  name: "personnelSettings",
  components: {
    selectMansDialog,
    personnelPool,
  },
  props: ["classList", "activeClass"],
  data() {
    return {
      activeClassId: "",
      dialogVisible: true,
      outerVisible: false,
      checkList: [],
      type: "big",
      classId: 0,
      mansList: [],
    };
  },
  watch: {
    classList: {
      handler(newVal, oldVal) {
        // if (newVal.length > 0) {
        //   this.classId = this.classList.filter(item => item.name === this.activeClass)[0].id
        // }
      },
      deep: true,
    },
  },
  mounted() {
    this.activeClassId = this.activeClass;
    this.classId = parseInt(this.activeClass);
    // if (this.classList.length > 0) {
    //   this.classId = this.classList.filter(item => item.name === this.activeClass)[0].id
    //   console.log('----------', this.classList.filter(item => item.name === this.activeClass)[0].id)
    // }
    console.log("aaaaaaa", this.classList, this.classId, this.activeClass);
    this.getAllContactorByClassId(this.classId);
  },
  methods: {
    /**
     * @description 排序
     */
    sortMans(mans) {
      this.mansList = mans;
      this.addDutyContactor('sort');
    },
    // 根据班次id查询值班人员
    getAllContactorByClassId(classId) {
      console.log("班次id：", classId);
      let data = {
        classId: classId,
      };
      this.$api.getAllContactorByClassId(data).then((res) => {
        if (res.errorcode === 0) {
          this.mansList = res.data;
          console.log("值班人员列表：", this.mansList);
        }
      });
    },
    // 新增值班人员
    addDutyContactor(type = '') {
      // let contactorIds = []
      // this.mansList.forEach(item => {
      //   contactorIds.push(item.contactorId)
      // })
      let dutyOfficer = [];
      if (this.mansList.length > 0) {
        this.mansList.map((v, index) => {
          // v.participate = 0; // 默认所有值班员不参与值班
          // // 如果勾选，参与排班
          // if (this.checkList.length > 0) {
          //   this.checkList.map((item) => {
          //     if (v.contactorId == item) {
          //       v.participate = 1;
          //     }
          //   });
          // }
          // console.log('this.mansList: ', this.mansList);
          // 重组数据
          dutyOfficer.push({
            id: v.id || "",
            contactorId: v.contactorId,
            // participate: v.participate,
            order: index,
          });

        });
        let data = {
          classId: this.classId, // 班次id
          data: dutyOfficer, //联系人id
        };
        this.$api.addDutyContactor(data).then((res) => {
          if (res.errorcode === 0) {
            if (type !== 'sort') {
              this.$message({
                type: "success",
                message: "保存成功",
              });
            }
            this.getAllContactorByClassId(this.classId);
            this.$emit("update");
            this.checkList = [];
          }
        });
      } else {
        this.$message({
          type: "info",
          message: "请先添加人员",
        });
      }
    },
    // 删除值班人员
    deleteDutyContactor(id) {
      let data = {
        id: id,
      };
      this.$api.deleteDutyContactor(data).then((res) => {});
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("close", false);
    },
    // 多选框选中
    checkChange(val) {
      this.checkList = val;
    },
    // 新增
    addPersonnel(idList) {
      this.outerVisible = true;
      this.$refs.selectDialog.defaultSelection(idList, "onduty");
    },
    // 全选
    allCheck(val) {
      this.checkList = val;
      console.log(this.checkList);
    },
    // 取消全选
    cancelAllCheck(val) {
      this.checkList = val;
    },
    // 新增的人员
    change(val, list) {
      this.mansList.forEach((item) => {
        list.forEach((el, index) => {
          if (el && el.id === item.contactorId) {
            list.splice(index, 1);
          }
        });
      });
      list.forEach((item) => {
        if (item) {
          const data = {
            name: item.name,
            contactorId: item.id,
            startTime: "",
            endTime: "",
            startDate: "",
            endDate: "",
            day: "",
          };
          this.mansList.push(data);
        }
      });
      this.outerVisible = false;

      let dutyOfficer = [];
      if (this.mansList.length > 0) {
        this.mansList.map((v, index) => {
          dutyOfficer.push({
            id: v.id || "",
            contactorId: v.contactorId,
            order: index,
          });
        });
        let data = {
          classId: this.classId, // 班次id
          data: dutyOfficer, //联系人id
        };
        this.$api.addDutyContactor(data).then((res) => {
          if (res.errorcode === 0) {
            this.getAllContactorByClassId(this.classId);
            this.$emit("update");
            this.checkList = [];
          }
        });
      }
    },
    // 从人员池里删除人员
    deletePersonnel(list) {
      // this.checkList = [];
      // this.mansList = list;
      // this.mansList.forEach((item) => {
      //   this.checkList.push(item.contactorId);
      // });
      this.getAllContactorByClassId(this.classId);
    },
    // 保存
    saveResult() {
      this.$emit("close", false);
      this.$emit("update");
      this.$message({
        type: "success",
        message: "选择人员成功",
      });
      // this.addDutyContactor();
    },
    // 切换班次，获取值班人员
    changeClass(classId) {
      this.activeClassId = classId;
      this.classId = parseInt(classId);
      this.getAllContactorByClassId(this.classId);
    },
  },
};
</script>
<style scoped>
/deep/ .dialog-style .el-dialog__header {
  background: rgba(241, 244, 246, 1);
  text-align: left !important;
  padding: 10px 20px;
  border-radius: 5px 5px 0 0;
}
/deep/ .dialog-style .el-dialog__headerbtn {
  top: 15px !important;
}
.personnel-pool {
  width: calc(100% - 40px);
  height: 372px;
  border-left: 1px solid rgba(221, 221, 221, 1);
  border-right: 1px solid rgba(221, 221, 221, 1);
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  padding: 30px 18px 10px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.checkbox-txt {
  color: rgba(51, 51, 51, 1);
}
.checkbox-del {
  color: rgba(153, 153, 153, 1);
}
.checkbox-wrapper {
  height: 330px;
  overflow-y: scroll;
}
.checkbox-style {
  width: 112px;
  margin-bottom: 20px;
}
.button-group {
  width: 100%;
  text-align: right;
}
.button-group .el-button {
  padding: 0 !important;
}

.operation-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>