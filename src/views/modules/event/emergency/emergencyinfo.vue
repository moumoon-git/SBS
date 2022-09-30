<template>
  <div class="emergencyinfo">
    <!--
      * @author tanjinfeng
      * @date 2020-11-23
      * @description 查看和新增修改页面改为嵌套路由，在这里显示，从而主页的状态可以保存
    -->
    <!-- *** 新增的代码 *** -->
    <div v-show="isWatchOrUpdate">
      <router-view></router-view>
    </div>
    <!-- *** 结束 *** -->
    <div v-show="!isWatchOrUpdate">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item style="display: block">
          <el-input
            v-model="dataForm.key"
            placeholder="请输入事件编号"
            style="width: 200px"
            clearable
            class="searchMargin"
            size="small"
            @input="
              pageIndex = 1;
              getDataList();
            "
          ></el-input>
          <el-date-picker
            v-model="dataForm.dateRange"
            clearable
            :unlink-panels="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="searchMargin"
            size="small"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-select
            v-model="dataForm.emergencyType"
            placeholder="请选择要情分类"
            class="searchMargin"
            clearable
            size="small"
            @change="getChildrenTypes"
          >
            <el-option
              v-for="(item, idx) in emergencyType"
              clearable
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-cascader
            v-model="dataForm.type"
            placeholder="请选择事件类型"
            :options="selectOptions"
          ></el-cascader>
          <el-select
            v-model="dataForm.emergencySource"
            placeholder="请选择要情来源"
            class="searchMargin"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, idx) in emergencySource"
              clearable
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-select
            v-model="dataForm.type"
            placeholder="请选择事件类型"
            class="searchMargin"
            clearable
            size="small"
          >
            <el-option
              v-for="item in selectOptions"
              clearable
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <el-select
            v-model="dataForm.status"
            placeholder="请选择事件状态"
            class="searchMargin"
            clearable
            size="small"
          >
            <el-option
              v-for="item in statusOptions"
              clearable
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-button
            @click="getDataList()"
            class="searchMargin"
            type="primary"
            size="small"
            >查询</el-button
          >
          <el-button
            @click="dataForm = { key: '', dateRange: [], type: '', status: '' }"
            class="searchMargin"
            type="primary"
            size="small"
            >重置</el-button
          >
          <el-button
            v-if="isAuth('emergency:emergencyinfo:save')"
            style="margin-right: 5px"
            class="searchMargin"
            @click="addOrUpdateHandle()"
            type="primary"
            size="small"
            >新增</el-button
          >
          <el-button
            v-if="isAuth('emergency:emergencyinfo:delete')"
            style="margin-right: 5px"
            class="searchMargin"
            @click="deleteHandle()"
            :disabled="dataListSelections.length <= 0"
            type="primary"
            size="small"
            >批量删除</el-button
          >
          <el-button
            style="margin-right: 5px"
            @click="exportHandle()"
            class="searchMargin"
            type="primary"
            size="small"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item style="display: block">
          <span style="font-weight: bolder"
            >今日新增事件:{{ this.todayEvents.add }}&nbsp;&nbsp;待办事件:{{
              this.todayEvents.upcoming
            }}&nbsp;&nbsp;办理中事件:{{
              this.todayEvents.processing
            }}&nbsp;&nbsp;办结事件:{{ this.todayEvents.finish }}</span
          >
          <div style="float: right; display: inline-block"></div>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="number"
          header-align="center"
          align="center"
          label="事件编号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="title"
          header-align="center"
          align="center"
          label="事件标题"
        ></el-table-column>
        <el-table-column
          prop="time"
          header-align="center"
          align="center"
          label="事发时间"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="事发地点"
        ></el-table-column>
        <el-table-column
          prop="emergencyType"
          header-align="center"
          align="center"
          label="要情分类"
          :formatter="emergencyTypeFormatter"
        ></el-table-column>
        <el-table-column
          prop="emergencyTypeName"
          header-align="center"
          align="center"
          label="事件类型"
        ></el-table-column>
        <el-table-column
          prop="statusValue"
          header-align="center"
          align="center"
          label="办理状态"
          width="80"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <div class="operation">
              <el-button
                type="text"
                size="small"
                @click="watchHandle(scope.row.id, scope.row)"
                >查看</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="addOrUpdateHandle(scope.row.id, scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteHandle(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></add-or-update>
    </div>
  </div>
