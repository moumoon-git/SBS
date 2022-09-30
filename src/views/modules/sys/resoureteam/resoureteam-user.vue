<!--
 * @Author: your name
 * @Date: 2021-02-05 08:47:30
 * @LastEditTime: 2021-02-05 10:09:47
 * @LastEditors: Please set LastEditors
 * @Description: 主要修改了页面布局，函数大部分复用之前的，需要的修改的函数或者字段已作出相应修改
 * @FilePath: \product_SBS\src\views\modules\sys\resoureteam\resoureteam-user.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      title="应急队伍"
      :date-select="false"
      :search-setting="{
        width: '200',
        placeholder: '请输入队伍名称搜索',
      }"
      :import-data-config="
        isAuth('resoureteam:resoureteamgroup:xlsInput')
          ? {
            api: 'resoure/resoureteam/xlsInput',
          }
          : {}
      "
      :download-template-config="{
        api: '/resoure/resoureteam/gettemplate',
      }"
      :delete-selected-config="
        isAuth('resoure:resoureteam:delete')
          ? { api: '/resoure/resoureteam/delete' }
          : {}
      "
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
    >
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save')"
          type="primary"
          @click="addNewResoureteam('add')"
        >
          新增
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="队伍名称"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="peopleNumber"
          header-align="center"
          align="center"
          label="队伍人数"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="creationTime"
          header-align="center"
          align="center"
          label="成立时间"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="nature"
          header-align="center"
          align="center"
          label="性质"
          :formatter="ifendcase"
        />

        <el-table-column
          prop="duties"
          header-align="center"
          align="center"
          label="主要职责"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="fax"
          header-align="center"
          align="center"
          label="传真"
        />

        <el-table-column
          prop="telephoneNum"
          header-align="center"
          align="center"
          label="电话"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="地址"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          header-align="center"
          align="center"
          width="260"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view', 'edit', 'delete']"
              @view="seeHandle(scope.row.id)"
              @edit="addOrModifyHandle('modify', scope.row.id)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>

    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      @close="addOrUpdateVisible = false"
    ></add-or-update> -->

    <!-- 查看详情弹窗 -->
    <see
      v-if="seeVisible"
      ref="see"
      @close="seeVisible = false"
    />
    <!-- 新增/修改详情弹窗 -->
    <add-or-modify
      ref="addOrModify"
      :current-node="currentNode"
      @refreshDataList="getDataList"
    />

    <!-- 树状, 查看，修改-->
    <el-dialog
      :title="dialogtitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="treeForm"
        :modal="treeForm"
      >
        <el-form-item
          label="队伍类型名称"
          size="large"
          label-width="120px"
        >
          <el-input
            v-model="treeForm.currentTreename"
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            clearable
            style="margin-bottom: 10px"
          />
        </el-form-item>
      </el-form>
      <span
        v-if="!groupingdisabled"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submittingbygroups"
        >确 定</el-button>
      </span>
    </el-dialog>
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="batchDelete(deleteIds)"
    />
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import resoureteamtree from './resoureteam-tree.vue';
import resoureteamheader from './resoureteam-header.vue';
import see from './resoureteam-see.vue';
import addOrModify from './resoureteam-add-or-modify.vue';
import resoureteamtable from './resoureteam-table.vue';
import resoureteamTreeCrud from './resoureteam-tree-crud.vue';

