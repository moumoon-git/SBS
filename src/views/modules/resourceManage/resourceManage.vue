<template>
  <div class="resourceManage">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="巡查车辆管理" name="first">
        <el-col :span="6">
          <div style="margin-top:5px">
            <span style="margin-left:10px">总数：{{totalCount}}</span>
            <span style="margin-left:10px">待审核：{{waitCheckCount}}</span>
            <span style="margin-left:10px">已审核：{{checkedCount}}</span>
            <span style="margin-left:10px">已驳回：{{rejectCount}}</span>
            <span style="margin-left:10px">待提交：{{waitCommitCount}}</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-form
            :inline="true"
            :model="dataForm"
            @keyup.enter.native="getDataList()"
            style="position: relative;"
          >
            <el-form-item>
              <el-select clearable v-model="dataForm.carSource" placeholder="请选择能源类型">
                <el-option
                  v-for="item in sourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="dataForm.dateRange"
                clearable
                :unlink-panels="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                value-format="yyyy-MM-dd"
              >></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input style="width:300px;" v-model="dataForm.name" placeholder="请输入关键字" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="searchResult()" size="small">查询</el-button>

              <el-upload
                style="display: inline-block;"
                action
                :http-request="uploadSectionFile"
                :show-file-list="false"
              >
                <el-button
                  style="background: #409eff;color: #fff;margin-left: initial;"
                  size="small"
                >导入</el-button>
              </el-upload>

              <el-dropdown style="margin-left: 0px;">
                <el-button
                  style="background: #409eff;color: #fff;margin-left: initial;"
                  size="small"
                >导出数据</el-button>
                <el-dropdown-menu slot="dropdown" split-button="true">
                  <el-dropdown-item @click.native="exportSelectAll()">导出已选择数据</el-dropdown-item>
                  <el-dropdown-item @click.native="exportSearchAll()">导出所有查询数据</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="primary" size="small" @click="addOrUpdateHandle(null,'add')">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-table :data="dataList" v-loading="dataListLoading" @selection-change="carDataSelection">
          <el-table-column type="selection" header-align="left" align="center" width="55"></el-table-column>
          <el-table-column type="index" header-align="center" align="center" width="80" label="序号"></el-table-column>
          <el-table-column prop header-align="center" align="center" label="所属镇街"></el-table-column>
          <el-table-column header-align="center" align="center" label="所属村居"></el-table-column>
          <el-table-column prop="carNum" header-align="center" align="center" label="车牌号"></el-table-column>
          <el-table-column prop="carSource" header-align="center" align="center" label="能源类型">
            <template slot-scope="scope">
              <span>{{ (sourceOptions.find(item => item.value == scope.row.carSource))?(sourceOptions.find(item => item.value == scope.row.carSource)).label :""}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="carProduceTime"
            header-align="center"
            align="center"
            width="180"
            label="生产日期"
          ></el-table-column>
          <el-table-column prop="responsible" header-align="center" align="center" label="责任人"></el-table-column>
          <el-table-column prop="phone" header-align="center" align="center" label="联系电话"></el-table-column>
          <el-table-column prop="carStatus" header-align="center" align="center" label="使用状态">
            <template slot-scope="scope">
              <span>{{ (sourceTypeOptions.find(item => item.value == scope.row.carStatus))?(sourceTypeOptions.find(item => item.value == scope.row.carStatus)).label:"" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="审核状态">
            <template slot-scope="scope">
              <span
                :class="(statusOptions.find(item => item.value == scope.row.status))?(statusOptions.find(item => item.value == scope.row.status)).label == '待审核'?'yellowFont':
                (statusOptions.find(item => item.value == scope.row.status)).label=='已审核'?'greenFont':
                (statusOptions.find(item => item.value == scope.row.status)).label=='已驳回'?'redFont':'blackFont':''"
              >{{ (statusOptions.find(item => item.value == scope.row.status))?(statusOptions.find(item => item.value == scope.row.status)).label:"" }}</span>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="200" label="操作">
            <template slot-scope="scope">
              <div style="display:flex">
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '0'"
                  @click="baoshen(scope.row.id)"
                >报审</el-button>
                <el-button
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '0'"
                  @click="addOrUpdateHandle(scope.row.id,'update')"
                >编辑</el-button>
                <el-button
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '1' || scope.row.status == '2'"
                  @click="addOrUpdateHandle(scope.row.id,'show')"
                >查看</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '3'"
                  @click="baoshen(scope.row.id)"
                >重新报审</el-button>
                <el-button size="small" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
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
      </el-tab-pane>

      <el-tab-pane label="群防岗亭管理" name="second">
        <el-col :span="6">
          <div style="margin-top:5px">
            <span style="margin-left:10px">总数：{{totalCount}}</span>
            <span style="margin-left:10px">待审核：{{waitCheckCount}}</span>
            <span style="margin-left:10px">已审核：{{checkedCount}}</span>
            <span style="margin-left:10px">已驳回：{{rejectCount}}</span>
            <span style="margin-left:10px">待提交：{{waitCommitCount}}</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-form
            :inline="true"
            :model="dataForm"
            @keyup.enter.native="getDataList2()"
            style="position: relative;"
          >
            <el-form-item>
              <el-select
                v-model="dataForm2.value"
                clearable
                placeholder="请选择镇街"
                style="width:125px"
                @change="getOption2"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="dataForm2.value2"
                clearable
                placeholder="请选择村居"
                style="width:125px"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-date-picker
                v-model="dataForm2.dateRange"
                clearable
                :unlink-panels="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                value-format="yyyy-MM-dd"
              >></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                style="width:300px;"
                v-model="dataForm2.name"
                placeholder="请输入岗亭名称、地址、责任人姓名关键字查询"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="searchResult()" size="small">查询</el-button>
              <el-button
                style="background: #409eff;color: #fff;margin-left: initial;"
                size="small"
              >导入</el-button>
              <el-dropdown style="margin-left: 0px;">
                <el-button
                  style="background: #409eff;color: #fff;margin-left: initial;"
                  size="small"
                >导出数据</el-button>
                <el-dropdown-menu slot="dropdown" split-button="true">
                  <el-dropdown-item @click.native="exportSelectAll()">导出已选择数据</el-dropdown-item>
                  <el-dropdown-item @click.native="exportSearchAll()">导出所有查询数据</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="primary" size="small" @click="addOrUpdateHandle(null,'add')">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-table
          :data="dataList2"
          v-loading="dataListLoading"
          style="width: 100%;"
          @selection-change="boxDataSelection"
        >
          <el-table-column type="selection" header-align="left" align="center" width="55"></el-table-column>
          <el-table-column type="index" header-align="center" align="center" width="80" label="序号"></el-table-column>
          <el-table-column prop header-align="center" align="center" label="所属镇街"></el-table-column>
          <el-table-column header-align="center" align="center" label="所属村居"></el-table-column>
          <el-table-column prop="name" header-align="center" align="center" label="岗亭名称"></el-table-column>
          <el-table-column prop="place" header-align="center" align="center" label="地址"></el-table-column>
          <el-table-column prop="responsible" header-align="center" align="center" label="责任人"></el-table-column>
          <el-table-column prop="phone" header-align="center" align="center" label="联系电话"></el-table-column>
          <el-table-column prop="carStatus" header-align="center" align="center" label="使用状态">
            <template slot-scope="scope">
              <span
                :class="(statusOptions.find(item => item.value == scope.row.status)).label == '待审核'?'yellowFont':
                (statusOptions.find(item => item.value == scope.row.status)).label=='已审核'?'greenFont':
                (statusOptions.find(item => item.value == scope.row.status)).label=='已驳回'?'redFont':'blackFont'"
              >{{ (statusOptions.find(item => item.value == scope.row.status)).label }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="200"
            label="操作"
          >
            <template slot-scope="scope">
              <div style="display:flex">
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '0'"
                  @click="baoshen(scope.row.id)"
                >报审</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '0'"
                  @click="addOrUpdateHandle(scope.row.id,'update')"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '1' || scope.row.status == '2'"
                  @click="addOrUpdateHandle(scope.row.id,'show')"
                >查看</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '3'"
                  @click="scope.row.id"
                >重新报审</el-button>
                <el-button size="small" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
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
      </el-tab-pane>
    </el-tabs>

    <!-- 新增修改 -->
    <resource-add-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getData"
      :tabType="activeName"
    ></resource-add-update>
  </div>
</template>

<script>
import ResourceAddUpdate from "./resource-add-update";
import { platformTreeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      totalCount: 0,
      waitCheckCount: 0,
      checkedCount: 0,
      rejectCount: 0,
      waitCommitCount: 0,
      carTableSelected: [],
      boxTableSelected: [],
      //能源状态下拉框
      sourceOptions: [],
      //能源类型
      sourceTypeOptions: [],
      //审核状态
      statusOptions: [],
      //镇街下拉框
      options: [],
      options2: [],
      //标签框
      activeName: "first",
      //车辆数据
      dataForm: {
        name: "",
        dateRange: [],
        carSource: ""
      },
      dataList: [],
      dataList2: [],
      //岗亭数据
      dataForm2: {
        value: "",
        value2: "",
        dateRange: [],
        name: ""
      },
      dataList2: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  components: {
    ResourceAddUpdate
  },
  mounted() {
    this.getCarSource();
    this.getCarSourceType();
    this.getCarSourceStatus();
    this.getCount();
    this.getDataList();
  },
  methods: {
    //获取镇街
    getOption() {
      this.options = [];
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/list`),
        method: "get",
        param: this.$http.adornParams({
          terminal: "0"
        })
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.townList.forEach(item => {
            this.options.push({ value: item.id, label: item.townName });
          });
          console.log("townList", data.townList, this.options);
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取村居
    getOption2() {
      this.options2 = [];
      console.log("111", this.dataForm2.value);
      this.$http({
        url: this.$http.adornUrl("/approve/approveBoxEntity/getVillage"),
        method: "get",
        params: this.$http.adornParams({
          id: this.dataForm2.value
        })
      }).then(({ data }) => {
        console.log("111111111111", data);
        if (data && data.code === 0) {
          data.village.forEach(item => {
            this.options2.push({ value: item.id, label: item.townName });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getData(val) {
      if (val == "1") {
        this.getDataList();
      }
      if (val == "2") {
        this.getDataList2();
      }
    },
    getDataList() {
      console.log("能源", this.sourceTypeOptions, this.statusOptions);
      this.$http({
        url: this.$http.adornUrl(`/approve/approveCarEntity/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.name,
          startTime: this.dataForm.dateRange[0],
          endTime: this.dataForm.dateRange[1],
          carSource: this.dataForm.carSource
        })
      }).then(({ data }) => {
        console.log("数据列表data", data);
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
    getDataList2() {
      this.$http({
        url: this.$http.adornUrl(`/approve/approveBoxEntity/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm2.name,
          startTime: this.dataForm2.dateRange[0],
          endTime: this.dataForm2.dateRange[1]
        })
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          this.dataList2 = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList2 = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    //删除
    deleteHandle(row) {
      var ids = row
        ? [row.id]
        : this.carTableSelected.map(item => {
            return item.id;
          });
      var checkedName = row
        ? [row.name]
        : this.carTableSelected.map(item => {
            return item.name;
          });
      this.$confirm(
        `确定对[${checkedName.join(",")}]进行[${
          row ? "删除" : "批量删除"
        }]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let url;
          if (this.activeName == "first") {
            url = "/approve/approveCarEntity/delete";
          }
          if (this.activeName == "second") {
            url = "/approve/approveBoxEntity/delete";
          }
          this.$http({
            url: this.$http.adornUrl(url),
            method: "post",
            data: this.$http.adornData({ ids })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  if (this.activeName == "first") {
                    this.getDataList();
                  }
                  if (this.activeName == "second") {
                    this.getDataList2();
                  }
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    baoshen(id) {
      let url;
      if (this.activeName == "first") {
        url = "/approve/approveCarEntity/updateStatus";
      }
      if (this.activeName == "second") {
        url = "/approve/approveBoxEntity/updateStatus";
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: "post",
        data: this.$http.adornData({
          id: id
        })
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          if (this.activeName == "first") {
            this.getDataList();
          }
          if (this.activeName == "second") {
            this.getDataList2();
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //表格多选
    carDataSelection(selection) {
      this.carTableSelected = selection;
    },
    //表格多选
    boxDataSelection(selection) {
      this.boxTableSelected = selection;
    },
    //查询数据
    searchResult() {
      this.pageIndex = 1;
      if (this.activeName == "first") {
        this.getDataList();
      }
      if (this.activeName == "second") {
        this.getDataList2();
      }
    },
    getCount() {
      let url;
      if (this.activeName == "first") {
        url = "/approve/approveCarEntity/count";
      }
      if (this.activeName == "second") {
        url = "/approve/approveBoxEntity/count";
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.totalCount = data.data.totalCount;
          this.waitCheckCount = data.data.waitCheckCount;
          this.checkedCount = data.data.checkedCount;
          this.rejectCount = data.data.rejectCount;
          this.waitCommitCount = data.data.waitCommitCount;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取能源类型
    getCarSource() {
      this.sourceOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_source`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.sourceOptions.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取使用状态
    getCarSourceType() {
      this.sourceTypeOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_type`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.sourceTypeOptions.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取审核状态
    getCarSourceStatus() {
      this.statusOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=approve_status`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.statusOptions.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    // 导入自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      // console.log('parma////////', param)
      let url;
      if (this.activeName == "first") {
        url = "/approve/approveCarEntity/xlsInput";
      }
      if (this.activeName == "second") {
        url = "/approve/approveBoxEntity/xlsInput";
      }
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(url),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (!data.code) {
            this.$message({
              message: "导入成功!",
              type: "success"
            });
            // this.dataForm.enclosure = data.filePath;
            // this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            // this.$emit('planData')
            if (this.activeName == "first") {
              this.getDataList();
            }
            if (this.activeName == "second") {
              this.getDataList2();
            }
          } else {
            if (this.activeName == "first") {
              this.$message.error("只支持导入巡查车辆文件");
            }
            if (this.activeName == "second") {
              this.$message.error("只支持导入群防岗亭文件");
            }
          }
        })
        .catch(err => {
          // alert(err)
        });
    },
    // 导出选中组数据
    exportSelectAll() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let checkedIds = [];
      if (this.activeName == "first") {
        if (this.carTableSelected.length < 1) {
          this.$message({
            message: "请选择数据进行导出",
            type: "warning"
          });
          return;
        }
        this.carTableSelected.forEach(item => checkedIds.push(item.id));
        // checkedIds = this.carTableSelected;
      }
      if (this.activeName == "second") {
        if (this.boxTableSelected.length < 1) {
          this.$message({
            message: "请选择数据进行导出",
            type: "warning"
          });
          return;
        }
        this.boxTableSelected.forEach(item => checkedIds.push(item.id));
      }

      let token = document.cookie;

      window.location.href = `${httpaddress}/approve/approveCarEntity/xlsOutputSelect?checkedIds=${checkedIds}
        &token=${Cookies.get("token")}`;
    },

    //导出所有搜索数据
    exportSearchAll() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      var checkedIds = [];
      //   if (this.buttonType == "0") {
      //     checkedIds = this.areaTreeIds;
      //   } else {
      //     checkedIds = this.groupTreeIds;
      //   }
      this.$http({
        url: this.$http.adornUrl(""),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.name,
          //period: this.dataForm.value,
          startTime: this.dataForm.dateRange[0],
          endTime: this.dataForm.dateRange[1]
        })
      }).then(({ data }) => {
        if (checkedIds.length < 1) {
          this.$message({
            message: "请选择相应分组进行导出",
            type: "warning"
          });
        } else if (data && data.code === 0) {
          let token = document.cookie;
          // console.log("this.deleteIds",this.deleteIds)
          // window.location.href = `${httpaddress}/investigation/investigationInfor/xlsOutputCondition?token=${Cookies.get("token")}`;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 新增 修改
    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type);
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
    //转换标签
    handleTabClick(tab, event) {
      this.activeName = tab.name;
      if (this.activeName == "second") {
        this.getDataList2();
        this.getCount();
        this.getOption();
      } else {
        this.getDataList();
        this.getCount();
      }
      //   console.log("11111111111111", tab, event);
    }
  }
};
</script>
<style lang="less" scoped>
.resourceManage {
  .yellowFont {
    font-family: "微软雅黑", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #f59a23;
  }
  .greenFont {
    font-family: "微软雅黑", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #70b603;
  }
  .redFont {
    font-family: "微软雅黑", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #d9001b;
  }
  .blackFont {
    font-family: "微软雅黑", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #555555;
  }
}
</style>
