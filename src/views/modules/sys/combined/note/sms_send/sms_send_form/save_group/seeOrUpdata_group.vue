<template>
  <div class="seeOrUpdata_template">
    <el-dialog title="存为短信分组" :visible.sync="dialogFormVisible" width="370px" center>
      <div style="display:flex;justify-content: center;margin-bottom:10px;">
        <div>已选择：</div>
        <div>
          <p>收信人数量：{{allSelectData.length}}</p>
        </div>
      </div>

      <el-form ref="form" :model="form" label-width="103px">
        <el-form-item label="短信分组名称">
          <el-input v-model="form.name" ></el-input>
        </el-form-item>
        <el-form-item style="margin:0;">
          <el-checkbox label="设置一级分组" name="type" v-model="form.choose"></el-checkbox>
        </el-form-item>
         <el-form-item label="所属分组" v-if="form.choose">
          <el-input v-model="form.group" @focus="innerDialogVisible=true"></el-input>
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
            show-checkbox
          ></el-tree>
        </el-scrollbar>

        <span slot="footer" class="dialog-footer">
          <el-button @click="innerDialogVisible = false" plain size="small">取 消</el-button>
          <el-button type="primary" @click="saveTree" size="small">确 定</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="saveGroup" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import operationTree from "./operationTree";
import groupContact from "./group_contact";
import { treeDataTranslate } from "@/utils";
export default {
  name: "seeOrUpdata_template",
  components: {
    "operation-tree": operationTree,
    "group-contact": groupContact
  },
  data() {
    return {
      dialogFormVisible: false,
      innerDialogVisible: false, //树形模态框
      list: [],
      listProps: {
        children: "children",
        label: "name"
      },

      checkedIds: [],//当前选中的id数组

      checkData: {},//当前选中树数据

      allSelectData: [],
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
      }
    };
  },
  watch: {
    'form.choose'(newV,oldV){
      if(newV) {
         this.$http({
            url: this.$http.adornUrl("/message/messageGroup/listTree"),
            method: "post"
        }).then(({ data }) => {
          if (data && data.code == 0) {
            data.data.splice(0, 0 , {id:0,name:'顶级分组节点'})
              console.log(
                "data.data++++++++++++++++++++++++++++++++++++++",
                data.data
              );
            // this.list = treeDataTranslate(data.data, "id");
            this.list = data.data
          }else {
            this.$message.error(data.msg);
          }
        });
      }
    }
  },
  mounted() {},
  methods: {
    getDataList(content, allSelectData, newAddresseeData, phone, userIds, mailGroup, SMSGroup) {
      this.phone = phone;
      this.userIds = userIds;
      this.allSelectData = allSelectData;
      this.newAddresseeData = newAddresseeData;
      // console.log('this.newAddresseeData++++++++++++++++++++++++++++++++++6+++++++++++++',this.newAddresseeData)
      this.mailGroup = mailGroup;
      this.SMSGroup = SMSGroup;

      this.dialogFormVisible = true;
      this.$http({
        url: this.$http.adornUrl("/message/messageGroup/listTree"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          // console.log(
          //   "data.data++++++++++++++++++++++++++++++++++++++",
          //   data.data
          // );
          this.modifiedUserList = treeDataTranslate(data.data, "id");
        }else {
          this.$message.error(data.msg);
        }
      });
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
    // 存为分组
    saveGroup(){
      this.$http({
        url: this.$http.adornUrl("/message/messageGroup/saveMessageContactorGroup"),
        method: "post",
        data: this.$http.adornData({
          phone: this.phone,
          parentId: this.checkData.id?this.checkData.id:0,
          name: this.form.name,
          userIds: this.userIds,
          messageGroup: this.SMSGroup.map(v=>v.id),
          mailGroup: this.mailGroup.map(v=>v.id),
          id: -1,
        })
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code == 0) {
          this.$message({
            message: "保存分组成功",
            type: "success"
          });
          //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
        }else {
          this.$message.error(data.msg);
        }
        this.dialogFormVisible = false;
      });
    }
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
.el-dialog--center .el-dialog__bo {
  padding: 12px 25px 0px;
}
/deep/ .el-form-item__content{
  margin-left: 103px;
}
</style>
