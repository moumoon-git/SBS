<template>
  <div class="sms-tree">
    <el-dialog :title="form.name?'联系人分组修改':'联系人分组新增'" :visible.sync="dialogFormVisible" width="350px" top="18%" append-to-body>
      <el-form ref="form" :model="form">
        <el-form-item label="联系人分组">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分组">
          <el-select v-model="value" placeholder="请选择分组" @change="getId" width="100%">
            <el-option v-for="item in form.region" :key="item.id" :label="item.name" :value="item.id" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <header class="serchWrap">
                <button @click="onSubmit">保存</button>
            </header>
        </el-form-item>
      </el-form>
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
      value: '',
      modifiedUserList: [],
      //  保存模板参数
      parentId: '',
    };
  },
  watch: {},
  mounted(){

  },
  methods: {
    getDataList(name) {
      this.form.name = name
      this.dialogFormVisible = true
      this.$http({
        url: this.$http.adornUrl('/message/messageGroup/listTree'),
        method: 'post'
      }).then(({ data }) => {
          if (data && data.code == 0) {
            //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data.data)
              this.form.region = data.data
              // console.log(this.form.region)  
          } else {
            this.$message.error(data.msg);
          }
      })
    },
    getId(value){
         this.parentId = value
    },
    onSubmit() {
      this.$http({
        url: this.$http.adornUrl('/message/messageGroup/saveMessageGroup'),
        method: 'post',
        data: this.$http.adornData({
            phone: '',
            content: '',
            parentId: this.parentId != ''?this.parentId:0,
            name: this.form.name
        })
      }).then(({ data }) => {
          if (data && data.code == 0) {
              this.$message({
                message: '保存分组成功',
                type: 'success'
              });
                this.dialogFormVisible = false
            //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
          } else {
            this.$message.error(data.msg);
          }
      })
    },
    
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.el-form-item{
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
 .el-select-dropdown__item{
        padding: 0 20px !important;
    }
   /deep/ .el-input{
        width: 310px;
    }
</style>
