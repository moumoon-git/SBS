<template>
  <div>
    <el-dialog
      title="审核记录"
      :visible.sync="centerDialogVisible"
      width="900px"
      center
      custom-class="resetStyle"
    >
      <div v-for="item in detailData" :key="item.id" style="border-bottom: 1px dashed #ccc;padding: 10px 0;">
        <div style="display:flex;justify-content:space-between;">
          <div style="width: 20%" class="hide">
            审核状态：
            <span
              :style="{color:item.lockStatusString==='已审核'?'#0BD295':(item.lockStatusString==='待审核'?'#F2B626':'#F85B47')}"
            >{{item.lockStatusString}}</span>
          </div>
          <div style="width: 25%" class="hide">登记时间：{{item.registerTime}}</div>
          <div style="width: 25%" class="hide">审核时间：{{item.gmtCreate?item.gmtCreate:'-'}}</div>
        </div>
        <div style="width: 100%;">审核备注：{{item.lockReason?item.lockReason:'-'}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      centerDialogVisible: false,
      detailData: [
        {
          id: 0,
          lockStatusString: "待审核",
          gmtCreate: "2020-03-10 16:00:00",
          lockTime: "",
          lockReason: "弱智"
        },
        {
          id: 1,
          lockStatusString: "已审核",
          gmtCreate: "2020-03-10 16:00:00",
          lockTime: "2020-03-10 17:00:00",
          lockReason: "亚麻跌"
        }
      ]
    };
  },
  methods: {
    init(type,registerId) {
        this.centerDialogVisible = true
         this.$http({
            url: this.$http.adornUrl("/register/registerOperateHistory/listByRegisterId"),
            method: "get",
            params: this.$http.adornParams({
            type,
            registerId,
            })
        }).then(({ data }) => {
            console.log(data);
            if (data.code == 0) {
              this.detailData = data.data
            } else {
            this.$message.error(data.msg);
            }
        });
    }
  }
};
</script>

<style lang="scss" scpoed>
s p {
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