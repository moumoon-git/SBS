<!--@author：wzm-->
<template>
  <div>
    <div class="contentStyle">
      <el-header class="header">
        <div class="search-bar">
          <!-- <el-date-picker v-model="month" type="month" placeholder="选择月份" :clearable="false"></el-date-picker> -->
          <el-input
            class="search-bar-input"
            placeholder="请输入内容"
            v-model="searchValue"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button>
          </el-input>
        </div>
        <div class="navs-bar" v-if="!showSort">
          <add-button @handleAdd="handleAdd"></add-button>
          <edit-button @handleEdit="handleEdit"></edit-button>
          <delete-button @handleDelete="handleDelete"></delete-button>
          <sort-button @sortButton="handleSort"></sort-button>
        </div>
        <div class="navs-bar" v-else>
          <el-button type="primary" @click="sortChild('最前')">最前</el-button>
          <el-button type="primary" @click="sortChild('上移')">上移</el-button>
          <el-button type="primary" @click="sortChild('下移')">下移</el-button>
          <el-button type="primary" @click="sortChild('最后')">最后</el-button>
          <!-- <el-button type="primary" @click='sortChild("保存")'>保存排序</el-button> -->
          <el-button type="primary" @click="showSort = false"
            >取消排序</el-button
          >
        </div>
      </el-header>
      <el-main style="padding: 0 20px 12px">
        <!--表格分页-->
        <div class="tableContainer">
          <el-table
            class="table-class"
            border
            :data="tableData"
            @row-click="handleRowClick"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              v-for="item in tableColumn"
              :key="item.id"
              :label="item.label"
              :prop="item.prop"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <p v-if="item.prop === 'name'">{{ scope.row.name }}</p>
                <p v-if="item.prop === 'toTomorrowStatus'">
                  {{ scope.row[item.prop] ? "是" : "否" }}
                </p>
                <div v-if="item.prop === 'start' || item.prop === 'end'">
                  <p
                    v-for="(timeItem, itemIndex) in scope.row[item.prop]"
                    :key="itemIndex"
                  >
                    {{ timeItem }}
                  </p>
                </div>
                <div v-if="item.prop === 'person'">
                  <span
                    v-for="(personItem, personIndex) in scope.row.person"
                    :key="personIndex"
                    >{{ personItem }}</span
                  >
                </div>
                <p v-if="item.prop === 'seat'">
                  {{ scope.row[item.prop] ? "是" : "否" }}
                </p>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :small="pagingSize"
            :page-size="pageSize"
            :total="total"
            :current-page.sync="currentPage"
            @current-change="getList"
            layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </el-main>
      <el-dialog
        title="班次管理"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="1150px"
      >
        <add-edit
          ref="addEdit"
          v-if="dialogVisible"
          :type="showType"
          :date="month"
          @saveSuccess="handleSaveSuccess"
        ></add-edit>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MyTable from "@/components/tables/tables";
import AddButton from "@/components/button/addButton";
import EditButton from "@/components/button/editButton";
import DeleteButton from "@/components/button/deleteButton";
import SortButton from "@/components/button/sortButton";
import addEdit from "./addEdit";

