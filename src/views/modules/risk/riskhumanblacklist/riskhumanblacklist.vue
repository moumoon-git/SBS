<template>
  <!-- 人员黑名单 -->
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-node-delete="deleteEventType"
      @tree-click="handleNodeClick"
    >
      <template #middle__container>
        <div class="riskhumanblack_content">
          <div class="content_header">
            <span class="content__header__title">人员黑名单</span>
            <sv-input-search
              v-model="dataForm.key"
              @keyup.enter.native="
                pageIndex = 1;
                getDataList();
              "
              @change="
                pageIndex = 1;
                getDataList();
              "
              placeholder="按名称搜索"
            >
            </sv-input-search>
            <sv-select
              v-model="dataForm.eventTypeId"
              placeholder="选择分类点"
              :options="managementTypeOptions"
              @change="
                pageIndex = 1;
                getDataList();
              "
              :filter="true"
            />
            <el-upload
              style="display: inline-block"
              action
              :http-request="uploadSectionFile"
              :show-file-list="false"
            >
              <sv-button type="primary">导入</sv-button>
            </el-upload>
            <!-- 导出 -->
            <sv-button @click="exportExcel()" type="primary"
              >导出模板</sv-button
            >
            <sv-button @click="planpdf()" type="primary">导出数据</sv-button>
            <sv-button
              v-if="isAuth('risk:riskhumanblacklist:save')"
              @click="addOrUpdateHandle()"
              type="primary"
              >新增</sv-button
            >
          </div>
          <div class="cardClass">
            <div v-loading="dataListLoading" element-loading-spinner="sv-loading"  class="list">
              <!-- 一个卡片单位 -->
              <div class="colStaff" v-for="item in dataList" :key="item.id">
                <div class="left" style="width: 185px">
                  <!-- <el-image style="width:185px;" :src="item.imageUrl"></el-image> -->
                  <viewer>
                  <img
                    :src="item.imageUrl"
                    style="width: 185px; height: 100%"
                    alt
                  />
                  </viewer>
                </div>
                <div class="right">
                  <ul>
                    <li>
                      <label>姓名:{{ item.name }}</label>
                      <span></span>
                    </li>
                    <li>
                      <label
                        >性别:{{
                          item.sex === 0 ? "男" : item.sex == 1 ? "女" : "未知"
                        }}</label
                      >
                      <span></span>
                    </li>
                    <li>
                      <label>管控类型:{{ item.controlTypeName }}</label>
                      <span></span>
                    </li>
                    <li>
                      <label>证件类型:{{ item.credentialsName }}</label>
                      <span></span>
                    </li>
                    <li>
                      <label>证件号:{{ item.credentialsNum }}</label>
                      <span></span>
                    </li>
                    <li>
                      <span
                        type="text"
                        @click="addOrUpdateHandle(item.id)"
                        style="
                          margin-right: 20px;
                          color: #0091ff;
                          cursor: pointer;
                        "
                        >编辑</span
                      >
                      <span
                        @click="handleupDelete(item.id)"
                        type="text"
                        style="color: #0091ff; cursor: pointer"
                        >删除</span
                      >
                    </li>
                    <li>
                      <span
                        type="text"
                        @click="handleSnapshot(item.id)"
                        style="color: #0091ff; cursor: pointer"
                        >抓拍信息</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div v-if="totalPage!==0" class="footer">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[9, 21, 51, 99]"
            :page-size="pageSize"
            :total="totalCount"
            :page-count="totalPage"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
          </div>
        </div>
      </template>
    </sv-template>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
      <snapshot-record
      v-if="SnapshotRecordVisible"
      ref="SnapshotRecord"
      @refreshDataList="getDataList"
    ></snapshot-record>
  </div>
</template>

