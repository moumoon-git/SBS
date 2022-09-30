<template>
  <div class="sms-tree">
    <el-dialog title="短信模板新增" :visible.sync="dialogFormVisible" width="350px" z-index='1' top="18%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="模板名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="选择分组">
          <el-select v-model="value" placeholder="请选择分组" @change="getId">
            <el-option v-for="item in form.region" :key="item.id" :label="item.name" :value="item.id">
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
    getDataList() {
        this.dialogFormVisible = true
      this.$http({
        url: this.$http.adornUrl('/message/messagetemple/listtemple'),
        method: 'post'  
      }).then(({ data }) => {
          if (data && data.code == 0) {
            //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data.data)
              data.data.splice(0, 0, {id:0,name:'顶级分组节点'})
              this.form.region = treeDataTranslate(data.data, 'id')
          }else {
            this.$message.error(data.msg);
          }
      })
    },
    getId(value){
         this.parentId = value
    },
    onSubmit() {
      if (this.form.name == "") {
        this.$message({
          message: '请输入模板名',
          type: 'error'
        });
      }else{
        this.$http({
          url: this.$http.adornUrl('/message/messagetemple/savetemple'),
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
                  message: '保存模板成功',
                  type: 'success'
                });
                this.dialogFormVisible = false
                this.form.name = ''
                this.value = ''
                this.$emit('refreshData')
              //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
            }else {
              this.$message.error(data.msg);
            }
        })
      }
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
</style>