export default {
  name: "flightManagement",
  components: {
    MyTable,
    AddButton,
    EditButton,
    DeleteButton,
    SortButton,
    addEdit,
  },
  data() {
    return {
      showSort: false,
      sortId: "",
      selectRow: "",
      month: new Date(),
      searchValue: "",
      showType: "",
      dialogVisible: false,
      tableColumn: [
        {
          prop: "name",
          label: "班次名称",
        },
        {
          prop: "toTomorrowStatus",
          label: "是否跨天",
        },
        {
          prop: "start",
          label: "开始时间",
        },
        {
          prop: "end",
          label: "结束时间",
        },
        {
          prop: "person",
          label: "人员",
        },
        {
          prop: "seat",
          label: "是否为坐席班次",
        },
      ],
      tableData: [], //表格数据
      total: 0, //数据总数
      pageSize: 20, //总页数
      currentPage: 1, //当前页数
      pagingSize: false, //分页大小
    };
  },
  mounted() {
    this.getList();
  },
  watch: {
    month() {
      this.getList();
    },
  },
  methods: {
    // 获取列表数据
    async getList() {
      try {
        let params = {
          date: this.month.formatDate("yyyy-MM"),
          key: this.searchValue,
          page: Number(this.currentPage) - 1,
          size: this.pageSize,
        };
        let { data } = await this.$api.getPageClasses(params);
        console.log("data: ", data);
        let list = data.viewList ? data.viewList : [];
        list.forEach((m) => {
          m.start = [];
          m.end = [];
          m.person = [];
          let appSjsDutyClassesTimeList = m.appSjsDutyClassesTimeList
            ? m.appSjsDutyClassesTimeList
            : [];
          let appSjsDutyContactorVoList = m.appSjsDutyContactorVoList
            ? m.appSjsDutyContactorVoList
            : [];
          appSjsDutyClassesTimeList.forEach((n) => {
            let startTime = new Date(`${m.date} ${n.startTime}`).formatDate(
              "hh:mm"
            );
            let endTime = new Date(`${m.date} ${n.endTime}`).formatDate(
              "hh:mm"
            );
            startTime = n.name === '' ? `${startTime}`:`${n.name}:${startTime}`;
            endTime = n.name === '' ? `${endTime}`:`${n.name}:${endTime}`;
            if (n.toTomorrowStatus) {
              m.toTomorrowStatus = n.toTomorrowStatus ? "是" : "否";
              endTime = `${endTime}(次日)`;
            }
            m.start.push(startTime);
            m.end.push(endTime);
          });
          appSjsDutyContactorVoList.forEach((n, i) => {
            let person = `${n.name}${n.sex === "女" ? "(女)" : ""}${
              i < m.appSjsDutyContactorVoList.length - 1 ? "," : ""
            } `;
            m.person.push(person);
          });
        });
        this.tableData = list;
        this.total = data.count;
      } catch (e) {
        console.log(`getList: ${e}`);
      }
    },
    // 点击新增按钮触发
    handleAdd() {
      this.showType = "add";
      this.dialogVisible = true;
    },
    // 点击修改按钮触发
    handleEdit() {
      if (!this.sortId) {
        this.$message.info("请选择一个班次");
        return;
      }
      this.showType = "edit";
      this.dialogVisible = true;
      let {
        id,
        date,
        maxNumble,
        name,
        order,
        appSjsDutyClassesTimeList,
        notifyBeginTime,
        advanceDay,
        notifyTime,
        notifyTxt,
      } = this.selectRow;
      console.log("this.selectRow: ", this.selectRow);
      appSjsDutyClassesTimeList.forEach((m) => {
        let startTime = new Date(`${date} ${m.startTime}`);
        let endTime = new Date(`${date} ${m.endTime}`);
        m.timeRange = [startTime, endTime];
        m.toTomorrowStatus = !!m.toTomorrowStatus;
      });
      let formData = {
        id,
        date,
        maxNumble,
        name,
        order,
        appSjsDutyClassesTimeList,
        delete: [],
        seat: this.selectRow.seat == 0 ? false : true,
        notifyBeginTime,
        advanceDay,
        notifyTime,
        notifyTxt,
        smsSwicth: !this.selectRow.smsSwicth ? "关" : "开",
      };
      this.$nextTick(() => {
        this.$refs.addEdit.getFormData(formData);
      });
    },
    // 点击addEdit组件确定按钮
    handleSave() {
      this.$refs.addEdit.handleSave();
    },
    // addEdit组件保存成功返回
    handleSaveSuccess() {
      this.dialogVisible = false;
      this.getList();
      this.handleRowClick(this.tableData.find((v) => v.id == this.sortId));
    },
    // 点击删除按钮触发
    handleDelete() {
      if (!this.sortId) {
        this.$message.error("请选择一个班次");
        return;
      }
      this.$confirm("确认删除该班次, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let params = {
              data: {
                id: this.sortId,
              },
            };
            let res = await this.$api.deletedClasses(params);
            if (res.errorcode === 0) {
              await this.getList();
            }
          } catch (e) {
            console.log(`handleRemove: ${e}`);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 点击表格某一行触发
    handleRowClick(row) {
      if (row) {
        if (row.id === this.sortId) {
          this.sortId = '';
          this.selectRow = {};
          return;
        }
        this.sortId = row.id;
        this.selectRow = row;
      }
      // this.$api.dutyDetail({id: this.sortId}).then((res) => {
      //   if (res.errorcode == 0) {
      //     console.log(res.data);
      //   }
      // })
    },
    // 设置表格某行的样式
    tableRowClassName({ row }) {
      if (row.id === this.sortId) {
        return "select-row";
      }
      return "";
    },
    // 点击排序按钮触发
    handleSort() {
      this.showSort = true;
    },
    // 数组元素交换位置
    swapArray(array, index1, index2) {
      if (index2 < array.length) {
        array[index1] = array.splice(index2, 1, array[index1])[0];
      }
      console.log("排序：", index2);
    },
    // 点击各种排序类型触发
    async sortChild(text) {
      if (!this.sortId) {
        this.$message.warning("请先单击选中要操作的行");
        return;
      }
      let totalLength = this.tableData.length;
      let index = this.tableData.findIndex((m) => m.id === this.sortId);
      if (text === "最前") {
        this.swapArray(this.tableData, index, 0);
      }
      if (text === "上移") {
        if (index === 0) return;
        this.swapArray(this.tableData, index, index - 1);
      }
      if (text === "下移") {
        if (index === totalLength) return;
        this.swapArray(this.tableData, index, index + 1);
      }
      if (text === "最后") {
        this.swapArray(this.tableData, index, totalLength - 1);
      }
      /* if (text === '保存') {
              let _this = this;
              _this.showSort = false;
              setTimeout(function() {
                _this.$message({
                  message: '保存成功',
                  type: 'success'
                });
              }, 600);
            } */
      let result = [];
      this.tableData.forEach((m, i) => {
        let obj = {
          id: m.id,
          order: i,
        };
        result.push(obj);
      });
      try {
        let res = await this.$api.orderClass({
          data: result,
        });
        // 修复bug2021071952975，排序成功后的显示位置已经是最新的，因此可以不用调用接口重复渲染列表
        if (res.errorcode === 0) {
          // await this.getList();
        }
      } catch (e) {
        await this.getList();
        console.log('sortChild:', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contentStyle {
  // margin: 16px 30px 0 30px;
  background-color: white;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;

  .el-table {
    box-shadow: none;
    /deep/ .select-row {
      background: #4a9fff;
      color: #ffffff;

      &:hover {
        td {
          background: #4a9fff;
          color: #ffffff;
        }
      }
    }
  }

  .header {
    height: 72px !important;
    line-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-bar {
      display: flex;
      align-items: center;

      .search-bar-input {
        // margin-left: 10px;

        /deep/ .el-input-group__append {
          padding: 0 12px;
          background-color: #409eff;
          color: white;
          font-size: 16px;
        }
      }
    }

    .navs-bar {
      background-color: white;
      display: flex;
      align-items: center;
    }
  }
}

.tableContainer {
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid rgba(211, 215, 219, 1);
}

.element.style {
  text-align: left;
}

.el-input-number {
  display: block;
  width: 220px;
}

.dialog-footer {
  text-align: center;
}
</style>