<script>
import AddOrUpdate from "./riskhumanblacklist-add-or-update";
import TreeAddOrUpdata from "./riskhuman-tree-crud";
import SnapshotRecord from "./SnapshotRecordVisible";
import Tree from "@/views/common/tree";
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      treeSetting: {
        tab: [],
        api: "/risk/riskHumanBlacklistGroup/tree",
        edit: {
          add: "/risk/riskHumanBlacklistGroup/save",
          update: "/risk/riskHumanBlacklistGroup/update",
          delete: true
        },
      },
      tableRequest: {
        api: "/investigation/investigationInfor/list",
        params: {},
      },

      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
      dialogVisible: false,
      dialogtitle: "",
      currPage: "",

      currentTreeancestors: {},
      currentTreeparentId: "",
      currentTreeplatformId: "",
      currentTreeObject: "",
      // 保存搜索框里的值
      search: "",
      selectedNode: new Array(),
      treeForm: {
        // 分组名字
        currentTreename: "",
        // 分组描述
        groupingdescription: "",
        type: 0,
      },
      managementTypeOptions: [],
      dataForm: {
        key: "",
        eventTypeId: "",
      },
      checkedIds: [],
      credentialsTypeData: [
        { value: -1, label: "无限制" },
        { value: 0, label: "未知" },
        { value: 1, label: "身份证" },
        { value: 2, label: "警官号" },
      ],
      modifiedUserList: [], // 管控类型树形结构
      modifiedUserProps: {
        children: "children",
        label: "name",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 9,
      totalPage: 0,
      totalCount: "",
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      TreeAddOrUpdataVisible: false,
      SnapshotRecordVisible: false,
      checkedNodes: [],
      baseUrl: window.SITE_CONFIG["cloudUrl"] + "/",
    };
  },
  components: {
    AddOrUpdate,
    Tree,
    TreeAddOrUpdata,
    SnapshotRecord,
  },
  created() {
   // this.getDatatree();
  },
  mounted() {
    this.getCommunityType();
    this.getDataList();
    // this.$http({
    //   url: this.$http.adornUrl("/event/eventType/selectTypeList"),
    //   method: "get",
    //   params: this.$http.adornParams({
    //     typeFlag: 3,
    //     isTree: "1"
    //   })
    // }).then(({ data }) => {
    //   this.managementTypeOptions = data.list[0].children;
    // });
  },
  methods: {
    /**
     * @description: 获取社区下拉框列表数据
     * @param {type}
     * @return {type}
     */
    getCommunityType() {
      this.$http({
        url: this.$http.adornUrl("/event/eventType/selectTypeList"),
        method: "get",
        params: this.$http.adornParams({
          typeFlag: 3,
          isTree: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.forEach((item) => {
            item.children.forEach((item) => {
              this.managementTypeOptions.push({
                value: item.id,
                label: item.name,
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error("分组名称不能为空");
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl(`/risk/riskHumanBlacklistGroup/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            parentId: this.currentTreeparentId,
            ancestors: this.currentTreeancestors,
            orderNum: this.currentTreeorderNum,
            remark: this.treeForm.groupingdescription,
          }),
        }).then(({ data }) => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            },
          });
          this.$refs.template.getTree();
        });
      }
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list);
          });
        }
      }
     if(obj == null){
       this.selectedNode = [];
     }
     else{
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

      findChilden(obj, (this.selectedNode = []));}

      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/list-by-type`),
        method: "get",
        params: this.$http.adornParams({
          limit: this.pageSize,
          page: 1,
          key: this.dataForm.key,
          groupIds: this.selectedNode.join(),
          eventTypeId: this.dataForm.eventTypeId,
        }),
      }).then(({ data }) => {
        data.data.list.forEach((item, index, arr) => {
          // item.credentialsType
          arr[index]["credentialsName"] =
            this.credentialsTypeData.find(
              (items) => items.value === item.credentialsType
            ).label || "";
          if (item.facePicUrl && item.facePicUrl.search("http") != -1) {
            var ImgObj = new Image();
            ImgObj.src = item.facePicUrl;
            setTimeout(() => {
              //没有图片，则返回-1
              if (
                ImgObj.fileSize > 0 ||
                (ImgObj.width > 0 && ImgObj.height > 0)
              ) {
              } else {
                item.facePicUrl = require(`../../../../assets/img/nophoto.jpg`); //nophoto.jpg
              }
              arr[index]["imageUrl"] = item.facePicUrl;
            }, 1000);
          } else {
            item.facePicUrl = window.SITE_CONFIG.cloudUrl + item.facePicUrl;
            ImgObj = new Image();
            ImgObj.src = item.facePicUrl;
            setTimeout(() => {
              //没有图片，则返回-1
              if (
                ImgObj.fileSize > 0 ||
                (ImgObj.width > 0 && ImgObj.height > 0)
              ) {
              } else {
                item.facePicUrl = require(`../../../../assets/img/nophoto.jpg`); //nophoto.jpg
              }
              arr[index]["imageUrl"] = item.facePicUrl;
            }, 1000);
          }
        });

        this.totalCount = data.data.totalCount;
        this.totalPage = data.data.totalPage;
        this.pageIndex = data.data.currPage;
        this.pageSize = data.data.pageSize;
        setTimeout(() => {
          this.dataList = data.data.list;
        }, 1500);
      });
    },
    handleSnapshot(id) {
      this.SnapshotRecordVisible = true;
      this.$nextTick(() => {
        this.$refs.SnapshotRecord.init(id);
      });
    },
    // 导出人员黑名单数据
    planpdf() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie
        .substring(document.cookie.indexOf("token="))
        .substring("6");
      // console.log(token)
      // if (!this.checkedIds.length) {
      //   this.$message({
      //     message: '请选择一个人员黑名单类型进行导出',
      //     type: 'warning'
      //   })
      // } else {
      //   //window.location.href = `${httpaddress}//risk/riskhumanblacklist/output-excel?token=${this.$cookie.get('token')}&groupIds=${this.checkedIds}`
      // }
      window.location.href = `${httpaddress}/risk/riskhumanblacklist/output-excel?token=${this.$cookie.get(
        "token"
      )}&groupIds=${this.checkedIds}`;
    },
    // 导出黑名单模板
    exportExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie
        .substring(document.cookie.indexOf("token="))
        .substring("6");

      window.location.href = `${httpaddress}/risk/riskhumanblacklist/get-template?token=${this.$cookie.get(
        "token"
      )}`;
    },
    // 自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      // console.log('parma////////', param)
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/input-excel`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          // if (!data.code) {
          //   this.$message({
          //     message: "黑名单导入成功",
          //     type: "success",
          //   });
          //   this.dataForm.enclosure = data.filePath;
          //   this.dataForm.fileName = data.fileName;
          //   // 上传成功重新请求数据渲染页面
          //   // this.$emit('planData')
          //   this.getDataList();
          // } else {
          //   this.$message.error("只支持导入黑名单模板文件");
          // }

          if (!data.code && data.errorData.length == 0) {
            this.$message({
              message: `${data.msg}`,
              type: "success",
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            this.getDataList();
          }
          else if(!data.code && data.errorData.length !=0){
            // this.$message.error(`${data.msg}`);
            let str = document.createElement('div')
            data.errorData.forEach(item=>{
              let cdiv = document.createElement('div')
              cdiv.innerHTML = item.errorMsg;
              cdiv.style.marginTop = "10px"
              str.appendChild(cdiv);
            })
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<div>${data.msg}</div>${str.innerHTML}`,
              type: 'error'
            })
          }  
          else {
            this.$message.error("导入失败,请检查文件格式");
          }
        })
        .catch((err) => {
          // alert(err)
        });
    },
    // 编辑
    handleDelet(id) {
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/delete`),
        method: "post",
        data: this.$http.adornData({
          ids: [id],
        }),
      }).then(({ data }) => {});
    },

    /**
     * @method
     * @desc 删除树分组
     */  
    deleteEventType(data) {
        var that = this;
        let arr = this.$refs.template.getTreeNodeChildren(data.id);
        console.log("this.$refs.template.getTreeNodeChildren(data.id)",this.$refs.template.getTreeNodeChildren(data.id))
        this.$http({
            url: this.$http.adornUrl("/risk/riskhumanblacklist/list-by-type"),
            method: "get",
            params: this.$http.adornParams({
                page: this.pageIndex,
                limit: this.pageSize,
                key: this.dataForm.key,
                groupIds: arr.join(),
                eventTypeId: this.dataForm.eventTypeId,
            }),
        }).then(({ data }) => {
            if (data && data.code === 0) {
                if (data.data.list.length > 0) {
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
                                type: "error",
                                duration: 1500,
                            });
                            return 0;
                        }
                        that
                            .$http({
                                url: that.$http.adornUrl(
                                    `/risk/riskHumanBlacklistGroup/delete`
                                ),
                                method: "post",
                                data: this.$http.adornData({
                                    ids: arr,
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
            } else {
                this.$message.error(data.msg);
            }
        });
    },
    // // 删除管控类型
    // deleteEventType(data) {
    

    //   var that = this;
    //      if (this.dataList.length > 0) {
    //     this.$alert("请先删除分组里的内容", "提醒", {
    //       confirmButtonText: "确定",
    //     });
    //     return;
    //   }
    //   this.$confirm(`确定要进行[删除]操作?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //         that.$http({
    //           url: that.$http.adornUrl(`/risk/riskHumanBlacklistGroup/delete`),
    //           method: "POST",
    //           data: this.$http.adornData({
    //             ids: that.selectedNode,
    //           }),
    //           // data: that.$http.adornData(id)
    //         })
    //         .then(({ data }) => {
    //           if (data && data.code === 0) {
    //             that.$message({
    //               message: "操作成功",
    //               type: "success",
    //               duration: 1500,
    //             });
    //            this.$refs.template.getTree();
    //           } else {
    //             that.$message.error(data.msg);
    //           }
    //         });
     
    //   });
    // },
    // // 删除事件类型
    // deleteEventTypeHandle(data) {
    //   this.$confirm(`确定${data.name}进行删除操作?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.$http({
    //         url: this.$http.adornUrl(""),
    //         method: "post",
    //         data: this.$http.adornData(data.id, false),
    //       }).then(({ data }) => {
    //         if (data.rePlan.length > 0) {
    //           this.$message.error("删除的事件类型中存在预案，请先删除预案!");
    //         } else {
    //           this.$http({
    //             url: this.$http.adornUrl("/event/eventType/delete"),
    //             method: "post",
    //             data: this.$http.adornData(data.id, false),
    //           }).then(({ data }) => {
    //             if (data && data.code === 0) {
    //               this.$message({
    //                 message: "操作成功",
    //                 type: "success",
    //                 duration: 1500,
    //                 onClose: () => {
    //                   this.getDataList();
    //                 },
    //               });
    //             } else {
    //               this.$message.error(data.msg);
    //             }
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },
    // 修改管控类型
    updateEventType(data) {
      if (!this.currentTreeObject) {
        this.$message.warning("请选择分组");
      } else {
        this.dialogVisible = true;
        this.dialogtitle = "修改分组";
        this.groupingdisabled = false;
      }
    },
    // 查看事件类型
    showEventType(id) {
      this.dialogVisible = true;
      this.dialogtitle = "查看分组";
      this.groupingdisabled = true;
    },
    // 勾选的树形控件 全部预案id
    checkGroupNode(checkedIds) {
      console.log("勾选的树形控件", checkedIds);
      this.checkedIds = checkedIds;
      // this.checkedIds.splice(0, this.checkedIds.length, ...checkedIds)
      // 传值给子元素
    },
    // 添加事件类型
    addEventType(id) {
      this.TreeAddOrUpdataVisible = true;
      this.$nextTick(() => {
        this.$refs.treeAddOrUpdata.init(null, null, 2); // 代表新增
      });
    },
    // 获取树形分类
    getDatatree() {
      // this.dataListLoading = true;
      // this.$http({
      //   url: this.$http.adornUrl(`/risk/riskHumanBlacklistGroup/tree`),
      //   method: "get",
      //   params: this.$http.adornParams({ typeFlag: 3 })
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.modifiedUserList = treeDataTranslate(data.tree, "id");
      //   }
      //   this.dataListLoading = false;
      // });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true; // 遮罩
      this.$http({
        url: this.$http.adornUrl("/risk/riskhumanblacklist/list-by-type"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          // groupIds: "",
          groupIds: this.selectedNode.join(),
          eventTypeId: this.dataForm.eventTypeId,
        }),
      }).then(({ data }) => {
        // console.log("获取数据列表获取数据列表",data)
        if (data && data.code === 0) {
          data.data.list.forEach((item, index, arr) => {
            // item.credentialsType
            arr[index]["credentialsName"] =
              this.credentialsTypeData.find(
                (items) => items.value === item.credentialsType
              ).label || "";
            if (item.facePicUrl && item.facePicUrl.search("http") != -1) {
              var ImgObj = new Image();
              ImgObj.src = item.facePicUrl;

              setTimeout(() => {
                //没有图片，则返回-1
                if (
                  ImgObj.fileSize > 0 ||
                  (ImgObj.width > 0 && ImgObj.height > 0)
                ) {
                } else {
                  item.facePicUrl = require(`../../../../assets/img/nophoto.jpg`); //nophoto.jpg
                }
                arr[index]["imageUrl"] = item.facePicUrl;
              }, 1000);
            } else {
              item.facePicUrl = window.SITE_CONFIG.cloudUrl + item.facePicUrl;
              ImgObj = new Image();
              ImgObj.src = item.facePicUrl;

              setTimeout(() => {
                //没有图片，则返回-1
                if (
                  ImgObj.fileSize > 0 ||
                  (ImgObj.width > 0 && ImgObj.height > 0)
                ) {
                } else {
                  item.facePicUrl = require(`../../../../assets/img/nophoto.jpg`); //nophoto.jpg
                }
                arr[index]["imageUrl"] = item.facePicUrl;
              }, 1000);
            }
          });
          setTimeout(() => {
            this.dataList = data.data.list;
          }, 1500);
          this.totalCount = data.data.totalCount;
          this.totalPage = data.data.totalPage;
          this.pageIndex = data.data.currPage;
          this.pageSize = data.data.pageSize;
        } else {
          this.dataList = [];

          this.totalCount = 0;
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    getPagesChange() {
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/list-by-type`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          eventTypeId: this.dataForm.eventTypeId,
          groupIds: this.selectedNode.join(),
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.list.forEach((item, index, arr) => {
            // item.credentialsType
            arr[index]["credentialsName"] =
              this.credentialsTypeData.find(
                (items) => items.value === item.credentialsType
              ).label || "";
            if (item.facePicUrl && item.facePicUrl.search("http") != -1) {
              var ImgObj = new Image();
              ImgObj.src = item.facePicUrl;
              setTimeout(() => {
                //没有图片，则返回-1
                if (
                  ImgObj.fileSize > 0 ||
                  (ImgObj.width > 0 && ImgObj.height > 0)
                ) {
                } else {
                  item.facePicUrl = require(`../../../../assets/img/nophoto.jpg`); //nophoto.jpg
                }
                arr[index]["imageUrl"] = item.facePicUrl;
              }, 1000);
            } else {
              item.facePicUrl = window.SITE_CONFIG.cloudUrl + item.facePicUrl;
              ImgObj = new Image();
              ImgObj.src = item.facePicUrl;
              setTimeout(() => {
                //没有图片，则返回-1
                if (
                  ImgObj.fileSize > 0 ||
                  (ImgObj.width > 0 && ImgObj.height > 0)
                ) {
                } else {
                  item.facePicUrl = require(`../../../../assets/img/nophoto.jpg`); //nophoto.jpg
                }
                arr[index]["imageUrl"] = item.facePicUrl;
              }, 1000);
            }
          });
          this.totalCount = data.data.totalCount;
          this.totalPage = data.data.totalPage;
          this.pageIndex = data.data.currPage;
          this.pageSize = data.data.pageSize;
          setTimeout(() => {
            this.dataList = data.data.list;
          }, 1500);
        } else {
          this.dataList = [];
          this.totalCount = 0;
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      // this.getDataList()
      this.getPagesChange();
    },
    // 当前页
    currentChangeHandle(val) {
      // console.log()
      this.pageIndex = val;
      // this.getDataList()
      this.getPagesChange();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    handleupDelete(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      // console.log(ids)

      this.$confirm(
        `确定对当前黑名单进行${id ? "删除" : "批量删除"}操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/risk/riskhumanblacklist/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
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
  },
};
</script>
<style lang="less" >
.riskhumanblack_content {
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
  .cardClass {
   height:calc(100% - 100px);
    overflow: auto;
    flex: 1;
    position: relative;
    ul {
      margin: 0;
      padding: 0;
    }
    ul li {
      list-style: none;
    }
    .list {
       //height: calc(100vh - 130px);
      display: flex;
      justify-content: space-between;
      align-content: space-between;
      padding: 10px;
      flex-wrap: wrap;
      .list:after {
        content: "";
        width: 33%;
        border: 1px solid transparent;
      }
        .colStaff {
    width: 33%;
    min-width: 400px;
    padding: 5px;
    border: 1px solid #eee;
    display: flex;
    margin-bottom: 10px;
    height: 220px;
    .el-image {
      width: 100%;
    }
    .right {
      ul {
        padding-left: 10px;
        li {
          line-height: 28px;
          text-align: left;
        }
      }
    }
  }
    }
  }

.footer{
       height: 50px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        padding: 0 10px 10px 0;
        border-top:1px solid #f2f4f6;
        box-shadow: 0px 4px 14px 2px rgba(54, 121, 225, 0.09);
        /deep/.el-pagination__total{
          font-size:16px;
        }
        /deep/.el-pagination__jump{
          margin-left:0px;
        }
}
}
</style>
