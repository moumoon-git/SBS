<template>
  <div class="sms-tree">
    <el-dialog
      title="选择通讯录"
      :visible.sync="dialogFormVisible"
      width="1060px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="changeDialog"
    >
      <el-tabs v-model="activeAllModel" :style="rightHeightStyle" @tab-click="changePage">
        <el-tab-pane
          :label="item.label"
          :name="(index+1).toString()"
          v-for="(item,index) in tabArr"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
      <el-row :gutter="20" style="padding:0 40px 15px;">
        <el-col :span="8">
          <address-group
            ref="addressGroup"
            :list="modifiedUserList"
            :listProps="modifiedUserProps"
            @handleNodeClick="handleNodeClick"
            :currentTab="activeAllModel"
            @selectCommonlyContactor="selectCommonlyContactor"
            @selectRecentlyContactor="selectRecentlyContactor"
          ></address-group>
        </el-col>
        <el-col :span="9">
          <div style="height:500px;border:1px solid #ccc;">
            <all-contact
              :searchText="searchText"
              :dataList="platShareMenuList"
              @selectData="getSelectData"
              @searchResult="searchResult"
              @delRepy="delRepy"
              @initContact="initContact"
            ></all-contact>
            <!-- 最近联系人使用该分页 start -->
            <el-pagination
              v-if="isRecentContactor"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
            <!-- 最近联系人使用该分页 end -->
            <el-pagination
              v-else
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-col>
        <el-col :span="7">
          <select-contact
            :allSelectData="allSelectData"
            :judge="judge"
            v-bind="$attrs"
            @initContact="initContact"
            v-on="$listeners"
            @delIt="delIt"
            @delAll="delAll"
          ></select-contact>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body>
      <div style="background-color: #fffada;padding: 5px 20px;margin-bottom: 40px;">
        <p>该分组包含多个子分组和联系人，删除该分组将同时移除该分组相关联系人。</p>
      </div>

      <p style="text-align:center;">是否删除该分组?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { treeDataTranslate } from "@/utils";
import AddressGroup from "./AddressGroup";
import AllContact from "./AllContact";
import SelectContact from "./SelectContact";
import { mapGetters } from "vuex";
import {replaceContactorGroupsConfig} from '@/assets/js/yz_common.js'

