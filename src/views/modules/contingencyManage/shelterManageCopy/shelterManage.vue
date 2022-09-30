
<template>
    <div class="resoureteamWrap">
        <sv-template
            ref="template"
            :treeSetting="treeSetting"
            @tree-click="handleNodeClick"
            @tree-node-delete="deleteEventType"
            title="避难场所"
            :dateSelect="false"
            :searchSetting="{
              width: '280px',
              placeholder: '请输入名称搜索'
            }"
            :exportSelectConfig="isAuth('resoureteam:resoureteamtree:xlsOutput') ? {
              api: '/resoure/resourearea/xlsOutputSelect',
            } : {}"
            :exportQueryConfig="isAuth('resoureteam:resoureteamtree:xlsOutput') ? {
              api: '/resoure/resourearea/export',
            } : {}"
            :importDataConfig="isAuth('resoureteam:resoureteamgroup:xlsInput') ? {
              api:'/resoure/resourearea/xlsImport'
            } : {}"
            :downloadTemplateConfig="{api: '/resoure/resourearea/gettemplate'}"
            :deleteSelectedConfig="isAuth('resoure:resoureteam:delete') ? {
              api: '/resoure/resourearea/delete'
            } : {}"
            :tableRequest="tableRequest"
        >
        <template #middle__operation__select>
          <span></span>
        </template>        
            <template #middle__operation__button>
                <sv-button
                    type="primary"
                    @click="openAddDialog()"
                    v-if="isAuth('resoure:resoureteam:save')"
                >新增避难场所</sv-button>
            </template>
            <template #middle__table>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="场所名称"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.name"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="所在区域"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.address"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="场所功能"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.feature"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="联系人"
                >
                  <template slot-scope="scope">
                    <!-- <sv-table-tooltip :content="scope.row.contactorlist.name"/> -->
                    {{scope.row.contactorlist.length>0?scope.row.contactorlist.map(item=>{return item.name}).join(','):''}}
                  </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="联系人电话"
                >
                    <template slot-scope="scope">
                      <!-- <sv-table-tooltip :content="scope.row.contactorlist.mobile1"/> -->
                      {{scope.row.contactorlist.length>0?scope.row.contactorlist.map(item=>{return item.mobile1}).join(','):''}}
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
                            @view="seeOrUpdateHandle(scope.row.id, 'watch')"
                            @edit="seeOrUpdateHandle(scope.row.id, 'modify')"
                            @delete="
                                deleteIds = [scope.row.id]
                                $refs.delete_hint.visible = true
                            "
                        ></sv-table-operation>
                    </template>
                </el-table-column>
            </template>
        </sv-template>
        <!-- 新增弹窗 -->
        <add
            v-if="addVisible"
            ref="add"
            @refreshDataList="getDataList"
            @close="addVisible = false"
        ></add>
        <!-- 查看/修改详情弹窗 -->
        <see-or-update
            v-if="seeOrUpdateVisible"
            ref="seeOrUpdate"
            @refreshDataList="getDataList"
            @close="seeOrUpdateVisible = false"
        ></see-or-update>
        <!-- 删除提示弹窗 -->
        <sv-dialog-hint ref="delete_hint" type="delete" @confirm="handleDelete(deleteIds)"/>
        <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败"/>
    </div>
</template>

<script>
import sheltermanagetree from "./shelterManage-tree";
// import sheltermanageheader from "./shelterManage-header";
// import sheltermanagetable from "./shelterManage-table";
import sheltermanagetreecrud from "./shelterManage-tree-crud";
import { treeDataTranslate } from "@/utils";
import Cookies from "js-cookie";

// 新增弹窗
import add from './shelterManage-add'
// 查看、修改详情弹窗
import seeOrUpdate from './shelterManage-see-or-update'

