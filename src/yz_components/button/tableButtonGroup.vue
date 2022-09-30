<template>
  <div>
    <refresh-button v-if="refreshIsShow" @handleRefresh="handleRefresh"></refresh-button>
    <add-button v-if="addIsShow" @handleAdd="handleAdd"></add-button>
    <edit-button v-if="editIsShow" @handleEdit="handleEdit"></edit-button>
    <delete-button v-if="deleteIsShow" @handleDelete="handleDelete"></delete-button>
    <export-template-button  v-if="exportTemplateIsShow" @handleExport="handleExport"></export-template-button>
    <el-button type="primary" icon="el-icon-download" v-if="exportContactorIsShow" @click="handleExportContactor">导出</el-button>
    <el-button type="primary" icon="el-icon-sort" v-if="sortIsShow" @click="handleSort">排序</el-button>
    <batch-join-button ref="BatchJoinButton" v-if="batchJoinIsShow" :groupType="groupType" :pId="pId"
                       @refreshData="refreshData"
                       @handleBatchJoin="handleBatchJoin"></batch-join-button>
  </div>
</template>

<script>
  import AddButton from "@/components/button/addButton";
  import EditButton from "@/components/button/editButton";
  import DeleteButton from "@/components/button/deleteButton";
  import BatchJoinButton from "@/components/button/batchJoinButton";
  import RefreshButton from "@/components/button/refreshButton";
  import SortButton from "@/components/button/sortButton";
  import ExportTemplateButton from "@/components/button/exportTemplateButton";

  export default {
    name: "tableButtonGroup",
    components: {ExportTemplateButton,AddButton,DeleteButton, EditButton, SortButton, RefreshButton, BatchJoinButton},
    data() {
      return {
        refreshIsShow: false,//是否显示刷新按钮
        sortIsShow: false,//是否显示排序按钮
        addIsShow: true,//是否显示新增按钮
        editIsShow: true,//是否显示编辑按钮
        deleteIsShow: true,//是否显示删除按钮
        batchJoinIsShow: false,//是否显示批量加入按钮
        exportTemplateIsShow:false,//是否显示导出模板按钮
        exportContactorIsShow:false,//是否根据分组显示导出联系人按钮
        groupType:"",//分组类型
        pId:""//分组id
      }
    },
    methods: {
      //刷新方法
      handleRefresh() {
        this.$emit("handleRefresh")
      },
      //排序方法
      handleSort() {
        this.$emit("handleSort")
      },
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
      //批量加入方法
      handleBatchJoin() {
        this.$nextTick(()=>{
          this.$refs.BatchJoinButton.groupType = this.groupType;
          this.$refs.BatchJoinButton.groupId = this.groupId;
        })
      },
      //导出联系人模板方法
      handleExport(){
        location.href = window.g.ApiUrl + "/eos/communication/contactor/export?groupId=-1";
      },
      //根据分组导出联系人
      handleExportContactor(){
        this.$emit("handleExportContactor");
      },
      refreshData(){
        this.$emit("refreshData");
        this.$emit("refreshTableData");
      }
    }
  }
</script>

<style scoped>

</style>
