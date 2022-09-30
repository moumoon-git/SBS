/*
 * @Author: liukanglin 
 * @Date: 2020-09-01
 */
<template>
  <div class="sv-page__container">
    <slot name="left__container">
      <div
        class="sv-page-left-content__container"
        :class="{'sv-page-left-content__collapse':leftCollaspe}"
      >
        <div class="sv-page-left-content__collapse" @click="leftCollaspe=!leftCollaspe">
          <div class="sv-page-left-content__collapse__icon"></div>
        </div>
        <slot name="left__content">
          <div class="sv-page-left-content__header">
            <sv-tree-tab
              v-if="tabList.length > 0"
              :tabList="tabList"
              @switch="
                                getTree($event, null)
                                // 切换标签时，模拟点击全部
                                treeClick({id:0})
                            "
            ></sv-tree-tab>
            <sv-input-tree-search width="calc(100% - 20px)" @change="getTree(null, $event)"></sv-input-tree-search>
          </div>
          <div class="sv-page-left-content__tree" v-loading="treeLoading">
            <el-tree
              ref="tree"
              node-key="id"
              :data="treeList"
              :props="treeProps"
              :show-checkbox="moreButtonActive"
              :highlight-current="true"
              :current-node-key="0"
              @node-click="treeClick"
            ></el-tree>
          </div>
        </slot>
      </div>
    </slot>
    <slot name="right__container">
      <div class="sv-page-right-content__container">
        <div class="sv-page-right-content__header">
          <span class="sv-page-right-content__header__title">{{title}}</span>
          <slot name="right__operation">
            <slot name="right__select"></slot>
            <slot name="right__button"></slot>
          </slot>
        </div>
        <div class="sv-page-right-content__table">
          <el-table ref="table" :data="tableList" border v-loading="tableLoading" height="100%">
            <!-- 1. 勾选框，当“更多”按钮激活时显示 -->
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50px"
              v-if="moreButtonActive"
            ></el-table-column>
            <!-- 2. 每行数据的序号 -->
            <el-table-column
              label="序号"
              type="index"
              header-align="center"
              align="center"
              width="50px"
            ></el-table-column>
            <!-- 3. 其他内容 -->
            <slot name="right__table"></slot>
          </el-table>
        </div>
        <div class="sv-page-right-content__footer">
          <slot name="right__footer">
            <el-pagination
              :total="paginationConfig.totalCount"
              :current-page="paginationConfig.currentIndex"
              :page-size="paginationConfig.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, prev, pager, next, sizes, jumper"
              @size-change="pageSizeChange"
              @current-change="currentIndexChange"
            ></el-pagination>
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "wasteManagement-template",
  props: {
    // 左边的标签名列表
    tabList: {
      type: Array,
      default: () => [],
    },
    // 左边树的接口列表
    treeAPI: {
      type: Array,
      default: () => [],
    },
    // 树形数据结构配置
    treeProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "name",
        value: "id",
        disabled: (data) => data.id == 0,
      }),
    },
    // 右边的标题
    title: {
      type: String,
      default: "标题名",
    },
    // 请求表格数据的参数
    tableRequest: {
      type: Object,
      default: () => ({
        api: "",
        request: {},
      }),
    },
  },
  methods: {
    /**
     * @method
     * @desc 获取树形数据
     * @param {Number} tabIndex 当前标签下标
     * @param {String} keyword 搜索关键词
     */
    getTree(tabIndex, keyword) {
      tabIndex == null
        ? (tabIndex = this.activeTab)
        : (this.activeTab = tabIndex);
      this.treeLoading = true;
      const request = {
        url: this.$http.adornUrl(this.treeAPI[tabIndex]),
        method: "get",
        params: this.$http.adornParams({
          name: keyword,
        }),
      };
      this.$http(request).then((res) => {
        console.log(res, ...res.data.data);
        this.treeList = [
          {
            id: 0,
            name: "全部",
            children: null,
          },
          //   ...res.data.data,
          ...this.structureTreeData,
        ];
        this.treeLoading = false;
      });
    },

    /**
     * @method
     * @desc 树形点击时，传递选项的id
     * @return {Number} id 树节点数据的id
     * @return {Number} activeTab 当前激活的标签下标
     */
    treeClick(nodeObj) {
      this.paginationConfig.currentIndex = 1;
      const id = nodeObj.id == 0 ? null : nodeObj.id;
      this.$emit("treeClick", id, this.activeTab);
    },

    /**
     * @method
     * @desc 获取树勾选的节点
     * @return {Array} 所有已勾选的节点的id的数组
     */
    getTreeChecked() {
      const ids = this.$refs.tree.getCheckedKeys().filter((item) => item !== 0);
      return ids;
    },

    /**
     * @method
     * @desc 获取表格数据列表
     * @param {Object} tableRequest 接口地址，以及axios请求参数
     */
    getTableList(tableRequest) {
      switch (tableRequest) {
        // 切换到第一页
        case 1:
          let tableData = this.tableData.slice(0, 10);
          this.tableList = tableData;
          break;
        // 切换到第二页
        case 2:
          let tableData2 = this.tableData.slice(10, 11);
          this.tableList = tableData2;
          break;
        // 将显示数切换为10/页
        case 10:
          let tableData10 = this.tableData.slice(0, 10);
          this.tableList = tableData10;
          break;
        // 将显示数切换为20/页
        case 20:
          this.tableList = this.tableData;
          break;
        // 将显示数切换为50/页
        case 50:
          console.log(this.tableData);
          this.tableList = this.tableData;
          break;
        // 将显示数切换为100/页
        case 100:
          this.tableList = this.tableData;
          break;
        default:
          this.tableList = this.tableData.slice(0, 10);
      }
      //   this.tableList = this.tableData;
      this.paginationConfig.totalCount = this.tableData.length;
      // this.tableLoading = true
      // const data = Object.assign(
      //     {},
      //     tableRequest.param,
      //     {
      //         page: this.paginationConfig.currentIndex,
      //         limit: this.paginationConfig.pageSize
      //     }
      // )
      // const request = {
      //     url: `${window.SITE_CONFIG.baseUrl}/${tableRequest.api}`,
      //     method: 'post',
      //     data
      // }
      // this.$http(request).then(
      //     res => {
      //         this.tableList = res.data.page.list
      //         this.paginationConfig.totalCount = res.data.page.totalCount
      //         this.tableLoading = false
      //     }
      // )
    },

    /**
     * @method
     * @desc 获取表格勾选的数据
     * @return {Array} 所有已勾选的行的数据的数组
     */
    getTableChecked() {
      const rows = this.$refs.table.selection;
      return rows;
    },

    /**
     * @method
     * @desc 分页器每页显示数量变更
     */
    pageSizeChange(val) {
      console.log(val, "val数量");
      this.paginationConfig.pageSize = val;
      if (val == 10) {
        this.getTableList(10);
      } else if (val == 20) {
        this.getTableList(20);
      } else if (val == 50) {
        this.getTableList(50);
      } else if (val == 100) {
        this.getTableList(100);
      }
      //   this.getTableList(this.tableRequest);
    },

    /**
     * @method
     * @desc 分页器页跳转
     */
    currentIndexChange(val) {
      console.log(val, "val跳转");
      this.paginationConfig.currentIndex = val;
      if (val == 1) {
        this.getTableList(1);
      } else if (val == 2) {
        this.getTableList(2);
      }
      //   this.getTableList(this.tableRequest);
    },
  },
  data() {
    return {
      // 当前激活的标签
      activeTab: 0,
      // 树形数据列表
      treeList: [],
      // 树形数据请求中
      treeLoading: false,
      // 左边栏折叠
      leftCollaspe: false,
      // 更多按钮是否激活，激活时显示树形和表格勾选框
      moreButtonActive: false,
      // 表格数据请求中
      tableLoading: false,
      // 返回的表格数据列表
      tableList: [],
      // 分页器配置
      paginationConfig: {
        currentIndex: 1,
        totalCount: 0,
        pageSize: 10,
      },
      // 左边结构树数据
      structureTreeData: [
        {
          id: 1,
          name: "沙河街道",
          children: [
            {
              id: 2,
              name: "西街社区",
              children: null,
            },
            {
              id: 3,
              name: "左竹园社区",
              children: null,
            },
          ],
        },
        {
          id: 4,
          name: "沙东街道",
          children: null,
        },
        {
          id: 5,
          name: "长兴街道",
          children: null,
        },
      ],
      // 右边表格数据
      tableData: [
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
        {
          sortName: "龙岗路34号小区1号定时投放点",
          community: "西街社区",
          village: "龙岗路34号小区",
          communityNtoufangature: "物业小区",
          deliveryPointMode: "定时投放点",
          delegate: "物业",
          positionDescribe: "龙岗路34号大院1-2栋之间",
        },
      ],
    };
  },
  mounted() {
    // 获取树形数据
    this.getTree();
    // 获取表格数据
    this.getTableList(this.tableRequest);
  },
};
</script>