export default {
    components: {
        add,
        seeOrUpdate,
    },
    data() {
      return {
        treeForm: {
          id: "",
          parentId: "",
          ancestors: "",
          // 分组名字
          currentTreename: "",
          //分组描述
          groupingdescription: ""
        },
      // 树形接口
      treeSetting: {
          api: '/resoure/resourareatype/list',
          edit: this.isAuth('mail:mailgroup:delete') ? {
          add: '/resoure/resourareatype/save',
              update: '/resoure/resourareatype/update',
              // delete: '/resoure/resourareatype/delete'
          } : {    }
      },
      // 表格数据接口
      tableRequest: {
          api: '/resoure/resourearea/list',
          params: {
              areaTypeId: [],
          }
      },
      // 应急标识选择
      natureOptions: [
        {
          value: 1,
          label: "专职"
        },
        {
          value: 2,
          label: "兼职"
        },
        {
          value: 3,
          label: "专业志愿者"
        }
      ],
      deleteIds: [],
      seeOrUpdateVisible: false,
      addVisible: false,
      }
    },
    methods: {
      test(sth) {
          console.log('test', sth)
      },
      //树状删除分组
    deleteEventType(ids) {
      var that = this;
      if (this.$refs.template.tableList.length > 0) {
        this.$alert("请先删除分组里的内容", "提醒", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.$confirm(`确定要进行[删除]操作?`, "提示", {
        customClass: "message-del",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var checkedNames = "";
        if (that.selectedNode.length > 0) {
          that.selectedNode.forEach((item) => {
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
              duration: 1500,
            });
            return 0;
          }
          that
            .$http({
              url: that.$http.adornUrl(
                `/resoure/resourareatype/delete`
              ),
              method: "post",
              data: this.$http.adornData({
                ids: that.selectedNode,
              }),
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                that.$refs.template.getTree();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
      //点击树形节点事件
      handleNodeClick(obj) {
        // if (obj.id !== null) {
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

      // console.log("树形结点点击事件", obj);
      this.selectedNode = [];
      this.currentTreeObject = obj.id;
      this.treeForm.currentTreename = obj.name;
      this.search = "";
      //分组描述
      this.treeForm.groupingdescription = obj.remark;
      this.treeForm.id = obj.id;
      this.treeForm.ancestors = obj.ancestors;
      this.treeForm.parentId = obj.parentId;
      this.treeForm.name = obj.name;
      this.currentTreeplatformId = obj.platformId;
      this.currentTreeparentId = obj.parentId;
      this.currentTreeancestors = obj.ancestors;

      findChilden(obj, (this.selectedNode = []));
      this.tableRequest.params.areaTypeId = this.selectedNode
      this.$refs.template.getTableList(this.tableRequest)
      // } else {
      //   this.tableRequest.params.areaTypeId = null
      //   this.$refs.template.getTableList(this.tableRequest)
      // }
     },
    // 查看 / 修改
    seeOrUpdateHandle(id, status) {
      let that = this;
      that.seeOrUpdateVisible = true;
      that.$nextTick(() => {
        that.$refs.seeOrUpdate.init(id, status);
      });
    },
    // 新增
    addNewShelterManage() {
      let that = this;
      that.addVisible = true;
      that.$nextTick(() => {
        that.$refs.add.init();
      });
    },
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true;
      this.$refs.template.getTableList(this.tableRequest)
     },
        /**
         * @method
         * @desc 获取表格数据
         */
        getTableList() {
            this.$refs.template.getTableList(this.tableRequest) 
        },
        /**
         * @method
         * @desc 点击树形，获取表格数据
         */
        handleTreeClick(obj) {
          this.tableRequest.params.groupIds = obj ? obj.id + '' : '' ;
          // console.log(this.tableRequest.params.groupIds);
            // this.tableRequest.params.groupIds = data ? [data.id] : []
            this.getDataList()
        },
        /**
         * @method
         * @desc 打开新增分类点弹窗
         */
        openAddDialog() {
            this.addVisible = true;
            this.$nextTick(() => {
            this.$refs.add.init();
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
                url:  '/resoure/resourearea/delete',
                baseURL: window.SITE_CONFIG.baseUrl,
                data: {
                    ids
                }
            }
            this.$http(request)
            .then(response => {
                if(response.data.code == 0) {
                    // 提交成功后，刷新表格
                    this.getDataList();
                    // this.$refs.template.getTableList(this.tableRequest)
                } else {
                    console.log('删除失败！错误信息：【\n', response, '\n】')
                    this.$refs.delete_fail.visible = true
                    this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`
                }
            })
            .catch(error => {
                console.log('删除失败！错误信息：【\n', error, '\n】')
                this.$refs.delete_fail.visible = true
                this.$refs.delete_fail.supplementText = error
            })
        },
        //联系人搜索
    searchcontacts(contactsearch) {
      // console.log(this.currentTreeObject);
      this.search = contactsearch;
      this.pageIndex = 1;
      this.$http({
        url: this.$http.adornUrl(`/resoure/resourearea/list`),
        method: "post",
        data: this.$http.adornData({
          // areaTypeId: this.selectedNode,
          areaTypeId: [],
          key: contactsearch,
          limit: this.pageSize,
          page: this.pageIndex
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    },
    mounted() {
        // this.getCommunityList()
    }
}
</script>

<style lang="scss">

</style>