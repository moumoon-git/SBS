/*
 * @Author: liukanglin 
 * @Date: 2020-09-01
 */
<template>
  <wasteManagement-template
    ref="template"
    :treeAPI="['/investigation/investigationTaskGroup/listTree', '/investigation/investigationGroup/listTree']"
    @treeClick="handleTreeClick"
    title="隐患预警"
    :tableRequest="tableRequest"
  >
    <template v-slot:right__operation>
      <sv-select placeholder="请选择街道"></sv-select>
      <sv-select placeholder="请选择社区"></sv-select>
      <sv-select placeholder="请选择小区性质"></sv-select>
      <sv-select width="160px" placeholder="请选择投放点模式"></sv-select>
      <sv-select width="190px" placeholder="请选择守桶人员委派方"></sv-select>
      <!-- <sv-select :options="options" placeholder="测试占位符"></sv-select> -->
      <!-- <sv-select-date></sv-select-date> -->
      <sv-input-search width="270px" placeholder="请选择分类点名称、小区名称关键字"></sv-input-search>
      <sv-button>查询</sv-button>
      <sv-button>导入/导出</sv-button>
      <sv-button>导出二维码</sv-button>
      <!-- 打开新增窗口 -->
      <sv-button @click="$refs.add_waste_dialog.dialogFormVisible = true">新增分类点</sv-button>
      <addWaste-dialog ref="add_waste_dialog"></addWaste-dialog>
    </template>
    <template v-slot:right__table>
      <el-table-column header-align="center" align="center" label="分类点名称">
        <template slot-scope="scope">
          <!-- 内容可能很长的项，放入sv-table-tooltip中 -->
          <sv-table-tooltip :content="scope.row.sortName"></sv-table-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="community" header-align="center" align="center" label="社区"></el-table-column>
      <el-table-column prop="village" header-align="center" align="center" label="城中村/小区"></el-table-column>
      <el-table-column
        prop="communityNtoufangature"
        header-align="center"
        align="center"
        label="小区性质"
      ></el-table-column>
      <el-table-column prop="deliveryPointMode" header-align="center" align="center" label="投放点模式"></el-table-column>
      <el-table-column prop="delegate" header-align="center" align="center" label="守桶人员委派方"></el-table-column>
      <el-table-column prop="positionDescribe" header-align="center" align="center" label="投放点位置描述"></el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <sv-table-operation
            :display="['qrcode','view', 'edit', 'delete']"
            @view="handleClick(scope.row.id)"
            @edit="handleClick(scope.row.id)"
            @delete="handleClick(scope.row.id)"
          ></sv-table-operation>
        </template>
      </el-table-column>
    </template>
  </wasteManagement-template>
</template>

<script>
import wasteManagement_template from "./wasteManagementTemplate.vue";
import addWaste_dialog from "./addWasteDialog.vue";
export default {
  components: {
    "wasteManagement-template": wasteManagement_template,
    "addWaste-dialog": addWaste_dialog,
  },
  methods: {
    handleClick(val) {
      console.log("click and get", val);
    },
    exportAll() {
      const ids = this.$refs.template.getTreeChecked();
      const url = new URL(
        `${window.SITE_CONFIG.baseUrl}/investigation/investigationTask/xlsOutputSelect`
      );
      const params = {
        token: this.$cookie.get("token"),
        checkedIds: ids.join(","),
      };
      url.search = new URLSearchParams(params).toString();
      fetch(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }).then((response) => {
        // const fileName = decodeURI(escape(response.headers.get("content-disposition"))).split('fileName%3D')[1]
        console.log(
          "test",
          decodeURI(encodeURI(response.headers.get("content-disposition"))),
          decodeURI(escape(response.headers.get("content-disposition")))
        );
        const fileName = "test.xls";
        response.blob().then((blob) => {
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      });
    },
    handleTreeClick(id, tabIndex) {
      this.tableRequest.param.taskGroups = [];
      this.tableRequest.param.inforGroups = [];
      switch (tabIndex) {
        case 0:
          this.tableRequest.param.taskGroups = id == null ? [] : [id];
          break;
        case 1:
          this.tableRequest.param.inforGroups = id == null ? [] : [id];
          break;
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
  },
  data() {
    return {
      tableRequest: {
        api: "/investigation/instanceInfor/instanceList",
        param: {
          search: "",
          taskGroups: [],
          inforGroups: [],
          isNotice: "",
          period: "",
          startTime: "",
          endTime: "",
        },
      },
      options: [
        {
          label: "选项1",
          value: 1,
        },
        {
          label:
            "选项2很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
          value: 2,
        },
        {
          label: "选项3不可选",
          value: 3,
          active: false,
        },
        {
          label: "选项4",
          value: 4,
        },
      ],
      // 控制新增窗口是否被打开
      dialogFormVisible: false,
    };
  },
};
</script>
<style lang="less" scoped>
  /deep/
    .sv-page-right-content__container
    .sv-page-right-content__header
    .sv-page-right-content__header__title {
    display: none;
  }
  /deep/ .sv-select .sv-select__reference .sv-select__inner {
    text-align: left;
  }
</style>
