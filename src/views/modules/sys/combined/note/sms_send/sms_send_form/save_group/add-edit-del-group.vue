<template>
  <div class="sms-tree">
    <el-dialog
      :title="form.name?'联系人分组修改':'联系人分组新增'"
      :visible.sync="dialogFormVisible"
      width="350px"
      top="18%"
      append-to-body
      center
    >
      <el-form ref="form" :model="form" label-width="82px">
        <el-form-item label="联系人分组">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分组">
          <el-select v-model="value" placeholder="请选择分组" @change="getId" width="100%">
            <el-option
              v-for="item in form.region"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body>
      <div style="background-color: #fffada;padding: 5px 20px;margin-bottom: 40px;">
        <p>该分组包含多个子分组和联系人，删除该分组将同时移除该分组相关联系人。</p>
      </div>

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
  name: "save_template",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        region: [],
        name: "",
        desc: ""
      },
      value: "",
      modifiedUserList: [],
      //  保存模板参数
      parentId: "",

      delGroupView: false,
      currentTreeId: []
    };
  },
  watch: {},
  mounted() {},
  methods: {
    getDataList(name) {
      this.form.name = name;
      this.dialogFormVisible = true;
      this.$http({
        url: this.$http.adornUrl("/message/messageGroup/listTree"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data.data)
          this.form.region = data.data;
          // console.log(this.form.region);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getId(value) {
      this.parentId = value;
    },
    onSubmit() {
      this.$http({
        url: this.$http.adornUrl("/message/messageGroup/saveMessageContactorGroup"),
        method: "post",
        data: this.$http.adornData({
          phone: '',
          parentId: this.parentId?this.parentId:0,
          name: this.form.name,
          userIds: '',
          messageGroup: [],
          mailGroup: [],
          id: -1,
        })
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$message({
            message: "保存分组成功",
            type: "success"
          });
          this.dialogFormVisible = false;
          //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
        } else {
          this.$message.error(data.msg);
        }
      });
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
            ids: this.currentTreeId
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

/deep/ .el-dialog__wrapper .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #01a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
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
}
</style>
