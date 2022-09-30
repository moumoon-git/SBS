<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
    >
      <template #middle__container>
        <div class="notice_content">
          <div class="content_header">
            <span class="content__header__title">动态通报</span>
            <sv-select-date
              v-model="objTime"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              @keyup.enter.native="
                pageIndex = 1;
                getDataList();
              "
              @change="
                pageIndex = 1;
                getDataList();
              "
            />
            <sv-input-search
              v-model="keyword"
              width="180px"
              placeholder="请输入公告关键字"
              @keyup.enter.native="
                pageIndex = 1;
                getDataList();
              "
              @change="
                pageIndex = 1;
                getDataList();
              "
            />
            <sv-button
              type="primary"
              @click="addOrUpdateHandle()"
            >
              新增
            </sv-button>
          </div>

          <!--列表-->
          <div class="cardClass">
            <div class="list">
              <el-collapse
                v-model="activeNames"
                @change="handleChange"
              >
                <el-collapse-item
                  v-for="(item, index) in dataList"
                  :key="index"
                  :name="index"
                  style="position: relative"
                >
                  <template slot="title">
                    <el-tag
                      type="success"
                    >
                      已读:{{ item.noticeContactorReadList.length }}
                    </el-tag>
                    <el-tag
                      type="warning"
                    >
                      回复:{{ item.noticeCommentEntityList.length }}
                    </el-tag>
                    <span
                      style="font-size: 16px; padding: 5px; font-weight: bold"
                      v-html="item.title"
                    />
                    <span>{{ item.createTime }}</span>
                    <div style="position: absolute; right: 5%; top: 0%">
                      <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button> -->
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="deleteCollapseItem(item)"
                      />
                    </div>
                  </template>

                  <div style="font-size: 14px">
                    <p v-html="item.content" />
                  </div>

                  <div style="font-size: 14px; padding-top: 15px">
                    <p
                      v-if="
                        item.receiveListStr != null && item.receiveListStr != ''
                      "
                    >
                      收信者： {{ item.receiveListStr }}
                    </p>
                    <p
                      v-if="item.readListStr != null && item.readListStr != ''"
                    >
                      已读者： {{ item.readListStr }}
                    </p>
                  </div>

                  <div style="font-size: 14px">
                    <p
                      v-if="
                        item.noticeCommentEntityList != null &&
                          item.noticeCommentEntityList != ''
                      "
                    >
                      回复列表：
                    </p>
                    <!--历史记录时间线-->
                    <div class="block">
                      <el-timeline>
                        <el-timeline-item
                          v-for="(
                            activity, index
                          ) in item.noticeCommentEntityList"
                          :key="index"
                          :timestamp="activity.createTime"
                          placement="top"
                        >
                          <el-card>
                            <p
                              v-if="
                                activity.toUname == null ||
                                  activity.toUname == ''
                              "
                            >
                              {{ activity.fromUname }} 发表评论
                            </p>

                            <p
                              v-if="
                                activity.toUname != null &&
                                  activity.toUname != ''
                              "
                            >
                              {{ activity.fromUname }} 回复了
                              {{ activity.toUname }}
                            </p>

                            <p
                              v-if="
                                activity.content != null &&
                                  activity.content != ''
                              "
                            >
                              {{ activity.content }}
                            </p>

                            <p
                              v-if="
                                activity.imageUrl != null &&
                                  activity.imageUrl != '' &&
                                  activity.imageUrl.indexOf(',') == -1
                              "
                            >
                              <img
                                :src="baseUrl + activity.imageUrl"
                                style="
                                  width: 120px;
                                  height: 120px;
                                  margin-left: 15px;
                                "
                              >
                            </p>

                            <p
                              v-if="
                                activity.imageUrl != null &&
                                  activity.imageUrl != '' &&
                                  activity.imageUrl.indexOf(',') > -1
                              "
                            >
                              <span
                                v-for="(img, index) in activity.imageUrl.split(
                                  ','
                                )"
                                :key="index"
                              >
                                <img
                                  :src="baseUrl + img"
                                  style="
                                    width: 120px;
                                    height: 120px;
                                    margin-left: 15px;
                                  "
                                >
                              </span>
                            </p>
                          </el-card>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <section
                v-if="dataList.length === 0"
                style="
                  height: 50vh;
                  line-height: 50vh;
                  text-align: center;
                  font-size: 20px;
                  font-weight: bold;
                  width: 100%;
                  color: #dcdfe6;
                "
              >
                暂无数据
              </section>
            </div>
          </div>
          <!--分页-->
          <div>
            <el-pagination
              style="margin-top: 50px"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
            />
          </div>
        </div>
      </template>
    </sv-template>

    <!-- 删除提示弹窗 -->
    <!-- <sv-dialog-hint ref="delete_hint" type="delete" @confirm="handleDelete(deleteIds)"/>
    <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败"/> -->
  </div>
