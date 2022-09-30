<template>
  <div class="mod-task">
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      title="任务管理"
      :export-select-config="{
        api: '/investigation/investigationTask/xlsOutputSelect',
      }"
      :export-query-config="{
        api: '/investigation/investigationTask/xlsOutputCondition',
        params: { teamIds: [] },
      }"
      :delete-selected-config="{
        api: '/investigation/investigationTask/delete',
      }"
      :date-select="false"
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
    >
      <template #middle__operation__select>
        <sv-select
          v-model="dataForm.value"
          clearable
          placeholder="巡查周期"
          :options="options"
          @change="getDataList"
        />
      </template>

      <template #middle__operation__button>
        <!-- 发布按钮 -->
        <sv-button
          v-if="isAuth('sys:role:save')"
          type="primary"
          @click="addOrUpdateHandle(null,'add')"
        >
          新增任务
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          v-if="boxVisible"
          type="selection"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="任务名称"
        />
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="巡查说明"
        />
        <el-table-column
          prop="patrolDepString"
          header-align="center"
          align="center"
          label="巡查部门"
        />
        <el-table-column
          prop="patrolContactorString"
          header-align="center"
          align="center"
          label="巡查负责人"
        />
        <el-table-column
          prop="handleDepString"
          header-align="center"
          align="center"
          label="处置部门"
        />
        <el-table-column
          prop="handleContactorString"
          header-align="center"
          align="center"
          label="处置负责人"
        />
        <el-table-column
          prop="period"
          header-align="center"
          align="center"
          label="检查周期"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.period == '1'">每天</span>
            <span v-if="scope.row.period == '2'">每周</span>
            <span v-if="scope.row.period == '3'">每月</span>
            <span v-if="scope.row.period == '4'">每年</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">
              <p style="margin-bottom:0px">
                <span style="color:#F66E6E">已停用</span>
              </p>
            </div>
            <div v-if="scope.row.status == 0">
              <p style="margin-bottom:0px">
                <span style="margin-bottom:0px;color:#0BD295">已启用</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="260"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="scope.row.status == 1 ?[
                'view',
                'start',
                'qrcode',
                'edit',
                'delete'
              ]: [
                'view',
                'stop',
                'qrcode',
                'edit',
                'delete'
              ]"
              @delete="
                deleteTreeIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
              @view="addOrUpdateHandle(scope.row.id,'show')"
              @start="updateStatus(scope.row, 0)"
              @stop="updateStatus(scope.row,1)"
              @qrcode="showCode(scope.row)"
              @edit="addOrUpdateHandle(scope.row.id,'update')"
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <el-dialog
      :visible.sync="codeVisible"
      width="20%"
      @close="handleDialogClose"
    >
      <img
        :src="codeUrl"
        style="margin-top: -60px;margin-bottom: -30px;margin-left: -20px;width: 384px;min-height:384px;"
      >
      <el-button size="mini" style="position: absolute;top: 87%;left: 37%;" @click="saveCode">保存二维码</el-button>
    </el-dialog>
    <!--树状，新增修改 -->
    <tree-add-or-update
      v-if="groupTreeCrudVisible"
      ref="groupTreeCrud"
      @refreshGroupDataList="getTreeList"
      @close="groupTreeCrudVisible=false"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :current-node="currentNode"
      @refreshDataList="getDataList"
    />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteHandle(deleteTreeIds)"
    />
  </div>
</template>

