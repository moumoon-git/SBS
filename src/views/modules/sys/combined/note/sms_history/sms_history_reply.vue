<template>
  <div>
    <el-dialog title="回复历史" :visible.sync="centerDialogVisible" width="450px" center>
      <el-timeline style="height:400px;overflow:auto;">
        <el-timeline-item v-for="item in replyData" :key="item.id" :timestamp="item.motime" placement="top">
          <el-card>
            <h4>手机号码：{{item.phone}}</h4>
            <p>回复内容：{{item.content}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      replyData: []
    };
  },
  methods:{
      init(replyDesc){
          this.replyData = [...replyDesc]
          this.centerDialogVisible = true
      }
  }
};
</script>

<style lang="scss" scoped>
</style>