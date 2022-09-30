<template>
  <div >
      <el-dialog
  title="草稿"
  :visible.sync="centerDialogVisible"
  :close-on-click-modal="false"
  width="1000px"
  background-color='lightblue'
  center
  class="dialog"

  >
    <el-row>
        <el-col :span='8'>
            <!-- 草稿页面 -->
          <sms-send-draft-tree 
             :list="modifiedUserList"
            :listProps="modifiedUserProps"
          ></sms-send-draft-tree>
        </el-col>
        <el-col :span='16'>

        </el-col>
    </el-row>
</el-dialog>
  </div>
</template>

<script>
import smsSendDraftTree from "./sms_send_draft_tree";
import { treeDataTranslate } from "@/utils";

  export default {
    data () {
      return {
          centerDialogVisible:false,
          modifiedUserProps: {
            children: "children",
            label: "name"
          },
          modifiedUserList:[],
      }
    },
    components: {
      'sms-send-draft-tree':smsSendDraftTree
    },
    computed: {
      

    },
    created () {
      this.smsDraftViewHandle()
    },
    mounted () {

    },
    methods: {
       init(content,value,newAddresseeData){
         if (value == "" && newAddresseeData.length == 0) {
          this.$message.error("请添加收信人手机号码");
        } else if (content == "") {
          this.$message.error("请填写内容");
        } else {
          this.centerDialogVisible = true;
        }
         
      },
         // 草稿树型
    smsDraftViewHandle(){
      this.$http({
          url:this.$http.adornUrl('/message/messagedraft/listdarft'),
          method:'post',
        }).then((data)=>{
          // console.log(data)
          if (data.code === 0) {
            this.modifiedUserList = treeDataTranslate(data.data.data, 'id')
            // console.log(this.modifiedUserList)
          }else {
            this.$message.error(data.msg);
          }
        })
    }
    }
  }
</script>
<style lang="scss" scoped>
*{
    padding: 0;
    margin: 0;
}

    .operation{
        list-style: none;
        height: 40px;
        background-color: #ccc;
        margin-bottom: 10px;
    }
</style>