<script>
import AddOrUpdate from "./task-add-or-update";
import TaskTree from "./task-tree";
import TreeAddOrUpdate from "./taskTree-addOrUpdate";
import { platformTreeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
import { get } from "@/utils/downFiles";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      isFocus: false,
      boxVisible: false,
      // fullscreenLoading: false,
      // 获取到的token
      documenttoken: `${httpaddress}/mail/mailgroup/xlsInput?token=${this.$cookie.get(
        'token'
      )}`,
      isAdd: true, // 是否显示搜索框右边增加按钮
      // documenttoken: `${httpaddress}/mail/mailgroup/loading?${this.$cookie.get('token')}`,
      fileList: [],
      filename: '',
      // 上传文件的文件名
      uploadfilesname: '',
      options: [
        {
          value: '',
          label: '全部周期',
        },
        {
          value: '1',
          label: '每天',
        },
        {
          value: '2',
          label: '每周',
        },
        {
          value: '3',
          label: '每月',
        },
        {
          value: '4',
          label: '每年',
        },
      ],
      //搜索树
      searchTreeName: '',
      dataForm: {
        value: '',
        name: '',
      },
      currentNode:'',
      groupIds: [],
      groupName:'',
      deleteIds: [],
      treeId: '',
      taskList: [],
      taskProps: {
        label: 'name',
        children: 'children',
      },
      codeUrl: '',
      codeId: '',
      codeVisible: false,
      buttonVisible: true,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      //表格勾选数据
      dataListSelections: [],
      addOrUpdateVisible: false,
      //树状新增显示
      groupTreeCrudVisible: false,
      // 树形勾选框选中的id
      checkedIds: [],
      checkedNodes: [],
      Treeexpansion: false,
      // 列表复选框选中的值
      selectionData: [],
      // 列表复选框选中的值
      selectionIds: [],
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: '/investigation/investigationTaskGroup/listTree', // 查找树接口
        edit: {
          add: '/investigation/investigationTaskGroup/save',
          update: '/investigation/investigationTaskGroup/update',
          delete: true,
        },
        isPlatformRoot: true,
      },
      tableRequest: {
        api: '/investigation/investigationTask/list',
        params: {
          period: '',
        },
      },
    };
  },
  components: {
    AddOrUpdate,
    TaskTree,
    TreeAddOrUpdate,
  },
  mounted() {
    this.getTreeList();
    this.getDataList();
  },
  methods: {
    // 选择数据导出
    exportSelectAll() {
      this.$http({
        url: this.$http.adornUrl(
          '/investigation/investigationTask/xlsOutputSelect'
        ),
        method: 'post',
        data: this.$http.adornData({
          checkedIds: this.selectionIds,
        }),
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        if (this.selectionIds.length < 1) {
          this.$message({
            message: '请选择相应数据进行导出',
            type: 'warning',
          });
          return;
        }
        if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), '导出数据.xls')
        }else{
          let a = document.createElement('a')
        a.href = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
        a.download = '导出数据.xls'
        document.body.appendChild(a)   // 兼容Firefox浏览器
        a.click()
        a.remove()
        }
      }).catch((err)=>{
        this.$message.error(data.msg);
      })
    },

    //查询分组导出
    exportSearchAll() {
      console.log(this.checkedIds);
      // if(this.checkedIds.length == 1 && this.checkedIds[0] == 0){
      //   this.checkedIds = [];
      // }
        this.$http({
        url: this.$http.adornUrl(
          '/investigation/investigationTask/xlsOutputCondition'
        ),
        method: 'post',
        data: this.$http.adornData({
          checkedIds: this.checkedIds,
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.name,
          period: this.dataForm.value,
        }),
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        if (this.checkedIds.length < 1) {
          this.$message({
            message: '请选择相应分组进行导出',
            type: 'warning',
          });
          return;
        } 
        if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), '导出数据.xls')
        }else{
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
        a.download = '导出数据.xls'
        document.body.appendChild(a)   // 兼容Firefox浏览器
        a.click()
        a.remove()
        }
      }).catch((err)=>{
        this.$message.error(data.msg);
      })
    },

    //导出模板
    exportgetter() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie;
      let exportEx = this.currentTreeObject;
      // console.log('tokentoken',Cookies.get('token'),httpaddress)
      // console.log(
      //   `${httpaddress}//mail/mailgroup/gettemplate?gId=${exportEx}&token=${this.$cookie.get('token')}`
      // )
      // window.open(`${httpaddress}/mail/mailgroup/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`)
      window.location.href = `${httpaddress}/investigation/investigationTask/gettemplate?gId=${exportEx}&token=${Cookies.get(
        'token'
      )}`;
    },

    //获取树形数据
    getTreeList() {
      this.$refs.template.getTree();
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.tableRequest.params.period = this.dataForm.value;
      this.tableRequest.params.groupIds = this.deleteIds;
      this.$refs.template.getTableList(this.tableRequest);
      // this.$http({
      //   url: this.$http.adornUrl(`/investigation/investigationTask/list`),
      //   method: 'post',
      //   data: this.$http.adornData({
      //     groupIds: this.deleteIds,
      //     search: this.dataForm.name,
      //     period: this.dataForm.value,
      //     page: this.pageIndex,
      //     limit: this.pageSize,
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.page.list;
      //     this.totalPage = data.page.totalCount;
      //   } else {
      //     this.dataList = [];
      //     this.totalPage = 0;
      //     this.$message.error(data.msg);
      //   }
      //   this.dataListLoading = false;
      // });
    },
    getChildren(data) {
      console.log('222222222222222children', data);
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.deleteIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
        });
      }
    },
    getAll() {
      this.deleteIds = [];
      this.getDataList();
    },
    handleNodeClick(obj) {
      if (!obj) {
        this.groupIds = [];
        this.deleteIds = [];
        this.getDataList();
        return;
      }
      this.currentNode = obj;
      console.log('点击节点', obj);
      this.groupIds = [];
      this.deleteIds = [];
      this.groupName =''
      this.pageIndex = 1;
      this.currentTreeObject = obj.id;
      if (obj.id == 0) {
        this.groupIds = [];
        this.deleteIds = [];
      } else {
        this.groupIds = [obj.id];
        this.deleteIds = [obj.id];
        this.groupName = [obj.name];
      }
      if (obj.children != null ) {
        this.getChildren(obj.children);
      }
      console.log('数组ID', this.deleteIds);
      this.treeId = obj.id;
      this.getDataList();
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    //搜索树形
    searchTree(name) {
      this.searchTreeName = name;
      this.getTreeList();
    },
    // 添加树形
    addEventType() {
      this.groupTreeCrudVisible = true;
      this.$nextTick(() => {
        this.$refs.groupTreeCrud.init(null, this.currentNode, 2); // 代表新增
      });
    },
    // 修改树形
    updateEventType(rows) {
      this.groupTreeCrudVisible = true;
      this.$nextTick(() => {
        this.$refs.groupTreeCrud.init(this.treeId, this.currentNode, 3); // 代表修改
      });
    },

    // 删除树形
    deleteEventType(data) {
      var that = this;
      // if (that.checkedIds == "") {
      //   that.checkedIds = ids;
      //   console.log("aaaaaaaaaaaaaa", this.checkedIds);
      // }
      if (data.children && data.children.length > 0) {
        this.$alert('请先删除分组里的内容', '提醒', {
          confirmButtonText: '确定',
        });
        return;
      }
      this.$confirm(`确定要进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        var checkedNames = '';
        if (that.groupIds.length > 0) {
          that.groupIds.forEach((item) => {
            if (item.system === 1) {
              checkedNames += item.name;
            }
          });
        }
        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: 'error',
              duration: 1500,
            });
            return 0;
          }
          that
            .$http({
              url: that.$http.adornUrl(
                `/investigation/investigationTaskGroup/delete`
              ),
              method: 'post',
              data: this.$http.adornData({
                ids: [data.id],
              }),
              // data: that.$http.adornData(id)
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                });
                that.getTreeList();
                this.currentNode='';
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    // 修改状态
    updateStatus(row, status) {
      let id = row.id;
      console.log('row', row);
      this.$http({
        url: this.$http.adornUrl(
          `/investigation/investigationTask/updateStatus`
        ),
        method: 'post',
        data: this.$http.adornData({
          id: id,
          status: status,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
          });
          // 将图标初始化
          if (this.selectionData) {
            this.selectionData = [];
          }
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 查询
    searchResult() {
      this.pageIndex = 1;
      this.getDataList();
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
    /**
     * @description 关闭显示二维码的弹窗
     */
    handleDialogClose() {
      this.codeUrl = '';
    },
    //显示二维码
    showCode(row) {
      // 注释原因：3.0的业务说不用这么搞了
      // this.codeId = id;
      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/investigation/investigationTask/output-taskUrCode`
      //   ),
      //   method: "get",
      //   responseType: "arraybuffer",
      //   params: this.$http.adornParams({
      //     id: this.codeId,
      //   }),
      // })
      //   .then((res) => {
      //     console.log(res);
      //     return (
      //       "data:image/png;base64," +
      //       btoa(
      //         new Uint8Array(res.data).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ""
      //         )
      //       )
      //     );
      //   })
      //   .then((data) => {
      //     // console.log("二维码", data);
      //     this.codeUrl = data;
      //   });
      this.codeUrl = window.SITE_CONFIG['cloudUrl'] + row.qrCode;
      this.codeVisible = true;
    },
    //保存二维码
    saveCode() {
      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/investigation/investigationTask/output-taskUrCode`
      //   ),
      //   method: "get",
      //   responseType: "arraybuffer",
      //   params: this.$http.adornParams({
      //     id: this.codeId,
      //   }),
      // })
      //   .then((res) => {
      //     console.log(res);
      //     return (
      //       "data:image/png;base64," +
      //       btoa(
      //         new Uint8Array(res.data).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ""
      //         )
      //       )
      //     );
      //   })
      //   .then((data) => {
      //     // console.log("二维码", data);
      //     this.codeUrl = data;
      //   });
      // this.codeVisible = false;
      get(
        window.SITE_CONFIG['baseUrl'] +
          `/investigation/investigationTask/output-taskUrCode`,
        { id: this.codeId }
      );
    },
    // 新增 / 修改
    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.selectionIds;
      this.$http({
        url: this.$http.adornUrl('/investigation/investigationTask/delete'),
        method: 'post',
        data: this.$http.adornData({
          ids: ids,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取预案列表
    getContingencyPlan(selectedNode) {
      // this.$http({
      //   url: this.$http.adornUrl(`/incidentplan/rpIncidentPlan/list`),
      //   method: "get",
      //   params: this.$http.adornParams({
      //     groupId: selectedNode.toString()
      //   })
      // }).then(({ data }) => {
      //   // console.log(data)
      //   if (data && data.code == 0) {
      //     this.platShareMenuList = data.data;
      //     //
      //     // if (data.data.length>0) {
      //     bus.$emit(
      //       "showDetail",
      //       this.platShareMenuList.length > 0
      //         ? this.platShareMenuList[0].id
      //         : ""
      //     );
      //     // }
      //   } else {
      //     this.platShareMenuList = [];
      //     this.$message.error(data.msg);
      //   }
      // });
    },
  },
};
</script>
<style lang="less" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.mod-task {
  height: calc(100vh - 112px);

  display: flex;
  background: #F4F4F4;
  //弹窗样式
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border: 1px solid #dcdfe6;
  }
}
</style>
