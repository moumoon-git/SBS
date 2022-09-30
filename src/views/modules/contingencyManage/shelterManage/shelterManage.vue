<template>
  <div>
    <sv-template
      ref="template"
      :use-plat-form-all="true"
      :tree-setting="treeSetting"
      :table-request="tableRequest"
      title="避难场所"
      :date-select="false"
      :search-setting="{
        width: '200px',
        placeholder: '请输入场所名称搜索'
      }"
      :overload="{
        getTree,
      }"
      :export-select-config="isAuth('resoureteam:resoureteamtree:xlsOutput') ? {
        api: '/resoure/resourearea/xlsOutputSelect',
      } : {}"
      :export-query-config="isAuth('resoureteam:resoureteamtree:xlsOutput') ? {
        api: '/resoure/resourearea/export',
      } : {}"
      :import-data-config="isAuth('resoureteam:resoureteamgroup:xlsInput') && isPlatformRoot ? {
        api:'/resoure/resourearea/xlsImport',
        overload: handleAvatarSuccess,
      } : {}"
      :download-template-config="{api: '/resoure/resourearea/gettemplate'}"
      :delete-selected-config="isAuth('resoure:resoureteam:delete') && isPlatformRoot ? {
        api: '/resoure/resourearea/delete'
      } : {}"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
    >
      <template #grade__dropDown>
        <grade-dropDown
          :plat-show="true"
          :merge-node="true"
          @operationChange="operationChange"
        />
      </template>
      <template #middle__operation__select>
        <span />
      </template>
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save') && isPlatformRoot"
          type="primary"
          @click="addOrModifyHandle('add')"
        >
          新增
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          header-align="center"
          align="center"
          label="名称"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="地址"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.address" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="场所功能"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.feature" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="联系人"
        >
          <template slot-scope="scope">
            {{
              scope.row.contactorlist.length>0 ? scope.row.contactorlist.map(item => {
                if(item != null){
                  return item.name
                }else{
                  return ''
                }
              }).join(',') : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="联系人电话"
        >
          <template slot-scope="scope">
            {{
              scope.row.contactorlist.length>0 ? scope.row.contactorlist.map(item =>
                item ? item.mobile1 || item.phone || '' : ''
              ).join(',') : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="platformName"
          header-align="center"
          align="center"
          label="数据来源"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="170px"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="isPlatformRoot? [
                'view',
                'edit',
                'delete'
              ]: ['view']"
              @view="seeHandle(scope.row.id)"
              @edit="addOrModifyHandle('modify', scope.row.id)"
              @delete="
                deleteIds = [scope.row.id]
                $refs.delete_hint.visible = true
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>

    <!-- 查看详情弹窗 -->
    <see
      v-if="seeVisible"
      ref="see"
      @close="seeVisible = false"
    />
    <!-- 新增/修改详情弹窗 -->
    <add-or-modify
      ref="addOrModify"
      @refreshDataList="getDataList"
    />

    <!-- 删除提示弹窗 -->
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="handleDelete(deleteIds)"
    />
    <sv-dialog-hint
      ref="delete_fail"
      type="fail"
      text="抱歉！删除失败"
    />
    <importDataDialog
      ref="importDataDialogRef"
      :down-load-url="downLoadUrl"
      @reUpload="reUpload"
    />
  </div>
</template>

<script>
// import Cookies from 'js-cookie';
// 查看详情弹窗
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue'
import see from './shelterManage-see.vue';
// 新增、修改详情弹窗
import addOrModify from './shelterManage-add-or-modify.vue';
import GradeDropDown from '../../../common/GradeDropDown.vue';

export default {
  components: {
    see,
    addOrModify,
    GradeDropDown,
    importDataDialog,
  },
  data() {
    return {
      downLoadUrl: '/ser/resoure/resourearea/xlsOutputError',
      isPlatformRoot: true,
      treeForm: {
        id: '',
        parentId: '',
        ancestors: '',
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
      },
      // 树形接口
      treeSetting: {
        api: '/resoure/resourareatype/list',
        edit: this.isAuth('mail:mailgroup:delete') ? {
          add: '/resoure/resourareatype/save',
          update: '/resoure/resourareatype/update',
          delete: true,
        } : {},
        isPlatformRoot: true,
      },
      // 表格数据接口
      tableRequest: {
        api: '/resoure/resourearea/list',
        params: {
          areaTypeId: [],
          platformId: '',
          flag: false,
        },
      },
      deleteIds: [],
      seeOrUpdateVisible: false,
      addVisible: false,
      seeVisible: false,
      addOrModifyVisible: false,
    };
  },
  methods: {
    /**
     * 重新上传
     */
    reUpload() {
      this.$refs.template.reUpload();
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      console.log(response,'--------------------')
      if (response.data.errorData.length === 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
      } else if (response.data.errorData.length > 0) {
        this.$nextTick(() => {
          this.$refs.importDataDialogRef.open(response.data);
          // this.$refs.resourceImportError.init(response.data.data);
          // this.$refs.resourceImportError.tableColumn = this.errorTableColumn;
          // this.$refs.resourceImportError.tips = this.errorTips;
          // this.$refs.resourceImportError.required = this.errorRequired;
        });
      } else {
        this.$message.error({
          type: 'error',
          message: `${response.msg}`,
        });
      }
    },
    // 是否选择的是本平台
    operationChange(isPlatformRoot, platformId) {
      // 换平台的时候清空搜索字
      const that = this.$refs.template;
      that.treeKeyWord = '';
      that.keyword = '';
      // 换平台的时候分页重置
      that.paginationConfig.currentIndex = 1;
      that.paginationConfig.totalCount = 0;
      that.paginationConfig.pageSize = 10;
      // 本平台的一些按钮显隐
      if(isPlatformRoot) {
        this.treeSetting.edit = this.isAuth('mail:mailgroup:delete') ?{
          add: '/resoure/resourareatype/save',
          update: '/resoure/resourareatype/update',
          delete: true,
        }: {}
        this.treeSetting.isPlatformRoot = true
      }else {
        this.treeSetting.edit = false
        this.treeSetting.isPlatformRoot = false
      }
      this.isPlatformRoot = isPlatformRoot
      this.$refs.template.PlatName = false;
      if (platformId === -1) {
        this.$refs.template.PlatName = true;
        this.tableRequest.params.platformId = '';
        this.tableRequest.params.areaTypeId = [];
        this.tableRequest.params.flag = true;
        this.treeSetting.api = '/resoure/resourareatype/list';
        this.getTree();
        return;
      }
      // 请求数据参数
      this.tableRequest.params.flag = false;
      this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
      this.tableRequest.params.platformId = platformId
      this.tableRequest.params.areaTypeId = []
      this.treeSetting.api = `/resoure/resourareatype/list?platformId=${platformId}`
      new Promise((resolve, reject) => {
        this.getGroupTree()
        resolve()
      }).then(() => {
        // this.$refs.template.getTableList(this.tableRequest)
      })

    },
    /**
     * @description: 获得左侧平台的树结构
     */
    async getGroupTree() {
      const that = this.$refs.template;
      if (that) {
        that.tableLoading = true;
        const req = {
          method: 'get',
          url: this.treeSetting.api,
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            name: that.treeKeyWord,
          },
        };
        try {
          const response = await this.$http(req);
          if (response.data.code === 0) {
            that.treeList = [
              {
                id: 0,
                name: '全部',
                children: null,
              },
              ...response.data.data,
            ];
            this.$refs.template.getTreeAllValue();
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            throw Error(`代码${response.data.code}，${response.data.msg}`);
          }
        } catch (error) {
          this.$message.error(`获取组树失败！${error}`);
        } finally {
          that.tableLoading = false;
        }
      }
    },
    /**
     * @description: 获得左侧平台的树结构
     */
    async getTree() {
      const that = this.$refs.template;
      if (that) {
        if (this.tableRequest.params.platformId < 2) {
          that.tableLoading = true;
          const req = {
            method: 'get',
            url: this.treeSetting.api,
            baseURL: window.SITE_CONFIG.baseUrl,
            params: {
              name: that.treeKeyWord,
              flag: this.tableRequest.params.flag,
            },
          };
          try {
            const response = await this.$http(req);
            if (response.data.code === 0) {
              function findChilden(obj) {
                if (obj.platformName !== null && obj.platformName !== undefined) {
                  obj.name = obj.platformName;
                }
                const { children } = obj;
                if (children) {
                  children.forEach((item) => {
                    findChilden(item);
                  });
                }
              }
              [response.data.data].forEach((obj) => {
                findChilden(obj);
              });
              that.treeList = [
                {
                  id: 0,
                  name: '全部',
                  platformName: '全部',
                  platformTitle: '全部',
                  children: null,
                },
                response.data.data,
              ];
              this.$refs.template.getTreeAllValue();
              this.$refs.template.getTableList(this.tableRequest);
            } else {
              throw Error(`代码${response.data.code}，${response.data.msg}`);
            }
          } catch (error) {
            this.$message.error(`获取平台树失败！${error}`);
          } finally {
            that.tableLoading = false;
          }
        } else this.getGroupTree();
      }
    },
    /**
     * @description: 删除树分组
     * @param {*} deleteData 要删除的树节点
     * @return {*}
     */
    deleteEventType(deleteData) {
      const that = this;
      const arr = this.$refs.template.getTreeNodeChildren(deleteData.id);
      this.$http({
        url: this.$http.adornUrl('/resoure/resourearea/list'),
        method: 'post',
        data: this.$http.adornData({
          areaTypeId: arr,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.page.list.length > 0) {
            this.$alert('请先删除分组里的内容', '提醒', {
              confirmButtonText: '确定',
            });
            return;
          }
          this.$confirm('确定要进行[删除]操作?', '提示', {
            customClass: 'message-del',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            let checkedNames = '';
            if (arr.length > 0) {
              arr.forEach((item) => {
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
                    '/resoure/resourareatype/delete',
                  ),
                  method: 'post',
                  data: this.$http.adornData({
                    ids: arr,
                  }),
                })
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    that.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                    });
                    that.$refs.template.getTree();
                  } else {
                    that.$message.error(data.msg);
                  }
                });
              return 0;
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 点击树形节点事件
     * @param {Object} obj 点击的树节点
     * @return {*}
     */
    handleNodeClick(obj) {
      if (obj.platformName) { // 如果是平台
        // 换平台的时候清空搜索字
        const that = this.$refs.template;
        // that.treeKeyWord = '';
        that.keyword = '';
        // 换平台的时候分页重置
        that.paginationConfig.currentIndex = 1;
        that.paginationConfig.totalCount = 0;
        that.paginationConfig.pageSize = 10;
        // 相当于点击了组的全部
        this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
        this.tableRequest.params.platformId = obj.id;
        this.tableRequest.params.areaTypeId = [];
        if (obj.id === 0) {
          this.tableRequest.params.platformId = '';
          this.tableRequest.params.flag = true;
        } else {
          this.tableRequest.params.flag = false;
        }
        this.$refs.template.getTableList(this.tableRequest);
        return;
      } // 否则如果是点击分组的全部
      if (obj.id === 0) {
        this.tableRequest.params.areaTypeId = [];
        this.tableRequest.params.flag = false;
        this.$refs.template.getTableList(this.tableRequest);
        return;
      }
      //否则按原逻辑走
      this.tableRequest.params.platformId = obj.platformId;
      this.tableRequest.params.flag = false;
      function findChilden(treeObj, list) {
        if (treeObj.id) list.push(treeObj.id);
        const { children } = treeObj;
        if (children != null) {
          children.forEach((item) => {
            findChilden(item, list);
          });
        }
      }
      if (obj === null) { // 没有选择树节点，则显示全部数据
        this.selectedNode = [];
      } else {
        this.selectedNode = [];
        this.currentTreeObject = obj.id;
        this.treeForm.currentTreename = obj.name;
        this.search = '';
        // 分组描述
        this.treeForm.groupingdescription = obj.remark;
        this.treeForm.id = obj.id;
        this.treeForm.ancestors = obj.ancestors;
        this.treeForm.parentId = obj.parentId;
        this.treeForm.name = obj.name;
        this.currentTreeplatformId = obj.platformId;
        this.currentTreeparentId = obj.parentId;
        this.currentTreeancestors = obj.ancestors;

        findChilden(obj, (this.selectedNode = []));
        // 将所选树节点传到新增弹窗
        this.$refs.addOrModify.dataForm.areaTypeId = obj.id;
        this.$refs.addOrModify.dataForm.areaType = obj.name;
      }
      this.tableRequest.params.areaTypeId = this.selectedNode;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 打开查看表格数据弹窗
     * @param {Number} id 查看行的数据的id
     * @return {*}
     */
    seeHandle(id) {
      this.seeVisible = true;
      this.$nextTick(() => {
        this.$refs.see.init(id, this.tableRequest.params.platformId);
      });
    },
    /**
     * @description 打开新增/修改分类点弹窗
     * @param {String} type 弹窗类型：add新增、modify编辑
     * @param {Number} id 编辑时该行的数据的id
     */
    addOrModifyHandle(type, id) {
      this.addOrModifyVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrModify.init(type, id);
      });
    },
    /**
     * @method
     * @desc 获取数据列表
     */
    getDataList() {
      // this.dataListLoading = true;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @method
     * @desc 点击树形，获取表格数据
     */
    handleTreeClick(obj) {
      this.tableRequest.params.groupIds = obj ? `${obj.id}` : '';
      this.getDataList();
    },
    /**
     * @method
     * @desc 删除数据
     * @param 需要删除的数据的id数组
     */
    handleDelete(ids) {
      const request = {
        method: 'post',
        url: '/resoure/resourearea/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            // 提交成功后，刷新表格
            this.getDataList();
            // this.$refs.template.getTableList(this.tableRequest)
          } else {
            window.console.log('删除失败！错误信息：【\n', response, '\n】');
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          window.console.log('删除失败！错误信息：【\n', error, '\n】');
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
  },
};
</script>

<style lang="scss">
</style>
