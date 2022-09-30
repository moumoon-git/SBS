<template>
  <div>
    <el-dialog :title="'批量' + title + (title=='驳回'?'申请':'审核')" :visible.sync="centerDialogVisible" width="480px" center custom-class="resetStyle">
      <div>
          <div style="background-color:#f0f0f0">
            <div style="display:flex;justify-content:space-between;">
                <p>已选择企业数：{{this.ids.length}}</p>
                <p>可{{title}}企业数：{{title=='驳回'?rejectData.length:revokeData.length}}</p>
                <p>无法{{title}}企业数：{{this.ids.length - (title=='驳回'?rejectData.length:revokeData.length)}}</p>
            </div>
            <div style="font-size: 12px;color: #999; ">注：仅可对{{title=='驳回'?'待审核、重新提交':'审核'}}状态下的企业进行{{title=='驳回'?'申请':'审核'}}操作，请谨慎操作！</div>
          </div>
          <div style="display:flex;margin-top:10px;">
              <p style="width:100px;">审核备注：</p> 
              <el-input type="textarea" v-model="remark" rows="3" resize="none"></el-input>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button @click="sureReset">{{title}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      centerDialogVisible: false,
      title: '',
      remark: '',
      ids: [],
      checkCode: '',
      revokeData: [],// 所有撤销数据
      rejectData: [],// 所有驳回数据
    };
  },
  methods: {
    init(title,ids,checkCode){
        // console.log('ids: ', ids);  
        this.rejectData = []
        this.revokeData = []
        this.title = title
        this.ids = ids
        this.checkCode = checkCode
        this.centerDialogVisible = true

        if (this.title == '驳回') {
            this.ids.map(v=>{
                // console.log(v.lockStatusString)
                if (v.lockStatusString=='待审核' || v.lockStatusString=='重新提交') {
                    this.rejectData.push(v.id)
                }
            })
        }else{
            this.ids.map(v=>{
                if (v.lockStatusString=='已审核') {
                    this.revokeData.push(v.id)
                }
            })
        }
    },
    sureReset() {
        this.$http({
        url: this.$http.adornUrl(`/buss/bussRegister/updateLockStatusPL`),
        method: "post",
        data: {
          messageCode: this.checkCode,
          lockStatus: this.title =='驳回'?-2:-3,
          ids: this.title =='驳回'?this.rejectData:this.revokeData,
          lockReason: this.remark
        }
      }).then(({ data }) => {
        // console.log("/upload/platformImages",data)
        if (data && data.code === 0) {
          this.$message({
            type: "success",
            message: this.title +'成功',
            duration: 1500,
            onClose: () => {
                this.$emit('getDataList')
            }
          });
        } else {
          this.$message.error(data.msg);
        }   
      });
    },
  }
};
</script>

<style lang="scss" scpoed>
p {
  margin: 0;
}
.el-dialog {
  border-radius: 10px;
  .el-dialog__header {
    background-color: rgba(241, 244, 246, 1) !important;
    border-radius: 8px 8px 0 0;
    padding: 15px 0 15px 20px !important;
    font-weight: initial !important;
    .el-dialog__headerbtn {
      top: 14px;
    }
    span {
      color: #333333;
    }
  }
  .el-dialog__body {
    padding: 10px 10px 20px 20px;
  }
}
</style>