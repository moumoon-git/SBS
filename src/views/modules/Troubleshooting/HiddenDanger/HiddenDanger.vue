<template>
  <!-- 车辆黑名单信息 -->
  <div class="mod-config">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select
          clearable
          placeholder="请选择区域"
          v-model="dataForm.townName"
          style="width:10vw;min-width:150px"
          class="searchMargin"
        >
          <el-option
            v-for="item in areaData"
            :key="item.townName"
            :label="item.townName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          clearable
          placeholder="请选择隐患状态"
          
          v-model="dataForm.status"
          style="width:10vw;min-width:180px"
          class="searchMargin"
        >
          <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          clearable
          placeholder="请选择人员类型"
          v-model="dataForm.type"
          style="width:10vw;min-width:180px"
          class="searchMargin"
        >
          <el-option v-for="item in humanType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <el-date-picker
          v-model="dataForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width:15vw;min-width:270px"
          class="searchMargin"
        ></el-date-picker>

        <el-input
          v-model="dataForm.key"
          placeholder="请输入地址、登记人员姓名"
          clearable
          style="width:11vw;min-width:180px"
          class="searchMargin"
        ></el-input>
        <el-button @click="getDataList()" class="searchMargin">查询</el-button>
        <!-- <el-button v-if="isAuth('risk:riskvehiclealarm:buttonStyle')" @click="addOrUpdateHandle()">发布任务</el-button> -->
        <el-button
          @click="outHandle"
          class="searchMargin"
          style="margin-left:0"
        >导出资料数据</el-button>
        <!-- <el-button v-if="isAuth('risk:riskvehiclealarm:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        <el-dropdown>
          <el-button class="searchMargin">导出答案数据</el-button>
          <el-dropdown-menu slot="dropdown" split-button="true">
            <el-dropdown-item @click.native="exportExcel()">导出勾选表格数据</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcelAll()">导出条件查询数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <div style="width:100%;position:relative;">
      <!-- <div style="width:15%;min-width:320px;display:inline-block;">
        <riskvehicleblacklistTree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
          :Treeexpansion="Treeexpansion"
        >
        </riskvehicleblacklistTree>
      </div>-->
      <div style="width: 100%;min-width: 540px;display:inline-block;">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;height:700px;"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
          <el-table-column
            prop="imName"
            header-align="center"
            align="center"
            label="姓名"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="nativePlaceString"
            header-align="center"
            align="center"
            label="籍贯"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="credentialsNum"
            header-align="center"
            align="center"
            label="身份证"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            header-align="center"
            align="center"
            label="联系方式"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="humanTypeString"
            header-align="center"
            align="center"
            label="人员类型"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="townNameString"
            header-align="center"
            align="center"
            label="所属区域"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="gmtCreate"
            header-align="center"
            align="center"
            label="排查时间"
          ></el-table-column>
          <el-table-column
            prop="investigateResultString"
            header-align="center"
            align="center"
            label="状态"
            width="120"
          >
            <template slot-scope="scope">
              <span :style="{color:scope.row.investigateResultString==='正常'?'#0BD295':'#F2B626'}">{{scope.row.investigateResultString}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
          <el-table-column
            header-align="center"
            align="center"
            width="120"
            label="操作"
          >
            <template slot-scope="scope">
              <div style="display: flex;" :style="{'justify-content':'center'}">
                <el-tooltip class="item" effect="dark" content="查看" placement="top">
                  <span class="see" @click="addOrUpdateHandle(scope.row.id,'查看')"></span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="margin-left:50%;transform: translateX(-50%);width:100%;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form :modal="treeForm" ref="treeForm">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="分组类型" size="large" label-width="100px">
           <el-select v-model="treeForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>-->
        <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            v-model="treeForm.groupingdescription"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="dialogtitle==='修改分组'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList()"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./HiddenDanger-add-or-update";
import riskvehicleblacklistTree from "./HiddenDanger-tree";
import Cookies from "js-cookie";
export default {
  name: "HiddenDanger",
  data() {
    return {
      dataForm: {
        key: "",
        time: "",
        status: "",
        type: "",
        townName: ""
      },
      areaData: [],
      statusData: [
        { name: "正常", id: 1 },
        { name: "异常", id: 2 }
      ],
      humanType: [
        { name: "持续在穗人员", id: 1 },
        { name: "外地返穗人员（非湖北）", id: 2 },
        { name: "湖北返穗人员（非武汉）", id: 3 },
        { name: "武汉返穗人员", id: 4 }
      ],
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },
      Treeexpansion: false,
      // 修改||查看分组弹出框
      dialogVisible: false,
      // 修改分组或者查看分组
      dialogtitle: "",
      treeForm: {
        // 分组名字
        currentTreename: "",
        // 分组描述
        groupingdescription: "",
        type: 0
      },
      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
      baseUrl: window.SITE_CONFIG["baseUrl"],
      platformId: this.$store.state.user.platformId
    };
  },
  components: {
    AddOrUpdate,
    riskvehicleblacklistTree
  },
  created() {
    this.handleEventType();
    this.getDataList();
    this.getAreaList();
  },
  methods: {
    // 获取任务类型
    handleEventType() {
      // this.$http({
      //   url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
      //   method: 'get',
      //   params: this.$http.adornParams({ typeFlag: 4})
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.typeData = data.list
      //   } else {
      //     this.$message.error(data.code)
      //   }
      // })
    },
    // 获取镇街列表
    getAreaList() {
      this.$http({
        url: this.$http.adornUrl("/wechatMobile/townList"),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.areaData = data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/epi/epiRegister/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.key,
          startTime: this.dataForm.time ? this.dataForm.time[0] : "",
          endTime: this.dataForm.time ? this.dataForm.time[1] : "",
          investigateResult: this.dataForm.status,
          humanType: this.dataForm.type,
          townName: this.dataForm.townName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log( data)
          this.dataList = data.data.records;

          if (this.dataList.length > 0) {
          this.dataList.map(v => {
            if (v.credentialsNum) {
              v.credentialsNum =
                v.credentialsNum.substring(0, 6) +
                "****" +
                v.credentialsNum.substring(
                  v.credentialsNum.length - 6,
                  v.credentialsNum.length
                );
            }
          });
        }

          this.totalPage = data.data.total;
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
    },
    // 新增 / 修改
    addOrUpdateHandle(HiddenDangerId) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })

      this.$router.push({
        path: "/HiddenDanger-add-or-update",
        name: "HiddenDanger-add-or-update",
        query: {
          HiddenDangerId: HiddenDangerId
        }
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      // console.log(ids)

      this.$confirm(
        `确定对该车辆黑名单进行${id ? "删除" : "批量删除"}操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/risk/riskvehicleblacklist/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      // console.log("handleNodeClick",obj)
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }

      // console.log('树形结点点击事件', obj)
      this.selectedNode = [];
      this.currentTreeObject = obj.id;
      this.treeForm.currentTreename = obj.name;
      this.search = "";
      // 分组描述
      this.treeForm.groupingdescription = obj.remark;
      this.treeForm.type = obj.type;
      this.currentTreeplatformId = obj.platformId;
      this.currentTreeparentId = obj.parentId;
      this.currentTreeancestors = obj.ancestors;
      this.currentTreeorderNum = obj.orderNum;

      findChilden(obj, (this.selectedNode = []));

      // console.log('selectedNode:' + this.selectedNode)
      // console.log(this.currentTreeObject)
      // console.log(this.treeForm.currentTreename)
      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl(`/risk/riskcamera/list`),
        method: "POST",
        data: this.$http.adornData({
          key: this.dataForm.key,
          cameraType: this.cameraType,
          limit: this.pageSize,
          page: 1,
          groupId: this.selectedNode
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.totalCount = data.data.totalCount;
          this.currPage = data.data.currPage;
          this.pageSize = data.data.pageSize;
          this.platShareMenuList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 查看分组
    showEventType() {
      this.dialogVisible = true;
      this.dialogtitle = "查看分组";
      this.groupingdisabled = true;
    },
    // 添加分组
    addEventType() {
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2); // 代表新增
      });
    },
    // 修改分组名称
    updateEventType(rows) {
      // console.log(this.treeForm.currentTreename)
      this.dialogVisible = true;
      this.dialogtitle = "修改分组";
      this.groupingdisabled = false;
    },

    // 删除分组
    deleteEventType(ids) {
      var that = this;
      this.$confirm(`确定对进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var checkedNames = "";
        if (that.checkedNodes.length > 0) {
          that.checkedNodes.forEach(item => {
            if (item.system === 1) {
              checkedNames += item.name;
            }
          });
        }

        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: "error",
              duration: 1500
            });
            return 0;
          }
          that
            .$http({
              url: that.$http.adornUrl(`/risk/riskcameragroup/delete`),
              method: "POST",
              data: this.$http.adornData({
                ids: that.checkedIds
              })
              // data: that.$http.adornData(id)
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500
                });
                that.getDataList();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error("分组名称不能为空");
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl(`/risk/riskcameragroup/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            parentId: this.currentTreeparentId,
            ancestors: this.currentTreeancestors,
            orderNum: this.currentTreeorderNum,
            remark: this.treeForm.groupingdescription
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            that.$message.error(data.msg);
          }
        });
      }
    },
    // 导出个人信息数据
    outHandle() {
      if (this.dataListSelections.length > 0) {
        let ids = this.dataListSelections.map(v => {
          return v.id;
        });
        window.location.href = `${this.baseUrl}/epi/epiRegister/output-excelOne?ids=${ids}`;
      } else {
        this.$message.warning("请勾选表格");
      }
    },
    // 导出勾选列表答案数据
    exportExcel() {
      // console.log(multipleSelection)
      if (this.dataListSelections.length > 0) {
        let ids = this.dataListSelections.map(v => {
          return v.id;
        });
        window.location.href = `${
          this.baseUrl
        }/epi/epiRegister/output-excelAnswer?ids=${ids}&token=${Cookies.get(
          "token"
        )}`;
      } else {
        this.$message.warning("请勾选表格");
      }
    },
    // 导出条件查询答案数据
    exportExcelAll() {
      window.location.href = `${
        this.baseUrl
      }/epi/epiRegister/output-excelAnswer?page=${this.pageIndex}&limit=${
        this.pageSize
      }&search=${this.dataForm.key}&investigateResult=${
        this.dataForm.status
      }&humanType=${this.dataForm.type}&townName=${
        this.dataForm.townName
      }&platformId=${this.platformId}&token=${Cookies.get(
        "token"
      )}&reportType=1&startTime=${
        this.dataForm.time ? this.dataForm.time[0] : ""
      }&endTime=${this.dataForm.time ? this.dataForm.time[1] : ""}`;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-date-editor .el-range-separator {
  padding: 0;
}
  .see{
    width:13.99px;
    height: 15.96px;
    cursor:pointer;
    background: url(../../../../assets/img/ElectronicPass/see.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .see:hover{
    width:13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/seeHover.png) no-repeat;
    background-size: 13.99px 15.96px;
  }
</style>