</template>

<script>
import AddOrUpdate from "./emergencyinfo-add-or-update";
import InspectionSheetManagement from "../../riskInvestigation/inspectionSheetManagement/inspectionSheetManagement";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      // 当前为查看或修改页面
      isWatchOrUpdate: false,
      $Cookies: {},
      statusOptions: [
        {
          value: 0,
          label: "待办",
        },
        {
          value: 1,
          label: "办理中",
        },
        {
          value: 2,
          label: "已办结",
        },
      ],
      emergencyType: [
        {
          value: "1",
          label: "普通事件",
        },
        {
          value: "2",
          label: "突发事件",
        },
      ],
      emergencySource: [],
      putongType: [], // 普通事件类型
      tufaType: [], // 突发事件类型
      selectOptions: [], // 下拉事件类型（putongType 或 tufaType 之一）
      typeOptions: [], // 事件总类型
      dataForm: {
        key: "",
        dateRange: [],
        type: "",
        status: "",
        emergencySource: "",
      },
      todayEvents: {
        add: "",
        upcoming: "",
        processing: "",
        finish: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },
  components: {
    AddOrUpdate,
    InspectionSheetManagement,
  },
  activated() {},
  created() {
    this.getCount();
    this.getEmergencySource();
    this.getEmergencyInfoType();
    this.getTufaType();

    this.getDataList();

    this.$Cookies = Cookies;
  },
  methods: {
    getEmergencySource() {
      this.emergencySource = [];
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictionary/dictionaryList?id=99`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("/sys/sysdictionary/dictionaryList 获取要情来源source",data)

          data.data.forEach((item) => {
            this.emergencySource.push({ value: item.id, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getCount() {
      this.$http({
        url: this.$http.adornUrl(`/emergency/emergencyinfo/getCount`),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.todayEvents.add = data.todayAdd;
          this.todayEvents.upcoming = data["0"];
          this.todayEvents.processing = data["1"];
          this.todayEvents.finish = data["2"];
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getChildrenTypes() {
      if (!this.dataForm.emergencyType) {
        this.selectOptions = [];
      } else {
        this.selectOptions =
          this.dataForm.emergencyType === "1" ? this.putongType : this.tufaType;
        console.log(this.selectOptions);
      }
    },
    // 递归获取选项数据结构
    recursion(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].value = list[i].id;
        list[i].label = list[i].name;
        if (list[i].children) {
          this.recursion(list[i].children);
        }
      }
    },

    // 获取普通事件类型
    getEmergencyInfoType() {
      this.$http({
        // url: this.$http.adornUrl(`/sys/sysdictionary/dictionaryList?id=102`),
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode2tree?code=emergencyType`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        console.log("普通事件类型", data);
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          Promise.resolve(this.recursion(data.data)).then(() => {
            this.putongType = data.data;
            this.typeOptions = data.data;
          });
          // data.data.forEach(item => {
          //   this.putongType.push({ value: item.id, label: item.name });
          //   this.typeOptions.push({ value: item.id, label: item.name });
          // });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },

    // 获取突发事件类型
    getTufaType() {
      this.$http({
        url: this.$http.adornUrl(
          // `/sys/sysdictionary/getSysDictionaryListByCode?code=tufa_type`
          `/sys/sysdictionary/getSysDictionaryListByCode2tree?code=tufa_type`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        console.log("突发事件类型", data);
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          Promise.resolve(this.recursion(data.data)).then(() => {
            this.tufaType = data.data;
            this.typeOptions = data.data;
          });
          // data.data.forEach(item => {
          //   this.tufaType.push({ value: item.id, label: item.name });
          //   this.typeOptions.push({ value: item.id, label: item.name });
          // });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },

    exportHandle() {
      var ids = [];
      this.dataListSelections.forEach((item) => {
        ids.push(item.id);
      });
      setTimeout(() => {
        if (this.dataListSelections.length > 0) {
          window.location.href = `${
            window.SITE_CONFIG.baseUrl
          }/emergency/emergencyinfo/output-excel?ids=${ids}&token=${this.$Cookies.get(
            "token"
          )}`;
        } else {
          this.$message.error("请选择");
        }
      });
    },
    statusFormatter(val) {
      if (val.status == 1) {
        return "待办";
      } else if (val.status == 2) {
        return "办理中";
      } else if (val.status == 3) {
        return "已办结";
      }
    },
    emergencyTypeFormatter(val) {
      return this.emergencyType.find((item) => item.value === val.emergencyType)
        .label;
    },
    typeFormatter(val) {
      // for (var i = 0; i < this.typeOptions.length; i++) {
      //   if (this.typeOptions[i].value == val.typeId) {
      //     return this.typeOptions[i].label;
      //   }
      // }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      console.log(this.dataForm.type);
      this.$http({
        url: this.$http.adornUrl("/emergency/emergencyinfo/list"),
        method: "get",
        params: this.$http.adornParams({
          key: this.dataForm.key,
          status: this.dataForm.status,
          emergencyType: this.dataForm.emergencyType,
          emergencySource: this.dataForm.emergencySource,
          type: this.dataForm.type[this.dataForm.type.length - 1],
          startTime:
            this.dataForm.dateRange && this.dataForm.dateRange[0]
              ? this.dataForm.dateRange[0] + " 00:00:00"
              : "",
          endTime:
            this.dataForm.dateRange && this.dataForm.dateRange[1]
              ? this.dataForm.dateRange[1] + " 23:59:59"
              : "",
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
      // console.log("this.dataListSelections",this.dataListSelections)
    },
    // 新增 / 修改
    addOrUpdateHandle(id, item) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
      // console.log("id,item",id,item)
      var status = id ? "update" : "add";
      this.$router.push({
        /**
         * @author tanjinfeng
         * @date 2020-11-23
         * @description 修改为嵌套路由
         */
        // *** 原来的代码 ***
        // path: "/emergencyinfo-add-or-update",
        // *** 修改后的代码 ***
        path: "/emergencyinfo-add-or-update-nest",
        // *** 结束 ***
        query: {
          status: status,
          id: id || 0,
          item: item,
          operationStatus: item ? item.statusValue : "",
        },
      });
    },
    watchHandle(id, item) {
      var status = id ? "update" : "add";
      this.$router.push({
        /**
         * @author tanjinfeng
         * @date 2020-11-23
         * @description 修改为嵌套路由
         */
        // *** 原来的代码 ***
        // path: "/emergencyinfo-add-or-update",
        // *** 修改后的代码 ***
        path: "/emergencyinfo-add-or-update-nest",
        // *** 结束 ***
        query: {
          status: "watch",
          id: id || 0,
          item: item,
          operationStatus: item ? item.statusValue : "",
        },
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/emergency/emergencyinfo/delete"),
          method: "post",
          data: this.$http.adornData({
            ids: ids,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
  },
  watch: {
    /**
     * @author tanjinfeng
     * @date 2020-11-23
     * @description 监听当前路由变化，来切换显示主页和新增修改查看页面
     */
    $route: {
      handler: function (val) {
        if (val.path === "/emergencyinfo-add-or-update-nest") {
          this.isWatchOrUpdate = true;
        } else {
          this.isWatchOrUpdate = false;
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
.emergencyinfo {
  .el-button {
    margin: initial;
  }
  .el-form-item {
    margin: initial;
    margin-top: 10px;
    .el-form-item__content {
      width: 100%;
    }
  }

  tr {
    th {
      background: #bbbbbb;
      color: white;
    }
  }
  .operation {
    display: flex;
    justify-content: space-around;
  }
  .el-date-editor .el-range-separator {
    padding-right: 15px;
  }
}
</style>
