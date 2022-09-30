<template>
  <div>
    <sv-template
      ref="template"
      :use-plat-form-all="true"
      :tree-setting="treeSetting"
      title="防护目标"
      :date-select="false"
      :search-setting="{
        width: '280px',
        placeholder: '请输入名称搜索',
      }"
      :overload="{
        getTree,
      }"
      :export-select-config="isAuth('resoureteam:resoureteamtree:xlsOutput') ? {
        api: '/resoure/resoureProtectTarget/xlsOutputSelect',
      } : {}"
      :export-query-config="isAuth('resoureteam:resoureteamtree:xlsOutput') ? {
        api: '/resoure/resoureProtectTarget/xlsOutput',
      } : {}"
      :import-data-config="isAuth('resoureteam:resoureteamgroup:xlsInput') && isPlatformRoot ? {
        api:'/resoure/resoureProtectTarget/xlsInput',
        overload: handleAvatarSuccess,
      } : {}"
      :download-template-config="{api: '/resoure/resoureProtectTarget/gettemplate'}"
      :delete-selected-config="isAuth('resoure:resoureteam:delete') && isPlatformRoot ? {
        api: '/resoure/resoureProtectTarget/delete'
      } : {}"
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
      @get-tree-data="getTreeData"
    >
      <template #grade__dropDown>
        <grade-dropDown
          :plat-show="true"
          :merge-node="true"
          @operationChange="operationChange"
        />
      </template>
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save') && isPlatformRoot"
          type="primary"
          @click="addOrEditHandle('add', '')"
        >
          新增
        </sv-button>
      </template>

      <template #middle__table>
        <el-table-column
          header-align="center"
          align="center"
          label="名称"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.name" />
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          label="地址"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.location" />
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          label="主体单位"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.chargeUnit" />
          </template>
        </el-table-column>
        <!-- <el-table-column
          header-align="center"
          align="center"
          label="分组信息"  :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <sv-table-tooltip
              :content="groupData.filter((el) => el.id == scope.row.protectType).length > 0 ?
                groupData.filter((el) => el.id == scope.row.protectType)[0].name : ''"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          header-align="center"
          align="center"
          label="联系人"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{
              scope.row.contactsList.length>0 ? scope.row.contactsList.map(item => {
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
          label="联系电话"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{
              scope.row.contactsList.length>0 ? scope.row.contactsList.map(item => {
                if(item != null){
                  return item.mobile1
                }else{
                  return ''
                }
              }).join(',') : ''
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
          width="170px"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="isPlatformRoot? [
                'view',
                'edit',
                'delete'
              ]: ['view']"
              @view="seeHandle(scope.row.id)"
              @edit="addOrEditHandle('edit', scope.row.id)"
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
    <add-or-edit
      ref="addOrEdit"
      @refresh="getDataList"
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
    <Resource-importError
      ref="resourceImportError"
    />
    <importDataDialog
      ref="importDataDialogRef"
      :down-load-url="downLoadUrl"
      @reUpload="reUpload"
    />
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import Cookies from 'js-cookie';
import axios from 'axios';
// 查看详情弹窗
import see from './protectionTarget-see';
// 新增、修改详情弹窗
import addOrEdit from './protectionTarget-add-or-edit';
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue'

const token = document.cookie;
const httpaddress = window.SITE_CONFIG.baseUrl;
import ResourceImportError from '../../resource/equipmentImportError.vue';
import GradeDropDown from '../../../common/GradeDropDown.vue';
export default {
  components: {
    see,
    addOrEdit,
    ResourceImportError,
    GradeDropDown,
    importDataDialog,
  },
  data() {
    return {
      // 下载错误信息
      downLoadUrl: '/ser/resoure/resoureProtectTarget/xlsOutputError',
      isPlatformRoot: true,
      // 树形接口
      treeSetting: {
        api: '/resoure/resoureProtectGroup/listTree',
        edit: this.isAuth('mail:mailgroup:delete') ? {
          add: '/resoure/resoureProtectGroup/save',
          update: '/resoure/resoureProtectGroup/update',
          delete: true,
          // delete: '/resoure/resoureriskreasongroup/delete'
        } : {},
        isPlatformRoot: true,
      },
      // 表格数据接口
      tableRequest: {
        api: '/resoure/resoureProtectTarget/listByGroupId',
        params: {
          groupId: [],
          platformId: '',
          flag: false,
        },
      },

      selectedNode: [],
      fileList: [],
      // 获取到的token
      documenttoken: `${httpaddress}/resoure/resoureProtectTarget/xlsInput?token=${this.$cookie.get(
        'token',
      )}`,
      filename: '',
      // 上传文件的文件名
      uploadfilesname: '',
      // 树形勾选框选中的id
      checkedIds: [],
      dialogVisible: false,
      dialogtitle: '',
      groupingdisabled: false,
      treeForm: {
        id: '',
        parentId: '',
        ancestors: '',
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
      },
      // 表格
      platShareMenuList: [],
      Treeexpansion: false,
      dataForm: {
        key: '',
      },
      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: 'children',
        label: 'name',
      },
      dataList: [],
      pageIndex: 1,
      totalCount: 0,
      pageSize: 20,
      dataListLoading: false,
      dataListSelections: [],
      addVisible: false,
      seeOrUpdateVisible: false,
      seeVisible: false,
      addOrEdit: false,
      // 队伍类型Visible
      resoureteamtreeCrudVisible: false,
      groupData: [], // 分组信息
      // 导入错误提示表头
      errorTableColumn: [
        {
          prop: 'id',
          label: '序号',
        },
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'protectClassName',
          label: '防护目标类型',
          width: 120,
        },
        {
          prop: 'location',
          label: '地址',
          width: 130,
        },
        {
          prop: 'level',
          label: '等级',
        },
        {
          prop: 'areaSize',
          label: '面积',
        },
        {
          prop: 'nowNumber',
          label: '当前人数',
        },
        {
          prop: 'canuseNumber',
          label: '可容纳人数',
        },
        {
          prop: 'protectLevel',
          label: '防护等级',
        },
      ],
      // 导入错误底部提示信息s
      errorTips: [
        '1、不能在该Excel表中对防护目标进行删除或修改；',
        '2、Excel中红色字段为必填字段,黑色字段为选填字段，字段值里请不要填入特殊字符；',
        '3、防护目标类型：上下级类型间用‘/’隔开，且从最上级类型开始，例如"防护用品类/消防/防火服"。类型字段长度不能超过32个字符；',
        '4、若导入的数据中拥有与防护目标类型中已存在的类型名相同的类型，将会自动与类型关联，若导入的防护目标类型名称在系统中不存在，系统将自动创建该类型。',
        '5、日期填写格式:年/月/日',
        '6、手机号码：请直接输入手机号码，系统将自动匹配号码相同的专家，若导入的号码在系统中不存在，系统将根据已填写的信息自动新增该专家。',
      ],
      // 导入错误表格必填项
      errorRequired: ['姓名', '防护目标类型'],
      // 等级匹配数组
      level: ['国家级', '省级', '市级', '县级', '乡镇级', '其他'],
      // 防护等级匹配数组
      protectLevel: ['特别重要防护', '重要防护', '较高防护', '一般防护'],
    };
  },
  methods: {
    /**
     * 重新上传
     */
    reUpload() {
      this.$refs.template.reUpload();
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
          add: '/resoure/resoureProtectGroup/save',
          update: '/resoure/resoureProtectGroup/update',
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
        this.tableRequest.params.platformId = null;
        this.tableRequest.params.flag = true;
        this.tableRequest.params.groupId = [];
        this.treeSetting.api = '/resoure/resoureProtectGroup/listTree';
        this.getTree();
        return;
      }
      // 请求数据参数
      this.tableRequest.params.flag = false;
      this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
      this.tableRequest.params.platformId = platformId
      this.tableRequest.params.groupId = []
      this.treeSetting.api = `/resoure/resoureProtectGroup/listTree?platformId=${platformId}`
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
     * @description 获取分组信息
     */
    getTreeData(data) {
      this.groupData = data;
    },
    /**
     * @method
     * @desc 点击树形节点事件
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
        this.tableRequest.params.groupId = []
        if (obj.id === 0) {
          this.tableRequest.params.platformId = null;
          this.tableRequest.params.flag = true;
        } else {
          this.tableRequest.params.flag = false;
        }
        this.$refs.template.getTableList(this.tableRequest);
        return;
      } // 否则如果是点击分组的全部
      if (obj.id === 0) {
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.flag = false;
        this.$refs.template.getTableList(this.tableRequest);
        return;
      }
      // 否则按原逻辑走
      this.tableRequest.params.flag = false;
      this.tableRequest.params.platformId = obj.platformId;
      function findChilden(obj, list) {
        if (obj.id) list.push(obj.id);
        const { children } = obj;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }

      // console.log("树形结点点击事件", obj);
      if (obj == null) {
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
        this.$refs.addOrEdit.dataForm.protectType = obj.id.toString();
        this.$refs.addOrEdit.dataForm.protectTypeParentName = obj.name;
        console.log('obj.id.toString(),obj.name', obj.id.toString(), obj.name);
      }
      this.tableRequest.params.groupId = this.selectedNode;
      this.getDataList();
      // this.$refs.template.getTableList(this.tableRequest)
    },

    /**
     * @method
     * @desc 获取数据列表
     */
    getDataList() {
      this.$refs.template.getTableList(this.tableRequest);
    },

    /**
     * @description: 打开新增/修改表格数据弹窗
     * @param {String} type  弹窗类型：add新增、edit修改
     * @param {Number} id 修改时该行的数据的id
     * @return {*}
     */
    addOrEditHandle(type, id) {
      this.addOrEditVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrEdit.init(type, id);
      });
    },
    /**
     * @description: 打开查看表格数据弹窗
     * @param {Number} id 查看行的数据的id
     * @return {*}
     */
    seeHandle(id) {
      this.seeVisible = true;
      this.$nextTick(() => {
        this.$refs.see.init(id);
      });
    },
    /**
     * @description: 删除树分组
     * @param {*} data 要删除的树节点
     * @return {*}
     */
    deleteEventType(data) {
      const that = this;
      const arr = this.$refs.template.getTreeNodeChildren(data.id);
      console.log('this.$refs.template.getTreeNodeChildren(data.id)', this.$refs.template.getTreeNodeChildren(data.id));
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureProtectTarget/listByGroupId'),
        method: 'post',
        data: this.$http.adornData({
          groupId: arr,
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
                    '/resoure/resoureProtectGroup/delete',
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
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    /**
     * @method
     * @desc 删除数据
     * @param 需要删除的数据的id数组
     */
    handleDelete(ids) {
      console.log('ids类型', typeof ids);
      const request = {
        method: 'post',
        url: '/resoure/resoureProtectTarget/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code == 0) {
            // 提交成功后，刷新表格
            // this.$refs.template.getTableList(this.tableRequest)
            this.getDataList();
          } else {
            console.log('删除失败！错误信息：【\n', response, '\n】');
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          console.log('删除失败！错误信息：【\n', error, '\n】');
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      if (response.data.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
      } else if (response.data.errorData.length > 0) {
        this.$refs.importDataDialogRef.open(response.data);
        // let errorData = response.data.data;
        // for (let i = 0; i < errorData.length; i += 1) {
        //   errorData[i].protectLevel = errorData[i].protectLevel ? this.protectLevel[parseInt(errorData[i].protectLevel, 10) - 1] : '';
        //   errorData[i].level = errorData[i].level ? this.level[parseInt(errorData[i].level, 10)] : '';
        // }
        // this.$nextTick(() => {
        //   this.$refs.resourceImportError.init(errorData);
        //   this.$refs.resourceImportError.tableColumn = this.errorTableColumn;
        //   this.$refs.resourceImportError.tips = this.errorTips;
        //   this.$refs.resourceImportError.required = this.errorRequired;
        // });
      } else {
        this.$message.error({
          type: 'error',
          message: `${response.msg}`,
        });
      }
    },
  },
};
</script>
<style lang="less">

</style>
