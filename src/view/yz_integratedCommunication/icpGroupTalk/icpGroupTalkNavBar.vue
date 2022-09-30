<!--@author：llp-->
<template>
  <div class="searchBar">
    <el-row>
      <el-col :span="8">
        <el-input
          :placeholder="placeholder"
          prefix-icon="el-icon-search"
          class="searchInput"
          v-model="searchText"
          @change="searchTextChange"
          @blur="handleSearch"
        >
          <template v-if="groupingIsShow" slot="prepend" style="background:rgba(211,215,219,1);">
            <el-button style="color: #606266">分组</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" class="searchButton is-plain" size="medium "  @click="handleSearch">搜索</el-button>
        <el-button v-if="advancedSearchIsShow" type="info" class="advancedSearchButton is-plain" size="medium ">高级搜索</el-button>
      </el-col>
      <el-col :span="12">
        <add-button v-if="addIsShow" @handleAdd="handleAdd"></add-button>
        <edit-button v-if="editIsShow" @handleEdit="handleEdit"></edit-button>
        <delete-button v-if="deleteIsShow" @handleDelete="handleDelete"></delete-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableButtonGroup from "@/yz_components/button/tableButtonGroup";
  import AddButton from "@/yz_components/button/addButton";
  import EditButton from "@/yz_components/button/editButton";
  import DeleteButton from "@/yz_components/button/deleteButton";

  export default {
    components: {TableButtonGroup, AddButton, DeleteButton, EditButton},
    props: ['placeholder'],
    name: "icpGroupTalkNavBar",
    data(){
      return{
        groupingIsShow: false,//是否显示分组按钮
        advancedSearchIsShow: false,//是否显示高级搜索按钮
        addIsShow: true,//是否显示添加按钮
        editIsShow: true,//是否显示修改按钮
        deleteIsShow: true,//是否显示删除按钮
        searchText: '',//搜索框内容
        searchBarIsShow:true,//是否显示搜索框
      }
    },
    methods:{
      //新增方法
      handleAdd() {
        this.$emit("handleAdd")
      },
      //修改方法
      handleEdit() {
        this.$emit("handleEdit")
      },
      //删除方法
      handleDelete() {
        this.$emit("handleDelete")
      },
      //搜索方法
      handleSearch() {
        this.$emit("handleSearch", this.searchText);
      },
      //搜索值改变方法
      searchTextChange() {
        this.$emit("searchText", this.searchText);
      },
    }
  }
</script>

<style scoped>
  .searchBar {
    width: 100%;
    height: 72px;
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
