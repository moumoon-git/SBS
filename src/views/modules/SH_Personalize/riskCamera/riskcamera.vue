<template>
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
      :tableRequest="tableRequest"
      :dateSelect="false"
      title="摄像机管理"
      :searchSetting="{
        width: '200',
        placeholder: '请输入相机名称搜索',
      }"
    >
      <template #middle__operation__select>
        <sv-select
          placeholder="请选择相机分类"
          v-model="cameraType"
          :options="cameraSelect"
          @change="typeChange"
        ></sv-select>
      </template>
      <template #middle__operation__button>
        <div
          class="sv-button-more"
          :class="isFocus ? 'sv-button-more__focus' : 'sv-button-more__unfocus'"
        >
          <div @click="boxCheck">
            <span>更多</span>
            <span class="sv-icon-triangle"></span>
          </div>
          <div class="sv-button-more__content">
            <div class="sv-button-more__content__item-header">导出</div>
            <div class="sv-button-more__content__item" @click="planpdf()">
              导出抓拍相机数据
            </div>

            <div class="sv-button-more__content__line"></div>
            <!-- <el-upload
                class="sv-button-more__content__item"
                action
                :http-request="uploadSectionFile"
                :show-file-list="false"
           >导入</el-upload> -->

            <!-- 导入 -->
            <el-upload
              class="sv-button-more__content__item"
              action
              :http-request="uploadSectionFile"
              :show-file-list="false"
            >
              导入抓拍相机数据
            </el-upload>

            <div class="sv-button-more__content__line"></div>
            <div class="sv-button-more__content__item" @click="exportExcel()">
              下载模板
            </div>
          </div>
        </div>

        <!-- 导出 -->
        <!-- <sv-button @click="exportExcel()" type="primary" 
        >导出数据模板</sv-button
      >
        <sv-button
        @click="planpdf()"
      
        type="primary"
      
        >导出抓拍相机数据</sv-button
      > -->

        <sv-button
          v-if="isAuth('risk:riskcamera:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增</sv-button
        >
      </template>
      <template #middle__table>
        <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="相机名称"
        ></el-table-column>
        <!-- <el-table-column prop="address" header-align="center" align="center" label></el-table-column> -->
        <el-table-column
          prop="longitude"
          header-align="center"
          align="center"
          label="经度"
        ></el-table-column>
        <el-table-column
          prop="latitude"
          header-align="center"
          align="center"
          label="纬度"
        ></el-table-column>
        <el-table-column
          prop="cameraTypeString"
          header-align="center"
          align="center"
          label="摄像头类型"
        >
          <!-- <template slot-scope="scope">
            {{
              cameraSelect.find((item) => item.value == scope.row.cameraType) ==
              null
                ? ""
                : cameraSelect.find(
                    (item) => item.value == scope.row.cameraType
                  ).label
            }}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="indexCode"
          header-align="center"
          align="center"
          label="设备编号"
        ></el-table-column>
        <el-table-column
          prop="crossingId"
          header-align="center"
          align="center"
          label="卡口编码"
        ></el-table-column>
        <el-table-column
          prop="businessCode"
          header-align="center"
          align="center"
          label="业务编码"
        ></el-table-column>
        <el-table-column
          prop="hardwareCode"
          header-align="center"
          align="center"
          label="硬件编码"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="状态"
          width="70"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.status == 1">启用</span>
            <span v-if="scoped.row.status == 0">未启用</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="80"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button> -->
            <sv-table-operation
              :display="[
                isAuth('risk:riskcamera:update') ? 'edit' : '',
                isAuth('risk:riskcamera:delete') ? 'delete' : '',
              ]"
              @edit="addOrUpdateHandle(scope.row.id)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <!-- 删除提示 -->
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteHandle(deleteIds)"
    />
  </div>
</template>

<script>
import AddOrUpdate from "./riskcamera-add-or-update";
import riskcameraTree from "./riskcamera-tree";
import EventtypeAddOrUpdate from "./riskcamera-tree-crud";
import { treeDataTranslate } from "@/utils";
import Template_content from "../../sys/combined/note/sms_send/sms_send_form/seeOrUpdata_template/template_content.vue";