const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    // AddOrUpdate,
    see,
    addOrModify,
    resoureteamtable,
    resoureteamtree,
    resoureteamTreeCrud,
    resoureteamheader,
  },
  data() {
    return {
      cloudUrl: window.SITE_CONFIG.cloudUrl,
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: '/resoure/resoureteamtype/tree',
        edit: {},
      },

      tableRequest: {
        api: '/resoure/resoureteam/list',
        params: {
          teamTypeIds: this.selectedNode,
          listType: '1',
        },
      },
      currentNode: '',
      checkedNodes: [],
      selectedNode: [],
      fileList: [],
      // 获取到的token
      documenttoken: `${httpaddress}/resoure/resoureteam/xlsInput?token=${this.$cookie.get(
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
      pageSize: 20,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      seeVisible: false,
      // 队伍类型Visible
      resoureteamTreeCrudVisible: false,
    };
  },
  mounted() {
    // this.getDataList();
  },
  methods: {
    ifendcase(row, column) {
      // console.log('ifendcase',row, column)
      if (column.property === 'nature') {
        // 1:专职 2:兼职 3:专业志愿者
        return row.nature === 1
          ? '专职'
          : row.nature === 2
            ? '兼职'
            : '专业志愿者';
      }
      if (column.property === 'level') {
        // 1:国家级2:省级3:市级 4:县级 5:乡镇级 6:其他
        return row.level === 1
          ? '国家级'
          : row.nature === 2
            ? '省级'
            : row.nature === 3
              ? '市级'
              : row.nature === 4
                ? '县级'
                : row.nature === 5
                  ? '乡镇级'
                  : '其他';
      }
      if (column.property === 'secretLevel') {
        // 1机密 2秘密 3限制  4公开  5其他
        return row.secretLevel === 1
          ? '机密'
          : row.secretLevel === 2
            ? '秘密'
            : row.secretLevel === 3
              ? '限制'
              : row.secretLevel === 4
                ? '公开'
                : '其他';
      }
    },
    // 新增队伍弹窗
    addNewResoureteam(type, id) {
      // this.addOrUpdateVisible = true;
      // this.$nextTick(() => {
      this.$refs.addOrModify.init(type, id);
      // });
    },
    // 被勾选的表格
    handleSelectionChange(val) {
      const tal = [];
      this.$emit('handleSelectionChange', val);
      for (let i = 0; i < val.length; i++) {
        tal.push(val[i].id);
        this.currenttableArray = tal;
      }
      // console.log(this.currenttableArray);
    },
    /**
     * @description: 函数获取selectedNode逻辑没变，更改了刷新页面的方法，因为树的结构在点击全部的时候返回null,所以加了判断处理
     * @param {*}
     * @return {*}
     */
    // 点击树形节点事件
    handleNodeClick(obj) {
      this.currentNode = obj;
      function findChilden(obj, list) {
        list.push(obj.id);
        const { children } = obj;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }
      if (obj == null) {
        this.selectedNode = [];
      } else {
        // console.log("树形结点点击事件", obj);
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
      }

      // console.log("selectedNode:"+this.selectedNode);
      // console.log(this.currentTreeObject);
      // console.log(this.treeForm.currentTreename);
      // 查询树形关联的联系人
      this.tableRequest.params.teamTypeIds = this.selectedNode;
      this.$refs.template.getTableList(this.tableRequest);
      // this.$http({
      //   url: this.$http.adornUrl(`/resoure/resoureteam/list`),
      //   method: "POST",
      //   data: this.$http.adornData({
      //     limit: this.pageSize,
      //     page: this.pageIndex,
      //     teamTypeIds: this.selectedNode
      //   })
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     // console.log(data);
      //     this.totalCount = data.page.totalCount;
      //     this.pageIndex = data.page.pageIndex;
      //     this.pageSize = data.page.pageSize;
      //     this.platShareMenuList = data.page.list;

      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    },
    // 查看分组
    showEventType() {
      this.dialogVisible = true;
      this.dialogtitle = '查看队伍类型';
      this.groupingdisabled = true;
    },
    // 添加分组
    addEventType() {
      this.resoureteamTreeCrudVisible = true;
      this.$nextTick(() => {
        this.$refs.resoureteamTreeCrud.init(null, null, 2); // 代表新增
      });
    },
    // 修改分组名称
    updateEventType(id) {
      // console.log(this.treeForm.currentTreename);
      this.dialogVisible = true;
      this.dialogtitle = '修改队伍类型';
      this.groupingdisabled = false;
    },
    // 分组拖拽排序
    modifythename(before, after, inner, event) {
      const treesubnode = [];
      // console.log("==============");
      // console.log(this.modifiedUserList);
      // console.log(before); // 移动的节点
      // console.log(after); // 移动到的父节点
      // console.log(inner);
      // console.log("==============");
      let prentId;
      if (inner == 'inner') {
        prentId = after.data.id;
        // this.modifiedUserList
      } else {
        prentId = after.data.parentId;
      }
      // console.log(prentId);
      // console.log(this.modifiedUserList);
      const groupId = before.data.id;
      let ancestors;
      let parentId;
      let groupIds;
      let prent;
      if (prentId == 0) {
        ancestors = '0';
        parentId = 0;
        groupIds = new Array();
        this.modifiedUserList.forEach((item, index) => {
          groupIds.push(item.id);
        });
      } else {
        prent = findPrent(prentId, this.modifiedUserList);
        ancestors = `${prent.ancestors},${prent.id}`;
        parentId = prent.id;
        groupIds = new Array();
        prent.children.forEach((item, index) => {
          groupIds.push(item.id);
        });
      }
      // console.log(groupId);
      // console.log(ancestors);
      // console.log(parentId);
      // console.log(groupIds);
      const params = {
        id: groupId,
        ancestors,
        parentId,
        groupIds,
        children: before.data.children,
      };
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteamtype/order'),
        method: 'POST',
        data: this.$http.adornData(params, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          // console.log(data);
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
          });
        } else {
          this.$message.error(data.msg);
        }
      });

      function findPrent(prentId, list) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];

          if (item.id == prentId) {
            // console.log(item.name);
            return item;
          }
          if (item.children != null) {
            const temp = findPrent(prentId, item.children);
            if (temp != null) {
              return temp;
            }
          }
        }
        return null;
      }
    },
    /**
     * @description: 多加了分组内是否还有数据的判断
     * @param {*}
     * @return {*}
     */
    // 删除分组
    deleteEventType(data) {
      const childrenNode = this.$refs.template.getTreeNodeChildren(data.id);
      const that = this;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteam/list'),
        method: 'POST',
        data: this.$http.adornData({
          teamTypeIds: childrenNode,
          limit: this.pageSize,
          page: this.pageIndex,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('getDataList',data)
          if (data.page.list.length > 0) {
            this.$alert('请先删除分组里的内容', '提醒', {
              confirmButtonText: '确定',
            });
          } else {
            this.$confirm('确定对进行[删除]操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              that
                .$http({
                  url: that.$http.adornUrl('/resoure/resoureteamtype/delete'),
                  method: 'post',
                  data: that.$http.adornData(
                    {
                      ids: childrenNode,
                    },
                    false,
                  ),
                })
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    that.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                    });
                    that.getDataList();
                  } else {
                    that.$message.error(data.msg);
                  }
                });
            });
          }
          // console.log('this.platShareMenuList',this.platShareMenuList)
        } else {
          this.$message.error(data.msg);
        }
      });

      // console.log('删除前that.checkedIds',that.checkedIds)
      // this.$confirm(`确定对进行[删除]操作?`, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // }).then(() => {
      //   var checkedNames = "";
      //   if (that.selectedNode.length > 0) {
      //     that.selectedNode.forEach((item) => {
      //       if (item.system === 1) {
      //         checkedNames += item.name;
      //       }
      //     });
      //   }

      //   setTimeout(() => {
      //     if (checkedNames) {
      //       that.$message({
      //         message: `${checkedNames}删除失败`,
      //         type: "error",
      //         duration: 1500,
      //       });
      //       return 0;
      //     }
      //     that
      //       .$http({
      //         url: that.$http.adornUrl(`/resoure/resoureteamtype/delete`),
      //         method: "post",
      //         data: that.$http.adornData(
      //           {
      //             ids: that.selectedNode,
      //           },
      //           false
      //         ),
      //       })
      //       .then(({ data }) => {
      //         if (data && data.code === 0) {
      //           that.$message({
      //             message: "操作成功",
      //             type: "success",
      //             duration: 1500,
      //           });
      //           that.getDataList();
      //         } else {
      //           that.$message.error(data.msg);
      //         }
      //       });
      //   });
      // });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      // console.log('勾选的checkedIds,checkedNodes',checkedIds,checkedNodes)
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds',this.checkedIds);
      this.checkedNodes = checkedNodes;
    },
    /**
     * @description: 更改了刷新数据的形式
     * @param {*}
     * @return {*}
     */
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('/resoure/resoureteamtype/tree'), //resoure/resoureteam/list
      //   method: 'get',
      //   params: this.$http.adornParams({
      //     'page': this.pageIndex,
      //     'limit': this.pageSize,
      //     'key': this.dataForm.key
      //   })
      // }).then(({data}) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.page.list
      //     this.totalPage = data.page.totalCount
      //     this.platShareMenuList = treeDataTranslate(data.data.list, "id");
      //   } else {
      //     this.dataList = []
      //     this.totalPage = 0
      //   }
      //   this.dataListLoading = false
      // })
      this.dataListLoading = true;
      this.$refs.template.getTree();
      this.$refs.template.getTableList(this.tableRequest);
      // this.$http({
      //   url: this.$http.adornUrl("/resoure/resoureteamtype/tree"),
      //   method: "get"
      // }).then(({ data }) => {
      //   // console.log(data);
      //   this.modifiedUserList = treeDataTranslate(data.tree, "id");
      //   // console.log(this.modifiedUserList)
      //   //请求表格数据
      //   this.$http({
      //     url: this.$http.adornUrl("/resoure/resoureteam/list"),
      //     method: "POST",
      //     data: this.$http.adornData({
      //       teamTypeIds: this.selectedNode,
      //       limit: this.pageSize,
      //       page: this.pageIndex
      //     })
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       // console.log('getDataList',data)
      //       this.totalCount = data.page.totalCount;
      //       this.pageIndex = data.page.currPage;
      //       this.pageSize = data.page.pageSize;
      //       this.platShareMenuList = data.page.list;
      //       // console.log('this.platShareMenuList',this.platShareMenuList)
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
      // });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error('分组名称不能为空');
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl('/resoure/resoureteamtype/update'),
          method: 'post',
          data: this.$http.adornData({
            id: this.treeForm.id,
            parentId: this.treeForm.parentId,
            name: this.treeForm.currentTreename,
            ancestors: this.treeForm.ancestors,
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
      }
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
    // addOrUpdateHandle(id, status) {
    //   this.addOrUpdateVisible = true;
    //   this.$nextTick(() => {
    //     if (status === "watch") {
    //       this.$refs.addOrUpdate.init(id, status);
    //     } else {
    //       this.$refs.addOrUpdate.init(id);
    //     }
    //   });
    // },
    /**
     * @description 打开新增/修改分类点弹窗
     * @param {String} type 弹窗类型：add新增、modify编辑
     * @param {Number} id 编辑时该行的数据的id
     */
    addOrModifyHandle(type, id) {
      const that = this;
      that.addOrModifyVisible = true;
      that.$nextTick(() => {
        that.$refs.addOrModify.init(type, id);
      });
    },
    /**
     * @description: 打开查看表格数据弹窗
     * @param {Number} id 查看行的数据的id
     * @return {*}
     */
    seeHandle(id) {
      const that = this;
      that.seeVisible = true;
      that.$nextTick(() => {
        that.$refs.see.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => item.id);
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/resoure/resoureteam/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
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
      });
    },
    // 导出模板
    downloadtemplate() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const token = document.cookie;
      const exportEx = this.currentTreeObject;
      // console.log(
      //   `${httpaddress}//resoure/resoureteam/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`
      // );
      // window.open(httpaddress +'//mail/mailgroup/gettemplate?gId=' + exportEx + '&' + token)
      window.location.href = `${httpaddress}//resoure/resoureteam/gettemplate?gId=${exportEx}&token=${Cookies.get(
        'token',
      )}`;
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      // console.log("文件上传时的钩子", event, file, fileList);
    },
    // 导出数据
    exportExcel() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const { checkedIds } = this;
      if (checkedIds.length < 1) {
        this.$message({
          message: '请选择一个分组进行导出',
          type: 'warning',
        });
      } else {
        const token = document.cookie;
        window.location.href = `${httpaddress}/resoure/resoureteam/xlsOutput?checkedIds=${checkedIds}&teamIds=${
          this.currenttableArray ? this.currenttableArray : -1
        }&token=${Cookies.get('token')}`;
      }
    },
    // 删除||批量删除联系人
    batchDelete(id) {
      const ids = {
        ids: this.currenttableArray || [id],
        groupId: this.currentTreeObject,
      };

      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteam/delete'),
        method: 'post',
        data: this.$http.adornData(ids, false),
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
          this.$message.error('请选择一个联系人删除');
        }
      });
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.filename = file.name;
      // console.log("上传成功的回调", response);
      // console.log("上传成功的回调2", file);
      // console.log(fileList);
      if (file.response.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
        this.getDataList();
      } else if (file.response.errorData.length > 0) {
        this.getDataList();
        this.errorDataVisible = true;
        this.$nextTick(() => {
          this.$refs.errorData.init(file.response.errorData); //
        });
      } else {
        this.$message.error({
          type: 'error',
          message: `${file.response.msg}`,
        });
      }
    },
    // 联系人搜索
    searchcontacts(contactsearch) {
      // console.log(this.currentTreeObject);
      this.search = contactsearch;
      this.pageIndex = 1;
      this.selectedNode = [];
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteam/list'),
        method: 'POST',
        data: this.$http.adornParams({
          teamTypeIds: this.selectedNode,
          search: contactsearch,
          limit: this.pageSize,
          page: this.pageIndex,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.page.list;
          this.totalCount = data.page.totalCount;
          this.pageIndex = data.page.pageIndex;
          this.pageSize = data.page.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
<style lang="less">
.resoureteamWrap {
  margin: -20px;
  .addressbookbox > .el-header {
    color: #333;
    /*text-align: center;*/
    line-height: 80px;
  }

  .addressbookbox > .el-aside {
    /*background-color: #D3DCE6;*/
    color: red;
    text-align: center;
    line-height: 20px;
  }

  .addressbookbox > .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    line-height: 150px;
  }
  .tableClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    height: 652px;
    width: 82%;
    margin-left: 20px;
    min-width: 540px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0px;
  }
}
</style>
