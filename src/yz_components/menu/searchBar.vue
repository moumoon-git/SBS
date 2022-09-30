<template>
  <div class="searchBar">
    <el-row>
      <el-col :xs="14" :sm="14" :md="16" :lg="16" :xl="19">
        <el-input
          :placeholder="placeholder"
          prefix-icon="el-icon-search"
          class="searchInput"
          v-model="searchText"
          @change="searchTextChange"
          @blur="handleSearch"
        >
          <template v-if="groupingIsShow" slot="prepend" style="background:rgba(211,215,219,1);">
            <el-button style="color: #606266" @click="submittedSelect">分组</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :xs="10" :sm="10" :md="8" :lg="8" :xl="5" style="text-align: left;text-indent: 10px">
        <el-button type="primary" class="searchButton is-plain" size="medium " @click="handleSearch">搜索</el-button>
        <el-button v-if="advancedSearchIsShow" type="info" class="advancedSearchButton is-plain" size="medium ">高级搜索
        </el-button>
      </el-col>
    </el-row>

    <!--内层弹窗-->
    <el-dialog width="400px" :title="title" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
      <tree-search ref="treeSearch" @affirmDialog="affirmDialog" @cancelDialog="cancelDialog"></tree-search>
    </el-dialog>
  </div>
</template>

<script>
  import treeSearch from "@/view/eventManagement/eventHistory/plan/treeSearch"

  export default {
    props: ['placeholder'],
    components: {
      treeSearch
    },
    name: "searchBar",
    data() {
      return {
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        groupingIsShow: false,//是否显示分组按钮
        advancedSearchIsShow: false,//是否显示高级搜索按钮
        searchText: '',//搜索
        innerVisible: false,//内层是否弹窗
        title: "",
        groupId: '',//分组id
        searchType: '关键字查询'//查询类型
      }
    },
    methods: {
      handleSearch() {
        switch (this.searchType) {
          case '关键字查询':
            this.$emit("handleSearch", this.searchType, this.searchText);
            break;
          case '分组查询':
            this.$emit("handleSearch", this.searchType, this.groupId);
            this.searchType = '关键字查询';
            break
        }
      },
      searchTextChange() {
        this.$emit("searchText", this.searchText);
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 内层确认按钮
       */
      affirmDialog(filterText, filterId, typeData) {//内层确认按钮
        switch (typeData) {
          // case "政务联络网":
          case "phone":
            let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups"));
            let phoneGroup = contactorGroups.filter(el => el.code === "phone");
            let msg = "请选择政务联络网"
            if (phoneGroup.length > 0) {
              msg = `请选择${phoneGroup[0].name}`
            }
            if (filterId == '' || filterId == null) {
              this.$message({
                // message: '请选择政务联络网',
                message: msg,
                type: 'warning'
              });
            } else {
              this.searchType = '分组查询';
              this.groupId = filterId;
              this.searchText = filterText;
              this.innerVisible = false;
              this.handleSearch();
            }
            break;
          default:
            break;
        }
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // if (this.IsYangZhouProject) { // 扬州项目需求 政务联络网改为政务通信录 author:hexinting date:2020-9-26
        //   switch (typeData) {
        //     case "政务通信录":
        //       if (filterId == '' || filterId == null) {
        //         this.$message({
        //           message: '请选择政务通信录',
        //           type: 'warning'
        //         });
        //       } else {
        //         this.searchType = '分组查询';
        //         this.groupId = filterId;
        //         this.searchText = filterText;
        //         this.innerVisible = false;
        //         this.handleSearch();
        //       }
        //       break;
        //     default:
        //       break;
        //   }
        // } else {
        //   switch (typeData) {
        //     case "政务联络网":
        //       if (filterId == '' || filterId == null) {
        //         this.$message({
        //           message: '请选择政务联络网',
        //           type: 'warning'
        //         });
        //       } else {
        //         this.searchType = '分组查询';
        //         this.groupId = filterId;
        //         this.searchText = filterText;
        //         this.innerVisible = false;
        //         this.handleSearch();
        //       }
        //       break;
        //     default:
        //       break;
        //   }
        // }
      },
      cancelDialog() {//内层取消按钮
        this.innerVisible = false;
      },
      submittedSelect() {//分组
        this.$emit("submittedSelect")
      },
      dataUpdating(treeData, typeData) {
        this.$nextTick(() => {
          this.$refs.treeSearch.dataUpdating(treeData, typeData);
        });
      },
    }
  }
</script>

<style scoped>
  .searchBar {
    width: 100%;
    height: 70px;
    line-height: 70px;
    background: rgba(255, 255, 255, 1);
    border-radius: 3px;
  }

  .searchInput {
    background: rgba(255, 255, 255, 1);
    border-radius: 3px;
  }

  .searchButton {
    background: #409eff;
    color: white;
    border: #409eff;
    border-radius: 3px;
  }

  .searchButton:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    background: #66b1ff;
    border-color: #66b1ff;
    color: white;
  }

  .advancedSearchButton {
    color: #A2A2A2;
    border: white;
    background: rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .advancedSearchButton:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    background: #909399;
    border-color: #909399;
    color: #fff;
  }
</style>
