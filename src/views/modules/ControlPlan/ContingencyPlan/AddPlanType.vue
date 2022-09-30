<template>
  <div class="seeOrUpdata_template">
    <el-dialog :title="saveOrEditData?'编辑分组':'新增分组'" :visible.sync="dialogFormVisible" width="370px" center>
      <el-form ref="form" :model="form" label-width="97px">
        <el-form-item label="分组名称">
          <el-input v-model="form.name" ></el-input>
        </el-form-item>
         <!-- <el-form-item style="margin:0;">
          <el-checkbox label="设置二级分组" name="type" v-model="form.choose"></el-checkbox>
        </el-form-item>
         <el-form-item label="所属分组" v-if="form.choose">
          <el-input v-model="form.group" @focus="initTree"></el-input>
        </el-form-item>  -->
        <el-form-item
          label="所属分组"
        >
          <sv-select-group
            v-model="form.group"
            :name="groupName"
            api="incidentplan/rpPlanGroup/listTree"
          />
        </el-form-item>
      </el-form>

      <el-dialog
        title="请选择所属分组"
        :visible.sync="innerDialogVisible"
        width="30%"
        center
        append-to-body>
        
        <el-scrollbar
          wrap-class="list"
          wrap-style="color: red;max-height:572px;"
          view-class="view-box"
          :native="false"
        >
          <el-tree
            class="treeGroup" 
            draggable
            :default-expand-all="false"
            :data="list"
            :props="listProps"
            :default-checked-keys="checkedIds"
            node-key="id" 
            style="padding-top: 10px;"
            current-node-key
            highlight-current
            @node-click="handleNodeClick"
            ref="tree"
          ></el-tree>
        </el-scrollbar>

        <span slot="footer" class="dialog-footer">
          <el-button @click="innerDialogVisible = false" plain size="small">取 消</el-button>
          <el-button type="primary" @click="saveTree" size="small">确 定</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="saveOrEditHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body>

      <p style="text-align:center;">是否删除该分组?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  name: "seeOrUpdata_template",
  data() {
    return {
      groupName: '', // 分组名称
      dialogFormVisible: false,
      innerDialogVisible: false, //树形模态框
      list: [],
      listProps: {
        children: "children",
        label: "name"
      },

      checkedIds: [],//当前选中的id数组

      checkData: {},//当前选中树数据

      value: [],
      newAddresseeData: [],
      // 为保存分组提供参数
      phone: "",
      userIds: "",
      mailGroup: [],

      form: {
        name: "",
        region: "",
        choose: "",
        group: "",
      },

      saveOrEditData: {},//判断新增或编辑

      delGroupView: false,//删除分组视图
    };
  },
  watch: {
    'form.choose'(newV,oldV){
      if(newV) {
         
      }
    }
  },
  mounted() {},
  methods: {
    // 加载树形
    initTree(){
      this.innerDialogVisible = true
      this.$http({
            url: this.$http.adornUrl("/incidentplan/rpPlanGroup/listTree"),
            method: "post"
        }).then(({ data }) => {
          if (data && data.code == 0) {
            // console.log(
            //   "data.data++++++++++++++++++++++++++++++++++++++",
            //   data.data
            // );
            this.list = treeDataTranslate(data.data, "id");
          } else {
            this.$message.error(data.msg)
          }
        });
    },
    getDataList(obj) {
      console.log(obj)
      this.saveOrEditData = obj;
      this.form.name = obj ? obj.name : '';
      this.groupName = obj ? obj.parentName : '';
      this.form.group = obj ? obj.parentId : 0;
      this.dialogFormVisible = true;
      this.list = this.$root.modifiedUserList;
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      this.checkData = obj
    },
    // 关闭弹窗
    dialog() {
      this.dialogFormVisible = false;
    },
    // 保存树
    saveTree(){
      // console.log(this.checkData)
      this.innerDialogVisible = false
      if(this.checkData){
        this.form.group = this.checkData.name
      }
    },
    // 新增或编辑分组
    saveOrEditHandle(){
        this.dialogFormVisible = false
      // this.$emit("saveOrEditGroup",this.saveOrEditData,this.checkData.id,this.form.name)
      this.$emit("saveOrEditGroup",this.saveOrEditData,this.form.group,this.form.name)
    },
// 新增或编辑分组
//     saveOrEditHandle(){
//         this.dialogFormVisible = false
//       this.$emit("saveOrEditGroup",this.saveOrEditData,this.checkData.id,this.form.name)
// rue;
//       this.currentTreeId = currentTreeId;
//     },
    // 删除分组
    delView(currentTreeId) {
      this.delGroupView = true;
      // this.currentTreeId = currentTreeId;
    },
    // 执行删除试图
    delGroupHandle() {
        this.$emit("delGroup")
        this.delGroupView = false
    },
   
  }
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
}
.name {
  outline: none;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 65%;
}
/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #00a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    text-align: center !important;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
  /deep/ .el-dialog--center .el-dialog__body {
    // padding: 15px 0;
    padding: 10px 18px 30px;
  }
  /deep/.el-button--primary {
    background-color: #00a9f2;
    border: 1px solid #00a9f2;
  }
}
</style>