</template>

<script>
// 头部组件
// import noticeheader from './notice-header';
// import noticetree from './notice-tree';
// import noticeTypeAddOrUpdate from './notice-tree-crud.vue';

export default {

  components: {
    // 'notice-header': noticeheader,
    // 'notice-tree': noticetree,
    // noticetype_add_or_update: noticeTypeAddOrUpdate,
  },
  data() {
    return {
      // 树形接口
      treeSetting: {
        api: '/notice/noticetype/list',
        edit: this.isAuth('mail:mailgroup:delete')
          ? {
            add: '/notice/noticetype/save',
            update: '/notice/noticetype/update',
            delete: true,
            // delete: '/notice/noticetype/delete'
          }
          : {},
      },
      // 表格数据接口
      tableRequest: {
        api: '/notice/noticemanagement/pageByToken',
        params: {},
      },
      // 地址
      baseUrl: window.SITE_CONFIG.cloudUrl,

      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
      // 修改分组或者查看分组
      dialogtitle: '',
      // 修改||查看分组弹出框
      dialogVisible: false,

      // 增加查看分组
      noticeTypeAddOrUpdateVisible: false,

      // 弹出窗
      treeForm: {
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
      },

      // 批量删除
      checkedNodes: [],
      checkedIds: [],

      // 主页面分组树形
      noticetypeList: [],
      noticeTypeProps: {
        children: 'children',
        label: 'name',
      },
      Treeexpansion: false,

      // 搜索条件
      keyword: '',
      startAt: '',
      endAt: '',
      objTime: ['', ''],
      noticeTypeId: '',

      dataList: [],
      // activeNames: ["1"],
      activeNames: [],

      selectedNode: [],

      // 分页
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },

  created() {
    this.getTreeDataList();
    this.getDataList();
  },

  methods: {
    deleteCollapseItem(item) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/notice/noticemanagement/delete'),
            method: 'POST',
            data: this.$http.adornData({
              ids: [item.id],
            }),
          }).then(({ data }) => {
            console.log('/notice/noticemanagement/delete', data);
            if (data && data.code === 0) {
              this.getDataList();
              this.$message({
                message: '删除成功',
                type: 'success',
              });
            } else {
              this.$message.error('删除失败');
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 获取分组数据列表
    getTreeDataList() {
      this.$http({
        url: this.$http.adornUrl('/notice/noticetype/list'),
        method: 'get',
      }).then(({ data }) => {
        // 分组列表
        this.noticetypeList = data.list;
      });
    },

    // 公告列表
    getDataList() {
      this.$http({
        url: this.$http.adornUrl('/notice/noticemanagement/pageByToken'),
        method: 'POST',
        data: this.$http.adornData({
          startAt: this.objTime[0],
          endAt: this.objTime[1],
          keyword: this.keyword,
          selectedNode: this.selectedNode,
          limit: this.pageSize,
          page: this.pageIndex,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });
    },

    // 点击树形节点事件
    handleNodeClick(obj) {
      console.log('点击树形节点事件', obj);
      function findChilden(treeObj, list) {
        list.push(treeObj.id);
        // let children = treeObj.children;
        // 通过对象重构获取children
        const { children } = treeObj;
        if (children != null) {
          children.forEach((item) => {
            findChilden(item, list);
          });
        }
      }

      if (obj === null) {
        // “全部”显示所有数据
        this.selectedNode = [];
        this.getDataList();
      } else {
        // 点击查看弹窗
        this.treeForm.currentTreename = obj.name;
        this.treeForm.groupingdescription = obj.typeDescribe;
        this.noticeTypeId = obj.id;

        findChilden(obj, (this.selectedNode = []));

        this.getDataList();
      }
    },

    // // 分组修改提交
    // submittingbygroups() {
    //   if (!this.treeForm.currentTreename) {
    //     this.$message.error('分组名称不能为空');
    //   } else {
    //     this.dialogVisible = false;
    //     this.$http({
    //       url: this.$http.adornUrl('/notice/noticetype/update'),
    //       method: 'post',
    //       data: this.$http.adornData({
    //         id: this.noticeTypeId,
    //         name: this.treeForm.currentTreename,
    //         typeDescribe: this.treeForm.groupingdescription,
    //       }),
    //     }).then(({ data }) => {
    //       // this.$message({
    //       //   message: '操作成功',
    //       //   type: 'success',
    //       //   duration: 1500,
    //       //   onClose: () => {
    //       //     this.getTreeDataList();
    //       //     this.getDataList();
    //       //   },
    //       // });
    //       console.log('data', data);
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: '操作成功',
    //           type: 'success',
    //           duration: 1500,
    //           // onClose: () => {

    //           // },
    //         });
    //         this.getTreeDataList();
    //         this.getDataList();
    //         // this.$refs.template.getTree();
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     });
    //     console.log('啊啊啊啊');
    //   }
    // },

    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      this.checkedNodes = checkedNodes;
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
        url: this.$http.adornUrl('/notice/noticemanagement/pageByToken'),
        method: 'post',
        data: this.$http.adornData({
          selectedNode: arr,
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
              that.checkedIds = arr;
              that
                .$http({
                  url: that.$http.adornUrl(
                    `/notice/noticetype/delete/${that.checkedIds}`,
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

    // editCard(item) {
    //   this.$router.push({ path: "/safeEducation", query: { item: item } });
    // },

    // deleteCard(item) {
    //   this.$confirm("此操作将永久删除该案例, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$http({
    //         url: this.$http.adornUrl(`/article/articlesafeeducation/delete`),
    //         method: "POST",
    //         data: this.$http.adornData({
    //           id: item.id
    //         })
    //       }).then(res => {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功!"
    //         });
    //         this.activeNames = [];
    //         this.getDataList();
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },

    handleChange(val) {
      window.console.log('点击点击点击点击点击点击', val);
    },

    // // 搜索查询
    // searchHandle(objContent, objTime) {
    //   console.log(objContent, objTime);

    //   this.keyword = objContent;

    //   let startTime;
    //   let endTime;
    //   if (objTime !== null && objTime !== '') {
    //     // 时间不为空
    //     [startTime, endTime] = objTime;
    //     console.log('startTime', startTime);
    //     // startTime = objTime[0];
    //     // endTime = objTime[1];
    //   } else {
    //     startTime = '';
    //     endTime = '';
    //   }

    //   this.startAt = startTime;
    //   this.endAt = endTime;

    //   this.getDataList();
    // },
    /**
     * @method
     * @desc 外部获取时间选择器取值
     * @return {Array} 时间选择器取值：[startTime, endTime]
     */
    // getDate() {
    //   return this.objTime;
    // },

    // 新增跳转路由
    addOrUpdateHandle() {
      this.$router.push({
        path: '/noticeWarning',
        query: {
          name: this.treeForm.currentTreename,
          id: this.noticeTypeId,
        },
      });
    },
  },
};
</script>
<style scoped lang="less">
.notice_content {
  display: inline-block;
  height: calc(100vh - 112px);
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 14px 2px rgba(54, 121, 225, 0.09);

  .content_header {
    padding: 10px;
    font-size: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -10px;
    & > * {
      margin: 0 0 10px 5px;
      flex-shrink: 0;
    }
    .content__header__title {
      flex-grow: 1;
      flex-shrink: 0;
      border-left: 3px solid #0091ff;
      font-size: 16px;
      line-height: 16px;
      font-weight: bold;
      padding: 0 0 0 14px;
    }
  }
}
</style>
