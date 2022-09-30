<template>
  <!--派发联系人-->
    <el-dialog title="派发联系人" class="" :visible.sync="invitedToJoinVisible" style="overflow: auto;
  zoom: 1;" width="565px">
        <el-table :data="invitedToJoinList" @selection-change="invitedToJoinSelectionChange" @current-change='oneSelect' ref="Table">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="姓名" align="center"></el-table-column>
        <el-table-column property="mobile1" label="手机" align="center"></el-table-column>
        <el-table-column property="email" label="邮箱" align="center"></el-table-column>
      </el-table>
      <div style="margin-left:70%;margin-top:20px;">
        <el-button type="primary" @click="sendInvitedMessage()">确定</el-button>
        <el-button @click="invitedToJoinVisible=false">取消</el-button>
      </div>

    </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      invitedToJoinList:[],
      invitedToJoinVisible:false,
      selectInvitedToJoinList: [],
    };
  },

  methods: {
    // 新增人员
    init(boolean) {
        this.invitedToJoinList = []
      var that = this
      this.invitedToJoinVisible = boolean
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/listByPlatformId'),
        method: 'GET',
        param: this.$http.adornParams()
      }).then((res) => {
        // console.log('invitedToJoin', res)
        if (res && res.data.code === 0) {
          res.data.data.forEach((item) => {
            if (item.openId) {
              that.invitedToJoinList.push(item)
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 增人员被勾选的表格
    invitedToJoinSelectionChange(val) {
       if (val.length > 1) {
        this.$refs.Table.clearSelection()
        this.$refs.Table.toggleRowSelection(val.pop())
      } else {
          this.selectInvitedToJoinList = [];
          // console.log("invitedToJoinSelectionChange", val);
          for (var i = 0; i < val.length; i++) {
            this.selectInvitedToJoinList.push(val[i].name);
            this.selectInvitedToJoinList.push(val[i].openId);
            this.selectInvitedToJoinList.push(val[i].id);
            this.toOrderData()
          }
        }
    },
    oneSelect(){
      this.$refs.Table.toggleRowSelection(val)
    },
    sendInvitedMessage() {
        this.invitedToJoinVisible = false;
    },
    toOrderData(){
        this.$emit('getOrderData',this.selectInvitedToJoinList)
    }
  }
};
</script>

<style lang="scss">
</style>
