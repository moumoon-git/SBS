<template>
  <div class="seeOrUpdata_template">
    <el-dialog title="短信模板" :visible.sync="dialogFormVisible" width="700px">
      <el-row>
        <el-col :span="12">
          <operation-tree
            :list="modifiedUserList"
            :listProps="modifiedUserProps"
            @handleNodeClick="handleNodeClick"
            style="margin-right:10px;"
            @refreshData="getDataList"
          ></operation-tree>
        </el-col>

        <el-col :span="12">
          <template-content ref="templateData" @upData="getDataList"></template-content>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import operationTree from "../operationTree";
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
    }
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
</style>