export default {
  data() {
    return {
      treeSetting: {
        tab: [],
        api: "/risk/riskcameragroup/tree",
        edit: {
          add: "/risk/riskcameragroup/save",
          update: "/risk/riskcameragroup/update",
          delete: true
        },
      },
      tableRequest: {
        api: "/risk/riskcamera/list",
        params: {
          cameraType: this.cameraType,
          groupId: [],
        },
      },

      isFocus: false,
      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name",
      },
      selectedNode: new Array(),
      search: "",
      treeForm: {
        // 分组名字
        currentTreename: "",
        // 分组描述
        groupingdescription: "",
        type: 0,
      },
      // 修改||查看分组弹出框
      dialogVisible: false,
      // 修改分组或者查看分组
      dialogtitle: "",
      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
      checkedNodes: [],
      // 树形勾选框选中的id
      checkedIds: [],
      // 事件类型窗口
      eventtypeAddOrUpdateVisible: false,
      Treeexpansion: false,
      statusData: [
        { value: 1, label: "启用" },
        { value: 0, label: "未启用" },
      ],
      dataForm: {
        key: "",
        enclosure: "",
        fileName: "",
      },
      // 表单验证
      rules: {
        currentTreename: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字", trigger: "blur" },
        ],
      },
      typeData: [
        {
          id: 0,
          name: "部门",
        },
        {
          id: 1,
          name: "义工",
        },
      ],
      shareTown: [], // 镇街
      shareTownId: "", // 镇街id
      sharePlatform: [], // 小区
      sharePlatformId: "", // 小区id
      cameraSelect: [
        {
          value: "",
          label: "",
        },
      ],
      cameraType: "", //相机类型
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      obj: {}, //点击获取到的树节点数据
    };
  },
  components: {
    AddOrUpdate,
    riskcameraTree,
    EventtypeAddOrUpdate,
  },
  created() {
    this.getCameraType();
    this.getTownList();
    //this.getDataList();
  },

  methods: {
    /**
     * @description: 点击更多显示下拉框以及树形和表格的勾选框
     * @param {*}
     * @return {*}
     */
    boxCheck() {
      this.$refs.template.treeCheck = !this.$refs.template.treeCheck;
      this.$refs.template.tableCheck = !this.$refs.template.tableCheck;
      this.isFocus = !this.isFocus;
    },
    /**
     * @description: 选择摄像机类型后更新表格
     * @param {type}
     * @return {type}
     */
    typeChange() {
      this.tableRequest.params.cameraType = this.cameraType;
      this.$refs.template.getTableList(this.tableRequest);
    },
    //获取摄像头类型
    getCameraType() {
      this.cameraSelect = [
        {
          value: "",
          label: "",
        },
      ];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=VIDEO_CAMERA_TYPE`
        ),
        method: "get",
      }).then(({ data }) => {
        data.data.forEach((item) => {
          this.cameraSelect.push({ value: item.code, label: item.name });
        });
      });
      console.log("this.cameraSelect",this.cameraSelect)
    },
    // 镇街
    getTownList() {
      //console.log('本平台用户信息:', this.$store.state.user)
      // console.log('本平台的路由:',this.$route.meta.menuId)
      this.$http({
        url: this.$http.adornUrl("/sys/systown/list"),
        method: "post",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          // console.log("getTownList", data);

          // 说明有共享数据
          if (data.list.length > 0) {
            this.shareTown = data.list;
          }
        })
        .then(() => {});
    },
    //镇街决定平台
    handleChangeTown() {
      // console.log("shareTownId", this.shareTownId);
      if (this.shareTownId != null && this.shareTownId != "") {
        this.$http({
          url: this.$http.adornUrl("/event/eventShare/selectShareMenuByTownId"),
          method: "post",
          params: this.$http.adornParams({
            townId: this.shareTownId,
            myPlatformId: this.$store.state.user.platformId,
            platformMenuId: this.$route.meta.menuId,
          }),
        })
          .then(({ data }) => {
            // console.log("getSharePlatformList", data);

            // 说明有共享数据
            if (data.list.length > 0) {
              this.sharePlatform = data.list;
            } else {
              this.sharePlatformId = "";
              this.sharePlatform = [];
              //重新初始化事件类型
              this.eventTypeId = "";
              this.eventtypelist = [];
            }
          })
          .then(() => {});
      } else {
        this.sharePlatformId = "";
        this.sharePlatform = [];
        //重新初始化事件类型
        this.eventTypeId = "";
        this.eventtypelist = [];
      }
    },
    // 导出数据模板
    exportExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie
        .substring(document.cookie.indexOf("token="))
        .substring("6");
      // window.open(
      //   `${httpaddress}//risk/riskhumanblacklist/get-template?token=${this.$cookie.get('token')}`
      // )
      // console.log("导出",`${httpaddress}//risk/riskcamera/get-template?token=${this.$cookie.get('token')}`)
      window.location.href = `${httpaddress}//risk/riskcamera/get-template?token=${this.$cookie.get(
        "token"
      )}`;
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    // 选择小区
    handleChangePlatform() {
      // console.log("sharePlatformId", this.sharePlatformId);
      if (
        (this.sharePlatformId != null && this.sharePlatformId != "") ||
        this.cameraType
      ) {
        this.getDataList();
      } else {
        this.getDataList();
        this.sharePlatformId = "";
      }
    },
    // 自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      // console.log("parma////////", param);
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/risk/riskcamera/input-excel`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          if (!data.code && data.errorData.length == 0) {
            this.$message({
              message: `${data.msg}`,
              type: "success",
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            this.getDataList();
          } else if (!data.code && data.errorData.length != 0) {
            // this.$message.error(`${data.msg}`);
            let str = document.createElement("div");
            data.errorData.forEach((item) => {
              let cdiv = document.createElement("div");
              cdiv.innerHTML = item.errorMsg;
              cdiv.style.marginTop = "10px";
              str.appendChild(cdiv);
            });
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<div>${data.msg}</div>${str.innerHTML}`,
              type: "error",
            });
          } else {
            this.$message.error("导入失败,请检查文件格式");
          }
        })
        .catch((err) => {
          // alert(err);
        });
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    // 导出
    planpdf() {
      var rows = this.$refs.template.getTableChecked();
      var selectIds = rows.map((item) => item.id);
      console.log("rows", rows, selectIds);
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie
        .substring(document.cookie.indexOf("token="))
        .substring("6");
      // console.log(token);

      if (!selectIds.length) {
        this.$message({
          message: "请选择一个抓拍相机进行导出",
          type: "warning",
        });
      } else {
        // console.log(this.dataListSelections.join(','))
        // console.log("导出",`${httpaddress}//risk/riskcamera/output-excel?ids=${this.dataListSelections.join(
        //   ","
        // )}&token=${this.$cookie.get('token')}`)
        window.location.href = `${httpaddress}//risk/riskcamera/output-excel?ids=${selectIds.join(
          ","
        )}&token=${this.$cookie.get("token")}`;
      }
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    /**
     * @description: 使用模板不需要在这里通过接口拿数据，因此将之前的代码都注释了
     * @param {*}
     * @return {*}
     */
    // 获取数据列表
    getDataList() {
      this.$refs.template.getTableList(this.tableRequest);
      // this.dataListLoading = true;
      // this.$http({
      //   url: this.$http.adornUrl("/risk/riskcameragroup/tree"),
      //   method: "get",
      // }).then(({ data }) => {
      //   this.modifiedUserList = treeDataTranslate(data.tree, "id");
      // });
      // this.$http({
      //   url: this.$http.adornUrl("/risk/riskcamera/list"),
      //   method: "get",
      //   params: this.$http.adornParams({
      //     page: this.pageIndex,
      //     limit: this.pageSize,
      //     key: this.dataForm.key,
      //     platformId: this.sharePlatformId,
      //     cameraType: this.cameraType,
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     data.page.list.forEach((item, index, arr) => {
      //       if (item.status) {
      //         arr[index]["statusName"] = this.statusData.find(
      //           (items) => items.value === item.status
      //         ).label;
      //       } else {
      //         arr[index]["statusName"] = "未知";
      //       }
      //     });
      //     // console.log(this.dataList)
      //     this.dataList = data.page.list;
      //     if (this.dataList.length > 0) {
      //       this.dataList.map((v) => {
      //         // switch (v.cameraType) {
      //         //   case 0:
      //         //     v.cameraType = "人的摄像头";
      //         //     break;
      //         //   case 1:
      //         //     v.cameraType = "车的摄像头";
      //         //     break;
      //         //   case 2:
      //         //     v.cameraType = "预览的摄像头";
      //         //     break;
      //         //   default:
      //         //     v.cameraType = "";
      //         // }
      //         this.cameraSelect.forEach((item) => {
      //           // console.log("下拉框数据", item.value, v.cameraType);
      //           if (item.value == v.cameraType) {
      //             // console.log("下拉框数据", item.value, v.cameraType);
      //             v.cameraType = item.label;
      //           }
      //         });
      //       });
      //     }
      //     this.totalPage = data.page.totalCount;
      //   } else {
      //     this.dataList = [];
      //     this.totalPage = 0;
      //   }
      //   this.dataListLoading = false;
      // });
    },
    /**
     * @description: 函数获取selectedNode逻辑没变，更改了刷新页面的方法，因为树的结构在点击全部的时候返回null,所以加了判断处理
     * @param {*}
     * @return {*}
     */
    // 点击树形节点事件
    handleNodeClick(obj) {
      // console.log("handleNodeClick",obj)
      this.obj = obj; //保存树节点数据
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
      if (obj == null) {
        this.selectedNode = [];
      } else {
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
      }
      this.tableRequest.params.groupId = this.selectedNode;
      this.$refs.template.getTableList(this.tableRequest);
      // console.log('selectedNode:' + this.selectedNode)
      // console.log(this.currentTreeObject)
      // console.log(this.treeForm.currentTreename)
      // 查询树形关联的联系人
      // this.$http({
      //   url: this.$http.adornUrl(`/risk/riskcamera/list`),
      //   method: "POST",
      //   data: this.$http.adornData({
      //     key: this.dataForm.key,
      //     cameraType: this.cameraType,
      //     limit: this.pageSize,
      //     page: 1,
      //     groupId: this.selectedNode,
      //   }),
      // }).then(({ data }) => {
      //   data.page.list.forEach((item, index, arr) => {
      //     if (item.status) {
      //       arr[index]["statusName"] = this.statusData.find(
      //         (items) => items.value === item.status
      //       ).label;
      //     } else {
      //       arr[index]["statusName"] = "未知";
      //     }
      //   });
      //   this.totalCount = data.page.totalCount;
      //   this.currPage = data.page.currPage;
      //   this.pageSize = data.page.pageSize;
      //   this.platShareMenuList = data.page.list;
      //   this.dataList = data.page.list;
      // });
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
    /**
     * @description: 多加了分组内是否还有数据的判断
     * @param {*}
     * @return {*}
     */
    /**
     * @method
     * @desc 删除树分组
     */  
    deleteEventType(data) {
        var that = this;
        let arr = this.$refs.template.getTreeNodeChildren(data.id);
        console.log("this.$refs.template.getTreeNodeChildren(data.id)",this.$refs.template.getTreeNodeChildren(data.id))
        this.$http({
            url: this.$http.adornUrl("/risk/riskcamera/list"),
            method: "post",
            data: this.$http.adornData({
                cameraType: this.cameraType,
                groupId: arr,
            }),
        }).then(({ data }) => {
            if (data && data.code === 0) {
                if (data.page.list.length > 0) {
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
                                    `/risk/riskcameragroup/delete`
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
    // // 删除分组
    // deleteEventType(ids) {
    //   var that = this;
    //   if (this.$refs.template.tableList.length > 0) {
    //     this.$alert("请先删除分组里的内容", "提醒", {
    //       confirmButtonText: "确定",
    //     });
    //     return;
    //   }
    //   this.$confirm(`确定对进行[删除]操作?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     var checkedNames = "";
    //     if (that.selectedNode.length > 0) {
    //       that.selectedNode.forEach((item) => {
    //         if (item.system === 1) {
    //           checkedNames += item.name;
    //         }
    //       });
    //     } else {
    //       this.$message({
    //         message: "请勾选选择框进行删除",
    //         type: "warning",
    //       });
    //       return;
    //     }

    //     setTimeout(() => {
    //       if (checkedNames) {
    //         that.$message({
    //           message: `${checkedNames}删除失败`,
    //           type: "error",
    //           duration: 1500,
    //         });
    //         return 0;
    //       }
    //       that
    //         .$http({
    //           url: that.$http.adornUrl(`/risk/riskcameragroup/delete`),
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
    //             that.$refs.template.getTree();
    //             that.$refs.template.getTableList(this.tableRequest);
    //           } else {
    //             that.$message.error(data.msg);
    //           }
    //         });
    //     });
    //   });
    // },
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
      // console.log(val);

      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val.map((item) => {
        return item.id;
      });
      console.log(this.dataListSelections);
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.treeGroupName = this.obj
          ? this.obj.name
            ? this.obj.name
            : ""
          : ""; //获取树节点分组的名字
        this.$refs.addOrUpdate.treeGroupId = this.obj
          ? this.obj.id
            ? this.obj.id
            : ""
          : ""; //获取树节点分组的Id
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        // `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        `确定对要进行[删除]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/risk/riskcamera/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.$refs.template.getTableList(this.tableRequest);
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
<style scoped lang="less">
.sv-button-more {
  display: inline-block;
  position: relative;
  width: 57px;
  height: 30px;
  margin-left: 5px;
  line-height: 30px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  color: #666666;
  user-select: none;
  cursor: pointer;
  .sv-button-more__content {
    position: absolute;
    top: 30px;
    right: 0;
    width: 160px;
    z-index: 1;
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.5s;
    background: #ffffff;
    box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 5px 0;
    .sv-button-more__content__item-header {
      color: #999999;
      text-align: left;
      padding: 21px 0 15px 20px;
      line-height: 14px;
      cursor: auto;
    }
    .sv-button-more__content__item {
      text-align: left;
      padding: 13px 20px 15px 20px;
      line-height: 14px;
      &:hover {
        background: rgba(0, 145, 255, 0.1);
      }
      /deep/ .el-upload--text {
        width: 150px;
        text-align: left;
      }
    }
    .sv-button-more__content__line {
      border-bottom: 1px solid #e6e6e6;

      height: 13px;
      margin: 0 auto;
      margin-bottom: 14px;
      cursor: auto;
    }
  }
  .sv-icon-triangle {
    position: relative;
    bottom: 3px;
    display: inline-block;
    width: 1px;
    height: 1px;
    border: 4px solid #b4b4b4;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(45deg);
    transition: all 0.5s ease;
  }
  &.sv-button-more__unfocus:hover {
    border-color: #b4b4b4;
  }
  &.sv-button-more__focus {
    border-color: #0091ff;
    .sv-icon-triangle {
      bottom: -1px;
      transform: rotate(-135deg);
    }
    .sv-button-more__content {
      z-index: 100;
      transform: scaleY(1);
    }
  }
}
.tableClass {
  padding: 3px;
  /* border: 1px solid rgba(230, 230, 230, 1); */
  width: 82%;
  margin-left: 20px;
  min-width: 540px;
  /**
       * @author liukanglin
       * @date 2020.09.02
       */
  // 修改按钮及悬浮情况
  .button-updata {
    display: inline-block;
    width: 18px;
    height: 19px;
    cursor: pointer;
    background: no-repeat
      url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aOO6Zmp5o6S5p+lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5beh5p+l5bel5Y2V566h55CGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMwNy4wMDAwMDAsIC0yMjAuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzQuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC03IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy4wMDAwMDAsIDExMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg1Ni4wMDAwMDAsIDkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNS43NjYyLDUuMTEwOCBDMTUuOTE1MzE0OSw0Ljk2ODg5MTY3IDE1Ljk5OTcyMDEsNC43NzIwNDc2MSAxNS45OTk3MjAxLDQuNTY2MiBDMTUuOTk5NzIwMSw0LjM2MDM1MjM5IDE1LjkxNTMxNDksNC4xNjM1MDgzMyAxNS43NjYyLDQuMDIxNiBMMTMuOTc4NCwyLjIzMzggQzEzLjgzNjQ5MTcsMi4wODQ2ODUwNyAxMy42Mzk2NDc2LDIuMDAwMjc5OTIgMTMuNDMzOCwyLjAwMDI3OTkyIEMxMy4yMjc5NTI0LDIuMDAwMjc5OTIgMTMuMDMxMTA4MywyLjA4NDY4NTA3IDEyLjg4OTIsMi4yMzM4IEwxMS40ODkyLDMuNjMzOCBMMTQuNDQzMiw2LjU4NzggTDE1Ljc2NjIsNS4xMTA4IEwxNS43NjYyLDUuMTEwOCBaIE0yLDEzLjA0NiBMMiwxNiBMNC45NTU0LDE2IEwxMy41MTA4LDcuMzY2MiBMMTAuNTU2OCw0LjQxMjIgTDIsMTMuMDQzMiBMMiwxMy4wNDYgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    &:hover {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTQ8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNzQuMDAwMDAwLCAtMzMwLjAwMDAwMCkiIGZpbGw9IiMwMDkxRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtN+Wkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCAxODYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3ODQuMDAwMDAwLCA0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljc2NjIsNS4xMTA4IEMxNS45MTUzMTQ5LDQuOTY4ODkxNjcgMTUuOTk5NzIwMSw0Ljc3MjA0NzYxIDE1Ljk5OTcyMDEsNC41NjYyIEMxNS45OTk3MjAxLDQuMzYwMzUyMzkgMTUuOTE1MzE0OSw0LjE2MzUwODMzIDE1Ljc2NjIsNC4wMjE2IEwxMy45Nzg0LDIuMjMzOCBDMTMuODM2NDkxNywyLjA4NDY4NTA3IDEzLjYzOTY0NzYsMi4wMDAyNzk5MiAxMy40MzM4LDIuMDAwMjc5OTIgQzEzLjIyNzk1MjQsMi4wMDAyNzk5MiAxMy4wMzExMDgzLDIuMDg0Njg1MDcgMTIuODg5MiwyLjIzMzggTDExLjQ4OTIsMy42MzM4IEwxNC40NDMyLDYuNTg3OCBMMTUuNzY2Miw1LjExMDggTDE1Ljc2NjIsNS4xMTA4IFogTTIsMTMuMDQ2IEwyLDE2IEw0Ljk1NTQsMTYgTDEzLjUxMDgsNy4zNjYyIEwxMC41NTY4LDQuNDEyMiBMMiwxMy4wNDMyIEwyLDEzLjA0NiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
    }
  }
  // 删除按钮及悬浮情况
  .button-delect {
    display: inline-block;
    width: 18px;
    height: 19px;
    cursor: pointer;
    background: no-repeat
      url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aOO6Zmp5o6S5p+lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5beh5p+l5bel5Y2V566h55CGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMzMS4wMDAwMDAsIC0yMjAuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuMDAwMDAwLCAxMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4NTYuMDAwMDAwLCA5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5Yig6ZmkaWNvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1LjUwOTgzOTksMy45OTI0MTkwOCBMMTIuNTA1NTM2OSwzLjk5MjQxOTA4IEwxMi41MDU1MzY5LDMuMDYzNjQ1MTkgQzEyLjUwNDY2NDUsMi4zNTU0Njg5MyAxMi4xNjA5Njg2LDIgMTEuMzM4MTcxMywyIEw2LjczODcyMDE2LDIgQzUuOTEwNjczMTIsMiA1LjQ5ODg1NDY4LDIuMzU1NDY4OTMgNS40OTg4NTQ2OCwzLjA2MzY0NTE5IEw1LjQ5ODg1NDY4LDMuOTkyNDE5MDggTDIuNDkxNDgxMSwzLjk5MjQxOTA4IEMyLjIxNDU4Nzg4LDMuOTkyNDE5MDggMiw0LjI1MTUyODQ1IDIsNC40ODc4NDA2IEMyLDQuNzI0ODk5NiAyLjIxNTQ2MDIzLDUgMi40OTE0ODExLDUgTDE1LjUwODk2NzUsNSBDMTUuNzg0OTg4NCw1IDE2LDQuODMwNzAxNCAxNiw0LjQ4Nzg0MDYgQzE2LDQuMjU5MjY2NzMgMTUuODM2NjEzMyw0LjA5NDEyNjIzIDE1LjUwOTgzOTksMy45OTI0MTkwOCBaIE0xMy41MDExNzE0LDYgTDQuNTAwNTY4NTEsNiBDNC4zNjc1NTAzLDYgNC4yNDA2NjE4Myw2LjA1MjU4NzA5IDQuMTQ2MTQ4ODksNi4xNTAzOTY0NCBDNC4wNTMzOTM5Nyw2LjI0OTEyNDM1IDQsNi4zNzkyMTQyMyA0LDYuNTIwMzc1OTUgTDQsMTQuNDM1ODE0OSBDNCwxNS4zMDg2NTIyIDQuNjczODUsMTYuMDE4MTY3OCA1LjUwMDgzNDI5LDE2LjAxODE2NzggTDEyLjUwMTc5MjQsMTYuMDE4MTY3OCBDMTMuMzI4Nzc2NywxNi4wMTgxNjc4IDE0LDE1LjMwODY1MjIgMTQsMTQuNDM1ODE0OSBMMTQsNi41Mjg2NzU3MiBDMTQuMDAwODY4Nyw2LjIzNzExNzU2IDEzLjc3NzcwOTMsNi4wMDA5MTg1NSAxMy41MDExNzE0LDYgTDEzLjUwMTE3MTQsNiBaIiBpZD0iQ29tYmluZWQtU2hhcGUiIGZpbGw9IiM5RkM4RkUiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjAwMDY3ODksMTMuNTQwMjY4MSBDMTEuMDAwNjc4OSwxMy43OTU1ODY5IDEwLjc3NjE2NDYsMTQgMTAuNTAwNzc2LDE0IEMxMC4yMjM2NDEyLDE0IDEwLDEzLjc5NTU4NjkgMTAsMTMuNTQwMjY4MSBMMTAsOC40NjA1NTA2NyBDMTAsOC4yMDUyMzE4MiAxMC4yMjM2NDEyLDggMTAuNTAwNzc2LDggQzEwLjc3NzAzNzcsOCAxMS4wMDA2NjMzLDguMjA2MDM2MiAxMS4wMDA2NjMzLDguNDYwNTUwNjcgTDExLjAwMDY2MzMsMTMuNTQwMjY4MSBMMTEuMDAwNjc4OSwxMy41NDAyNjgxIFoiIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOC4wMDA2Nzg4NiwxMy41NDAyNjgxIEM4LjAwMDY3ODg2LDEzLjc5NTU4NjkgNy43NzYxNjQ1OCwxNCA3LjUwMDc3NTk5LDE0IEM3LjIyMzY0MTE3LDE0IDcsMTMuNzk1NTg2OSA3LDEzLjU0MDI2ODEgTDcsOC40NjA1NTA2NyBDNyw4LjIwNTIzMTgyIDcuMjIzNjQxMTcsOCA3LjUwMDc3NTk5LDggQzcuNzc3MDM3NjksOCA4LjAwMDY2MzI3LDguMjA2MDM2MiA4LjAwMDY2MzI3LDguNDYwNTUwNjcgTDguMDAwNjYzMjcsMTMuNTQwMjY4MSBMOC4wMDA2Nzg4NiwxMy41NDAyNjgxIFoiIGlkPSJQYXRoLUNvcHkiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    &:hover {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTU8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTguMDAwMDAwLCAtMzMwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzNC4wMDAwMDAsIDk4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTflpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2LjAwMDAwMCwgMTg2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzg0LjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUuNTA5ODM5OSwzLjk5MjQxOTA4IEwxMi41MDU1MzY5LDMuOTkyNDE5MDggTDEyLjUwNTUzNjksMy4wNjM2NDUxOSBDMTIuNTA0NjY0NSwyLjM1NTQ2ODkzIDEyLjE2MDk2ODYsMiAxMS4zMzgxNzEzLDIgTDYuNzM4NzIwMTYsMiBDNS45MTA2NzMxMiwyIDUuNDk4ODU0NjgsMi4zNTU0Njg5MyA1LjQ5ODg1NDY4LDMuMDYzNjQ1MTkgTDUuNDk4ODU0NjgsMy45OTI0MTkwOCBMMi40OTE0ODExLDMuOTkyNDE5MDggQzIuMjE0NTg3ODgsMy45OTI0MTkwOCAyLDQuMjUxNTI4NDUgMiw0LjQ4Nzg0MDYgQzIsNC43MjQ4OTk2IDIuMjE1NDYwMjMsNSAyLjQ5MTQ4MTEsNSBMMTUuNTA4OTY3NSw1IEMxNS43ODQ5ODg0LDUgMTYsNC44MzA3MDE0IDE2LDQuNDg3ODQwNiBDMTYsNC4yNTkyNjY3MyAxNS44MzY2MTMzLDQuMDk0MTI2MjMgMTUuNTA5ODM5OSwzLjk5MjQxOTA4IFogTTEzLjUwMTE3MTQsNiBMNC41MDA1Njg1MSw2IEM0LjM2NzU1MDMsNiA0LjI0MDY2MTgzLDYuMDUyNTg3MDkgNC4xNDYxNDg4OSw2LjE1MDM5NjQ0IEM0LjA1MzM5Mzk3LDYuMjQ5MTI0MzUgNCw2LjM3OTIxNDIzIDQsNi41MjAzNzU5NSBMNCwxNC40MzU4MTQ5IEM0LDE1LjMwODY1MjIgNC42NzM4NSwxNi4wMTgxNjc4IDUuNTAwODM0MjksMTYuMDE4MTY3OCBMMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEMxMy4zMjg3NzY3LDE2LjAxODE2NzggMTQsMTUuMzA4NjUyMiAxNCwxNC40MzU4MTQ5IEwxNCw2LjUyODY3NTcyIEMxNC4wMDA4Njg3LDYuMjM3MTE3NTYgMTMuNzc3NzA5Myw2LjAwMDkxODU1IDEzLjUwMTE3MTQsNiBMMTMuNTAxMTcxNCw2IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuMDAwNjc4OSwxMy41NDAyNjgxIEMxMS4wMDA2Nzg5LDEzLjc5NTU4NjkgMTAuNzc2MTY0NiwxNCAxMC41MDA3NzYsMTQgQzEwLjIyMzY0MTIsMTQgMTAsMTMuNzk1NTg2OSAxMCwxMy41NDAyNjgxIEwxMCw4LjQ2MDU1MDY3IEMxMCw4LjIwNTIzMTgyIDEwLjIyMzY0MTIsOCAxMC41MDA3NzYsOCBDMTAuNzc3MDM3Nyw4IDExLjAwMDY2MzMsOC4yMDYwMzYyIDExLjAwMDY2MzMsOC40NjA1NTA2NyBMMTEuMDAwNjYzMywxMy41NDAyNjgxIEwxMS4wMDA2Nzg5LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjAwMDY3ODg2LDEzLjU0MDI2ODEgQzguMDAwNjc4ODYsMTMuNzk1NTg2OSA3Ljc3NjE2NDU4LDE0IDcuNTAwNzc1OTksMTQgQzcuMjIzNjQxMTcsMTQgNywxMy43OTU1ODY5IDcsMTMuNTQwMjY4MSBMNyw4LjQ2MDU1MDY3IEM3LDguMjA1MjMxODIgNy4yMjM2NDExNyw4IDcuNTAwNzc1OTksOCBDNy43NzcwMzc2OSw4IDguMDAwNjYzMjcsOC4yMDYwMzYyIDguMDAwNjYzMjcsOC40NjA1NTA2NyBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY3ODg2LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgtQ29weSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
    }
  }
}
</style>
