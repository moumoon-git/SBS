<template>
  <div class="seeOrUpdata_template">
    <el-dialog title="短信模板" :visible.sync="dialogFormVisible" width="900px" append-to-body center>
      <el-row>
        <el-col :span="7">
          <operation-tree
            :list="modifiedUserList"
            :listProps="modifiedUserProps"
            @handleNodeClick="handleNodeClick"
            @refreshData="getDataList"
          ></operation-tree>
        </el-col>

        <el-col :span="17">
          <template-content ref="templateData" @upData="getDataList" @closeDialog='dialogVisible'></template-content>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import operationTree from "./operationTree";
import templateContent from "./template_content";
import { treeDataTranslate } from "@/utils";

export default {
  name: "seeOrUpdata_template",
  components: {
    "operation-tree": operationTree,
    "template-content": templateContent
  },
  data() {
    return {
      dialogFormVisible: false,
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      }
    };
  },
  watch: {},
  methods: {
    getDataList() {
      this.dialogFormVisible = true;
      this.$http({
        url: this.$http.adornUrl("/message/messagetemple/listtemple"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          //  console.log('data.data++++++++++++++++++++++++++++++++++++++',data.data)
          this.modifiedUserList = treeDataTranslate(data.data, "id");
        }else {
          this.$message.error(data.msg);
        }
      });
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      // console.log(obj);
      // 查询树形关联的信息
      this.$http({
        url: this.$http.adornUrl(`/message/messagetemple/selecttemplebyid`),
        method: "POST",
        data: this.$http.adornData({
          id: obj.id
        })
      }).then(({ data }) => {
        if (data && data.code == 0) {
            this.$refs.templateData.getContent(data.data);
        }else {
          this.$message.error(data.msg);
        }
      });
    },
    // 关闭模板弹窗
    dialogVisible(){
      this.dialogFormVisible = false
    }
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
/deep/ .el-dialog--center{
  border-radius: 8px;
  .el-dialog__header{
    background-color: #01a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close{
        color: #d1f9fb; 
      }
    }
    span{
      color: #d1f9fb; 
    }
  }
  .el-dialog__body{
    padding: 0 !important;
  }
}


</style>
