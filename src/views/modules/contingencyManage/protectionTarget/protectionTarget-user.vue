<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      title="防护目标"
      :date-select="false"
      :search-setting="{
        width: '280px',
        placeholder: '请输入名称搜索',
      }"
      :import-data-config="isAuth('resoureteam:resoureteamgroup:xlsInput') ? {
        api:'/resoure/resoureProtectTarget/xlsInput'
      } : {}"
      :download-template-config="{api: '/resoure/resoureProtectTarget/gettemplate'}"
      :delete-selected-config="isAuth('resoure:resoureteam:delete') ? {
        api: '/resoure/resoureProtectTarget/delete'
      } : {}"
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
    >
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save')"
          type="primary"
          @click="addOrEditHandle('add')"
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
          header-align="center"
          align="center"
          width="170px"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view', 'edit', 'delete']"
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
  </div>
</template>

<script>
// 查看详情弹窗
import see from './protectionTarget-see.vue';
// 新增、修改详情弹窗
import addOrEdit from './protectionTarget-add-or-edit.vue';

const httpaddress = window.SITE_CONFIG.baseUrl;

export default {
  components: {
    see,
    addOrEdit,
  },
  data() {
    return {
      // 树形接口
      treeSetting: {
        api: '/resoure/resoureProtectGroup/listTree',
        edit: {},
      },
      // 表格数据接口
      tableRequest: {
        api: '/resoure/resoureProtectTarget/listByGroupId',
        params: {
          groupId: [],
          listType: '1',
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
    };
  },
  methods: {
    /**
     * @method
     * @desc 点击树形节点事件
     */
    handleNodeClick(obj) {
      function findChilden(data, list) {
        list.push(data.id);
        const { children } = data;
        // console.log(list)
        if (children != null) {
          children.forEach((item) => {
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
          if (response.data.code === 0) {
            // 提交成功后，刷新表格
            // this.$refs.template.getTableList(this.tableRequest)
            this.getDataList();
          } else {
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
  },
};
</script>
<style lang="less">

</style>
