<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :table-request="tableRequest"
      title="避难场所"
      :date-select="false"
      :search-setting="{
        width: '200px',
        placeholder: '请输入场所名称搜索'
      }"
      :import-data-config="isAuth('resoureteam:resoureteamgroup:xlsInput') ? {
        api:'/resoure/resourearea/xlsImport'
      } : {}"
      :download-template-config="{api: '/resoure/resourearea/gettemplate'}"
      :delete-selected-config="isAuth('resoure:resoureteam:delete') ? {
        api: '/resoure/resourearea/delete'
      } : {}"
      @tree-click="handleNodeClick"
    >
      <template #middle__operation__select>
        <span />
      </template>
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save')"
          type="primary"
          @click="addOrModifyHandle('add')"
        >
          新增避难场所
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          header-align="center"
          align="center"
          label="场所名称"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="所在区域"
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
              scope.row.contactorlist.length>0 ? scope.row.contactorlist.map(item => {
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
          label="操作"
          width="170px"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view', 'edit', 'delete']"
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
  </div>
</template>

<script>
// import Cookies from 'js-cookie';
// 查看详情弹窗
import see from './shelterManage-see.vue';
// 新增、修改详情弹窗
import addOrModify from './shelterManage-add-or-modify.vue';

export default {
  components: {
    see,
    addOrModify,
  },
  data() {
    return {
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
        edit: {},
      },
      // 表格数据接口
      tableRequest: {
        api: '/resoure/resourearea/list',
        params: {
          areaTypeId: [],
          listType: '1',
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
      function findChilden(treeObj, list) {
        list.push(treeObj.id);
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
        this.$refs.see.init(id);
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