export default {
  name: "save_template",
  inheritAttrs: false,
  components: {
    AddressGroup,
    AllContact,
    SelectContact
  },
  computed: {
    ...mapGetters({
      smsOrFax: "getSmsOrFax"
    })
  },
  data() {
    return {
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      isRecentContactor: false, // 是否是最近联系人（用来判断分页）
      // 通讯录分组
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },

      // 通讯录人员
      search: "",
      selectedNode: [],
      platShareMenuList: [],
      pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
      page: 1,
      total: 0,
      dialogFormVisible: false,
      form: {
        region: [],
        name: "",
        desc: ""
      },
      value: "",
      //  保存模板参数
      parentId: "",

      delGroupView: false,
      currentTreeId: [],

      allSelectData: [], //选中联系人

      currentCheck: [], //当前选中联系人

      judge: "", //判断点击的是联系人还是负责人
      activeAllModel: "1", //tabs选项
      tabArr: [
        { 
          label: "政务联络网",
          code: 'phone',
          enabled: true
        },
        { 
          label: "应急联动网",
          code: 'linkage',
          enabled: true
        },
        { 
          label: "基层联络网",
          code: 'gliaison',
          enabled: true
        },
        { 
          label: "备勤联络网",
          code: 'dutyGroup',
          enabled: true
        },
        { 
          label: "资源联络网",
          code: 'resource',
          enabled: true
        },
        { 
          label: "短信分组",
          code: 'sms',
          enabled: true
        },
        { 
          label: "快捷组",
          code: 'quick',
          enabled: true
        }
      ],
      phoneGroupList: [ // 电话-分组列表
        { 
          label: "政务联络网",
          code: 'phone',
          enabled: true
        },
        { 
          label: "应急联动网",
          code: 'linkage',
          enabled: true
        },
        { 
          label: "基层联络网",
          code: 'gliaison',
          enabled: true
        },
        { 
          label: "备勤联络网",
          code: 'dutyGroup',
          enabled: true
        },
        { 
          label: "资源联络网",
          code: 'resource',
          enabled: true
        },
        { 
          label: "电话快捷组",
          code: 'phoneQuick',
          enabled: true
        }
      ],
      smsGroupList: [ // 短信-分组列表
        { 
          label: "政务联络网",
          code: 'phone',
          enabled: true
        },
        { 
          label: "应急联动网",
          code: 'linkage',
          enabled: true
        },
        { 
          label: "基层联络网",
          code: 'gliaison',
          enabled: true
        },
        { 
          label: "备勤联络网",
          code: 'dutyGroup',
          enabled: true
        },
        { 
          label: "资源联络网",
          code: 'resource',
          enabled: true
        },
        { 
          label: "短信分组",
          code: 'faxgroup',
          enabled: true
        },
        { 
          label: "快捷组",
          code: 'quick',
          enabled: true
        }
      ],
      faxGroupList: [ // 传真-分组列表
        { 
          label: "政务联络网1111",
          code: 'phone',
          enabled: true
        },
        { 
          label: "应急联动网",
          code: 'linkage',
          enabled: true
        },
        { 
          label: "基层联络网",
          code: 'gliaison',
          enabled: true
        },
        { 
          label: "备勤联络网",
          code: 'dutyGroup',
          enabled: true
        },
        { 
          label: "资源联络网",
          code: 'resource',
          enabled: true
        },
        { 
          label: "传真分组",
          code: 'faxgroup',
          enabled: true
        },
        { 
          label: "快捷组",
          code: 'quick',
          enabled: true
        }
      ],
      // tabArr: window.g.IsYangZhouProject ? [
      //   { label: "政务通信录" },
      //   { label: "应急通信录" },
      //   // { label: "基层联络网" },
      //   // { label: "备勤联络网" },
      //   // { label: "资源联络网" },
      //   { label: "短信分组" },
      //   { label: "快捷组" }
      // ] : [
      //   { label: "政务联络网" },
      //   { label: "应急联动网" },
      //   { label: "基层联络网" },
      //   { label: "备勤联络网" },
      //   { label: "资源联络网" },
      //   { label: "短信分组" },
      //   { label: "快捷组" }
      // ],
      rightHeightStyle: {
        display: "flex",
        "flex-direction": "column"
      }, // 切换样式
      // tabName: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网",
      tabName: "政务联络网",
      tabCode: "phone",
      groupId: "", //组Id
      type: false,
      searchText: "", // 搜索框的值
    };
  },
  mounted() {
    this.isFaxOrSmsOrPhone();
  },
  created() {
    this.getPhoneGroupingTree();
    console.log('传真or短信', this.smsOrFax)
    // if (this.smsOrFax === "fax") {
    //   this.tabArr = this.IsYangZhouProject ? [
    //     { label: "政务通信录" },
    //     { label: "应急通信录" },
    //     // { label: "基层联络网" },
    //     // { label: "备勤联络网" },
    //     // { label: "资源联络网" },
    //     { label: "传真分组" },
    //     { label: "快捷组" }
    //   ] : [
    //     { label: "政务联络网" },
    //     { label: "应急联动网" },
    //     { label: "基层联络网" },
    //     { label: "备勤联络网" },
    //     { label: "资源联络网" },
    //     { label: "传真分组" },
    //     { label: "快捷组" }
    //   ];
    // }
    // if (this.smsOrFax === "phone") {
    //   this.tabArr = this.IsYangZhouProject ? [
    //     { label: "政务通信录" },
    //     { label: "应急通信录" },
    //     // { label: "基层联络网" },
    //     // { label: "备勤联络网" },
    //     // { label: "资源联络网" },
    //     { label: "常用联系人" },
    //   ] : [
    //     { label: "政务联络网" },
    //     { label: "应急联动网" },
    //     { label: "基层联络网" },
    //     { label: "备勤联络网" },
    //     { label: "资源联络网" },
    //     { label: "电话快捷组" },
    //   ];
    // }
    // if (this.smsOrFax === "sms") {
    //   this.tabArr = this.IsYangZhouProject ? [
    //     { label: "政务通信录" },
    //     { label: "应急通信录" },
    //     // { label: "基层联络网" },
    //     // { label: "备勤联络网" },
    //     // { label: "资源联络网" },
    //     { label: "短信分组" },
    //     { label: "快捷组" }
    //   ] : [
    //     { label: "政务联络网" },
    //     { label: "应急联动网" },
    //     { label: "基层联络网" },
    //     { label: "备勤联络网" },
    //     { label: "资源联络网" },
    //     { label: "短信分组" },
    //     { label: "快捷组" }
    //   ];
    // }
  },
  watch: {
    currentCheck(newV, oldV) {
      let delData = [];
      if (!this.type) {
        if (newV.length > oldV.length) {
          newV = this.delRepy(newV);
          // console.log(this.allSelectData)
          this.allSelectData = this.allSelectData.concat(
            [...newV].filter(x => [...oldV].every(y => y.id !== x.id))
          );
        } else {
          newV = this.delRepy(newV);
          delData = [...oldV].filter(x => [...newV].every(y => y.id !== x.id)); //要删除的数据
          this.allSelectData = [...this.allSelectData].filter(x =>
            [...delData].every(y => y.id !== x.id)
          );
        }
      }
    }
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-11-05
     * @lastEditor hexinting
     * @lastDate 2020-11-05
     * @description 判断传真，短信，电话
     */
    isFaxOrSmsOrPhone() {
      switch(this.smsOrFax) {
        case "fax":
          // this.tabArr = [
          //   { label: "政务联络网" },
          //   { label: "应急联动网" },
          //   { label: "基层联络网" },
          //   { label: "备勤联络网" },
          //   { label: "资源联络网" },
          //   { label: "传真分组" },
          //   { label: "快捷组" }
          // ];
          // this.tabArr = this.faxGroupList;
          this.tabArr = replaceContactorGroupsConfig(this.faxGroupList, "label");
          break;
        case "sms":
          // this.tabArr = [
          //   { label: "政务联络网" },
          //   { label: "应急联动网" },
          //   { label: "基层联络网" },
          //   { label: "备勤联络网" },
          //   { label: "资源联络网" },
          //   { label: "短信分组" },
          //   { label: "快捷组" }
          // ];
          // this.tabArr = this.smsGroupList;
          this.tabArr = replaceContactorGroupsConfig(this.smsGroupList, "label");
          break;
        case "phone":
          // this.tabArr = [
          //   { label: "政务联络网" },
          //   { label: "应急联动网" },
          //   { label: "基层联络网" },
          //   { label: "备勤联络网" },
          //   { label: "资源联络网" },
          //   { label: "电话快捷组" },
          // ];
          // this.tabArr = this.phoneGroupList;
          this.tabArr = replaceContactorGroupsConfig(this.phoneGroupList, "label");
          break;
        default:
          break;
      }
      console.log('!!!!!!', this.tabArr)
    },
    /**
     * @author hexinting
     * @date 2020-11-05
     * @lastEditor hexinting
     * @lastDate 2020-11-05
     * @description 初始化分组配置
     */
    initContactorGroupsConfig() {
      this.tabArr = replaceContactorGroupsConfig(this.tabArr); // 根据后端返回分组，替换联系人大分组名字配置
      console.log('---------tabArr', this.tabArr);
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-05
     * @description 分组切换
     */
    changePage() {
      this.$refs.addressGroup.tabPosition = 0 // 改变tabPosition，让最近联系人的字体颜色还原
      this.searchText = ""; // 清空搜索框数据
      this.isRecentContactor = false; // 不触发最近联系人按钮，为false
      this.page = 1;
      this.pageSize = window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
      this.total = 0;
      // console.log(this.activeAllModel);
      this.platShareMenuList = [];
      if (this.activeAllModel == 2) {
        this.formData4 = {
          //常用联系人
          searchText: this.searchText, //搜索
          currentPage: 1,
          total: 0, //数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData: null, //表格选择数据
          tableData: [], //表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {}
        };
        this.getEmergencyAddressBookTree();
        this.tabName = this.IsYangZhouProject ? '应急通信录' : '应急联动网';
        this.tabCode = "linkage"
      } else if (this.activeAllModel == 3) {
        this.formData5 = {
          //基层联络
          searchText: this.searchText, //搜索
          currentPage: 1,
          total: 0, //数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData: null, //表格选择数据
          tableData: [], //表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {}
        };
        this.gliaisonGroupList();
        this.tabName = "基层联络网";
        this.tabCode = "gliaison"
      } else if (this.activeAllModel == 4) {
        this.formData6 = {
          //基层联络
          searchText: this.searchText, //搜索
          currentPage: 1,
          total: 0, //数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData: null, //表格选择数据
          tableData: [], //表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {}
        };
        this.dutyGroupList();
        this.tabName = "备勤联络网";
        this.tabCode = "dutyGroup"
      } else if (this.activeAllModel == 5) {
        this.formData7 = {
          //基层联络
          searchText: this.searchText, //搜索
          currentPage: 1,
          total: 0, //数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData: null, //表格选择数据
          tableData: [], //表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {}
        };
        this.getResourceGroupingTree(5);
        this.tabName = "资源联络网";
        this.tabCode = "resource"
      } else if (this.activeAllModel == 1) {
        this.tabName = this.IsYangZhouProject ? "政务通信录" : "政务联络网";
        this.tabCode = "phone"
        this.getPhoneGroupingTree(1);
      } else if (this.activeAllModel == 6) {
        if (this.smsOrFax === "fax") {
          this.formData3 = {
            //传真分组
            searchText: this.searchText, //搜索
            currentPage: 1,
            total: 0, //数据总数
            pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
            rowData: null, //表格选择数据
            tableData: [], //表格数据
            treeData: [],
            myLoading: false,
            groupId: 0 //分组id
          };
          this.getFaxGroupData();
          this.tabName = "传真分组";
          this.tabCode = "faxgroup"
        }else if (this.smsOrFax === "sms") {
          this.formData3 = {
            //短信分组
            searchText: this.searchText, //搜索
            currentPage: 1,
            total: 0, //数据总数
            pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
            rowData: null, //表格选择数据
            tableData: [], //表格数据
            treeData: [],
            myLoading: false,
            groupId: 0 //分组id
          };
          this.getSmsGroupListTree(3);
          this.tabName = "短信分组";
          this.tabCode = "sms"
        }else if (this.smsOrFax === "phone") {
          this.formData3 = {
            //电话分组
            searchText: this.searchText, //搜索
            currentPage: 1,
            total: 0, //数据总数
            pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
            rowData: null, //表格选择数据
            tableData: [], //表格数据
            treeData: [],
            myLoading: false,
            groupId: 0 //分组id
          };
          this.getPhoneGroupData();
          this.tabName = this.IsYangZhouProject ? "常用联系人" : "电话快捷组";
          this.tabCode = "phoneQuick"
        }
      } else if (this.activeAllModel == 7) {
          this.formData8 = {
            //基层联络
            searchText: this.searchText, //搜索
            currentPage: 1,
            total: 0, //数据总数
            pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
            rowData: null, //表格选择数据
            tableData: [], //表格数据
            myLoading: false,
            treeData: [],
            treeDataItem: {}
          };
          this.getShortcutGroupData();
          this.tabName = "快捷组";
          this.tabCode = "quick"
        } 
    },
    //电话分组树
    getPhoneGroupingTree(key) {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$http({
        url: window.SITE_CONFIG['baseUrl'] + '/mail/mailgroup/list',
        method: 'get',
        params:data
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data.data || [];
      });
    },
    //应急通讯录架构树
    getEmergencyAddressBookTree() {
      let data = {
        id: 0
      };
      let CallbackReload = this;
      this.$api
        .getBriefsByClassId(data, CallbackReload)
        .then(result => {
          if (result) {
            this.modifiedUserList = [];
            for (let n in result.data) {
              this.modifiedUserList.push({
                id: result.data[n].id,
                name: result.data[n].name + "通讯录",
                versionId: result.data[n].versionId,
                children: []
              });
              let data = {
                id: result.data[n].versionId
              };
              this.$api.getStructTree(data, this).then(res => {
                this.modifiedUserList[n].children = res.data;
              });
            }
          }
        })
        .catch(err => {});
    },
    // 基层通讯录架构树
    gliaisonGroupList() {
      let data = {
        displayDefault: true
      };
      this.$api.gliaisonGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 备勤通讯录架构树
    dutyGroupList() {
      let data = {
        displayDefault: true
      };
      this.$api.dutyGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 资源通讯录架构树
    getResourceGroupingTree(key) {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.resourceGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    //获取短信分组
    getSmsGroupListTree(key) {
      let data = {
        displayDefault: true
      };
      this.$api.smsGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }

        this.modifiedUserList = res.data || [];
      });
    },
    // 获取传真分组数据
    getFaxGroupData() {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.faxGroupList(data).then(res => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 获取电话快捷组数据
    getPhoneGroupData() {
        let data = {
            displayDefault: true
        };
        this.$api.phoneQuickGroupList(data).then(res => {
            if (res.errorcode != 0) {
            this.$message({
                message: res.msg,
                type: "error"
            });
            return;
        };
        this.modifiedUserList = res.data || [];
        });
      /*this.$http({
          url: window.g.ApiUrl + "/eos/communication/group/phoneQuickGroupList",
          headers:{'Authorization':sessionStorage.getItem("machineId")},
          method: "post",
          data: {
            displayDefault: true
          }
        }).then((res) => {
          this.modifiedUserList = res.data.data || [];
        });*/
    },
    getShortcutGroupData(key) {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.shortcutGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 通讯录树型数据
    // getTreeList() {
    //   this.$http({
    //     url: this.$http.adornUrl("/mail/mailgroup/list"),
    //     method: "get"
    //   }).then(({ data }) => {
    //     // console.log(data)
    //     if (data && data.code == 0) {
    //       this.modifiedUserList = data.data;
    //       this.initContact();
    //     }
    //   });
    // },
    // // 初始化通讯录人员
    initContact() {
      if (this.activeAllModel == 1) {
        this.getContactorList();
      } else if (this.activeAllModel == 2) {
        //如果没有父级节点，则查应急通讯录
        this.getEmergencyAddressData();
      } else if (this.activeAllModel == 3) {
        this.getContactorList();
      } else if (this.activeAllModel == 4) {
        this.getContactorList();
      } else if (this.activeAllModel == 5) {
        this.getContactorList();
      } else if (this.activeAllModel == 6) {
        this.getContactorList();
      } else if (this.activeAllModel == 7) {
          this.getContactorList();
      }
    },
    /** 
     * 获取对应模块联系人
     * obj: 点击树的节点对象
     * author: hexinting
     * activeAllModel: 1(政务联络网), 2(应急联动网), 3(基层联络网), 4(备勤联络网), 5(资源联络网), 6(短信分组 or 传真分组), 7(快捷组)
     */
    getAllModuleContactors(obj) {
      this.groupId = obj.id; // 树id， 分组id
      if (this.activeAllModel == 1 || 
          this.activeAllModel == 3 || 
          this.activeAllModel == 4 || 
          this.activeAllModel == 5 || 
          this.activeAllModel == 6 || 
          this.activeAllModel == 7) 
      {
        this.getContactorList();
      } else if (this.activeAllModel == 2) { // 应急联动网
        // 应急联动网
        //如果没有父级节点，则查应急通讯录
        this.getEmergencyAddressData();
      }
    },
    /**
     * 点击树形节点事件
     * obj: 点击树的节点对象
     * author: hexinting
     */
    handleNodeClick(obj) {
      this.isRecentContactor = false;
      this.page = 1;
      this.pageSize = window.g.IsZengChengProject ? 40 : 10; //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
      this.total = 0;
      this.searchText = "";
      this.getAllModuleContactors(obj); // 获取对应模块联系人
    },
    /**
     * @param {type} underfine
     * @return {type} underfine
     * @descripttion: 获取政务联系人数据
     */
     //获取政务联系人数据
    getContactorList() {
      // this['formData' + this.tabPosition].rowData = null;
      var dictType = "";
      switch (Number(this.activeAllModel)) {
        case 1:
          dictType = "governmentAffairs";
          break;
        case 3:
          dictType = "primaryLevel";
          break;
        case 4:
          dictType = "spareTime";
          break;
        case 5:
          dictType = "resource";
          break;
        case 6:
          if (this.smsOrFax === "fax") {
            dictType = "faxgroup";
          } else {
            dictType = "sms";
          }
          break;
        case 7:
          dictType = "quick";
          break;
      }
      let assData = {
        dictType,
        groupId: this.groupId,
        page: this.page,
        size: this.pageSize,
        searchText: this.searchText,
      };
      let obj = {};
      console.log('this.smsOrFax: ', this.smsOrFax);
      // if (this.activeAllModel == 1) {
        switch (this.smsOrFax) {
          case "fax":
            obj = {
              type: "fax",
            };
            break;
          case "sms":
            obj = {
              type: "sms",
            };
            break;
          case "phone":
            obj = {
              type: "phone",
            };
            break;
          default:
            break;
        }
      // }
      let data = Object.assign(assData, obj);
      console.log('data: ', data);

      this.$api.contactorList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        if (res.data) {
          this.platShareMenuList = res.data.list || [];
          this.total = res.data.totalCount;
        }
      });
    },
    /**
     * @lastEidtor hexinting 
     * @lastDate 2020-11-13
     * @description 获取应急通讯录联系人
     */
    getEmergencyAddressData() {
      let data = {};
      if (this.smsOrFax === 'fax') {
          data = {
              searchText: this.searchText,
              id: this.groupId,
              page: this.page,
              size: this.pageSize,
              isTop: true,
              type: 'fax',
          };
      } else if (this.smsOrFax === 'sms') {
          data = {
              searchText: this.searchText,
              id: this.groupId,
              page: this.page,
              size: this.pageSize,
              isTop: true,
              type: 'sms',
          };
      } else { // bug8097 author:hexinting date:20201113
          data = {
              searchText: this.searchText,
              id: this.groupId,
              page: this.page,
              size: this.pageSize,
              isTop: true,
              type: 'phone',
          };
      }
      this.$api.emergencyAddressBook(data).then(res => {
        if (res.errorcode != 0) {
          this.message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.platShareMenuList = res.data.data || [];
        this.total = res.data.totalElements;
      });
    },
    /**
     * @description: 联系人数据回显
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 17:14
     * @param {*} type 确定按钮返回数据的事件名
     * @param {*} receiverData 要回显的数据
     * @return {*}
     */
    getDataList(type, receiverData) {
      this.judge = type;
      this.dialogFormVisible = true;
      setTimeout(() => {
        if (receiverData) {
          this.currentCheck = receiverData;
        }
      });
    },
    getId(value) {
      this.parentId = value;
    },
    onSubmit() {
      // console.log(this.allSelectData)
      // this.$http({
      //   url: this.$http.adornUrl("/message/messageGroup/saveMessageContactorGroup"),
      //   method: "post",
      //   data: this.$http.adornData({
      //     phone: this.allSelectData.map(v=>v.mobile1?v.mobile1:v.phone).join(''),
      //     parentId: this.parentId?this.parentId:0,
      //     name: this.form.name,
      //     userIds: this.allSelectData.map(v=>v.id).join(''),
      //     messageGroup: [],
      //     mailGroup: [],
      //     id: -1,
      //   })
      // }).then(({ data }) => {
      //   console.log(data)
      //   if (data && data.code == 0) {
      //     this.$message({
      //       message: "保存分组成功",
      //       type: "success"
      //     });
      this.dialogFormVisible = false;

      //     this.$root("getDataList",1)

      //     //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
      //   }
      // });
      // this.$emit("addContact",this.allSelectData.map(v=>v.id))
    },
    delView(currentTreeId) {
      this.delGroupView = true;
      this.currentTreeId = currentTreeId;
    },
    delGroupHandle() {
      this.$http({
        url: this.$http.adornUrl(`/message/messageGroup/delete`),
        method: "POST",
        data: this.$http.adornData(
          {
            ids: [this.currentTreeId]
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$emit("refreshData");
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: "删除失败"
          });
        }
      });
    },
    getSelectData(val, type) {
      this.type = type; //是否点击树
      this.currentCheck = val;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-9-25
     * @param {String} 输入框关键字搜索
     * @return {type} underfine
     * @descripttion: 根据关键字搜索通讯录
     */
    searchResult(val) {
        this.searchText = val;
        this.page = 1;
        this.pageSize = window.g.IsZengChengProject ? 40 : 10; //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        this.total = 0;
        if (this.activeAllModel == 2) {
            // 应急联系人
            if (this.groupId === '') {
                this.$message({
                    type: 'warning',
                    message: '请先选择节点',
                });
                return false;
            }
            this.getEmergencyAddressData({ id: this.groupId });
        } else {
            this.getAllModuleContactors({ id: '' });
        }
    },
    // 过滤选中的数据
    delRepy(filterData) {
      for (let i = 0; i < filterData.length; i++) {
        if (filterData[i] === undefined) {
          filterData.splice(i, 1);
          i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
        }
      }
      return filterData;
    },
    // 删除选中
    delIt(id) {
      // console.log('this.currentCheck: ', this.currentCheck);
      this.currentCheck = this.currentCheck.filter(x => x.id != id);
      this.allSelectData = this.allSelectData.filter(x => x.id != id);
    },
    // 删除所有
    delAll() {
      this.currentCheck = [];
      this.allSelectData = [];
    },
    // 关闭弹窗
    changeDialog() {
      this.$emit("changeDialog");
    },
    // 页数尺寸改变
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.getAllModuleContactors({ id: this.groupId });
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.page = val;
      this.getAllModuleContactors({ id: this.groupId });
    },
    //获取最近联系人
    selectRecentlyContactor() {
      this.isRecentContactor = true;
      this.page = 1;
      this.pageSize = 1000; // 设置一个最大值
      this.searchText = '';
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/contactor/recentContactorPage`,
        method: 'post',
        data: this.$http.adornParams({
          page: this.page,
          search: this.search,
          status: 0,
        }),
      }).then(res => {
        if (res.data.errorcode != 0) {
          this.$message({
            message: res.data.msg,
            error: "error"
          });
          return;
        }
        res.data.data.data.forEach(item => {
          item.meetingType = "";
          item.name = item.contactName || '';
          item.id = item.i_id;
          item.mobile1 = item.mobile || item.vc_called;
        });
        setTimeout(() => {
          console.log("执行定时器内容");
          this.platShareMenuList = res.data.data.data || [];
          this.total = res.data.data.totalElements;
        }, 800);
      });
    },
    //获取常用联系人
    selectCommonlyContactor() {
      let data = {
        searchText: this.searchText,
        page: this.page,
        size: this.pageSize,
        type: "sms"
      };
      this.$api.commonContactorList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            error: "error"
          });
          return;
        }
        this.platShareMenuList = res.data.data || [];
        this.total = res.data.totalElements;
      });
    }
  }
};
</script>

<style scoped lang="scss">
// * {
//   margin: 0;
//   padding: 0;
// }
.el-form-item {
  margin: 10px 0;
}

.serchWrap {
  padding: 8px 10px;
  height: 50px;
  // min-height: 60px;
  // height: 7vh;
  display: flex;
  justify-content: flex-end;
  button {
    width: 25%;
    height: 35px;
    border-radius: 5px;
    background: rgb(14, 142, 190);
    color: #fff;
    border: none;
    font-size: 15px;
    border: 1px solid lightblue;
    /*font-family: "KatTi";*/
    /*letter-spacing: 5px;*/
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
//  /deep/ .el-input{
//       width: 310px;
//   }

/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: rgba(241, 244, 246, 1) !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: rgba(173, 182, 194, 1);
      }
    }
    span {
      color: #333333;
      padding-left: 20px;
      font-size: 15px;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}

/deep/ .el-tabs__nav-wrap {
  background-color: #f9fbff;
  padding: 0 25px;
}

// 分页样式
/deep/ .el-pagination {
  width: 100%;
  padding: 2px 0;
  text-align: right;
  button {
    min-width: initial;
    padding: 0 5px;
  }
  .el-pagination__sizes {
    margin: 0 10px 0 0;
    min-width: initial;
  }
  .el-select .el-input {
    margin: 0;
  }
  .el-pager li {
    min-width: 20.5px;
  }
  .el-pagination__jump {
    margin: 0;
  }
}

.opertion {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
